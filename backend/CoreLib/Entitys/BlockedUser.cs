using System.ComponentModel.DataAnnotations;
using CoreLib.Entitys.UserDataParts;

namespace CoreLib.Entitys
{
    public class BlockedUser : Entity
    {
        [Required] public virtual UserData Owner { get; private set; }
        public virtual UserData User { get; private set; }

        public BlockedUser(UserData user, DataDBContext db) : base(db)
        {
            Owner = requester;
            User = user;
        }

        public BlockedUser(DataDBContext db) : base(db)
        {
        }
    }
}