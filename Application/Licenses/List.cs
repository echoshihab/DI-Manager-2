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

namespace Application.Licenses
{
    public class List
    {

        public class Query : IRequest<List<License>>
        {


        }

        public class Handler : IRequestHandler<Query, List<License>>
        {
            private readonly ApplicationDbContext _context;

            public Handler(ApplicationDbContext context)
            {

                _context = context;

            }

            public async Task<List<License>> Handle(Query request, CancellationToken cancellationToken)
            {

                var licenses = await _context.Licenses.ToListAsync();


                return licenses;
            }




        }
    }
}


