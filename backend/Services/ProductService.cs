using backend.Data;
using backend.DTOs.Product;
using backend.Models;
using backend.Repositories;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _context;
    private readonly ProductRepository _productRepo;

    public ProductService(AppDbContext context, ProductRepository productRepo)
    {
        _context = context;
        _productRepo = productRepo;
    }

    public async Task<IEnumerable<ProductResponseDto>> GetProductsByTenantAsync(Guid tenantId, bool activeOnly = true)
    {
        var products = await _productRepo.GetProductsByTenantAsync(tenantId, activeOnly);
        return products.Select(MapToDto);
    }

    public async Task<ProductResponseDto?> GetProductByIdAsync(Guid productId)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.ProductId == productId);
        return product == null ? null : MapToDto(product);
    }

    public async Task<ProductResponseDto> CreateProductAsync(Guid tenantId, CreateProductDto dto)
    {
        var product = new Product
        {
            TenantId = tenantId,
            CategoryId = dto.CategoryId,
            SProductName = dto.Name,
            SDescription = dto.Description,
            FPrice = dto.Price,
            IStatus = 1
        };

        await _productRepo.AddAsync(product);
        await _productRepo.SaveChangesAsync();

        // Re-fetch with Category
        var created = await _context.Products
            .Include(p => p.Category)
            .FirstAsync(p => p.ProductId == product.ProductId);
        return MapToDto(created);
    }

    public async Task<ProductResponseDto?> UpdateProductAsync(Guid productId, Guid tenantId, UpdateProductDto dto)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.ProductId == productId && p.TenantId == tenantId);

        if (product == null) return null;

        product.CategoryId = dto.CategoryId;
        product.SProductName = dto.Name;
        product.SDescription = dto.Description;
        product.FPrice = dto.Price;
        product.IStatus = dto.Status;

        await _context.SaveChangesAsync();
        return MapToDto(product);
    }

    public async Task<bool> DeleteProductAsync(Guid productId, Guid tenantId)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.ProductId == productId && p.TenantId == tenantId);
        if (product == null) return false;

        // Soft-delete: mark as inactive
        product.IStatus = 0;
        await _context.SaveChangesAsync();
        return true;
    }

    private static ProductResponseDto MapToDto(Product p) => new()
    {
        ProductId = p.ProductId,
        TenantId = p.TenantId,
        CategoryId = p.CategoryId,
        CategoryName = p.Category?.SCategoryName ?? string.Empty,
        Name = p.SProductName,
        Description = p.SDescription,
        Price = p.FPrice,
        Status = p.IStatus,
        CreatedAt = p.DCreatedAt
    };
}
