using System;
using System.ComponentModel.DataAnnotations;

namespace Aggregator.Services.BitZlato.Entitys
{
    public class BzParams
    {
        [Key]
        public long Id { get; private set; }
        public DateTime LastFullUpdate { get; set; }
    }
}