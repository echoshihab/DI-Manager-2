using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Technologists
{
    public class Details
    {
        public class Query : IRequest<Technologist>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Technologist>
        {
            private readonly ApplicationDbContext _context;

            public Handler(ApplicationDbContext context)
            {
                _context = context;
            }
            public async Task<Technologist> Handle(Query request, CancellationToken cancellationToken)
            {
                var technologist = await _context.Technologists.FindAsync(request.Id);

                return technologist;

            }
        }

    }
}