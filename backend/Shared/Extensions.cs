using System;
using System.Linq;
using Google.Protobuf.WellKnownTypes;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Shared
{
    public static class Extensions
    {
        public static Exception HideException(this Exception e, ILogger logger)
        {
            if (e.Message != "Image not found.")
                logger.LogError(e, e.Message);
            if (e is UserException)
                return e;
            if(e is DbUpdateConcurrencyException)
                return e;
            if (e is ArgumentException)
                return e;
            return new Exception("Internal error.");
        }
        public static void ThrowIfError(this IdentityResult result)
        {
            if (!result.Succeeded)
                throw new UserException(result.Errors.Select(p => p.Description)
                    .Aggregate((a, b) => { return a + "\n" + b; }));
        }
        public static Timestamp ToPb(this DateTime time)
        {
            return Timestamp.FromDateTime(DateTime.SpecifyKind(time, DateTimeKind.Utc));
        }

        public static Timestamp ToTimestampPb(this DateTime? time)
        {
            if (!time.HasValue)
                return DateTime.MinValue.ToPb();
            return time.Value.ToPb();
        }
    }
}