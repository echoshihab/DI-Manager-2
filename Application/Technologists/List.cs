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

namespace Application.Technologists
{
    public class List
    {

        public class Query : IRequest<List<TechnologistDto>>
        {

            public Guid? ModalityId { get; set; }
            public Query(Guid? modalityId)
            {
                ModalityId = modalityId;

            }

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

                var queryable = _context.Technologists
               .Include(x => x.Licenses)
               .ThenInclude(x => x.License).AsQueryable();

                if (request.ModalityId.HasValue)
                {
                    var modality = await _context.Modalities.FindAsync(request.ModalityId);

                    if (modality == null)
                        throw new RestException(HttpStatusCode.NotFound, new { modality = "modality not found" });

                    queryable = queryable.Where(x => x.ModalityId == request.ModalityId);
                }


                var technologists = await queryable.ToListAsync();


                var technologistsToReturn = _mapper.Map<List<Technologist>, List<TechnologistDto>>(technologists);


                return technologistsToReturn;
            }




        }
    }
}


