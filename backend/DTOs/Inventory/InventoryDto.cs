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
    public bool IsLow => StockQuantity <= AlertThreshold;
    public DateTime UpdatedAt { get; set; }
}

public class ImportStockDto
{
    [Required]
    public Guid IngredientId { get; set; }
    [Required, Range(0.001, double.MaxValue)]
    public decimal Amount { get; set; }
    [MaxLength(200)]
    public string? Note { get; set; }
}
