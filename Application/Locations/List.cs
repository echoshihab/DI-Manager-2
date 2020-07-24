using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Locations
{
    public class List
    {
        public class Query : IRequest<List<LocationDto>>
        {


        }

        public class Handler : IRequestHandler<Query, List<LocationDto>>
        {
            private readonly ApplicationDbContext _context;
            private readonly IMapper _mapper;
            public Handler(ApplicationDbContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;

            }

            public async Task<List<LocationDto>> Handle(Query request, CancellationToken cancellationToken)
            {

                var locationsFromDb = await _context.Locations.ToListAsync();

                var locationsToReturn = _mapper.Map<List<Location>, List<LocationDto>>(locationsFromDb);



                return locationsToReturn;
            }




        }
    }
}


