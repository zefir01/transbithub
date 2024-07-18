using System;
using System.Globalization;
using System.IO;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Telegram.Bot.Types;
using TelegramService.Services;

namespace TelegramNotify.Services
{
    [Produces(MediaTypeNames.Application.Json)]
    [ApiController]
    [Route("telegram-notify")]
    public class TgmController: ControllerBase
    {
        private readonly Manager manager;
        private readonly ILogger<TgmController> logger;
        public TgmController(Manager manager, ILogger<TgmController> logger)
        {
            this.manager = manager;
            this.logger = logger;
        }
        
        private static readonly JsonSerializerSettings Settings = new JsonSerializerSettings
        {
            MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
            DateParseHandling = DateParseHandling.None,
            Converters =
            {
                new IsoDateTimeConverter { DateTimeStyles = DateTimeStyles.AssumeUniversal }
            },
        };

        // POST api/update
        [HttpPost]
        public async Task<IActionResult> Post()
        {
            string body;
            using (StreamReader reader
                = new StreamReader(HttpContext.Request.Body, Encoding.UTF8, true, 1024, true))
            {
                body = await reader.ReadToEndAsync();
            }
            logger.LogDebug(body);
            
            var update = JsonConvert.DeserializeObject<Update>(body, Settings);
            manager.OnUpdate(update);

            return Ok();
        }
    }
}