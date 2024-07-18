using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using CoreLib.Services;
using Humanizer;
using Humanizer.Localisation;
using Protos.TradeApi.V1;
using Shared.Protos;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.ReplyMarkups;
using AsyncResult = System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;

namespace TelegramService.Model
{
    public class Deal : BaseMenu
    {
        public class State : StateBase
        {
            public ulong? DealId { get; set; }
        }

        private Protos.TradeApi.V1.Deal deal;
        private Localization.Deal s;
        private SendFeedback feedback;
        private ulong? dealId;

        public Deal(BaseMenu parent) : base(parent)
        {
            s = new Localization.Deal(Menu);
            feedback = new SendFeedback(this);
            BackDisabled = true;
        }

        public override bool HideNavigation => true;

        private async Task<Protos.TradeApi.V1.Deal> GetDeal()
        {
            if (!dealId.HasValue)
                return null;
            var resp = await Clients.TradeClient.GetDealByIdAsync(new GetDealByIdRequest
            {
                Id = dealId.Value
            });
            return resp;
        }

        protected override async AsyncResult OnCommand(string command)
        {
            var result = await IsHome(command);
            if (result != null)
                return result;
            result = await IsBack(command);
            if (result != null)
                return result;

            switch (command)
            {
                case "cmd iPay":
                {
                    var resp = await Clients.TradeClient.IPayedAsync(new IPayedRequest
                    {
                        DealId = deal.Id
                    });
                    await SetDeal(resp.Deal);
                    return await Print();
                }
                case "cmd cancel":
                {
                    var resp = await Clients.TradeClient.CancelDealAsync(new CancelDealRequest
                    {
                        DealId = deal.Id
                    });
                    await SetDeal(resp.Deal);
                    return await Print();
                }
                case "cmd dispute":
                {
                    var resp = await Clients.TradeClient.CreateDisputeAsync(new CreateDisputeRequest
                    {
                        DealId = deal.Id
                    });
                    await SetDeal(resp.Deal);
                    return await Print();
                }
                case "cmd feedback":
                {
                    feedback.SetDealId(dealId);
                    return await feedback.Print();
                }
            }

            return await PrintError();
        }

        public override string Name => s.Get(Localization.Deal.Keys.Name, deal?.Id.ToString() ?? "");

        public static string GetDealInfo(Protos.TradeApi.V1.Deal deal, Localization.Deal s, CultureInfo CultureInfo,
            bool printInfo = true)
        {
            var ad = deal.Advertisement;
            string type = ad.IsBuy
                ? s.Get(Localization.Deal.Keys.NameSell)
                : s.Get(Localization.Deal.Keys.NameBuy);
            string partner = ad.IsBuy
                ? s.Get(Localization.Deal.Keys.Buyer)
                : s.Get(Localization.Deal.Keys.Seller);
            string window = TimeSpan.FromMinutes(ad.Window)
                .Humanize(precision: 3, culture: CultureInfo, minUnit: TimeUnit.Minute);
            string status = deal.Status switch
            {
                DealStatus.Opened => s.Get(Localization.Deal.Keys.DealOpened),
                DealStatus.Canceled => s.Get(Localization.Deal.Keys.DealCanceled),
                DealStatus.Completed => s.Get(Localization.Deal.Keys.DealCompleted),
                DealStatus.Disputed => s.Get(Localization.Deal.Keys.DealDisputed),
                DealStatus.WaitDeposit => s.Get(Localization.Deal.Keys.DealWaitDeposit),
                _ => throw new ArgumentOutOfRangeException()
            };
            
            string info = "";
            if (printInfo)
            {
                if (deal.Status == DealStatus.WaitDeposit)
                {
                    string wait = (DateTime.Now - deal.CreatedAt.ToDateTime())
                        .Humanize(2, CultureInfo, minUnit: TimeUnit.Second);
                    info = s.Get(Localization.Deal.Keys.Wait, wait);
                }
                else if (deal.Status != DealStatus.Completed && deal.Status != DealStatus.Canceled)
                    info = s.Get(Localization.Deal.Keys.Info);
            }

            string msg =
                s.Get(Localization.Deal.Keys.Statement, type, ad.PaymentType, ad.Title, ad.FiatCurrency) +
                $"<b>{s.Get(Localization.Deal.Keys.Price)}</b> {ad.Price.FromPb()} {ad.FiatCurrency}/BTC\n" +
                $"<b>{s.Get(Localization.Deal.Keys.PaymentType)}</b> {ad.PaymentType}\n" +
                $"<b>{partner}</b> {ad.Owner.Username} {s.Get(Localization.Deal.Keys.Positive)} {ad.Owner.ResponseRate.FromPb()}%\n" +
                $"<b>{s.Get(Localization.Deal.Keys.Limits)}</b> {ad.MinAmount.FromPb()}-{ad.MaxAmountCalculated.FromPb()} {ad.FiatCurrency}\n" +
                $"<b>{s.Get(Localization.Deal.Keys.Location)}</b> {Catalog.CountriesNames[Enum.Parse<Catalog.Countries>(ad.Country)]}\n" +
                $"<b>{s.Get(Localization.Deal.Keys.Window)}</b> {window}\n" +
                $"<b>{s.Get(Localization.Deal.Keys.Terms)}</b> {ad.Message}\n" +
                $"<b>{s.Get(Localization.Deal.Keys.Amount)}</b> {Math.Round(deal.FiatAmount.FromPb(), 2)} {ad.FiatCurrency} / {deal.CryptoAmount.FromPb()} BTC\n" +
                $"<b>{s.Get(Localization.Deal.Keys.Status)}</b> {status}\n" +
                $"<b>{s.Get(Localization.Deal.Keys.FiatSent)}</b> {YesNo(deal.IsFiatPayed, s)}\n" +
                info + "\n";
            return msg;
        }

