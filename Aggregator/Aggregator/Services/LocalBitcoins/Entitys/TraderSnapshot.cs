namespace Aggregator.Services.LocalBitcoins.Entitys
{
    public class TraderSnapshot : Aggregator.Entitys.TraderSnapshot
    {
        public TraderSnapshot(AdListData data)
        {
            var t = data.Profile.TradeCount.Replace("+", "").Replace(" ", "");
            TradesCount = int.Parse(t);
            Rating = data.Profile.FeedbackScore;
        }
        public TraderSnapshot(){}

        public bool Compare(TraderSnapshot snapshot)
        {
            return TradesCount == snapshot.TradesCount && Rating == snapshot.Rating;
        }
    }
}