using System;

namespace ApiTest
{
    public class ModelException:Exception
    {
        public ModelException(string message) : base(message)
        {
            
        }
    }
    public class NeedTwoFaException : Exception
    {
    }
}