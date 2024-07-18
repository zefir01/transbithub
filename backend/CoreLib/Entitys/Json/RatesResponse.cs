using System;
using System.Collections.Generic;
using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace CoreLib.Entitys.Json
{
    public partial class RatesResponse
    {
        [JsonProperty("disclaimer")]
        public string Disclaimer { get; set; }

        [JsonProperty("license")]
        public Uri License { get; set; }

        [JsonProperty("timestamp")]
        public long Timestamp { get; set; }

        [JsonProperty("base")]
        public string Base { get; set; }

        [JsonProperty("rates")]
        public Dictionary<string, decimal> Rates { get; set; }
    }

    public partial class RatesResponse
    {
        public static RatesResponse FromJson(string json) => JsonConvert.DeserializeObject<RatesResponse>(json, RatesResponseConverter.Settings);
    }

    public static class RatesResponseSerialize
    {
        public static string ToJson(this RatesResponse self) => JsonConvert.SerializeObject(self, RatesResponseConverter.Settings);
    }

    internal static class RatesResponseConverter
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