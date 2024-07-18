using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Castle.Core.Internal;
using CoreLib.Entitys.Invoices;
using CoreLib.Entitys.UserDataParts;
using CoreLib.Services;
using Microsoft.EntityFrameworkCore;
using Shared;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace CoreLib.Entitys
{
    public class Promise : EntityWithoutKey
    {
        public class View
        {
            public string Contacts { get; set; }
            public string Id { get; set; }
            public decimal Amount { get; set; }
            public DateTime CreatedAt { get; set; }

            public View()
            {
            }

            public View(Promise promise, Config config)
            {
                Contacts =
                    $"You can use this Promise on the {config.SiteName} or {config.SiteNameOnion} websites or via the Telegram bot {config.TelegramBotName}";
                Id = promise.Id.ToString();
                Amount = promise.Amount;
                CreatedAt = promise.CreatedAt;
            }
        }

        [Key] public Guid Id { get; private set; }
        public decimal Amount { get; private set; }
        public string Password { get; private set; }
        public DateTime CreatedAt { get; private set; } = DateTime.Now;
        public virtual UserData Creator { get; private set; }
        [ForeignKey("deal_locked_fk")]
        public virtual Deal Deal { get; set; }
        public bool Locked { get; set; }
        [ForeignKey("payment_fk")]
        public virtual InvoicePayment Payment { get; private set; }

        private static readonly Regex regexClear =
            new Regex(@"-----BEGIN PGP SIGNED MESSAGE-----(.*)-----END PGP SIGNATURE-----",
                RegexOptions.Multiline | RegexOptions.Singleline | RegexOptions.Compiled);

        private static readonly Regex regexEncrypted =
            new Regex(@"-----BEGIN PGP MESSAGE-----(.*)-----END PGP MESSAGE-----",
                RegexOptions.Multiline | RegexOptions.Singleline | RegexOptions.Compiled);
        
        public Promise(DataDBContext db) : base(db)
        {
        }

        public Promise(decimal amount, string password, DataDBContext db) : base(db)
        {
            Amount = Math.Round(amount, 8);
            Creator = requester;
            Password = password;
            
            requester.Balance.OnCreatePromise(this).ConfigureAwait(false).GetAwaiter().GetResult();
        }

        public Promise(DataDBContext db, decimal amount, string password, UserData creator) : base(db)
        {
            Amount = amount;
            Password = password ?? throw new ArgumentNullException(nameof(password));
            Creator = creator ?? throw new ArgumentNullException(nameof(creator));
        }

        public async Task<string> GetText()
        {
            var view = new View(this, db.Config);
            var serializer = new SerializerBuilder().WithNamingConvention(CamelCaseNamingConvention.Instance).Build();
            string yaml = serializer.Serialize(view);
            string text = await pgp.Sign(yaml, Password);
            return text;
        }

        public static async Task<Promise> GetPromise(string promise, string password, DataDBContext db)
        {
            bool isEncrypted = false;
            bool isClearSigned = false;

            var m1 = regexClear.Match(promise);
            if (m1.Success)
            {
                isClearSigned = true;
                promise = m1.Value;
            }

            var m2 = regexEncrypted.Match(promise);
            if (m2.Success)
            {
                isEncrypted = true;
                promise = m2.Value;
            }
            
            if (isEncrypted == isClearSigned)
                throw new UserException("Invalid promise.");
            if(isEncrypted && password.IsNullOrEmpty())
                throw new UserException("Invalid password.");

            string text;
            try
            {
                text = await db.Pgp.Decrypt(promise, password);
            }
            catch (Pgp.GpgPasswordException)
            {
                throw new UserException("Invalid password.");
            }
            catch
            {
                throw new UserException("Invalid sign.");
            }

            View view;
            try
            {
                var deserializer = new DeserializerBuilder()
                    .WithNamingConvention(CamelCaseNamingConvention.Instance)
                    .Build();
                view = deserializer.Deserialize<View>(text);
            }
            catch
            {
                throw new UserException("Invalid promise.");
            }

            if (view == null)
                throw new UserException("Invalid promise.");
            var ret = await db.Promises.FirstOrDefaultAsync(p => p.Id == Guid.Parse((ReadOnlySpan<char>) view.Id));
            if (ret == null)
                throw new UserException("Promise not found or already used.");
            if (ret.Locked)
                throw new UserException("Promise locked.");

            return ret;
        }
    }
}