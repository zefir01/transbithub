using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CoreLib.Entitys.UserDataParts;
using CoreLib.Services;
using Grpc.Core;

namespace CoreLib.Entitys
{
    public class Entity: EntityWithoutKey
    {
        [Key]
        public long Id { get; private set; }

        public Entity(DataDBContext db):base(db)
        {
        }
    }
    
    public class EntityWithoutKey
    {
        [NotMapped]
        protected ServerCallContext Context { get; }
        [NotMapped]
        protected DataDBContext db { get; }
        [NotMapped]
        protected Calculator calculator { get; }
        [NotMapped]
        protected Pgp pgp { get; }
        [NotMapped]
        protected SourceType source { get; }
        [NotMapped]
        protected UserData requester { get; private set; }
        [NotMapped]
        protected RetranslatorBuffer Retranslator { get; }

        protected void SetRequester(UserData user)
        {
            requester = user;
        }

        public EntityWithoutKey(DataDBContext db)
        {
            this.db = db;
            calculator = db.Calculator;
            pgp = db.Pgp;
            source = db.SourceType;
            requester = db.User;
            Retranslator = db.Retranslator;
            Context = db.Context;
        }
    }
}