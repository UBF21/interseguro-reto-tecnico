using ApiAuth.Domain.Exceptions;
using FluentAssertions;

namespace ApiAuth.Tests.Domain;

file sealed class TestReglaDeNegocioException() : DomainException("regla de negocio de prueba", "TEST_CODE");

public class DomainExceptionTests
{
    [Fact]
    public void InvalidCredentialsException_HasStableCode()
    {
        var ex = new InvalidCredentialsException();

        ex.Code.Should().Be("INVALID_CREDENTIALS");
        ex.Message.Should().NotBeNullOrWhiteSpace();
    }

    [Fact]
    public void InvalidCredentialsException_MapsTo401()
    {
        new InvalidCredentialsException().StatusCode.Should().Be(401);
    }

    [Fact]
    public void AccountDisabledException_HasStableCode()
    {
        var ex = new AccountDisabledException();

        ex.Code.Should().Be("ACCOUNT_DISABLED");
    }

    [Fact]
    public void AccountDisabledException_MapsTo401()
    {
        new AccountDisabledException().StatusCode.Should().Be(401);
    }

    [Fact]
    public void UnknownDomainException_DefaultsTo422_WithoutTouchingTheMapper()
    {
        // Prueba el punto del fix OCP: un tipo nuevo de DomainException que no overridea
        // StatusCode cae en 422 automáticamente, sin que ExceptionResponseMapper lo liste.
        new TestReglaDeNegocioException().StatusCode.Should().Be(422);
    }
}
