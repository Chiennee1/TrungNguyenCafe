using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class PaymentTransaction
{
    public Guid TransactionId { get; set; }
    public Guid OrderId { get; set; }
    public Guid TenantId { get; set; }
    [Required, MaxLength(20)]
    public string SGateway { get; set; } = string.Empty; // VNPAY | MOMO | ZALOPAY
    [MaxLength(100)]
    public string? SGatewayTransId { get; set; }
    [Column(TypeName = "decimal(12,2)")]
    public decimal FAmount { get; set; }
    public byte IStatus { get; set; } = 0; // 0=Pending, 1=Success, 2=Failed, 3=Timeout
    public string? SRawResponse { get; set; } // JSON response từ gateway
    public DateTime DCreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DUpdatedAt { get; set; }

    // Navigation
    public Order Order { get; set; } = null!;
    public Tenant Tenant { get; set; } = null!;
}
