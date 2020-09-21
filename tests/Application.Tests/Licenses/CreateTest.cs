using System;
using System.Linq;
using System.Threading;
using Application.Errors;
using Application.Licenses;
using Domain;
using Xunit;

namespace Application.Tests.Licenses
{
    public class CreateTest : TestBase
    {
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
    }
}