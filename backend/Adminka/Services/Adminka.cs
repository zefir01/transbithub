using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Auth.Entitys;
using CoreLib;
using CoreLib.Services;
using Dawn;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Protos.Adminka.V1;
using Protos.TradeApi.V1;
using Shared;
using DealStatus = CoreLib.Entitys.DealStatus;

namespace Adminka.Services
{
    [Authorize(Policy = "adminka_security")]
    public class Adminka : Protos.Adminka.V1.Adminka.AdminkaBase
    {
        private readonly DataDBContext db;
        private readonly ILogger<Adminka> logger;
        private readonly RetranslatorBuffer retranslator;
        private readonly VariablesRetranslator variablesRetranslator;
        private readonly UserManager<ApplicationUser> userManager;
        

        public Adminka(DataDBContext db, ILogger<Adminka> logger, RetranslatorBuffer disputesRetranslator,
            VariablesRetranslator variablesRetranslator, UserManager<ApplicationUser> userManager)
        {
            this.db = db;
            this.logger = logger;
            this.retranslator = disputesRetranslator;
            this.variablesRetranslator = variablesRetranslator;
            this.userManager = userManager;
        }

        public override async Task SubscribeDisputes(Empty request, IServerStreamWriter<DisputeEvent> responseStream,
            ServerCallContext context)
        {
            try
            {
                await retranslator.RegisterStream(responseStream, context.CancellationToken, db.User, db, context);
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
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<GetDisputesResponse> GetMyDisputes(Empty request,
            ServerCallContext context)
        {
            try
            {
                var disputes = await db.Disputes
                    .Where(p => p.Arbitor == db.User && p.Deal.Status == DealStatus.Disputed)
                    .ToListAsync(context.CancellationToken);
                var resp = new GetDisputesResponse();
                resp.Disputes.AddRange(disputes.Select(p => p.ToPb()));
                return resp;
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override Task<Profile> GetMyProfile(Empty request, ServerCallContext context)
        {
            try
            {
                return Task.FromResult(new Profile
                {
                    UserId = db.User.UserId,
                    UserName = db.User.UserName
                });
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<GetSupportAccountsResponse> GetSupportAccounts(Empty request,
            ServerCallContext context)
        {
            try
            {
                var users = await userManager.GetUsersInRoleAsync("support");
                var resp = new GetSupportAccountsResponse();
                foreach (var user in users)
                {
                    if (await userManager.IsLockedOutAsync(user))
                        continue;
                    resp.SupportAccounts.Add(new SupportAccount
                    {
                        Id = user.Id,
                        Username = user.UserName
                    });
                }

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
                var data = await db.UserDatas.FirstAsync(p => p.UserId == request.Id);
                return new GetUserInfoResponse
                {
                    UserInfo = data.ToPb()
                };
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Dispute> ToWorkDispute(DisputeRequest request, ServerCallContext context)
        {
            try
            {
                var dispute =
                    await db.Disputes.FirstAsync(p => p.Deal.Id == (int) request.DisputeId && p.Arbitor == null);
                dispute.Arbitor = db.User;
                await db.SaveChangesAsync(context.CancellationToken);
                retranslator.DisputeUpdated(dispute);
                return dispute.ToPb();
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Dispute> StopWorkDispute(DisputeRequest request, ServerCallContext context)
        {
            try
            {
                var dispute =
                    await db.Disputes.FirstAsync(p => p.Deal.Id == (int) request.DisputeId && p.Arbitor == db.User);
                dispute.Arbitor = null;
                await db.SaveChangesAsync(context.CancellationToken);
                retranslator.DisputeUpdated(dispute);
                return dispute.ToPb();
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Dispute> GiveAwayDispute(GiveAwayDisputeRequest request, ServerCallContext context)
        {
            try
            {
                var dispute =
                    await db.Disputes.FirstAsync(p => p.Deal.Id == (int) request.DisputeId && p.Arbitor == db.User);
                var newUser = db.UserDatas.First(p => p.UserId == request.UserId);
                dispute.Arbitor = newUser;
                await db.SaveChangesAsync(context.CancellationToken);
                retranslator.DisputeUpdated(dispute);
                return dispute.ToPb();
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Deal> GetDeal(GetDealRequest request, ServerCallContext context)
        {
            try
            {
                var dispute =
                    await db.Disputes.FirstAsync(p => p.Arbitor == db.User && p.Deal.Id == (long) request.DealId);
                return dispute.Deal.ToPb(db.User.UserId, false);
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Deal> SendMessage(SendMessageRequest request, ServerCallContext context)
        {
            try
            {
                var dealId = (long) request.DealId;
                var text = request.Text;
                var imageIds = request.ImageIds.Select(Guid.Parse).ToList();
                Validators.Argument(imageIds.Count, "ImagesCount").Max(10);
                if (!imageIds.Any())
                    Validators.Argument(text, "Text").NotEmpty().MaxLength(1000);
                var dispute = await db.Disputes.FirstAsync(p =>
                    p.Arbitor == db.User && p.Deal.Status == DealStatus.Disputed && p.Deal.Id == dealId);
                var deal = dispute.Deal;
                var images = db.User.ImagesData.GetImagesInternal(imageIds);
                var msg = await deal.SendMessage(request.Text, images);
                await db.SaveChangesAsync(context.CancellationToken);
                return deal.ToPb("", false);
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

        public override async Task<Empty> MarkEventsAsRead(MarkEventsAsReadRequest request, ServerCallContext context)
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

        public override async Task<Dispute> CancelDispute(CancelDisputeRequest request, ServerCallContext context)
        {
            try
            {
                var dispute =
                    await db.Disputes.FirstAsync(p => p.Arbitor == db.User && p.Deal.Id == (long) request.DisputeId);
                await dispute.Deal.AdminChangeStatus(DealStatus.Canceled);
                await db.SaveChangesAsync(context.CancellationToken);
                return dispute.ToPb();
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<Dispute> CompleteDispute(CompleteDisputeRequest request, ServerCallContext context)
        {
            try
            {
                var dispute =
                    await db.Disputes.FirstAsync(p => p.Arbitor == db.User && p.Deal.Id == (long) request.DisputeId);
                await dispute.Deal.AdminChangeStatus(DealStatus.Completed);
                await db.SaveChangesAsync(context.CancellationToken);
                return dispute.ToPb();
            }
            catch (Exception e)
            {
                throw e.HideException(logger);
            }
        }

        public override async Task<GetUserFeedbacksResponse> GetUserFeedbacks(GetUserFeedbacksRequest request, ServerCallContext context)
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
    }
}