using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.User
{
    public class List
    {

        public class Query : IRequest<List<UserSlim>> { }

        public class Handler : IRequestHandler<Query, List<UserSlim>>
        {
            private readonly ApplicationDbContext _context;

            public Handler(ApplicationDbContext context)

            {

                _context = context;

            }

            public async Task<List<UserSlim>> Handle(Query request, CancellationToken cancellationToken)
            {


                var users = await (from user in _context.Users
                                   join roleIds in _context.UserRoles
                                   on user.Id equals roleIds.UserId
                                   join role in _context.Roles on roleIds.RoleId equals role.Id
                                   select new UserSlim
                                   {
                                       UserName = user.UserName,
                                       ModalityId = user.ModalityId,
                                       Role = role.Name
                                   }).ToListAsync();

                return users;


            }


        }
    }

}