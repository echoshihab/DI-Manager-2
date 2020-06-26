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

namespace Application.Technologists
{
    public class List
    {

        public class Query : IRequest<List<Technologist>>
        {


        }

        public class Handler : IRequestHandler<Query, List<Technologist>>
        {
            private readonly ApplicationDbContext _context;

            public Handler(ApplicationDbContext context)
            {

                _context = context;

            }

            public async Task<List<Technologist>> Handle(Query request, CancellationToken cancellationToken)
            {

                var technologists = await _context.Technologists.ToListAsync();


                return technologists;
            }




        }
    }
}


