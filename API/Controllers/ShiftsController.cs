using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Shifts;
using Domain;
using Domain.Utility;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = StaticDetail.Role_Coordinator)]
    public class ShiftsController : BaseController
    {

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<ShiftDto>>> List(DateTime? filterDate, Guid? filterModality,
        Guid? filterLocation, Guid? filterLicense, Guid? filterTechnologist, Boolean? monthFlag)
        {
            return await Mediator.Send(new List.Query(filterDate, filterModality, filterLocation, filterLicense, filterTechnologist, monthFlag));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Shift>> Details(Guid id)
        {
            return await Mediator.Send(new Details.Query { Id = id });
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Create(Create.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("range")]
        public async Task<ActionResult<Unit>> CreateRange(CreateRange.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await Mediator.Send(new Delete.Command { Id = id });
        }



    }
}