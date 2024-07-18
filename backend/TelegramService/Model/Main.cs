using System;
using Microsoft.Extensions.Logging;
using TelegramService.Services;

namespace TelegramService.Model
{
    public class Main : BaseMenu
    {
        private Localization.Main s;
        public MyDeals MyDeals { get; }
        public Invoices Invoices { get; }
        public AdInfo AdInfo { get; }
        private readonly IConfig config;

        public Main(Menu menu, ILogger logger, IConfig config) : base(menu)
        {
            s = new Localization.Main(menu);
            this.config = config;

            AdInfo = new AdInfo(this);
            new AdFilter(this, true, logger, config, false);
            new AdFilter(this, false, logger, config, false);
            MyDeals = new MyDeals(this);
            Invoices = new Invoices(this, logger, config);
            new Wallet(this);
            Promises = new Promises(this);
            new Login(this);
        }

        public Promises Promises { get; }

        public override string Name => null;
        public override string Header => s.Get(Localization.Main.Keys.Header, config.SiteName);
    }
}