using System;
using Xunit;
using Application.Technologists;
using System.Threading;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Application.Tests.Technologists
{
    public class CreateTest : TestBase
    {
        [Fact]
        public void Should_Create_Technologist()
        {
            var context = GetDbContext();

            var modalityId = Guid.NewGuid();
            context.Modalities.Add(new Domain.Modality { Id = modalityId, Name = "Test Modality", DisplayName = "TM" });
            context.SaveChanges();

            var sut = new Create.Handler(context);



            var result = sut.Handle(new Create.Command
            {

                Id = Guid.NewGuid(),
                Name = "Test Technologist",
                ModalityId = modalityId,
                Initial = "TT",
                LicenseIdList = new List<Guid> { }
            }
, CancellationToken.None).Result;


            var technologist = context.Technologists.FirstOrDefault(x => x.ModalityId == modalityId);

            Assert.NotNull(technologist);
            Assert.Equal("Test Technologist", technologist.Name);


        }

    }
}