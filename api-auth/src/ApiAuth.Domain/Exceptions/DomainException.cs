namespace ApiAuth.Domain.Exceptions;

public abstract class DomainException : Exception
{
    public string? Code { get; }

    // Int plano, no Microsoft.AspNetCore.Http.StatusCodes -- Domain no depende de ASP.NET Core.
    // Default 422 (regla de negocio violada); las subclases override para casos distintos (401, etc.)
    // así ExceptionResponseMapper resuelve por polimorfismo, sin listar tipos concretos (OCP).
    public virtual int StatusCode => 422;

    protected DomainException(string message, string? code = null) : base(message) => Code = code;
}

public sealed class InvalidCredentialsException()
    : DomainException("Usuario o contraseña incorrectos.", "INVALID_CREDENTIALS")
{
    public override int StatusCode => 401;
}

public sealed class AccountDisabledException()
    : DomainException("La cuenta está deshabilitada.", "ACCOUNT_DISABLED")
{
    public override int StatusCode => 401;
}
