using backend.DTOs.Inventory;

namespace backend.Services.Interfaces;

public interface IInventoryService
{
    Task<IEnumerable<IngredientResponseDto>> GetIngredientsByTenantAsync(Guid tenantId);
    Task<IEnumerable<IngredientResponseDto>> GetLowStockAsync(Guid tenantId);
    Task<IngredientResponseDto?> ImportStockAsync(Guid tenantId, Guid userId, ImportStockDto dto);
    Task<IngredientResponseDto?> ExportStockAsync(Guid tenantId, Guid userId, ImportStockDto dto);
    Task<IEnumerable<StockHistoryResponseDto>> GetStockHistoryByTenantAsync(Guid tenantId, int take = 100);
    Task<InventoryStatsDto> GetInventoryStatsAsync(Guid tenantId);
}
