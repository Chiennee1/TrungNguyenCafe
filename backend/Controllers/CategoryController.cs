using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/categories")]
[Authorize]
public class CategoryController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoryController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _context.Categories.AsNoTracking().OrderBy(c => c.SCategoryName).ToListAsync();
        return Ok(categories.Select(c => new { c.CategoryId, Name = c.SCategoryName, c.SDescription }));
    }

    [HttpPost]
    [Authorize(Roles = "SYSTEM_ADMIN,STORE_MANAGER,FRANCHISE_OWNER")]
    public async Task<IActionResult> Create([FromBody] Category dto)
    {
        dto.CategoryId = Guid.NewGuid();
        _context.Categories.Add(dto);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = dto.CategoryId }, dto);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "SYSTEM_ADMIN,STORE_MANAGER,FRANCHISE_OWNER")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Category dto)
    {
        var cat = await _context.Categories.FindAsync(id);
        if (cat == null) return NotFound();
        cat.SCategoryName = dto.SCategoryName;
        cat.SDescription = dto.SDescription;
        await _context.SaveChangesAsync();
        return Ok(cat);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "SYSTEM_ADMIN")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var cat = await _context.Categories.FindAsync(id);
        if (cat == null) return NotFound();
        _context.Categories.Remove(cat);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
