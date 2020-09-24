using System;
using System.Threading;
using Application.Rooms;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Xunit;
using static Application.Locations.Create;

namespace Application.Tests.Locations
{
    public class CreateTest : TestBase
    {
        private readonly IMapper _mapper;
        private CommandValidator _validator;
        public CreateTest()
        {
            var mockMapper = new MapperConfiguration(cfg => { cfg.AddProfile(new MappingProfile()); });
            _mapper = mockMapper.CreateMapper();
            _validator = new CommandValidator();
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

        [Fact]
        public void Should_Not_Allow_Empty_Name()
        {
            var locationCreateCommand = new Application.Locations.Create.Command
            {

                Id = Guid.NewGuid(),
                Name = string.Empty

            };

            var validationStatus = _validator.Validate(locationCreateCommand).IsValid;
            Assert.False(validationStatus);


        }
    }
}