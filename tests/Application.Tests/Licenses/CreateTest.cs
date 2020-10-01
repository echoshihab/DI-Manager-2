using System;
using System.Linq;
using System.Threading;
using Application.Errors;
using Application.Licenses;
using Domain;
using Xunit;
using static Application.Licenses.Create;

namespace Application.Tests.Licenses
{
    public class CreateTest : TestBase
    {
        private readonly CommandValidator _validator;

        public CreateTest()
        {
            _validator = new CommandValidator();

        }

        [Fact]
        public void Should_Create_License()
        {
            var context = GetDbContext();

            var modalityId = Guid.NewGuid();
            context.Modalities.Add(new Modality { Id = modalityId, Name = "Test Modality" });

            context.SaveChanges();

            var licenseCreateCommand = new Create.Command
            {
                Id = Guid.NewGuid(),
                Name = "Test License",
                DisplayName = "TL",
                ModalityId = modalityId
            };

            var sut = new Create.Handler(context);

            var result = sut.Handle(licenseCreateCommand, CancellationToken.None).Result;

            var license = context.Licenses.FirstOrDefault(x => x.ModalityId == modalityId);

            Assert.NotNull(license);
            Assert.Equal("Test License", license.Name);
        }

        [Fact]
        public void Should_Fail_License_Create_W_Invalid_Modality()
        {
            var context = GetDbContext();

            context.Modalities.Add(new Modality { Id = Guid.NewGuid(), Name = "Test Modality" });

            context.SaveChanges();

            var licenseCreateCommand = new Create.Command
            {
                Id = Guid.NewGuid(),
                Name = "Test License",
                DisplayName = "TL",
                ModalityId = Guid.NewGuid()
            };

            var sut = new Create.Handler(context);

            var ex = Assert.ThrowsAsync<RestException>(() => sut.Handle(licenseCreateCommand, CancellationToken.None));

            var thrownError = ex.Result.Errors.ToString();
            var expectedError = (new { modality = "Modality not found" }).ToString();

            Assert.Equal(expectedError, thrownError);

        }

        [Fact]
        public void Should_Fail_Validations()
        {
            var licenseCreateEmptyName = new Create.Command
            {

                Id = Guid.NewGuid(),
                Name = string.Empty,
                DisplayName = "TL",
                ModalityId = Guid.NewGuid()

            };

            var licenseCreateCommandEmptyDisplay = new Create.Command
            {

                Id = Guid.NewGuid(),
                Name = "Test Name",
                DisplayName = string.Empty,
                ModalityId = Guid.NewGuid()

            };

            var licenseCreateCommandEmptyModalityId = new Create.Command
            {
                Id = Guid.NewGuid(),
                Name = "Test Name",
                DisplayName = "TL",
                ModalityId = Guid.Empty

            };

            var validationStatusEmptyName = _validator.Validate(licenseCreateEmptyName).IsValid;
            var validationStatusEmptyDisplay = _validator.Validate(licenseCreateCommandEmptyDisplay).IsValid;
            var validationStatusEmptyModalityId = _validator.Validate(licenseCreateCommandEmptyModalityId).IsValid;

            Assert.False(validationStatusEmptyName);
            Assert.False(validationStatusEmptyDisplay);
            Assert.False(validationStatusEmptyModalityId);
        }




    }
}