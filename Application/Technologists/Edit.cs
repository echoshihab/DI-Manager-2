using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Technologists
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public string Initial { get; set; }
            public ICollection<Guid> LicenseIdList { get; set; }

        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly ApplicationDbContext _context;
            public Handler(ApplicationDbContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var technologist = await _context.Technologists
                    .Include(t => t.Licenses)
                    .FirstOrDefaultAsync(t => t.Id == request.Id);



                if (technologist == null)
                    throw new Exception("Could not find technologist");

                technologist.Name = request.Name ?? technologist.Name;
                technologist.Initial = request.Initial ?? technologist.Initial;
                technologist.Licenses.Clear();

                //foreach will not be exceuted if LicenseIdList is empty
                foreach (var id in request.LicenseIdList)
                {
                    var license = await _context.Licenses.FindAsync(id);
                    if (license == null)
                        throw new RestException(HttpStatusCode.NotFound, new { license = "Unable to save: Invalid License Added" });

                    var technologistLicenses = new TechnologistLicense
                    {
                        License = license,
                        Technologist = technologist
                    };

                    technologist.Licenses.Add(technologistLicenses);
                }



                //handler logic
                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}