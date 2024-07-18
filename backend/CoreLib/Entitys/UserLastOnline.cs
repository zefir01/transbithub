using System;
using System.ComponentModel.DataAnnotations.Schema;
using CoreLib.Entitys.UserDataParts;

namespace CoreLib.Entitys
{
    public class UserLastOnline : Entity
    {
        [ForeignKey("owner_fk")]
        public virtual UserData Owner { get; private set; }
        public DateTime LastOnline { get; set; } = DateTime.Now;

        public UserLastOnline(DataDBContext db) : base(db)
        {
        }

        public UserLastOnline(UserData owner, DataDBContext db) : base(db)
        {
            Owner = owner;
        }
    }
}