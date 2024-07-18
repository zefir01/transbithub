using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Security;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using Castle.Core.Internal;
using CoreLib.Services;
using Google.Protobuf;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace CoreLib.Entitys.Invoices
{
    public class InvoiceIntegration : Entity
    {
        public enum IntegrationType
        {
            Redirect,
            Webhook
        }
        
        public IntegrationType Type { get; private set; }
        public string Redirect { get; private set; }
        public virtual Webhook Webhook { get; private set; }
        [ForeignKey("invoice_fk")] public virtual Invoice Invoice { get; private set; }

        public InvoiceIntegration(DataDBContext db) : base(db)
        {
        }

        public InvoiceIntegration(Invoice invoice, string url, string clientKey, string clientCert, string serverCert, 
            bool webhookRequired, DataDBContext db) : base(db)
        {
            Invoice = invoice;
            if (clientKey.IsNullOrEmpty())
            {
                Type = IntegrationType.Redirect;
                Redirect = url;
            }
            else
            {
                Type = IntegrationType.Webhook;
                Webhook = new Webhook(this, url, clientKey, clientCert, serverCert, webhookRequired);
            }
        }

        public void Update(string url, string clientKey, string clientCert, string serverCert, 
            bool webhookRequired)
        {
            if (clientKey.IsNullOrEmpty())
            {
                Type = IntegrationType.Redirect;
                Redirect = url;
            }
            else
            {
                Type = IntegrationType.Webhook;
                Webhook = new Webhook(this, url, clientKey, clientCert, serverCert, webhookRequired);
            }
        }
    }

    [Owned]
    public class Webhook
    {
        public string Url { get; private set; }
        public string ClientKey { get; private set; }
        public string ClientCert { get; private set; }
        public string ServerCert { get; private set; }
        public bool Required { get; private set; }
        public virtual InvoiceIntegration InvoiceIntegration { get; }

        public Webhook()
        {
        }

        public Webhook(InvoiceIntegration invoiceIntegration, string url, string clientKey, string clientCert, string serverCert, bool webhookRequired)
        {
            InvoiceIntegration = invoiceIntegration;
            Url = url;
            ClientKey = clientKey;
            ClientCert = clientCert;
            ServerCert = serverCert;
            Required = webhookRequired;
        }

        private byte[] LoadBytes(string str)
        {
            // remove these lines
            // -----BEGIN RSA PRIVATE KEY-----
            // -----END RSA PRIVATE KEY-----
            var pemFileData = str.Split("\n").Where(x => !x.StartsWith("-"));
            // Join it all together, convert from base64
            var binaryEncoding = Convert.FromBase64String(string.Join(null, pemFileData));
            // this is the private key byte data
            return binaryEncoding;
        }

        private X509Certificate2 GetCert(string certificate, string key = null)
        {
            var cert = new X509Certificate2(LoadBytes(certificate));
            if (key.IsNullOrEmpty())
                return cert;
            using var rsa = RSA.Create();
            var privateKeyBytes = LoadBytes(key);
            if (key.Contains("BEGIN RSA PRIVATE KEY"))
                rsa.ImportRSAPrivateKey(privateKeyBytes, out _);
            else
                rsa.ImportPkcs8PrivateKey(privateKeyBytes, out _);
            var certWithKey = cert.CopyWithPrivateKey(rsa);
            cert.Dispose();
            return certWithKey;
        }

        public async Task Exec(InvoicePayment payment, DataDBContext db)
        {
            var pb = payment.ToPb(payment.Invoice.Owner.UserId, true);
            var formatter = new Google.Protobuf.JsonFormatter(JsonFormatter.Settings.Default);
            var json = formatter.Format(pb);


            var certWithKey = GetCert(ClientCert, ClientKey);

            var handler = new HttpClientHandler();
            handler.ClientCertificates.Add(certWithKey);
            handler.ServerCertificateCustomValidationCallback =
                HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
            handler.ServerCertificateCustomValidationCallback = ServerCertificateCustomValidation;
            if (!db.Config.ProxyUrl.IsNullOrEmpty())
            {
                var proxy = new WebProxy
                {
                    Address = new Uri(db.Config.ProxyUrl),
                    BypassProxyOnLocal = true,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(db.Config.ProxyUser, db.Config.ProxyPass)
                };
                handler.Proxy = proxy;
            }
                
            var client = new HttpClient(handler);
            client.Timeout = TimeSpan.FromSeconds(10);

            int errorCounter = 0;
            HttpResponseMessage resp;
            List<InvoiceSecret> resultSecrets = new List<InvoiceSecret>();

            while (errorCounter < 3)
            {
                try
                {
                    resp = await client.PostAsync(Url, new StringContent(json, Encoding.UTF8, "application/json"));
                    var data = await resp.Content.ReadAsStringAsync();
                    Google.Protobuf.JsonParser parser = new JsonParser(JsonParser.Settings.Default);
                    var secrets = parser.Parse<global::Protos.TradeApi.V1.InvoiceSecretsList>(data);
                    foreach (var secret in secrets.Secrets)
                    {
                        var sec = new InvoiceSecret(secret, payment, client, db);
                        payment.Secrets.Add(sec);
                    }

                    break;
                }
                catch (InvalidJsonException)
                {
                    throw new UserException("Webhook error.");
                }
                catch
                {
                    errorCounter++;
                }
            }

            if (errorCounter == 3 && Required)
                throw new UserException("Webhook error.");
        }

        private bool ServerCertificateCustomValidation(HttpRequestMessage msg, X509Certificate2 cert,
            X509Chain chain, SslPolicyErrors policy)
        {
            var c = GetCert(ServerCert);
            var isValid= c.SerialNumber == cert.SerialNumber;
            return isValid;
        }
    }

    public class WebhookResponse
    {
        public class Secret
        {
            public List<byte[]> Images { get; set; } = new List<byte[]>();
            public string Text { get; set; }
        }

        public List<Secret> Secrets { get; set; } = new List<Secret>();
        public List<string> Redirect { get; set; }
    }
}