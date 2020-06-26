using System;
using System.Collections.Generic;

namespace Domain
{
    public class Modality
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public ICollection<License> Licenses { get; set; }
        public ICollection<Technologist> Technologists { get; set; }

    }
}