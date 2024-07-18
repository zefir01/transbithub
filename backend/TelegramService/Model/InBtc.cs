using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Google.Protobuf.WellKnownTypes;
using QRCoder;
using Telegram.Bot.Types;
using Telegram.Bot.Types.ReplyMarkups;
using AsyncResult = System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;

namespace TelegramService.Model
{
    public class InBtc : BaseMenu
    {
        public class State : StateBase
        {
            public bool IsBech32 { get; set; }
        }

        private (string lagacy, string bech32)? addresses;
        private (string lagacy, string bech32) Addresses
        {
            get
            {
                if (addresses.HasValue)
                    return addresses.Value;
                GetAddresses().ConfigureAwait(false).GetAwaiter().GetResult();
                // ReSharper disable once PossibleInvalidOperationException
                return addresses.Value;
            }
        }
        private bool isBech32 = true;
        private Localization.InBtc s;

        public InBtc(BaseMenu parent) : base(parent)
        {
            BackDisabled = true;
            s = new Localization.InBtc(Menu);
        }

        public override bool HideNavigation => true;

        public override string Name => s.Get(Localization.InBtc.Keys.Name);

        public override string Header
        {
            get
            {
                string addr = isBech32 ? Addresses.bech32 : Addresses.lagacy;
                string str = s.Get(Localization.InBtc.Keys.Info1, addr) +
                             s.Get(Localization.InBtc.Keys.Info2) +
                             s.Get(Localization.InBtc.Keys.Info3, GetUri()) +
                             s.Get(Localization.InBtc.Keys.Info4);
                return str;
            }
        }

        private string GetUri()
        {
            if (isBech32)
                return $"bitcoin:{Addresses.bech32}";

            return $"bitcoin:{Addresses.lagacy}";
        }

        private Bitmap GetQrCode(string uri)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(uri, QRCodeGenerator.ECCLevel.Q);
            QRCode qrCode = new QRCode(qrCodeData);
            Bitmap qrCodeImage = qrCode.GetGraphic(20);
            return qrCodeImage;
        }

        private async Task GetAddresses()
        {
            var resp = await Clients.TradeClient.GetInputAddressAsync(new Empty());
            addresses = (resp.BtcAddress.Legacy, resp.BtcAddress.Bech32);
        }

        private async Task<List<Result>> CreatePage()
        {
            string change = isBech32
                ? s.Get(Localization.InBtc.Keys.ToStandard)
                : s.Get(Localization.InBtc.Keys.ToBech32);
            var qr = GetQrCode(GetUri());
            List<Result> res = new List<Result>();
            List<List<InlineKeyboardButton>> arr = new List<List<InlineKeyboardButton>>
            {
                new List<InlineKeyboardButton>
                {
                    InlineKeyboardButton.WithCallbackData(change, "cmd change")
                },
                BackBtn.BackHome(this)
            };
            await using MemoryStream ms = new MemoryStream();
            qr.Save(ms, ImageFormat.Png);
            ms.Position = 0;
            var photo = new Photo(ms.ToArray());
            res.Add(new Result(this, "", new InlineKeyboardMarkup(arr), photo));
            return res;
        }

        public override async AsyncResult OnStart()
        {
            await GetAddresses();
            var pages = await CreatePage();
            pages = (await Print()).Concat(pages).ToList();
            return pages;
        }

        public override async AsyncResult NewMessage(Message message)
        {
            return await OnStart();
        }

        protected override async AsyncResult OnCommand(string command)
        {
            List<Result> result;
            result = await IsBack(command);
            if (result != null)
                return result;

            result = await IsHome(command);
            if (result != null)
                return result;

            var arr = command.Split(" ");
            if (arr[0] != "cmd")
                return await PrintError();
            if (arr[1] == "change")
                isBech32 = !isBech32;
            return await OnStart();
        }

        public override Task<StateBase> GetState()
        {
            return Task.FromResult<StateBase>(new State
            {
                Id = Id,
                IsBech32 = isBech32
            });
        }

        public override Task SetState(StateBase state)
        {
            var st = state as State;
            // ReSharper disable once PossibleNullReferenceException
            isBech32 = st.IsBech32;
            return Task.CompletedTask;
        }
    }
}