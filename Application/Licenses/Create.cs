using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
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

        public class Handler : IRequestHandler<Command>
        {
            private readonly ApplicationDbContext _context;
            public Handler(ApplicationDbContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {

                var modality = _context.Locations.FindAsync(request.ModalityId);

                if (modality == null) throw new Exception("Modality doesn't exist");

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