using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace CoreLib.Entitys
{
    public class ReCaptchaResponse
    {
        [JsonProperty("success", Required = Required.Always)]
        public bool Success { get; set; }
        [JsonProperty("challenge_ts", Required = Required.Default)]
        [JsonConverter(typeof(ESDateTimeConverter))]
        // ReSharper disable once InconsistentNaming
        public DateTime ChallengeTS { get; set; }
        [JsonProperty("hostname", Required = Required.Default)]
        public string Hostname { get; set; }
        [JsonProperty("score", Required = Required.Default)]
        public decimal Score { get; set; }
        [JsonProperty("action", Required = Required.Default)]
        public string Action { get; set; }
        [JsonProperty("error-codes")]
        public string[] ErrorCodes { get; set; }
    }

    // ReSharper disable once InconsistentNaming
    public class ESDateTimeConverter : IsoDateTimeConverter
    {
        //2019-08-20T12:07:04Z
        public ESDateTimeConverter()
        {
            DateTimeFormat = "yyyy-MM-ddTHH:mm:ss.fffZ";
        }
    }
}
