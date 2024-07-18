using System;
using System.Linq;
using Microsoft.Extensions.Logging;
using Protos.TradeApi.V1;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using AsyncResult= System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;

namespace TelegramService.Model
{
    public class Invoices : BaseMenu
    {
        public InvoicePaymentsList PaymentsList { get; }
        private Localization.Invoices s;
        private readonly MyInvoices myInvoices;
        private readonly ConversationsList conversationsList;

        public Invoices(BaseMenu parent, ILogger logger, IConfig config) : base(parent)
        {
            s = new Localization.Invoices(Menu);
            InvoiceView = new InvoiceView(this, logger, config);
            myInvoices = new MyInvoices(this, logger, config);
            PaymentsList = new InvoicePaymentsList(this, logger, config);
            conversationsList = new ConversationsList(this);
        }

        public InvoiceView InvoiceView { get; }

        public override string Name => NewInvoicesCount == 0
            ? s.Get(Localization.Invoices.Keys.Name)
            : s.Get(Localization.Invoices.Keys.Name1, NewInvoicesCount.ToString());

        private int NewInvoicesCount => Events.Where(p => p.InvoiceNew!=null)
            .Select(p => p.InvoiceNew.Id).Distinct().Count();

        public override string Header => s.Get(Localization.Invoices.Keys.Header);

        public override async AsyncResult NewMessage(Message message)
        {
            if (message.Type != MessageType.Text)
                return await PrintError();
            var isParsed = ulong.TryParse(message.Text, out ulong id);
            if (!isParsed)
                return await PrintError(s.Get(Localization.Invoices.Keys.InvalidId));
            Invoice invoice;
            try
            {
                var resp = await Clients.TradeClient.GetInvoiceByIdAsync(new GetInvoiceByIdRequest
                {
                    InvoiceId = id
                });
                invoice = resp.Invoices[0];
                if (invoice == null)
                    return await PrintError(s.Get(Localization.Invoices.Keys.NotFound));
            }
            catch (Exception)
            {
                return await PrintError(s.Get(Localization.Invoices.Keys.NotFound));
            }

            InvoiceView.Invoice = invoice;
            return await InvoiceView.Print();
        }
    }
}