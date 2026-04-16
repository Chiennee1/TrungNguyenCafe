using backend.Data;
using backend.DTOs.Customer;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/customers")]
[Authorize]
public class CustomerController : ControllerBase
{
    private readonly AppDbContext _context;

    public CustomerController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search)
    {
        var query = _context.Customers.AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(c => c.SFullName.Contains(search) || c.SPhone.Contains(search));

        var list = await query.AsNoTracking().OrderBy(c => c.SFullName).ToListAsync();
        return Ok(list.Select(MapToDto));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var c = await _context.Customers.AsNoTracking().FirstOrDefaultAsync(x => x.CustomerId == id);
        return c == null ? NotFound() : Ok(MapToDto(c));
    }

    [HttpGet("phone/{phone}")]
    public async Task<IActionResult> GetByPhone(string phone)
    {
        var c = await _context.Customers.AsNoTracking().FirstOrDefaultAsync(x => x.SPhone == phone);
        return c == null ? NotFound() : Ok(MapToDto(c));
    }

    [HttpPost]
    [Authorize(Roles = "STAFF_POS,STORE_MANAGER,SYSTEM_ADMIN")]
    public async Task<IActionResult> Create([FromBody] CreateCustomerDto dto)
    {
        if (await _context.Customers.AnyAsync(c => c.SPhone == dto.Phone))
            return Conflict(new { message = "Số điện thoại đã được đăng ký." });

        var customer = new Customer
        {
            SFullName = dto.FullName,
            SPhone = dto.Phone,
            SEmail = dto.Email
        };

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = customer.CustomerId }, MapToDto(customer));
    }

    private static CustomerResponseDto MapToDto(Customer c) => new()
    {
        CustomerId = c.CustomerId, FullName = c.SFullName, Phone = c.SPhone,
        Email = c.SEmail, LoyaltyPoint = c.ILoyaltyPoint,
        MemberLevel = c.SMemberLevel, RegisteredAt = c.DRegisteredAt
    };
}
