using ApiAuth.Api.Common;
using ApiAuth.Application.Common;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;

namespace ApiAuth.Tests.Api;

public class ApiResponseEnvelopeFilterTests
{
    private static ActionExecutingContext CreateContext() =>
        new(
            new ActionContext(new DefaultHttpContext(), new RouteData(), new ActionDescriptor()),
            [],
            new Dictionary<string, object?>(),
            controller: new object());

    private static ActionExecutedContext RunFilter(ActionExecutingContext context, IActionResult rawResult)
    {
        var executedContext = new ActionExecutedContext(context, [], context.Controller) { Result = rawResult };
        new ApiResponseEnvelopeFilter().OnActionExecutionAsync(context, () => Task.FromResult(executedContext)).GetAwaiter().GetResult();
        return executedContext;
    }

    [Fact]
    public void WrapsRawObjectResult_IntoApiResponse()
    {
        var executed = RunFilter(CreateContext(), new ObjectResult("hola") { StatusCode = 200 });

        var wrapped = executed.Result.Should().BeOfType<ObjectResult>().Subject;
        wrapped.Value.Should().BeOfType<ApiResponse<string>>()
            .Which.Data.Should().Be("hola");
    }

    [Fact]
    public void DoesNotDoubleWrap_WhenControllerAlreadyReturnsApiResponse()
    {
        var alreadyWrapped = ApiResponse<string>.Ok("hola");

        var executed = RunFilter(CreateContext(), new ObjectResult(alreadyWrapped) { StatusCode = 200 });

        var result = executed.Result.Should().BeOfType<ObjectResult>().Subject;
        result.Value.Should().BeSameAs(alreadyWrapped);
    }

    [Fact]
    public void DoesNotWrap_ErrorStatusCodes()
    {
        var executed = RunFilter(CreateContext(), new ObjectResult("error crudo") { StatusCode = 404 });

        var result = executed.Result.Should().BeOfType<ObjectResult>().Subject;
        result.Value.Should().Be("error crudo");
    }
}
