using System;
using Domain;
using Xunit;
using Application.Rooms;
using System.Threading;
using Microsoft.EntityFrameworkCore;
using Application.Errors;

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


        [Fact]
        public void Should_Fail_With_Invalid_Location()
        {
            var context = GetDbContext();
            context.Locations.Add(new Location { Id = Guid.NewGuid(), Name = "Location In Db" });
            context.SaveChanges();


            var CreateCommandInvalidLocationId = new Create.Command
            {
                Id = Guid.NewGuid(),
                Name = "Test Room",
                LocationId = Guid.NewGuid()
            };

            //act
            var sut = new Create.Handler(context);
            var ex = Assert.ThrowsAsync<RestException>(() => sut.Handle(CreateCommandInvalidLocationId, CancellationToken.None));

            var thrownError = ex.Result.Errors.ToString();
            var expectedError = (new { location = "Could not find location" }).ToString();

            Assert.Equal(expectedError, thrownError);

        }
    }
}