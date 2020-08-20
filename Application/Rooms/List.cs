using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Rooms
{
    public class List
    {

        public class Query : IRequest<List<RoomDto>>
        {
            public Guid? LocationId { get; set; }
            public Query(Guid? locationId)
            {
                LocationId = locationId;

            }


        }

        public class Handler : IRequestHandler<Query, List<RoomDto>>
        {
            private readonly ApplicationDbContext _context;
            private readonly IMapper _mapper;
            public Handler(ApplicationDbContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;

            }

            public async Task<List<RoomDto>> Handle(Query request, CancellationToken cancellationToken)
            {

                var queryable = _context.Rooms.AsQueryable();

                if (request.LocationId.HasValue)
                {
                    var location = await _context.Locations.FindAsync(request.LocationId);

                    if (location == null)
                        throw new RestException(HttpStatusCode.NotFound, new { location = "location not found" });

                    queryable = queryable.Where(x => x.LocationId == request.LocationId);
                }


                var rooms = await queryable.ToListAsync();


                var roomsToReturn = _mapper.Map<List<Room>, List<RoomDto>>(rooms);

                return roomsToReturn;
            }




        }
    }
}


