using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Auth.Entitys
{
    [Index(nameof(TelegramId))]
    public class ApplicationUser : IdentityUser
    {
        public string TwoFaSecret { get; set; }
        public DateTime LastOnline { get; set; }
        public string ReferenceToken { get; set; }
        public DateTime? ReferenceTokenCreatedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsAnonymous { get; set; }
        public int TelegramId { get; set; }
    }
}