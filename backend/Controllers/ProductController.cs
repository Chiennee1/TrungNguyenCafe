using backend.DTOs.Product;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/products")]
[Authorize]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool activeOnly = true)
    {
        var tenantId = (Guid?)HttpContext.Items["TenantId"];
        if (tenantId == null) return Unauthorized();

        var products = await _productService.GetProductsByTenantAsync(tenantId.Value, activeOnly);
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var product = await _productService.GetProductByIdAsync(id);
        return product == null ? NotFound() : Ok(product);
    }

    [HttpPost]
    [Authorize(Roles = "SYSTEM_ADMIN,STORE_MANAGER,FRANCHISE_OWNER")]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var tenantId = (Guid?)HttpContext.Items["TenantId"];
        if (tenantId == null) return Unauthorized();

        var created = await _productService.CreateProductAsync(tenantId.Value, dto);
        return CreatedAtAction(nameof(GetById), new { id = created.ProductId }, created);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "SYSTEM_ADMIN,STORE_MANAGER,FRANCHISE_OWNER")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var tenantId = (Guid?)HttpContext.Items["TenantId"];
        if (tenantId == null) return Unauthorized();

        var updated = await _productService.UpdateProductAsync(id, tenantId.Value, dto);
        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "SYSTEM_ADMIN,STORE_MANAGER")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var tenantId = (Guid?)HttpContext.Items["TenantId"];
        if (tenantId == null) return Unauthorized();

        var success = await _productService.DeleteProductAsync(id, tenantId.Value);
        return success ? NoContent() : NotFound();
    }
}
