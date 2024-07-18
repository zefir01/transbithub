using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text.RegularExpressions;
using CoreLib.Entitys;
using Dawn;
using Shared;

namespace CoreLib.Services
{
    public static class Validators
    {
        public static void Validate(this Advertisement ad, Calculator calculator)
        {
            try
            {
                Argument(ad.Equation, nameof(ad.Equation)).NotEmpty().CorrectEquation(calculator);
                Argument(ad.Message, nameof(ad.Message)).NotEmpty().MaxLength(2000);
                Argument(ad.Title, nameof(ad.Title)).NotEmpty().MaxLength(2000);
                Argument((int) ad.Window, nameof(ad.Window)).LessThan(1400).GreaterThan(15);
                Argument(ad.MinAmount, nameof(ad.MinAmount)).GreaterThan(100);
                Argument(ad.TimeTable, nameof(ad.TimeTable)).Correct();
            }
            catch (ArgumentException e)
            {
                throw new UserException(e.Message);
            }
        }

        private static ref readonly Guard.ArgumentInfo<string> CorrectEquation(
            in this Guard.ArgumentInfo<string> equation, Calculator calculator)
        {
            try
            {
                calculator.Calc(equation).ConfigureAwait(false).GetAwaiter().GetResult();
            }
            catch (Exception e)
            {
                throw new ArgumentException("Invalid equation: " + e.Message);
            }

            return ref equation;
        }

        private static ref readonly Guard.ArgumentInfo<IReadOnlyList<TimeTableItem>> Correct(
            in this Guard.ArgumentInfo<IReadOnlyList<TimeTableItem>> items)
        {
            foreach (var item in items.Value)
                Guard.Argument(item, items.Name).Correct();

            return ref items;
        }

        private static ref readonly Guard.ArgumentInfo<TimeTableItem> Correct(
            in this Guard.ArgumentInfo<TimeTableItem> item)
        {
            Guard.Argument(item.Value.Start, item.Name).LessThan(item.Value.End);
            return ref item;
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

        public static ref readonly Guard.ArgumentInfo<string> TimezoneValidate(in this Guard.ArgumentInfo<string> value)
        {
            ReadOnlyCollection<TimeZoneInfo> tz = TimeZoneInfo.GetSystemTimeZones();
            Guard.Argument(value.Value, value.Name).NotEmpty().In(tz.Select(p => p.Id));
            return ref value;
        }

        public static ref readonly Guard.ArgumentInfo<string> LNNodeId(in this Guard.ArgumentInfo<string> value)
        {
            var regex = new Regex(@"^([a-zA-Z0-9]{66})$");
            var matches = regex.Matches(value.Value);
            if (matches.Count != 1)
                throw new ArgumentException("Invalid NodeId.");
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