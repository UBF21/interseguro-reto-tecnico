using ApiAuth.Infrastructure.Security;
using FluentAssertions;

namespace ApiAuth.Tests.Infrastructure;

public class JwtSettingsTests
{
    [Fact]
    public void ExpirationMinutes_DefaultsTo60_WhenNotSet()
    {
        var settings = new JwtSettings { Secret = "s", Issuer = "i", Audience = "a" };
        settings.ExpirationMinutes.Should().Be(60);
    }
}
