using System.Security.Claims;

namespace backend.Middleware;

public class TenantMiddleware
{
    private readonly RequestDelegate _next;

    public TenantMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var tenantIdClaim = context.User.FindFirst("TenantId")?.Value;
            var roleClaim = context.User.FindFirst(ClaimTypes.Role)?.Value;
            var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (Guid.TryParse(tenantIdClaim, out var tenantId) && tenantId != Guid.Empty)
                context.Items["TenantId"] = tenantId;

            if (Guid.TryParse(userIdClaim, out var userId))
                context.Items["UserId"] = userId;

            context.Items["UserRole"] = roleClaim ?? string.Empty;
        }

        await _next(context);
    }
}
