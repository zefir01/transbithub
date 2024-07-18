using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using Auth.Protos.Internal;
using Castle.Core.Internal;
using CoreLib;
using CoreLib.Entitys;
using CoreLib.Entitys.Invoices;
using CoreLib.Entitys.LN;
using CoreLib.Services;
using CoreLib.Services.Exceptions;
using Dawn;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Grpc.Net.Client;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NBitcoin;
using Protos.TradeApi.V1;
using Shared;
using Shared.Protos;
using Advertisement = Protos.TradeApi.V1.Advertisement;
using Conversation = Protos.TradeApi.V1.Conversation;
using Deal = Protos.TradeApi.V1.Deal;
using Enum = System.Enum;
using GetUserInfoRequest = Protos.TradeApi.V1.GetUserInfoRequest;
using Image = Protos.TradeApi.V1.Image;
using Invoice = Protos.TradeApi.V1.Invoice;
using InvoicePayment = Protos.TradeApi.V1.InvoicePayment;
using InvoiceSecret = CoreLib.Entitys.Invoices.InvoiceSecret;
using LNInvoice = CoreLib.Entitys.LN.LNInvoice;
using Validators = CoreLib.Services.Validators;

namespace Backend.Services
{
    [Authorize(Policy = "trade")]
    public class Trade : TradeApi.TradeApiBase
    {
        private readonly ILogger<Trade> logger;
        private readonly Config config;
        private readonly VariablesRetranslator variablesRetranslator;
        private readonly RetranslatorBuffer retranslator;
        private readonly DataDBContext db;
        private readonly LndClient lndClient;

        public Trade(ILogger<Trade> logger, Config config,
            VariablesRetranslator variablesRetranslator, RetranslatorBuffer retranslator, DataDBContext db,
            LndClient lndClient)
        {
            this.logger = logger;
            this.config = config;
            this.variablesRetranslator = variablesRetranslator;
            this.retranslator = retranslator;
            this.db = db;
            this.lndClient = lndClient;
        }

