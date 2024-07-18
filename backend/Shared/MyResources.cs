using System.Collections.Generic;
using IdentityServer4.Models;

namespace Shared
{
    public static class MyResources
    {
        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new IdentityResource[]
            {
                // some standard scopes from the OIDC spec
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
                new IdentityResources.Email()

                // custom identity resource with some consolidated claims
                //new IdentityResource("custom.profile", new[] { JwtClaimTypes.Name, JwtClaimTypes.Email, "location" })
            };
        }

        public static IEnumerable<ApiResource> GetApiResources()
        {
            return new[]
            {
                // simple version with ctor
                new ApiResource("api1")
                {
                    // this is needed for introspection when using reference tokens
                    ApiSecrets = { new Secret("secret".Sha256()) },
                    Scopes =new List<string>{"profile_security", "trade", "adminka_security"}
                }
                /*
                // expanded version if more control is needed
                new ApiResource
                {
                    Name = "api2",

                    ApiSecrets =
                    {
                        new Secret("secret".Sha256())
                    },

                    UserClaims =
                    {
                        JwtClaimTypes.Name,
                        JwtClaimTypes.Email
                    },

                    Scopes =
                    {
                        new Scope
                        {
                            Name = "api2.full_access",
                            DisplayName = "Full access to API 2"
                        },
                        new Scope
                        {
                            Name = "api2.read_only",
                            DisplayName = "Read only access to API 2"
                        },
                        new Scope
                        {
                            Name = "api2.internal",
                            ShowInDiscoveryDocument = false,
                            UserClaims =
                            {
                                "internal_id"
                            }
                        }
                    }
                }
                */
            };
        }
    }
}
