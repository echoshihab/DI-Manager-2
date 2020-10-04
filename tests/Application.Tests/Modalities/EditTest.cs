using System;
using System.Linq;
using System.Threading;
using Application.Errors;
using Application.Modalities;
using Domain;
using Xunit;
using static Application.Modalities.Edit;

namespace Application.Tests.Modalities
{
    public class EditTest : TestBase
    {
        private readonly CommandValidator _validator;
        public EditTest()
        {
            _validator = new CommandValidator();
        }
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

        [Fact]
        public void Should_Fail_To_Edit_Modality_With_Invalid_Id()
        {
            var context = GetDbContext();


            context.Modalities.Add(new Modality { Id = Guid.NewGuid(), Name = "Test Modality", DisplayName = "TM" });

            var sut = new Edit.Handler(context);

            var nonExistingModalityId = Guid.NewGuid();
            var ex = Assert.ThrowsAsync<RestException>(() => sut.Handle(new Edit.Command { Id = nonExistingModalityId, Name = "Edited Modality", DisplayName = "EM" }, CancellationToken.None));

            var thrownError = ex.Result.Errors.ToString();
            var expectedError = (new { modality = "Modality Not Found" }).ToString();

            Assert.Equal(expectedError, thrownError);
        }

        [Fact]
        public void Should_Fail_Validations()
        {
            var modalityEmptyName = new Edit.Command
            {

                Id = Guid.NewGuid(),
                Name = string.Empty,
                DisplayName = "M1"

            };

            var modalityEmptyDisplay = new Edit.Command
            {

                Id = Guid.NewGuid(),
                Name = "Modality 2",
                DisplayName = string.Empty

            };


            var validationStatusEmptyName = _validator.Validate(modalityEmptyName).IsValid;
            var validationStatusEmptyDisplay = _validator.Validate(modalityEmptyDisplay).IsValid;

            Assert.False(validationStatusEmptyName);
            Assert.False(validationStatusEmptyDisplay);
        }
    }
}