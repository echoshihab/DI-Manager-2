using Application.Rooms;
using AutoMapper;
using Domain;

namespace Application.Locations
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