using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Shifts
{
    public class List
    {
        public class Query : IRequest<List<Shift>> { }

        public class Handler : IRequestHandler<Query, List<Shift>>
        {
            private readonly ApplicationDbContext _context;
            public Handler(ApplicationDbContext context)
            {
                _context = context;

            }

            public async Task<List<Shift>> Handle(Query request, CancellationToken cancellationToken)
            {
                var shifts = await _context.Shifts.ToListAsync();
                return shifts;
            }
        }
    }


}