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

namespace Application.Licenses
{
    public class List
    {

        public class Query : IRequest<List<LicenseDto>>
        {
            public Guid? ModalityId { get; set; }
            public Query(Guid? modalityId)
            {
                ModalityId = modalityId;

            }


        }

        public class Handler : IRequestHandler<Query, List<LicenseDto>>
        {
            private readonly ApplicationDbContext _context;
            private readonly IMapper _mapper;

            public Handler(ApplicationDbContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;

            }

            public async Task<List<LicenseDto>> Handle(Query request, CancellationToken cancellationToken)
            {


                var queryable = _context.Licenses.AsQueryable();

                if (request.ModalityId.HasValue)
                {
                    var modality = await _context.Modalities.FindAsync(request.ModalityId);

                    if (modality == null)
                        throw new RestException(HttpStatusCode.NotFound, new { modality = "modality not found" });

                    queryable = queryable.Where(x => x.ModalityId == request.ModalityId);
                }


                var licenses = await queryable.ToListAsync();


                var licensesToReturn = _mapper.Map<List<License>, List<LicenseDto>>(licenses);

                return licensesToReturn;
            }




        }
    }
}


