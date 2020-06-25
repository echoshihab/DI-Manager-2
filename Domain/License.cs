using System;
using System.Collections.Generic;

namespace Domain
{
    public class License
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }

        public Guid ModalityId { get; set; }
        public Modality Modality { get; set; }

        public ICollection<TechnologistLicense> Technologists { get; set; }

    }
}