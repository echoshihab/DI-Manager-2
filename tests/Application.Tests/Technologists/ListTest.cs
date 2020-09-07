using System;
using Xunit;
using Application.Technologists;
using AutoMapper;
using System.Threading;
using System.Linq;

namespace Application.Tests.Technologists
{
    public class ListTest : TestBase
    {
        private readonly IMapper _mapper;
        public ListTest()
        {

            var mockMapper = new MapperConfiguration(cfg => { cfg.AddProfile(new MappingProfile()); });
            _mapper = mockMapper.CreateMapper();

        }
        [Fact]
        public void Should_List_Technologists()
        {

            var context = GetDbContext();
            var modalityId1 = Guid.NewGuid();
            var modalityId2 = Guid.NewGuid();

            context.Modalities.Add(new Domain.Modality { Id = modalityId1, Name = "Test Modality 1", DisplayName = "TM1" });
            context.Modalities.Add(new Domain.Modality { Id = modalityId2, Name = "Test Modality 2", DisplayName = "TM2" });
            context.SaveChanges();

            var technologistId1 = Guid.NewGuid();
            var technologistId2 = Guid.NewGuid();
            var technologistId3 = Guid.NewGuid();

            //two technologists with same modality
            context.Technologists.Add(new Domain.Technologist
            {
                Id = technologistId1,
                Name = "Technologist 1",
                ModalityId = modalityId1,
                Initial = "T1"
            });


            context.Technologists.Add(new Domain.Technologist
            {
                Id = technologistId2,
                Name = "Technologist 2",
                ModalityId = modalityId1,
                Initial = "T2"
            });

            //one technologist with a different modality

            context.Technologists.Add(new Domain.Technologist
            {
                Id = technologistId3,
                Name = "Technologist 3",
                ModalityId = modalityId2,
                Initial = "T3"
            });



            context.SaveChanges();

            var sut = new List.Handler(context, _mapper);

            var result = sut.Handle(new List.Query(modalityId1), CancellationToken.None).Result;

            var technologistExists = result.Any(x => x.Name == "Technologist 1");
            var technologistDoesNotExist = result.Any(x => x.Name == "Technologist 3");

            Assert.Equal(2, result.Count);
            Assert.True(technologistExists);
            Assert.False(technologistDoesNotExist);


        }
    }
}