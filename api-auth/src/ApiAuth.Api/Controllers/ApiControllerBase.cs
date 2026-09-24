using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ApiAuth.Api.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public abstract class ApiControllerBase(ISender sender) : ControllerBase
{
    protected readonly ISender Sender = sender;
}
