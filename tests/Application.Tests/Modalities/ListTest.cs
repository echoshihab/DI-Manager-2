using System;
using Domain;
using Application.Modalities;
using Xunit;
using System.Threading;

namespace Application.Tests.Modalities
{
    public class ListTest : TestBase
    {
        [Fact]
        public void Should_List_Modalities()
        {
            var context = GetDbContext();

            context.Modalities.Add(new Modality
            {
                Id = Guid.NewGuid(),
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

            var sut = new List.Handler(context);

            var result = sut.Handle(new List.Query(), CancellationToken.None).Result;

            Assert.Equal(2, result.Count);
            Assert.Equal("Modality 1", result[0].Name);
            Assert.Equal("M2", result[1].DisplayName);

        }

    }
}