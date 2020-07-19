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
            public Guid? FilterTechnologist { get; set; }
            public Query(DateTime? filterDate, Guid? filterLocation, Guid? filterLicense, Guid? filterTechnologist)
            {
                FilterTechnologist = filterTechnologist;
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

                if (!request.FilterDate.HasValue)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { error = "Invalid Date" });
                }


                Boolean filterByLocation = request.FilterLocation.HasValue;
                Boolean filterByTechnologist = request.FilterTechnologist.HasValue;
                Boolean filterByLicense = request.FilterLicense.HasValue;


                queryable = queryable.Where(x =>
                (x.Start.Date == Convert.ToDateTime(request.FilterDate).Date)
                &&
                (
                (filterByTechnologist && x.TechnologistId == request.FilterTechnologist)
                ||
                (filterByLicense && x.LicenseId == request.FilterLicense)
                ||
                (filterByLocation && x.LocationId == request.FilterLocation)
                ));




                var shifts = await queryable.ToListAsync();


                var shiftsToReturn = _mapper.Map<List<Shift>, List<ShiftDto>>(shifts);
                return shiftsToReturn;

            }
        }
    }


}