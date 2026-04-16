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

    [HttpGet]
    [Authorize(Roles = "SYSTEM_ADMIN,STORE_MANAGER,FRANCHISE_OWNER,WAREHOUSE")]
    public async Task<IActionResult> GetAll()
    {
        var tenantId = (Guid?)HttpContext.Items["TenantId"];
        if (tenantId == null) return Unauthorized();
        var list = await _inventoryService.GetIngredientsByTenantAsync(tenantId.Value);
        return Ok(list);
    }

    [HttpGet("low-stock")]
    [Authorize(Roles = "SYSTEM_ADMIN,STORE_MANAGER,FRANCHISE_OWNER,WAREHOUSE")]
    public async Task<IActionResult> GetLowStock()
    {
        var tenantId = (Guid?)HttpContext.Items["TenantId"];
        if (tenantId == null) return Unauthorized();
        var list = await _inventoryService.GetLowStockAsync(tenantId.Value);
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

        var result = await _inventoryService.ImportStockAsync(tenantId.Value, userId.Value, dto);
        return result == null ? NotFound(new { message = "Nguyên liệu không tồn tại trong chi nhánh này." }) : Ok(result);
    }
}
