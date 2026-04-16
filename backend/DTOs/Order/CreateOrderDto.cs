using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Order;

public class OrderItemDto
{
    [Required]
    public Guid ProductId { get; set; }
    [Range(1, 100)]
    public int Quantity { get; set; } = 1;
}

public class CreateOrderDto
{
    public Guid? CustomerId { get; set; }
    [Required]
    public string PaymentMethod { get; set; } = "CASH"; // CASH | VNPAY | MOMO | ZALOPAY | CARD
    public string? Note { get; set; }
    [Required, MinLength(1)]
    public List<OrderItemDto> Items { get; set; } = new();
}
