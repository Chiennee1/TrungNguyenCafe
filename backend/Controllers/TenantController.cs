using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/tenants")]
[Authorize(Roles = "SYSTEM_ADMIN")]
public class TenantController : ControllerBase
{
    private readonly AppDbContext _context;

    public TenantController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tenants = await _context.Tenants.AsNoTracking().ToListAsync();
        return Ok(tenants);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var tenant = await _context.Tenants.AsNoTracking().FirstOrDefaultAsync(t => t.TenantId == id);
        return tenant == null ? NotFound() : Ok(tenant);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Tenant dto)
    {
        dto.TenantId = Guid.NewGuid();
        dto.DCreatedAt = DateTime.UtcNow;
        _context.Tenants.Add(dto);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = dto.TenantId }, dto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Tenant dto)
    {
        var tenant = await _context.Tenants.FindAsync(id);
        if (tenant == null) return NotFound();
        tenant.STenantName = dto.STenantName;
        tenant.SAddress = dto.SAddress;
        tenant.SPhone = dto.SPhone;
        tenant.SEmail = dto.SEmail;
        tenant.SFranchiseType = dto.SFranchiseType;
        tenant.IStatus = dto.IStatus;
        await _context.SaveChangesAsync();
        return Ok(tenant);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> ToggleStatus(Guid id, [FromBody] byte status)
    {
        var tenant = await _context.Tenants.FindAsync(id);
        if (tenant == null) return NotFound();
        tenant.IStatus = status;
        await _context.SaveChangesAsync();
        return Ok(new { tenant.TenantId, tenant.IStatus });
    }
}
