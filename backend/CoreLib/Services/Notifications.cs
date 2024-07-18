using CoreLib.Entitys;
using CoreLib.Entitys.Invoices;

namespace CoreLib.Services
{
    public class NotificationBase<TPl> : IMyNotification
    {
        public TPl Payload { get; }
        public SourceType Source { get; }


        public NotificationBase(TPl payload, SourceType source)
        {
            Payload = payload;
            Source = source;
        }
    }

    public interface IMyNotification
    {
    }

    public class NotificationBase : IMyNotification
    {
        public SourceType Source { get; }


        public NotificationBase(SourceType source)
        {
            Source = source;
        }
    }

    public class AdChangedNotification : NotificationBase<Advertisement>
    {
        public AdChangedNotification(Advertisement payload, SourceType sourceType) : base(payload, sourceType)
        {
        }
    }

    public class AdDeletedNotification : NotificationBase<long>
    {
        public AdDeletedNotification(long payload, SourceType sourceType) : base(payload, sourceType)
        {
        }
    }

    public class InvoiceChangedNotification : NotificationBase<Invoice>
    {
        public InvoiceChangedNotification(Invoice payload, SourceType sourceType) : base(payload, sourceType)
        {
        }
    }

    public class InvoiceDeleteNotification : NotificationBase<long>
    {
        public InvoiceDeleteNotification(long payload, SourceType sourceType) : base(payload, sourceType)
        {
        }
    }
}