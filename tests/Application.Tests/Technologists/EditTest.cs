using System;
using Xunit;
using Application.Technologists;
using System.Threading;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Application.Tests.Technologists
{
    public class EditTest : TestBase
    {
        [Fact]
        public void Should_Edit_Technologist()
        {
            var context = GetDbContext();

            var modalityId = Guid.NewGuid();
            context.Modalities.Add(new Domain.Modality { Id = modalityId, Name = "Test Modality", DisplayName = "TM" });
            context.SaveChanges();

            var technologistId = Guid.NewGuid();

            context.Technologists.Add(new Domain.Technologist
            {
                Id = technologistId,
                Name = "Test Technologist",
                ModalityId = modalityId,
                Initial = "TT",
            });
            context.SaveChanges();

            var sut = new Edit.Handler(context);

            var result = sut.Handle(new Edit.Command
            {
                Id = technologistId,
                Name = "Updated Technologist",
                Initial = "UT",
                LicenseIdList = new List<Guid> { }
            }, CancellationToken.None).Result;

            var editedTechnologist = context.Technologists.FirstOrDefault(x => x.Id == technologistId);

            Assert.Equal("Updated Technologist", editedTechnologist.Name);
            Assert.Equal("UT", editedTechnologist.Initial);







        }

    }
}