using System;
using Application.Locations;

namespace Application.Rooms
{
    public class RoomDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public LocationDto Location { get; set; }
    }
}