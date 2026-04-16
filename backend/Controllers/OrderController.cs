using backend.DTOs.Order;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    [Authorize(Roles = "SYSTEM_ADMIN,CHAIN_MANAGER,FRANCHISE_OWNER,STORE_MANAGER,STAFF_POS,BARISTA")]
    public async Task<IActionResult> GetAll(
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var tenantId = (Guid?)HttpContext.Items["TenantId"];
        if (tenantId == null) return Unauthorized();

        var orders = await _orderService.GetOrdersByTenantAsync(tenantId.Value, from, to, page, pageSize);
        return Ok(orders);
    }

    [HttpGet("status/{status}")]
    [Authorize(Roles = "STAFF_POS,BARISTA,STORE_MANAGER")]
    public async Task<IActionResult> GetByStatus(byte status)
    {
        var tenantId = (Guid?)HttpContext.Items["TenantId"];
        if (tenantId == null) return Unauthorized();
        var orders = await _orderService.GetOrdersByStatusAsync(tenantId.Value, status);
        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var tenantId = (Guid?)HttpContext.Items["TenantId"];
        if (tenantId == null) return Unauthorized();
        var order = await _orderService.GetOrderByIdAsync(id, tenantId.Value);
        return order == null ? NotFound() : Ok(order);
    }

    [HttpPost]
    [Authorize(Roles = "STAFF_POS,STORE_MANAGER")]
    public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var tenantId = (Guid?)HttpContext.Items["TenantId"];
        var userId   = (Guid?)HttpContext.Items["UserId"];
        if (tenantId == null || userId == null) return Unauthorized();

        try
        {
            var order = await _orderService.CreateOrderAsync(tenantId.Value, userId.Value, dto);
            return CreatedAtAction(nameof(GetById), new { id = order.OrderId }, order);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "STAFF_POS,BARISTA,STORE_MANAGER")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] byte status)
    {
        var tenantId = (Guid?)HttpContext.Items["TenantId"];
        if (tenantId == null) return Unauthorized();

        var updated = await _orderService.UpdateOrderStatusAsync(id, tenantId.Value, status);
        return updated == null ? NotFound() : Ok(updated);
    }
}
