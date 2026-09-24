using FluentValidation;

namespace ApiAuth.Application.Features.Auth.Commands.Login;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(254);
        // 72 = límite real de BCrypt -- pasarle más se trunca en silencio, mejor rechazarlo explícito.
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8).MaximumLength(72);
    }
}
