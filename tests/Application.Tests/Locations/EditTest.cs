using System;
using System.Threading;
using Application.Rooms;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Application.Tests.Locations
{
    public class EditTest : TestBase
    {

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


            var sut = new Application.Locations.Edit.Handler(context);

            var result = sut.Handle(
                new Application.Locations.Edit.Command
                {
                    Id = id,
                    Name = "Updated Location"
                }, CancellationToken.None).Result;

            var location = context.Locations.FirstOrDefaultAsync(x => x.Id == id).Result;

            Assert.Equal("Updated Location", location.Name);

        }



    }
}