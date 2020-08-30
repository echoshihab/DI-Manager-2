using System;
using System.Linq;
using System.Threading;
using Application.Licenses;
using Xunit;

namespace Application.Tests.Licenses
{
    public class EditTest : TestBase
    {
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
    }
}