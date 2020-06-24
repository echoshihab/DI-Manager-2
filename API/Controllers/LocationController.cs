using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Locations;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LocationController : BaseController
    {
        [HttpGet("{id}")]
        public async Task<ActionResult<Location>> Details(Guid id)
        {
            return await Mediator.Send(new Details.Query { Id = id });
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Create(Create.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet]
        public async Task<ActionResult<List<Location>>> List()
        {
            return await Mediator.Send(new List.Query());
        }
    }
}