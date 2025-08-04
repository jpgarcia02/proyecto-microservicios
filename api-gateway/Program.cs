using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 🔹 Aseguramos que Ocelot cargue el JSON de rutas
builder.Configuration
    .AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// 🔹 Llave secreta EXACTAMENTE igual a la de NestJS
var secretKey = "ju@ng@rcia02";

// 🔹 Configuración JWT
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(secretKey)
            )
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddOcelot();

var app = builder.Build();

// 🔹 Middleware
app.UseAuthentication();
app.UseAuthorization();
await app.UseOcelot();

app.Run();
