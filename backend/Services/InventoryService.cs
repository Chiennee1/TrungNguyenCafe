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

    public async Task<IngredientResponseDto?> ExportStockAsync(Guid tenantId, Guid userId, ImportStockDto dto)
    {
        var ingredient = await _context.Ingredients
            .FirstOrDefaultAsync(i => i.IngredientId == dto.IngredientId && i.TenantId == tenantId);
        if (ingredient == null) return null;

        if (ingredient.FStockQuantity < dto.Amount)
            throw new InvalidOperationException("Số lượng xuất vượt quá tồn kho hiện tại.");

        ingredient.FStockQuantity -= dto.Amount;
        ingredient.DUpdatedAt = DateTime.UtcNow;

        _context.StockHistories.Add(new StockHistory
        {
            TenantId = tenantId,
            IngredientId = dto.IngredientId,
            FChangeAmount = -dto.Amount,
            SType = "DEDUCT",
            SNote = dto.Note ?? "Xuất kho thủ công",
            UserId = userId
        });

        await _context.SaveChangesAsync();
        return MapToDto(ingredient);
    }

    public async Task<IEnumerable<StockHistoryResponseDto>> GetStockHistoryByTenantAsync(Guid tenantId, int take = 100)
    {
        var safeTake = Math.Clamp(take, 1, 500);

        return await _context.StockHistories
            .Where(s => s.TenantId == tenantId)
            .Include(s => s.Ingredient)
            .Include(s => s.User)
            .OrderByDescending(s => s.DCreatedAt)
            .Take(safeTake)
            .AsNoTracking()
            .Select(s => new StockHistoryResponseDto
            {
                HistoryId = s.HistoryId,
                IngredientId = s.IngredientId,
                IngredientName = s.Ingredient.SIngredientName,
                Unit = s.Ingredient.SUnit,
                ChangeAmount = s.FChangeAmount,
                Type = s.SType,
                Note = s.SNote,
                UserId = s.UserId,
                UserName = s.User.SFullName,
                CreatedAt = s.DCreatedAt
            })
            .ToListAsync();
    }

    public async Task<InventoryStatsDto> GetInventoryStatsAsync(Guid tenantId)
    {
        var firstDayOfMonthUtc = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);

        var totalItems = await _context.Ingredients
            .Where(i => i.TenantId == tenantId)
            .CountAsync();

        var lowStockItems = await _context.Ingredients
            .Where(i => i.TenantId == tenantId && i.FStockQuantity <= i.FAlertThreshold)
            .CountAsync();

        var importQuery = _context.StockHistories
            .Where(s => s.TenantId == tenantId && s.SType == "IMPORT" && s.DCreatedAt >= firstDayOfMonthUtc);

        var importedAmountThisMonth = await importQuery
            .SumAsync(s => (decimal?)s.FChangeAmount) ?? 0m;

        var importTransactionsThisMonth = await importQuery.CountAsync();

        return new InventoryStatsDto
        {
            TotalItems = totalItems,
            LowStockItems = lowStockItems,
            ImportedAmountThisMonth = importedAmountThisMonth,
            ImportTransactionsThisMonth = importTransactionsThisMonth
        };
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
