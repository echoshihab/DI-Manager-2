using System;
using Xunit;
using Application.Shifts;
using AutoMapper;
using System.Threading;
using Persistence;
using Application.Errors;

namespace Application.Tests.Shifts
{
    public class ListTest : TestBase
    {
        private readonly IMapper _mapper;
        private ApplicationDbContext context;
        public ListTest()
        {
            var mockMapper = new MapperConfiguration(cfg => { cfg.AddProfile(new MappingProfile()); });
            _mapper = mockMapper.CreateMapper();
            context = GetDbContext();
        }

        private class ShiftRelatedIds
        {
            public Guid LocationId { get; set; }
            public Guid RoomId { get; set; }
            public Guid ModalityId { get; set; }
            public Guid LicenseId1 { get; set; }
            public Guid LicenseId2 { get; set; }
            public Guid TechnologistId1 { get; set; }
            public Guid TechnologistId2 { get; set; }
        }

        private ShiftRelatedIds Create_Shift_For_List_Tests_And_Return_Ids()
        {
            context = GetDbContext();
            var locationID = Guid.NewGuid();
            context.Locations.Add(new Domain.Location { Id = locationID, Name = "Test Location" });
            context.SaveChanges();

            var roomId = Guid.NewGuid();
            context.Rooms.Add(new Domain.Room { Id = roomId, Name = "TL1", LocationId = locationID });

            var modalityId = Guid.NewGuid();
            context.Modalities.Add(new Domain.Modality { Id = modalityId, Name = "Test Modality", DisplayName = "TM" });
            context.SaveChanges();

            var licenseId1 = Guid.NewGuid();
            var licenseId2 = Guid.NewGuid();
            context.Licenses.Add(new Domain.License { Id = licenseId1, Name = "Test License", DisplayName = "TL", ModalityId = modalityId });
            context.Licenses.Add(new Domain.License { Id = licenseId2, Name = "Test License 2", DisplayName = "TL2", ModalityId = modalityId });
            context.SaveChanges();

            var technologistId1 = Guid.NewGuid();
            var technologistId2 = Guid.NewGuid();
            context.Technologists.Add(new Domain.Technologist { Id = technologistId1, Name = "Test Technologist", Initial = "TT", ModalityId = modalityId });
            context.Technologists.Add(new Domain.Technologist { Id = technologistId2, Name = "Test Technologist 2", Initial = "TT2", ModalityId = modalityId });

            var shiftId = Guid.NewGuid();


            context.SaveChanges();

            return new ShiftRelatedIds
            {
                LocationId = locationID,
                RoomId = roomId,
                ModalityId = modalityId,
                LicenseId1 = licenseId1,
                LicenseId2 = licenseId2,
                TechnologistId1 = technologistId1,
                TechnologistId2 = technologistId2

            };

        }

        [Fact]
        public void Should_List_Shifts()
        {

            var shiftRelatedIds = Create_Shift_For_List_Tests_And_Return_Ids();

            var date = DateTime.Now;

            context.Shifts.Add(new Domain.Shift
            {
                Id = Guid.NewGuid(),
                Start = date,
                End = date.AddHours(8),
                TechnologistId = shiftRelatedIds.TechnologistId1,
                ModalityId = shiftRelatedIds.ModalityId,
                LicenseId = shiftRelatedIds.LicenseId1,
                LocationId = shiftRelatedIds.LocationId,
                RoomId = shiftRelatedIds.RoomId
            });

            context.Shifts.Add(new Domain.Shift
            {
                Id = Guid.NewGuid(),
                Start = date,
                End = date.AddHours(8),
                TechnologistId = shiftRelatedIds.TechnologistId2,
                ModalityId = shiftRelatedIds.ModalityId,
                LicenseId = shiftRelatedIds.LicenseId1,
                LocationId = shiftRelatedIds.LocationId,
                RoomId = shiftRelatedIds.RoomId
            });

            context.SaveChanges();

            var sut = new List.Handler(context, _mapper);

            var result = sut.Handle(new List.Query(filterDate: date, filterLicense: null, filterLocation: null, filterModality: null, filterTechnologist: null, monthFlag: null), CancellationToken.None).Result;

            Assert.Equal(2, result.Count);



        }
        [Fact]
        public void Should_List_Only_Query_Matching_Shifts()
        {

            var shiftRelatedIds = Create_Shift_For_List_Tests_And_Return_Ids();

            var date = DateTime.Now;

            context.Shifts.Add(new Domain.Shift
            {
                Id = Guid.NewGuid(),
                Start = date,
                End = date.AddHours(8),
                TechnologistId = shiftRelatedIds.TechnologistId1,
                ModalityId = shiftRelatedIds.ModalityId,
                LicenseId = shiftRelatedIds.LicenseId1,
                LocationId = shiftRelatedIds.LocationId,
                RoomId = shiftRelatedIds.RoomId
            });

            context.Shifts.Add(new Domain.Shift
            {
                Id = Guid.NewGuid(),
                Start = date,
                End = date.AddHours(8),
                TechnologistId = shiftRelatedIds.TechnologistId2,
                ModalityId = shiftRelatedIds.ModalityId,
                LicenseId = shiftRelatedIds.LicenseId1,
                LocationId = shiftRelatedIds.LocationId,
                RoomId = shiftRelatedIds.RoomId
            });

            context.SaveChanges();

            var sut = new List.Handler(context, _mapper);

            var result = sut.Handle(new List.Query(filterDate: date, filterLicense: null, filterLocation: null, filterModality: null, filterTechnologist: shiftRelatedIds.TechnologistId1, monthFlag: null), CancellationToken.None).Result;

            Assert.Single(result);
            Assert.Equal(shiftRelatedIds.TechnologistId1, result[0].TechnologistId);


        }

        [Fact]
        public void Should_Fail_Without_Date()
        {
            var sut = new List.Handler(context, _mapper);

            var ex = Assert.ThrowsAsync<RestException>(() => sut.Handle(new List.Query(filterDate: null, filterLicense: null, filterLocation: null, filterModality: null, filterTechnologist: null, monthFlag: null), CancellationToken.None));

            var thrownError = ex.Result.Errors.ToString();
            var expectedError = (new { error = "Invalid Date" }).ToString();

            Assert.Equal(expectedError, thrownError);

        }


    }
}