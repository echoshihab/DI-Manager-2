using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.Shifts
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public DateTime? Start { get; set; }
            public DateTime? End { get; set; }
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
                var shift = await _context.Shifts.FindAsync(request.Id);

                if (shift == null)
                    throw new Exception("Could not find shift");

                // shift.Start = request.Start ?? shift.Start;
                // shift.End = request.End ?? shift.End;
                // shift.License = request.License ?? shift.License;
                // shift.Location = request.Location ?? shift.Location;
                // shift.Room = request.Room ?? shift.Room;
                // shift.Technologist = request.Technologist ?? shift.Technologist;

                //handler logic
                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}