using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using PuppeteerSharp;

namespace Aggregator.Services.BitZlato
{
    public class Parser : IDisposable
    {
        private readonly ILogger<Parser> logger;
        private readonly Page page;
        private Frame frame;
        private readonly Puppeteer puppeteer;

        public Parser(ILogger<Parser> logger, Config config)
        {
            this.logger = logger;
            puppeteer = new Puppeteer(config.Proxy, config.HeadLess);
            page = puppeteer.GetPage("https://bitzlato.bz/p2p?currency=RUB", true)
                .ConfigureAwait(false).GetAwaiter().GetResult();
            frame = page.MainFrame;
        }

        private const string PagesXPath =
            "/html/body/div/div/div/div[1]/div[2]/div[2]/div[3]/div/div[3]/span[2]/text()[2]";

        public async Task ParseAdTable()
        {
            //*[@id="root"]/div/div/div[1]/div[2]/div[2]/div[2]/div[2]/div[1]/div[2]/a
            var rows = await frame.XPathAsync("/html/body/div/div/div/div[1]/div[2]/div[2]/div[2]/div");
            bool isHeader = false;
            foreach (var row in rows)
            {
                if (!isHeader)
                {
                    isHeader = true;
                    continue;
                }

                var activeClass = await row.XPathAsync("div[1]/div[2]/div[1]/div[1]/@class").GetText();
                var time = await row.XPathAsync("div[1]/div[2]/div[1]/div[1]/@title").GetText();
                var traderName = await row.XPathAsync("div[1]/div[2]/a/text()").GetText();
                var traderLink = await row.XPathAsync("div[1]/div[2]/a/@href").GetText();
                var paymentType = await row.XPathAsync("div[2]/text()").GetText();
                var price = await row.XPathAsync("div[3]/text()").GetText();
                var limits = await row.XPathAsync("div[4]/text()").GetText();
                var adLink = await row.XPathAsync("div[5]/a/@href").GetText();

                logger.LogDebug($"activeClass: {activeClass}");
                logger.LogDebug($"time: {time}");
                logger.LogDebug($"traderName: {traderName}");
                logger.LogDebug($"traderLink: {traderLink}");
                logger.LogDebug($"paymentType: {paymentType}");
                logger.LogDebug($"price: {price}");
                logger.LogDebug($"limits: {limits}");
                logger.LogDebug($"adLink: {adLink}");
            }
        }

        public async Task<(
            string? price,
            string? activeClass,
            string? traderName,
            string? tradeLink,
            string? rating,
            string? positiveFeedbacks,
            string? negativeFeedbacks,
            string? limitsFiat,
            string? limitsCrypto,
            string? terms
            )> ParseAdPage()
        {
            var price = await frame.XPathAsync(
                "/html/body/div/div/div/div[1]/div/div[2]/div[1]/div/div/div[2]/div[1]/div[2]/text()").GetText();
            var activeClass = await frame
                .XPathAsync(
                    "/html/body/div/div/div/div[1]/div/div[2]/div[1]/div/div/div[2]/div[2]/div[2]/div[1]/div[1]/@class")
                .GetText();
            var traderName = await frame
                .XPathAsync("/html/body/div/div/div/div[1]/div/div[2]/div[1]/div/div/div[2]/div[2]/div[2]/div/a/text()")
                .GetText();
            var tradeLink = await frame
                .XPathAsync("/html/body/div/div/div/div[1]/div/div[2]/div[1]/div/div/div[2]/div[2]/div[2]/div/a/@href")
                .GetText();
            var rating = await frame
                .XPathAsync(
                    "/html/body/div/div/div/div[1]/div/div[2]/div[1]/div/div/div[2]/div[2]/div[2]/p[2]/text()[3]")
                .GetText();
            var positiveFeedbacks = await frame
                .XPathAsync(
                    "/html/body/div/div/div/div[1]/div/div[2]/div[1]/div/div/div[2]/div[2]/div[2]/p[2]/span[1]")
                .GetText();
            var negativeFeedbacks = await frame
                .XPathAsync(
                    "/html/body/div/div/div/div[1]/div/div[2]/div[1]/div/div/div[2]/div[2]/div[2]/p[2]/span[2]")
                .GetText();
            if (positiveFeedbacks != null)
            {
                positiveFeedbacks = positiveFeedbacks.Replace("\n", "");
                positiveFeedbacks = positiveFeedbacks.Replace(" ", "");
            }

            if (negativeFeedbacks != null)
            {
                negativeFeedbacks = negativeFeedbacks.Replace("\n", "");
                negativeFeedbacks = negativeFeedbacks.Replace(" ", "");
            }

            var limitsFiat = await frame
                .XPathAsync("/html/body/div/div/div/div[1]/div/div[2]/div[1]/div/div/div[2]/div[3]/div[2]/p[1]/text()")
                .GetText();
            var limitsCrypto = await frame
                .XPathAsync("/html/body/div/div/div/div[1]/div/div[2]/div[1]/div/div/div[2]/div[3]/div[2]/p[2]/text()")
                .GetText();
            var terms = await frame
                .XPathAsync("/html/body/div/div/div/div[1]/div/div[2]/div[2]/div[2]/div[2]/span").GetText();

            logger.LogDebug($"{nameof(price)}: {price}");
            logger.LogDebug($"{nameof(activeClass)}: {activeClass}");
            logger.LogDebug($"{nameof(traderName)}: {traderName}");
            logger.LogDebug($"{nameof(tradeLink)}: {tradeLink}");
            logger.LogDebug($"{nameof(rating)}: {rating}");
            logger.LogDebug($"{nameof(positiveFeedbacks)}: {positiveFeedbacks}");
            logger.LogDebug($"{nameof(negativeFeedbacks)}: {negativeFeedbacks}");
            logger.LogDebug($"{nameof(limitsFiat)}: {limitsFiat}");
            logger.LogDebug($"{nameof(limitsCrypto)}: {limitsCrypto}");
            logger.LogDebug($"{nameof(terms)}: {terms}");

            return (
                price,
                activeClass,
                traderName,
                tradeLink,
                rating,
                positiveFeedbacks,
                negativeFeedbacks,
                limitsFiat,
                limitsCrypto,
                terms
            );
        }


