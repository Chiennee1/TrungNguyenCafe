using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class AuditLog
{
    public Guid LogId { get; set; }
    public Guid? TenantId { get; set; } // NULL = system-level action
    public Guid? UserId { get; set; }
    [Required, MaxLength(100)]
    public string SAction { get; set; } = string.Empty;
    [MaxLength(50)]
    public string? SEntityName { get; set; }
    [MaxLength(50)]
    public string? SEntityId { get; set; }
    public string? SOldValue { get; set; }
    public string? SNewValue { get; set; }
    [MaxLength(45)]
    public string? SIpAddress { get; set; }
    public DateTime DCreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation (optional, no required nav props to avoid cascade issues)
    public Tenant? Tenant { get; set; }
    public User? User { get; set; }
}
