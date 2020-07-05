using Application.Locations;
using AutoMapper;
using Domain;

namespace Application.Licenses
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<License, LicenseDto>();
        }
    }
}