using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;


namespace Application.User
{
    public class Login
    {
        public class Query : IRequest<User>
        {
            public String Email { get; set; }
            public string Password { get; set; }
        }

        public class Handler : IRequestHandler<Query, User>
        {

            private readonly UserManager<AppUser> _userManager;
            private readonly SignInManager<AppUser> _signInManager;
            private readonly RoleManager<IdentityRole> _roleManager;

            public Handler(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, RoleManager<IdentityRole> roleManager)
            {
                _roleManager = roleManager;
                _signInManager = signInManager;
                _userManager = userManager;

            }
            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByEmailAsync(request.Email);
                var roleName = _userManager.GetRolesAsync(user).Result.FirstOrDefault();

                if (user == null) throw new Exception("Cannot find user");

                var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

                if (result.Succeeded)
                {
                    return new User
                    {
                        DisplayName = user.DisplayName,
                        ModalityId = user.ModalityId,
                        Role = roleName

                    };
                }

                throw new Exception("Unauthorized");

            }
        }
    }
}