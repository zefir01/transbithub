using System.Linq;
using Auth.Services;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Mappers;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Auth
{
    public class DbInitializer
    {
        ConfigurationDbContext _configurationDbContext;
        PersistedGrantDbContext _persistedGrantDbContext;

        public DbInitializer(
            ConfigurationDbContext configurationDbContext,
            PersistedGrantDbContext persistedGrantDbContext
        )
        {
            _configurationDbContext = configurationDbContext;
            _persistedGrantDbContext = persistedGrantDbContext;
        }

        public void Initialize()
        {
            //TODO disable clear database
            _configurationDbContext.ApiResources.RemoveRange(_configurationDbContext.ApiResources);
            _configurationDbContext.Clients.RemoveRange(_configurationDbContext.Clients);
            _configurationDbContext.IdentityResources.RemoveRange(_configurationDbContext.IdentityResources);
            _configurationDbContext.SaveChanges();

            _persistedGrantDbContext.PersistedGrants.RemoveRange(_persistedGrantDbContext.PersistedGrants);
            _persistedGrantDbContext.DeviceFlowCodes.RemoveRange(_persistedGrantDbContext.DeviceFlowCodes);
            _persistedGrantDbContext.SaveChanges();

            _configurationDbContext.Database.Migrate();
            _persistedGrantDbContext.Database.Migrate();


            if (!_configurationDbContext.Clients.Any())
            {
                foreach (var client in Clients.Get().ToList())
                {
                    _configurationDbContext.Clients.Add(client.ToEntity());
                }

                _configurationDbContext.SaveChanges();
            }

            if (!_configurationDbContext.IdentityResources.Any())
            {
                foreach (var resource in MyResources.GetIdentityResources().ToList())
                {
                    _configurationDbContext.IdentityResources.Add(resource.ToEntity());
                }

                _configurationDbContext.SaveChanges();
            }

            if (!_configurationDbContext.ApiResources.Any())
            {
                foreach (var resource in MyResources.GetApiResources().ToList())
                {
                    _configurationDbContext.ApiResources.Add(resource.ToEntity());
                }

                _configurationDbContext.SaveChanges();
            }
        }
    }
}