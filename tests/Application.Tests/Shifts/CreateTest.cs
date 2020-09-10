using System;
using Xunit;
using Application.Shifts;
using System.Threading;
using System.Linq;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Application.Tests.Shifts
{
    public class CreateTest : TestBase
    {
        [Fact]
        public void Should_Create_Shift()
        {
            var context = GetDbContext();

            var locationID = Guid.NewGuid();
            context.Locations.Add(new Domain.Location { Id = locationID, Name = "Test Location" });
            context.SaveChanges();

            var roomId = Guid.NewGuid();
            context.Rooms.Add(new Domain.Room { Id = roomId, Name = "TL1", LocationId = locationID });

            var modalityID = Guid.NewGuid();
            context.Modalities.Add(new Domain.Modality { Id = modalityID, Name = "Test Modality", DisplayName = "TM" });
            context.SaveChanges();

            var licenseId = Guid.NewGuid();
            context.Licenses.Add(new Domain.License { Id = licenseId, Name = "Test License", DisplayName = "TL", ModalityId = modalityID });
            context.SaveChanges();

            var technologistId = Guid.NewGuid();
            context.Technologists.Add(new Domain.Technologist { Id = technologistId, Name = "Test Technologist", Initial = "TT", ModalityId = modalityID });

            var shiftId = Guid.NewGuid();

            var sut = new Create.Handler(context);
            var result = sut.Handle(new Create.Command
            {
                Id = shiftId,
                Start = DateTime.Now,
                End = DateTime.Now.AddHours(8),
                TechnologistId = technologistId,
                ModalityId = modalityID,
                LicenseId = licenseId,
                LocationId = locationID,
                RoomId = roomId

            }, CancellationToken.None).Result;

            //adding AsNoTracking() to prevent entities being tracked and autoloading
            //without no tracking include is not required
            var createdShift = context.Set<Shift>().AsNoTracking()
                                .Include(s => s.License)
                                .Include(s => s.Modality)
                                .Include(s => s.Location)
                                .Include(s => s.Room)
                                .Include(s => s.Technologist)
                                .FirstOrDefault(x => x.Id == shiftId);

            Assert.Equal("Test Technologist", createdShift.Technologist.Name);
            Assert.Equal("Test License", createdShift.License.Name);

        }

    }
}