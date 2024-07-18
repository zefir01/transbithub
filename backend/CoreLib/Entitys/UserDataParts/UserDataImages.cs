using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Castle.Core.Internal;
using Microsoft.EntityFrameworkCore;
using Shared;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace CoreLib.Entitys.UserDataParts
{
    public partial class UserData
    {
        [Owned]
        public class UserDataImages
        {
            public UserDataImages(UserData user, DataDBContext db)
            {
                User = user;
                this.db = db;
            }

            public UserDataImages(DataDBContext db)
            {
                this.db = db;
            }

            public virtual UserData User { get; private set; }
            private DataDBContext db;

            public List<Image> GetImagesInternal(List<Guid> guids)
            {
                List<Image> images = new List<Image>();
                for (int i = 0; i < guids.Count; i++)
                {
                    var guid = guids[i];
                    var img = User.Images.FirstOrDefault(p => p.Id == guid);
                    if (img == null)
                    {
                        img = new Image(guid, User) {Order = i};
                        User.Images.Add(img);
                    }

                    images.Add(img);
                }

                return images;
            }


            private List<string> GetAccessIds(Guid id)
            {
                List<string> ids = new List<string>();
                var img = User.Images.FirstOrDefault(p => p.Id == id);
                if (img == null)
                    throw new UserException($"Image {id} not found.");
                if (img.DealMessage != null)
                {
                    ids.Add(img.DealMessage.Deal.Ad.Owner.UserId);
                    ids.Add(img.DealMessage.Deal.Initiator.UserId);
                }

                if (img.ConversationMessage != null)
                {
                    ids.Add(img.ConversationMessage.Conversation.Buyer.UserId);
                    ids.Add(img.ConversationMessage.Conversation.Seller.UserId);
                }

                if (img.Invoice != null)
                {
                    ids.Add(img.Invoice.Owner.UserId);
                    if (img.Invoice.IsPrivate)
                        ids.Add(img.Invoice.TargetUser.UserId);
                }

                if (img.Secret != null)
                {
                    ids.Add(img.Secret.Payment.Owner.UserId);
                    ids.Add(img.Secret.Payment.Invoice.Owner.UserId);
                }

                return ids;
            }

            public async Task<Entitys.Image> StoreImage(Guid imageId, byte[] data,
                CancellationToken cancellationToken = default)
            {
                const float maxSize = 300;
                if (User.Images.Any(p => p.Id == imageId && !p.IsEmpty))
                    throw new UserException("Image already exist.");

                var img = User.Images.FirstOrDefault(p => p.Id == imageId);
                if (img == null)
                {
                    img = new Entitys.Image(imageId, User);
                    User.Images.Add(img);
                }

                try
                {
                    using var image = SixLabors.ImageSharp.Image.Load<Rgba32>(data);
                    float resizeFactor;
                    if (image.Size().Height > image.Size().Width)
                        resizeFactor = maxSize / image.Size().Height;
                    else
                        resizeFactor = maxSize / image.Size().Width;
                    int newHeight = (int) Math.Round(image.Size().Height * resizeFactor);
                    int newWidth = (int) Math.Round(image.Size().Width * resizeFactor);
                    image.Mutate(x => x.Resize(newWidth, newHeight));
                    image.Metadata.ExifProfile = null;
                    await using MemoryStream stream = new MemoryStream();
                    await image.SaveAsPngAsync(stream, cancellationToken: cancellationToken);
                    img.SetContent(data, stream.ToArray());
                }
                catch (Exception)
                {
                    throw new UserException("Image error.");
                }


                var accessIds = GetAccessIds(imageId);
                accessIds.Remove(User.UserId);
                foreach (var id in accessIds)
                {
                    var target =
                        await db.UserDatas.FirstOrDefaultAsync<UserData>(p => p.UserId == id,
                            cancellationToken: cancellationToken);
                    var evt = new UserEvent
                    {
                        Source = db.SourceType,
                        Creater = User,
                        Receiver = target,
                        Type = UserEventTypes.ImageStored,
                        ImageId = img.Id
                    };
                    db.Retranslator.Send(evt);
                }

                return img;
            }

            private static readonly Func<DataDBContext, Guid, bool, IQueryable<bool>> isImageExist =
                (db, id, allowEmpty) => from m in db.Images
                    where m.Id == id
                          && (allowEmpty || !m.IsEmpty)
                    select true;

            private static readonly Func<DataDBContext, Guid, IQueryable<Entitys.Image>> imgQuery =
                (db, id) => from i in db.Images
                    where !i.IsEmpty && i.Id == id
                    select i;

            private static readonly Func<DataDBContext, Guid, IQueryable<string>> getImageAccessIds =
                (db, id) => (from i in imgQuery(db, id)
                        where i.DealMessage != null
                        select i.DealMessage.Deal.Ad.Owner.UserId)
                    .Union(from i in imgQuery(db, id)
                        where i.DealMessage != null
                        select i.DealMessage.Deal.Initiator.UserId)
                    .Union(from i in imgQuery(db, id)
                        where i.ConversationMessage != null
                        select i.ConversationMessage.Conversation.Buyer.UserId)
                    .Union(from i in imgQuery(db, id)
                        where i.ConversationMessage != null
                        select i.ConversationMessage.Conversation.Seller.UserId)
                    .Union(from i in imgQuery(db, id)
                        where i.Invoice != null
                        select i.Invoice.Owner.UserId)
                    .Union(from i in imgQuery(db, id)
                        where i.Invoice != null && i.Invoice.IsPrivate
                        select i.Invoice.TargetUser.UserId)
                    .Union(from i in imgQuery(db, id)
                        where i.Secret != null
                        select i.Secret.Payment.Owner.UserId)
                    .Union(from i in imgQuery(db, id)
                        where i.Secret != null
                        select i.Secret.Payment.Invoice.Owner.UserId)
                    .Where(p => p != null).Distinct();

            private static readonly Func<DataDBContext, Guid, IQueryable<bool>> ifAccessGranted =
                (db, imageId) => from access in (from ids in getImageAccessIds(db, imageId)
                            select db.User.UserId == ids)
                        .Union(from img in imgQuery(db, imageId)
                            where img.Invoice != null && !img.Invoice.IsPrivate
                            select true)
                    where access
                    select true;

            public async Task<Entitys.Image> GetImage(Guid id, bool allowEmpty, CancellationToken cancellationToken)
            {
                var isExist = await isImageExist(db, id, allowEmpty)
                    .AnyAsync(cancellationToken: cancellationToken);
                if (!isExist)
                    throw new UserException("Image not found.");

                //var ids = getImageAccessIds(db, id).ToList();
                bool access;
                if (db.User.IsSupport)
                {
                    access = db.Deals.Where(p => p.Status == DealStatus.Disputed).SelectMany(p => p.Messages)
                        .SelectMany(p => p.Images).Select(p => p.Id).Contains(id);
                }
                else
                {
                    access = await ifAccessGranted(db, id)
                        .AnyAsync(cancellationToken: cancellationToken);
                }

                if (!access)
                    throw new UserException("Image not found.");
                var img = await db.Images.FirstAsync(p => p.Id == id, cancellationToken: cancellationToken);
                return img;
            }
        }
    }
}