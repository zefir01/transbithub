using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Auth.Entitys;
using AutoMapper;
using IdentityServer4.Models;
using IdentityServer4.Stores;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Auth.Services
{
    public static class PersistedGrantMappers
    {
        internal static IMapper Mapper { get; }

        static PersistedGrantMappers()
        {
            Mapper = new MapperConfiguration(cfg => cfg.CreateMap<PersistedGrant, MyPersistedGrant>().ReverseMap())
                .CreateMapper();
        }

        /// <summary>
        /// Maps an entity to a model.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns></returns>
        public static PersistedGrant ToModel(this MyPersistedGrant entity)
        {
            return entity == null ? null : Mapper.Map<PersistedGrant>(entity);
        }

        /// <summary>
        /// Maps a model to an entity.
        /// </summary>
        /// <param name="model">The model.</param>
        /// <returns></returns>
        public static MyPersistedGrant ToEntity(this PersistedGrant model)
        {
            return model == null ? null : Mapper.Map<MyPersistedGrant>(model);
        }

        /// <summary>
        /// Updates an entity from a model.
        /// </summary>
        /// <param name="model">The model.</param>
        /// <param name="entity">The entity.</param>
        public static void UpdateEntity(this PersistedGrant model, MyPersistedGrant entity)
        {
            Mapper.Map(model, entity);
        }
    }

    public class PersistedGrantStore : IPersistedGrantStore
    {
        private readonly IdentityDbContext db;
        private readonly ILogger<PersistedGrantStore> logger;
        private readonly IHttpContextAccessor accessor;


        public PersistedGrantStore(IdentityDbContext db, ILogger<PersistedGrantStore> logger,
            IHttpContextAccessor accessor)
        {
            this.db = db;
            this.logger = logger;
            this.accessor = accessor;
        }

        public async Task StoreAsync(PersistedGrant token)
        {
            var existing =
                await db.PersistedGrants.FirstOrDefaultAsync(p => p.Key == token.Key);
            if (existing == null)
            {
                logger.LogDebug($"{token.Key} not found in database", token.Key);

                var persistedGrant = token.ToEntity();
                persistedGrant.RemoteIp = accessor.HttpContext.Connection.RemoteIpAddress.ToString();
                persistedGrant.LastModifed = DateTime.UtcNow;
                db.PersistedGrants.Add(persistedGrant);
                var user = await db.Users.FirstAsync(p => p.Id == persistedGrant.SubjectId);
                user.LastOnline = persistedGrant.LastModifed;
            }
            else
            {
                logger.LogDebug($"{token.Key} found in database", token.Key);

                token.UpdateEntity(existing);
                existing.RemoteIp = accessor.HttpContext.Connection.RemoteIpAddress.ToString();
                existing.LastModifed = DateTime.UtcNow;
                db.PersistedGrants.Update(existing);
            }

            await db.SaveChangesAsync();
        }

        public async Task<PersistedGrant> GetAsync(string key)
        {
            var persistedGrant =
                await db.PersistedGrants.FirstOrDefaultAsync(p => p.Key == key);
            var model = persistedGrant?.ToModel();

            logger.LogDebug($"{key} found in database.", key, model != null);

            return model;
        }

        public async Task<IEnumerable<PersistedGrant>> GetAllAsync(PersistedGrantFilter filter)
        {
            var persistedGrants = await db.PersistedGrants.Where(p => p.SubjectId == filter.SubjectId)
                .ToListAsync();
            var model = persistedGrants.Select(x => x.ToModel());

            logger.LogDebug($"persisted grants found for {filter.SubjectId}", persistedGrants.Count, filter.SubjectId);

            return model;
        }

        public async Task RemoveAsync(string key)
        {
            var persistedGrant =
                await db.PersistedGrants.FirstOrDefaultAsync(p => p.Key == key);
            if (persistedGrant != null)
            {
                logger.LogDebug($"removing {key} persisted grant from database", key);

                db.PersistedGrants.Remove(persistedGrant);
                await db.SaveChangesAsync();
            }
            else
            {
                logger.LogDebug($"no {key} persisted grant found in database", key);
            }
        }

        public async Task RemoveAllAsync(PersistedGrantFilter filter)
        {
            var persistedGrants = await db.PersistedGrants
                .Where(p => p.SubjectId == filter.SubjectId && p.ClientId == filter.ClientId)
                .ToListAsync();

            logger.LogDebug(
                $"removing {persistedGrants.Count} persisted grants from database for subject {filter.SubjectId}, clientId {filter.ClientId}",
                persistedGrants.Count, filter.SubjectId, filter.ClientId);

            foreach (var p in persistedGrants)
                db.PersistedGrants.Remove(p);
            await db.SaveChangesAsync();
        }

        public async Task RemoveAllAsync(string subjectId, string clientId, string type)
        {
            var persistedGrants = await db.PersistedGrants
                .Where(p => p.SubjectId == subjectId && p.ClientId == clientId && p.Type == type)
                .ToListAsync();

            logger.LogDebug(
                $"removing {persistedGrants.Count} persisted grants from database for subject {subjectId}, clientId {clientId}, grantType {type}",
                persistedGrants.Count, subjectId, clientId, type);

            foreach (var p in persistedGrants)
                db.PersistedGrants.Remove(p);
            await db.SaveChangesAsync();
        }
    }
}