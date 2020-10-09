using System;
using Xunit;
using Application.Shifts;
using System.Threading;
using System.Linq;
using Domain;
using Microsoft.EntityFrameworkCore;
using static Application.Shifts.Create;

namespace Application.Tests.Shifts
{

    public class CreateTest : TestBase
    {

        private readonly CommandValidator _validator;
        public CreateTest()
        {
            _validator = new CommandValidator();
        }

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

        //creates shift create command with one empty guid value based on parameter
        private Create.Command ShiftCreateCommandForValidationTests(int technologistId = 1, int modalityId = 1
        , int licenseId = 1, int locationId = 1, int roomId = 1)
        {
            return new Create.Command
            {
                Id = Guid.NewGuid(),
                Start = DateTime.Now,
                End = DateTime.Now.AddHours(8),
                TechnologistId = technologistId == 1 ? Guid.NewGuid() : Guid.Empty,
                ModalityId = modalityId == 1 ? Guid.NewGuid() : Guid.Empty,
                LicenseId = licenseId == 1 ? Guid.NewGuid() : Guid.Empty,
                LocationId = locationId == 1 ? Guid.NewGuid() : Guid.Empty,
                RoomId = roomId == 1 ? Guid.NewGuid() : Guid.Empty
            };

        }

        [Fact]
        public void Should_Fail_Vaidations()
        {

            var shiftCreateCommandEmptyLocationId = ShiftCreateCommandForValidationTests(locationId: 0);
            var shiftCreateCommandEmptyRoomId = ShiftCreateCommandForValidationTests(roomId: 0);
            var shiftCreateCommandEmptyModalityId = ShiftCreateCommandForValidationTests(modalityId: 0);
            var shiftCreateCommandEmptyLicenseId = ShiftCreateCommandForValidationTests(licenseId: 0);
            var shiftCreateCommandEmptyTechnologistId = ShiftCreateCommandForValidationTests(technologistId: 0);

            var validationStatusEmptyLocationId = _validator.Validate(shiftCreateCommandEmptyLocationId).IsValid;
            var validationStatusEmptyRoomId = _validator.Validate(shiftCreateCommandEmptyRoomId).IsValid;
            var validationStatusEmptyModalityId = _validator.Validate(shiftCreateCommandEmptyRoomId).IsValid;
            var validationStatusEmptyLicenseId = _validator.Validate(shiftCreateCommandEmptyRoomId).IsValid;
            var validationStatusEmptyTechnologistId = _validator.Validate(shiftCreateCommandEmptyRoomId).IsValid;

            Assert.False(validationStatusEmptyLocationId);
            Assert.False(validationStatusEmptyRoomId);
            Assert.False(validationStatusEmptyModalityId);
            Assert.False(validationStatusEmptyLicenseId);
            Assert.False(validationStatusEmptyTechnologistId);

        }


    }
}