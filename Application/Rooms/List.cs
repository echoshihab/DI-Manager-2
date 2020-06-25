using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Rooms
{
    public class List
    {
        public class ListEnvelope
        {
            public List<Room> Rooms { get; set; }
        }
        public class Query : IRequest<List<Room>>
        {


        }

        public class Handler : IRequestHandler<Query, List<Room>>
        {
            private readonly ApplicationDbContext _context;
            public Handler(ApplicationDbContext context)
            {
                _context = context;

            }

            public async Task<List<Room>> Handle(Query request, CancellationToken cancellationToken)
            {

                var rooms = await _context.Rooms.ToListAsync();
                return rooms;
            }




        }
    }
}


