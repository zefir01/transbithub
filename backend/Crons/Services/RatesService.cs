using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Entitys;
using CoreLib.Entitys.Invoices;
using CoreLib.Entitys.Json;
using CoreLib.Services;
using Crons.Json;
using IdentityServer4.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

#pragma warning disable 1998

namespace Crons.Services
{
    public class RatesService : IHostedService
    {
        private readonly ILogger<RatesService> logger;
        private readonly string token;
        private readonly IServiceProvider serviceProvider;
        private readonly Config config;
        private readonly VariablesRetranslator retranslator;
        private Task task;
        private readonly CancellationTokenSource tokenSource = new CancellationTokenSource();
        private readonly int delayMin;

        public RatesService(ILogger<RatesService> logger, IServiceProvider serviceProvider, Config config,
            VariablesRetranslator retranslator)
        {
            this.logger = logger;
            this.serviceProvider = serviceProvider;
            this.config = config;
            this.retranslator = retranslator;
            token = config.RatesToken;
            delayMin = config.RatesDelayMinutes;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            VariablesMetadata data;
            using (var scope = serviceProvider.CreateScope())
            {
                var db = scope.ServiceProvider.GetService<DataDBContext>();
                data = await db.VariablesMetadata.FirstOrDefaultAsync(cancellationToken: cancellationToken);
            }

            TimeSpan t = TimeSpan.Zero;
            if (data != null)
                t = DateTime.Now - data.UpdatedAt;
            else
                t = TimeSpan.MaxValue;

            if (t >= TimeSpan.FromMinutes(delayMin))
                t = TimeSpan.Zero;
            else
                t = TimeSpan.FromMinutes(delayMin) - t;


            task = Worker(t);
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            tokenSource.Cancel();
            task.Wait(cancellationToken);
        }

        private async Task Worker(TimeSpan startDelay)
        {
            await Task.Delay(startDelay);
            while (!tokenSource.IsCancellationRequested)
            {
                try
                {
                    await DoWork();
                }
                catch
                {
                    // ignored
                }

                await Task.Delay(TimeSpan.FromMinutes(delayMin));
            }
        }

        private async Task DoWork()
        {
            logger.LogDebug("Start rates work task");
            Dictionary<Catalog.CryptoExchangeVariables, decimal> cryptoRates =
                new Dictionary<Catalog.CryptoExchangeVariables, decimal>();
            Dictionary<Catalog.Currencies, decimal> fiatRates = new Dictionary<Catalog.Currencies, decimal>();
            try
            {
                fiatRates = await GetFiatRates();
                logger.LogDebug("Fiat rates get done");
            }
            catch (Exception e)
            {
                logger.LogError("Error in get rates: " + e.Message);
            }

            try
            {
                foreach (var rate in await BitfinexRates())
                    cryptoRates.Add(rate.Key, rate.Value);
            }
            catch (Exception e)
            {
                logger.LogError("Error in get rates: " + e.Message);
            }

            try
            {
                foreach (var rate in await GetBistampRates())
                    cryptoRates.Add(rate.Key, rate.Value);
            }
            catch (Exception e)
            {
                logger.LogError("Error in get rates: " + e.Message);
            }

            try
            {
                foreach (var rate in await GetBinanceRates())
                    cryptoRates.Add(rate.Key, rate.Value);
            }
            catch (Exception e)
            {
                logger.LogError("Error in get rates: " + e.Message);
            }

            try
            {
                foreach (var rate in await GetBkexRates())
                    cryptoRates.Add(rate.Key, rate.Value);
            }
            catch (Exception e)
            {
                logger.LogError("Error in get rates: " + e.Message);
            }

            try
            {
                foreach (var rate in await MxcRates())
                    cryptoRates.Add(rate.Key, rate.Value);
            }
            catch (Exception e)
            {
                logger.LogError("Error in get rates: " + e.Message);
            }

            try
            {
                foreach (var rate in await BittrexRates())
                    cryptoRates.Add(rate.Key, rate.Value);
            }
            catch (Exception e)
            {
                logger.LogError("Error in get rates: " + e.Message);
            }

            using var scope = serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<DataDBContext>();
            var calculator = scope.ServiceProvider.GetRequiredService<Calculator>();
            await UpdateVariables(cryptoRates, fiatRates, db, calculator, tokenSource.Token);
            await db.SaveChangesAsync(tokenSource.Token);


            logger.LogWarning("Variables updated.");
        }

