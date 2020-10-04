using System;
using Domain;
using Xunit;
using Application.Rooms;
using System.Threading;
using System.Linq;
using Application.Errors;

namespace Application.Tests.Rooms
{
    public class DeleteTest : TestBase
    {
        [Fact]
        public void Should_Delete_Room()
        {
            var context = GetDbContext();

            var locationId = Guid.NewGuid();

            var location = new Location
            {
                Id = locationId,
                Name = "LocationForDeleteRoomTest"
            };

            context.Locations.Add(location);
            context.SaveChanges();

            var roomId1 = Guid.NewGuid();
            var roomId2 = Guid.NewGuid();

            context.Rooms.Add(new Room { Id = roomId1, Name = "Room 1", LocationId = locationId });
            context.Rooms.Add(new Room { Id = roomId2, Name = "Room 2", LocationId = locationId });

            context.SaveChanges();

            var sut = new Delete.Handler(context);

            var result = sut.Handle(new Delete.Command { Id = roomId1 }, CancellationToken.None).Result;

            var room = context.Rooms.Where(x => x.LocationId == locationId).ToList();

            Assert.Single(room);
            Assert.Equal("Room 2", room[0].Name);

        }

        [Fact]
        public void Should_Fail_To_Delete_Room_With_Invalid_Id()
        {
            var context = GetDbContext();

            var locationId = Guid.NewGuid();
            context.Locations.Add(new Domain.Location { Id = locationId, Name = "Test Location" });
            context.SaveChanges();

            context.Rooms.Add(new Domain.Room { Id = Guid.NewGuid(), Name = "Test Room", LocationId = locationId });
            context.SaveChanges();


            var sut = new Delete.Handler(context);

            var nonExistingRoomId = Guid.NewGuid();

            var ex = Assert.ThrowsAsync<RestException>(() => sut.Handle(new Delete.Command { Id = nonExistingRoomId }, CancellationToken.None));

            var thrownError = ex.Result.Errors.ToString();
            var expectedError = (new { room = "Room Not Found" }).ToString();

            Assert.Equal(expectedError, thrownError);


        }
    }
}