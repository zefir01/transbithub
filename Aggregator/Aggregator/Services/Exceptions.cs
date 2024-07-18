using System;

namespace Aggregator.Services
{
    public class InvalidPaymentTypeException : Exception
    {
        public InvalidPaymentTypeException(string paymentType) :
            base($"Invalid payment type: {paymentType}")
        {
        }
    }

    public class InvalidCurrencyException : Exception
    {
        public InvalidCurrencyException(string GGP) :
            base($"Invalid currency: {GGP}")
        {
        }
    }

    public class RateLimitException : Exception
    {
    }

    public class OfferNotFoundException : Exception
    {
    }
}