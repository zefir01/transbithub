namespace TelegramService.Model
{
    public class Promises: BaseMenu
    {
        private Localization.Promises s;
        public Promises(BaseMenu parent) : base(parent)
        {
            s=new Localization.Promises(Menu);
            var createPromise = new CreatePromise(this);
            ReceivePromise = new ReceivePromise(this);
        }

        public ReceivePromise ReceivePromise { get; }

        public override string Name => s.Get(Localization.Promises.Keys.Title);

        public override string Header => s.Get(Localization.Promises.Keys.Header);
    }
}