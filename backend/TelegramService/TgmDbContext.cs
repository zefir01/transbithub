using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Marques.EFCore.SnakeCase;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using TelegramService.Entitys;

namespace TelegramService
{
    public interface ITgmDbContext: IDisposable
    {
        DbSet<TelegramState> TelegramStates { get; set; }
        DbSet<TelegramImage> TelegramImages { get; set; }
        DatabaseFacade Database { get; }
        ChangeTracker ChangeTracker { get; }
        IModel Model { get; }
        DbContextId ContextId { get; }
        int SaveChanges();
        int SaveChanges(bool acceptAllChangesOnSuccess);
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
        Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken);
        ValueTask DisposeAsync();
        EntityEntry Add(object entity);
        ValueTask<EntityEntry> AddAsync(object entity, CancellationToken cancellationToken);
        EntityEntry Attach(object entity);
        EntityEntry Update(object entity);
        EntityEntry Remove(object entity);
        void AddRange(params object[] entities);
        Task AddRangeAsync(params object[] entities);
        void AttachRange(params object[] entities);
        void UpdateRange(params object[] entities);
        void RemoveRange(params object[] entities);
        void AddRange(IEnumerable<object> entities);
        Task AddRangeAsync(IEnumerable<object> entities, CancellationToken cancellationToken);
        void AttachRange(IEnumerable<object> entities);
        void UpdateRange(IEnumerable<object> entities);
        void RemoveRange(IEnumerable<object> entities);
        object Find(Type entityType, params object[] keyValues);
        ValueTask<object> FindAsync(Type entityType, params object[] keyValues);
        ValueTask<object> FindAsync(Type entityType, object[] keyValues, CancellationToken cancellationToken);
        string ToString();
        bool Equals(object obj);
        int GetHashCode();
        event EventHandler<SavingChangesEventArgs> SavingChanges;
        event EventHandler<SavedChangesEventArgs> SavedChanges;
        event EventHandler<SaveChangesFailedEventArgs> SaveChangesFailed;
    }
    public class TgmDbContext : DbContext, ITgmDbContext
    {
        public DbSet<TelegramState> TelegramStates { get; set; }

        public DbSet<TelegramImage> TelegramImages { get; set; }
        private readonly IConfig config;


        public TgmDbContext(IConfig config)
        {
            this.config = config;
        }


        
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLazyLoadingProxies();
            optionsBuilder.UseNpgsql(config.TelegramConnection, builder =>
            {
                builder.EnableRetryOnFailure();
            });
        }
        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<TelegramState>().HasMany(p => p.WaitingImages).WithOne(p => p.State);
            modelBuilder.ToSnakeCase();
        }
    }
}