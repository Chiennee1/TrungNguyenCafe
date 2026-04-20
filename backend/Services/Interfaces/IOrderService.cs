using backend.DTOs.Order;

namespace backend.Services.Interfaces;

public interface IOrderService
{
    Task<IEnumerable<OrderResponseDto>> GetOrdersAsync(Guid? tenantId, DateTime? from, DateTime? to, byte? status, string? paymentMethod, int page, int pageSize);
    Task<IEnumerable<OrderResponseDto>> GetOrdersByStatusAsync(Guid tenantId, byte status);
    Task<OrderResponseDto?> GetOrderByIdAsync(Guid orderId, Guid tenantId);
    Task<OrderResponseDto> CreateOrderAsync(Guid tenantId, Guid userId, CreateOrderDto dto);
    Task<OrderResponseDto?> UpdateOrderStatusAsync(Guid orderId, Guid tenantId, byte newStatus);
}
