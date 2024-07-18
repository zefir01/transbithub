using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using CoreLib.Services;
using Microsoft.EntityFrameworkCore;

namespace CoreLib.Entitys
{
    [Index(nameof(From))]
    [Index(nameof(To))]
    [Index(nameof(From), nameof(To))]
    public class IpCountry
    {
        [Key] public long Id { get; private set; }
        public long From { get; private set; }
        public long To { get; private set; }
        public Catalog.Countries Country { get; private set; }

        public IpCountry()
        {
        }

        public IpCountry(string csv)
        {
            var arr = csv.Split(",");
            if (arr[2] == "\"-\"")
                throw new InvalidDataException("Empty country. Possible local address.");
            var tmp = arr[0].Replace("\"", "");
            From = long.Parse(tmp);
            tmp = arr[1].Replace("\"", "");
            To = long.Parse(tmp);
            tmp = arr[2].Replace("\"", "");
            Country = Enum.Parse<Catalog.Countries>(tmp);
        }
    }
}