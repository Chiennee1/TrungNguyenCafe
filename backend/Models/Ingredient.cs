using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Ingredient
{
    public Guid IngredientId { get; set; }
    public Guid TenantId { get; set; }
    [Required, MaxLength(100)]
    public string SIngredientName { get; set; } = string.Empty;
    [Required, MaxLength(20)]
    public string SUnit { get; set; } = string.Empty; // gram, ml, chiếc, gói
    [Column(TypeName = "decimal(12,3)")]
    public decimal FStockQuantity { get; set; } = 0;
    [Column(TypeName = "decimal(12,3)")]
    public decimal FAlertThreshold { get; set; } = 0;
    public DateTime DUpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Tenant Tenant { get; set; } = null!;
    public ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();
    public ICollection<StockHistory> StockHistories { get; set; } = new List<StockHistory>();
}
