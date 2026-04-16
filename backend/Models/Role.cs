using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Role
{
    public Guid RoleId { get; set; }
    [Required, MaxLength(30)]
    public string SRoleName { get; set; } = string.Empty;
    [MaxLength(200)]
    public string? SDescription { get; set; }

    // Navigation
    public ICollection<User> Users { get; set; } = new List<User>();
}
