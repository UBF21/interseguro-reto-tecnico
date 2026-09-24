using ApiAuth.Application.Features.Auth.Repositories;
using ApiAuth.Domain.Users;
using FluentAssertions;
using NSubstitute;

namespace ApiAuth.Tests.Application;

public class IUserRepositoryTests
{
    [Fact]
    public async Task FindByEmailAsync_CanBeSubstituted_AndReturnsConfiguredUser()
    {
        var repo = Substitute.For<IUserRepository>();
        var user = new User { Email = "ana@interseguro.pe", PasswordHash = "h", FullName = "Ana", Roles = ["operator"] };
        repo.FindByEmailAsync("ana@interseguro.pe", Arg.Any<CancellationToken>()).Returns(user);

        var result = await repo.FindByEmailAsync("ana@interseguro.pe", CancellationToken.None);

        result.Should().Be(user);
    }
}
