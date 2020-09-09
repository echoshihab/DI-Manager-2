using System;
using Xunit;
using Application.Technologists;
using System.Threading;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Domain;

namespace Application.Tests.Technologists
{
    public class EditTest : TestBase
    {
        [Fact]
        public void Should_Update_Technologist()
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

        [Fact]
        public void Should_Update_Technologist_With_New_License()
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

            var licenceId1 = Guid.NewGuid();
            var licenseId2 = Guid.NewGuid();

            context.Licenses.Add(new Domain.License { Id = licenceId1, Name = "License 1", DisplayName = "L1", ModalityId = modalityId });
            context.Licenses.Add(new Domain.License { Id = licenseId2, Name = "License 2", DisplayName = "L2", ModalityId = modalityId });


            context.SaveChanges();

            var sut = new Edit.Handler(context);
            var licenseIdList = new List<Guid> { licenceId1, licenseId2 };
            var result = sut.Handle(new Edit.Command
            {
                Id = technologistId,
                Name = "Updated Technologist",
                Initial = "UT",
                LicenseIdList = licenseIdList
            }, CancellationToken.None).Result;

            var editedTechnologist = context.Technologists.Include(x => x.Licenses).ThenInclude(x => x.License).FirstOrDefault(x => x.Id == technologistId);
            var editedTechnologistLicense = editedTechnologist.Licenses.FirstOrDefault(x => x.LicenseId == licenceId1);

            Assert.Equal("Updated Technologist", editedTechnologist.Name);
            Assert.Equal(2, editedTechnologist.Licenses.Count);
            Assert.NotNull(editedTechnologistLicense);
            Assert.Equal("License 1", editedTechnologistLicense.License.Name);

        }

        [Fact]
        public void Should_Update_Technologist_By_Removing_License()
        {
            var context = GetDbContext();

            var modalityId = Guid.NewGuid();
            context.Modalities.Add(new Domain.Modality { Id = modalityId, Name = "Test Modality", DisplayName = "TM" });
            context.SaveChanges();

            var licenceId1 = Guid.NewGuid();
            var licenseId2 = Guid.NewGuid();
            context.Licenses.Add(new Domain.License { Id = licenceId1, Name = "License 1", DisplayName = "L1", ModalityId = modalityId });
            context.Licenses.Add(new Domain.License { Id = licenseId2, Name = "License 2", DisplayName = "L2", ModalityId = modalityId });
            context.SaveChanges();


            var licenseIdList = new List<Guid> { licenceId1, licenseId2 };

            var technologistId = Guid.NewGuid();

            Technologist technologist = new Technologist
            {
                Id = technologistId,
                Name = "Test Technologist",
                ModalityId = modalityId,
                Initial = "TT",
            };

            context.Technologists.Add(technologist);


            foreach (var id in licenseIdList)
            {
                var license = context.Licenses.Find(id);

                var technologistLicenses = new TechnologistLicense
                {
                    License = license,
                    Technologist = technologist
                };

                context.TechnologistLicenses.Add(technologistLicenses);
            }

            context.SaveChanges();

            var sut = new Edit.Handler(context);
            var result = sut.Handle(new Edit.Command
            {
                Id = technologistId,
                Name = "Updated Technologist",
                Initial = "UT",
                LicenseIdList = new List<Guid> { licenseId2 }
            }, CancellationToken.None).Result;

            var editedTechnologist = context.Technologists.Include(x => x.Licenses).ThenInclude(x => x.License).FirstOrDefault(x => x.Id == technologistId);
            var editedTechnologistLicense = editedTechnologist.Licenses.SingleOrDefault();

            Assert.Equal("Updated Technologist", editedTechnologist.Name);
            Assert.Single(editedTechnologist.Licenses);
            Assert.Equal("License 2", editedTechnologistLicense.License.Name);

        }
    }
}



