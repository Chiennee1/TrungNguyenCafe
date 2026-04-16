using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.User;

public class CreateUserDto
{
    [Required]
    public Guid RoleId { get; set; }
    [Required, MaxLength(100)]
    public string FullName { get; set; } = string.Empty;
    [Required, EmailAddress, MaxLength(150)]
    public string Email { get; set; } = string.Empty;
    [Required, MinLength(6), MaxLength(50)]
    public string Password { get; set; } = string.Empty;
    [MaxLength(15)]
    public string? Phone { get; set; }
}

public class UserResponseDto
{
    public Guid UserId { get; set; }
    public Guid TenantId { get; set; }
    public string TenantName { get; set; } = string.Empty;
    public Guid RoleId { get; set; }
    public string RoleName { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public int Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLogin { get; set; }
}
