using System.Linq;
using System.Threading.Tasks;
using PuppeteerSharp;

namespace Aggregator.Services
{
    public static class Extensions
    {
        public static bool IsNullOrEmpty(this string value)
        {
            return string.IsNullOrEmpty(value);
        }

        public static async Task<string?> GetText(this Task<ElementHandle[]?> elementsTask)
        {
            var elements = await elementsTask;
            if (elements == null)
                return null;
            var element = elements.FirstOrDefault();
            if (element == null)
                return null;
            var property = await element.GetPropertyAsync("textContent");
            var value = await property.JsonValueAsync();
            var text = value?.ToString();
            return text;
        }
    }
}