        private async Task UpdateVariables(Dictionary<Catalog.CryptoExchangeVariables, decimal> cryptoRates,
            Dictionary<Catalog.Currencies, decimal> fiatRates,
            DataDBContext db, Calculator calculator, CancellationToken cancellationToken)
        {
            List<CryptoExchangeVariable> cryptoVars = new List<CryptoExchangeVariable>();
            List<FiatExchangeVariable> fiatVars = new List<FiatExchangeVariable>();
            foreach (var pair in cryptoRates)
            {
                var v = await db.CryptoExchangeVariables
                    .FirstOrDefaultAsync(p => p.Key == pair.Key,
                        cancellationToken: cancellationToken);
                if (v == null)
                {
                    v = new CryptoExchangeVariable
                    {
                        Key = pair.Key,
                        Value = Math.Round(pair.Value, 2)
                    };
                    await db.CryptoExchangeVariables.AddAsync(v, cancellationToken);
                }
                else
                    v.Value = Math.Round(pair.Value, 2);

                cryptoVars.Add(v);
            }

            foreach (var pair in fiatRates)
            {
                var v = await db.FiatExchangeVariables
                    .FirstOrDefaultAsync(p => p.Key == pair.Key,
                        cancellationToken: cancellationToken);
                if (v == null)
                {
                    v = new FiatExchangeVariable
                    {
                        Key = pair.Key,
                        Value = Math.Round(pair.Value, 2)
                    };
                    await db.FiatExchangeVariables.AddAsync(v, cancellationToken);
                }
                else
                    v.Value = Math.Round(pair.Value, 2);

                fiatVars.Add(v);
            }

            var avgPrices = await CalcAvgPrices(cryptoVars, fiatVars, db, cancellationToken);

            var data = await db.VariablesMetadata.FirstOrDefaultAsync(cancellationToken);
            if (data == null)
            {
                data = new VariablesMetadata
                {
                    UpdatedAt = DateTime.Now
                };
                await db.VariablesMetadata.AddAsync(data, cancellationToken);
            }
            else
            {
                data.UpdatedAt = DateTime.Now;
            }

            await db.SaveChangesAsync(cancellationToken);

            retranslator.Send(await db.FiatExchangeVariables.ToListAsync(cancellationToken)
                , await db.CryptoExchangeVariables.ToListAsync(cancellationToken),
                await db.AvgPrices.ToListAsync(cancellationToken));

            List<long> adsIds;
            List<long> invoicesIds;
            var regex = new Regex("[a-zA-Z]+");
            using (var scope = serviceProvider.CreateScope())
            {
                var db1 = scope.ServiceProvider.GetRequiredService<DataDBContext>();
                adsIds = db1.Advertisements
                    .Include(p => p.Metadata)
                    .Include(p => p.TimeTable)
                    .Include(p => p.Owner).ThenInclude(p => p.Balance)
                    .Where(p => p.IsEnabled && !p.IsDeleted)
                    .ToList()
                    .Where(p => regex.Matches(p.Equation).Count > 0)
                    .Select(p => p.Id)
                    .ToList();
                invoicesIds = await db1.Invoices.Where(p => !p.IsBaseCrypto && p.Status == InvoiceStatus.Active)
                    .Select(p => p.Id)
                    .ToListAsync(cancellationToken: cancellationToken);
            }

            calculator.UpdateVars(cryptoVars, fiatVars, avgPrices);


            Parallel.ForEach(adsIds, async id =>
            {
                try
                {
                    // ReSharper disable once ParameterHidesMember
                    await MyExtensions.ConcurrentRetries(async (token, scope) =>
                    {
                        // ReSharper disable once VariableHidesOuterVariable
                        var db = scope.ServiceProvider.GetRequiredService<DataDBContext>();
                        db.Calculator = scope.ServiceProvider.GetRequiredService<Calculator>();
                        var ad = await db.Advertisements.FirstOrDefaultAsync(p => p.Id == id, token);
                        if (ad == null)
                            return Task.FromResult(false);
                        await ad.Metadata.Update(true);
                        await db.SaveChangesAsync(cancellationToken);
                        return Task.FromResult(true);
                    }, serviceProvider, 1, tokenSource.Token, null, "Rates ads", logger);
                }
                catch (Exception e)
                {
                    logger.LogError(e, "Rates ads error: " + e.Message);
                }
            });

            Parallel.ForEach(invoicesIds, async id =>
            {
                try
                {
                    // ReSharper disable once ParameterHidesMember
                    await MyExtensions.ConcurrentRetries(async (token, scope) =>
                    {
                        // ReSharper disable once VariableHidesOuterVariable
                        var db = scope.ServiceProvider.GetRequiredService<DataDBContext>();
                        db.Calculator = scope.ServiceProvider.GetRequiredService<Calculator>();
                        var invoice = await db.Invoices.FirstOrDefaultAsync(p => p.Id == id, token);
                        if (invoice == null)
                            return Task.FromResult(false);
                        await invoice.UpdatePrices();
                        await db.SaveChangesAsync(cancellationToken);
                        return Task.FromResult(true);
                    }, serviceProvider, 1, tokenSource.Token, null, "Rates invoices", logger);
                }
                catch (Exception e)
                {
                    logger.LogError(e, "Rates invoices error: " + e.Message);
                }
            });
        }

