using backend.Data;
using backend.DTOs.User;
using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "SYSTEM_ADMIN,STORE_MANAGER,CHAIN_MANAGER")]
    public async Task<IActionResult> GetAll()
    {
        var role = HttpContext.Items["UserRole"]?.ToString();
        var tenantId = (Guid?)HttpContext.Items["TenantId"];

        IQueryable<User> query = _context.Users.Include(u => u.Role).Include(u => u.Tenant);

        if (role != "SYSTEM_ADMIN" && role != "CHAIN_MANAGER" && tenantId.HasValue)
            query = query.Where(u => u.TenantId == tenantId.Value);

        var users = await query.AsNoTracking().ToListAsync();
        var dtos = users.Select(u => new UserResponseDto
        {
            UserId = u.UserId, TenantId = u.TenantId, TenantName = u.Tenant.STenantName,
            RoleId = u.RoleId, RoleName = u.Role.SRoleName,
            FullName = u.SFullName, Email = u.SEmail, Phone = u.SPhone,
            Status = u.IStatus, CreatedAt = u.DCreatedAt, LastLogin = u.DLastLogin
        });
        return Ok(dtos);
    }

    [HttpPost]
    [Authorize(Roles = "SYSTEM_ADMIN,STORE_MANAGER")]
    public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var tenantId = (Guid?)HttpContext.Items["TenantId"];
        if (tenantId == null) return Unauthorized();

        var normalizedEmail = dto.Email.Trim().ToLowerInvariant();

        if (await _context.Users.AnyAsync(u => u.SEmail.ToLower() == normalizedEmail))
            return Conflict(new { message = "Email đã tồn tại." });

        var user = new User
        {
            TenantId = tenantId.Value,
            RoleId = dto.RoleId,
            SFullName = dto.FullName,
            SEmail = normalizedEmail,
            SPasswordHash = PasswordHelper.HashPassword(dto.Password),
            SPhone = dto.Phone,
            IStatus = 1
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = user.UserId }, new { user.UserId, user.SEmail });
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "SYSTEM_ADMIN,STORE_MANAGER")]
    public async Task<IActionResult> ToggleStatus(Guid id, [FromBody] byte status)
    {
        var tenantId = (Guid?)HttpContext.Items["TenantId"];
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();
        if (tenantId.HasValue && user.TenantId != tenantId.Value) return Forbid();

        user.IStatus = status;
        await _context.SaveChangesAsync();
        return Ok(new { user.UserId, user.IStatus });
    }
}
