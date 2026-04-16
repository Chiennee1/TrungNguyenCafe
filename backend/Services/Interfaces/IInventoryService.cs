using backend.DTOs.Inventory;

namespace backend.Services.Interfaces;

public interface IInventoryService
{
    Task<IEnumerable<IngredientResponseDto>> GetIngredientsByTenantAsync(Guid tenantId);
    Task<IEnumerable<IngredientResponseDto>> GetLowStockAsync(Guid tenantId);
    Task<IngredientResponseDto?> ImportStockAsync(Guid tenantId, Guid userId, ImportStockDto dto);
}
