using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using Domain.Utility;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;

namespace Application.User
{
    public class Update
    {
        public class Command : IRequest
        {
            public string UserName { get; set; }
            public Guid? ModalityId { get; set; }
            public string Role { get; set; }

        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly RoleManager<IdentityRole> _roleManager;
            private readonly UserManager<AppUser> _userManager;
            private readonly ApplicationDbContext _context;
            public Handler(ApplicationDbContext context, RoleManager<IdentityRole> roleManager, UserManager<AppUser> userManager)
            {
                _context = context;
                _userManager = userManager;
                _roleManager = roleManager;

            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {


                var modality = await _context.Modalities.FindAsync(request.ModalityId);
                var user = await _userManager.FindByNameAsync(request.UserName);

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { user = "User not found" });

                if (modality == null)
                    throw new RestException(HttpStatusCode.NotFound, new { modality = "Modality not found" });

                user.Modality = modality;

                if (!await _roleManager.RoleExistsAsync(request.Role))
                    throw new RestException(HttpStatusCode.NotFound, new { role = "Role not found" });

                var currentRole = await _userManager.GetRolesAsync(user);
                await _userManager.RemoveFromRolesAsync(user, currentRole);
                await _userManager.AddToRoleAsync(user, request.Role);

                var result = await _userManager.UpdateAsync(user);

                if (result.Succeeded) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}