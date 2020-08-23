using System;
using System.Linq;
using System.Threading;
using Application.Modalities;
using Domain;
using Xunit;

namespace Application.Tests.Modalities
{
    public class EditTest : TestBase
    {
        [Fact]
        public void Should_Edit_Modality()
        {
            var context = GetDbContext();

            var id = Guid.NewGuid();
            context.Modalities.Add(new Modality
            {
                Id = id,
                Name = "Modality 1",
                DisplayName = "M1"
            });

            context.SaveChanges();

            var modalityToEdit = context.Modalities.FirstOrDefault(x => x.DisplayName == "M1");

            var sut = new Edit.Handler(context);

            var result = sut.Handle(new Edit.Command
            {
                Id = id,
                Name = "Updated Modality",
                DisplayName = "UM"
            }, CancellationToken.None).Result;

            var updatedLocation = context.Modalities.FirstOrDefault(x => x.Id == id);

            Assert.Equal("Updated Modality", updatedLocation.Name);


        }
    }
}