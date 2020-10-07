using System;
using Domain;
using Xunit;
using Application.Rooms;
using System.Threading;
using Application.Errors;
using static Application.Rooms.Edit;

namespace Application.Tests.Rooms
{
    public class EditTest : TestBase
    {
        private CommandValidator _validator;
        public EditTest()
        {
            _validator = new CommandValidator();
        }


        [Fact]
        public void Should_Edit_Room()
        {
            //arrange
            var context = GetDbContext();

            var locationID = Guid.NewGuid();
            context.Locations.Add(new Location { Id = locationID, Name = "Test Location" });

            context.SaveChanges();

            var roomId = Guid.NewGuid();
            context.Rooms.Add(new Room { Id = roomId, Name = "Room BeforeEdit", LocationId = locationID });

            context.SaveChanges();

            //act
            var sut = new Edit.Handler(context);
            var result = sut.Handle(new Edit.Command
            {
                Id = roomId,
                Name = "Room PostEdit"
            }, CancellationToken.None).Result;

            var room = context.Rooms.Find(roomId);

            Assert.Equal("Room PostEdit", room.Name);


        }

        [Fact]
        public void Should_Fail_To_Edit_Room_With_Invalid_Id()
        {

            var context = GetDbContext();
            var locationId = Guid.NewGuid();

            context.Locations.Add(new Domain.Location { Id = locationId, Name = "Test Location" });
            context.SaveChanges();

            context.Rooms.Add(new Domain.Room { Id = Guid.NewGuid(), Name = "Test Room", LocationId = locationId });

            var sut = new Edit.Handler(context);

            var nonExistingRoomId = Guid.NewGuid();
            var ex = Assert.ThrowsAsync<RestException>(() => sut.Handle(new Edit.Command { Id = nonExistingRoomId, Name = "Edit Room" }, CancellationToken.None));

            var thrownError = ex.Result.Errors.ToString();
            var expectedError = (new { room = "Room Not Found" }).ToString();

            Assert.Equal(expectedError, thrownError);


        }

        [Fact]
        public void Should_Fail_Validations()
        {
            var roomEditCommandEmptyName = new Edit.Command
            {

                Id = Guid.NewGuid(),
                Name = string.Empty,

            };

            var validationStatusEmptyName = _validator.Validate(roomEditCommandEmptyName).IsValid;
            Assert.False(validationStatusEmptyName);


        }

    }
}