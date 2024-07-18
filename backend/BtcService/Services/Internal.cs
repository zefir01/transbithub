using System.Threading.Tasks;
using BitcoinLib.Services.Coins.Bitcoin;
using BtcService.Protos.Internal;
using Grpc.Core;


namespace BtcService.Services
{
    public class Internal : BtcService.Protos.Internal.Internal.InternalBase
    {
        private readonly BitcoinService coinService;

        public Internal(BitcoinService coinService)
        {
            this.coinService = coinService;
        }

        public override Task<CreateBtcInputAddressResponse> CreateBtcInputAddress(
            CreateBtcInputAddressRequest request, ServerCallContext context)
        {
            string addr;
            if (request.IsBech32)
                addr = coinService.GetNewAddress("", "bech32");
            else
                addr = coinService.GetNewAddress("", "legacy");
            return Task.FromResult(new CreateBtcInputAddressResponse
            {
                Address = addr
            });
        }
    }
}