using System;
using Decimal = Protos.TradeApi.V1.Decimal;

namespace Shared.Protos
{
    public static class Extensions
    {
        private const decimal NanoFactor = 1_000_000_000;

        public static Decimal ToPb(this decimal value)
        {
            var units = decimal.ToInt64(value);
            var nanos = decimal.ToInt32((value - units) * NanoFactor);
            return new Decimal
            {
                Units = units,
                Nanos = nanos
            };
        }

        public static decimal FromPb(this Decimal value)
        {
            try
            {
                return value.Units + value.Nanos / NanoFactor;
            }
            catch (NullReferenceException)
            {
                return 0;
            }
        }
    }
}