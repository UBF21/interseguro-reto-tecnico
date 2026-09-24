using ApiAuth.Domain.Common;
using FluentAssertions;

namespace ApiAuth.Tests.Domain;

file sealed record TestEntity : BaseEntity;

public class BaseEntityTests
{
    [Fact]
    public void Id_IsAssignedAutomatically_AndIsUnique()
    {
        var a = new TestEntity();
        var b = new TestEntity();

        a.Id.Should().NotBe(Guid.Empty);
        a.Id.Should().NotBe(b.Id);
    }
}
