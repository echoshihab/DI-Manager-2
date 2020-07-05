using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Persistence;

namespace Application.Licenses
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }



        public class Handler : IRequestHandler<Command>
        {
            private readonly ApplicationDbContext _context;

            public Handler(ApplicationDbContext context)
            {
                _context = context;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var license = await _context.Licenses.FindAsync(request.Id);

                if (license == null)
                    throw new RestException(HttpStatusCode.NotFound, new { license = "License not found" });

                _context.Remove(license);
                //handler logic
                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}