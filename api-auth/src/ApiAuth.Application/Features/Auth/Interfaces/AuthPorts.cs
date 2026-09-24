namespace ApiAuth.Application.Features.Auth.Interfaces;

public interface IPasswordHasher
{
    string Hash(string plaintext);
    bool Verify(string hash, string plaintext);

    // Hash precomputado y estable, usado por LoginCommandHandler cuando el usuario no existe --
    // corre Verify contra esto para que el costo de CPU sea el mismo que con un usuario real
    // (protección contra timing attack). Vive en la interfaz porque el algoritmo concreto
    // (BCrypt, Argon2id, etc.) es responsabilidad de la implementación, no de Application.
    string DummyHash { get; }
}

public interface IJwtTokenGenerator
{
    string GenerateToken(Guid userId, string email, IReadOnlyList<string> roles);
}
