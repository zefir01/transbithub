using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Net.Http;
using Shared;

#nullable enable

namespace CoreLib.Entitys.Invoices
{
    public class InvoiceSecret : Entity
    {
        [ForeignKey("invoice_fk")] public virtual Invoice Invoice { get; private set; }
        public virtual InvoicePayment? Payment { get; private set; }
        public string Text { get; private set; } = "";
        public string? Url { get; private set; }
        private List<Image> _Images = new();

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

        public int Order { get; set; }

#pragma warning disable 8618
        public InvoiceSecret(DataDBContext db) : base(db)
#pragma warning restore 8618
        {
        }

        public InvoiceSecret(Invoice invoice, string text, List<Guid> images, int order, DataDBContext db) : base(db)
        {
            Invoice = invoice;
            Text = text;
            Images = requester.ImagesData.GetImagesInternal(images);
            Order = order;
        }

        public void Update(string text, List<Guid> images)
        {
            Text = text;
            var toRemove = Images.Where(p => !images.Contains(p.Id)).ToList();
            Images = requester.ImagesData.GetImagesInternal(images);
            foreach (var image in toRemove)
                requester.Images.Remove(image);
        }

        public InvoiceSecret(global::Protos.TradeApi.V1.InvoiceSecret secret, InvoicePayment payment, HttpClient client,
            DataDBContext db) : base(db)
        {
            List<Image> images = new List<Image>();
            foreach (var imageStr in secret.Images)
            {
                if (Guid.TryParse(imageStr, out var imageId))
                {
                    var image = requester.Images.FirstOrDefault(p => p.Id == imageId);
                    if (image == null)
                        throw new UserException("Image not found.");
                    images.Add(image);
                }
                else if (Uri.TryCreate(imageStr, UriKind.Absolute, out var validatedUri))
                {
                    var resp = client.GetAsync(validatedUri).ConfigureAwait(false).GetAwaiter().GetResult();
                    var data = resp.Content.ReadAsByteArrayAsync().ConfigureAwait(false).GetAwaiter().GetResult();
                    var id = Guid.NewGuid();
                    var image=requester.ImagesData.StoreImage(id, data)
                        .ConfigureAwait(false).GetAwaiter().GetResult();
                    images.Add(image);
                }
            }

            Images = images;
            Payment = payment;
            Text = secret.Text;
            Url = secret.Url;
        }

        public InvoiceSecret(string url, InvoicePayment payment, DataDBContext db) : base(db)
        {
            Payment = payment;
            Url = url;
        }

        public void Sold(InvoicePayment payment)
        {
            Payment = payment;
        }
    }
}