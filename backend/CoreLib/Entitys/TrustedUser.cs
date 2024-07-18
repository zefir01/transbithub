using System.ComponentModel.DataAnnotations;
using CoreLib.Entitys.UserDataParts;

namespace CoreLib.Entitys
{
    public class TrustedUser
    {
        [Key]
        public long Id { get; private set; }
        [Required]
        public virtual UserData Owner { get; private set; }

        public virtual UserData User { get; private set; }

        public TrustedUser(UserData owner, UserData user)
        {
            Owner = owner;
            User = user;
        }
        public TrustedUser(){}
    }
}