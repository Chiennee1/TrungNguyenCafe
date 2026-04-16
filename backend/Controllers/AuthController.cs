using backend.DTOs.Auth;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var result = await _authService.LoginAsync(dto.Email, dto.Password, ipAddress);

        if (result == null)
            return Unauthorized(new { message = "Sai email hoặc mật khẩu." });

        return Ok(result);
    }

    /// <summary>Đăng ký tài khoản và Tenant mới</summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var success = await _authService.RegisterAsync(dto);
        if (!success)
            return BadRequest(new { message = "Đăng ký thất bại. Email có thể đã tồn tại hoặc lỗi hệ thống." });

        return Ok(new { message = "Đăng ký thành công" });
    }

    [HttpGet("me")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public IActionResult Me()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var tenantId = User.FindFirst("TenantId")?.Value;
        var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
        var name = User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value;
        return Ok(new { userId, tenantId, role, name });
    }
}