        public override string Header => GetDealInfo(deal, s, CultureInfo);

        private List<InlineKeyboardButton> CreateListBtn(Localization.Deal.Keys key, string command)
        {
            return new()
            {
                InlineKeyboardButton.WithCallbackData(s.Get(key), command)
            };
        }

        private List<List<InlineKeyboardButton>> GetCommands()
        {
            var res = new List<List<InlineKeyboardButton>>();
            if (deal.Status == DealStatus.Opened)
            {
                if (!deal.Advertisement.IsBuy && !deal.IsFiatPayed)
                    res.Add(CreateListBtn(Localization.Deal.Keys.IPayed, "cmd iPay"));
                else if (deal.Advertisement.IsBuy && deal.Status == DealStatus.Opened)
                    res.Add(CreateListBtn(Localization.Deal.Keys.SentCrypto, "cmd iPay"));

                if (deal.Status == DealStatus.Opened && !deal.IsFiatPayed)
                    res.Add(CreateListBtn(Localization.Deal.Keys.CancelDeal, "cmd cancel"));

                if (deal.Status != DealStatus.Disputed)
                    res.Add(CreateListBtn(Localization.Deal.Keys.DisputeDeal, "cmd dispute"));
            }
            else if (deal.Status == DealStatus.WaitDeposit)
            {
                res.Add(CreateListBtn(Localization.Deal.Keys.CancelDeal, "cmd cancel"));
            }

            if (deal.Advertisement.Owner.Id == Menu.UserId)
            {
                if (deal.AdOwnerFeedbackIsnull)
                    res.Add(CreateListBtn(Localization.Deal.Keys.Feedback, "cmd feedback"));
            }
            else
            {
                if (deal.InitiatorFeedbackIsNull)
                    res.Add(CreateListBtn(Localization.Deal.Keys.Feedback, "cmd feedback"));
            }

            res.Add(BackBtn.BackHome(this));

            return res;
        }

