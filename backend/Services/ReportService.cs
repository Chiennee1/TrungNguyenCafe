using backend.Data;
using backend.DTOs.Report;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class ReportService : IReportService
{
    private readonly AppDbContext _context;

    public ReportService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<RevenueReportDto> GetRevenueReportAsync(Guid? tenantId, DateTime from, DateTime to)
    {
        var query = _context.Orders
            .Where(o => o.IStatus == 1 && o.DCreatedAt >= from && o.DCreatedAt <= to);

        // SYSTEM_ADMIN & CHAIN_MANAGER có thể xem toàn chuỗi (tenantId = null)
        if (tenantId.HasValue)
            query = query.Where(o => o.TenantId == tenantId.Value);

        var orders = await query
            .Include(o => o.Items)
            .AsNoTracking()
            .ToListAsync();

        // Daily breakdown
        var daily = orders
            .GroupBy(o => o.DCreatedAt.Date)
            .Select(g => new DailyRevenueDto
            {
                Date = g.Key,
                Revenue = g.Sum(o => o.FTotal),
                OrderCount = g.Count()
            })
            .OrderBy(d => d.Date)
            .ToList();

        // Top products
        var topProducts = await _context.OrderItems
            .Include(oi => oi.Product)
            .Where(oi => _context.Orders
                .Where(o => o.IStatus == 1 && o.DCreatedAt >= from && o.DCreatedAt <= to &&
                            (!tenantId.HasValue || o.TenantId == tenantId.Value))
                .Select(o => o.OrderId)
                .Contains(oi.OrderId))
            .GroupBy(oi => new { oi.ProductId, oi.Product.SProductName })
            .Select(g => new TopProductDto
            {
                ProductId = g.Key.ProductId,
                ProductName = g.Key.SProductName,
                TotalQuantity = g.Sum(oi => oi.IQuantity),
                TotalRevenue = g.Sum(oi => oi.IQuantity * oi.FUnitPrice)
            })
            .OrderByDescending(p => p.TotalRevenue)
            .Take(10)
            .AsNoTracking()
            .ToListAsync();

        return new RevenueReportDto
        {
            From = from,
            To = to,
            TotalRevenue = orders.Sum(o => o.FTotal),
            TotalOrders = orders.Count,
            DailyBreakdown = daily,
            TopProducts = topProducts
        };
    }
}
