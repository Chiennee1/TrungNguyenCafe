using backend.Data;
using backend.DTOs.Auth;
using backend.Helpers;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly JwtHelper _jwtHelper;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext context, JwtHelper jwtHelper, IConfiguration config)
    {
        _context = context;
        _jwtHelper = jwtHelper;
        _config = config;
    }

    public async Task<LoginResponseDto?> LoginAsync(string email, string password, string ipAddress)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();

        var user = await _context.Users
            .Include(u => u.Tenant)
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u =>
                u.SEmail.ToLower() == normalizedEmail &&
                u.IStatus == 1);

        if (user == null) return null;
        if (!PasswordHelper.VerifyPassword(password, user.SPasswordHash)) return null;

        var token = _jwtHelper.GenerateToken(
            user.UserId, user.TenantId, user.SEmail, user.Role.SRoleName, user.SFullName);

        user.DLastLogin = DateTime.UtcNow;

        _context.AuditLogs.Add(new Models.AuditLog
        {
            TenantId = user.TenantId,
            UserId = user.UserId,
            SAction = "LOGIN_SUCCESS",
            SEntityName = "tbl_User",
            SEntityId = user.UserId.ToString(),
            SIpAddress = ipAddress
        });
        await _context.SaveChangesAsync();

        int expiryMinutes = int.Parse(_config["JwtSettings:ExpiryMinutes"] ?? "720");

        return new LoginResponseDto
        {
            Token = token,
            UserId = user.UserId.ToString(),
            FullName = user.SFullName,
            Email = user.SEmail,
            Role = user.Role.SRoleName,
            TenantId = user.TenantId.ToString(),
            TenantName = user.Tenant.STenantName,
            ExpiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes)
        };
    }

    public async Task<bool> RegisterAsync(RegisterRequestDto dto)
    {
        var normalizedEmail = dto.Email.Trim().ToLowerInvariant();
        if (await _context.Users.AnyAsync(u => u.SEmail.ToLower() == normalizedEmail))
            return false;

        var role = await _context.Roles.FirstOrDefaultAsync(r => r.SRoleName == "SYSTEM_ADMIN");
        if (role == null) return false;

        var tenantId = Guid.NewGuid();
        var tenant = new Models.Tenant
        {
            TenantId = tenantId,
            STenantName = dto.TenantName.Trim(),
            SAddress = "TBD",
            SPhone = "TBD",
            SEmail = dto.Email
        };

        var user = new Models.User
        {
            UserId = Guid.NewGuid(),
            TenantId = tenantId,
            RoleId = role.RoleId,
            SFullName = dto.FullName.Trim(),
            SEmail = dto.Email.Trim(),
            SPasswordHash = PasswordHelper.HashPassword(dto.Password),
            IStatus = 1
        };

        _context.Tenants.Add(tenant);
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return true;
    }
}
