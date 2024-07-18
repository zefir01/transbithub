using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend;
using CoreLib;
using Google.Protobuf.WellKnownTypes;
using NBitcoin;
using Protos.TradeApi.V1;
using Shared.Protos;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using AsyncResult = System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;

namespace TelegramService.Model
{
    public class OutBtc : BaseMenu
    {
        public class State : StateBase
        {
            public Status Status { get; set; }
            public decimal Amount { get; set; }
            public string Address { get; set; }
            public bool IsAll { get; set; }
        }

        public enum Status
        {
            Amount,
            Address,
            Send,
            Sended
        }

        private decimal amount;
        private Status status;
        private string address;
        private Localization.OutBtc s;
        private bool isAll;

        public OutBtc(BaseMenu parent) : base(parent)
        {
            s = new Localization.OutBtc(Menu);
        }

        public OutBtc(Menu menu) : base(menu)
        {
            s = new Localization.OutBtc(menu);
        }

        public override bool HideNavigation => true;

        public override string Name => s.Get(Localization.OutBtc.Keys.Name);

        public override string Header
        {
            get
            {
                string str = "";
                switch (status)
                {
                    case Status.Amount:
                        str = s.Get(Localization.OutBtc.Keys.EnterAmount);
                        break;
                    case Status.Address:
                        str = $"<b>{s.Get(Localization.OutBtc.Keys.Amount)}</b> {amount}\n" +
                              $"{s.Get(Localization.OutBtc.Keys.EnterWallet)}\n";
                        break;
                    case Status.Send:
                        str = $"<b>{s.Get(Localization.OutBtc.Keys.Amount)}</b> {amount}\n" +
                              $"<b>{s.Get(Localization.OutBtc.Keys.Address)}</b> {address}\n" +
                              $"{s.Get(Localization.OutBtc.Keys.Confirm)}\n";
                        break;
                    case Status.Sended:
                        str = $"<b>{s.Get(Localization.OutBtc.Keys.Amount)}</b> {amount}\n" +
                              $"<b>{s.Get(Localization.OutBtc.Keys.Address)}</b> {address}\n" +
                              $"{s.Get(Localization.OutBtc.Keys.Ok)}\n";
                        break;
                }

                return str;
            }
        }

        protected override IReadOnlyList<ICommand> Commands
        {
            get
            {
                List<ICommand> list = new List<ICommand>();
                if (status == Status.Send)
                    list.Add(new Command(s.Get(Localization.OutBtc.Keys.Send), 0));
                return list;
            }
        }

        public override async AsyncResult OnStart()
        {
            status = Status.Amount;
            amount = 0;
            address = null;
            isAll = false;
            return await Print();
        }

        public override async AsyncResult NewMessage(Message message)
        {
            if (message.Type != MessageType.Text)
                return await PrintError(s.Get(Localization.OutBtc.Keys.Error));

            switch (status)
            {
                case Status.Amount:
                    if (decimal.TryParse(message.Text, out amount))
                    {
                        var resp = await Clients.TradeClient.GetFeesAsync(new Empty());
                        var fee = resp.Fee.FromPb();
                        var balance = await Clients.TradeClient.GetBalancesAsync(new Empty());

                        if (amount == 0)
                        {
                            isAll = true;
                            amount = balance.Confirmed.FromPb() - fee;
                            if (amount < 0)
                            {
                                amount = 0;
                                return await PrintError(s.Get(Localization.OutBtc.Keys.Error3));
                            }
                        }
                        else
                        {
                            if (amount + fee > balance.Confirmed.FromPb())
                            {
                                amount = 0;
                                return await PrintError(s.Get(Localization.OutBtc.Keys.Error3));
                            }
                        }

                        status = Status.Address;
                        return await Print();
                    }

                    return await PrintError(s.Get(Localization.OutBtc.Keys.Error1));
                case Status.Address:
                    BitcoinAddress addr;
                    try
                    {
                        addr = BitcoinAddress.Create(message.Text, Menu.Config.BitcoinNetwork);
                    }
                    catch (Exception)
                    {
                        return await PrintError(s.Get(Localization.OutBtc.Keys.Error2));
                    }

                    address = addr.ToString();
                    status = Status.Send;
                    return await Print();
                default:
                    return await PrintError();
            }
        }

        protected override async AsyncResult NewCommand(ICommand command)
        {
            if (command.Id != 0)
                return await PrintError();
            if (!isAll)
            {
                await Clients.TradeClient.CreateTransactionAsync(new CreateTransactionRequest
                {
                    Amount = amount.ToPb(),
                    TargetAddress = address
                });
            }
            else
            {
                await Clients.TradeClient.CreateTransactionAsync(new CreateTransactionRequest
                {
                    TargetAddress = address
                });
            }

            status = Status.Sended;
            return await Print();
        }

        public override Task<StateBase> GetState()
        {
            return Task.FromResult<StateBase>(new State
            {
                Id = Id,
                Status = status,
                Amount = amount,
                Address = address,
                IsAll = isAll
            });
        }

        public override Task SetState(StateBase state)
        {
            var st = state as State;
            // ReSharper disable once PossibleNullReferenceException
            status = st.Status;
            amount = st.Amount;
            address = st.Address;
            isAll = st.IsAll;
            return Task.CompletedTask;
        }
    }
}