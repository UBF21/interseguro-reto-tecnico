using ApiAuth.Api.Dtos.Auth;
using ApiAuth.Application.Features.Auth.Commands.Login;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace ApiAuth.Api.Controllers;

public class AuthController(ISender sender) : ApiControllerBase(sender)
{
    /// <summary>Login -- emite un JWT (HS256) que api-endosos y api-rutas validan con el mismo secreto compartido.</summary>
    [HttpPost("login")]
    [EnableRateLimiting("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request, CancellationToken ct)
    {
        // el Handler ya devuelve el shape final (LoginResult) -- el controller no reconstruye
        // un segundo DTO a mano, ApiResponseEnvelopeFilter lo envuelve en ApiResponse<T> solo.
        var result = await Sender.Send(new LoginCommand(request.Email, request.Password), ct);
        return Ok(result);
    }
}
