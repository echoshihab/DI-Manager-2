using System;
using System.Linq;
using System.Threading;
using Application.Errors;
using Application.Modalities;
using Domain;
using Xunit;

namespace Application.Tests.Modalities
{
    public class DeleteTest : TestBase
    {
        [Fact]
        public void Should_Delete_Modality()
        {
            var context = GetDbContext();

            var modalityIdOfDeleted = Guid.NewGuid();


            context.Modalities.Add(new Modality
            {
                Id = modalityIdOfDeleted,
                Name = "Modality 1",
                DisplayName = "M1"
            });

            context.Modalities.Add(new Modality
            {
                Id = Guid.NewGuid(),
                Name = "Modality 2",
                DisplayName = "M2"
            });

            context.SaveChanges();

            var sut = new Delete.Handler(context);

            var result = sut.Handle(new Delete.Command { Id = modalityIdOfDeleted }, CancellationToken.None);

            var modalities = context.Modalities.ToList();
            var deletedModality = modalities.FirstOrDefault(x => x.Id == modalityIdOfDeleted);

            Assert.Single(modalities);
            Assert.Null(deletedModality);

        }

        [Fact]
        public void Should_Fail_Delete_Modality_W_Invalid_Id()
        {

            var context = GetDbContext();
            context.Modalities.Add(new Domain.Modality { Id = Guid.NewGuid(), Name = "Test Modality" });
            context.SaveChanges();


            var sut = new Delete.Handler(context);

            var nonExistingModalityId = Guid.NewGuid();

            var ex = Assert.ThrowsAsync<RestException>(() => sut.Handle(new Delete.Command { Id = nonExistingModalityId }, CancellationToken.None));

            var thrownError = ex.Result.Errors.ToString();
            var expectedError = (new { modality = "Modality Not Found" }).ToString();

            Assert.Equal(expectedError, thrownError);


        }
    }
}