using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Rooms;
using Domain;
using Domain.Utility;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    [Authorize(Roles = StaticDetail.Role_Admin)]
    public class RoomController : BaseController
    {

        [HttpGet("{id}")]
        public async Task<ActionResult<Room>> Details(Guid id)
        {
            return await Mediator.Send(new Details.Query { Id = id });
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Create(Create.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<RoomDto>>> List(Guid? locationId)
        {
            return await Mediator.Send(new List.Query(locationId));
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
