using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Protos.TradeApi.V1;
using Shared.Protos;
using AsyncResult = System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;

namespace TelegramService.Model
{
    public class Transactions : BaseMenu
    {
        public class State : StateBase
        {
            public uint Page { get; set; }
        }

        private uint page = 1;
        private uint pageSize = 30;
        private readonly bool isOut;
        private readonly List<Transaction> outTransactions = new();
        private readonly List<Transaction> inTransactions = new();
        private bool isNext;
        private Localization.Transactions s;

        public Transactions(BaseMenu parent, bool isOut) : base(parent)
        {
            this.isOut = isOut;
            s = new Localization.Transactions(Menu);
        }

        public override bool HideNavigation => true;


        public override string Name => isOut
            ? s.Get(Localization.Transactions.Keys.OutTrans)
            : s.Get(Localization.Transactions.Keys.InTrans);

        public override string Header
        {
            get
            {
                string str = $"<b>{s.Get(Localization.Transactions.Keys.Page)}</b> {page}\n";
                if (isOut)
                {
                    if (outTransactions.Any())
                        foreach (var transaction in outTransactions)
                            str += GetTransactionInfo(transaction);
                    else
                        str += s.Get(Localization.Transactions.Keys.NoTrans);
                }
                else if (inTransactions.Any())
                    foreach (var transaction in inTransactions)
                        str += GetTransactionInfo(transaction);
                else
                    str += s.Get(Localization.Transactions.Keys.NoTrans);

                return str;
            }
        }

        protected override IReadOnlyList<ICommand> Commands
        {
            get
            {
                List<ICommand> list = new List<ICommand>();
                if (page > 1)
                    list.Add(new Command(s.Get(Localization.Transactions.Keys.PrevPage), 0));
                if (isNext)
                    list.Add(new Command(s.Get(Localization.Transactions.Keys.NextPage), 1));
                return list;
            }
        }

        protected override async AsyncResult NewCommand(ICommand command)
        {
            switch (command.Id)
            {
                case 0:
                    if (page == 0)
                        return await PrintError();
                    page--;
                    return await Print();
                case 1:
                    if (!isNext)
                        return await PrintError();
                    page++;
                    return await Print();
                default:
                    return await PrintError();
            }
        }

        private async Task GetOutTransactions()
        {
            ulong lastId = 0;
            if (outTransactions.Any())
                lastId = outTransactions.Max(p => p.Id);
            var resp = await Clients.TradeClient.GetTransactionsAsync(new GetTransactionsRequest
            {
                Count = pageSize,
                IsInput = false,
                LastId = lastId
            });
            outTransactions.AddRange(resp.Transactions.ToList());
            isNext = outTransactions.Count > pageSize * page;
        }

        private async Task GetInTransactions()
        {
            ulong lastId = 0;
            if (inTransactions.Any())
                lastId = inTransactions.Min(p => p.Id);
            var resp = await Clients.TradeClient.GetTransactionsAsync(new GetTransactionsRequest
            {
                Count = pageSize,
                IsInput = true,
                LastId = lastId
            });
            inTransactions.AddRange(resp.Transactions.ToList());
            isNext = inTransactions.Count > pageSize * page;
        }

        private async Task GetTransactions()
        {
            if (isOut)
                await GetOutTransactions();
            else
                await GetInTransactions();
        }

        private string GetTransactionInfo(Transaction transaction)
        {
            string str = $"<b>ID:</b> {transaction.TxId}\n" +
                         $"<b>{s.Get(Localization.Transactions.Keys.Address)}</b> {transaction.To}\n" +
                         $"<b>{s.Get(Localization.Transactions.Keys.Amount)}</b> {transaction.Amount.FromPb()}\n" +
                         $"<b>{s.Get(Localization.Transactions.Keys.Confirmations)}</b> {transaction.Confirmations}\n" +
                         $"<b>{s.Get(Localization.Transactions.Keys.Created)}</b> {transaction.Time}\n\n";
            return str;
        }

        public override async AsyncResult OnStart()
        {
            await GetTransactions();
            return await Print();
        }

        public override Task<StateBase> GetState()
        {
            return Task.FromResult<StateBase>(new State
            {
                Id = Id,
                Page = page
            });
        }

        public override async Task SetState(StateBase state)
        {
            var st = state as State;
            // ReSharper disable once PossibleNullReferenceException
            page = st.Page;
            await GetTransactions();
        }
    }
}