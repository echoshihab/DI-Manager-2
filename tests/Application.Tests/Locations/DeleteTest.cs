using System;
using System.Linq;
using System.Threading;
using Domain;
using Xunit;

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
    }
}