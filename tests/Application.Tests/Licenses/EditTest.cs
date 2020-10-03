using System;
using System.Linq;
using System.Threading;
using Application.Errors;
using Application.Licenses;
using Xunit;
using static Application.Licenses.Edit;

namespace Application.Tests.Licenses
{
    public class EditTest : TestBase
    {

        private readonly CommandValidator _validator;

        public EditTest()
        {
            _validator = new CommandValidator();

        }

        [Fact]
        public void Should_Edit_License()
        {
            //arrange
            var context = GetDbContext();

            var modalityId = Guid.NewGuid();
            context.Modalities.Add(new Domain.Modality { Id = modalityId, Name = "Test Modality" });
            context.SaveChanges();

            var licenseId = Guid.NewGuid();
            context.Licenses.Add(new Domain.License { Id = licenseId, Name = "LicensePreEdit", DisplayName = "LPR", ModalityId = modalityId });
            context.SaveChanges();

            //act
            var sut = new Edit.Handler(context);
            var result = sut.Handle(new Edit.Command { Id = licenseId, Name = "LicensePostEdit", DisplayName = "LPO" }, CancellationToken.None).Result;

            var license = context.Licenses.FirstOrDefault(x => x.Id == licenseId);

            Assert.Equal("LicensePostEdit", license.Name);
            Assert.Equal("LPO", license.DisplayName);

        }

        [Fact]
        public void Should_Fail_Edit_License_W_Invalid_Id()
        {

            var context = GetDbContext();
            var modalityId = Guid.NewGuid();
            context.Modalities.Add(new Domain.Modality { Id = modalityId, Name = "Test Modality" });
            context.SaveChanges();

            var licenseId1 = Guid.NewGuid();

            context.Licenses.Add(new Domain.License { Id = licenseId1, Name = "Test License", DisplayName = "TL", ModalityId = modalityId });

            var sut = new Edit.Handler(context);

            var licenseId2 = Guid.NewGuid();
            var ex = Assert.ThrowsAsync<RestException>(() => sut.Handle(new Edit.Command { Id = licenseId2, Name = "LicensePostEdit", DisplayName = "LPO" }, CancellationToken.None));

            var thrownError = ex.Result.Errors.ToString();
            var expectedError = (new { license = "License not found" }).ToString();

            Assert.Equal(expectedError, thrownError);


        }

        [Fact]
        public void Should_Fail_Validations()
        {
            var licenseEditEmptyName = new Edit.Command
            {

                Id = Guid.NewGuid(),
                Name = string.Empty,
                DisplayName = "TL",

            };

            var licenseEditEmptyDisplay = new Edit.Command
            {

                Id = Guid.NewGuid(),
                Name = "Test Name",
                DisplayName = string.Empty,

            };


            var validationStatusEmptyName = _validator.Validate(licenseEditEmptyName).IsValid;
            var validationStatusEmptyDisplay = _validator.Validate(licenseEditEmptyDisplay).IsValid;

            Assert.False(validationStatusEmptyName);
            Assert.False(validationStatusEmptyDisplay);

        }


    }
}