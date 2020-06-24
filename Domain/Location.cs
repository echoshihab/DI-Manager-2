using System;
using System.Collections.Generic;

namespace Domain
{
    public class Location
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public ICollection<Room> Rooms { get; set; }
    }
}