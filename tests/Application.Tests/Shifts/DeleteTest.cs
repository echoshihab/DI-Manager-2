using System;
using Xunit;
using Application.Shifts;
using System.Threading;
using System.Linq;

namespace Application.Tests.Shifts
{
    public class DeleteTest : TestBase
    {
        [Fact]
        public void Should_Delete_Shift()
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

            context.Shifts.Add(new Domain.Shift
            {
                Id = shiftId,
                Start = DateTime.Now,
                End = DateTime.Now.AddHours(8),
                TechnologistId = technologistId,
                ModalityId = modalityID,
                LicenseId = licenseId,
                LocationId = locationID,
                RoomId = roomId
            });

            context.SaveChanges();

            var sut = new Delete.Handler(context);

            var result = sut.Handle(new Delete.Command
            {
                Id = shiftId
            }, CancellationToken.None);

            var shift = context.Shifts.FirstOrDefault(x => x.Id == shiftId);

            Assert.Null(shift);

        }
    }
}