using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class LNWallet: TelegramService.Model.Localization.Base<LNWallet.Keys>
    {
        public enum Keys
        {
            Name,
            Info,
            NoBalances,
            Back,
            Crypto,
            Balance,
            Deposited,
            NotConfirmed,
            Receive,
            Send,
            InTrans,
            OutTrans,
            Invoices,
            Payments
        }
        
        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Кошелек",
                    [Keys.Info]="Здесь вы можете смотреть свои балансы, вводить и выводить криптовалюту.",
                    [Keys.NoBalances]="Нет балансов.",
                    [Keys.Back]="Назад",
                    [Keys.Crypto]="Криптовалюта:",
                    [Keys.Balance]="Баланс:",
                    [Keys.Deposited]="Депонировано:",
                    [Keys.NotConfirmed]="Не подтверждено:",
                    [Keys.Receive]="Принять",
                    [Keys.Send]="Отправить",
                    [Keys.InTrans]="Входящие транзакции",
                    [Keys.OutTrans]="Исходящие транзакции",
                    [Keys.Invoices]="Запросы платежей",
                    [Keys.Payments]="Платежи"
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Wallet",
                    [Keys.Info]="Here you can watch your balances, enter and withdraw cryptocurrency.",
                    [Keys.NoBalances]="No balances.",
                    [Keys.Back]="BAck",
                    [Keys.Crypto]="Cryptocurrency:",
                    [Keys.Balance]="Balance:",
                    [Keys.Deposited]="Deposited:",
                    [Keys.NotConfirmed]="Not confirmed:",
                    [Keys.Receive]="Receive",
                    [Keys.Send]="Withdraw",
                    [Keys.InTrans]="Input transactions",
                    [Keys.OutTrans]="Output transactions",
                    [Keys.Invoices]="Payment requests",
                    [Keys.Payments]="Payments"
                }
            };
            return data;
        }

        public LNWallet(IMenu menu) : base(menu)
        {
        }
    }
}