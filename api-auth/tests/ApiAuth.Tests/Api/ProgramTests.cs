using System.Net;
using System.Net.Http.Json;
using ApiAuth.Api.Dtos.Auth;
using ApiAuth.Application.Common;
using ApiAuth.Application.Features.Auth.Commands.Login;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

namespace ApiAuth.Tests.Api;

public class ProgramTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public ProgramTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder => builder
            .UseSetting("Jwt:Secret", "super-secret-key-at-least-32-bytes-long!!")
            .UseSetting("Jwt:Issuer", "api-auth")
            .UseSetting("Jwt:Audience", "interseguro-reto")
            .UseSetting("Testing:UseInMemoryDatabase", "true"));
    }

    [Fact]
    public async Task Health_ReturnsHealthy()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/health");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Login_WithSeededDemoUser_ReturnsToken()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/v1/auth/login",
            new LoginRequestDto("operaciones@interseguro.pe", "Reto2025!"));

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<LoginResult>>();
        body!.Success.Should().BeTrue();
        body.Data!.AccessToken.Should().NotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task Login_WithWrongPassword_Returns401_WithEnvelope()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/v1/auth/login",
            new LoginRequestDto("operaciones@interseguro.pe", "password-incorrecto"));

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<object>>();
        body!.Success.Should().BeFalse();
        body.Code.Should().Be("INVALID_CREDENTIALS");
    }

    [Fact]
    public async Task Login_WithMalformedEmail_Returns400_WithValidationErrorEnvelope()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/v1/auth/login",
            new LoginRequestDto("no-es-un-email", "password123"));

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<Dictionary<string, string[]>>>();
        body!.Success.Should().BeFalse();
        body.Code.Should().Be("VALIDATION_ERROR");
        body.Data.Should().ContainKey("Email");
    }

    [Fact]
    public async Task Preflight_FromWebOrigin_ReturnsAllowOriginHeader()
    {
        var client = _factory.CreateClient();
        var request = new HttpRequestMessage(HttpMethod.Options, "/api/v1/auth/login");
        request.Headers.Add("Origin", "http://localhost:5273");
        request.Headers.Add("Access-Control-Request-Method", "POST");

        var response = await client.SendAsync(request);

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        response.Headers.GetValues("Access-Control-Allow-Origin").Should().ContainSingle("http://localhost:5273");
    }

    [Fact]
    public async Task Login_SixthRequestWithinAMinute_Returns429()
    {
        var client = _factory.CreateClient();
        HttpResponseMessage? last = null;

        for (var i = 0; i < 6; i++)
        {
            last = await client.PostAsJsonAsync("/api/v1/auth/login",
                new LoginRequestDto("operaciones@interseguro.pe", "password-incorrecto"));
        }

        last!.StatusCode.Should().Be(HttpStatusCode.TooManyRequests);
        var body = await last.Content.ReadFromJsonAsync<ApiResponse<object>>();
        body!.Code.Should().Be("RATE_LIMITED");
    }
}
