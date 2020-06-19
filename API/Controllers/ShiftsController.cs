using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Shifts;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class ShiftsController : BaseController
    {

        [HttpGet]
        public async Task<ActionResult<List<Shift>>> List(DateTime? filterDate)
        {
            return await Mediator.Send(new List.Query(filterDate));
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