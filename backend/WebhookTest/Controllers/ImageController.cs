using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace WebhookTest.Controllers
{
    [ApiController]
    [Route("/image")]
    public class ImageController: ControllerBase
    {
        public async Task<IActionResult> DownloadImage()
        {
            var path = Path.GetFullPath("/home/pstukalov/RiderProjects/backend/WebhookTest/1e1afc02-10da-4041-bea1-1368d8bc7289.jpg");
            MemoryStream memory = new MemoryStream();
            using (FileStream stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, "image/jpeg", Path.GetFileName(path));
        }
    }
}