using System.Collections.Generic;
using System.Threading.Tasks;
using Application.User;
using Domain;
using Domain.Utility;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class UserController : BaseController
    {
        [HttpPost("login")]
        public async Task<ActionResult<User>> Login(Login.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(Register.Command command)
        {
            return await Mediator.Send(command);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<User>> CurrentUser()
        {
            return await Mediator.Send(new CurrentUser.Query());
        }

        [HttpGet("list")]
        [AllowAnonymous]
        public async Task<ActionResult<List<UserSlim>>> List()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("roles")]
        [AllowAnonymous]
        public async Task<ActionResult<List<string>>> Roles()
        {
            return await Mediator.Send(new Roles.Query());
        }

        [HttpPut("update")]
        [Authorize(Roles = StaticDetail.Role_Admin)]
        public async Task<ActionResult<Unit>> Update(Update.Command command)
        {
            return await Mediator.Send(command);
        }
    }
}