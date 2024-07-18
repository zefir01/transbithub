using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Castle.Core.Internal;
using Newtonsoft.Json;

namespace CoreLib.Sms
{
    public class SmsC
    {
        //https://smsc.ru/sys/send.php?login=<login>&psw=<password>&phones=<phones>&mes=<message> 
        private readonly IProxyConfig config;

        public SmsC(IProxyConfig config)
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
        public async Task SendAsync(string phone, string text, string smsUser, string smsPass)
        {
            string url = $"https://smsc.ru/sys/send.php?login={smsUser}&psw={smsPass}&phones={phone}&mes={text}&fmt=3&charset=utf-8";
            var request = new HttpRequestMessage(HttpMethod.Get, url);
            var client = GetClient();
            var response = await client.SendAsync(request);
            var resonseContent = await response.Content.ReadAsStringAsync();
            // ReSharper disable once UnusedVariable
            var result = JsonConvert.DeserializeAnonymousType(resonseContent, new
            {   // минимальный набор параметров для получения ответа
                id = default(long),
                cnt = default(int)
            });
        }
    }
}
