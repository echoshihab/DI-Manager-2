using System;
using Xunit;
using Application.Shifts;
using AutoMapper;
using System.Threading;

namespace Application.Tests.Shifts
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
        public void Should_List_Shifts()
        {
            var context = GetDbContext();

            var locationID = Guid.NewGuid();
            context.Locations.Add(new Domain.Location { Id = locationID, Name = "Test Location" });
            context.SaveChanges();

            var roomId = Guid.NewGuid();
            context.Rooms.Add(new Domain.Room { Id = roomId, Name = "TL1", LocationId = locationID });

            var modalityID = Guid.NewGuid();
            context.Modalities.Add(new Domain.Modality { Id = modalityID, Name = "Test Modality", DisplayName = "TM" });
            context.SaveChanges();

            var licenseId = Guid.NewGuid();
            context.Licenses.Add(new Domain.License { Id = licenseId, Name = "Test License", DisplayName = "TL", ModalityId = modalityID });
            context.SaveChanges();

            var technologistId = Guid.NewGuid();
            context.Technologists.Add(new Domain.Technologist { Id = technologistId, Name = "Test Technologist", Initial = "TT", ModalityId = modalityID });

            var technologistId2 = Guid.NewGuid();
            context.Technologists.Add(new Domain.Technologist { Id = technologistId2, Name = "Test Technologist 2", Initial = "TT2", ModalityId = modalityID });
            context.SaveChanges();


            var date = DateTime.Now;

            context.Shifts.Add(new Domain.Shift
            {
                Id = Guid.NewGuid(),
                Start = date,
                End = date.AddHours(8),
                TechnologistId = technologistId,
                ModalityId = modalityID,
                LicenseId = licenseId,
                LocationId = locationID,
                RoomId = roomId
            });

            context.Shifts.Add(new Domain.Shift
            {
                Id = Guid.NewGuid(),
                Start = date,
                End = date.AddHours(8),
                TechnologistId = technologistId2,
                ModalityId = modalityID,
                LicenseId = licenseId,
                LocationId = locationID,
                RoomId = roomId
            });

            context.SaveChanges();

            var sut = new List.Handler(context, _mapper);

            var result = sut.Handle(new List.Query(filterDate: date, filterLicense: null, filterLocation: null, filterModality: null, filterTechnologist: null, monthFlag: null), CancellationToken.None).Result;

            Assert.Equal(2, result.Count);



        }
    }
}