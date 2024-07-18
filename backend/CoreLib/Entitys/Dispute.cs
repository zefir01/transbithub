using System;
using System.ComponentModel.DataAnnotations.Schema;
using CoreLib.Entitys.UserDataParts;

namespace CoreLib.Entitys
{
    public class Dispute: Entity
    {
        public DateTime CreatedAt { get; private set; } = DateTime.Now;
        [ForeignKey("deal_fk")] public virtual Deal Deal { get; private set; }
        [ForeignKey("arbitor_fk")] public virtual UserData Arbitor { get; set; }

        public Dispute(DataDBContext db) : base(db)
        {
        }

        public Dispute(Deal deal, DataDBContext db): base(db)
        {
            Deal = deal;
            db.Retranslator.DisputeUpdated(this);
        }
    }
}