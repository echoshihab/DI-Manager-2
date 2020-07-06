using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Application.Technologists
{
    public class TechnologistDto
    {

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Initial { get; set; }

        public ICollection<TechnologistLicensesDto> Licenses { get; set; }
    }
}