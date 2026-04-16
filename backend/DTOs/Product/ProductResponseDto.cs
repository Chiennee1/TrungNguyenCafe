namespace backend.DTOs.Product;

public class ProductResponseDto
{
    public Guid ProductId { get; set; }
    public Guid TenantId { get; set; }
    public Guid? CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int Status { get; set; }
    public string StatusText => Status == 1 ? "Đang bán" : "Ngừng bán";
    public DateTime CreatedAt { get; set; }
}