        public override async Task<Advertisement> CreateAdvertisement(AdvertisementData request,
            ServerCallContext context)
        {
            try
            {
                var ad = request.ToData();
                Validators.Argument(ad.MinAmount, nameof(ad.MinAmount)).GreaterThan(0);
                if (ad.IsBuy)
                    Validators.Argument(ad.MaxAmount, nameof(ad.MaxAmount)).GreaterThan(ad.MinAmount);
                Validators.Argument((int) ad.Window, nameof(ad.Window)).InRange(15, 90);
                if (ad.AutoPriceDelay.HasValue)
                    Validators.Argument(ad.AutoPriceDelay, nameof(ad.AutoPriceDelay)).InRange(10, 3600);
                if (ad.IsBuy && (request.LnFunding || request.LnDisableBalance))
                    throw new UserException("Ln can be enabled only on sell ads.");
                var ads = db.User.AdsData.CreateAd(ad);
                await db.SaveChangesAsync(context.CancellationToken);
                return ads.ToPb(db.User.UserId);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }


        public override Task<FindAdvertisementsResponse> GetMyAdvertisements(Empty request, ServerCallContext context)
        {
            try
            {
                var ads = db.User.Advertisements.Where(p => !p.IsDeleted).ToList();
                var ret = new FindAdvertisementsResponse();
                foreach (var ad in ads)
                    ret.Advertisements.Add(ad.ToPb(db.User.UserId));

                return Task.FromResult(ret);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Advertisement> GetAdvertisementsById(
            GetAdvertisementsByIdRequest request, ServerCallContext context)
        {
            try
            {
                var ad = await db.User.AdsData.GetAdById((long) request.Id);
                return ad.ToPb(db.User.UserId);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override Task<Advertisement> GetMyAdvertisementsById(
            GetAdvertisementsByIdRequest request, ServerCallContext context)
        {
            try
            {
                var ad = db.User.Advertisements.FirstOrDefault(p => p.Id == (long) request.Id && !p.IsDeleted);
                return Task.FromResult(ad.ToPb(db.User.UserId));
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }


        public override async Task<Advertisement> ModifyAdvertisement(ModifyAdvertisementRequest request,
            ServerCallContext context)
        {
            try
            {
                var adData = request.Data.ToData();
                Validators.Argument(adData.MinAmount, nameof(adData.MinAmount)).GreaterThan(0);
                if (adData.IsBuy)
                    Validators.Argument(adData.MaxAmount, nameof(adData.MaxAmount))
                        .GreaterThan(adData.MinAmount);
                Validators.Argument((int) adData.Window, nameof(adData.Window)).InRange(15, 90);
                if (adData.AutoPriceDelay.HasValue)
                    Validators.Argument(adData.AutoPriceDelay, nameof(adData.AutoPriceDelay)).InRange(10, 3600);
                if (adData.IsBuy && (request.Data.LnFunding || request.Data.LnDisableBalance))
                    throw new UserException("Ln can be enabled only on sell ads.");

                var ad = db.User.Advertisements
                    .FirstOrDefault(p => p.Id == (long) request.AdvertisementId && !p.IsDeleted);
                if (ad == null)
                    throw new UserException("Ad not found.");
                await ad.Modify(adData);
                await db.SaveChangesAsync(context.CancellationToken);
                return ad.ToPb(db.User.UserId);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Empty> DeleteAdvertisement(DeleteAdvertisementRequest request,
            ServerCallContext context)
        {
            try
            {
                var id = (long) request.Id;
                db.User.AdsData.RemoveAd(id);
                await db.SaveChangesAsync(context.CancellationToken);
                return new Empty();
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<ChangeAdvertisementStatusResponse> ChangeAdvertisementStatus(
            ChangeAdvertisementStatusRequest request, ServerCallContext context)
        {
            try
            {
                var ad = await db.User.AdsData.ChangeStatus((long) request.AdvertisementId, request.IsEnabled);
                await db.SaveChangesAsync(context.CancellationToken);
                return new ChangeAdvertisementStatusResponse
                {
                    CurrentStatus = ad.Metadata.Status.ToPb()
                };
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<FindAdvertisementsResponse> FindAdvertisements(FindAdvertisementsRequest request,
            ServerCallContext context)
        {
            try
            {
                IList<CoreLib.Entitys.Advertisement> ads;
                if (string.IsNullOrEmpty(request.UserId))
                {
                    var country = Enum.Parse<Catalog.Countries>(request.Country);
                    var currency = Enum.Parse<Catalog.Currencies>(request.Currency);
                    var paymentType = Enum.Parse<Catalog.PaymentTypes>(request.PaymentType);
                    decimal? fiatAmount = null;
                    if (request.FiatAmount.FromPb() != default)
                        fiatAmount = request.FiatAmount.FromPb();
                    decimal? cryptoAmount = null;
                    if (request.CryptoAmount.FromPb() != default)
                        cryptoAmount = request.CryptoAmount.FromPb();
                    var isBuy = request.IsBuy;
                    var take = (int) request.Take;
                    var skip = (int) request.Skip;
                    Validators.Argument(take, nameof(take)).Max(100);
                    ads = await db.User.AdsData.FindAds(fiatAmount, cryptoAmount, isBuy, country, currency,
                        paymentType, skip, take, context.CancellationToken);
                }
                else
                {
                    Validators.Argument(request.UserId, nameof(request.UserId)).GuidValidate();
                    ads = await db.User.AdsData.GetAdsByOwner(request.IsBuy, request.UserId);
                }

                await db.SaveChangesAsync(context.CancellationToken);
                var resp = new FindAdvertisementsResponse();
                resp.Advertisements.AddRange(ads.Select(p => p.ToPb(db.User.UserId)));
                return resp;
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<GetUserInfoResponse> GetUserInfo(GetUserInfoRequest request,
            ServerCallContext context)
        {
            try
            {
                var userData =
                    await db.UserDatas.FirstOrDefaultAsync(p => p.UserId == request.Id, context.CancellationToken);
                if (userData == null)
                    throw new UserException("User not found.");
                return new GetUserInfoResponse
                {
                    UserInfo = userData.ToPb()
                };
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task SubscribeAdvertisementChanges(GetAdvertisementsByIdRequest request,
            IServerStreamWriter<SubscribeAdvertisementChangesResponse> responseStream,
            ServerCallContext context)
        {
            try
            {
                await retranslator.RegisterStream(responseStream, context.CancellationToken, db.User.UserId,
                    (long) request.Id);
            }
            catch (TaskCanceledException e) when (e.CancellationToken == context.CancellationToken)
            {
            }
            catch (OperationCanceledException e) when (e.CancellationToken == context.CancellationToken)
            {
            }
            catch (Exception e)
            {
                e.HideException(logger);
            }
        }

        public override async Task<Deal> CreateDeal(CreateDealRequest request, ServerCallContext context)
        {
            try
            {
                var advertisementId = (long) request.AdvertisementId;
                decimal? fiatAmount = null;
                decimal? cryptoAmount = null;
                switch (request.AmountCase)
                {
                    case CreateDealRequest.AmountOneofCase.None:
                        break;
                    case CreateDealRequest.AmountOneofCase.FiatAmount:
                        fiatAmount = request.FiatAmount.FromPb();
                        break;
                    case CreateDealRequest.AmountOneofCase.CryptoAmount:
                        cryptoAmount = request.CryptoAmount.FromPb();
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }

                var sellPromise = request.SellPromise;
                var buyPromise = request.BuyPromise;
                var promisePassword = request.PromisePassword;
                Validators.Argument(sellPromise, nameof(sellPromise)).MaxLength(3000);
                Validators.Argument(promisePassword, nameof(promisePassword)).MaxLength(100);


                var ad = await db.User.AdsData.GetAdById(advertisementId);

                if (!sellPromise.IsNullOrEmpty() && !ad.IsBuy)
                    throw new UserException("Impossible to sell Promise by selling ad.");
                if (buyPromise && ad.IsBuy)
                    throw new UserException("Impossible to buy Promise by buying ad.");
                if (!request.BtcWallet.IsNullOrEmpty() && ad.IsBuy)
                    throw new UserException("Impossible to iut to external wallet by buying ad.");

                CoreLib.Entitys.Deal deal;
                if (!sellPromise.IsNullOrEmpty())
                {
                    var promise = await Promise.GetPromise(request.SellPromise, request.PromisePassword, db);
                    deal = await ad.CreateDeal(fiatAmount, cryptoAmount, request.BtcWallet, promise: promise);
                }
                else if (buyPromise)
                {
                    if (fiatAmount.HasValue && !cryptoAmount.HasValue)
                        cryptoAmount = Math.Round(fiatAmount.Value / ad.Metadata.Price, 8);
                    else if (cryptoAmount.HasValue)
                        cryptoAmount = cryptoAmount.Value;
                    else
                        throw new UserException("Amount required.");

                    var promise = new Promise(db, cryptoAmount.Value, request.PromisePassword, db.User);
                    deal = await ad.CreateDeal(fiatAmount, cryptoAmount, request.BtcWallet, promise: promise);
                }
                else
                {
                    deal = await ad.CreateDeal(fiatAmount, cryptoAmount, request.BtcWallet);
                }

                await db.SaveChangesAsync(context.CancellationToken);
                return deal.ToPb(db.User.UserId, true);
            }
            catch (AlreadyCreatedException e) when (e.Deal != null)
            {
                throw new UserException(
                    "You already create deal for this ad. To create new deal, complete or cancel previous deal.");
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Deal> CreateDealLnBuy(CreateDealLnBuyRequest request, ServerCallContext context)
        {
            try
            {
                if (db.User.IsAnonymous)
                    throw new UserException("This function available only for authorized users.");
                Validators.Argument(request.LnInvoice, nameof(request.LnInvoice)).MaxLength(3000);
                var ad = await db.User.AdsData.GetAdById((long) request.AdvertisementId);
                if (ad.IsBuy)
                    throw new UserException("Ad is not sell type.");
                var deal = await ad.CreateDealLnBuy(request.LnInvoice,
                    request.FiatAmount.FromPb()==0 ? null : request.FiatAmount.FromPb(),
                    request.CryptoAmount.FromPb()==0 ? null : request.CryptoAmount.FromPb()
                    );
                await db.SaveChangesAsync(context.CancellationToken);
                return deal.ToPb(db.User.UserId, true);
            }
            catch (AlreadyCreatedException e) when (e.Deal != null)
            {
                throw new UserException(
                    "You already create deal for this ad. To create new deal, complete or cancel previous deal.");
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Deal> CreateDealLnSell(CreateDealLnSellRequest request, ServerCallContext context)
        {
            try
            {
                if (db.User.IsAnonymous)
                    throw new UserException("This function available only for authorized users.");
                decimal fiatAmount;
                decimal cryptoAmount;
                var ad = await db.User.AdsData.GetAdById((long) request.AdvertisementId);

                switch (request.AmountCase)
                {
                    case CreateDealLnSellRequest.AmountOneofCase.None:
                        throw new ArgumentOutOfRangeException();
                    case CreateDealLnSellRequest.AmountOneofCase.FiatAmount:
                        fiatAmount = request.FiatAmount.FromPb();
                        cryptoAmount = Math.Round(fiatAmount / ad.Metadata.Price, 8);
                        break;
                    case CreateDealLnSellRequest.AmountOneofCase.CryptoAmount:
                        cryptoAmount = request.CryptoAmount.FromPb();
                        fiatAmount = Math.Round(ad.Metadata.Price * cryptoAmount, 2);
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }

                var deal = await ad.CreateDealLnSell(fiatAmount, cryptoAmount);
                await db.SaveChangesAsync(context.CancellationToken);
                return deal.ToPb(db.User.UserId, true);
            }
            catch (AlreadyCreatedException e) when (e.Deal != null)
            {
                throw new UserException(
                    "You already create deal for this ad. To create new deal, complete or cancel previous deal.");
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override Task<Deal> GetDealById(GetDealByIdRequest request, ServerCallContext context)
        {
            try
            {
                var deal = db.User.DealsData.GetDealById((long) request.Id);
                return Task.FromResult(deal.ToPb(db.User.UserId, true));
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task SubscribeNewEvents(Empty request, IServerStreamWriter<Event> responseStream,
            ServerCallContext context)
        {
            try
            {
                await retranslator.RegisterStream(responseStream, context.CancellationToken, db.User, context);
            }
            catch (TaskCanceledException e) when (e.CancellationToken == context.CancellationToken)
            {
            }
            catch (OperationCanceledException e) when (e.CancellationToken == context.CancellationToken)
            {
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override Task<GetMyDealsResponse> GetMyDeals(GetMyDealsRequest request, ServerCallContext context)
        {
            try
            {
                var statuses = request.Status.Select(p => p.ToEntity()).ToList();
                var id = (long) request.DealId;
                long? dealId = null;
                if (id != default)
                    dealId = id;
                var count = request.LoadCount;
                var deals = db.User.DealsData.GetMyDeals(statuses, dealId, count);
                var ret = new GetMyDealsResponse();
                ret.Deals.AddRange(deals.Select(p => p.ToPb(db.User.UserId, true)));
                return Task.FromResult(ret);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Empty> MarkEventsAsRead(MarkEventsAsReadRequest request,
            ServerCallContext context)
        {
            try
            {
                var ids = request.Id.Select(p => (long) p).ToList();
                Validators.Argument(ids, "List").NotEmpty();
                var events = db.User.Events
                    .Where(p => ids.Contains(p.Id)).ToList();

                foreach (var userEvent in events)
                    db.User.Events.Remove(userEvent);
                await db.SaveChangesAsync(context.CancellationToken);
                return new Empty();
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<SendMessageResponse> SendMessage(SendMessageRequest request,
            ServerCallContext context)
        {
            try
            {
                var dealId = (long) request.DealId;
                var text = request.Text;
                var imageIds = request.ImageIds.Select(Guid.Parse).ToList();
                Validators.Argument(imageIds.Count, "ImagesCount").Max(10);
                if (!imageIds.Any())
                    Validators.Argument(text, "Text").NotEmpty().MaxLength(1000);

                var deal = db.User.DealsData.GetDealById(dealId);
                var images = db.User.ImagesData.GetImagesInternal(imageIds);
                var msg = await deal.SendMessage(request.Text, images);
                await db.SaveChangesAsync(context.CancellationToken);
                return new SendMessageResponse
                {
                    Message = msg.ToPb(true)
                };
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<CancelDealResponse> CancelDeal(CancelDealRequest request, ServerCallContext context)
        {
            try
            {
                var deal = db.User.DealsData.GetDealById((long) request.DealId);
                await deal.Cancel();
                await db.SaveChangesAsync(context.CancellationToken);
                return new CancelDealResponse
                {
                    Deal = deal.ToPb(db.User.UserId, true),
                };
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<CreateDisputeResponse> CreateDispute(CreateDisputeRequest request,
            ServerCallContext context)
        {
            try
            {
                var deal = db.User.DealsData.GetDealById((long) request.DealId);
                deal.StartDispute();
                await db.SaveChangesAsync(context.CancellationToken);
                return new CreateDisputeResponse
                {
                    Deal = deal.ToPb(db.User.UserId, true),
                };
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<IPayedResponse> IPayed(IPayedRequest request, ServerCallContext context)
        {
            try
            {
                var deal = db.User.DealsData.GetDealById((long) request.DealId);
                await deal.Payed();
                await db.SaveChangesAsync(context.CancellationToken);
                return new IPayedResponse
                {
                    Deal = deal.ToPb(db.User.UserId, true),
                };
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Deal> SendFeedback(SendFeedbackRequest request,
            ServerCallContext context)
        {
            try
            {
                Validators.Argument(request.Text, nameof(request.Text)).MaxLength(500);
                var deal = db.User.DealsData.GetDealById((long) request.DealId);
                deal.NewFeedback(request.IsPositive, request.Text);
                await db.SaveChangesAsync(context.CancellationToken);
                return deal.ToPb(db.User.UserId, true);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<GetUserFeedbacksResponse> GetUserFeedbacks(GetUserFeedbacksRequest request,
            ServerCallContext context)
        {
            try
            {
                Validators.Argument(Math.Abs(request.Count), nameof(request.Count)).LessThan(100);
                var resp = new GetUserFeedbacksResponse();
                var u = await db.UserDatas.FirstOrDefaultAsync(p => p.UserId == request.UserId,
                    context.CancellationToken);
                if (request.IsDealsFeedbacks)
                {
                    if (request.Count > 0)
                    {
                        var f = u.DealsFeedbacksToMe
                            .Where(p => p.Id > request.StartId)
                            .OrderBy(p => p.Id)
                            .Take(Math.Abs(request.Count))
                            .ToList();
                        resp.Feedbacks.AddRange(f.Select(p => p.ToPb()));
                    }
                    else
                    {
                        if (request.StartId == 0)
                            request.StartId = long.MaxValue;
                        var f = u.DealsFeedbacksToMe
                            .Where(p => p.Id < request.StartId)
                            .OrderByDescending(p => p.Id)
                            .Take(Math.Abs(request.Count))
                            .ToList();
                        resp.Feedbacks.AddRange(f.Select(p => p.ToPb()));
                    }
                }
                else
                {
                    if (request.Count > 0)
                    {
                        var f = u.PaymentsFeedbacksToMe
                            .Where(p => p.Id > request.StartId)
                            .OrderBy(p => p.Id)
                            .Take(Math.Abs(request.Count))
                            .ToList();
                        resp.Feedbacks.AddRange(f.Select(p => p.ToPb()));
                    }
                    else
                    {
                        if (request.StartId == 0)
                            request.StartId = long.MaxValue;
                        var f = u.PaymentsFeedbacksToMe
                            .Where(p => p.Id < request.StartId)
                            .OrderByDescending(p => p.Id)
                            .Take(Math.Abs(request.Count))
                            .ToList();
                        resp.Feedbacks.AddRange(f.Select(p => p.ToPb()));
                    }
                }

                return resp;
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Empty> CreateUserComplaint(CreateUserComplaintRequest request,
            ServerCallContext context)
        {
            try
            {
                Validators.Argument(request.UserId, nameof(request.UserId)).GuidValidate();
                Validators.Argument(request.Text, nameof(request.Text)).NotEmpty().MaxLength(1000);
                var u = await db.UserDatas.FirstOrDefaultAsync(p => p.UserId == request.UserId,
                    context.CancellationToken);
                var targetUser = await db.UserDatas.FirstAsync(p => p.UserId == request.UserId);

                SmtpClient client = new SmtpClient(config.SmtpServer, config.SmtpPort);
                client.Credentials = new System.Net.NetworkCredential(config.SmtpUser, config.SmtpPass);
                MailAddress from = new MailAddress(config.SmtpFrom, config.SmtpFrom, System.Text.Encoding.UTF8);
                MailAddress to = new MailAddress(config.SmtpFrom);
                MailMessage message = new MailMessage(from, to);
                message.Body =
                    $"Complaint:\nFrom:{db.User.UserName} {db.User.UserId}\nTo:{targetUser.UserName} {targetUser.UserId}\nText:{request.Text}\nContact:{request.Contact}";
                message.BodyEncoding = System.Text.Encoding.UTF8;
                message.Subject = "New complaint";
                message.SubjectEncoding = System.Text.Encoding.UTF8;
                client.Send(message);

                await db.SaveChangesAsync(context.CancellationToken);
                return new Empty();
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Empty> BlockUser(BlockUserRequest request, ServerCallContext context)
        {
            try
            {
                Validators.Argument(request.UserId, nameof(request.UserId)).GuidValidate();
                var u = await db.UserDatas.FirstOrDefaultAsync(p => p.UserId == request.UserId,
                    context.CancellationToken);
                db.User.AddBlocked(u);
                await db.SaveChangesAsync(context.CancellationToken);
                return new Empty();
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Empty> UnBlockUser(UnBlockUserRequest request, ServerCallContext context)
        {
            try
            {
                Validators.Argument(request.UserId, nameof(request.UserId)).GuidValidate();
                var u = await db.UserDatas.FirstOrDefaultAsync(p => p.UserId == request.UserId,
                    context.CancellationToken);
                db.User.RemoveBlocked(u);
                await db.SaveChangesAsync(context.CancellationToken);
                return new Empty();
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Empty> AddUserToTrusted(AddUserToTrustedRequest request, ServerCallContext context)
        {
            try
            {
                Validators.Argument(request.UserId, nameof(request.UserId)).GuidValidate();
                var u = await db.UserDatas.FirstOrDefaultAsync(p => p.UserId == request.UserId,
                    context.CancellationToken);
                db.User.AddTrusted(u);
                await db.SaveChangesAsync(context.CancellationToken);
                return new Empty();
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Empty> RemoveFromTrustedUsers(RemoveFromTrustedRequest request,
            ServerCallContext context)
        {
            try
            {
                Validators.Argument(request.UserId, nameof(request.UserId)).GuidValidate();
                var u = await db.UserDatas.FirstOrDefaultAsync(p => p.UserId == request.UserId,
                    context.CancellationToken);
                db.User.RemoveTrusted(u);
                await db.SaveChangesAsync(context.CancellationToken);
                return new Empty();
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override Task<GetMyBlockedUsersResponse> GetMyBlockedUsers(Empty request, ServerCallContext context)
        {
            try
            {
                var users = db.User.BlockedUsers.Select(p => p.User).ToList();
                var resp = new GetMyBlockedUsersResponse();
                resp.Users.AddRange(users.Select(p => p.ToPb()));
                return Task.FromResult(resp);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override Task<GetMyTrustedUsersResponse> GetMyTrustedUsers(Empty request, ServerCallContext context)
        {
            try
            {
                var users = db.User.TrustedUsers.Select(p => p.User).ToList();
                var resp = new GetMyTrustedUsersResponse();
                resp.Users.AddRange(users.Select(p => p.ToPb()));
                return Task.FromResult(resp);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override Task<IsUserBlockedResponse> IsUserBlocked(IsUserBlockedRequest request,
            ServerCallContext context)
        {
            try
            {
                Validators.Argument(request.UserId, nameof(request.UserId)).GuidValidate();
                var block = db.User.BlockedUsers.FirstOrDefault(p => p.User.UserId == request.UserId);
                return Task.FromResult(new IsUserBlockedResponse
                {
                    IsBlocked = block != null
                });
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override Task<IsUserTrustedResponse> IsUserTrusted(IsUserTrustedRequest request,
            ServerCallContext context)
        {
            try
            {
                Validators.Argument(request.UserId, nameof(request.UserId)).GuidValidate();
                var trust = db.User.TrustedUsers.FirstOrDefault(p => p.User.UserId == request.UserId);
                return Task.FromResult(new IsUserTrustedResponse
                {
                    IsTrusted = trust != null
                });
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task SubscribeVariables(Empty request, IServerStreamWriter<Variables> responseStream,
            ServerCallContext context)
        {
            try
            {
                await variablesRetranslator.RegisterStream(responseStream, db, db.User.UserId,
                    context.CancellationToken, context);
            }
            catch (TaskCanceledException e) when (e.CancellationToken == context.CancellationToken)
            {
            }
            catch (OperationCanceledException e) when (e.CancellationToken == context.CancellationToken)
            {
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override Task<GetTransactionsResponse> GetTransactions(GetTransactionsRequest request,
            ServerCallContext context)
        {
            try
            {
                Validators.Argument((int) request.Count, nameof(request.Count)).LessThan(100);
                if (request.IsInput)
                {
                    var set = db.User.InAddresses.SelectMany(p => p.Transactions)
                        .Where(p => request.LastId == 0 || p.Id < (int) request.LastId);

                    set = set.OrderByDescending(p => p.Id).Take((int) request.Count);
                    var resp = new GetTransactionsResponse();
                    resp.Transactions.AddRange(set.ToList().Select(p => p.ToPb()));
                    return Task.FromResult(resp);
                }
                else
                {
                    var set = db.User.OutTransactions
                        .Where(p => request.LastId == 0 || p.Id < (int) request.LastId);
                    var list = set.OrderByDescending(p => p.Id)
                        .Take((int) request.Count)
                        .Select(p => p.Transaction)
                        .Where(p => p != null)
                        .ToList();
                    var resp = new GetTransactionsResponse();
                    resp.Transactions.AddRange(list.Select(p => p.ToPb()));
                    return Task.FromResult(resp);
                }
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override Task<GetTransactionsResponse> GetTransactionsById(GetTransactionByIdRequest request,
            ServerCallContext context)
        {
            try
            {
                foreach (string id in request.TxId)
                    Validators.Argument(id, "TxId").LengthInRange(1, 41);
                if (request.IsInput)
                {
                    var trans = db.User.InAddresses.SelectMany(p => p.Transactions)
                        .Where(p => p.Address.Owner == db.User && request.TxId.Contains(p.TxId)).ToList();
                    if (!trans.Any())
                        throw new UserException("Transactions not found.");
                    var resp = new GetTransactionsResponse();
                    resp.Transactions.AddRange(trans.Select(p => p.ToPb()));
                    return Task.FromResult(resp);
                }
                else
                {
                    var trans = db.User.OutTransactions.Where(p =>
                            p.Transaction != null && request.TxId.Contains(p.Transaction.TxId))
                        .Select(p => p.Transaction).ToList();
                    if (!trans.Any())
                        throw new UserException("Transactions not found.");
                    var resp = new GetTransactionsResponse();
                    resp.Transactions.AddRange(trans.Select(p => p.ToPb()));
                    return Task.FromResult(resp);
                }
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<GetInputAddressResponse> GetInputAddress(Empty request,
            ServerCallContext context)
        {
            try
            {
                var wallet = db.BtcCoreWallets.OrderByDescending(p => p.Balance).FirstOrDefault();
                if (wallet == null)
                    throw new Exception("Wallet not found.");
                var addr = await wallet.GetInputAddresses();
                await db.SaveChangesAsync(context.CancellationToken);
                return new GetInputAddressResponse
                {
                    BtcAddress = new BtcAddress
                    {
                        Legacy = addr.lagacy.Address,
                        Bech32 = addr.bech32.Address
                    }
                };
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Empty> CreateTransaction(CreateTransactionRequest request, ServerCallContext context)
        {
            try
            {
                Validators.Argument(request.TargetAddress, nameof(request.TargetAddress)).LengthInRange(1, 42);
                try
                {
                    BitcoinAddress addr = BitcoinAddress.Create(request.TargetAddress, config.BitcoinNetwork);
                }
                catch (Exception)
                {
                    throw new UserException("Incorrect address.");
                }

                await db.User.Balance.CreateOutRequest(request.Amount.FromPb() == 0 ? null : request.Amount.FromPb(),
                    request.TargetAddress, false);
                await db.SaveChangesAsync(context.CancellationToken);
                return new Empty();
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<GetFeesResponse> GetFees(Empty request, ServerCallContext context)
        {
            try
            {
                var data = await db.BtcCoreWallets.AsNoTracking().FirstOrDefaultAsync(context.CancellationToken);
                var fee = data?.Fee ?? 0;
                return new GetFeesResponse
                {
                    Fee = fee.ToPb()
                };
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override Task<AllAdvertisementsStatus> GetAllAdvertisementsStatus(Empty request,
            ServerCallContext context)
        {
            try
            {
                return Task.FromResult(new AllAdvertisementsStatus
                {
                    BuysDisabled = db.User.BuysDisabled,
                    SalesDisabled = db.User.SalesDisabled
                });
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<MyProfileResponse> SetAllAdvertisementsStatus(AllAdvertisementsStatus request,
            ServerCallContext context)
        {
            try
            {
                await db.User.AdsData.ChangeAllAdStatus(request.SalesDisabled, request.BuysDisabled);
                await db.SaveChangesAsync(context.CancellationToken);
                using var channel = GrpcChannel.ForAddress($"http://{config.AuthHost}:{config.AuthHttp2Port}");
                Internal.InternalClient client = new Internal.InternalClient(channel);
                var info = client.GetUserInfo(new Auth.Protos.Internal.GetUserInfoRequest {UserId = db.User.UserId});
                var response = db.User.ToPb(info);
                return response;
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<IsUserExistResponse> IsUserExist(IsUserExistRequest request,
            ServerCallContext context)
        {
            try
            {
                Validators.Argument(request.UserName, nameof(request.UserName)).MaxLength(300);
                bool res;
                var u = await db.UserDatas.FirstOrDefaultAsync(p => p.UserName == request.UserName,
                    context.CancellationToken);
                if (u != null)
                {
                    if (u.UserId == db.User.UserId)
                        res = false;
                    else
                        res = true;
                }
                else
                    res = false;

                return new IsUserExistResponse
                {
                    IsExist = res
                };
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Invoice> CreateInvoice(CreateInvoiceRequest request,
            ServerCallContext context)
        {
            try
            {
                var price = request.Price.FromPb();
                var priceVariable = request.PriceVariable;
                var isBaseCrypto = request.IsBaseCrypto;
                var isPrivate = request.IsPrivate;
                var ttlMinutes = (int) request.TtlMinutes;
                var userName = request.UserName;
                var fiatCurrency = Enum.Parse<Catalog.Currencies>(request.FiatCurrency);
                var comment = request.Comment;
                var piecesMin = (int) request.PiecesMin;
                var piecesMax = (int) request.PiecesMax;
                var limitLiquidity = request.LimitLiquidity;
                var images = request.Images.Select(Guid.Parse).ToList();
                List<(string text, List<Guid> images)> secrets = new List<(string text, List<Guid> images)>();
                string url = "";
                string clientCert = "";
                string clientKey = "";
                string serverCert = "";
                bool webhookRequired = false;
                var noIntegration = request.NoIntegration;


                foreach (var sec in request.Secrets)
                {
                    var imgs = sec.Images.Select(Guid.Parse).ToList();
                    Validators.Argument(imgs.Count, "ImageCount").Max(10);
                    if (imgs.Any())
                        Validators.Argument(sec.Text, nameof(sec.Text)).NotEmpty();
                    Validators.Argument(sec.Text, nameof(sec.Text)).MaxLength(1000);
                    secrets.Add((sec.Text, imgs));
                }

                if (!noIntegration)
                {
                    if (request.Webhook != null)
                    {
                        url = request.Webhook.Url;
                        clientKey = request.Webhook.ClientKey;
                        clientCert = request.Webhook.ClientCrt;
                        serverCert = request.Webhook.ServerCrt;
                        webhookRequired = request.Webhook.Required;
                    }
                    else
                    {
                        url = request.Redirect;
                    }
                }


                if (isPrivate)
                {
                    Validators.Argument(userName, nameof(userName)).NotEmpty().MaxLength(300);
                    Validators.Argument(ttlMinutes, nameof(ttlMinutes)).InRange(15, 60 * 24 * 30);
                }
                else
                {
                    Validators.Argument(piecesMax, nameof(piecesMax)).GreaterThan(0);
                    Validators.Argument(piecesMin, nameof(piecesMin)).GreaterThan(0);
                    Validators.Argument(piecesMax, nameof(piecesMax)).GreaterThan(piecesMin - 1);
                }

                if (!isBaseCrypto)
                {
                    Validators.Argument(priceVariable, nameof(priceVariable)).NotEmpty()
                        .In(Catalog.CryptoExchangeVariablesList.Concat(new List<string> {"Average"}));
                }

                Validators.Argument(price, nameof(price)).GreaterThan(0);
                Validators.Argument(comment, nameof(comment)).MaxLength(1000);
                Validators.Argument(images.Count, "ImagesCount").Max(10);
                Validators.Argument(clientKey, nameof(clientKey)).MaxLength(3000);
                Validators.Argument(clientCert, nameof(clientCert)).MaxLength(3000);
                Validators.Argument(serverCert, nameof(serverCert)).MaxLength(3000);
                Validators.Argument(url, nameof(url)).MaxLength(1000);
                if (!noIntegration)
                {
                    Validators.Argument(url, nameof(url)).NotEmpty();
                    if (request.Webhook != null)
                    {
                        Validators.Argument(clientKey, nameof(clientKey)).NotEmpty();
                        Validators.Argument(clientCert, nameof(clientCert)).NotEmpty();
                        Validators.Argument(serverCert, nameof(serverCert)).NotEmpty();
                    }
                }

                var ent = db.User.InvoicesData.CreateInvoice(
                    price,
                    priceVariable,
                    isBaseCrypto,
                    isPrivate,
                    ttlMinutes,
                    fiatCurrency,
                    comment,
                    piecesMin,
                    piecesMax,
                    limitLiquidity,
                    userName,
                    images,
                    noIntegration,
                    url,
                    clientKey,
                    clientCert,
                    serverCert,
                    webhookRequired,
                    secrets,
                    context.CancellationToken);
                await db.SaveChangesAsync(context.CancellationToken);
                return ent.ToPb(db.User.UserId);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override Task<GetInvoicesResponse> GetInvoices(GetInvoicesRequest request,
            ServerCallContext context)
        {
            try
            {
                bool? isOwner = null;
                bool? isPrivate = null;
                if (request.IsOwnerHasValue)
                    isOwner = request.IsOwner;
                if (request.IsPrivateHasValue)
                    isPrivate = request.IsPrivate;
                var lastId = (long) request.LastId;
                List<InvoiceStatus> statuses = request.Statuses.Distinct().Select(p => (InvoiceStatus) p).ToList();
                var id = (long) request.Id;
                var toUser = request.ToUser;
                var count = (int) request.Count;

                Validators.Argument(toUser, nameof(toUser)).MaxLength(300);
                Validators.Argument(count, nameof(count)).InRange(1, 300);

                var res = db.User.InvoicesData.GetInvoices(isOwner, statuses, isPrivate, id, toUser, lastId, count);
                var ret = new GetInvoicesResponse();
                ret.Invoices.AddRange(res.Select(p => p.ToPb(db.User.UserId)));
                return Task.FromResult(ret);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<DeleteInvoiceResponse> DeleteInvoice(DeleteInvoiceRequest request,
            ServerCallContext context)
        {
            try
            {
                var payment =
                    await db.User.InvoicesData.DeleteInvoice((long) request.InvoiceId, context.CancellationToken);
                await db.SaveChangesAsync(context.CancellationToken);
                var ret = new DeleteInvoiceResponse();
                if (payment == null)
                    ret.RefundIsNull = true;
                else
                {
                    ret.PaymentRefund = payment.ToPb(db.User.UserId);
                }

                return ret;
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override Task<GetInvoicesResponse> GetInvoiceById(GetInvoiceByIdRequest request,
            ServerCallContext context)
        {
            try
            {
                var invoice = db.User.InvoicesData.GetInvoice((long) request.InvoiceId);
                if (invoice == null)
                    throw new UserException("Invoice not found.");
                var ret = new GetInvoicesResponse();
                ret.Invoices.Add(invoice.ToPb(db.User.UserId));
                return Task.FromResult(ret);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<InvoicePayment> PayInvoiceFromBalance(PayInvoiceFromBalanceRequest request,
            ServerCallContext context)
        {
            try
            {
                Validators.Argument((int) request.Pieces, nameof(request.Pieces)).GreaterThan(0);
                Validators.Argument(request.InvoiceId, nameof(request.InvoiceId)).NotDefault();
                var payment =
                    await db.User.InvoicesData.PayInvoiceFromBalance((long) request.InvoiceId, (int) request.Pieces);
                await db.SaveChangesAsync(context.CancellationToken);
                return payment.ToPb(db.User.UserId);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override Task<GetInvoicePaymentsResponse> GetInvoicePayments(GetInvoicePaymentsRequest request,
            ServerCallContext context)
        {
            try
            {
                long? paymentId = null;
                bool? isToMe = null;
                if (request.PaymentId != 0)
                    paymentId = (long) request.PaymentId;
                if (request.IsToMeHasValue)
                    isToMe = request.IsToMe;
                var lastId = (long) request.LastId;
                var count = (int) request.Count;

                Validators.Argument(count, nameof(count)).InRange(1, 300);
                Validators.Argument(paymentId, nameof(paymentId)).GreaterThan(0);

                var data = db.User.InvoicesData.GetInvoicePayments(paymentId, isToMe, lastId, count);
                var resp = new GetInvoicePaymentsResponse();
                resp.Payments.AddRange(data.Select(p => p.ToPb(db.User.UserId)));
                return Task.FromResult(resp);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Invoice> UpdatePublicInvoice(UpdatePublicInvoiceRequest request,
            ServerCallContext context)
        {
            try
            {
                var invoiceId = (long) request.InvoiceId;
                var price = request.Price.FromPb();
                var priceVariable = request.PriceVariable;
                var isBaseCrypto = request.IsBaseCrypto;
                var fiatCurrency = Enum.Parse<Catalog.Currencies>(request.FiatCurrency);
                var comment = request.Comment;
                var piecesMin = (int) request.PiecesMin;
                var piecesMax = (int) request.PiecesMax;
                var limitLiquidity = request.LimitLiquidity;
                var images = request.Images.Select(Guid.Parse).ToList();
                List<(string text, List<Guid> images)> secrets = new List<(string text, List<Guid> images)>();
                string url = "";
                string clientCert = "";
                string clientKey = "";
                string serverCert = "";
                bool webhookRequired = false;

                var noIntegration = request.NoIntegration;
                if (!noIntegration)
                {
                    if (request.Webhook != null)
                    {
                        url = request.Webhook.Url;
                        clientKey = request.Webhook.ClientKey;
                        clientCert = request.Webhook.ClientCrt;
                        serverCert = request.Webhook.ServerCrt;
                        webhookRequired = request.Webhook.Required;
                    }
                    else
                    {
                        url = request.Redirect;
                    }
                }

                Validators.Argument(piecesMax, nameof(piecesMax)).GreaterThan(0);
                Validators.Argument(piecesMin, nameof(piecesMin)).GreaterThan(0);
                Validators.Argument(piecesMax, nameof(piecesMax)).GreaterThan(piecesMin - 1);
                Validators.Argument(invoiceId, nameof(invoiceId)).NotDefault();
                Validators.Argument(price, nameof(price)).GreaterThan(0);
                Validators.Argument(priceVariable, nameof(priceVariable)).MaxLength(50);

                if (!isBaseCrypto)
                {
                    Validators.Argument(priceVariable, nameof(priceVariable)).NotEmpty()
                        .In(Catalog.CryptoExchangeVariablesList.Concat(new List<string> {"Average"}));
                }

                Validators.Argument(price, nameof(price)).GreaterThan(0);
                Validators.Argument(comment, nameof(comment)).MaxLength(1000);
                Validators.Argument(images.Count, "ImagesCount").Max(10);
                Validators.Argument(clientKey, nameof(clientKey)).MaxLength(3000);
                Validators.Argument(clientCert, nameof(clientCert)).MaxLength(3000);
                Validators.Argument(serverCert, nameof(serverCert)).MaxLength(3000);
                Validators.Argument(url, nameof(url)).MaxLength(1000);
                if (!noIntegration)
                {
                    Validators.Argument(url, nameof(url)).NotEmpty();
                    if (request.Webhook != null)
                    {
                        Validators.Argument(clientKey, nameof(clientKey)).NotEmpty();
                        Validators.Argument(clientCert, nameof(clientCert)).NotEmpty();
                        Validators.Argument(serverCert, nameof(serverCert)).NotEmpty();
                    }
                }

                var invoice = db.User.InvoicesData.GetInvoice(invoiceId);
                invoice.UpdatePublicInvoice(
                    price,
                    priceVariable,
                    isBaseCrypto,
                    fiatCurrency,
                    comment,
                    piecesMin,
                    piecesMax,
                    limitLiquidity,
                    images,
                    request.NoIntegration,
                    url,
                    clientKey,
                    clientCert,
                    serverCert,
                    webhookRequired);
                await db.SaveChangesAsync(context.CancellationToken);
                return invoice.ToPb(db.User.UserId);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task SubscribePublicInvoice(SubscribePublicInvoiceRequest request,
            IServerStreamWriter<SubscribePublicInvoiceResponse> responseStream,
            ServerCallContext context)
        {
            try
            {
                await retranslator.RegisterStream(responseStream, context.CancellationToken, db.User.UserId,
                    (long) request.InvoiceId);
            }
            catch (TaskCanceledException e) when (e.CancellationToken == context.CancellationToken)
            {
            }
            catch (OperationCanceledException e) when (e.CancellationToken == context.CancellationToken)
            {
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override Task<GetLastAdSearchParamsResponse> GetLastAdSearchParams(Empty request,
            ServerCallContext context)
        {
            try
            {
                return Task.FromResult(new GetLastAdSearchParamsResponse
                {
                    LastBuySearchHasValue = db.User.LastAdSearchBuy != null,
                    LastBuySearch = db.User.LastAdSearchBuy.ToPb(),
                    LastSellSearchHasValue = db.User.LastAdSearchSell != null,
                    LastSellSearch = db.User.LastAdSearchSell.ToPb()
                });
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<InvoicePayment> SendInvoicePaymentFeedback(SendInvoicePaymentFeedbackRequest request,
            ServerCallContext context)
        {
            try
            {
                Validators.Argument(request.PaymentId, nameof(request.PaymentId)).NotDefault();
                Validators.Argument(request.Feedback.Text, nameof(request.Feedback.Text)).MaxLength(500);

                var payment = db.User.InvoicesData.CreateInvoicePaymentFeedback((long) request.PaymentId,
                    request.Feedback.Text, request.Feedback.IsPositive);
                await db.SaveChangesAsync(context.CancellationToken);
                return payment.ToPb(db.User.UserId);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<InvoicePayment> PayInvoiceByBestDeal(PayInvoiceByBestDealRequest request,
            ServerCallContext context)
        {
            try
            {
                var country = Enum.Parse<Catalog.Countries>(request.Country);
                var currency = Enum.Parse<Catalog.Currencies>(request.Currency);
                var paymentType = Enum.Parse<Catalog.PaymentTypes>(request.PaymentType);
                var invoiceId = (long) request.InvoiceId;
                var pieces = (int) request.Pieces;
                Validators.Argument(invoiceId, nameof(invoiceId)).NotDefault();
                Validators.Argument(pieces, nameof(pieces)).GreaterThan(0);
                var payment = await db.User.InvoicesData.PayInvoiceByBestDeal(invoiceId,
                    country, currency, paymentType, pieces);
                await db.SaveChangesAsync(context.CancellationToken);
                return payment.ToPb(db.User.UserId);
            }
            catch (AlreadyCreatedException e) when (e.InvoicePayment != null)
            {
                return e.InvoicePayment.ToPb(db.User.UserId);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<GetInvoiceSuitableAdvertisementResponse> GetInvoiceSuitableAdvertisements(
            GetInvoiceSuitableAdvertisementsRequest request, ServerCallContext context)
        {
            try
            {
                var country = Enum.Parse<Catalog.Countries>(request.Country);
                var currency = Enum.Parse<Catalog.Currencies>(request.Currency);
                var paymentType = Enum.Parse<Catalog.PaymentTypes>(request.PaymentType);
                var invoiceId = (long) request.InvoiceId;
                var pieces = (int) request.Pieces;
                var skip = (int) request.Skip;
                var count = (int) request.Count;
                Validators.Argument(invoiceId, nameof(invoiceId)).NotDefault();
                Validators.Argument(pieces, nameof(pieces)).GreaterThan(0);
                Validators.Argument(count, nameof(count)).InRange(1, 100);

                var ads = db.User.InvoicesData.GetSuitableAds(invoiceId, pieces,
                    country, currency, paymentType, skip, count);
                await db.SaveChangesAsync(context.CancellationToken);
                var ret = new GetInvoiceSuitableAdvertisementResponse();
                foreach (var ad in ads)
                    ret.Advertisements.Add(ad.ToPb(db.User.UserId));
                return ret;
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<InvoicePayment> PayInvoiceByDeal(PayInvoiceByDealRequest request,
            ServerCallContext context)
        {
            try
            {
                var invoiceId = (long) request.InvoiceId;
                var pieces = (int) request.Pieces;
                var adId = (long) request.AdvertisementId;
                Validators.Argument(invoiceId, nameof(invoiceId)).NotDefault();
                Validators.Argument(pieces, nameof(pieces)).GreaterThan(0);
                Validators.Argument(adId, nameof(adId)).NotDefault();
                var payment = await db.User.InvoicesData.PayInvoiceByDeal(invoiceId, pieces, adId);
                await db.SaveChangesAsync(context.CancellationToken);
                return payment.ToPb(db.User.UserId);
            }
            catch (AlreadyCreatedException e) when (e.InvoicePayment != null)
            {
                return e.InvoicePayment.ToPb(db.User.UserId);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<InvoicePayment> CancelInvoicePayment(CancelInvoicePaymentRequest request,
            ServerCallContext context)
        {
            try
            {
                Validators.Argument(request.PaymentId, nameof(request.PaymentId)).NotDefault();
                var payment = await db.User.InvoicesData.CancelInvoicePayment((long) request.PaymentId);
                await db.SaveChangesAsync(context.CancellationToken);
                return payment.ToPb(db.User.UserId);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Conversation> SendInvoiceMessage(SendInvoiceMessageRequest request,
            ServerCallContext context)
        {
            try
            {
                var toUserId = request.ToUserId;
                var invoiceId = (long) request.InvoiceId;
                var message = request.Text;
                var imageIds = request.ImageIds.Select(Guid.Parse).ToList();
                if (imageIds.Any())
                {
                    Validators.Argument(imageIds.Count, "ImagesCount").Max(10);
                }
                else
                {
                    Validators.Argument(message, nameof(message)).NotEmpty().MaxLength(1000);
                }

                var conv = db.User.InvoicesData.NewMessage(invoiceId, toUserId, message, imageIds);
                await db.SaveChangesAsync(context.CancellationToken);
                return conv.ToPb(db.User.UserId);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Conversation> SendInvoicePaymentMessage(SendInvoicePaymentMessageRequest request,
            ServerCallContext context)
        {
            try
            {
                var paymentId = (long) request.PaymentId;
                var message = request.Text;
                var imageIds = request.ImageIds.Select(Guid.Parse).ToList();
                Validators.Argument(imageIds.Count, "ImagesCount").Max(10);
                if (!imageIds.Any())
                    Validators.Argument(message, nameof(message)).NotEmpty().MaxLength(1000);
                var conv = db.User.InvoicesData.NewMessage(paymentId, message, imageIds);
                await db.SaveChangesAsync(context.CancellationToken);
                return conv.ToPb(db.User.UserId);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override Task<GetConversationsResponse> GetConversations(Empty request, ServerCallContext context)
        {
            try
            {
                var conversations = db.User.InvoicesData.GetMyConversations();
                var res = new GetConversationsResponse();
                foreach (var conversation in conversations)
                    res.Conversations.Add(conversation.ToPb(db.User.UserId));
                return Task.FromResult(res);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Empty> DeleteConversation(DeleteConversationRequest request,
            ServerCallContext context)
        {
            try
            {
                db.User.InvoicesData.DeleteConversation((long) request.ConversationId);
                await db.SaveChangesAsync(context.CancellationToken);
                return new Empty();
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override Task<GetConversationsResponse> GetConversationsById(GetConversationsByIdRequest request,
            ServerCallContext context)
        {
            try
            {
                long? invoiceId;
                long? paymentId;
                if (request.InvoiceId == default)
                    invoiceId = null;
                else
                    invoiceId = (long) request.InvoiceId;
                if (request.PaymentId == default)
                    paymentId = null;
                else
                    paymentId = (long) request.PaymentId;
                if (!invoiceId.HasValue && !paymentId.HasValue)
                    throw new UserException("Incorrect command.");
                List<CoreLib.Entitys.Invoices.Conversation> convs = new List<CoreLib.Entitys.Invoices.Conversation>();

                if (invoiceId.HasValue)
                {
                    var inv = db.User.InvoicesData.GetInvoice(invoiceId.Value);
                    convs = inv.Conversations.ToList();
                }

                if (paymentId.HasValue)
                {
                    var payment = db.User.InvoicesData.GetPayment(paymentId.Value);
                    if (payment.Conversation == null)
                        throw new UserException("Conversation not found");
                    convs = new List<CoreLib.Entitys.Invoices.Conversation> {payment.Conversation};
                }


                var resp = new GetConversationsResponse();
                foreach (var conv in convs)
                    resp.Conversations.Add(conv.ToPb(db.User.UserId));
                return Task.FromResult(resp);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<CreateRefundResponse> CreateRefund(CreateRefundRequest request,
            ServerCallContext context)
        {
            try
            {
                var result = db.User.InvoicesData.CreateRefund((long) request.PaymentId, (int) request.Pieces);
                await db.SaveChangesAsync(context.CancellationToken);
                var ret = new CreateRefundResponse
                {
                    Payment = result.payment.ToPb(db.User.UserId),
                    Refund = result.refund.ToPb(db.User.UserId)
                };
                return ret;
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Invoice> BuyAutoPriceRecalcs(BuyAutoPriceRecalcsRequest request,
            ServerCallContext context)
        {
            try
            {
                var recalcs = (int) request.Recalcs;
                int minValue = (int) Math.Ceiling(Config.MinimalAmountBtc / Config.AutoPriceFee);
                Validators.Argument(recalcs, nameof(recalcs)).Min(minValue);
                var invoice = await db.User.InvoicesData.BuyRecalcs((int) request.Recalcs);
                await db.SaveChangesAsync(context.CancellationToken);
                return invoice.ToPb(db.User.UserId);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override Task<MyProfileResponse> GetMyProfile(Empty request, ServerCallContext context)
        {
            try
            {
                using var channel = GrpcChannel.ForAddress($"http://{config.AuthHost}:{config.AuthHttp2Port}");
                Internal.InternalClient client = new Internal.InternalClient(channel);
                var info = client.GetUserInfo(new Auth.Protos.Internal.GetUserInfoRequest {UserId = db.User.UserId});
                var response = db.User.ToPb(info);
                return Task.FromResult(response);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<CreatePromiseResponse> CreatePromise(CreatePromiseRequest request,
            ServerCallContext context)
        {
            try
            {
                var amount = request.Amount.FromPb();
                var password = request.Password;
                Validators.Argument(password, nameof(password)).MaxLength(100);

                var promise = new Promise(amount, password, db);
                await db.Promises.AddAsync(promise, context.CancellationToken);
                var text = await promise.GetText();
                await db.SaveChangesAsync(context.CancellationToken);
                return new CreatePromiseResponse
                {
                    Promise = text,
                    Balance = db.User.Balance.ToPb()
                };
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Balance> PromiseToBalance(PromiseToBalanceRequest request, ServerCallContext context)
        {
            try
            {
                var promiseText = request.Promise;
                var password = request.Password;
                Validators.Argument(promiseText, nameof(request.Promise)).MaxLength(2000);
                Validators.Argument(password, nameof(request.Password)).MaxLength(100);
                var promise = await Promise.GetPromise(promiseText, password, db);
                db.Promises.Remove(promise);
                await db.User.Balance.OnToBalancePromise(promise);
                await db.SaveChangesAsync(context.CancellationToken);
                return db.User.Balance.ToPb();
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<GetPromiseSuitableAdvertisementsResponse> GetPromiseSuitableAdvertisements(
            GetPromiseSuitableAdvertisementsRequest request, ServerCallContext context)
        {
            try
            {
                var country = Enum.Parse<Catalog.Countries>(request.Country);
                var currency = Enum.Parse<Catalog.Currencies>(request.Currency);
                var paymentType = Enum.Parse<Catalog.PaymentTypes>(request.PaymentType);
                var promiseText = request.Promise;
                var password = request.Password;
                var skip = (int) request.Skip;
                var count = (int) request.Count;
                Validators.Argument(promiseText, nameof(Promise)).MaxLength(2000);
                Validators.Argument(password, nameof(password)).MaxLength(100);
                Validators.Argument(count, nameof(count)).InRange(1, 100);

                var promise = await Promise.GetPromise(promiseText, password, db);
                var ads = await db.User.AdsData.FindAds(null, promise.Amount, true, country, currency, paymentType,
                    skip, count);
                ads = ads.Where(p => p.Owner.UserId != db.User.UserId).ToList();
                db.User.SetLastSearch(country, currency, paymentType, 0, true);
                var res = ads.Select(p => (p, Math.Round(p.Metadata.Price * promise.Amount, 2))).ToList();

                var ret = new GetPromiseSuitableAdvertisementsResponse
                {
                    PromiseAmount = promise.Amount.ToPb()
                };

                await db.SaveChangesAsync(context.CancellationToken);
                foreach (var ad in res)
                {
                    ret.Advertisements.Add(ad.p.ToPb(db.User.UserId));
                    ret.FiatAmounts.Add(ad.Item2.ToPb());
                }

                return ret;
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Deal> PromiseSellByDeal(PromiseSellByDealRequest request, ServerCallContext context)
        {
            try
            {
                var promiseText = request.Promise;
                var password = request.Password;
                var advertisementId = (long) request.AdvertisementId;
                Validators.Argument(promiseText, nameof(Promise)).MaxLength(2000);
                Validators.Argument(password, nameof(password)).MaxLength(100);

                var promise = await Promise.GetPromise(promiseText, password, db);
                var ad = await db.User.AdsData.GetAdById(advertisementId);
                decimal fiat = Math.Round(promise.Amount * ad.Metadata.Price, 2);
                var deal = await ad.CreateDeal(fiat, null, null, null, promise);
                await db.SaveChangesAsync(context.CancellationToken);
                return deal.ToPb(db.User.UserId, true);
            }
            catch (AlreadyCreatedException e) when (e.Deal != null)
            {
                throw new UserException(
                    "You already create deal for this ad. To create new deal, complete or cancel previous deal.");
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Deal> PromiseSellByBestDeal(PromiseSellByBestDealRequest request,
            ServerCallContext context)
        {
            try
            {
                var country = Enum.Parse<Catalog.Countries>(request.Country);
                var currency = Enum.Parse<Catalog.Currencies>(request.Currency);
                var paymentType = Enum.Parse<Catalog.PaymentTypes>(request.PaymentType);
                var promiseText = request.Promise;
                var password = request.Password;
                Validators.Argument(promiseText, nameof(promiseText)).MaxLength(2000);
                Validators.Argument(password, nameof(password)).MaxLength(100);

                var promise = await Promise.GetPromise(request.Promise, request.Password, db);
                var ads = await db.User.AdsData.FindAds(null, promise.Amount, true, country, currency, paymentType, 0,
                    1);
                db.User.SetLastSearch(country, currency, paymentType, 0, true);
                if (!ads.Any())
                    throw new UserException("Suitable advertisement not found.");
                decimal fiat = promise.Amount * ads.First().Metadata.Price;
                var deal = await ads.First().CreateDeal(fiat, null, null, promise: promise);
                await db.SaveChangesAsync(context.CancellationToken);
                return deal.ToPb(db.User.UserId, true);
            }
            catch (AlreadyCreatedException e) when (e.Deal != null)
            {
                throw new UserException(
                    "You already create deal for this ad. To create new deal, complete or cancel previous deal.");
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<InvoicePayment> PayInvoiceByPromise(PayInvoiceByPromiseRequest request,
            ServerCallContext context)
        {
            try
            {
                Validators.Argument(request.Promise, nameof(request.Promise)).MaxLength(2000);
                Validators.Argument(request.Password, nameof(request.Password)).MaxLength(100);

                var payment = await db.User.InvoicesData.PayInvoiceByPromise(request.Promise, request.Password,
                    (long) request.InvoiceId,
                    (int) request.Pieces, request.OddType.FromPb());
                await db.SaveChangesAsync(context.CancellationToken);
                return payment.ToPb(db.User.UserId, true);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Image> StoreImage(StoreImageRequest request, ServerCallContext context)
        {
            try
            {
                var id = Guid.Parse(request.Id);
                var data = request.Data.ToByteArray();
                if (data.LongLength > 10485760)
                    throw new UserException("Max image size is 10485760 bytes (10MB)");
                if (data.LongLength == 0)
                    throw new UserException("Image must be present.");
                var image = await db.User.ImagesData.StoreImage(id, data, context.CancellationToken);
                await db.SaveChangesAsync(context.CancellationToken);
                return image.ToPb(true);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Image> GetImage(GetImageRequest request, ServerCallContext context)
        {
            try
            {
                var id = Guid.Parse(request.Id);
                var image = await db.User.ImagesData.GetImage(id, false, context.CancellationToken);
                return image.ToPb(request.IsPreview);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<InvoiceSecretsList> CreateInvoiceSecret(CreateInvoiceSecretRequest request,
            ServerCallContext context)
        {
            try
            {
                var invoiceId = (long) request.InvoiceId;
                var text = request.Text;
                var images = request.Images.Select(Guid.Parse).ToList();
                var order = (int) request.Order;
                Validators.Argument(text, nameof(text)).NotEmpty().MaxLength(1000);
                Validators.Argument(images.Count, "ImagesCount").Max(10);
                Validators.Argument(order, nameof(order)).Min(0);

                var invoice = db.User.InvoicesData.GetInvoice(invoiceId);
                if (invoice.Owner.UserId != db.User.UserId)
                    throw new UserException("You are not the owner of this invoice.");
                invoice.CreateSecret(text, images, order);
                await db.SaveChangesAsync(context.CancellationToken);
                return invoice.Secrets.ToList().ToPb();
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override Task<InvoiceSecretsList> GetInvoiceSecrets(GetInvoiceSecretsRequest request,
            ServerCallContext context)
        {
            try
            {
                var invoice = db.User.InvoicesData.GetInvoice((long) request.InvoiceId);
                if (invoice.Owner.UserId != db.User.UserId)
                    throw new UserException("You are not the owner of this invoice.");
                List<InvoiceSecret> secrets;
                if (request.IsSold)
                    secrets = invoice.Secrets.Where(p => p.Payment != null).ToList();
                else
                    secrets = invoice.Secrets.Where(p => p.Payment == null).ToList();
                return Task.FromResult(secrets.ToPb());
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<InvoiceSecretsList> ChangeInvoiceSecret(ChangeInvoiceSecretRequest request,
            ServerCallContext context)
        {
            try
            {
                var secretId = (long) request.SecretId;
                var secretOperation = request.Operation switch
                {
                    ChangeInvoiceSecretRequest.Types.SecretOperations.ToUp => SecretOperations.ToUp,
                    ChangeInvoiceSecretRequest.Types.SecretOperations.ToDown => SecretOperations.ToDown,
                    ChangeInvoiceSecretRequest.Types.SecretOperations.ToTop => SecretOperations.ToTop,
                    ChangeInvoiceSecretRequest.Types.SecretOperations.ToBottom => SecretOperations.ToBottom,
                    ChangeInvoiceSecretRequest.Types.SecretOperations.Remove => SecretOperations.Remove,
                    _ => throw new IndexOutOfRangeException()
                };

                var secret = db.User.InvoicesData.GetMySecretById((long) request.SecretId);
                if (secret == null)
                    throw new UserException("Secret not found.");
                if (secret.Payment != null)
                    throw new UserException("Secret already sold.");
                var invoice = db.User.InvoicesData.GetInvoice(secret.Invoice.Id);
                if (invoice.Owner.UserId != db.User.UserId)
                    throw new UserException("You are not the owner of this invoice.");
                invoice.ChangeSecret(secretOperation, secretId);
                await db.SaveChangesAsync(context.CancellationToken);
                return invoice.Secrets.ToList().ToPb();
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<InvoiceSecretsList> UpdateInvoiceSecret(UpdateInvoiceSecretRequest request,
            ServerCallContext context)
        {
            try
            {
                var secretId = (long) request.SecretId;
                var text = request.Text;
                var images = request.Images.Select(Guid.Parse).ToList();
                var order = (int) request.Order;
                Validators.Argument(text, nameof(text)).NotEmpty().MaxLength(1000);
                Validators.Argument(images.Count, "ImagesCount").Max(10);
                Validators.Argument(order, nameof(order)).Min(0);

                var secret = db.User.InvoicesData.GetMySecretById((long) request.SecretId);
                if (secret == null)
                    throw new UserException("Secret not found.");
                if (secret.Payment != null)
                    throw new UserException("Secret already sold.");
                var invoice = db.User.InvoicesData.GetInvoice(secret.Invoice.Id);
                if (invoice.Owner.UserId != db.User.UserId)
                    throw new UserException("You are not the owner of this invoice.");
                invoice.UpdateSecret(secretId, order, text, images);
                await db.SaveChangesAsync(context.CancellationToken);
                return invoice.Secrets.ToList().ToPb();
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Balance> LNWithdrawal(LNWithdrawalRequest request, ServerCallContext context)
        {
            try
            {
                var invoice = request.Invoice;
                decimal? amount = null;
                if (!request.AmountIsNull)
                    amount = request.Amount.FromPb();
                await db.User.Balance.LNWithdrawal(invoice, amount);
                await db.SaveChangesAsync(context.CancellationToken);
                return db.User.Balance.ToPb();
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<LNDepositResponse> LNDeposit(LNDepositRequest request, ServerCallContext context)
        {
            try
            {
                var amount = request.Amount.FromPb();
                var description = request.Description;
                var expiresIn = TimeSpan.FromSeconds(request.ExpiresIn);
                Validators.Argument((int) request.ExpiresIn, nameof(request.ExpiresIn)).Max(3600);
                Validators.Argument(description, nameof(description)).MaxLength(300);

                var inv = await lndClient.CreateInvoice(description, amount, (int) request.ExpiresIn);
                var lnInvoice = new LNInvoice(db.User, inv);
                await db.LNInvoices.AddAsync(lnInvoice, context.CancellationToken);
                await db.SaveChangesAsync(context.CancellationToken);
                return new LNDepositResponse
                {
                    Invoice = lnInvoice.Bolt11
                };
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override Task<LNGetInvoicesResponse> LNGetInvoices(LNGetInvoicesRequest request,
            ServerCallContext context)
        {
            try
            {
                Validators.Argument((int) request.Take, nameof(request.Take)).Max(100);
                var invoices = db.User.LNInvoices.OrderByDescending(p => p.CreatedAt)
                    .Take((int) request.Take).ToList();
                var ret = new LNGetInvoicesResponse();
                ret.Invoices.AddRange(invoices.Select(p => p.ToPb()));
                return Task.FromResult(ret);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override Task<LNGetPaymentsResponse> LNGetPayments(LNGetPaymentsRequest request,
            ServerCallContext context)
        {
            try
            {
                Validators.Argument((int) request.Take, nameof(request.Take)).Max(100);
                var payments = db.User.LNPaymentRequests.OrderByDescending(p => p.CreatedAt)
                    .Skip((int) request.Skip).Take((int) request.Take).ToList();
                var ret = new LNGetPaymentsResponse();
                ret.LNPayments.AddRange(payments.Select(p => p.ToPb()));
                return Task.FromResult(ret);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<InvoicePayment> PayInvoiceFromLN(PayInvoiceFromLNRequest request,
            ServerCallContext context)
        {
            try
            {
                var payment = await db.User.LnData.PayInvoiceFromLN((long) request.InvoiceId, (int) request.Pieces,
                    context.CancellationToken);
                await db.SaveChangesAsync(context.CancellationToken);
                return payment.ToPb(db.User.UserId, true);
            }
            catch (AlreadyCreatedException e) when (e.InvoicePayment != null)
            {
                return e.InvoicePayment.ToPb(db.User.UserId, true);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Empty> UpdateMyProfile(UpdateMyProfileRequest request,
            ServerCallContext context)
        {
            try
            {
                Validators.Argument(request.Timezone, "Timezone").TimezoneValidate();
                Validators.Argument(request.Introduction, "Introduction").MaxLength(300);
                Validators.Argument(request.Site, "Site").MaxLength(300);
                Uri.TryCreate(request.Site, UriKind.Absolute, out var temp);
                Validators.Argument(temp, "Site").Absolute();

                var timezone = request.Timezone;
                var introduction = request.Introduction;
                var site = request.Site;
                var salesDisabled = request.SalesDisabled;
                var buysDisabled = request.BuysDisabled;
                var defaultCurrency = Enum.Parse<Catalog.Currencies>(request.DefaultCurrency);
                await db.User.Update(timezone, introduction, site, salesDisabled, buysDisabled);
                await db.SaveChangesAsync(context.CancellationToken);
                return new Empty();
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override Task<GetUserEventsResponse> GetUserEvents(Empty request, ServerCallContext context)
        {
            try
            {
                var events = db.User.Events;
                var resp = new GetUserEventsResponse();
                resp.Events.AddRange(events.Select(p => p.ToPb()));
                return Task.FromResult(resp);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override Task<Balance> GetBalances(Empty request, ServerCallContext context)
        {
            try
            {
                return Task.FromResult(db.User.Balance.ToPb());
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Variables> GetVariables(Empty request, ServerCallContext context)
        {
            try
            {
                var vars = await db.GetVariables(context.CancellationToken);
                return vars.ToPb();
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }
    }
}