        private static readonly Func<DataDBContext, Catalog.Currencies, IQueryable<decimal>>
            getAvg =
                (db, fiat) => from deal in db.Deals
                    where deal.Ad.FiatCurrency == fiat
                          && deal.Status == DealStatus.Completed
                          && deal.CompletedAt.HasValue
                          && deal.CompletedAt.Value > DateTime.Now.AddMinutes(-5)
                    select deal.FiatAmount / deal.CryptoAmount
                    into price
                    group price by 1
                    into prices
                    select prices.Average();

        private async Task<List<AvgPrice>> CalcAvgPrices(List<CryptoExchangeVariable> cryptoVars,
            List<FiatExchangeVariable> fiatVars, DataDBContext db, CancellationToken cancellationToken)
        {
            List<AvgPrice> prices = new List<AvgPrice>();
            foreach (Catalog.Currencies fiat in Enum.GetValues(typeof(Catalog.Currencies)))
            {
                var avg = await db.AvgPrices.FirstOrDefaultAsync(p => p.FiatCurrency == fiat,
                    cancellationToken: cancellationToken);
                decimal price = default;
                if (getAvg(db, fiat).Any())
                    price = await getAvg(db, fiat).FirstOrDefaultAsync(cancellationToken: cancellationToken);
                if (price == default)
                {
                    var temp = cryptoVars
                        .First(p => p.Key == Config.DefaultCryptoExchangeVariables);
                    price = temp.Value;
                    if (fiat != Catalog.Currencies.USD)
                    {
                        try
                        {
                            var rate = fiatVars.First(p => p.Key == fiat);
                            price = Math.Round(price * rate.Value, 2);
                        }
                        catch (Exception)
                        {
                            logger.LogError($"Rates for {fiat} not found.");
                            continue;
                        }
                    }
                }

                if (avg == null)
                {
                    avg = new AvgPrice
                    {
                        FiatCurrency = fiat,
                        Value = Math.Round(price, 2)
                    };
                    await db.AvgPrices.AddAsync(avg, cancellationToken);
                }
                else
                {
                    avg.Value = Math.Round(price, 2);
                }

                prices.Add(avg);
            }

            return prices;
        }

        private async Task<Dictionary<Catalog.Currencies, decimal>> GetFiatRates()
        {
            //https://app.exchangerate-api.com/dashboard
            HttpResponseMessage res =
                await GetWithProxy($"https://v6.exchangerate-api.com/v6/{token}/latest/USD");
            if (res.StatusCode != HttpStatusCode.OK)
            {
                logger.LogError("Unable to get fiat rates.");
                logger.LogError(res.ReasonPhrase);
                logger.LogError(res.StatusCode.ToString());
                throw new WebException("Unable to get fiat rates.");
            }

            var content = await res.Content.ReadAsStringAsync();
            var json = ExchangeRates.FromJson(content);
            var errors = json.ConversionRates.Where(p => !Catalog.CurrenciesList.Contains(p.Key));
            foreach (var error in errors)
                logger.LogError($"{error.Key} fiat currency not found in Catalog.");
            var dict = json.ConversionRates
                .Where(p => Catalog.CurrenciesList.Contains(p.Key))
                .ToDictionary(k => Enum.Parse<Catalog.Currencies>(k.Key)
                    , v => Math.Round(Convert.ToDecimal(v.Value), 2));
            return dict;
        }

