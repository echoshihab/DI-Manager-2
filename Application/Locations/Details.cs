using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using MediatR;
using Persistence;

namespace Application.Locations
{
    public class Details
    {
        public class Query : IRequest<Location>
        {
            public Guid Id { get; set; }
        }



        public class Handler : IRequestHandler<Query, Location>
        {
            private readonly ApplicationDbContext _context;

            public Handler(ApplicationDbContext context)
            {
                _context = context;
            }
            public async Task<Location> Handle(Query request, CancellationToken cancellationToken)
            {
                var location = await _context.Locations.FindAsync(request.Id);

                if (location == null)
                    throw new RestException(HttpStatusCode.NotFound, new { location = "Not Found" });


                return location;

            }
        }

    }
}