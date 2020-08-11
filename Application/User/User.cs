using System;

namespace Application.User
{
    public class User
    {
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string RefreshToken { get; set; }
        public string Token { get; set; }
        public Guid? ModalityId { get; set; }

    }
}