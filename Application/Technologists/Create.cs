using System;
using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using FluentValidation;
using System.Linq;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Technologists
{
    public class Create
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public string Initial { get; set; }
            public Guid ModalityId { get; set; }
            public ICollection<Guid> LicenseIdList { get; set; }

        }

        public class CommandValidator : AbstractValidator<Command>
        {

            public CommandValidator()
            {
                RuleFor(x => x.Name).NotEmpty().WithMessage(("Name must not be empty"));
                RuleFor(x => x.Initial).NotEmpty().WithMessage("Initial must not be empty");

            }
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

                var modality = await _context.Modalities.FindAsync(request.ModalityId);

                if (modality == null)
                    throw new RestException(HttpStatusCode.NotFound, new { modality = "modality not found" });

                bool techInitialsExist = await _context.Technologists
                .Where(t => t.ModalityId == request.ModalityId)
                .AnyAsync(t => t.Initial == request.Initial);

                if (techInitialsExist)
                    throw new RestException(HttpStatusCode.BadRequest, new { technologist = "initial must be unique" });

                var technologist = new Technologist
                {
                    Id = request.Id,
                    Name = request.Name,
                    Initial = request.Initial,
                    ModalityId = request.ModalityId
                };

                _context.Technologists.Add(technologist);

                //foreach will not be exceuted if LicenseIdList is empty
                foreach (var id in request.LicenseIdList)
                {
                    var license = await _context.Licenses.FindAsync(id);

                    if (license == null || license.ModalityId != technologist.ModalityId)
                        throw new RestException(HttpStatusCode.BadRequest, new { license = "Unable to save: Invalid License Added" });

                    var technologistLicenses = new TechnologistLicense
                    {
                        License = license,
                        Technologist = technologist
                    };

                    _context.TechnologistLicenses.Add(technologistLicenses);
                }

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}