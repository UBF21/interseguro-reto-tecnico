using ApiAuth.Application.Common;
using FluentAssertions;

namespace ApiAuth.Tests.Application;

public class ApiResponseTests
{
    [Fact]
    public void Ok_SetsSuccessTrue_AndNullCode()
    {
        var response = ApiResponse<string>.Ok("payload", "listo");

        response.Success.Should().BeTrue();
        response.Data.Should().Be("payload");
        response.Message.Should().Be("listo");
        response.Code.Should().BeNull();
    }

    [Fact]
    public void Fail_SetsSuccessFalse_AndPropagatesCode()
    {
        var response = ApiResponse<string>.Fail("credenciales inválidas", code: "INVALID_CREDENTIALS");

        response.Success.Should().BeFalse();
        response.Data.Should().BeNull();
        response.Code.Should().Be("INVALID_CREDENTIALS");
    }
}
