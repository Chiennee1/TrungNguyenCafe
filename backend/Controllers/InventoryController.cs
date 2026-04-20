using backend.DTOs.Inventory;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/inventory")]
[Authorize]
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _inventoryService;

    public InventoryController(IInventoryService inventoryService)
    {
        _inventoryService = inventoryService;
    }

    private Guid? GetScopedTenantId(out bool isUnauthorized)
    {
        var role = HttpContext.Items["UserRole"]?.ToString();
        var tenantId = (Guid?)HttpContext.Items["TenantId"];
        Guid? scopedTenantId = (role == "SYSTEM_ADMIN" || role == "CHAIN_MANAGER") ? null : tenantId;
        
        isUnauthorized = scopedTenantId == null && role != "SYSTEM_ADMIN" && role != "CHAIN_MANAGER";
        return scopedTenantId;
    }

    [HttpGet]
    [Authorize(Roles = "SYSTEM_ADMIN,STORE_MANAGER,FRANCHISE_OWNER,WAREHOUSE")]
    public async Task<IActionResult> GetAll()
    {
        var scopedTenantId = GetScopedTenantId(out bool isUnauthorized);
        if (isUnauthorized) return Unauthorized();

        var list = await _inventoryService.GetIngredientsByTenantAsync(scopedTenantId);
        return Ok(list);
    }

    [HttpGet("low-stock")]
    [Authorize(Roles = "SYSTEM_ADMIN,STORE_MANAGER,FRANCHISE_OWNER,WAREHOUSE")]
    public async Task<IActionResult> GetLowStock()
    {
        var scopedTenantId = GetScopedTenantId(out bool isUnauthorized);
        if (isUnauthorized) return Unauthorized();

        var list = await _inventoryService.GetLowStockAsync(scopedTenantId);
        return Ok(list);
    }

    [HttpPost("import")]
    [Authorize(Roles = "WAREHOUSE,STORE_MANAGER")]
    public async Task<IActionResult> Import([FromBody] ImportStockDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var tenantId = (Guid?)HttpContext.Items["TenantId"];
        var userId   = (Guid?)HttpContext.Items["UserId"];
        if (tenantId == null || userId == null) return Unauthorized();

        try
        {
            var result = await _inventoryService.ImportStockAsync(tenantId.Value, userId.Value, dto);
            return result == null
                ? NotFound(new { message = "Nguyên liệu không tồn tại trong chi nhánh này." })
                : Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("export")]
    [Authorize(Roles = "WAREHOUSE,STORE_MANAGER")]
    public async Task<IActionResult> Export([FromBody] ImportStockDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var tenantId = (Guid?)HttpContext.Items["TenantId"];
        var userId = (Guid?)HttpContext.Items["UserId"];
        if (tenantId == null || userId == null) return Unauthorized();

        try
        {
            var result = await _inventoryService.ExportStockAsync(tenantId.Value, userId.Value, dto);
            return result == null
                ? NotFound(new { message = "Nguyên liệu không tồn tại trong chi nhánh này." })
                : Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("history")]
    [Authorize(Roles = "SYSTEM_ADMIN,STORE_MANAGER,FRANCHISE_OWNER,WAREHOUSE")]
    public async Task<IActionResult> GetHistory([FromQuery] int take = 100)
    {
        var scopedTenantId = GetScopedTenantId(out bool isUnauthorized);
        if (isUnauthorized) return Unauthorized();

        var list = await _inventoryService.GetStockHistoryByTenantAsync(scopedTenantId, take);
        return Ok(list);
    }

    [HttpGet("stats")]
    [Authorize(Roles = "SYSTEM_ADMIN,STORE_MANAGER,FRANCHISE_OWNER,WAREHOUSE")]
    public async Task<IActionResult> GetStats()
    {
        var scopedTenantId = GetScopedTenantId(out bool isUnauthorized);
        if (isUnauthorized) return Unauthorized();

        var stats = await _inventoryService.GetInventoryStatsAsync(scopedTenantId);
        return Ok(stats);
    }
}
