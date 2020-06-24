using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Locations
{
    public class List
    {
        public class ListEnvelope
        {
            public List<Location> Locations { get; set; }
        }
        public class Query : IRequest<List<Location>>
        {


        }

        public class Handler : IRequestHandler<Query, List<Location>>
        {
            private readonly ApplicationDbContext _context;
            public Handler(ApplicationDbContext context)
            {
                _context = context;

            }

            public async Task<List<Location>> Handle(Query request, CancellationToken cancellationToken)
            {

                var locations = await _context.Locations.ToListAsync();
                return locations;
            }




        }
    }
}


