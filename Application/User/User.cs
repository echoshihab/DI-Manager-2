using System;

namespace Application.User
{
    public class User
    {
        public string DisplayName { get; set; }
        public string Token { get; set; }
        public Guid? ModalityId { get; set; }
        public string Role { get; set; }

    }
}