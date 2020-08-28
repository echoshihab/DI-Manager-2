using System;
using Domain;
using Xunit;
using Application.Rooms;
using AutoMapper;
using System.Threading;
using System.Linq;

namespace Application.Tests.Rooms
{
    public class ListTest : TestBase
    {
        private readonly IMapper _mapper;
        public ListTest()
        {
            var mockMapper = new MapperConfiguration(cfg => { cfg.AddProfile(new MappingProfile()); });
            _mapper = mockMapper.CreateMapper();
        }

        [Fact]
        public void Should_List_Rooms_In_Location()
        {


            var context = GetDbContext();

            var locationId1 = Guid.NewGuid();
            var locationId2 = Guid.NewGuid();



            context.Locations.Add(new Location { Id = locationId1, Name = "Location 1" });
            context.Locations.Add(new Location { Id = locationId2, Name = "Location 2" });

            context.SaveChanges();


            context.Rooms.Add(new Room { Id = Guid.NewGuid(), Name = "Test Room 1", LocationId = locationId1 });
            context.Rooms.Add(new Room { Id = Guid.NewGuid(), Name = "Test Room 2", LocationId = locationId1 });

            context.Rooms.Add(new Room { Id = Guid.NewGuid(), Name = "Test Room 3", LocationId = locationId2 });

            context.SaveChanges();

            var sut = new List.Handler(context, _mapper);

            var result = sut.Handle(new List.Query(locationId1), CancellationToken.None).Result;
            var roomInLocation = result.Any(x => x.Name == "Test Room 1");
            var rooomNotInLocation = result.Any(x => x.Name == "Test Room 3");

            Assert.Equal(2, result.Count);
            Assert.True(roomInLocation);
            Assert.False(rooomNotInLocation);

        }
    }
}