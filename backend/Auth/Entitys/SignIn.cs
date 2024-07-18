using System;
using System.ComponentModel.DataAnnotations;

namespace Auth.Entitys
{
    public class SignIn
    {
        [Key] public long Id { get; set; }
        public string Username { get; set; }
        public string ClientName { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Ip { get; set; }
        public string Result { get; set; }
    }
}