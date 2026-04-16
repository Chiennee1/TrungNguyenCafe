namespace backend.DTOs.Order;

public class OrderItemResponseDto
{
    public Guid OrderItemId { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Subtotal => Quantity * UnitPrice;
}

public class OrderResponseDto
{
    public Guid OrderId { get; set; }
    public Guid TenantId { get; set; }
    public int Status { get; set; }
    public string StatusText => Status switch
    {
        0 => "Pending",
        1 => "Paid",
        2 => "Preparing",
        3 => "Ready",
        4 => "Failed",
        _ => "Unknown"
    };
    public decimal Total { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? PaidAt { get; set; }
    public string CashierName { get; set; } = string.Empty;
    public string? CustomerName { get; set; }
    public string? CustomerPhone { get; set; }
    public List<OrderItemResponseDto> Items { get; set; } = new();
}
