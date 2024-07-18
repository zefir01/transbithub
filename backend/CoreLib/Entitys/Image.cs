using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CoreLib.Entitys.Invoices;
using CoreLib.Entitys.UserDataParts;
using Microsoft.EntityFrameworkCore;

namespace CoreLib.Entitys
{
    [Index(nameof(IsEmpty))]
    public class Image
    {
        [Key,  DatabaseGenerated(DatabaseGeneratedOption.None)] public Guid Id { get; private set; }
        [ForeignKey("owner_fk")] public virtual UserData Owner { get; private set; }
        public DateTime CreatedAt { get; private set; } = DateTime.Now;
        public bool IsEmpty { get; private set; }
        [ForeignKey("deal_message_fk")] public virtual DealMessage DealMessage { get; private set; }
        public virtual ConversationMessage ConversationMessage { get; private set; }
        private byte[] _Preview;
        [ForeignKey("invoice_fk")] public virtual Invoice Invoice { get; private set; }
        [ForeignKey("invoice_secret_fk")] public virtual InvoiceSecret Secret { get; private set; }
        public int Order { get; set; }

        public byte[] Preview
        {
            get
            {
                if (_Preview == null)
                    return Original;
                return _Preview;
            }
            private set => _Preview = value;
        }

        public byte[] Original { get; private set; }

        public Image()
        {
        }

        public Image(Guid id, UserData owner)
        {
            Id = id;
            IsEmpty = true;
            Owner = owner;
        }

        public Image(Guid id, byte[] data, UserData owner)
        {
            Id = id;
            Owner = owner;
            Original = data;
        }

        public Image(Guid id, byte[] original, byte[] preview, UserData owner)
        {
            Id = id;
            Owner = owner;
            Original = original;
            Preview = preview;
        }

        public void SetContent(byte[] original, byte[] preview = null)
        {
            Original = original;
            Preview = preview;
            IsEmpty = false;
        }
    }
}