using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Backend;
using CoreLib;
using Google.Protobuf.WellKnownTypes;
using Protos.TradeApi.V1;
using Shared;
using Shared.Protos;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.ReplyMarkups;

namespace TelegramService.Model
{
    public class LNSend : BaseMenu
    {
        public enum Status
        {
            EnterInvoice,
            ShowInvoice,
            Amount,
            Paid
        }

        private Status status;
        private string invoice;
        private BOLT11PaymentRequest request;
        private Variables vars;
        private Balance balance;
        private decimal? amount;
        private readonly Localization.LNSend s;

        public LNSend(BaseMenu parent) : base(parent)
        {
            s = new Localization.LNSend(Menu);
        }

        public override string Name => s.Get(Localization.LNSend.Keys.Name);
        public override bool HideNavigation => true;

        private async Task GetVars()
        {
            vars = await Clients.TradeClient.GetVariablesAsync(new Empty());
        }

        private async Task GetBalances()
        {
            balance = await Clients.TradeClient.GetBalancesAsync(new Empty());
        }

        public override async Task<List<Result>> OnStart()
        {
            await GetVars();
            await GetBalances();
            amount = null;
            invoice = "";
            request = null;
            status = Status.EnterInvoice;
            return await Print();
        }

        private async Task<string> GetRequestInfo(BOLT11PaymentRequest request)
        {
            if (vars == null)
                await GetVars();
            if (balance == null)
                await GetBalances();
            var v = vars.Variables_.First(p => p.Key == "AVG_" + Currency);
            var btc = request.MinimumAmount.ToDecimal(LightMoneyUnit.BTC);
            string str = s.Get(Localization.LNSend.Keys.Amount, btc.ToString(CultureInfo.InvariantCulture),
                             Math.Round(btc * v.Value.FromPb(), 2).ToString(CultureInfo.InvariantCulture), Currency.ToString()) +
                         s.Get(Localization.LNSend.Keys.Desc, request.ShortDescription) +
                         s.Get(Localization.LNSend.Keys.CreatedAt, request.Timestamp.ToString()) +
                         s.Get(Localization.LNSend.Keys.Expires, request.ExpiryDate.ToString());
            return str;
        }

        protected override async Task<List<Result>> Content()
        {
            string str;
            switch (status)
            {
                case Status.EnterInvoice:
                    str = s.Get(Localization.LNSend.Keys.EnterInvoice);
                    return new List<Result>
                    {
                        new Result(this, str, BackBtn.BackHome(this).ToKeyboard())
                    };
                case Status.ShowInvoice:
                    str = await GetRequestInfo(request);
                    var btc = request.MinimumAmount.ToDecimal(LightMoneyUnit.BTC);
                    if (balance.Confirmed.FromPb() > btc)
                    {
                        var btn = InlineKeyboardButton.WithCallbackData(s.Get(Localization.LNSend.Keys.Pay), "cmd pay");
                        var arr = new List<List<InlineKeyboardButton>>
                        {
                            new List<InlineKeyboardButton> {btn},
                            BackBtn.BackHome(this)
                        };
                        return new List<Result>
                        {
                            new Result(this, str, arr.ToKeyboard())
                        };
                    }
                    else
                    {
                        str += s.Get(Localization.LNSend.Keys.NoFunds);
                        return new List<Result>
                        {
                            new Result(this, str, BackBtn.BackHome(this).ToKeyboard())
                        };
                    }
                case Status.Amount:
                    str = await GetRequestInfo(request);
                    str += s.Get(Localization.LNSend.Keys.EnterAmount);
                    return new List<Result>
                    {
                        new Result(this, str, BackBtn.BackHome(this).ToKeyboard())
                    };
                case Status.Paid:
                    return new List<Result>
                    {
                        new Result(this, s.Get(Localization.LNSend.Keys.Success), BackBtn.BackHome(this).ToKeyboard())
                    };
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        public override async Task<List<Result>> NewMessage(Message message)
        {
            if (message.Type != MessageType.Text)
                return await PrintError();

            switch (status)
            {
                case Status.EnterInvoice:
                    invoice = message.Text;
                    if (BOLT11PaymentRequest.TryParse(invoice, out var res, Menu.Config.BitcoinNetwork))
                    {
                        if (res.MinimumAmount.MilliSatoshi != 0)
                            amount = res.MinimumAmount.ToDecimal(LightMoneyUnit.BTC);
                        request = res;
                        status = Status.ShowInvoice;
                        return await Print();
                    }
                    else
                        return await PrintError(s.Get(Localization.LNSend.Keys.InvoiceError));
                case Status.ShowInvoice:
                    break;
                case Status.Amount:
                    if (decimal.TryParse(message.Text, out var val))
                    {
                        amount = val;
                        await PayInvoice(invoice, amount);
                        status = Status.Paid;
                        return await Print();
                    }

                    return await PrintError(s.Get(Localization.LNSend.Keys.AmountError));
                case Status.Paid:
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            return await PrintError();
        }

        private async Task PayInvoice(string invoice, decimal? amount)
        {
            var req = new LNWithdrawalRequest
            {
                Invoice = invoice
            };
            if (amount.HasValue)
                req.Amount = amount.Value.ToPb();
            else
                req.AmountIsNull = true;
            try
            {
                await Clients.TradeClient.LNWithdrawalAsync(req);
            }
            catch (LightningRpcException e)
            {
                throw new UserException(e.Message);
            }
        }

        protected override async Task<List<Result>> OnCommand(string command)
        {
            List<Result> result;
            result = await IsBack(command);
            if (result != null)
            {
                switch (status)
                {
                    case Status.EnterInvoice:
                        return result;
                    case Status.ShowInvoice:
                        status = Status.EnterInvoice;
                        invoice = "";
                        request = null;
                        return await Print();
                    case Status.Amount:
                        status = Status.ShowInvoice;
                        return await Print();
                    case Status.Paid:
                        status = Status.EnterInvoice;
                        invoice = "";
                        request = null;
                        return await Print();
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }

            result = await IsHome(command);
            if (result != null)
                return result;

            if (command == "cmd pay")
            {
                if (!amount.HasValue)
                {
                    status = Status.Amount;
                    return await Print();
                }

                try
                {
                    await PayInvoice(invoice, null);
                    status = Status.Paid;
                    return await Print();
                }
                catch (LightningRpcException e)
                {
                    throw new UserException(e.Message);
                }
            }

            return await PrintError();
        }
    }
}