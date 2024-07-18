using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Hosting;

namespace WebhookTest
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        private static byte[] LoadBytes(string str)
        {
            // remove these lines
            // -----BEGIN RSA PRIVATE KEY-----
            // -----END RSA PRIVATE KEY-----
            var pemFileData =str.Split("\n").Where(x => !x.StartsWith("-"));
            // Join it all together, convert from base64
            var binaryEncoding = Convert.FromBase64String(string.Join(null, pemFileData));
            // this is the private key byte data
            return binaryEncoding;
        }
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>()
                        .ConfigureKestrel(options =>
                        {
                            var ClientKey = File.ReadAllText("/home/pstukalov/RiderProjects/backend/WebhookTest/localhost50090.key");
                            var ClientCert= File.ReadAllText("/home/pstukalov/RiderProjects/backend/WebhookTest/localhost50090.cert");

                            var cert = new X509Certificate2(LoadBytes(ClientCert));
                            using var rsa = RSA.Create();
                            var privateKeyBytes = LoadBytes(ClientKey);
                            if (ClientKey.Contains("BEGIN RSA PRIVATE KEY"))
                                rsa.ImportRSAPrivateKey(privateKeyBytes, out _);
                            else
                                rsa.ImportPkcs8PrivateKey(privateKeyBytes, out _);
                            var certWithKey = cert.CopyWithPrivateKey(rsa);
                            cert.Dispose();
                            
                            options.Limits.MinRequestBodyDataRate = null;
                            options.Listen(IPAddress.Any, 50090, listenOptions =>
                            {
                                listenOptions.UseHttps(certWithKey);
                                listenOptions.Protocols = HttpProtocols.Http1;
                            });
                        });
                    //.UseNLog();
                });
    }
}