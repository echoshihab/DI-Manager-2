using System;
using System.Linq;
using System.Threading;
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
            context.Licenses.Add(new Domain.License { Id = licenseId1, Name = "Test License", ModalityId = modalityId });
            context.Licenses.Add(new Domain.License { Id = licenseId2, Name = "Test License 2", ModalityId = modalityId });
            context.SaveChanges();

            var sut = new Delete.Handler(context);

            var result = sut.Handle(new Delete.Command { Id = licenseId1 }, CancellationToken.None).Result;

            var licenses = context.Licenses.Where(x => x.ModalityId == modalityId).ToList();

            Assert.Single(licenses);
            Assert.Equal("Test License 2", licenses[0].Name);



        }
    }
}