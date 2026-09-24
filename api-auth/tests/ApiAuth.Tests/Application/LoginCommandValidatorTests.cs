using ApiAuth.Application.Features.Auth.Commands.Login;
using FluentAssertions;
using FluentValidation.TestHelper;

namespace ApiAuth.Tests.Application;

public class LoginCommandValidatorTests
{
    private readonly LoginCommandValidator _validator = new();

    [Fact]
    public void Valid_Command_HasNoErrors()
    {
        var result = _validator.TestValidate(new LoginCommand("ana@interseguro.pe", "password123"));
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("", "password123")]
    [InlineData("no-es-email", "password123")]
    public void Invalid_Email_HasError(string email, string password)
    {
        var result = _validator.TestValidate(new LoginCommand(email, password));
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void Password_TooShort_HasError()
    {
        var result = _validator.TestValidate(new LoginCommand("ana@interseguro.pe", "123"));
        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void Password_LongerThanBCryptLimit_HasError()
    {
        var result = _validator.TestValidate(new LoginCommand("ana@interseguro.pe", new string('a', 73)));
        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void Email_LongerThan254Chars_HasError()
    {
        var longLocalPart = new string('a', 250);
        var result = _validator.TestValidate(new LoginCommand($"{longLocalPart}@a.pe", "password123"));
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }
}
