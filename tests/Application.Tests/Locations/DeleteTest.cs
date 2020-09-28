using System;
using System.Linq;
using System.Threading;
using Domain;
using Xunit;
using Application.Locations;
using Application.Errors;

namespace Application.Tests.Locations
{
    public class DeleteTest : TestBase
    {

        [Fact]
        public void Should_Delete_Location()
        {
            var context = GetDbContext();

            var id = Guid.NewGuid();

            context.Locations.Add(new Location
            {
                Id = id,
                Name = "First Location"
            });

            var secondItemId = Guid.NewGuid();

            context.Locations.Add(new Location
            {
                Id = secondItemId,
                Name = "Second Location"
            });


            context.SaveChanges();

            var sut = new Application.Locations.Delete.Handler(context);

            var result = sut.Handle(new Application.Locations.Delete.Command { Id = id }, CancellationToken.None);

            var locations = context.Locations.ToList();
            var deletedLocation = locations.FirstOrDefault(x => x.Id == id);

            Assert.Equal("Second Location", locations[0].Name);
            Assert.Null(deletedLocation);


        }

        [Fact]
        public void Delete_Location_Should_Fail_W_Invalid_Id()
        {

            var context = GetDbContext();
            context.Locations.Add(new Domain.Location { Id = Guid.NewGuid(), Name = "Test Location" });
            context.SaveChanges();


            var sut = new Delete.Handler(context);

            var nonExistingLocationId = Guid.NewGuid();

            var ex = Assert.ThrowsAsync<RestException>(() => sut.Handle(new Delete.Command { Id = nonExistingLocationId }, CancellationToken.None));

            var thrownError = ex.Result.Errors.ToString();
            var expectedError = (new { location = "Location Not Found" }).ToString();

            Assert.Equal(expectedError, thrownError);


        }
    }
}