using ApiAuth.Application.Features.Auth.Interfaces;
using ApiAuth.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace ApiAuth.Infrastructure.Persistence;

// Seed de un solo usuario de demo -- suficiente para el reto técnico, no hay flujo de
// registro/gestión de usuarios pedido en el enunciado (YAGNI, ver README para credenciales).
public static class DbSeeder
{
    // No migra la BD -- eso es responsabilidad de Program.cs en el arranque (separación de
    // responsabilidades: migrar el esquema y sembrar datos son pasos distintos y esto último
    // necesita ser testeable contra un proveedor in-memory que no soporta migraciones).
    public static async Task SeedAsync(AuthDbContext dbContext, IPasswordHasher passwordHasher)
    {
        if (await dbContext.Users.AnyAsync()) return;

        dbContext.Users.Add(new User
        {
            Email = "operaciones@interseguro.pe",
            PasswordHash = passwordHasher.Hash("Reto2025!"),
            FullName = "Equipo de Operaciones",
            Roles = ["operator"],
        });

        await dbContext.SaveChangesAsync();
    }
}
