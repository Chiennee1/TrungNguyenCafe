using backend.DTOs.Product;

namespace backend.Services.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductResponseDto>> GetProductsByTenantAsync(Guid? tenantId, bool activeOnly = true);
    Task<ProductResponseDto?> GetProductByIdAsync(Guid productId);
    Task<ProductResponseDto> CreateProductAsync(Guid tenantId, CreateProductDto dto);
    Task<ProductResponseDto?> UpdateProductAsync(Guid productId, Guid tenantId, UpdateProductDto dto);
    Task<bool> DeleteProductAsync(Guid productId, Guid tenantId);
}
