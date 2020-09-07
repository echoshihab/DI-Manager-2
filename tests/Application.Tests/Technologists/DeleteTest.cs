using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Application.Technologists;
using Xunit;

namespace Application.Tests.Technologists
{
    public class DeleteTest : TestBase
    {
        [Fact]
        public void Should_Delete_Technologist()
        {
            var context = GetDbContext();
            var modalityId = Guid.NewGuid();
            context.Modalities.Add(new Domain.Modality { Id = modalityId, Name = "Test Modality", DisplayName = "TM" });
            context.SaveChanges();

            var technologistId1 = Guid.NewGuid();
            var technologistId2 = Guid.NewGuid();

            context.Technologists.Add(new Domain.Technologist
            {
                Id = technologistId1,
                Name = "Technologist 1",
                ModalityId = modalityId,
                Initial = "T1"
            });


            context.Technologists.Add(new Domain.Technologist
            {
                Id = technologistId2,
                Name = "Technologist 2",
                ModalityId = modalityId,
                Initial = "T2"
            });

            context.SaveChanges();

            var sut = new Delete.Handler(context);

            var result = sut.Handle(new Delete.Command { Id = technologistId1 }, CancellationToken.None).Result;

            var technologists = context.Technologists.ToList();

            Assert.Single(technologists);
            Assert.Equal("Technologist 2", technologists[0].Name);
        }
    }
}