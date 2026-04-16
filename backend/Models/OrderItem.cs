using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class OrderItem
{
    public Guid OrderItemId { get; set; }
    public Guid OrderId { get; set; }
    public Guid ProductId { get; set; }
    public int IQuantity { get; set; }
    [Column(TypeName = "decimal(12,2)")]
    public decimal FUnitPrice { get; set; }

    // Navigation
    public Order Order { get; set; } = null!;
    public Product Product { get; set; } = null!;
}
