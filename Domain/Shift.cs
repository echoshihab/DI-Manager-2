using System;

namespace Domain
{
    public class Shift
    {
        public Guid Id { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public Guid LicenseId { get; set; }
        public License License { get; set; }
        public Guid LocationId { get; set; }
        public Location Location { get; set; }
        public Guid RoomId { get; set; }
        public Room Room { get; set; }
        public Guid TechnologistId { get; set; }
        public Technologist Technologist { get; set; }
        public Guid ModalityId { get; set; }
        public Modality Modality { get; set; }

    }
}