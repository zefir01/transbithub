using System;
using System.IO;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using Google.Protobuf;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Protos.TradeApi.V1;

namespace WebhookTest.Controllers
{
    [Produces(MediaTypeNames.Application.Json)]
    [ApiController]
    [Route("/")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Post()
        {
            string body;
            using (StreamReader reader
                = new StreamReader(HttpContext.Request.Body, Encoding.UTF8, true, 1024, true))
            {
                body = await reader.ReadToEndAsync();
            }
            Console.WriteLine(body);
            
            Google.Protobuf.JsonParser parser = new JsonParser(JsonParser.Settings.Default);
            var formatter = new Google.Protobuf.JsonFormatter(JsonFormatter.Settings.Default);
            var payment = parser.Parse<InvoicePayment>(body);

            var secretsList = new InvoiceSecretsList();
            var secret=new InvoiceSecret
            {
                Order = 0,
                Id = 0,
                PaymentIdIsNull = true,
                Text = "test1",
                Url = "https://localhost:50090"
            };
            secret.Images.Add("https://localhost:50090/image");
            secretsList.Secrets.Add(secret);
            var json=formatter.Format(secretsList);
            return Content(json);
        }
    }
}