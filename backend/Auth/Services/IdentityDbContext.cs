using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Auth.Entitys;
using Backend.Protos.Internal;
using Grpc.Core;
using Grpc.Net.Client;
using IdentityModel.Client;
using Marques.EFCore.SnakeCase;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Auth.Services
{
    public class IdentityDbContext : IdentityDbContext<ApplicationUser>
    {
        private readonly IIdentityDbConfig config;
        public DbSet<SignIn> SignIns { get; set; }
        public DbSet<MyPersistedGrant> PersistedGrants { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.ToSnakeCase();
        }

        public IdentityDbContext(IIdentityDbConfig config)
        {
            this.config = config;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(config.IdentityConnection, builder =>
            {
                builder.EnableRetryOnFailure();
            });
        }
        
    }
}