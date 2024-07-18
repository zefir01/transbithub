using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Google.Protobuf;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Protos.TradeApi.V1;
using Shared;
using Telegram.Bot;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.InputFiles;
using TelegramService.Entitys;
using TelegramService.Services;
using TelegramImage = TelegramService.Entitys.TelegramImage;

namespace TelegramService.Model
{
    public class ImageLoader
    {
        private readonly IServiceProvider provider;
        private readonly GrpcClients clients;
        private readonly TelegramBotClient botClient;
        private readonly Localization.ImageLoader s;
        private readonly ConcurrentDictionary<Guid, DateTime> waiting = new ConcurrentDictionary<Guid, DateTime>();
        private readonly Queue queue;
        private readonly Task workerTask;
        private readonly ILogger<ImageLoader> logger;

        public ImageLoader(IServiceProvider provider, TelegramBotClient botClient, IMenu menu, Queue queue,
            TelegramState state, CancellationToken cancellationToken)
        {
            this.provider = provider;
            logger = provider.GetRequiredService<ILogger<ImageLoader>>();
            clients = queue.GrpcClients;
            this.botClient = botClient;
            this.queue = queue;
            s = new Localization.ImageLoader(menu);
            if (state != null)
                waiting = new ConcurrentDictionary<Guid, DateTime>(
                    state.WaitingImages.ToDictionary(p => p.Id, p => p.CreatedAt));
            workerTask = Worker(cancellationToken);
        }

        public static bool IsImage(Message message)
        {
            if (message.Type == MessageType.Photo)
                return true;
            if (message.Type == MessageType.Document && (message.Document.MimeType.Contains("jpeg") ||
                                                         message.Document.MimeType.Contains("png")))
                return true;
            return false;
        }

        private string ExtractFileId(Message message)
        {
            string fileId;
            switch (message.Type)
            {
                case MessageType.Photo:
                {
                    var photoSize = message.Photo.OrderByDescending(p => p.Height * p.Width).First();
                    fileId = photoSize.FileId;
                    break;
                }
                case MessageType.Document when !message.Document.MimeType.Contains("jpeg") &&
                                               !message.Document.MimeType.Contains("png"):
                    throw new UserException("Only jpeg and png are available");
                case MessageType.Document:
                    fileId = message.Document.FileId;
                    break;
                default:
                    throw new UserException("Message does not contain image.");
            }

            return fileId;
        }

