using System;
using Domain;
using Xunit;
using Application.Rooms;
using System.Threading;
using Microsoft.EntityFrameworkCore;

namespace Application.Tests.Rooms
{
    public class CreateTest : TestBase
    {
        [Fact]
        public void Should_Create_Room()
        {

            //arrange
            var context = GetDbContext();

            var locationId = Guid.NewGuid();

            var location = new Location
            {
                Id = locationId,
                Name = "LocationForRoomTest"
            };

            context.Locations.Add(location);
            context.SaveChanges();

            var roomId = Guid.NewGuid();
            var command = new Create.Command
            {
                Id = roomId,
                Name = "Test Room",
                LocationId = locationId
            };

            //act
            var sut = new Create.Handler(context);
            var result = sut.Handle(command, CancellationToken.None).Result;

            var room = context.Rooms.FirstOrDefaultAsync(x => x.LocationId == locationId).Result;

            Assert.NotNull(room);
            Assert.Equal("Test Room", room.Name);



        }
    }
}