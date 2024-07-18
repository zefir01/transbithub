using System;
using System.Threading.Tasks;
#pragma warning disable 4014

namespace LnInterceptorTest
{
    class Program
    {
        static async Task Main(string[] args)
        {
            //https://github.com/lightningnetwork/lnd/issues/3605
            var c = new Client();
            await c.Test1();
        }
    }
}