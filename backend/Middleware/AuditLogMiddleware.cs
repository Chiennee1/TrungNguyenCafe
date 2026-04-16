using System.Security.Claims;
using backend.Data;
using backend.Models;

namespace backend.Middleware;

public class AuditLogMiddleware
{
    private readonly RequestDelegate _next;
    private static readonly HashSet<string> _auditMethods = new(StringComparer.OrdinalIgnoreCase)
        { "POST", "PUT", "PATCH", "DELETE" };

    public AuditLogMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, AppDbContext dbContext)
    {
        await _next(context);

        // Only log state-changing requests from authenticated users
        if (_auditMethods.Contains(context.Request.Method) &&
            context.User.Identity?.IsAuthenticated == true &&
            context.Response.StatusCode is >= 200 and < 300)
        {
            var tenantIdStr = context.User.FindFirst("TenantId")?.Value;
            var userIdStr   = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role        = context.User.FindFirst(ClaimTypes.Role)?.Value ?? "";

            Guid.TryParse(tenantIdStr, out var tenantId);
            Guid.TryParse(userIdStr, out var userId);

            var log = new AuditLog
            {
                TenantId    = tenantId == Guid.Empty ? null : tenantId,
                UserId      = userId == Guid.Empty ? null : userId,
                SAction     = $"{context.Request.Method} {context.Request.Path}",
                SEntityName = context.Request.Path.Value?.Split('/').Skip(3).FirstOrDefault(),
                SIpAddress  = context.Connection.RemoteIpAddress?.ToString()
            };

            try
            {
                dbContext.AuditLogs.Add(log);
                await dbContext.SaveChangesAsync();
            }
            catch { /* Don't break the response if audit fails */ }
        }
    }
}