        private async Task<Dictionary<Catalog.CryptoExchangeVariables, decimal>> GetBistampRates()
        {
            var res = await GetWithProxy("https://www.bitstamp.net/api/ticker/");
            var content = await res.Content.ReadAsStringAsync();
            var json = BitstampResponse.FromJson(content);
            return new Dictionary<Catalog.CryptoExchangeVariables, decimal>
            {
                {Catalog.CryptoExchangeVariables.bitstamp_usd, decimal.Parse(json.Last)}
            };
        }

        private async Task<Dictionary<Catalog.CryptoExchangeVariables, decimal>> GetBinanceRates()
        {
            var res = await GetWithProxy("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
            var content = await res.Content.ReadAsStringAsync();
            var json = BinanceResponse.FromJson(content);
            return new Dictionary<Catalog.CryptoExchangeVariables, decimal>
            {
                {Catalog.CryptoExchangeVariables.binance_usd, decimal.Parse(json.Price)}
            };
        }

        private async Task<Dictionary<Catalog.CryptoExchangeVariables, decimal>> GetBkexRates()
        {
            var res = await GetWithProxy("https://api.bkex.com/v1/q/ticker/price?pair=BTC_USDT");
            var content = await res.Content.ReadAsStringAsync();
            var json = BkexResponse.FromJson(content);
            return new Dictionary<Catalog.CryptoExchangeVariables, decimal>
            {
                {Catalog.CryptoExchangeVariables.bkex_usd, json.Data.Price}
            };
        }

        private async Task<Dictionary<Catalog.CryptoExchangeVariables, decimal>> MxcRates()
        {
            var res = await GetWithProxy("https://www.mxc.com/open/api/v1/data/ticker");
            var content = await res.Content.ReadAsStringAsync();
            var json = MxcResponse.FromJson(content);
            decimal price = decimal.Parse(json.Data["BTC_USDT"].Last);
            return new Dictionary<Catalog.CryptoExchangeVariables, decimal>
            {
                {Catalog.CryptoExchangeVariables.mxc_usd, price}
            };
        }

        private async Task<Dictionary<Catalog.CryptoExchangeVariables, decimal>> BittrexRates()
        {
            var res = await GetWithProxy("https://api.bittrex.com/api/v1.1/public/getticker?market=USDT-BTC");
            var content = await res.Content.ReadAsStringAsync();
            var json = BittrexResponse.FromJson(content);
            return new Dictionary<Catalog.CryptoExchangeVariables, decimal>
            {
                {Catalog.CryptoExchangeVariables.bittrex_usd, json.Result.Last}
            };
        }

        private async Task<Dictionary<Catalog.CryptoExchangeVariables, decimal>> BitfinexRates()
        {
            var res = await GetWithProxy("https://api-pub.bitfinex.com/v2/ticker/tBTCUSD");
            var content = await res.Content.ReadAsStringAsync();
            var json = BitfinexResponse.FromJson(content);
            return new Dictionary<Catalog.CryptoExchangeVariables, decimal>
            {
                {Catalog.CryptoExchangeVariables.bitfinex_usd, json[6]}
            };
        }


        private async Task<HttpResponseMessage> GetWithProxy(string url)
        {
            HttpClientHandler handler = new HttpClientHandler();
            if (!config.ProxyUrl.IsNullOrEmpty())
            {
                if (!config.ProxyUser.IsNullOrEmpty())
                {
                    handler.Proxy = new WebProxy
                    {
                        Address = new Uri(config.ProxyUrl),
                        BypassProxyOnLocal = true,
                        UseDefaultCredentials = false,
                        Credentials = new NetworkCredential(config.ProxyUser, config.ProxyPass)
                    };
                }
                else
                {
                    handler.Proxy = new WebProxy
                    {
                        Address = new Uri(config.ProxyUrl),
                        BypassProxyOnLocal = true,
                        UseDefaultCredentials = false,
                    };
                }
            }

            using var client = new HttpClient(handler: handler, disposeHandler: true);
            var res = await client.GetAsync(url);
            if (res.StatusCode != HttpStatusCode.OK)
            {
                logger.LogError("Unable to get url=" + url);
                throw new WebException("Unable to get url=" + url);
            }

            return res;
        }
    }
}