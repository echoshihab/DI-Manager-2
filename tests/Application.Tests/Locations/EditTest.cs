using System;
using System.Threading;
using Application.Errors;
using Domain;
using Microsoft.EntityFrameworkCore;
using Xunit;
using Application.Locations;
using static Application.Locations.Edit;


namespace Application.Tests.Locations
{
    public class EditTest : TestBase
    {
        private readonly CommandValidator _validator;

        public EditTest()
        {
            _validator = new CommandValidator();
        }


        [Fact]
        public void Should_Edit_Location()
        {
            var context = GetDbContext();
            var id = Guid.NewGuid();

            context.Locations.Add(new Location
            {
                Id = id,
                Name = "Test Location"
            });

            context.SaveChanges();


            var sut = new Edit.Handler(context);

            var result = sut.Handle(
                new Edit.Command
                {
                    Id = id,
                    Name = "Updated Location"
                }, CancellationToken.None).Result;

            var location = context.Locations.FirstOrDefaultAsync(x => x.Id == id).Result;

            Assert.Equal("Updated Location", location.Name);

        }

        [Fact]
        public void Should_Fail_Edit_Location_W_Invalid_Id()
        {
            var context = GetDbContext();


            context.Locations.Add(new Location { Id = Guid.NewGuid(), Name = "Test Location" });

            var sut = new Edit.Handler(context);

            var nonExistingLocationId = Guid.NewGuid();
            var ex = Assert.ThrowsAsync<RestException>(() => sut.Handle(new Edit.Command { Id = nonExistingLocationId, Name = "LocationEdit" }, CancellationToken.None));

            var thrownError = ex.Result.Errors.ToString();
            var expectedError = (new { location = "Location Not Found" }).ToString();

            Assert.Equal(expectedError, thrownError);


        }


        [Fact]
        public void Should_Not_Allow_Empty_Name()
        {
            var locationEditCommand = new Edit.Command
            {

                Id = Guid.NewGuid(),
                Name = string.Empty

            };

            var validationStatus = _validator.Validate(locationEditCommand).IsValid;
            Assert.False(validationStatus);


        }

    }
}