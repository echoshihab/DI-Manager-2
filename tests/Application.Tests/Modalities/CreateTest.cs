using System;
using System.Threading;
using Application.Modalities;
using Microsoft.EntityFrameworkCore;
using static Application.Modalities.Create;
using Xunit;

namespace Application.Tests.Modalities
{
    public class CreateTest : TestBase
    {
        private CommandValidator _validator;
        public CreateTest()
        {
            _validator = new CommandValidator();
        }

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

        [Fact]
        public void Should_Fail_Validations()
        {
            var modalityCreateCommandEmptyName = new Application.Modalities.Create.Command
            {

                Id = Guid.NewGuid(),
                Name = string.Empty,
                DisplayName = "TD"

            };

            var modalityCreateCommandEmptyDisplay = new Application.Modalities.Create.Command
            {

                Id = Guid.NewGuid(),
                Name = "Test Name",
                DisplayName = string.Empty

            };

            var validationStatusEmptyName = _validator.Validate(modalityCreateCommandEmptyName).IsValid;
            var validationStatusEmptyDisplay = _validator.Validate(modalityCreateCommandEmptyDisplay).IsValid;

            Assert.False(validationStatusEmptyName);
            Assert.False(validationStatusEmptyDisplay);

        }


    }
}