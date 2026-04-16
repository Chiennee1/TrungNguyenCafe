using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Tenant
{
    public Guid TenantId { get; set; }
    [Required, MaxLength(150)]
    public string STenantName { get; set; } = string.Empty;
    [Required, MaxLength(300)]
    public string SAddress { get; set; } = string.Empty;
    [Required, MaxLength(15)]
    public string SPhone { get; set; } = string.Empty;
    [MaxLength(150)]
    public string? SEmail { get; set; }
    [Required, MaxLength(20)]
    public string SFranchiseType { get; set; } = "FRANCHISE"; // HQ | FRANCHISE | COMPANY_OWNED
    public byte IStatus { get; set; } = 1; // 0=Suspended, 1=Active
    public DateTime DCreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<Product> Products { get; set; } = new List<Product>();
    public ICollection<Ingredient> Ingredients { get; set; } = new List<Ingredient>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
