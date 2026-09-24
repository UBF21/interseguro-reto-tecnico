using ApiAuth.Infrastructure.Security;
using FluentAssertions;

namespace ApiAuth.Tests.Infrastructure;

public class BCryptPasswordHasherTests
{
    private readonly BCryptPasswordHasher _hasher = new();

    [Fact]
    public void Hash_ThenVerify_WithCorrectPassword_ReturnsTrue()
    {
        var hash = _hasher.Hash("MiPassword123!");
        _hasher.Verify(hash, "MiPassword123!").Should().BeTrue();
    }

    [Fact]
    public void Verify_WithWrongPassword_ReturnsFalse()
    {
        var hash = _hasher.Hash("MiPassword123!");
        _hasher.Verify(hash, "OtroPassword").Should().BeFalse();
    }

    [Fact]
    public void Verify_WithCorruptHash_ReturnsFalse_DoesNotThrow()
    {
        _hasher.Verify("hash-corrupto-no-valido", "cualquiera").Should().BeFalse();
    }

    [Fact]
    public void DummyHash_IsAWellFormedBCryptHash_UsableWithVerify()
    {
        _hasher.DummyHash.Should().NotBeNullOrWhiteSpace();
        _hasher.Verify(_hasher.DummyHash, "cualquier-password").Should().BeFalse();
    }
}
