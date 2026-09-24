using ApiAuth.Application.Features.Auth.Commands.Login;
using ApiAuth.Application.Features.Auth.Interfaces;
using ApiAuth.Application.Features.Auth.Repositories;
using ApiAuth.Domain.Exceptions;
using ApiAuth.Domain.Users;
using FluentAssertions;
using NSubstitute;

namespace ApiAuth.Tests.Application;

public class LoginCommandHandlerTests
{
    private static readonly User ActiveUser = new()
    {
        Email = "ana@interseguro.pe",
        PasswordHash = "hashed-password",
        FullName = "Ana Torres",
        Roles = ["operator"],
    };

    [Fact]
    public async Task Handle_ValidCredentials_ReturnsTokenAndUserInfo()
    {
        var userRepository = Substitute.For<IUserRepository>();
        var passwordHasher = Substitute.For<IPasswordHasher>();
        var jwtGenerator = Substitute.For<IJwtTokenGenerator>();

        userRepository.FindByEmailAsync(ActiveUser.Email, Arg.Any<CancellationToken>()).Returns(ActiveUser);
        passwordHasher.Verify(ActiveUser.PasswordHash, "correct-password").Returns(true);
        jwtGenerator.GenerateToken(ActiveUser.Id, ActiveUser.Email, ActiveUser.Roles).Returns("jwt-token");

        var handler = new LoginCommandHandler(userRepository, passwordHasher, jwtGenerator);

        var result = await handler.Handle(new LoginCommand(ActiveUser.Email, "correct-password"), CancellationToken.None);

        result.AccessToken.Should().Be("jwt-token");
        result.Email.Should().Be(ActiveUser.Email);
        result.Roles.Should().BeEquivalentTo(ActiveUser.Roles);
    }

    [Fact]
    public async Task Handle_UserNotFound_ThrowsInvalidCredentials()
    {
        var userRepository = Substitute.For<IUserRepository>();
        userRepository.FindByEmailAsync(Arg.Any<string>(), Arg.Any<CancellationToken>()).Returns((User?)null);
        var handler = new LoginCommandHandler(userRepository, Substitute.For<IPasswordHasher>(), Substitute.For<IJwtTokenGenerator>());

        var act = () => handler.Handle(new LoginCommand("no-existe@interseguro.pe", "whatever1"), CancellationToken.None);

        await act.Should().ThrowAsync<InvalidCredentialsException>();
    }

    [Fact]
    public async Task Handle_WrongPassword_ThrowsInvalidCredentials_SameAsUserNotFound()
    {
        // Mismo tipo de excepción que "usuario no existe" -- evita enumeración de usuarios (checklist auth-implementation).
        var userRepository = Substitute.For<IUserRepository>();
        var passwordHasher = Substitute.For<IPasswordHasher>();
        userRepository.FindByEmailAsync(ActiveUser.Email, Arg.Any<CancellationToken>()).Returns(ActiveUser);
        passwordHasher.Verify(ActiveUser.PasswordHash, "wrong-password").Returns(false);
        var handler = new LoginCommandHandler(userRepository, passwordHasher, Substitute.For<IJwtTokenGenerator>());

        var act = () => handler.Handle(new LoginCommand(ActiveUser.Email, "wrong-password"), CancellationToken.None);

        await act.Should().ThrowAsync<InvalidCredentialsException>();
    }

    [Fact]
    public async Task Handle_UserNotFound_StillCallsPasswordHasher()
    {
        // Protege contra timing attack: si el email no existe, igual debe correr el hash
        // (contra un dummy) para que el costo de CPU sea el mismo que con un email real.
        var userRepository = Substitute.For<IUserRepository>();
        var passwordHasher = Substitute.For<IPasswordHasher>();
        userRepository.FindByEmailAsync(Arg.Any<string>(), Arg.Any<CancellationToken>()).Returns((User?)null);
        var handler = new LoginCommandHandler(userRepository, passwordHasher, Substitute.For<IJwtTokenGenerator>());

        var act = () => handler.Handle(new LoginCommand("no-existe@interseguro.pe", "whatever1"), CancellationToken.None);

        await act.Should().ThrowAsync<InvalidCredentialsException>();
        passwordHasher.Received(1).Verify(Arg.Any<string>(), "whatever1");
    }

    [Fact]
    public async Task Handle_InactiveUser_ThrowsAccountDisabled()
    {
        var inactiveUser = ActiveUser with { IsActive = false };
        var userRepository = Substitute.For<IUserRepository>();
        var passwordHasher = Substitute.For<IPasswordHasher>();
        userRepository.FindByEmailAsync(inactiveUser.Email, Arg.Any<CancellationToken>()).Returns(inactiveUser);
        passwordHasher.Verify(inactiveUser.PasswordHash, "correct-password").Returns(true);
        var handler = new LoginCommandHandler(userRepository, passwordHasher, Substitute.For<IJwtTokenGenerator>());

        var act = () => handler.Handle(new LoginCommand(inactiveUser.Email, "correct-password"), CancellationToken.None);

        await act.Should().ThrowAsync<AccountDisabledException>();
    }
}