        public async Task<(
            string? rating,
            string? positiveFeedbacks,
            string? negativeFeedbacks,
            string? completedDeals,
            string? canceledDeals,
            string? years,
            List<string> stats,
            string? trustedCount,
            string? loose
            )> ParseTraderPage()
        {
            var rating = await frame
                .XPathAsync("/html/body/div/div/div/div/div[1]/div[2]/div/div[2]/div[2]/span/text()").GetText();
            var positiveFeedbacks = await frame
                .XPathAsync("/html/body/div/div/div/div/div[1]/div[2]/div/div[4]/div[2]/span/span[1]/text()").GetText();
            var negativeFeedbacks = await frame
                .XPathAsync("/html/body/div/div/div/div/div[1]/div[2]/div/div[4]/div[2]/span/span[2]/text()").GetText();
            var completedDeals = await frame
                .XPathAsync("/html/body/div/div/div/div/div[1]/div[2]/div/div[5]/div[2]/text()").GetText();
            var canceledDeals = await frame
                .XPathAsync("/html/body/div/div/div/div/div[1]/div[2]/div/div[6]/div[2]/text()").GetText();
            var years = await frame.XPathAsync("/html/body/div/div/div/div/div[1]/div[2]/div/div[8]/div[1]/text()[1]")
                .GetText();
            var stats = new List<string>();
            var statsElements =
                await frame.XPathAsync("/html/body/div/div/div/div/div[1]/div[2]/div/div[8]/div[2]/div");
            foreach (var stat in statsElements)
            {
                var value = await stat.XPathAsync("text()").GetText();
                if (value != null)
                    stats.Add(value);
            }

            var trustedCount = await frame
                .XPathAsync("/html/body/div/div/div/div/div[1]/div[2]/div/div[9]/div[2]/text()").GetText();
            var loose = await frame.XPathAsync("/html/body/div/div/div/div/div[1]/div[2]/div/div[7]/div[2]/text()")
                .GetText();

            logger.LogDebug($"{nameof(rating)}: {rating}");
            logger.LogDebug($"{nameof(positiveFeedbacks)}: {positiveFeedbacks}");
            logger.LogDebug($"{nameof(negativeFeedbacks)}: {negativeFeedbacks}");
            logger.LogDebug($"{nameof(completedDeals)}: {completedDeals}");
            logger.LogDebug($"{nameof(canceledDeals)}: {canceledDeals}");
            logger.LogDebug($"{nameof(years)}: {years}");
            foreach (var stat in stats)
                logger.LogDebug($"{nameof(stat)}: {stat}");
            logger.LogDebug($"{nameof(trustedCount)}: {trustedCount}");
            logger.LogDebug($"{nameof(loose)}: {loose}");

            return (
                rating,
                positiveFeedbacks,
                negativeFeedbacks,
                completedDeals,
                canceledDeals,
                years,
                stats,
                trustedCount,
                loose
            );
        }

        public async Task GoPage(string url)
        {
            Response? resp = null;
            int counter = 0;
            while (resp == null || !resp.Ok)
            {
                try
                {
                    resp = await page.GoToAsync(url);
                }
                catch (NavigationException e)
                {
                    logger.LogError(e, e.Message);
                    resp = null;
                }

                if (resp == null || !resp.Ok)
                {
                    logger.LogWarning($"BitZlato response not OK. URL: {url} Response: {resp?.StatusText}");
                    if (counter >= 3)
                    {
                        logger.LogError($"BitZlato attempts ends with errors. URL: {url}");
                        throw new Exception($"BitZlato attempts ends with errors. URL: {url}");
                    }

                    counter++;
                    await Task.Delay(10 * 1000);
                }
            }

            var options = new WaitForSelectorOptions
            {
                Timeout = 60 * 1000
            };
            await page.WaitForXPathAsync("/html/body/div/header/div/div[1]/div[1]/a/img", options);

            frame = resp.Frame;
        }

        public void Dispose()
        {
            page.Dispose();
            puppeteer.Dispose();
        }
    }
}