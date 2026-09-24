using ApiAuth.Application.Features.Auth.Interfaces;

namespace ApiAuth.Infrastructure.Security;

public class BCryptPasswordHasher : IPasswordHasher
{
    private const int WorkFactor = 12;

    public string DummyHash { get; } = BCrypt.Net.BCrypt.EnhancedHashPassword("dummy-password-for-timing-safety", WorkFactor);

    public string Hash(string plaintext) => BCrypt.Net.BCrypt.EnhancedHashPassword(plaintext, WorkFactor);

    public bool Verify(string hash, string plaintext)
    {
        try
        {
            return BCrypt.Net.BCrypt.EnhancedVerify(plaintext, hash);
        }
        catch (BCrypt.Net.SaltParseException)
        {
            // hash corrupto/formato inesperado -- negar acceso, nunca lanzar hacia el caller.
            return false;
        }
    }
}
