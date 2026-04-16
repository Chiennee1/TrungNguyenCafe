using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Auth;

public class RegisterRequestDto
{
    [Required, MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6), MaxLength(100)]
    public string Password { get; set; } = string.Empty;

    [Required, MaxLength(150)]
    public string TenantName { get; set; } = string.Empty;
}
