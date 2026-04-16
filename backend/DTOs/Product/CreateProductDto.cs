using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Product;

public class CreateProductDto
{
    public Guid? CategoryId { get; set; }
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    [MaxLength(300)]
    public string? Description { get; set; }
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }
}

public class UpdateProductDto : CreateProductDto
{
    public byte Status { get; set; } = 1;
}
