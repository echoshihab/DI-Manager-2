using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.Modalities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public string DisplayName { get; set; }

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
                var modality = await _context.Modalities.FindAsync(request.Id);

                if (modality == null)
                    throw new Exception("Could not find Modality");

                modality.Name = request.Name ?? modality.Name;
                modality.DisplayName = request.DisplayName ?? modality.DisplayName;

                //handler logic
                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}