using FluentValidation;
using MediatR;

namespace ApiAuth.Application.Common;

// Corre los IValidator<TRequest> registrados antes del handler. El throw no define la respuesta
// HTTP -- eso lo hace ExceptionResponseMapper (Api/Common), que ya mapea FluentValidation.ValidationException
// a 400 VALIDATION_ERROR con el envelope estándar. Sin este behavior, los validadores quedan
// registrados en DI pero nunca se ejecutan.
public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators) => _validators = validators;

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        if (!_validators.Any()) return await next();

        var context = new ValidationContext<TRequest>(request);
        var results = await Task.WhenAll(_validators.Select(v => v.ValidateAsync(context, ct)));
        var failures = results.SelectMany(r => r.Errors).ToList();

        if (failures.Count > 0) throw new ValidationException(failures);

        return await next();
    }
}
