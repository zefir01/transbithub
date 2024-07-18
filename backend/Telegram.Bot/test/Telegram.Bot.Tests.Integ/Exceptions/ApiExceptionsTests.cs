using System.Linq;
using System.Threading.Tasks;
using Telegram.Bot.Exceptions;
using Telegram.Bot.Tests.Integ.Framework;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Xunit;

namespace Telegram.Bot.Tests.Integ.Exceptions
{
    [Collection(Constants.TestCollections.Exceptions)]
    [Trait(Constants.CategoryTraitName, Constants.InteractiveCategoryValue)]
    [TestCaseOrderer(Constants.TestCaseOrderer, Constants.AssemblyName)]
    public class ApiExceptionsTests
    {
        private ITelegramBotClient BotClient => _fixture.BotClient;

        private readonly TestsFixture _fixture;

        public ApiExceptionsTests(TestsFixture fixture)
        {
            _fixture = fixture;
        }

        [OrderedFact("Should throw ChatNotInitiatedException while trying to send message to a user who hasn't " +
                     "started a chat with bot but bot knows about him/her.")]
        [Trait(Constants.MethodTraitName, Constants.TelegramBotApiMethods.SendMessage)]
        public async Task Should_Throw_Exception_ChatNotInitiatedException()
        {
            //ToDo add exception. forward message from another bot. Forbidden: bot can't send messages to bots
            await _fixture.SendTestInstructionsAsync(
                "Forward a message to this chat from a user that never started a chat with this bot"
            );

            Update forwardedMessageUpdate = (await _fixture.UpdateReceiver.GetUpdatesAsync(u =>
                    u.Message.ForwardFrom != null, updateTypes: UpdateType.Message
            )).Single();
            await _fixture.UpdateReceiver.DiscardNewUpdatesAsync();

            ForbiddenException e = await Assert.ThrowsAnyAsync<ForbiddenException>(() =>
                BotClient.SendTextMessageAsync(
                    forwardedMessageUpdate.Message.ForwardFrom.Id,
                    $"Error! If you see this message, talk to @{forwardedMessageUpdate.Message.From.Username}"
                )
            );

            Assert.IsType<ChatNotInitiatedException>(e);
        }
    }
}
