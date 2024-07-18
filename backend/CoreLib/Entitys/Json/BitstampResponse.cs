using System;
using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace CoreLib.Entitys.Json
{
    public partial class BitstampResponse
    {
        [JsonProperty("last")]
        public string Last { get; set; }

        [JsonProperty("timestamp")]
        [JsonConverter(typeof(BitstampResponseParseStringConverter))]
        public long Timestamp { get; set; }
    }

    public partial class BitstampResponse
    {
        public static BitstampResponse FromJson(string json) => JsonConvert.DeserializeObject<BitstampResponse>(json, BitstampResponseConverter.Settings);
    }

    public static class BitstampResponseSerialize
    {
        public static string ToJson(this BitstampResponse self) => JsonConvert.SerializeObject(self, BitstampResponseConverter.Settings);
    }

    internal static class BitstampResponseConverter
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

    internal class BitstampResponseParseStringConverter : JsonConverter
    {
        public override bool CanConvert(Type t) => t == typeof(long) || t == typeof(long?);

        public override object ReadJson(JsonReader reader, Type t, object existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.Null) return null;
            var value = serializer.Deserialize<string>(reader);
            if (Int64.TryParse(value, out var l))
            {
                return l;
            }
            throw new Exception("Cannot unmarshal type long");
        }

        public override void WriteJson(JsonWriter writer, object untypedValue, JsonSerializer serializer)
        {
            if (untypedValue == null)
            {
                serializer.Serialize(writer, null);
                return;
            }
            var value = (long)untypedValue;
            serializer.Serialize(writer, value.ToString());
        }

        public static readonly BitstampResponseParseStringConverter Singleton = new BitstampResponseParseStringConverter();
    }
}
