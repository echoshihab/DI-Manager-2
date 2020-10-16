using System;
using Xunit;
using Application.Shifts;
using System.Threading;
using Domain;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Application.Errors;
using static Application.Shifts.Edit;
using Persistence;

namespace Application.Tests.Shifts
{
    public class EditTest : TestBase
    {
        private readonly CommandValidator _validator;
        private ApplicationDbContext context;
        public EditTest()
        {
            _validator = new CommandValidator();
            context = GetDbContext(); ;
        }

        private class ShiftIds
        {
            public Guid ShiftId { get; set; }
            public Guid LocationId { get; set; }
            public Guid RoomId { get; set; }
            public Guid ModalityID { get; set; }
            public Guid OriginalLicenseId { get; set; }
            public Guid UpdateLicenseId { get; set; }
            public Guid OriginalTechnologistId { get; set; }
            public Guid UpdateTechnologistId { get; set; }
        }

        private ShiftIds Create_Shift_For_Edit_Tests_And_Return_Ids()
        {
            context = GetDbContext();
            var locationID = Guid.NewGuid();
            context.Locations.Add(new Domain.Location { Id = locationID, Name = "Test Location" });
            context.SaveChanges();

            var roomId = Guid.NewGuid();
            context.Rooms.Add(new Domain.Room { Id = roomId, Name = "TL1", LocationId = locationID });

            var modalityID = Guid.NewGuid();
            context.Modalities.Add(new Domain.Modality { Id = modalityID, Name = "Test Modality", DisplayName = "TM" });
            context.SaveChanges();

            var originalLicense = Guid.NewGuid();
            var updateLicense = Guid.NewGuid();
            context.Licenses.Add(new Domain.License { Id = originalLicense, Name = "Test License", DisplayName = "TL", ModalityId = modalityID });
            context.Licenses.Add(new Domain.License { Id = updateLicense, Name = "Test License 2", DisplayName = "TL2", ModalityId = modalityID });
            context.SaveChanges();

            var originalTechnologist = Guid.NewGuid();
            var updateTechnologist = Guid.NewGuid();
            context.Technologists.Add(new Domain.Technologist { Id = originalTechnologist, Name = "Test Technologist", Initial = "TT", ModalityId = modalityID });
            context.Technologists.Add(new Domain.Technologist { Id = updateTechnologist, Name = "Test Technologist 2", Initial = "TT2", ModalityId = modalityID });

            var shiftId = Guid.NewGuid();

            context.Shifts.Add(new Domain.Shift
            {
                Id = shiftId,
                Start = DateTime.Now,
                End = DateTime.Now.AddHours(8),
                TechnologistId = originalTechnologist,
                ModalityId = modalityID,
                LicenseId = originalLicense,
                LocationId = locationID,
                RoomId = roomId
            });

            context.SaveChanges();

            return new ShiftIds
            {
                ShiftId = shiftId,
                LocationId = locationID,
                RoomId = roomId,
                ModalityID = modalityID,
                OriginalLicenseId = originalLicense,
                UpdateLicenseId = updateLicense,
                OriginalTechnologistId = originalTechnologist,
                UpdateTechnologistId = updateTechnologist

            };

        }


        [Fact]
        public void Should_Edit_Shift()
        {

            var shiftIds = Create_Shift_For_Edit_Tests_And_Return_Ids();

            var sut = new Edit.Handler(context);
            var resut = sut.Handle(new Edit.Command
            {
                Id = shiftIds.ShiftId,
                Start = DateTime.Now,
                End = DateTime.Now.AddHours(8),
                TechnologistId = shiftIds.UpdateTechnologistId,
                ModalityId = shiftIds.ModalityID,
                LicenseId = shiftIds.UpdateLicenseId,
                LocationId = shiftIds.LocationId,
                RoomId = shiftIds.RoomId
            }, CancellationToken.None).Result;

            var editedShift = context.Set<Shift>().AsNoTracking()
                                .Include(s => s.License)
                                .Include(s => s.Modality)
                                .Include(s => s.Location)
                                .Include(s => s.Room)
                                .Include(s => s.Technologist)
                                .FirstOrDefault(x => x.Id == shiftIds.ShiftId);


            Assert.Equal(shiftIds.UpdateTechnologistId, editedShift.TechnologistId);
            Assert.Equal(shiftIds.UpdateLicenseId, editedShift.LicenseId);

        }


        [Fact]
        public void Should_Fail_To_Edit_Shift_With_Invalid_Id()
        {
            var shiftIds = Create_Shift_For_Edit_Tests_And_Return_Ids();
            var sut = new Edit.Handler(context);


            var nonExistingShiftId = Guid.NewGuid();

            var ex = Assert.ThrowsAsync<RestException>(() => sut.Handle(new Edit.Command
            {
                Id = Guid.NewGuid(),
                Start = DateTime.Now,
                End = DateTime.Now.AddHours(8),
                TechnologistId = shiftIds.UpdateTechnologistId,
                ModalityId = shiftIds.ModalityID,
                LicenseId = shiftIds.UpdateLicenseId,
                LocationId = shiftIds.LocationId,
                RoomId = shiftIds.RoomId
            }, CancellationToken.None));

            var thrownError = ex.Result.Errors.ToString();
            var expectedError = (new { shift = "Shift Not Found" }).ToString();

            Assert.Equal(expectedError, thrownError);

        }


        [Fact]
        public void Should_Fail_Vaidation()
        {

            var editCommand = new Edit.Command
            {
                Id = Guid.Empty,
                Start = DateTime.Now,
                End = DateTime.Now.AddHours(8),
                TechnologistId = Guid.NewGuid(),
                ModalityId = Guid.NewGuid(),
                LicenseId = Guid.NewGuid(),
                LocationId = Guid.NewGuid(),
                RoomId = Guid.NewGuid()
            };

            var validationStatusEmptyShiftId = _validator.Validate(editCommand).IsValid;

            Assert.False(validationStatusEmptyShiftId);


        }


    }
}