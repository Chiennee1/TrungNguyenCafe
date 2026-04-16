using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class StockHistory
{
    public Guid HistoryId { get; set; }
    public Guid TenantId { get; set; }
    public Guid IngredientId { get; set; }
    public Guid? OrderId { get; set; }
    [Column(TypeName = "decimal(12,3)")]
    public decimal FChangeAmount { get; set; } // âm=xuất, dương=nhập
    [Required, MaxLength(10)]
    public string SType { get; set; } = "DEDUCT"; // DEDUCT | IMPORT | ADJUST
    [MaxLength(200)]
    public string? SNote { get; set; }
    public Guid UserId { get; set; }
    public DateTime DCreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Tenant Tenant { get; set; } = null!;
    public Ingredient Ingredient { get; set; } = null!;
    public Order? Order { get; set; }
    public User User { get; set; } = null!;
}
