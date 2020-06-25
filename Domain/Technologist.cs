using System;
using System.Collections.Generic;

namespace Domain
{
    public class Technologist
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Initial { get; set; }
        public Guid ModalityId { get; set; }
        public Modality Modality { get; set; }
        public ICollection<TechnologistLicense> Licenses { get; set; }

    }
}