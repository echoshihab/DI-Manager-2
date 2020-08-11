using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Application.User;
using Domain;
using Domain.Utility;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers
{
    public class UserController : BaseController
    {
        private readonly IConfiguration _config;
        public UserController(IConfiguration config)
        {
            _config = config;

        }

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
        [Authorize(Roles = StaticDetail.Role_Admin)]
        [HttpPut("update")]

        public async Task<ActionResult<Unit>> Update(Update.Command command)
        {
            return await Mediator.Send(command);
        }

        [AllowAnonymous]
        [HttpPost("refresh")]
        public async Task<ActionResult<User>> Refresh(RefreshToken.Query query)
        {
            var principal = GetPrincipalFromExpiredToken(query.Token);
            query.Username = principal.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            return await Mediator.Send(query);
        }

        private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"])),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha512, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid Token");

            return principal;
        }
    }
}