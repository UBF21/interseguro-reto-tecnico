using ApiAuth.Application;
using ApiAuth.Application.Features.Auth.Commands.Login;
using FluentAssertions;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace ApiAuth.Tests.Application;

public class ApplicationDependencyInjectionTests
{
    [Fact]
    public void AddApplication_RegistersMediatorAndValidators()
    {
        var services = new ServiceCollection();
        services.AddApplication();
        var provider = services.BuildServiceProvider();

        provider.GetService<IMediator>().Should().NotBeNull();
        provider.GetService<IValidator<LoginCommand>>().Should().NotBeNull();
    }
}
