using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
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
            private readonly IJwtGenerator _jwtGenerator;

            public Handler(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, RoleManager<IdentityRole> roleManager, IJwtGenerator jwtGenerator)
            {
                _jwtGenerator = jwtGenerator;
                _roleManager = roleManager;
                _signInManager = signInManager;
                _userManager = userManager;

            }
            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByEmailAsync(request.Email);
                if (user == null) throw new RestException(HttpStatusCode.NotFound, new { user = "Cannot find user" });

                var roleName = _userManager.GetRolesAsync(user).Result.FirstOrDefault();



                var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

                if (result.Succeeded)
                {
                    return new User
                    {
                        UserName = user.UserName,
                        Token = _jwtGenerator.CreateToken(user),
                        DisplayName = user.DisplayName,
                        ModalityId = user.ModalityId,


                    };
                }

                throw new Exception("Unauthorized");

            }
        }
    }
}