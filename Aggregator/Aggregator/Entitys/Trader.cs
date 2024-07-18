using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Aggregator.Entitys
{
    [Index(nameof(Name))]
    public class Trader
    {
        [Key] public long Id { get; protected set; }
        public string Name { get; protected set; }
        public DateTime CreatedAt { get; protected set; } = DateTime.Now;
        public virtual List<Ad> Ads { get; protected set; } = new();
        public DateTime LastActivity { get; protected set; } = DateTime.Now;
        public virtual List<TraderSnapshot> Snapshots { get; protected set; } = new();
        public DateTime UpdatedAt { get; protected set; } = DateTime.Now;
        public DateTime? RegisteredAt { get; protected set; }

        public Trader()
        {
        }
    }
}