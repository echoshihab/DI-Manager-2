using System;

namespace Application.Shifts
{
    public class ShiftDto
    {
        public Guid Id { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public Guid LicenseId { get; set; }
        public string LicenseDisplayName { get; set; }
        public Guid LocationId { get; set; }
        public string LocationName { get; set; }
        public Guid RoomId { get; set; }
        public string RoomName { get; set; }
        public Guid TechnologistId { get; set; }
        public string TechnologistInitial { get; set; }
        public Guid ModalityId { get; set; }
    }
}