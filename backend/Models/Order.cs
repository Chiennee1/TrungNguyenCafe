using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Order
{
    public Guid OrderId { get; set; }
    public Guid TenantId { get; set; }
    public Guid UserId { get; set; }
    public Guid? CustomerId { get; set; }
    public byte IStatus { get; set; } = 0;
    // 0=Pending, 1=Paid, 2=Preparing, 3=Ready, 4=Failed
    [Column(TypeName = "decimal(12,2)")]
    public decimal FTotal { get; set; } = 0;
    [Required, MaxLength(20)]
    public string SPaymentMethod { get; set; } = "CASH"; // CASH | VNPAY | MOMO | ZALOPAY | CARD
    [MaxLength(200)]
    public string? SNote { get; set; }
    public DateTime DCreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DPaidAt { get; set; }

    // Navigation
    public Tenant Tenant { get; set; } = null!;
    public User User { get; set; } = null!;
    public Customer? Customer { get; set; }
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    public ICollection<StockHistory> StockHistories { get; set; } = new List<StockHistory>();
    public ICollection<LoyaltyHistory> LoyaltyHistories { get; set; } = new List<LoyaltyHistory>();
    public ICollection<PaymentTransaction> PaymentTransactions { get; set; } = new List<PaymentTransaction>();
}
