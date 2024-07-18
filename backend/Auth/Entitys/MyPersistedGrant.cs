using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Auth.Entitys
{
    [Index(nameof(SubjectId))]
    [Index(nameof(CreationTime))]
    [Index(nameof(RemoteIp))]
    [Index(nameof(LastModifed))]
    public class MyPersistedGrant
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string Key { get; set; }

        public string Type { get; set; }
        public string SubjectId { get; set; }
        public string ClientId { get; set; }
        public DateTime CreationTime { get; set; }
        public DateTime? Expiration { get; set; }
        public string Data { get; set; }
        public string RemoteIp { get; set; }
        public DateTime LastModifed { get; set; }

        public override int GetHashCode()
        {
            return Type.GetHashCode() + SubjectId.GetHashCode() + ClientId.GetHashCode() + CreationTime.GetHashCode() +
                   Data.GetHashCode();
        }
    }
}