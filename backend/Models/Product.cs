using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Product
{
    public Guid ProductId { get; set; }
    public Guid TenantId { get; set; }
    public Guid? CategoryId { get; set; }
    [Required, MaxLength(100)]
    public string SProductName { get; set; } = string.Empty;
    [MaxLength(300)]
    public string? SDescription { get; set; }
    [Column(TypeName = "decimal(12,2)")]
    public decimal FPrice { get; set; }
    public byte IStatus { get; set; } = 1; // 0=Ngừng bán, 1=Đang bán
    public DateTime DCreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Tenant Tenant { get; set; } = null!;
    public Category? Category { get; set; }
    public ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
