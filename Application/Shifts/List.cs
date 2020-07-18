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
            public DateTime? FilterDate { get; set; }
            public Guid? FilterLocation { get; set; }
            public Guid? FilterLicense { get; set; }
            public Guid? FilterTecnologist { get; set; }
            public Query(DateTime? filterDate, Guid? filterLocation, Guid? filterLicense, Guid? filterTecnologist)
            {
                FilterTecnologist = filterTecnologist;
                FilterLicense = filterLicense;
                FilterLocation = filterLocation;
                FilterDate = filterDate;

            }



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
                var queryable = _context.Shifts.Include(s => s.License)
                                .Include(s => s.Modality)
                                .Include(s => s.Location)
                                .Include(s => s.Room)
                                .Include(s => s.Technologist).AsQueryable();

                if (request.FilterDate != null)
                {
                    queryable = queryable.Where(x => x.Start.Date == Convert.ToDateTime(request.FilterDate).Date);

                }
                if (request.FilterLocation != null)
                {
                    queryable = queryable.Where(x => x.LocationId == request.FilterLocation);

                }
                if (request.FilterTecnologist != null)
                {
                    queryable.Where(x => x.TechnologistId == request.FilterTecnologist);
                }
                if (request.FilterLicense != null)
                {
                    queryable.Where(x => x.LicenseId == request.FilterLicense);
                }


                var shifts = await queryable.ToListAsync();


                var shiftsToReturn = _mapper.Map<List<Shift>, List<ShiftDto>>(shifts);
                return shiftsToReturn;

            }
        }
    }


}