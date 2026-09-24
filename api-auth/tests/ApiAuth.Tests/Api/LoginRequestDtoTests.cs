using ApiAuth.Api.Dtos.Auth;
using FluentAssertions;

namespace ApiAuth.Tests.Api;

public class LoginRequestDtoTests
{
    [Fact]
    public void Equality_IsByValue_LikeAnyRecord()
    {
        var a = new LoginRequestDto("ana@interseguro.pe", "pass1234");
        var b = new LoginRequestDto("ana@interseguro.pe", "pass1234");

        a.Should().Be(b);
    }
}
