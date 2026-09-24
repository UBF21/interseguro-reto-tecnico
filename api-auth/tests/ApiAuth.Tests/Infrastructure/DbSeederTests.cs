using ApiAuth.Application.Features.Auth.Interfaces;
using ApiAuth.Domain.Users;
using ApiAuth.Infrastructure.Persistence;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using NSubstitute;

namespace ApiAuth.Tests.Infrastructure;

public class DbSeederTests
{
    private static AuthDbContext CreateContext() =>
        new(new DbContextOptionsBuilder<AuthDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);

    [Fact]
    public async Task SeedAsync_EmptyDb_CreatesDemoUser()
    {
        await using var context = CreateContext();
        var hasher = Substitute.For<IPasswordHasher>();
        hasher.Hash("Reto2025!").Returns("hashed");

        await DbSeeder.SeedAsync(context, hasher);

        (await context.Users.SingleAsync()).Email.Should().Be("operaciones@interseguro.pe");
    }

    [Fact]
    public async Task SeedAsync_AlreadyHasUsers_DoesNothing()
    {
        await using var context = CreateContext();
        context.Users.Add(new User { Email = "existente@interseguro.pe", PasswordHash = "h", FullName = "X", Roles = [] });
        await context.SaveChangesAsync();

        await DbSeeder.SeedAsync(context, Substitute.For<IPasswordHasher>());

        (await context.Users.CountAsync()).Should().Be(1);
    }
}
