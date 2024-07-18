using System;
using System.Globalization;
using System.Text.RegularExpressions;
using Dawn;
using Shared;

namespace Auth.Services
{
    static class Validators
    {
        public static ref readonly Guard.ArgumentInfo<string> EmailValidate(
            in this Guard.ArgumentInfo<string> str)
        {
            string email = str;
            if (string.IsNullOrWhiteSpace(str))
                throw new ArgumentException("Empty email.");

            try
            {
                // Normalize the domain
                email = Regex.Replace(email, @"(@)(.+)$", DomainMapper,
                    RegexOptions.None, TimeSpan.FromMilliseconds(200));

                // Examines the domain part of the email and normalizes it.
                string DomainMapper(Match match)
                {
                    // Use IdnMapping class to convert Unicode domain names.
                    var idn = new IdnMapping();

                    // Pull out and process domain name (throws ArgumentException on invalid)
                    string domainName = idn.GetAscii(match.Groups[2].Value);

                    return match.Groups[1].Value + domainName;
                }
            }
            catch (RegexMatchTimeoutException)
            {
                throw new ArgumentException("Invalid email.");
            }
            catch (ArgumentException)
            {
                throw new ArgumentException("Invalid email.");
            }

            try
            {
                var res = Regex.IsMatch(email,
                    @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
                    RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
                if (!res)
                    throw new ArgumentException("Invalid email.");
            }
            catch (RegexMatchTimeoutException)
            {
                throw new ArgumentException("Invalid email.");
            }

            return ref str;
        }

        public static ref readonly Guard.ArgumentInfo<string> GuidValidate(
            in this Guard.ArgumentInfo<string> id)
        {
            Guard.Argument(id.Value, id.Name).LengthInRange(32, 38);
            if (!Guid.TryParse(id.Value, out var _))
                throw new ArgumentException("Invalid guid.");
            return ref id;
        }

        public static ref readonly Guard.ArgumentInfo<string> IsEnumValue<T>(
            in this Guard.ArgumentInfo<string> value) where T : struct
        {
            if (!typeof(T).IsEnum)
                throw new ArgumentException("T must be an enumerated type.");
            Guard.Argument(value.Value, value.Name).NotEmpty();
            try
            {
                Enum.Parse<T>(value);
            }
            catch (Exception)
            {
                throw new ArgumentException(value.Name + " incorrect value.");
            }

            return ref value;
        }

        public static Guard.ArgumentInfo<T> Argument<T>(T value,
            string name, bool secure = false)
        {
            try
            {
                return Guard.Argument(value, name, secure);
            }
            catch (ArgumentException e)
            {
                throw new UserException(e.Message);
            }
        }
    }
}