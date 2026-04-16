namespace backend.DTOs.Customer;

public class CustomerResponseDto
{
    public Guid CustomerId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public int LoyaltyPoint { get; set; }
    public string MemberLevel { get; set; } = string.Empty;
    public DateTime RegisteredAt { get; set; }
}

public class CreateCustomerDto
{
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
}
