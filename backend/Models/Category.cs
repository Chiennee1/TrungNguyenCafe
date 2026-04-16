using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Category
{
    public Guid CategoryId { get; set; }
    [Required, MaxLength(80)]
    public string SCategoryName { get; set; } = string.Empty;
    [MaxLength(200)]
    public string? SDescription { get; set; }

    // Navigation
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
