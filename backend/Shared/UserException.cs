using System;

namespace Shared
{
    public class UserException : Exception
    {
        public UserException(string message, Exception exception=null) : base(message, exception)
        {
            
        }
    }
}