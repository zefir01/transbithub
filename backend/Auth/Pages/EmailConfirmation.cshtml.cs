using System;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Auth.Entitys;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Auth.Pages
{
    public class EmailConfirmationModel : PageModel
    {
        public bool IsConfirmed { get; set; }
        private UserManager<ApplicationUser> userManager;
        public Config Config { get; }

        public EmailConfirmationModel(UserManager<ApplicationUser> userManager, Config config)
        {
            this.userManager = userManager;
            Config = config;
        }

        public async Task OnGet()
        {
            try
            {
                var token = HttpContext.Request.Query["token"];
                if (string.IsNullOrEmpty(token))
                    return;
                var token64 = Convert.FromBase64String(token);
                token = Encoding.UTF8.GetString(token64);
                var userId = HttpContext.Request.Query["user"];
                if (string.IsNullOrEmpty(userId))
                    return;
                var user64 = Convert.FromBase64String(userId);
                userId = Encoding.UTF8.GetString(user64);
                userId = WebUtility.UrlDecode(userId);
                var user = await userManager.FindByIdAsync(userId);
                var res = await userManager.ConfirmEmailAsync(user, token);
                IsConfirmed = res.Succeeded;
            }
            catch
            {
                IsConfirmed = false;
            }
        }
    }
}