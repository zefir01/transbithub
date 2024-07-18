using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Castle.Core.Internal;
using CoreLib.Entitys;
using CoreLib.Services;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Shared;

namespace CoreLib
{
    public static class MyExtensions
    {
        public static Timestamp ToTimestamp(this DateTime time)
        {
            var t = new Timestamp();
            if (time == DateTime.MinValue)
            {
                t.Seconds = 0;
                return t;
            }

            t.Seconds = Convert.ToInt64((time.ToLocalTime() - DateTime.Now.Epoch()).TotalSeconds);
            return t;
        }

        public static DateTime Epoch(this DateTime time)
        {
            return new DateTime(1970, 1, 1, 0, 0, 0, 0).ToLocalTime();
        }

        public static async Task<T> ConcurrentRetries<T>(Func<CancellationToken, IServiceScope, Task<T>> func,
            IServiceProvider provider,
            int retries,
            CancellationToken token,
            ServerCallContext context = null,
            string name = null,
            ILogger logger = null
        ) where T : class
        {
            int counter = 0;
            name ??= "";
            logger ??= provider.GetRequiredService<ILogger>();
            RetranslatorBuffer retranslator = null;
            do
            {
                try
                {
                    using var scope = provider.CreateScope();
                    var res = await func(token, scope);
                    retranslator = scope.ServiceProvider.GetRequiredService<RetranslatorBuffer>();
                    retranslator.SendAll();
                    retranslator.Clear();
                    return res;
                }
                catch (TaskCanceledException e) when (context != null &&
                                                      e.CancellationToken == context.CancellationToken)
                {
                    retranslator?.Clear();
                    return null;
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (counter == retries - 1)
                    {
                        throw new UserException("Concurrency error. Please, try later.");
                    }

                    retranslator?.Clear();
                    counter++;
                }
                catch (Exception e)
                {
                    retranslator?.Clear();
                    logger.LogError($"Error in execute {name}.", e);
                    throw;
                }
                finally
                {
                    retranslator?.Clear();
                }
            } while (counter < retries);

            retranslator?.Clear();
            throw new Exception("Something strange...");
        }

        public static async Task<T> ConcurrentRetries<T>(Func<CancellationToken, DataDBContext, Task<T>> func,
            DataDBContext db,
            int retries,
            CancellationToken token,
            ILogger logger,
            ServerCallContext context = null,
            string name = null
        ) where T : class
        {
            int counter = 0;
            name ??= "";
            do
            {
                try
                {
                    var res = await func(token, db);
                    db.Retranslator.SendAll();
                    db.Retranslator.Clear();
                    return res;
                }
                catch (TaskCanceledException e) when (context != null &&
                                                      e.CancellationToken == context.CancellationToken)
                {
                    return null;
                }
                catch (DbUpdateConcurrencyException e)
                {
                    logger.LogWarning(e.Message, e);
                    if (counter == retries - 1)
                    {
                        throw new UserException("Concurrency error. Please, try later.");
                    }

                    foreach (var entry in db.ChangeTracker.Entries().ToList())
                        if (entry.State == EntityState.Added)
                            entry.State = EntityState.Detached;
                        else
                            await entry.ReloadAsync(token);

                    db.Retranslator?.Clear();
                    counter++;
                }
                catch (Exception e)
                {
                    logger.LogError($"Error in execute {name}.", e);
                    throw;
                }
                finally
                {
                    db.Retranslator?.Clear();
                }
            } while (counter < retries);

            throw new Exception("Something strange...");
        }

        public static (decimal fiatAmount, decimal cryptoAmount) GetAmounts(this string bolt11, decimal? fiatAmount,
            decimal? cryptoAmount, Advertisement ad, Config config)
        {
            decimal fAmount = 0;
            decimal crAmount = 0;
            if (!bolt11.IsNullOrEmpty())
            {
                var decoded = BOLT11PaymentRequest.Parse(bolt11, config.BitcoinNetwork);
                decimal am = decoded.MinimumAmount.ToDecimal(LightMoneyUnit.BTC);
                if (am == 0 && !fiatAmount.HasValue && !cryptoAmount.HasValue)
                    throw new UserException("If bolt11 invoice not contains amount, you must specify amount manually.");
                if (am != 0)
                {
                    crAmount = am;
                    fAmount = Math.Round(crAmount * ad.Metadata.Price, 2);
                }
                else
                {
                    if (fiatAmount.HasValue)
                    {
                        crAmount = Math.Round(fiatAmount.Value / ad.Metadata.Price, 8);
                        fAmount = fiatAmount.Value;
                    }
                    else if (cryptoAmount.HasValue)
                    {
                        fAmount = Math.Round(cryptoAmount.Value * ad.Metadata.Price, 2);
                        crAmount = cryptoAmount.Value;
                    }
                }

                return (fAmount, crAmount);
            }

            throw new Exception("Algorithm error");
        }
    }
}