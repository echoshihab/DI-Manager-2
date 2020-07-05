using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Licenses
{
    public class Create
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public string DisplayName { get; set; }
            public Guid ModalityId { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Name).NotEmpty();
                RuleFor(x => x.DisplayName).NotEmpty();
                RuleFor(x => x.ModalityId).NotEmpty().WithMessage("Modality needs to be selected");
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
                    throw new RestException(HttpStatusCode.NotFound, new { modality = "Modality not found" });

                var license = new License
                {
                    Id = request.Id,
                    Name = request.Name,
                    DisplayName = request.DisplayName,
                    ModalityId = request.ModalityId
                };

                _context.Licenses.Add(license);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}