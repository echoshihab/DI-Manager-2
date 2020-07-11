using Application.Locations;
using AutoMapper;
using Domain;

namespace Application.Shifts
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Shift, ShiftDto>()
                .ForMember(d => d.LocationName, o => o.MapFrom(s => s.Location.Name))
                .ForMember(d => d.RoomName, o => o.MapFrom(s => s.Room.Name))
                .ForMember(d => d.LicenseDisplayName, o => o.MapFrom(s => s.License.DisplayName))
                .ForMember(d => d.TechnologistInitial, o => o.MapFrom(s => s.Technologist.Initial));

        }
    }
}