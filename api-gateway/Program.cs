using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 🔹 Cargar configuración de rutas Ocelot
builder.Configuration
    .AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// 🔹 Llave secreta EXACTAMENTE igual a la usada en NestJS
var secretKey = "juangarcia02";

// 🔹 Configuración de autenticación JWT
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = "Bearer";
        options.DefaultChallengeScheme = "Bearer";
    })
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true, // Cambia a false solo para depurar
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(secretKey)
            )
        };

        // 🔹 Log de errores para depuración
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = ctx =>
            {
                Console.WriteLine($"❌ Error de autenticación: {ctx.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = ctx =>
            {
                Console.WriteLine("✅ Token validado correctamente");
                foreach (var claim in ctx.Principal.Claims)
                {
                    Console.WriteLine($"CLAIM: {claim.Type} = {claim.Value}");
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddOcelot();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

// 🔹 Endpoint de prueba para depurar autenticación
app.MapGet("/test-auth", (HttpContext ctx) =>
{
    if (ctx.User.Identity?.IsAuthenticated ?? false)
    {
        var claims = ctx.User.Claims.Select(c => $"{c.Type} = {c.Value}");
        return Results.Ok(claims);
    }
    else
    {
        return Results.Unauthorized();
    }
}).RequireAuthorization();

await app.UseOcelot();

app.Run();
