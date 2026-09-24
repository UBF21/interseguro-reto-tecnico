using MediatR;

namespace ApiAuth.Application.Features.Auth.Commands.Login;

public record LoginCommand(string Email, string Password) : IRequest<LoginResult>;

public record LoginResult(string AccessToken, string Email, string FullName, IReadOnlyList<string> Roles, int ExpiresInSeconds);