        public async Task<(Result result, int? id)> OutPhoto(Result result,
            CancellationToken cancellationToken = default)
        {
            logger.LogDebug("OutPhoto");
            if (result.Photo == null)
                return (result, null);
            if (result.Photo.Data != null)
            {
                logger.LogDebug("Uploading photo to telegram.");
                //загрузка в телегу без кэширования
                var ms = new MemoryStream(result.Photo.Data);
                var file = new InputOnlineFile(ms);
                result.Photo.TgmFile = file;
                var msg = await botClient.SendPhotoAsync(queue.TgmUserId, result.Photo.TgmFile, result.Message,
                    ParseMode.Html,
                    replyMarkup: result.Keyboard, cancellationToken: cancellationToken);
                logger.LogDebug($"Photo uploaded: msg={msg.MessageId}");
                return (result, msg.MessageId);
            }

            if (waiting.ContainsKey(result.Photo.Id))
            {
                logger.LogDebug($"Waiting photo: id={result.Photo.Id}");
                return (new Result(result.Navigation,
                    s.Get(Localization.ImageLoader.Keys.Loading), result.Keyboard), null);
            }

            using var scope = provider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ITgmDbContext>();
            var image = await db.TelegramImages.FirstOrDefaultAsync(p => p.ImageId == result.Photo.Id,
                cancellationToken: cancellationToken);
            if (image != null)
            {
                logger.LogDebug($"Founded uploaded photo: image={image}");
                //уже в телеге
                try
                {
                    result.Photo.TgmFile = new InputOnlineFile(image.TelegramFileId);
                    var msg = await botClient.SendPhotoAsync(queue.TgmUserId, result.Photo.TgmFile, result.Message,
                        ParseMode.Html, replyMarkup: result.Keyboard, cancellationToken: cancellationToken);
                    logger.LogDebug($"Photo sent: image={image} mesg={msg.MessageId}");
                    return (result, msg.MessageId);
                }
                catch (Exception e)
                {
                    logger.LogError(e, $"Unable to sent cached photo: {image}");
                    logger.LogError("Hiding error and retry cache photo.");
                }
            }

            //загрузка в телегу с кэшированием
            try
            {
                logger.LogDebug($"Uploading and caching photo: id={result.Photo.Id}");
                var resp = await clients.TradeClient.GetImageAsync(new GetImageRequest
                {
                    Id = result.Photo.Id.ToString(),
                    IsPreview = false
                });
                var data = resp.Original.ToByteArray();
                var ms = new MemoryStream(data);
                var file = new InputOnlineFile(ms);
                result.Photo.TgmFile = file;
                var msg = await botClient.SendPhotoAsync(queue.TgmUserId, result.Photo.TgmFile, result.Message,
                    ParseMode.Html,
                    replyMarkup: result.Keyboard, cancellationToken: cancellationToken);
                logger.LogDebug($"Photo sent: msg={msg.MessageId} id={result.Photo.Id}");
                var ent = await db.TelegramImages.FirstOrDefaultAsync(p => p.ImageId == result.Photo.Id, cancellationToken: cancellationToken);
                if (ent != null)
                {
                    logger.LogDebug($"Founded existed image in db: ent={ent}");
                    db.TelegramImages.Remove(ent);
                    logger.LogDebug("Existed image removed: ent={ent}");
                }

                ent = new TelegramImage(result.Photo.Id, msg.Photo[0].FileId);
                logger.LogDebug($"Created new image entity: {ent}");
                logger.LogDebug($"Photo uploaded: id={result.Photo.Id} msg={msg.MessageId}");
                await db.TelegramImages.AddAsync(ent, cancellationToken);
                await db.SaveChangesAsync(cancellationToken);
                logger.LogDebug($"Photo cached: id={result.Photo.Id} msg={msg.MessageId}");
                return (result, msg.MessageId);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error in photo processing.");
                while (!waiting.TryAdd(result.Photo.Id, DateTime.Now) && !cancellationToken.IsCancellationRequested)
                    await Task.Delay(10, cancellationToken);
                return (new Result(result.Navigation,
                    s.Get(Localization.ImageLoader.Keys.Loading), result.Keyboard), null);
            }
        }

        public async Task<Guid?> PhotoIn(Message message, CancellationToken cancellationToken = default)
        {
            if (!IsImage(message))
                return null;
            string fileId = ExtractFileId(message);
            using var scope = provider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ITgmDbContext>();

            var tgmImage = await db.TelegramImages.FirstOrDefaultAsync(p => p.TelegramFileId == fileId,
                cancellationToken: cancellationToken);
            if (tgmImage != null)
                return tgmImage.ImageId;
            var file = await botClient.GetFileAsync(fileId, cancellationToken);
            await using var ms = new MemoryStream();
            await botClient.DownloadFileAsync(file.FilePath, ms, cancellationToken);
            var arr = ms.ToArray();
            var guid = Guid.NewGuid();
            var req = new StoreImageRequest
            {
                Id = guid.ToString(),
                Data = ByteString.CopyFrom(arr)
            };
            await clients.TradeClient.StoreImageAsync(req);
            var telegramImage = new TelegramImage(guid, fileId);
            await db.TelegramImages.AddAsync(telegramImage, cancellationToken);
            await db.SaveChangesAsync(cancellationToken);
            return telegramImage.ImageId;
        }

        private async Task Worker(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                var d = waiting.ToDictionary(p => p.Key, p => p.Value);
                foreach (var pair in d)
                {
                    if (cancellationToken.IsCancellationRequested)
                        break;
                    try
                    {
                        var resp = await clients.TradeClient.GetImageAsync(new GetImageRequest
                        {
                            Id = pair.ToString(),
                            IsPreview = false
                        });
                        while (!waiting.TryRemove(pair.Key, out _) && !cancellationToken.IsCancellationRequested)
                            await Task.Delay(10, cancellationToken);
                        await queue.OnImageLoaded(pair.Key);
                    }
                    catch
                    {
                        if (pair.Value.AddMinutes(30) < DateTime.Now)
                            while (!waiting.TryRemove(pair.Key, out _) && !cancellationToken.IsCancellationRequested)
                                await Task.Delay(10, cancellationToken);
                    }
                }

                await Task.Delay(10000, cancellationToken);
            }
        }

        public Dictionary<Guid, DateTime> GetWaitingGuids()
        {
            return waiting.ToDictionary(p => p.Key, p => p.Value);
        }
    }
}