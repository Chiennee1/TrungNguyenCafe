using backend.DTOs.Report;

namespace backend.Services.Interfaces;

public interface IReportService
{
    Task<RevenueReportDto> GetRevenueReportAsync(Guid? tenantId, DateTime from, DateTime to);
}
