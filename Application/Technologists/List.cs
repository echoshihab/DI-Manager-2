using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Technologists
{
    public class List
    {

        public class Query : IRequest<List<TechnologistDto>>
        {


        }

        public class Handler : IRequestHandler<Query, List<TechnologistDto>>
        {
            private readonly ApplicationDbContext _context;
            private readonly IMapper _mapper;

            public Handler(ApplicationDbContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;

            }

            public async Task<List<TechnologistDto>> Handle(Query request, CancellationToken cancellationToken)
            {

                var technologists = await _context.Technologists
                .Include(x => x.Licenses)
                .ThenInclude(x => x.License).ToListAsync();

                var technologistsToReturn = _mapper.Map<List<Technologist>, List<TechnologistDto>>(technologists);


                return technologistsToReturn;
            }




        }
    }
}


