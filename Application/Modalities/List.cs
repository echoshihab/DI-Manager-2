using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Modalities
{
    public class List
    {

        public class Query : IRequest<List<Modality>>
        {


        }

        public class Handler : IRequestHandler<Query, List<Modality>>
        {
            private readonly ApplicationDbContext _context;
            public Handler(ApplicationDbContext context)
            {
                _context = context;

            }

            public async Task<List<Modality>> Handle(Query request, CancellationToken cancellationToken)
            {

                var modalities = await _context.Modalities.ToListAsync();
                return modalities;
            }


        }
    }
}


