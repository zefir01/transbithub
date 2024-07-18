using System.Collections.Generic;
using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace CoreLib.Entitys.Json
{
    public partial class MxcResponse
    {
        [JsonProperty("code")]
        public long Code { get; set; }

        [JsonProperty("data")]
        public Dictionary<string, Datum> Data { get; set; }

        [JsonProperty("msg")]
        public string Msg { get; set; }
    }

    public class Datum
    {
        [JsonProperty("volume")]
        public string Volume { get; set; }

        [JsonProperty("high")]
        public string High { get; set; }

        [JsonProperty("low")]
        public string Low { get; set; }

        [JsonProperty("buy")]
        public string Buy { get; set; }

        [JsonProperty("sell")]
        public string Sell { get; set; }

        [JsonProperty("open")]
        public string Open { get; set; }

        [JsonProperty("last")]
        public string Last { get; set; }

        [JsonProperty("percentChange")]
        public string PercentChange { get; set; }
    }

    public partial class MxcResponse
    {
        public static MxcResponse FromJson(string json) => JsonConvert.DeserializeObject<MxcResponse>(json, MxcResponseConverter.Settings);
    }

    public static class MxcResponseSerialize
    {
        public static string ToJson(this MxcResponse self) => JsonConvert.SerializeObject(self, MxcResponseConverter.Settings);
    }

    internal static class MxcResponseConverter
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