        protected override AsyncResult Content()
        {
            var commands = GetCommands();
            var res = new List<Result>
            {
                new Result(this,
                    $"<b>{s.Get(Localization.Deal.Keys.Chat)}</b>\n",
                    InlineKeyboardMarkup.Empty())
            };
            foreach (var dm in deal.Messages.OrderBy(p => p.Id))
            {
                string userName;
                if (dm.OwnerId == Menu.UserId)
                    userName = s.Get(Localization.Deal.Keys.You);
                else if (dm.OwnerId == deal.Initiator.Id)
                    userName = deal.Initiator.Username;
                else if (dm.OwnerId == deal.AdOwnerInfo.Id)
                    userName = deal.AdOwnerInfo.Username;
                else
                    userName = s.Get(Localization.Deal.Keys.Arbitor);


                if (dm.ImageIds.Any())
                {
                    foreach (var image in dm.ImageIds)
                    {
                        string text = $"<b>{userName}:</b>\n";
                        var photo = new Photo(Guid.Parse(image));
                        res.Add(new Result(this, text, InlineKeyboardMarkup.Empty(), photo));
                    }
                }
                else
                {
                    string msg = $"<b>{userName}:</b>\n" +
                                 $"{Regex.Replace(dm.Text, "<.*?>", string.Empty) ?? ""}\n";
                    res.Add(new Result(this, msg, InlineKeyboardMarkup.Empty()));
                }
            }

            res.Last().Keyboard = commands.ToKeyboard();

            return Task.FromResult(res);
        }

        private static string YesNo(bool val, Localization.Deal s)
        {
            return val ? s.Get(Localization.Deal.Keys.Yes) : s.Get(Localization.Deal.Keys.No);
        }

        public override async AsyncResult NewMessage(Message message)
        {
            if (message.Type != MessageType.Text && message.Type != MessageType.Photo &&
                message.Type != MessageType.Document)
                return await PrintError();
            if (deal.Status == DealStatus.Completed)
                return await PrintError(s.Get(Localization.Deal.Keys.ErrorCompleted));
            if (deal.Status == DealStatus.Canceled)
                return await PrintError(s.Get(Localization.Deal.Keys.ErrorCanceled));
            if (deal.Status == DealStatus.WaitDeposit)
                return await PrintError();

            var img = await Menu.ImageLoader.PhotoIn(message);

            var req = new SendMessageRequest
            {
                DealId = deal.Id,
                Text = message.Text ?? ""
            };
            if (img.HasValue)
                req.ImageIds.Add(img.ToString());
            var resp = await Clients.TradeClient.SendMessageAsync(req);
            deal.Messages.Add(resp.Message);
            return await Print();
        }

        private void IsRedirect(Protos.TradeApi.V1.Deal deal)
        {
            if (this.deal == null ||
                this.deal.Id != deal.Id ||
                this.deal.Status == DealStatus.Completed ||
                this.deal.Status == DealStatus.Canceled)
            {
                Redirect = null;
                return;
            }

            if ((deal.Status == DealStatus.Completed ||
                 deal.Status == DealStatus.Canceled) &&
                !deal.PaymentIsNull)
            {
                var view = ((Main) Root).Invoices.PaymentsList.PaymentView;
                view.Payment = deal.Payment;
                Redirect = view;
            }
            else
                Redirect = null;
        }

        public async Task SetDeal(Protos.TradeApi.V1.Deal deal)
        {
            IsRedirect(deal);
            this.deal = deal;
            dealId = deal.Id;
            var e = Events.Where(p =>
                p.DealNewMessage?.Id == deal.Id ||
                p.DealStatusChanged?.Id == deal.Id ||
                p.DealNew?.Id == deal.Id ||
                p.DealDisputeCreated?.Id == deal.Id ||
                p.DealFiatPayed?.Id == deal.Id
            ).ToList();
            await MarkEventAsRead(e);
        }

        public override Task<StateBase> GetState()
        {
            return Task.FromResult<StateBase>(new State
            {
                Id = Id,
                DealId = dealId
            });
        }

        public override async Task SetState(StateBase state)
        {
            var s = state as State;
            dealId = s.DealId;
            deal = await GetDeal();
        }

        public override async AsyncResult OnStart()
        {
            deal = await GetDeal();
            return await Print();
        }

        protected override async Task<bool> OnEvent(Event evt)
        {
            if (evt.DealNewMessage != null || evt.DealStatusChanged != null || evt.DealFiatPayed != null)
            {
                var d = evt.DealNewMessage;
                d = evt.DealStatusChanged ?? d;
                d = evt.DealFiatPayed ?? d;
                if (deal != null && deal.Id == d.Id)
                {
                    await SetDeal(d);
                    return true;
                }
            }

            return false;
        }

        protected override Task<bool> OnImageLoaded(Guid id)
        {
            return Task.FromResult(deal.Messages.SelectMany(p => p.ImageIds).Contains(id.ToString()));
        }
    }
}