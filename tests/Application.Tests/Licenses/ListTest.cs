using System;
using System.Linq;
using System.Threading;
using Application.Licenses;
using AutoMapper;
using Xunit;

namespace Application.Tests.Licenses
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
        public void Should_List_Licenses()
        {

            var context = GetDbContext();

            var modalityId1 = Guid.NewGuid();
            var modalityId2 = Guid.NewGuid();
            context.Modalities.Add(new Domain.Modality { Id = modalityId1, Name = "Test Modality 1 " });
            context.Modalities.Add(new Domain.Modality { Id = modalityId2, Name = "Test Modality 2" });
            context.SaveChanges();


            context.Licenses.Add(new Domain.License { Id = Guid.NewGuid(), Name = "Test License", DisplayName = "TL", ModalityId = modalityId1 });
            context.Licenses.Add(new Domain.License { Id = Guid.NewGuid(), Name = "Test License 2", DisplayName = "TL2", ModalityId = modalityId1 });

            context.Licenses.Add(new Domain.License { Id = Guid.NewGuid(), Name = "Test License 3", DisplayName = "TL3", ModalityId = modalityId2 });
            context.SaveChanges();

            var sut = new List.Handler(context, _mapper);

            var result = sut.Handle(new List.Query(modalityId1), CancellationToken.None).Result;

            var licenseExists = result.Any(x => x.Name == "Test License");
            var licenseDoesNotExist = result.Any(x => x.Name == "Test License 3");

            Assert.Equal(2, result.Count);
            Assert.True(licenseExists);
            Assert.False(licenseDoesNotExist);

        }
    }
}