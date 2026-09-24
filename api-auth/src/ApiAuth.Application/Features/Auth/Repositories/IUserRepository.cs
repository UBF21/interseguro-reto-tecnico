using ApiAuth.Domain.Users;

namespace ApiAuth.Application.Features.Auth.Repositories;

public interface IUserRepository
{
    Task<User?> FindByEmailAsync(string email, CancellationToken ct);
}
