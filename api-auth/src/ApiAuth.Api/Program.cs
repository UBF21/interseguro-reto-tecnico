using System.Text;
using ApiAuth.Api.Common;
using ApiAuth.Application;
using ApiAuth.Application.Common;
using ApiAuth.Application.Features.Auth.Interfaces;
using ApiAuth.Infrastructure;
using ApiAuth.Infrastructure.Persistence;
using ApiAuth.Infrastructure.Secrets;
using ApiAuth.Infrastructure.Security;
using System.Threading.RateLimiting;
using Asp.Versioning;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Vault (docker-compose) sobreescribe Jwt:*/ConnectionStrings:Postgres antes que nada más los lea.
// No-op si VAULT_ADDR/VAULT_TOKEN no están seteados (dev local sin Docker).
await builder.Configuration.AddVaultSecretsAsync();

builder.Services
    .AddControllers(options => options.Filters.Add<ApiResponseEnvelopeFilter>());

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
}).AddMvc();

var jwtSettings = builder.Configuration.GetSection(JwtSettings.SectionName).Get<JwtSettings>()
    ?? throw new InvalidOperationException("Falta la sección Jwt en la configuración.");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret)),
            ValidateIssuer = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidateAudience = true,
            ValidAudience = jwtSettings.Audience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
        };
    });
builder.Services.AddAuthorization();

// Rate limit por IP en /login -- 5 intentos/min. In-memory/por-proceso, alcance de demo (no
// distribuido; múltiples réplicas no comparten contador).
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, ct) =>
    {
        context.HttpContext.Response.ContentType = "application/json";
        await context.HttpContext.Response.WriteAsJsonAsync(
            ApiResponse<object>.Fail("Demasiados intentos. Intenta de nuevo en un minuto.", code: "RATE_LIMITED"),
            ct);
    };
    options.AddPolicy("login", httpContext => RateLimitPartition.GetFixedWindowLimiter(
        partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        factory: _ => new FixedWindowRateLimiterOptions { PermitLimit = 5, Window = TimeSpan.FromMinutes(1) }));
});

// Sin esto, el preflight OPTIONS del navegador no tiene headers Access-Control-*, el fetch() del
// frontend falla con "Failed to fetch"/CORS error aunque curl/Postman funcionen (no hacen preflight).
var webOrigin = builder.Configuration["WebOrigin"] ?? "http://localhost:5273";
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => policy.WithOrigins(webOrigin).AllowAnyMethod().AllowAnyHeader());
});

builder.Services.AddOpenApi(options =>
{
    // Habilita el botón "Authorize" en Swagger UI -- sin esto el usuario no tiene forma de pegar
    // el JWT y probar los endpoints protegidos desde la UI.
    options.AddDocumentTransformer((document, _, _) =>
    {
        document.Components ??= new OpenApiComponents();
        document.Components.SecuritySchemes["Bearer"] = new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
        };
        document.SecurityRequirements.Add(new OpenApiSecurityRequirement
        {
            [new OpenApiSecurityScheme { Reference = new OpenApiReference { Id = "Bearer", Type = ReferenceType.SecurityScheme } }] = [],
        });
        return Task.CompletedTask;
    });
});
builder.Services.AddHealthChecks();

var app = builder.Build();

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var error = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>()?.Error;
        var logger = context.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("GlobalExceptionHandler");
        if (error is null) return;

        var (statusCode, response) = ExceptionResponseMapper.Map(error);

        if (statusCode == StatusCodes.Status500InternalServerError)
            logger.LogError(error, "Excepción no controlada en {Method} {Path}", context.Request.Method, context.Request.Path);
        else
            logger.LogWarning("{ExceptionType} en {Method} {Path}: {Message}", error.GetType().Name, context.Request.Method, context.Request.Path, error.Message);

        context.Response.StatusCode = statusCode;
        await context.Response.WriteAsJsonAsync(response);
    });
});

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "ApiAuth v1");
        options.RoutePrefix = "swagger";
    });
    // Solo en dev: al levantar el servicio, la home ya es la documentación interactiva.
    app.MapGet("/", () => Results.Redirect("/swagger")).ExcludeFromDescription();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
    // InMemory (usado en WebApplicationFactory de integration tests) no soporta migraciones --
    // EnsureCreated es el equivalente ahí. En Postgres real siempre se usa Migrate.
    if (dbContext.Database.IsRelational())
        await dbContext.Database.MigrateAsync();
    else
        await dbContext.Database.EnsureCreatedAsync();
    await DbSeeder.SeedAsync(dbContext, scope.ServiceProvider.GetRequiredService<IPasswordHasher>());
}

app.Run();

// Necesario para WebApplicationFactory<Program> en tests de integración futuros.
public partial class Program;
