using AutoMapper;
using Domain;

namespace Application.Technologists
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Technologist, TechnologistDto>();
            CreateMap<TechnologistLicense, TechnologistLicensesDto>()
                .ForMember(d => d.LicenseDisplayName, o => o.MapFrom(s => s.License.DisplayName));
        }
    }
}