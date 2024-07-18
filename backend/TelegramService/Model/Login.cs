using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using IdentityModel.Client;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Shared;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using TelegramService.Services;
using AsyncResult = System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;

namespace TelegramService.Model
{
    public class LoginState : StateBase
    {
        public Login.Status Status { get; set; }
        public string Username;
        public string Password;
    }

    public class Login : BaseMenu
    {
        public enum Status
        {
            Start,
            EnterLogin,
            EnterPassword,
            Enter2Fa
        }

        private Status status = Status.Start;
        private string username;
        private string password;
        private Localization.Login s;

        protected override IReadOnlyList<ICommand> Commands
        {
            get
            {
                if (status == Status.Start)
                {
                    if (Menu.Profile.IsAnonymous)
                        return new[]
                        {
                            new Command(s.Get(Localization.Login.Keys.SignIn), 1)
                        };
                    return new[]
                    {
                        new Command(s.Get(Localization.Login.Keys.SignOut), 1)
                    };
                }

                return new List<ICommand>();
            }
        }

        public override string Name
        {
            get
            {
                if (!Menu.Profile.IsAnonymous)
                    return s.Get(Localization.Login.Keys.SignOut);
                return s.Get(Localization.Login.Keys.SignIn);
            }
        }

        public override string Header
        {
            get
            {
                if(Menu.Profile.IsAnonymous)
                    return s.Get(Localization.Login.Keys.StatusNotAuth);
                return $"{s.Get(Localization.Login.Keys.StatusAuth)}{Menu.Profile.Username}";
            }
        }

        public Login(BaseMenu parent) : base(parent)
        {
            s = new Localization.Login(Menu);
        }

        protected override async AsyncResult NewCommand(ICommand command)
        {
            switch (command.Id)
            {
                case 1:
                    if (Menu.Profile.IsAnonymous)
                    {
                        status = Status.EnterLogin;
                        return await Print($"<code>{s.Get(Localization.Login.Keys.EnterLogin)}</code>");
                    }
                    status = Status.Start;
                    username = "";
                    password = "";
                    return await Menu.Queue.Logout();
            }

            return await base.NewCommand(command);
        }

        public override async AsyncResult NewMessage(Message message)
        {
            if (message.Type != MessageType.Text)
                return await PrintError();
            string text = message.Text;
            switch (status)
            {
                case Status.EnterLogin:
                    username = text;
                    status = Status.EnterPassword;
                    return await Print($"<code>{s.Get(Localization.Login.Keys.EnterPassword)}</code>");
                case Status.EnterPassword:
                {
                    password = text;

                    try
                    {
                        status = Status.Start;
                        return  await Menu.Queue.Login(username, password);
                    }
                    catch (NeedTwoFaException)
                    {
                        status = Status.Enter2Fa;
                        return await Print($"<code>{s.Get(Localization.Login.Keys.Enter2Fa)}</code>");
                    }
                }
                case Status.Enter2Fa:
                {
                    try
                    {
                        status = Status.Start;
                        return await Menu.Queue.Login(username, password, message.Text);
                    }
                    catch (NeedTwoFaException)
                    {
                        status = Status.Enter2Fa;
                        return await PrintError(s.Get(Localization.Login.Keys.Invalid2Fa));
                    }
                }
            }

            return await base.NewMessage(message);
        }

        public override Task<StateBase> GetState()
        {
            return Task.FromResult<StateBase>(new LoginState
            {
                Id = Id,
                Status = status,
                Username = username,
                Password = password
            });
        }

        public override Task SetState(StateBase state)
        {
            var s = state as LoginState;
            status = s.Status;
            username = s.Username;
            password = s.Password;
            return Task.CompletedTask;
        }

        protected override Task OnBack()
        {
            switch (status)
            {
                case Status.Start:
                    return Parent.Print();
                case Status.EnterLogin:
                    status = Status.Start;
                    return Print();
                case Status.EnterPassword:
                    status = Status.EnterLogin;
                    return Print();
                case Status.Enter2Fa:
                    status = Status.EnterPassword;
                    return Print();
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }
}