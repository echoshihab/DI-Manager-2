using System;
using System.Linq;
using System.Threading;
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

            var modalityId1 = Guid.NewGuid();
            var modalityId2 = Guid.NewGuid();

            context.Modalities.Add(new Modality
            {
                Id = modalityId1,
                Name = "Modality 1",
                DisplayName = "M1"
            });

            context.Modalities.Add(new Modality
            {
                Id = modalityId2,
                Name = "Modality 2",
                DisplayName = "M2"
            });

            context.SaveChanges();

            var sut = new Delete.Handler(context);

            var result = sut.Handle(new Delete.Command { Id = modalityId1 }, CancellationToken.None);

            var modalities = context.Modalities.ToList();
            var deletedModality = modalities.FirstOrDefault(x => x.Id == modalityId1);

            Assert.Equal("Modality 2", modalities[0].Name);
            Assert.Null(deletedModality);


        }
    }
}