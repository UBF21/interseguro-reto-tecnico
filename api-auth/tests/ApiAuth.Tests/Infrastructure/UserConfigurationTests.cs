using ApiAuth.Domain.Users;
using ApiAuth.Infrastructure.Persistence;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace ApiAuth.Tests.Infrastructure;

public class UserConfigurationTests
{
    [Fact]
    public void Email_IsConfiguredAsUniqueIndex()
    {
        using var context = new AuthDbContext(new DbContextOptionsBuilder<AuthDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options);

        var entityType = context.Model.FindEntityType(typeof(User))!;
        var index = entityType.GetIndexes().Single();

        index.IsUnique.Should().BeTrue();
        index.Properties.Single().Name.Should().Be(nameof(User.Email));
    }
}
