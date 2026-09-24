using ApiAuth.Application.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ApiAuth.Api.Common;

// Envuelve automáticamente cualquier `Ok(dto)` crudo de un controller en ApiResponse<T>.Ok(dto) --
// nadie tiene que acordarse de armar el envelope a mano en cada action.
public class ApiResponseEnvelopeFilter : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var executed = await next();
        if (executed.Exception is not null || executed.Result is not ObjectResult objectResult) return;

        var statusCode = objectResult.StatusCode ?? StatusCodes.Status200OK;
        if (statusCode is < 200 or >= 300) return;

        var valueType = objectResult.Value?.GetType();
        var yaEnvuelto = valueType is { IsGenericType: true } &&
            valueType.GetGenericTypeDefinition() == typeof(ApiResponse<>);
        if (yaEnvuelto) return;

        var tipoInterno = valueType ?? typeof(object);
        var wrapped = typeof(ApiResponse<>).MakeGenericType(tipoInterno)
            .GetMethod(nameof(ApiResponse<object>.Ok))!.Invoke(null, [objectResult.Value, null]);
        executed.Result = new ObjectResult(wrapped) { StatusCode = statusCode };
    }
}
