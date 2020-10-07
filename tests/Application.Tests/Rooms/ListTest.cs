using System;
using Domain;
using Xunit;
using Application.Rooms;
using AutoMapper;
using System.Threading;
using System.Linq;
using Application.Errors;

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
            //arrange

            var context = GetDbContext();

            var locationId1 = Guid.NewGuid();

            context.Locations.Add(new Location { Id = locationId1, Name = "Location 1" });
            context.SaveChanges();


            context.Rooms.Add(new Room { Id = Guid.NewGuid(), Name = "Test Room 1", LocationId = locationId1 });
            context.Rooms.Add(new Room { Id = Guid.NewGuid(), Name = "Test Room 2", LocationId = locationId1 });
            context.SaveChanges();

            //act
            var sut = new List.Handler(context, _mapper);
            var result = sut.Handle(new List.Query(locationId1), CancellationToken.None).Result;

            var roomInLocation = result.Any(x => x.Name == "Test Room 1");

            Assert.Equal(2, result.Count);
            Assert.True(roomInLocation);


        }

        [Fact]
        public void Should_Not_Return_Unrequested_Location_Rooms()
        {
            var context = GetDbContext();

            var requestedLocation = Guid.NewGuid();
            var unrequestedLocation = Guid.NewGuid();

            context.Locations.Add(new Location { Id = requestedLocation, Name = "Requested Location" });
            context.Locations.Add(new Location { Id = unrequestedLocation, Name = "Unrequested Location" });
            context.SaveChanges();

            context.Rooms.Add(new Room { Id = Guid.NewGuid(), Name = "RL Room", LocationId = requestedLocation });
            context.Rooms.Add(new Room { Id = Guid.NewGuid(), Name = "UL Room", LocationId = unrequestedLocation });
            context.SaveChanges();

            var sut = new List.Handler(context, _mapper);
            var result = sut.Handle(new List.Query(requestedLocation), CancellationToken.None).Result;
            var roomExists = result.Any(x => x.Name == "UL Room");

            Assert.Single(result);
            Assert.False(roomExists);


        }

        [Fact]
        public void Should_Fail_With_Invalid_Location()
        {
            var context = GetDbContext();

            var location = Guid.NewGuid();
            context.Locations.Add(new Location { Id = location, Name = "Location In Db" });
            context.SaveChanges();

            context.Rooms.Add(new Room { Id = location, Name = "RL Room", LocationId = location });
            context.SaveChanges();

            var locationIdNotInDb = Guid.NewGuid();
            //act

            var sut = new List.Handler(context, _mapper);
            var ex = Assert.ThrowsAsync<RestException>(() => sut.Handle(new List.Query(locationIdNotInDb), CancellationToken.None));

            var thrownError = ex.Result.Errors.ToString();
            var expectedError = (new { location = "Location not found" }).ToString();

            Assert.Equal(expectedError, thrownError);

        }
    }
}