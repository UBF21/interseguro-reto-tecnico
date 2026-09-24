using ApiAuth.Domain.Users;
using ApiAuth.Infrastructure.Persistence;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace ApiAuth.Tests.Infrastructure;

public class AuthDbContextTests
{
    private static AuthDbContext CreateContext() =>
        new(new DbContextOptionsBuilder<AuthDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options);

    [Fact]
    public async Task Users_PersistsAndReadsBack_RolesIncluded()
    {
        await using var context = CreateContext();
        var user = new User { Email = "ana@interseguro.pe", PasswordHash = "h", FullName = "Ana", Roles = ["operator", "admin"] };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        var found = await context.Users.SingleAsync(u => u.Email == "ana@interseguro.pe");
        found.Roles.Should().BeEquivalentTo("operator", "admin");
    }
}
