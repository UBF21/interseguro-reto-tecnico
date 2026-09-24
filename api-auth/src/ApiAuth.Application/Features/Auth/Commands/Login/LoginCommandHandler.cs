using ApiAuth.Application.Features.Auth.Interfaces;
using ApiAuth.Application.Features.Auth.Repositories;
using ApiAuth.Domain.Exceptions;
using MediatR;

namespace ApiAuth.Application.Features.Auth.Commands.Login;

public class LoginCommandHandler(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher,
    IJwtTokenGenerator jwtTokenGenerator) : IRequestHandler<LoginCommand, LoginResult>
{
    private const int AccessTokenExpirationSeconds = 60 * 60; // 60min -- ver README: sin refresh token, scope reducido para el reto.

    public async Task<LoginResult> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await userRepository.FindByEmailAsync(request.Email, cancellationToken);

        // Mismo mensaje para "no existe" y "password incorrecto" -- evita enumeración de usuarios.
        // passwordHasher.Verify SIEMPRE corre (contra IPasswordHasher.DummyHash si user es null)
        // para que el timing no filtre si el email existe.
        var passwordOk = passwordHasher.Verify(user?.PasswordHash ?? passwordHasher.DummyHash, request.Password);
        if (user is null || !passwordOk)
            throw new InvalidCredentialsException();

        if (!user.IsActive)
            throw new AccountDisabledException();

        var token = jwtTokenGenerator.GenerateToken(user.Id, user.Email, user.Roles);

        return new LoginResult(token, user.Email, user.FullName, user.Roles, AccessTokenExpirationSeconds);
    }
}
