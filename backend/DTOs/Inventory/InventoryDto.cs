using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Inventory;

public class IngredientResponseDto
{
    public Guid IngredientId { get; set; }
    public Guid TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public decimal StockQuantity { get; set; }
    public decimal AlertThreshold { get; set; }
    public decimal UnitCost { get; set; }
    public bool IsLow => StockQuantity <= AlertThreshold;
    public DateTime UpdatedAt { get; set; }
}

public class ImportStockDto
{
    [Required]
    public Guid IngredientId { get; set; }
    [Required, Range(0.001, double.MaxValue)]
    public decimal Amount { get; set; }
    [Range(0.001, double.MaxValue)]
    public decimal? UnitPrice { get; set; }
    [MaxLength(200)]
    public string? Note { get; set; }
}

public class StockHistoryResponseDto
{
    public Guid HistoryId { get; set; }
    public Guid IngredientId { get; set; }
    public string IngredientName { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public decimal ChangeAmount { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalValue { get; set; }
    public string Type { get; set; } = string.Empty;
    public string? Note { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class InventoryStatsDto
{
    public int TotalItems { get; set; }
    public int LowStockItems { get; set; }
    public decimal ImportedAmountThisMonth { get; set; }
    public int ImportTransactionsThisMonth { get; set; }
}
