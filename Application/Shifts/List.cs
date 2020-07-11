using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Shifts
{
    public class List
    {
        public class ShiftsEnvelope
        {
            public List<ShiftDto> Shifts { get; set; }
        }
        public class Query : IRequest<List<ShiftDto>>
        {
            //add additional filters here
            public Query(DateTime? filterDate)
            {
                //for paging

                //for filtering
                FilterDate = filterDate;
            }

            public DateTime? FilterDate { get; set; }

        }

        public class Handler : IRequestHandler<Query, List<ShiftDto>>
        {
            private readonly ApplicationDbContext _context;
            private readonly IMapper _mapper;
            public Handler(ApplicationDbContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;

            }

            public async Task<List<ShiftDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var shifts = await _context.Shifts
                                .Include(s => s.License)
                                .Include(s => s.Modality)
                                .Include(s => s.Location)
                                .Include(s => s.Room)
                                .Include(s => s.Technologist)
                                .ToListAsync();

                // if (request.FilterDate != null)
                // {
                //     queryable = queryable.Where(x => x.Start == request.FilterDate);
                //     var shifts = await queryable.ToListAsync();
                //     return shifts;

                // }

                var shiftsToReturn = _mapper.Map<List<Shift>, List<ShiftDto>>(shifts);
                return shiftsToReturn;

            }
        }
    }


}