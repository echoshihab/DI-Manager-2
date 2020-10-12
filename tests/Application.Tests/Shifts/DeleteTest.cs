using System;
using Xunit;
using Application.Shifts;
using System.Threading;
using System.Linq;
using Persistence;
using Application.Errors;

namespace Application.Tests.Shifts
{
    public class DeleteTest : TestBase
    {
        private ApplicationDbContext context;
        public DeleteTest()
        {
            context = GetDbContext();
        }
        private Guid Create_Shift_For_Delete_Test_And_Return_Id()
        {

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
            return shiftId;

        }
        [Fact]
        public void Should_Delete_Shift()
        {
            var shiftIdToDelete = Create_Shift_For_Delete_Test_And_Return_Id();

            var sut = new Delete.Handler(context);

            var result = sut.Handle(new Delete.Command
            {
                Id = shiftIdToDelete
            }, CancellationToken.None);

            var shift = context.Shifts.FirstOrDefault(x => x.Id == shiftIdToDelete);

            Assert.Null(shift);

        }

        [Fact]
        public void Should_Not_Delete_Shift_With_Invalid_Id()
        {

            Create_Shift_For_Delete_Test_And_Return_Id();  //do not need to use return id in this test

            var sut = new Delete.Handler(context);

            var nonExistingShiftId = Guid.NewGuid();

            var ex = Assert.ThrowsAsync<RestException>(() => sut.Handle(new Delete.Command { Id = nonExistingShiftId }, CancellationToken.None));

            var thrownError = ex.Result.Errors.ToString();
            var expectedError = (new { shift = "Shift Not Found" }).ToString();

            Assert.Equal(expectedError, thrownError);


        }
    }


}