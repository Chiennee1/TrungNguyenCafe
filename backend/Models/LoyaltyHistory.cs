using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class LoyaltyHistory
{
    public Guid HistoryId { get; set; }
    public Guid CustomerId { get; set; }
    public Guid TenantId { get; set; }
    public Guid? OrderId { get; set; }
    public int IPointChange { get; set; } // dương=cộng, âm=trừ
    [Required, MaxLength(10)]
    public string SType { get; set; } = "EARN"; // EARN | REDEEM | ADJUST
    [MaxLength(200)]
    public string? SNote { get; set; }
    public DateTime DCreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Customer Customer { get; set; } = null!;
    public Tenant Tenant { get; set; } = null!;
    public Order? Order { get; set; }
}
