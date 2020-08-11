using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }

        public Guid? ModalityId { get; set; }
        public Modality Modality { get; set; }

        [NotMapped]
        public string Role { get; set; }

        public string RefreshToken;
        public DateTime RefreshTokenExpiry { get; set; }
    }
}