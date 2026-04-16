using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class User
{
    public Guid UserId { get; set; }
    public Guid TenantId { get; set; }
    public Guid RoleId { get; set; }
    [Required, MaxLength(100)]
    public string SFullName { get; set; } = string.Empty;
    [Required, MaxLength(150)]
    public string SEmail { get; set; } = string.Empty;
    [Required, MaxLength(256)]
    public string SPasswordHash { get; set; } = string.Empty;
    [MaxLength(15)]
    public string? SPhone { get; set; }
    public byte IStatus { get; set; } = 1; // 0=Locked, 1=Active
    public DateTime DCreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DLastLogin { get; set; }

    // Navigation
    public Tenant Tenant { get; set; } = null!;
    public Role Role { get; set; } = null!;
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<StockHistory> StockHistories { get; set; } = new List<StockHistory>();
    public ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
}
