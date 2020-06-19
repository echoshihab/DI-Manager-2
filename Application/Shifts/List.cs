using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
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
            public List<Shift> Shifts { get; set; }
        }
        public class Query : IRequest<List<Shift>>
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

        public class Handler : IRequestHandler<Query, List<Shift>>
        {
            private readonly ApplicationDbContext _context;
            public Handler(ApplicationDbContext context)
            {
                _context = context;

            }

            public async Task<List<Shift>> Handle(Query request, CancellationToken cancellationToken)
            {
                if (request.FilterDate != null)
                {
                    var queryable = _context.Shifts.Where(x => x.Start == request.FilterDate);
                    var shifts = await queryable.ToListAsync();
                    return shifts;

                }
                else
                {
                    var shifts = await _context.Shifts.ToListAsync();
                    return shifts;
                }




            }
        }
    }


}