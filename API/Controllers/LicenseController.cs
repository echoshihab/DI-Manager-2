using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Licenses;
using Domain.Utility;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class LicenseController : BaseController
    {

        [HttpPost]
        [Authorize(Roles = StaticDetail.Role_Admin)]
        public async Task<ActionResult<Unit>> Create(Create.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet]
        public async Task<ActionResult<List<LicenseDto>>> List(Guid? modalityId)
        {
            return await Mediator.Send(new List.Query(modalityId));
        }
        [Authorize(Roles = StaticDetail.Role_Admin)]
        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }
        [Authorize(Roles = StaticDetail.Role_Admin)]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await Mediator.Send(new Delete.Command { Id = id });
        }
    }
}