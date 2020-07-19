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
            public Boolean? MonthFlag { get; set; }
            public Query(DateTime? filterDate, Guid? filterLocation, Guid? filterLicense, Guid? filterTechnologist, Boolean? monthFlag)
            {
                FilterTechnologist = filterTechnologist;
                FilterLicense = filterLicense;
                FilterLocation = filterLocation;
                FilterDate = filterDate;
                MonthFlag = monthFlag;

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
                var filterDateTime = Convert.ToDateTime(request.FilterDate);

                if (request.MonthFlag.HasValue)
                {
                    queryable = queryable.Where(x => x.Start.Year == filterDateTime.Year && x.Start.Month == filterDateTime.Month);
                }
                else
                {
                    queryable = queryable.Where(x =>
                (x.Start.Date == filterDateTime.Date));
                }


                if (request.FilterLocation.HasValue)
                    queryable = queryable.Where(x => x.LocationId == request.FilterLocation);
                if (request.FilterTechnologist.HasValue)
                    queryable = queryable.Where(x => x.TechnologistId == request.FilterTechnologist);
                if (request.FilterLicense.HasValue)
                    queryable = queryable.Where(x => x.LicenseId == request.FilterLicense);



                var shifts = await queryable.ToListAsync();


                var shiftsToReturn = _mapper.Map<List<Shift>, List<ShiftDto>>(shifts);
                return shiftsToReturn;

            }
        }
    }


}