using System;
using System.Linq;
using CoreLib.Entitys.UserDataParts;
using Microsoft.EntityFrameworkCore;

namespace CoreLib.Entitys
{
    public class YmId : Entity
    {
        public DateTime CreatedAt { get; private set; } = DateTime.Now;
        public string YandexId { get; private set; }

        public YmId(DataDBContext db) : base(db)
        {
        }

        public YmId(string yandexId, DataDBContext db) : base(db)
        {
            YandexId = yandexId;
        }
    }

    public class YmIdsConnection : Entity
    {
        public virtual YmId YmId { get; private set; }
        public virtual UserData User { get; private set; }
        public DateTime CreatedAt { get; private set; } = DateTime.Now;

        public YmIdsConnection(DataDBContext db) : base(db)
        {
        }

        public YmIdsConnection(UserData user, string  ymId, DataDBContext db) : base(db)
        {
            User = user;
            var ent=db.YmIds.FirstOrDefault(p => p.YandexId == ymId);
            if (ent == null)
                ent = new YmId(ymId, db);
            YmId = ent;
        }
    }
}