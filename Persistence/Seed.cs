using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Domain.Utility;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(ApplicationDbContext context, UserManager<AppUser> userManager,
        RoleManager<IdentityRole> roleManager)
        {
            if (!roleManager.Roles.Any())
            {
                var roles = new List<IdentityRole>
                    {
                        new IdentityRole(StaticDetail.Role_Admin),
                        new IdentityRole(StaticDetail.Role_Coordinator)

                    };
                foreach (var role in roles)
                {
                    await roleManager.CreateAsync(role);
                }


            }

            if (!userManager.Users.Any())
            {
                if (!userManager.Users.Any())
                {
                    var users = new List<AppUser>

                {
                    new AppUser
                    {
                        Id = "a",
                        DisplayName = "Shihab",
                        UserName = "shihab",
                        Email = "shihab@test.com",
                    },
                    new AppUser
                    {
                        Id = "b",
                        DisplayName = "James",
                        UserName = "james",
                        Email = "james@test.com",
                        ModalityId = new Guid("288eb0dd-f9ef-4e67-b5c8-acf8b3366037")
                },
                    new AppUser
                    {
                        Id = "c",
                        DisplayName = "Thomas",
                        UserName = "thomas",
                        Email = "thomas@test.com"
                    },
                };



                    foreach (var user in users)
                    {
                        await userManager.CreateAsync(user, "Pa$$w0rd");
                        if (user.Id == "a")
                        {
                            await userManager.AddToRoleAsync(user, StaticDetail.Role_Admin);
                        }
                        if (user.Id == "b")
                        {
                            await userManager.AddToRoleAsync(user, StaticDetail.Role_Coordinator);
                        }
                    }
                }
            }

        }
    }
}