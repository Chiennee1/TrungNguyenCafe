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
    [Authorize(Roles = "SYSTEM_ADMIN,CHAIN_MANAGER,STORE_MANAGER")]
    public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var role = HttpContext.Items["UserRole"]?.ToString();
        var tenantId = (Guid?)HttpContext.Items["TenantId"];

        var targetTenantId = (role == "SYSTEM_ADMIN" || role == "CHAIN_MANAGER") && dto.TenantId.HasValue
            ? dto.TenantId.Value
            : tenantId;

        if (targetTenantId == null) return Unauthorized(new { message = "Không xác định được chi nhánh." });

        var normalizedEmail = dto.Email.Trim().ToLowerInvariant();

        if (await _context.Users.AnyAsync(u => u.SEmail.ToLower() == normalizedEmail))
            return Conflict(new { message = "Email đã tồn tại." });

        // Generate ID early to ensure consistency
        var userId = Guid.NewGuid();

        var user = new User
        {
            UserId = userId,
            TenantId = targetTenantId.Value,
            RoleId = dto.RoleId,
            SFullName = dto.FullName,
            SEmail = normalizedEmail,
            SPasswordHash = PasswordHelper.HashPassword(dto.Password),
            SPhone = dto.Phone,
            IStatus = 1,
            DCreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = user.UserId }, new { user.UserId, user.SEmail });
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "SYSTEM_ADMIN,CHAIN_MANAGER,STORE_MANAGER")]
    public async Task<IActionResult> ToggleStatus(Guid id, [FromBody] byte status)
    {
        var tenantId = (Guid?)HttpContext.Items["TenantId"];
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();
        
        var currentRole = HttpContext.Items["UserRole"]?.ToString();
        if (currentRole != "SYSTEM_ADMIN" && currentRole != "CHAIN_MANAGER" && tenantId.HasValue && user.TenantId != tenantId.Value) 
            return Forbid();

        user.IStatus = status;
        await _context.SaveChangesAsync();
        return Ok(new { user.UserId, user.IStatus });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "SYSTEM_ADMIN,CHAIN_MANAGER,STORE_MANAGER")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        var currentRole = HttpContext.Items["UserRole"]?.ToString();
        var currentTenantId = (Guid?)HttpContext.Items["TenantId"];

        if (currentRole != "SYSTEM_ADMIN" && currentRole != "CHAIN_MANAGER" && currentTenantId.HasValue && user.TenantId != currentTenantId.Value)
            return Forbid();

        var normalizedEmail = dto.Email.Trim().ToLowerInvariant();

        if (user.SEmail.ToLower() != normalizedEmail && await _context.Users.AnyAsync(u => u.SEmail.ToLower() == normalizedEmail))
            return Conflict(new { message = "Email đã tồn tại." });

        var targetTenantId = (currentRole == "SYSTEM_ADMIN" || currentRole == "CHAIN_MANAGER") && dto.TenantId.HasValue
            ? dto.TenantId.Value
            : user.TenantId;

        user.TenantId = targetTenantId;
        user.RoleId = dto.RoleId;
        user.SFullName = dto.FullName;
        user.SEmail = normalizedEmail;
        user.SPhone = dto.Phone;
        user.IStatus = dto.Status;

        await _context.SaveChangesAsync();
        return Ok(new { user.UserId, user.SEmail });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "SYSTEM_ADMIN,CHAIN_MANAGER,STORE_MANAGER")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        var currentRole = HttpContext.Items["UserRole"]?.ToString();
        var currentTenantId = (Guid?)HttpContext.Items["TenantId"];

        if (currentRole != "SYSTEM_ADMIN" && currentRole != "CHAIN_MANAGER" && currentTenantId.HasValue && user.TenantId != currentTenantId.Value)
            return Forbid();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
