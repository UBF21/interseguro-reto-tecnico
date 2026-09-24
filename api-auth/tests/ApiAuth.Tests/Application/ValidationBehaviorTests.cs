using ApiAuth.Application.Common;
using ApiAuth.Application.Features.Auth.Commands.Login;
using FluentAssertions;
using FluentValidation;

namespace ApiAuth.Tests.Application;

public class ValidationBehaviorTests
{
    [Fact]
    public async Task Handle_InvalidRequest_ThrowsValidationException()
    {
        var validators = new List<IValidator<LoginCommand>> { new LoginCommandValidator() };
        var behavior = new ValidationBehavior<LoginCommand, LoginResult>(validators);
        var invalid = new LoginCommand("no-es-email", "123");

        var act = () => behavior.Handle(invalid, () => throw new InvalidOperationException("no debería llegar al handler"), CancellationToken.None);

        await act.Should().ThrowAsync<ValidationException>().Where(ex => ex.Errors.Count() >= 2);
    }

    [Fact]
    public async Task Handle_ValidRequest_CallsNext()
    {
        var validators = new List<IValidator<LoginCommand>> { new LoginCommandValidator() };
        var behavior = new ValidationBehavior<LoginCommand, LoginResult>(validators);
        var valid = new LoginCommand("ana@interseguro.pe", "password123");
        var expected = new LoginResult("token", "ana@interseguro.pe", "Ana", ["operator"], 3600);

        var result = await behavior.Handle(valid, () => Task.FromResult(expected), CancellationToken.None);

        result.Should().Be(expected);
    }

    [Fact]
    public async Task Handle_NoValidatorsRegistered_CallsNext()
    {
        var behavior = new ValidationBehavior<LoginCommand, LoginResult>([]);
        var expected = new LoginResult("token", "ana@interseguro.pe", "Ana", ["operator"], 3600);

        var result = await behavior.Handle(new LoginCommand("x", "x"), () => Task.FromResult(expected), CancellationToken.None);

        result.Should().Be(expected);
    }
}
