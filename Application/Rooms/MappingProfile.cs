using Application.Locations;
using AutoMapper;
using Domain;

namespace Application.Rooms
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Location, LocationDto>();
            CreateMap<Room, RoomDto>();

        }
    }
}