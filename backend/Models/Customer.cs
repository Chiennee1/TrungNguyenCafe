using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Customer
{
    public Guid CustomerId { get; set; }
    [Required, MaxLength(100)]
    public string SFullName { get; set; } = string.Empty;
    [Required, MaxLength(15)]
    public string SPhone { get; set; } = string.Empty;
    [MaxLength(150)]
    public string? SEmail { get; set; }
    public int ILoyaltyPoint { get; set; } = 0;
    [Required, MaxLength(10)]
    public string SMemberLevel { get; set; } = "BRONZE"; // BRONZE | SILVER | GOLD | PLATINUM
    public DateTime DRegisteredAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<LoyaltyHistory> LoyaltyHistories { get; set; } = new List<LoyaltyHistory>();
}
