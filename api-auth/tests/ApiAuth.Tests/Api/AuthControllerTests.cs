using ApiAuth.Api.Controllers;
using ApiAuth.Api.Dtos.Auth;
using ApiAuth.Application.Features.Auth.Commands.Login;
using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;

namespace ApiAuth.Tests.Api;

public class AuthControllerTests
{
    [Fact]
    public async Task Login_DelegatesToMediator_AndReturnsHandlerResultUnmapped()
    {
        var sender = Substitute.For<ISender>();
        sender.Send(Arg.Any<LoginCommand>(), Arg.Any<CancellationToken>())
            .Returns(new LoginResult("jwt-token", "ana@interseguro.pe", "Ana", ["operator"], 3600));
        var controller = new AuthController(sender);

        var response = await controller.Login(new LoginRequestDto("ana@interseguro.pe", "correct-password"), CancellationToken.None);

        // el controller no reconstruye un DTO propio -- devuelve tal cual lo que arma el Handler
        var ok = response.Should().BeOfType<OkObjectResult>().Subject;
        var result = ok.Value.Should().BeOfType<LoginResult>().Subject;
        result.AccessToken.Should().Be("jwt-token");
        result.Roles.Should().BeEquivalentTo("operator");
    }
}
