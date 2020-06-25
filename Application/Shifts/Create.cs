using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Shifts
{
    public class Create
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public DateTime Start { get; set; }
            public DateTime End { get; set; }
            public string License { get; set; }
            public string Location { get; set; }
            public string Room { get; set; }
            public string Technologist { get; set; }
            public string Modality { get; set; }
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
                var shift = new Shift
                {
                    // Id = request.Id,
                    // Start = request.Start,
                    // End = request.End,
                    // License = request.License,
                    // Location = request.Location,
                    // Room = request.Room,
                    // Technologist = request.Technologist,
                    // Modality = request.Modality

                };
                _context.Shifts.Add(shift);
                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}