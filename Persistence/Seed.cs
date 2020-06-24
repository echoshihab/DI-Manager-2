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
                        Email = "shihab@test.com"
                    },
                    new AppUser
                    {
                        Id = "b",
                        DisplayName = "James",
                        UserName = "james",
                        Email = "james@test.com"
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
            if (!context.Shifts.Any())
            {
                var shifts = new List<Shift> {
                    new Shift{
                        Start = DateTime.Now.AddHours(-8),
                        End = DateTime.Now,
                        License = "G",
                        Location = "EGLINTON",
                        Room = "EGL 1",
                        Technologist = "BB",
                        Modality = "US"
                    },
                       new Shift{
                        Start = DateTime.Now.AddHours(-7),
                        End = DateTime.Now,
                        License = "OB",
                        Location = "EGLINTON",
                        Room = "EGL 2",
                        Technologist = "PM",
                        Modality = "US"
                    },
                       new Shift{
                        Start = DateTime.Now,
                        End = DateTime.Now.AddDays(1),
                        License = "ORTHO",
                        Location = "BRANT",
                        Room = "BRA 1",
                        Technologist = "RM",
                        Modality = "CR"
                    },
                       new Shift{
                        Start = DateTime.Now.AddDays(1),
                        End = DateTime.Now.AddDays(1).AddHours(7),
                        License = "G",
                        Location = "BOLTON",
                        Room = "BOL 1",
                        Technologist = "DD",
                        Modality = "NM"
                    },
                       new Shift{
                        Start = DateTime.Now.AddDays(2),
                        End = DateTime.Now.AddDays(2).AddHours(7),
                        License = "G",
                        Location = "BOLTON",
                        Room = "BOL 2",
                        Technologist = "RR",
                        Modality = "CR"
                    },
                        new Shift{
                        Start = DateTime.Now.AddDays(3),
                        End = DateTime.Now.AddDays(3).AddHours(6),
                        License = "VAS",
                        Location = "BRAMLEA",
                        Room = "BRA 1",
                        Technologist = "DMC",
                        Modality = "US"
                    },
                        new Shift{
                        Start = DateTime.Now.AddDays(4),
                        End = DateTime.Now.AddDays(4).AddHours(8),
                        License = "G",
                        Location = "BRAMLEA",
                        Room = "BRA 2",
                        Technologist = "SS",
                        Modality = "US"
                    },
                        new Shift{
                        Start = DateTime.Now.AddDays(5),
                        End = DateTime.Now.AddDays(5).AddHours(9),
                        License = "G",
                        Location = "BRAMLEA",
                        Room = "BRA 3",
                        Technologist = "AD",
                        Modality = "NM"
                    }

                };
                await context.Shifts.AddRangeAsync(shifts);
                await context.SaveChangesAsync();
            }
        }
    }
}