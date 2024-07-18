using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace CoreLib.Entitys.Json
{
    public partial class BinanceResponse
    {
        [JsonProperty("symbol")]
        public string Symbol { get; set; }

        [JsonProperty("price")]
        public string Price { get; set; }
    }

    public partial class BinanceResponse
    {
        public static BinanceResponse FromJson(string json) => JsonConvert.DeserializeObject<BinanceResponse>(json, BinanceResponseConverter.Settings);
    }

    public static class BinanceResponseSerialize
    {
        public static string ToJson(this BinanceResponse self) => JsonConvert.SerializeObject(self, BinanceResponseConverter.Settings);
    }

    internal static class BinanceResponseConverter
    {
        public static readonly JsonSerializerSettings Settings = new JsonSerializerSettings
        {
            MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
            DateParseHandling = DateParseHandling.None,
            Converters =
            {
                new IsoDateTimeConverter { DateTimeStyles = DateTimeStyles.AssumeUniversal }
            },
        };
    }
}