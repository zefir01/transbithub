using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace CoreLib.Entitys.Json
{
    public partial class BittrexResponse
    {
        [JsonProperty("success")]
        public bool Success { get; set; }

        [JsonProperty("message")]
        public string Message { get; set; }

        [JsonProperty("result")]
        public BittrexResponseResult Result { get; set; }
    }

    public class BittrexResponseResult
    {
        [JsonProperty("Bid")]
        public decimal Bid { get; set; }

        [JsonProperty("Ask")]
        public decimal Ask { get; set; }

        [JsonProperty("Last")]
        public decimal Last { get; set; }
    }

    public partial class BittrexResponse
    {
        public static BittrexResponse FromJson(string json) => JsonConvert.DeserializeObject<BittrexResponse>(json, BittrexResponseConverter.Settings);
    }

    public static class BittrexResponseSerialize
    {
        public static string ToJson(this BittrexResponse self) => JsonConvert.SerializeObject(self, BittrexResponseConverter.Settings);
    }

    internal static class BittrexResponseConverter
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