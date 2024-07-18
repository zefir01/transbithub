using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace CoreLib.Entitys.UserDataParts
{
    public partial class UserData
    {
        [Owned]
        public class UserDataDeals
        {
            public decimal AvgAmount { get; private set; }
            public uint Count { get; private set; }
            public uint PartnersCount { get; private set; }
            public decimal ResponseRate { get; private set; }
            public DateTime? DealDate { get; private set; }
            public uint AvgDelaySeconds { get; private set; }
            public uint MedianDelaySeconds { get; private set; }

            public virtual UserData User { get; private set; }
            private DataDBContext db;

            public UserDataDeals(DataDBContext db)
            {
                this.db = db;
            }

            public UserDataDeals(UserData user, DataDBContext db)
            {
                User = user;
                this.db = db;
            }

            public void UpdateStats(Deal deal)
            {
                if (deal.Status != DealStatus.Completed)
                    return;

                if (!DealDate.HasValue)
                    DealDate = DateTime.Now;
                decimal avg = AvgAmount * Count;
                AvgAmount = (avg + deal.CryptoAmount) / (Count + 1);

                var temp = GetMyDeals(new List<DealStatus>() {DealStatus.Completed}, null, int.MaxValue);
                var t1 = temp.Select(p =>
                        p.Initiator.UserId == User.UserId
                            ? p.Ad.Owner.UserId
                            : p.Initiator.UserId)
                    .Distinct();
                PartnersCount = (uint) t1.Count();


                uint tmp = AvgDelaySeconds * Count;
                AvgDelaySeconds = (tmp + (uint) (deal.CompletedAt - deal.CreatedAt).Value.TotalSeconds) / (Count + 1);
                var times = temp.Where(p => p.CompletedAt.HasValue).Select(p => new {p.CreatedAt, p.CompletedAt})
                    .ToList();
                var seconds = times.Select(p => (p.CompletedAt - p.CreatedAt).Value.TotalSeconds)
                    .OrderBy(p => p).ToList();
                if (seconds.Count == 0)
                    MedianDelaySeconds = (uint) (deal.CompletedAt - deal.CreatedAt).Value.TotalSeconds;
                else
                    MedianDelaySeconds = (uint) Convert.ToInt32(seconds[(seconds.Count - 1) / 2]);
                Count++;
            }

            public void NewDealFeedback(DealFeedBack dealFeedBack)
            {
                var initiatorFeedbacks = User.DealsInitiator.Select(p => p.AdOwnerFeedBack);
                var adOwnerFeedbacks = User.DealsAdOwner.Select(p => p.InitiatorFeedBack);
                var all = initiatorFeedbacks.Concat(adOwnerFeedbacks).Where(p => p != null).ToList();
                var positive = all.Count(p => p.IsPositive);
                var allCount = all.Count;
                if (allCount == 0)
                {
                    if (dealFeedBack.IsPositive)
                        ResponseRate = 100;
                    return;
                }

                ResponseRate = positive / allCount * 100;
            }

            public Deal GetDealById(long id)
            {
                var deal = User.DealsInitiator.FirstOrDefault(p => p.Id == id);
                deal ??= User.DealsAdOwner.FirstOrDefault(p => p.Id == id);
                if (deal == null)
                    throw new UserException($"Deal with id={id} not found.");
                return deal;
            }

            public List<Deal> GetMyDeals(IList<DealStatus> statuses, long? dealId, int count)
            {
                var d = User.DealsInitiator.Concat(User.DealsAdOwner)
                    .Where(p => !dealId.HasValue || p.Id == dealId.Value)
                    .Where(p => statuses.Contains(p.Status))
                    .OrderBy(p => p.Id * Math.Sign(count)).Take(Math.Abs(count)).ToList();
                return d;
            }
        }
    }
}