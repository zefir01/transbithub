using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Aggregator.Services.BitZlato.ParseResults;

namespace Aggregator.Services.BitZlato.Entitys
{
    [Table("bz_trader_volumes")]
    public class TraderVolumes
    {
        [Key] public long Id { get; private set; }
        public Catalog.CryptoCurrencies CryptoCurrency { get; private set; }
        public decimal Amount { get; private set; }
        public long DealsCount { get; private set; }
        public virtual TraderSnapshot Snapshot { get; private set; }

        public TraderVolumes()
        {
            
        }

        public TraderVolumes(VolumeItem item, TraderSnapshot snapshot)
        {
            Snapshot = snapshot;
            CryptoCurrency = item.CryptoCurrency;
            Amount = item.Amount;
            DealsCount = item.DealsCount;
        }

        public bool Compare(TraderVolumes volumes)
        {
            if (Amount != volumes.Amount ||
                DealsCount != volumes.DealsCount
            )
                return false;
            return true;
        }
    }
}