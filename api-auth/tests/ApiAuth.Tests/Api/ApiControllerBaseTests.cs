using ApiAuth.Api.Controllers;
using FluentAssertions;
using MediatR;
using NSubstitute;

namespace ApiAuth.Tests.Api;

file sealed class TestController(ISender sender) : ApiControllerBase(sender)
{
    public ISender Exposed => Sender;
}

public class ApiControllerBaseTests
{
    [Fact]
    public void Sender_IsExposedToDerivedControllers()
    {
        var sender = Substitute.For<ISender>();
        var controller = new TestController(sender);

        controller.Exposed.Should().BeSameAs(sender);
    }
}
