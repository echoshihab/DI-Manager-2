using System;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class ApplicationDbContext : IdentityDbContext<AppUser>
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Shift> Shifts { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Technologist> Technologists { get; set; }
        public DbSet<Modality> Modalities { get; set; }
        public DbSet<License> Licenses { get; set; }
        public DbSet<TechnologistLicense> TechnologistLicenses { get; set; }
        public DbSet<AppUser> AppUsers { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);


            builder.Entity<TechnologistLicense>(x => x.HasKey(ta => new { ta.TechnologistId, ta.LicenseId }));

            builder.Entity<TechnologistLicense>()
                .HasOne(t => t.Technologist)
                .WithMany(t => t.Licenses)
                .HasForeignKey(t => t.TechnologistId);

            builder.Entity<TechnologistLicense>()
                .HasOne(l => l.License)
                .WithMany(l => l.Technologists)
                .HasForeignKey(l => l.LicenseId);

        }
    }
}
