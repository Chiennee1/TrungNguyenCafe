using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class OrderRepository : GenericRepository<Order>
{
    public OrderRepository(AppDbContext context) : base(context) { }

    public async Task<Order?> GetOrderWithDetailsAsync(Guid orderId)
    {
        return await _context.Orders
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .Include(o => o.User)
            .Include(o => o.Customer)
            .Include(o => o.Tenant)
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.OrderId == orderId);
    }

    public async Task<IEnumerable<Order>> GetOrdersByTenantAsync(Guid tenantId, DateTime? from = null, DateTime? to = null, int page = 1, int pageSize = 20)
    {
        var query = _context.Orders
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .Include(o => o.Customer)
            .Where(o => o.TenantId == tenantId);

        if (from.HasValue) query = query.Where(o => o.DCreatedAt >= from.Value);
        if (to.HasValue)   query = query.Where(o => o.DCreatedAt <= to.Value);

        return await query
            .OrderByDescending(o => o.DCreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetOrdersByStatusAsync(Guid tenantId, byte status)
    {
        return await _context.Orders
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .Include(o => o.Customer)
            .Where(o => o.TenantId == tenantId && o.IStatus == status)
            .OrderByDescending(o => o.DCreatedAt)
            .AsNoTracking()
            .ToListAsync();
    }
}
