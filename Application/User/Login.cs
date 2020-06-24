using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;


namespace Application.User
{
    public class Login
    {
        public class Query : IRequest<AppUser>
        {
            public String Email { get; set; }
            public string Password { get; set; }
        }

        public class Handler : IRequestHandler<Query, AppUser>
        {

            private readonly UserManager<AppUser> _userManager;
            private readonly SignInManager<AppUser> _signInManager;

            public Handler(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
            {
                _signInManager = signInManager;
                _userManager = userManager;

            }
            public async Task<AppUser> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByEmailAsync(request.Email);

                if (user == null) throw new Exception("Cannot find user");

                var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

                if (result.Succeeded)
                {
                    return user;
                }

                throw new Exception("Unauthorized");

            }
        }
    }
}