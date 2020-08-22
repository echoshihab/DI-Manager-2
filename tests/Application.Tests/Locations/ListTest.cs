using System;
using System.Threading;
using Application.Rooms;
using AutoMapper;
using Domain;
using Xunit;

namespace Application.Tests.Locations
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
        public void Should_Return_List_Of_Locations()
        {
            var context = GetDbContext();
            context.Locations.Add(new Location { Id = Guid.NewGuid(), Name = "Test Location 1" });
            context.Locations.Add(new Location { Id = Guid.NewGuid(), Name = "Test Location 2" });
            context.SaveChanges();

            var sut = new Application.Locations.List.Handler(context, _mapper);
            var result = sut.Handle(new Application.Locations.List.Query(), CancellationToken.None).Result;

            Assert.Equal(2, result.Count);
            Assert.Equal("Test Location 1", result[0].Name);

        }


    }
}