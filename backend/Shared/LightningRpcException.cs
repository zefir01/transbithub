using System;

namespace Shared
{
    public enum CLightningErrorCode : int
    {
        /* Errors from `pay`, `sendpay`, or `waitsendpay` commands */
        IN_PROGRESS = 200,
        RHASH_ALREADY_USED = 201,
        UNPARSEABLE_ONION = 202,
        DESTINATION_PERM_FAIL = 203,
        TRY_OTHER_ROUTE = 204,
        ROUTE_NOT_FOUND = 205,
        ROUTE_TOO_EXPENSIVE = 206,
        INVOICE_EXPIRED = 207,
        NO_SUCH_PAYMENT = 208,
        UNSPECIFIED_ERROR = 209,
        STOPPED_RETRYING = 210,

        /* `fundchannel` or `withdraw` errors */
        MAX_EXCEEDED = 300,
        CANNOT_AFFORD = 301,
        OUTPUT_IS_DUST = 302,
        BROADCAST_FAIL = 303,
        STILL_SYNCING_BITCOIN = 304,

        /* `connect` errors */
        CONNECT_NO_KNOWN_ADDRESS = 400,
        CONNECT_ALL_ADDRESSES_FAILED = 401,

        /* Errors from `invoice` command */
        LABEL_ALREADY_EXISTS = 900,
        PREIMAGE_ALREADY_EXISTS = 901,
    }
    public class LightningRpcException : Exception
    {
        public LightningRpcException(string message, int code) : this(message, (CLightningErrorCode) code)
        {
        }

        public LightningRpcException(string message, CLightningErrorCode code) : base(message)
        {
            Code = code;
        }

        public CLightningErrorCode Code { get; }

        [Obsolete("Use Code instead")] public int ErrorCode => (int) Code;
    }
}