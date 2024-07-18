using System;
using System.Diagnostics;
using System.Text;
using System.Threading.Tasks;
using Castle.Core.Internal;
using Microsoft.Extensions.Logging;

namespace CoreLib.Services
{
    /*
gpg --no-default-keyring --keyring ./new.pgp --import public.pgp && echo $?
gpg --no-default-keyring --keyring ./new.pgp --allow-secret-key-import --import private.pgp && echo $?

gpg -q --trust-model always --no-symkey-cache --no-default-keyring --keyring ./new.pgp --output tmp.sym --sign --batch --passphrase aaa --symmetric --armor --yes ~/tmp
LANG=en_us_8859_1 gpg -q --no-auto-key-retrieve --no-symkey-cache --no-default-keyring --keyring ./new.pgp --batch --passphrase bbb --decrypt tmp.sym
gpg: decryption failed: Bad session key

LANG=en_us_8859_1 gpg -q --no-auto-key-retrieve --no-symkey-cache --no-default-keyring --keyring ./new.pgp --batch --verify ./tmp.sym


LANG=en_us_8859_1 gpg -q --no-auto-key-retrieve --no-symkey-cache --no-default-keyring --keyring ./new.pgp --batch --decrypt --batch --passphrase aaa ~/tmp.asc; echo $?
LANG=en_us_8859_1 cat ~/tmp.asc | gpg -q --no-auto-key-retrieve --no-symkey-cache --no-default-keyring --keyring ./new.pgp --batch --decrypt --batch --passphrase aaa; echo $?
     */
    public class Pgp
    {
        private const string KeyringName = "keyring.pgp";
        private readonly Config config;
        public class GpgException : Exception
        {
            public GpgException(string message, ILogger<Pgp> logger) : base(message)
            {
                logger.LogWarning(message, this);
            }
        }

        public class GpgPasswordException : GpgException
        {
            public GpgPasswordException(string message, ILogger<Pgp> logger) : base(message, logger)
            {
            }
        }

        private readonly ILogger<Pgp> logger;

        public Pgp(ILogger<Pgp> logger, Config config)
        {
            //var signed = Sign("sdfvbfdsbfb\nsadvsadvsadv", "vvv").ConfigureAwait(false).GetAwaiter().GetResult();
            //var signed=ClearSign("sdfvbfdsbfb\nsadvsadvsadv").ConfigureAwait(false).GetAwaiter().GetResult();
            //var decrypted = Decrypt(signed, "vvv").ConfigureAwait(false).GetAwaiter().GetResult();

            this.logger = logger;
            this.config = config;
        }

        private async Task<(string output, string error, int exitCode)> Run(string command, string text)
        {
            using var process = new Process
            {
                StartInfo =
                {
                    FileName = "/usr/bin/gpg",
                    Arguments =
                        $"-q --no-auto-key-retrieve --no-symkey-cache --no-default-keyring --keyring ./{KeyringName} --batch " +
                        command,
                    CreateNoWindow = true,
                    UseShellExecute = false,
                    RedirectStandardInput = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true
                }
            };
            process.StartInfo.EnvironmentVariables["LANG"] = "en_us_8859_1";
            process.Start();

            await process.StandardInput.WriteAsync(text);
            process.StandardInput.Close();
            var o = await process.StandardOutput.ReadToEndAsync();
            var e = await process.StandardError.ReadToEndAsync();
            await process.WaitForExitAsync();
            return (o, e, process.ExitCode);
        }


        public async Task<string> Sign(string text, string pass = null)
        {
            string command;
            if (!pass.IsNullOrEmpty())
                command =
                    $"--sign --symmetric --armor --passphrase {Convert.ToBase64String(Encoding.Unicode.GetBytes(pass))}";
            else
                command = "--clearsign";
            (string output, string error, int exitCode) = await Run(command, text);
            if (exitCode != 0)
                throw new GpgException(error, logger);
            return output;
        }

        public async Task<string> Decrypt(string text, string pass = null)
        {
            string command;
            if (!pass.IsNullOrEmpty())
                command =
                    $"--decrypt --passphrase {Convert.ToBase64String(Encoding.Unicode.GetBytes(pass))}";
            else
                command = "--decrypt";
            (string output, string error, int exitCode) = await Run(command, text);
            if (exitCode != 0)
                if (error == "gpg: decryption failed: Bad session key\n")
                    throw new GpgPasswordException(error, logger);
                else
                    throw new GpgException(error, logger);
            if(!error.Contains($"using RSA key {config.GpgPublicKey}"))
                throw new GpgException(error, logger);
            return output;
        }
    }
}