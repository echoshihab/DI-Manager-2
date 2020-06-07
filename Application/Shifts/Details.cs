using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Shifts
{
    public class Details
    {
        public class Query : IRequest<Shift>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Shift>
        {
            private readonly ApplicationDbContext _context;

            public Handler(ApplicationDbContext context)
            {
                _context = context;
            }
            public async Task<Shift> Handle(Query request, CancellationToken cancellationToken)
            {
                var shift = await _context.Shifts.FindAsync(request.Id);

                return shift;

            }
        }

    }
}