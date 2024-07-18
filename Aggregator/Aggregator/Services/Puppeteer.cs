using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PuppeteerExtraSharp;
using PuppeteerExtraSharp.Plugins.ExtraStealth;
using PuppeteerSharp;

namespace Aggregator.Services
{
    public class Puppeteer: IDisposable
    {
        private readonly string proxy;
        private readonly Browser browser;
        private bool waited;

        public Puppeteer(string proxy, bool headless = true)
        {
            this.proxy = proxy;
            var extra = new PuppeteerExtra();
            extra.Use(new StealthPlugin());
            browser = extra.LaunchAsync(new LaunchOptions
            {
                Headless = headless,
                Args = proxy.IsNullOrEmpty()
                    ? new[] {"--start-maximized", "--no-sandbox"}
                    : new[] {$"--proxy-server={proxy}", "--start-maximized", "--no-sandbox"},
                ExecutablePath = "/usr/bin/google-chrome-stable",
                DefaultViewport = null,
            }).ConfigureAwait(false).GetAwaiter().GetResult();
        }

        public async Task<Page> GetPage(string url, bool wait = false)
        {
            var page = await browser.NewPageAsync();
            await page.GoToAsync(url);
            if (wait || !waited)
                await page.WaitForTimeoutAsync(10000);
            waited = true;
            return page;
        }

        public async Task<List<string>> GetLinks(Page page)
        {
            var jsSelectAllAnchors = @"Array.from(document.querySelectorAll('a')).map(a => a.href);";
            var urls = await page.EvaluateExpressionAsync<string[]>(jsSelectAllAnchors);
            return urls.ToList();
        }

        public async Task<List<string>> GetLinks(Frame page)
        {
            var jsSelectAllAnchors = @"Array.from(document.querySelectorAll('a')).map(a => a.href);";
            var urls = await page.EvaluateExpressionAsync<string[]>(jsSelectAllAnchors);
            return urls.ToList();
        }

        public static async Task<string?> GetText(ElementHandle? element)
        {
            if (element == null)
                return null;
            var property = await element.GetPropertyAsync("textContent");
            var value = await property.JsonValueAsync();
            var text = value?.ToString();
            return text;
        }

        public void Dispose()
        {
            browser.Dispose();
        }
    }
}