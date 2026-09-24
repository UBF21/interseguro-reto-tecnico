using ApiAuth.Infrastructure.Security;
using FluentAssertions;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace ApiAuth.Tests.Infrastructure;

public class JwtTokenGeneratorTests
{
    private static readonly JwtSettings Settings = new()
    {
        Secret = "super-secret-key-at-least-32-bytes-long!!",
        Issuer = "api-auth",
        Audience = "interseguro-reto",
        ExpirationMinutes = 60,
    };

    [Fact]
    public void GenerateToken_ProducesValidJwt_WithExpectedClaims()
    {
        var generator = new JwtTokenGenerator(Options.Create(Settings));
        var userId = Guid.NewGuid();

        var token = generator.GenerateToken(userId, "ana@interseguro.pe", ["operator", "admin"]);

        // MapInboundClaims = false -- si no, el handler remapea "sub"/"email" a los URIs largos
        // de ClaimTypes (comportamiento legado de WIF), y el lookup por JwtRegisteredClaimNames
        // de abajo no encuentra nada.
        var handler = new JwtSecurityTokenHandler { MapInboundClaims = false };
        var principal = handler.ValidateToken(token, new TokenValidationParameters
        {
            ValidIssuer = Settings.Issuer,
            ValidAudience = Settings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Settings.Secret)),
            ClockSkew = TimeSpan.Zero,
        }, out _);

        principal.FindFirst(JwtRegisteredClaimNames.Sub)!.Value.Should().Be(userId.ToString());
        principal.FindFirst(JwtRegisteredClaimNames.Email)!.Value.Should().Be("ana@interseguro.pe");
        principal.FindAll(System.Security.Claims.ClaimTypes.Role).Select(c => c.Value)
            .Should().BeEquivalentTo("operator", "admin");
    }
}
