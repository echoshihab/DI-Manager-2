using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
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

                var modality = _context.Modalities.FindAsync(request.ModalityId);

                if (modality == null) throw new Exception("Modality doesn't exist");

                var technologist = new Technologist
                {
                    Id = request.Id,
                    Name = request.Name,
                    Initial = request.Initial,
                    ModalityId = request.ModalityId
                };

                _context.Technologists.Add(technologist);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}