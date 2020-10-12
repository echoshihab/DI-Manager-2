using System;
using Xunit;
using Application.Shifts;
using System.Threading;
using Domain;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Persistence;
using Application.Errors;

namespace Application.Tests.Shifts
{
    public class EditTest : TestBase
    {

        [Fact]
        public void Should_Edit_Shift()
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
            var licenseId2 = Guid.NewGuid();
            context.Licenses.Add(new Domain.License { Id = licenseId, Name = "Test License", DisplayName = "TL", ModalityId = modalityID });
            context.Licenses.Add(new Domain.License { Id = licenseId2, Name = "Test License 2", DisplayName = "TL2", ModalityId = modalityID });
            context.SaveChanges();

            var technologistId = Guid.NewGuid();
            var technologistId2 = Guid.NewGuid();
            context.Technologists.Add(new Domain.Technologist { Id = technologistId, Name = "Test Technologist", Initial = "TT", ModalityId = modalityID });
            context.Technologists.Add(new Domain.Technologist { Id = technologistId2, Name = "Test Technologist 2", Initial = "TT2", ModalityId = modalityID });

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

            var sut = new Edit.Handler(context);
            var resut = sut.Handle(new Edit.Command
            {
                Id = shiftId,
                Start = DateTime.Now,
                End = DateTime.Now.AddHours(8),
                TechnologistId = technologistId2,
                ModalityId = modalityID,
                LicenseId = licenseId2,
                LocationId = locationID,
                RoomId = roomId
            }, CancellationToken.None).Result;

            var editedShift = context.Set<Shift>().AsNoTracking()
                                .Include(s => s.License)
                                .Include(s => s.Modality)
                                .Include(s => s.Location)
                                .Include(s => s.Room)
                                .Include(s => s.Technologist)
                                .FirstOrDefault(x => x.Id == shiftId);


            Assert.Equal("TT2", editedShift.Technologist.Initial);
            Assert.Equal("TL2", editedShift.License.DisplayName);

        }


        [Fact]
        public void Should_Fail_To_Edit_Shift_With_Invalid_Id()
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
            var licenseId2 = Guid.NewGuid();
            context.Licenses.Add(new Domain.License { Id = licenseId, Name = "Test License", DisplayName = "TL", ModalityId = modalityID });
            context.Licenses.Add(new Domain.License { Id = licenseId2, Name = "Test License 2", DisplayName = "TL2", ModalityId = modalityID });
            context.SaveChanges();

            var technologistId = Guid.NewGuid();
            var technologistId2 = Guid.NewGuid();
            context.Technologists.Add(new Domain.Technologist { Id = technologistId, Name = "Test Technologist", Initial = "TT", ModalityId = modalityID });
            context.Technologists.Add(new Domain.Technologist { Id = technologistId2, Name = "Test Technologist 2", Initial = "TT2", ModalityId = modalityID });

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

            var sut = new Edit.Handler(context);


            var nonExistingShiftId = Guid.NewGuid();
            var ex = Assert.ThrowsAsync<RestException>(() => sut.Handle(new Edit.Command
            {
                Id = Guid.NewGuid(),
                Start = DateTime.Now,
                End = DateTime.Now.AddHours(8),
                TechnologistId = technologistId2,
                ModalityId = modalityID,
                LicenseId = licenseId2,
                LocationId = locationID,
                RoomId = roomId
            }, CancellationToken.None));

            var thrownError = ex.Result.Errors.ToString();
            var expectedError = (new { shift = "Shift Not Found" }).ToString();

            Assert.Equal(expectedError, thrownError);

        }
    }
}