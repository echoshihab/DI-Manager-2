using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Locations;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Rooms
{
    public class List
    {
        public class roomEnvelope
        {
            public List<LocationDto> LocationWithRooms { get; set; }
        }
        public class Query : IRequest<roomEnvelope>
        {


        }

        public class Handler : IRequestHandler<Query, roomEnvelope>
        {
            private readonly ApplicationDbContext _context;
            private readonly IMapper _mapper;
            public Handler(ApplicationDbContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;

            }

            public async Task<roomEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {

                var locationWithRooms = await _context.Locations.Include(l => l.Rooms).ToListAsync();

                return new roomEnvelope
                {
                    LocationWithRooms = _mapper.Map<List<Location>, List<LocationDto>>(locationWithRooms)
                };

            }




        }
    }
}


