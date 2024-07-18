using System;
using System.Linq;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Entitys.UserDataParts;
using CoreLib.Services;
using Microsoft.EntityFrameworkCore;

namespace Cli
{
    public class Migrations
    {
        private readonly DataDBContext db;

        public Migrations(DataDBContext db)
        {
            this.db = db;
        }

        public Task<int> CheckMigrations()
        {
            var pendingMigrations = db.Database.GetPendingMigrations().ToList();
            if (!pendingMigrations.Any())
            {
                Console.WriteLine("No pending migrations.");
                return Task.FromResult(0);
            }

            foreach (var migration in pendingMigrations)
                Console.WriteLine("Pending: " + migration);

            return Task.FromResult(0);
        }

        public Task<int> Migrate()
        {
            var pendingMigrations = db.Database.GetPendingMigrations();
            if (pendingMigrations.Any())
            {
                Console.WriteLine(@"Starting migrations.");
                db.Database.Migrate();
                Console.WriteLine(@"Ending migrations.");
            }
            else
            {
                Console.WriteLine("No pending migrations.");
            }
            return Task.FromResult(0);
        }
    }
}