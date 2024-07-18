using Microsoft.EntityFrameworkCore;

namespace CoreLib.Entitys.UserDataParts
{
    public partial class UserData
    {
        [Owned]
        public class UserDataBtc
        {
            public virtual UserData User { get; private set; }
            private DataDBContext db;

            public UserDataBtc(UserData user, DataDBContext db)
            {
                User = user;
                this.db = db;
            }

            public UserDataBtc(DataDBContext db)
            {
                this.db = db;
            }
        }
    }
}