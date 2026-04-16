using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/reports")]
[Authorize]
public class ReportController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportController(IReportService reportService)
    {
        _reportService = reportService;
    }

    /// <summary>Báo cáo doanh thu – SYSTEM_ADMIN/CHAIN_MANAGER xem toàn chuỗi, các role khác chỉ xem chi nhánh mình</summary>
    [HttpGet("revenue")]
    [Authorize(Roles = "SYSTEM_ADMIN,CHAIN_MANAGER,FRANCHISE_OWNER,STORE_MANAGER")]
    public async Task<IActionResult> GetRevenue(
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to)
    {
        var fromDate = from ?? DateTime.Today.AddDays(-30);
        var toDate   = to ?? DateTime.Today.AddDays(1);

        var role = HttpContext.Items["UserRole"]?.ToString();
        var tenantId = (Guid?)HttpContext.Items["TenantId"];

        // SYSTEM_ADMIN & CHAIN_MANAGER see the entire chain
        Guid? scopedTenantId = (role == "SYSTEM_ADMIN" || role == "CHAIN_MANAGER")
            ? null
            : tenantId;

        var report = await _reportService.GetRevenueReportAsync(scopedTenantId, fromDate, toDate);
        return Ok(report);
    }
}
