using System;

namespace Domain
{
    public class TechnologistLicense
    {
        public Guid TechnologistId { get; set; }
        public Technologist Technologist { get; set; }
        public Guid LicenseId { get; set; }
        public License License { get; set; }
    }
}