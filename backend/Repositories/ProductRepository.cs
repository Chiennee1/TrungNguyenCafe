using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class ProductRepository : GenericRepository<Product>
{
    public ProductRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Product>> GetProductsByTenantAsync(Guid? tenantId, bool activeOnly = true)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .AsQueryable();

        if (tenantId.HasValue)
        {
            query = query.Where(p => p.TenantId == tenantId.Value);
        }

        if (activeOnly) query = query.Where(p => p.IStatus == 1);

        return await query.OrderBy(p => p.Category != null ? p.Category.SCategoryName : "")
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Product?> GetProductWithRecipesAsync(Guid productId)
    {
        return await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Recipes).ThenInclude(r => r.Ingredient)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.ProductId == productId);
    }
}

// Extension method for ordering (avoids null ref)
internal static class ProductExtensions
{
    internal static string SCategoryName_Sort(this Product p)
        => p.Category?.SCategoryName ?? string.Empty;
}
