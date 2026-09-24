using ApiAuth.Application.Features.Auth.Interfaces;
using FluentAssertions;
using NSubstitute;

namespace ApiAuth.Tests.Application;

public class AuthPortsTests
{
    [Fact]
    public void IPasswordHasher_CanBeSubstituted_AndConfiguredForRoundTrip()
    {
        var hasher = Substitute.For<IPasswordHasher>();
        hasher.Hash("secreto").Returns("hash-fake");
        hasher.Verify("hash-fake", "secreto").Returns(true);

        hasher.Hash("secreto").Should().Be("hash-fake");
        hasher.Verify("hash-fake", "secreto").Should().BeTrue();
    }

    [Fact]
    public void IJwtTokenGenerator_CanBeSubstituted_AndReturnsConfiguredToken()
    {
        var generator = Substitute.For<IJwtTokenGenerator>();
        generator.GenerateToken(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<IReadOnlyList<string>>())
            .Returns("token-fake");

        var token = generator.GenerateToken(Guid.NewGuid(), "ana@interseguro.pe", ["operator"]);

        token.Should().Be("token-fake");
    }
}
