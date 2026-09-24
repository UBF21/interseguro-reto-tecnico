using ApiAuth.Application.Common;
using ApiAuth.Domain.Exceptions;
using Microsoft.AspNetCore.Http;

namespace ApiAuth.Api.Common;

// Lógica pura de mapeo excepción -> (status, envelope) -- separada del middleware de
// UseExceptionHandler en Program.cs para poder testearla sin levantar un HttpContext real.
public static class ExceptionResponseMapper
{
    public static (int StatusCode, ApiResponse<object> Response) Map(Exception exception) => exception switch
    {
        FluentValidation.ValidationException ex => (
            StatusCodes.Status400BadRequest,
            ApiResponse<object>.Fail("Solicitud inválida.", BuildValidationErrors(ex), "VALIDATION_ERROR")),

        // Resuelve por ex.StatusCode (polimorfismo) -- una DomainException nueva que no overridea
        // StatusCode cae en 422 por default, sin tener que listar tipos acá (OCP).
        DomainException ex => (
            ex.StatusCode,
            ApiResponse<object>.Fail(ex.Message, code: ex.Code)),

        _ => (
            StatusCodes.Status500InternalServerError,
            ApiResponse<object>.Fail("Ocurrió un error interno.")),
    };

    private static Dictionary<string, string[]> BuildValidationErrors(FluentValidation.ValidationException ex) =>
        ex.Errors.GroupBy(e => e.PropertyName)
            .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());
}
