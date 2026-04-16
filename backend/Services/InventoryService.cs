using backend.Data;
using backend.DTOs.Inventory;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class InventoryService : IInventoryService
{
    private readonly AppDbContext _context;

    public InventoryService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<IngredientResponseDto>> GetIngredientsByTenantAsync(Guid tenantId)
    {
        var ingredients = await _context.Ingredients
            .Where(i => i.TenantId == tenantId)
            .OrderBy(i => i.SIngredientName)
            .AsNoTracking()
            .ToListAsync();
        return ingredients.Select(MapToDto);
    }

    public async Task<IEnumerable<IngredientResponseDto>> GetLowStockAsync(Guid tenantId)
    {
        var ingredients = await _context.Ingredients
            .Where(i => i.TenantId == tenantId && i.FStockQuantity <= i.FAlertThreshold)
            .OrderBy(i => i.FStockQuantity)
            .AsNoTracking()
            .ToListAsync();
        return ingredients.Select(MapToDto);
    }

    public async Task<IngredientResponseDto?> ImportStockAsync(Guid tenantId, Guid userId, ImportStockDto dto)
    {
        var ingredient = await _context.Ingredients
            .FirstOrDefaultAsync(i => i.IngredientId == dto.IngredientId && i.TenantId == tenantId);
        if (ingredient == null) return null;

        ingredient.FStockQuantity += dto.Amount;
        ingredient.DUpdatedAt = DateTime.UtcNow;

        _context.StockHistories.Add(new StockHistory
        {
            TenantId = tenantId,
            IngredientId = dto.IngredientId,
            FChangeAmount = dto.Amount,
            SType = "IMPORT",
            SNote = dto.Note ?? "Nhập kho thủ công",
            UserId = userId
        });

        await _context.SaveChangesAsync();
        return MapToDto(ingredient);
    }

    private static IngredientResponseDto MapToDto(Ingredient i) => new()
    {
        IngredientId = i.IngredientId,
        TenantId = i.TenantId,
        Name = i.SIngredientName,
        Unit = i.SUnit,
        StockQuantity = i.FStockQuantity,
        AlertThreshold = i.FAlertThreshold,
        UpdatedAt = i.DUpdatedAt
    };
}
