using System;
using System.Linq;
using System.Threading;
using Application.Errors;
using Application.Licenses;
using Xunit;

namespace Application.Tests.Licenses
{
    public class DeleteTest : TestBase
    {
        [Fact]
        public void Should_Delete_License()
        {
            var context = GetDbContext();

            var modalityId = Guid.NewGuid();
            context.Modalities.Add(new Domain.Modality { Id = modalityId, Name = "Test Modality" });
            context.SaveChanges();

            var licenseId1 = Guid.NewGuid();
            var licenseId2 = Guid.NewGuid();
            context.Licenses.Add(new Domain.License { Id = licenseId1, Name = "Test License", DisplayName = "TL", ModalityId = modalityId });
            context.Licenses.Add(new Domain.License { Id = licenseId2, Name = "Test License 2", DisplayName = "TL2", ModalityId = modalityId });
            context.SaveChanges();

            var sut = new Delete.Handler(context);

            var result = sut.Handle(new Delete.Command { Id = licenseId1 }, CancellationToken.None).Result;

            var licenses = context.Licenses.Where(x => x.ModalityId == modalityId).ToList();

            Assert.Single(licenses);
            Assert.Equal("Test License 2", licenses[0].Name);

        }

        [Fact]
        public void Should_Fail_Delete_License_W_Invalid_Id()
        {

            var context = GetDbContext();
            var modalityId = Guid.NewGuid();
            context.Modalities.Add(new Domain.Modality { Id = modalityId, Name = "Test Modality" });
            context.SaveChanges();

            var licenseId1 = Guid.NewGuid();
            var licenseId2 = Guid.NewGuid();
            context.Licenses.Add(new Domain.License { Id = licenseId1, Name = "Test License", DisplayName = "TL", ModalityId = modalityId });

            var sut = new Delete.Handler(context);

            var ex = Assert.ThrowsAsync<RestException>(() => sut.Handle(new Delete.Command { Id = licenseId2 }, CancellationToken.None));

            var thrownError = ex.Result.Errors.ToString();
            var expectedError = (new { license = "License not found" }).ToString();

            Assert.Equal(expectedError, thrownError);


        }
    }
}