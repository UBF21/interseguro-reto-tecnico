using ApiAuth.Api.Common;
using ApiAuth.Domain.Exceptions;
using FluentAssertions;
using FluentValidation.Results;

namespace ApiAuth.Tests.Api;

file sealed class ReglaDeNegocioDePruebaException() : DomainException("regla de negocio de prueba", "TEST_RULE");

public class ExceptionResponseMapperTests
{
    [Fact]
    public void NewDomainExceptionType_MapsTo422_WithoutMapperChanges()
    {
        // Prueba el fix OCP: un tipo de DomainException creado en el test, que el mapper nunca
        // vio, cae en 422 automáticamente porque resuelve por ex.StatusCode, no por type-listing.
        var (status, response) = ExceptionResponseMapper.Map(new ReglaDeNegocioDePruebaException());

        status.Should().Be(422);
        response.Code.Should().Be("TEST_RULE");
    }


    [Fact]
    public void InvalidCredentials_MapsTo401_WithCode()
    {
        var (status, response) = ExceptionResponseMapper.Map(new InvalidCredentialsException());

        status.Should().Be(401);
        response.Code.Should().Be("INVALID_CREDENTIALS");
        response.Success.Should().BeFalse();
    }

    [Fact]
    public void ValidationException_MapsTo400_WithFieldErrors()
    {
        var ex = new FluentValidation.ValidationException(
            [new ValidationFailure("Email", "no es un email válido")]);

        var (status, response) = ExceptionResponseMapper.Map(ex);

        status.Should().Be(400);
        var errors = response.Data.Should().BeOfType<Dictionary<string, string[]>>().Subject;
        errors["Email"].Should().Contain("no es un email válido");
    }

    [Fact]
    public void UnknownException_MapsTo500_WithGenericMessage_NeverLeaksInternalDetail()
    {
        var (status, response) = ExceptionResponseMapper.Map(new InvalidOperationException("detalle interno sensible"));

        status.Should().Be(500);
        response.Message.Should().Be("Ocurrió un error interno.");
        response.Message.Should().NotContain("detalle interno sensible");
    }
}
