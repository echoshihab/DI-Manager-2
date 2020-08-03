using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;


namespace Application.Shifts
{
    public class CreateRange
    {
        public class Command : IRequest
        {
            public DateTime Start { get; set; }
            public DateTime End { get; set; }
            public DateTime EndDate { get; set; }
            public Guid LicenseId { get; set; }
            public Guid LocationId { get; set; }
            public Guid RoomId { get; set; }
            public Guid TechnologistId { get; set; }
            public Guid ModalityId { get; set; }
        }


        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Start).NotEmpty().WithMessage(("Start time must not be empty"));
                RuleFor(x => x.End).NotEmpty().WithMessage(("End time must not be empty"));
                RuleFor(x => x.EndDate).NotEmpty().WithMessage(("End Date must not be empty"));
                RuleFor(x => x.LocationId).NotEmpty().WithMessage("Location must be selected");
                RuleFor(x => x.RoomId).NotEmpty().WithMessage("Room must be selected");
                RuleFor(x => x.TechnologistId).NotEmpty().WithMessage("Technologist must be selected");
                RuleFor(x => x.ModalityId).NotEmpty().WithMessage("Invalid Modality");
            }
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

                dynamic errors = new ExpandoObject();
                var location = await _context.Locations.FindAsync(request.LocationId);

                if (location == null)
                    errors.location = "Invalid Location";

                var license = await _context.Licenses.FindAsync(request.LicenseId);
                if (license == null)
                    errors.license = "Invalid License";

                var room = await _context.Rooms.FindAsync(request.RoomId);
                if (room == null || room.LocationId != location.Id)
                    errors.room = "Invalid Room";


                var modality = await _context.Modalities.FindAsync(request.ModalityId);
                if (modality == null)
                    errors.modality = "Invalid Modality";

                var technologist = await _context.Technologists.FindAsync(request.TechnologistId);
                if (technologist == null || technologist.ModalityId != modality.Id)
                    errors.technologist = "Invalid Technologist";



                int errorCount = ((ICollection<KeyValuePair<string, Object>>)errors).Count;

                if (errorCount > 0)
                {
                    throw new RestException(HttpStatusCode.NotFound, errors);
                }

                while (request.Start.Day <= request.EndDate.Day)
                {
                    var shift = new Shift
                    {
                        Start = request.Start,
                        End = request.End,
                        License = license,
                        Location = location,
                        Room = room,
                        Technologist = technologist,
                        Modality = modality

                    };


                    _context.Shifts.Add(shift);
                    request.Start = request.Start.AddDays(1);
                    request.End = request.End.AddDays(1);

                }


                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}