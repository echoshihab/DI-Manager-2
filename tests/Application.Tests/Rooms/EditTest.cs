using System;
using Domain;
using Xunit;
using Application.Rooms;
using System.Threading;

namespace Application.Tests.Rooms
{
    public class EditTest : TestBase
    {

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

    }
}