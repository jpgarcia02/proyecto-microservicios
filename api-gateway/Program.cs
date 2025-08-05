using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1️⃣ Carga rutas de Ocelot
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// 2️⃣ Define tu secret (idéntico al de NestJS)
var secretKey = "SuperUltraS3cUr3-4p1-g4t3w4y-K3y!123";
var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

// 3️⃣ Registra la autenticación EXPLICÍTAMENTE con el esquema "Bearer"
builder.Services
  .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
  {
      options.TokenValidationParameters = new TokenValidationParameters
      {
          ValidateIssuer           = false,
          ValidateAudience         = false,
          ValidateLifetime         = true,
          ValidateIssuerSigningKey = true,
          IssuerSigningKey         = signingKey,
          ClockSkew                = TimeSpan.Zero,
          ValidAlgorithms          = new[] { SecurityAlgorithms.HmacSha256 }
      };

      options.Events = new JwtBearerEvents
      {
          OnMessageReceived = ctx =>
          {
              var token = ctx.Request.Headers
                  .Authorization
                  .FirstOrDefault()?
                  .Split(" ").Last();
              Console.WriteLine($"🔑 Token recibido: {token?[..20]}...");
              return Task.CompletedTask;
          },
          OnAuthenticationFailed = ctx =>
          {
              Console.WriteLine($"❌ Auth failed: {ctx.Exception.Message}");
              return Task.CompletedTask;
          },
          OnTokenValidated = ctx =>
          {
              Console.WriteLine("✅ Token validado correctamente");
              return Task.CompletedTask;
          }
      };
  });

builder.Services.AddAuthorization();
builder.Services.AddOcelot();

Microsoft.IdentityModel.Logging.IdentityModelEventSource.ShowPII = true;

var app = builder.Build();

// 4️⃣ Pipeline en orden
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

// No necesitas MapGet de prueba aquí; Ocelot se encarga de las rutas downstream
await app.UseOcelot();

app.Run();
