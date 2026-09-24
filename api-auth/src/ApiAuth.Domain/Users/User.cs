using ApiAuth.Domain.Common;

namespace ApiAuth.Domain.Users;

public record User : BaseEntity
{
    public required string Email { get; init; }
    public required string PasswordHash { get; init; }
    public required string FullName { get; init; }
    public required IReadOnlyList<string> Roles { get; init; }
    public bool IsActive { get; init; } = true;
}
