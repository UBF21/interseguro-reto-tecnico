using ApiAuth.Application.Features.Auth.Repositories;
using ApiAuth.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace ApiAuth.Infrastructure.Persistence.Repositories;

public class UserRepository(AuthDbContext dbContext) : IUserRepository
{
    public Task<User?> FindByEmailAsync(string email, CancellationToken ct) =>
        dbContext.Users.SingleOrDefaultAsync(u => u.Email == email, ct);
}
