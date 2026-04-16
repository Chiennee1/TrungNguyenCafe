using backend.DTOs.Auth;

namespace backend.Services.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(string email, string password, string ipAddress);
    Task<bool> RegisterAsync(RegisterRequestDto dto);
}
