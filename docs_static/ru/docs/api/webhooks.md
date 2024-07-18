title: API Transbithub работа с вебхуками
description: Обработка вебхуков Transbithub, пример на Net.Core


#Вебхуки

Вот пример контроллера сервиса, который принимает вебхуки, на Net.Core:

```csharp
namespace WebhookTest.Controllers
{
    [Produces(MediaTypeNames.Application.Json)]
    [ApiController]
    [Route("/")]
    public class TestController : ControllerBase
    {
        private readonly ILogger<TestController> _logger;

        public TestController(ILogger<TestController> logger)
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
            //создаем секрет, и добавляем в него изображение по адресу https://localhost:50090/image
            secret.Images.Add("https://localhost:50090/image");
            secretsList.Secrets.Add(secret);
            var json=formatter.Format(secretsList);
            return Content(json);
        }
    }
```

Изображение будет загружено на сервер и показано клиенту в составе секрета.

Обратите внимение:
```
Google.Protobuf.JsonParser parser = new JsonParser(JsonParser.Settings.Default);
var formatter = new Google.Protobuf.JsonFormatter(JsonFormatter.Settings.Default);
```
Тут мы используем parser и formatter для Grpc сообщений. т.е. Json схема контролируется через Grpc.
Вы можете реализовать такой механизм на любом языке.  
