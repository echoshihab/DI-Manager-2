using System;
using System.Threading;
using Application.Modalities;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Application.Tests.Modalities
{
    public class CreateTest : TestBase
    {

        [Fact]

        public void Should_Create_Modality()
        {
            var context = GetDbContext();

            var modalityCreateCommand = new Create.Command
            {
                Id = Guid.NewGuid(),
                Name = "Test Modality",
                DisplayName = "TM"
            };

            var sut = new Create.Handler(context);

            var result = sut.Handle(modalityCreateCommand, CancellationToken.None).Result;

            var newlyCreatedModality = context.Modalities.FirstOrDefaultAsync(x => x.Id == modalityCreateCommand.Id).Result;

            Assert.NotNull(newlyCreatedModality);
            Assert.Equal("Test Modality", newlyCreatedModality.Name);
            Assert.Equal("TM", newlyCreatedModality.DisplayName);


        }


    }
}