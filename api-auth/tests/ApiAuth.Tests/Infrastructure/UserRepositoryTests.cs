using ApiAuth.Domain.Users;
using ApiAuth.Infrastructure.Persistence;
using ApiAuth.Infrastructure.Persistence.Repositories;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace ApiAuth.Tests.Infrastructure;

public class UserRepositoryTests
{
    private static AuthDbContext CreateContext() =>
        new(new DbContextOptionsBuilder<AuthDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);

    [Fact]
    public async Task FindByEmailAsync_ExistingEmail_ReturnsUser()
    {
        await using var context = CreateContext();
        context.Users.Add(new User { Email = "ana@interseguro.pe", PasswordHash = "h", FullName = "Ana", Roles = [] });
        await context.SaveChangesAsync();
        var repository = new UserRepository(context);

        var found = await repository.FindByEmailAsync("ana@interseguro.pe", CancellationToken.None);

        found.Should().NotBeNull();
        found!.FullName.Should().Be("Ana");
    }

    [Fact]
    public async Task FindByEmailAsync_UnknownEmail_ReturnsNull()
    {
        await using var context = CreateContext();
        var repository = new UserRepository(context);

        var found = await repository.FindByEmailAsync("no-existe@interseguro.pe", CancellationToken.None);

        found.Should().BeNull();
    }
}
