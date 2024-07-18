using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CoreLib.Entitys;
using CoreLib.Entitys.UserDataParts;
using Grpc.Core;
using Protos.Adminka.V1;
using Protos.TradeApi.V1;
using Dispute = CoreLib.Entitys.Dispute;

namespace CoreLib.Services
{
    public class RetranslatorBuffer : IAdChangesRetranslator, IEventsRetranslator, IPublicInvoiceRetranslator,
        IDisputesRetranslator
    {
        private readonly EventsRetranslator eventsRetranslator;
        private readonly AdChangesRetranslator adRetranslator;
        private readonly PublicInvoiceRetranslator invoiceRetranslator;
        private readonly DisputesRetranslator disputesRetranslator;

        private readonly List<UserEvent> events = new();

        private readonly List<(AdChangedNotification notification, CancellationToken cancellationToken)>
            adChangedNotification = new();

        private readonly List<(AdDeletedNotification notification, CancellationToken cancellationToken)>
            adDeletedNotification = new();

        private readonly List<(InvoiceChangedNotification notification, CancellationToken cancellationToken)>
            invoiceChangedNotifications = new();

        private readonly List<(InvoiceDeleteNotification notification, CancellationToken cancellationToken)>
            invoiceDeleteNotifications = new();

        private readonly List<Dispute> disputes = new();

        public RetranslatorBuffer(EventsRetranslator eventsRetranslator, AdChangesRetranslator adRetranslator,
            PublicInvoiceRetranslator invoiceRetranslator, DisputesRetranslator disputesRetranslator)
        {
            this.eventsRetranslator = eventsRetranslator;
            this.adRetranslator = adRetranslator;
            this.invoiceRetranslator = invoiceRetranslator;
            this.disputesRetranslator = disputesRetranslator;
        }

        public void SendAll()
        {
            foreach (var evt in events)
                eventsRetranslator.Send(evt);
            foreach (var notification in adChangedNotification)
                adRetranslator.Notify(notification.notification, notification.cancellationToken);
            foreach (var notification in adDeletedNotification)
                adRetranslator.Notify(notification.notification, notification.cancellationToken);
            foreach (var notification in invoiceChangedNotifications)
                invoiceRetranslator.Notify(notification.notification, notification.cancellationToken);
            foreach (var notification in invoiceDeleteNotifications)
                invoiceRetranslator.Notify(notification.notification, notification.cancellationToken);
            foreach (var dispute in disputes)
                disputesRetranslator.DisputeUpdated(dispute);

            Clear();
        }

        public void Clear()
        {
            events.Clear();
            adChangedNotification.Clear();
            adDeletedNotification.Clear();
            invoiceChangedNotifications.Clear();
            invoiceDeleteNotifications.Clear();
            disputes.Clear();
        }


        public async Task RegisterStream(IServerStreamWriter<SubscribeAdvertisementChangesResponse> stream,
            CancellationToken token, string userId, long adId)
        {
            await adRetranslator.RegisterStream(stream, token, userId, adId);
        }

        public void Notify(IMyNotification notification, CancellationToken cancellationToken = default)
        {
            if (notification is AdDeletedNotification not)
                adDeletedNotification.Add((not, cancellationToken));
            if (notification is AdChangedNotification not1)
                adChangedNotification.Add((not1, cancellationToken));
            if (notification is InvoiceChangedNotification not2)
                invoiceChangedNotifications.Add((not2, cancellationToken));
            if (notification is InvoiceDeleteNotification not3)
                invoiceDeleteNotifications.Add((not3, cancellationToken));
        }

        public async Task RegisterStream(IServerStreamWriter<Event> stream, CancellationToken token,
            UserData user, ServerCallContext context)
        {
            await eventsRetranslator.RegisterStream(stream, token, user, context);
        }

        public async Task RegisterStream(IServerStreamWriter<SubscribePublicInvoiceResponse> stream,
            CancellationToken token, string userId, long invoiceId)
        {
            await invoiceRetranslator.RegisterStream(stream, token, userId, invoiceId);
        }

        public void Send(UserEvent evt)
        {
            if (evt.Type == UserEventTypes.BalanceChanged)
            {
                var existed =
                    events.Any(p => p.Receiver.UserId == evt.Receiver.UserId && p.Balance.Id == evt.Balance.Id);
                if (existed)
                    return;
            }

            events.Add(evt);
        }

        public async Task RegisterStream(IServerStreamWriter<DisputeEvent> stream, CancellationToken token,
            UserData user, DataDBContext db,
            ServerCallContext context)
        {
            await disputesRetranslator.RegisterStream(stream, token, user, db, context);
        }

        public void DisputeUpdated(Dispute dispute)
        {
            if(!disputes.Contains(dispute))
                disputes.Add(dispute);
        }
    }
}