using System;
using System.Threading;
using Application.Rooms;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Application.Tests.Locations
{
    public class CreateTest : TestBase
    {
        private readonly IMapper _mapper;
        public CreateTest()
        {
            var mockMapper = new MapperConfiguration(cfg => { cfg.AddProfile(new MappingProfile()); });
            _mapper = mockMapper.CreateMapper();
        }

        [Fact]
        public void Should_Create_Location()
        {
            var context = GetDbContext();


            var locationCreateCommand = new Application.Locations.Create.Command
            {

                Id = Guid.NewGuid(),
                Name = "Test Location"

            };

            var sut = new Application.Locations.Create.Handler(context);
            var result = sut.Handle(locationCreateCommand, CancellationToken.None).Result;

            var location = context.Locations.FirstOrDefaultAsync(x => x.Id == locationCreateCommand.Id).Result;

            Assert.NotNull(location);
            Assert.Equal("Test Location", location.Name);

        }
    }
}