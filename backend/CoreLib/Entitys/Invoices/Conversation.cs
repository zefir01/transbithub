using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using CoreLib.Entitys.UserDataParts;
using Shared;

namespace CoreLib.Entitys.Invoices
{
    public class ConversationMessage
    {
        [Key] public long Id { get; private set; }
        [Required] public virtual UserData Owner { get; private set; }
        public string Text { get; private set; }
        public DateTime CreatedAt { get; private set; }
        private List<Image> _Images = new List<Image>();

        public virtual IReadOnlyList<Image> Images
        {
            get => _Images.OrderBy(p => p.Order).ToList();
            set
            {
                for (int i = 0; i < value.Count; i++)
                    value[i].Order = i;
                _Images = value.ToList();
            }
        }

        public virtual Conversation Conversation { get; private set; }

        public ConversationMessage()
        {
        }

        public ConversationMessage(UserData owner, string text, List<Image> images)
        {
            Owner = owner;
            Text = text;
            CreatedAt = DateTime.Now;
            Images = images;
        }
    }

    public class Conversation : Entity
    {
        public bool SellerDeleted { get; private set; }
        public bool BuyerDeleted { get; private set; }
        [Required] public virtual UserData Buyer { get; private set; }
        [Required] public virtual UserData Seller { get; private set; }

        [NotMapped]
        public bool IsDeleted
        {
            get
            {
                if (db.User.UserId == Buyer.UserId && BuyerDeleted)
                    return true;
                if (db.User.UserId == Seller.UserId && SellerDeleted)
                    return true;
                return false;
            }
        }

        [ForeignKey("invoice_fk")] public virtual Invoice Invoice { get; private set; }
        [ForeignKey("payment_fk")] public virtual InvoicePayment Payment { get; private set; }
        private List<ConversationMessage> _messages = new List<ConversationMessage>();

        public virtual IReadOnlyCollection<ConversationMessage> Messages
        {
            get => _messages;
            private set => _messages = value.ToList();
        }

        public Conversation(DataDBContext db) : base(db)
        {
        }

        public Conversation(Invoice invoice, string text, List<Guid> images, DataDBContext db) : base(db)
        {
            Invoice = invoice;
            Seller = invoice.Owner;
            if (Seller.UserId == requester.UserId && !invoice.IsPrivate)
                throw new UserException("Only the buyer can create a conversation for a public invoice.");
            if (invoice.IsPrivate)
                Buyer = invoice.TargetUser;
            else
                Buyer = requester;
            NewMessage(text, images);
        }

        public Conversation(InvoicePayment payment, string text, List<Guid> images, DataDBContext db) : base(db)
        {
            Payment = payment;
            Seller = payment.Invoice.Owner;
            Buyer = payment.Owner;
            NewMessage(text, images);
        }

        public void NewMessage(string text, List<Guid> imagesIds)
        {
            if (requester.UserId != Seller.UserId && requester.UserId != Buyer.UserId)
                throw new UserException("You do not have permission to post messages to this conversation.");
            BuyerDeleted = false;
            SellerDeleted = false;
            ConversationMessage msg;
            if (imagesIds != null && imagesIds.Any())
            {
                var images = requester.ImagesData.GetImagesInternal(imagesIds);
                msg = new ConversationMessage(requester, text, images);
            }
            else
                msg = new ConversationMessage(requester, text, new List<Image>());

            _messages.Add(msg);
        }

        public void Delete()
        {
            if (requester.UserId == Seller.UserId)
            {
                if (SellerDeleted)
                    throw new UserException("Conversation already deleted.");
                SellerDeleted = true;
            }
            else if (requester.UserId == Buyer.UserId)
            {
                if (BuyerDeleted)
                    throw new UserException("Conversation already deleted.");

                BuyerDeleted = true;
            }
            else throw new UserException("You do not have permission to delete this conversation.");
        }
    }
}