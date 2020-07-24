using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.User
{
    public class Roles
    {
        public class Query : IRequest<List<string>> { }
        public class Handler : IRequestHandler<Query, List<string>>
        {
            private readonly RoleManager<IdentityRole> _roleManager;
            public Handler(RoleManager<IdentityRole> roleManager)
            {

                _roleManager = roleManager;


            }

            public async Task<List<string>> Handle(Query request, CancellationToken cancellationToken)
            {
                var roles = await _roleManager.Roles.Select(
                    r =>
                     r.Name).ToListAsync();

                return roles;

            }


        }
    }
}