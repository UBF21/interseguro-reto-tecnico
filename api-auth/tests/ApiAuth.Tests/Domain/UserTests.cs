using ApiAuth.Domain.Users;
using FluentAssertions;

namespace ApiAuth.Tests.Domain;

public class UserTests
{
    [Fact]
    public void User_DefaultsToActive()
    {
        var user = new User
        {
            Email = "ana@interseguro.pe",
            PasswordHash = "hash",
            FullName = "Ana",
            Roles = ["operator"],
        };

        user.IsActive.Should().BeTrue();
    }

    [Fact]
    public void User_CanBeCreatedAsInactive()
    {
        var user = new User
        {
            Email = "ana@interseguro.pe",
            PasswordHash = "hash",
            FullName = "Ana",
            Roles = ["operator"],
            IsActive = false,
        };

        user.IsActive.Should().BeFalse();
    }
}
