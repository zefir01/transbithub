using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Castle.Core.Internal;
using Newtonsoft.Json;

// ReSharper disable InconsistentNaming
// ReSharper disable UnusedMember.Global

namespace CoreLib.Sms
{
    public enum MessageStatus
    {
        /// <summary> ожидает отправки </summary>
        pending,
        /// <summary> приостановлено </summary>
        paused,
        /// <summary> в обработке </summary>
        processing,
        /// <summary> отправлено </summary>
        sent,
        /// <summary> доставлено </summary>
        delivered,
        /// <summary> просмотрено </summary>
        seen,
        /// <summary> ошибка при обработке/отправке сообщения </summary>
        failed,

        False
    }
    public class Sigmasms
    {
        private static string token;
        private readonly string username = "Zefir01";
        private readonly string password = "j5a0lopo";
        private readonly Config config;

        public Sigmasms(Config config)
        {
            this.config = config;
        }

        private HttpClient GetClient()
        {
            HttpClientHandler handler=new HttpClientHandler();
            if (!config.ProxyUrl.IsNullOrEmpty())
            {
                handler.Proxy=new WebProxy
                {
                    Address = new Uri(config.ProxyUrl),
                    BypassProxyOnLocal = true,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(config.ProxyUser, config.ProxyPass)
                };
            }
            
            var client = new HttpClient(handler);
            return client;
        }
        private async Task<string> GetTokenAsync()
        {
            var content = JsonConvert.SerializeObject(new
            {
                username,
                password
            });
            var stringContent = new StringContent(content, Encoding.UTF8, "application/json");

            var request = new HttpRequestMessage(HttpMethod.Post, "https://online.sigmasms.ru/api/login");
            request.Content = stringContent;
            
            var client = GetClient();
            var response = await client.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();
            if (response.StatusCode == HttpStatusCode.OK)
            {
                dynamic result = JsonConvert.DeserializeObject(responseContent);
                return (string)result.token;
            }

            return null;
        }
        private bool IsTokenIExpired()
        {
            var jwt = new JwtSecurityToken(token);
            return jwt.ValidTo < DateTime.UtcNow;
        }
        private async Task<Guid?> SendSms(string phone, string text)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "https://online.sigmasms.ru/api/sendings");
            request.Headers.Add("Authorization", token);
            var content = JsonConvert.SerializeObject(new
            {
                recipient = phone,
                type = "sms",
                payload = new
                {
                    // убедитесь, что имя отправителя добавлено в ЛК в разделе Компоненты ( https://online.sigmasms.ru/#/components )
                    sender = "B-Media", text
                }
            });
            request.Content = new StringContent(content, Encoding.UTF8, "application/json");

            HttpClient client = null;
            try
            {
                client = GetClient();
                var response = await client.SendAsync(request);
                var resonseContent = await response.Content.ReadAsStringAsync();
                var result = JsonConvert.DeserializeAnonymousType(resonseContent, new
                {   // минимальный набор параметров для получения ответа
                    Id = default(Guid?),
                    Recipient = default(string),
                    Status = default(string),
                    Error = default(string)
                });

                if (response.StatusCode == HttpStatusCode.OK &&
                    result.Id != null)
                {
                    return result.Id;
                }
            }
            finally
            {
                client?.Dispose();
            }
            return null;
        }

        public async Task<Guid?> Send(string phone, string text)
        {
            if (string.IsNullOrEmpty(token) || IsTokenIExpired())
                token = await GetTokenAsync();

            if (!phone.StartsWith("+"))
                phone = "+" + phone;

            return await SendSms(phone, text);
        }

        // ReSharper disable once UnusedMember.Local
        private async Task<MessageStatus> GetStatus(Guid messageId)
        {
            var url = new Uri("https://online.sigmasms.ru/api/sendings/");
            var request = new HttpRequestMessage(HttpMethod.Get, new Uri(url, messageId.ToString()));
            request.Headers.Add("Authorization", token);

            HttpClient client = null;
            try
            {
                client = GetClient();
                var response = await client.SendAsync(request);
                var content = await response.Content.ReadAsStringAsync();
                var result = JsonConvert.DeserializeAnonymousType(content, new
                {
                    Id = default(Guid?),
                    ChainId = default(Guid?),
                    State = new
                    {
                        Status = default(MessageStatus),
                        Error = default(string)
                    },
                    // error
                    Error = default(string),
                    Message = default(string)
                });

                if (response.StatusCode == HttpStatusCode.OK &&
                    result.Id != null)
                {
                    return result.State?.Status ?? MessageStatus.False;
                }
            }
            finally
            {
                client?.Dispose();
            }
            return MessageStatus.False;
        }
    }
}
