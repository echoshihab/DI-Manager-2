using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Rooms
{
    public class Details
    {
        public class Query : IRequest<Room>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Room>
        {
            private readonly ApplicationDbContext _context;

            public Handler(ApplicationDbContext context)
            {
                _context = context;
            }
            public async Task<Room> Handle(Query request, CancellationToken cancellationToken)
            {
                var room = await _context.Rooms.FindAsync(request.Id);

                return room;

            }
        }

    }
}