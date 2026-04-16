using backend.Data;
using backend.DTOs.Order;
using backend.Models;
using backend.Repositories;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _context;
    private readonly OrderRepository _orderRepo;

    public OrderService(AppDbContext context, OrderRepository orderRepo)
    {
        _context = context;
        _orderRepo = orderRepo;
    }

    public async Task<IEnumerable<OrderResponseDto>> GetOrdersByTenantAsync(
        Guid tenantId, DateTime? from, DateTime? to, int page, int pageSize)
    {
        var orders = await _orderRepo.GetOrdersByTenantAsync(tenantId, from, to, page, pageSize);
        return orders.Select(MapToDto);
    }

    public async Task<IEnumerable<OrderResponseDto>> GetOrdersByStatusAsync(Guid tenantId, byte status)
    {
        var orders = await _orderRepo.GetOrdersByStatusAsync(tenantId, status);
        return orders.Select(MapToDto);
    }

    public async Task<OrderResponseDto?> GetOrderByIdAsync(Guid orderId, Guid tenantId)
    {
        var order = await _orderRepo.GetOrderWithDetailsAsync(orderId);
        if (order == null || order.TenantId != tenantId) return null;
        return MapToDto(order);
    }

    public async Task<OrderResponseDto> CreateOrderAsync(Guid tenantId, Guid userId, CreateOrderDto dto)
    {
        // Validate products belong to the tenant & are active
        var productIds = dto.Items.Select(i => i.ProductId).ToList();
        var products = await _context.Products
            .Where(p => productIds.Contains(p.ProductId) && p.TenantId == tenantId && p.IStatus == 1)
            .ToDictionaryAsync(p => p.ProductId);

        if (products.Count != productIds.Count)
            throw new InvalidOperationException("Một hoặc nhiều sản phẩm không hợp lệ hoặc không thuộc chi nhánh này.");

        var orderItems = dto.Items.Select(i => new OrderItem
        {
            ProductId = i.ProductId,
            IQuantity = i.Quantity,
            FUnitPrice = products[i.ProductId].FPrice
        }).ToList();

        decimal total = orderItems.Sum(i => i.IQuantity * i.FUnitPrice);

        var order = new Order
        {
            TenantId = tenantId,
            UserId = userId,
            CustomerId = dto.CustomerId,
            SPaymentMethod = dto.PaymentMethod,
            SNote = dto.Note,
            FTotal = total,
            IStatus = 0, // Pending
            Items = orderItems
        };

        // If CASH, mark as paid immediately
        if (dto.PaymentMethod == "CASH")
        {
            order.IStatus = 1;
            order.DPaidAt = DateTime.UtcNow;
        }

        await _context.Orders.AddAsync(order);

        // Award loyalty points (50 per order for registered customers)
        if (dto.CustomerId.HasValue)
        {
            var customer = await _context.Customers.FindAsync(dto.CustomerId.Value);
            if (customer != null)
            {
                int pointsEarned = (int)(total / 1000); // 1 point per 1,000 VND
                customer.ILoyaltyPoint += pointsEarned;
                UpdateMemberLevel(customer);

                _context.LoyaltyHistories.Add(new LoyaltyHistory
                {
                    CustomerId = customer.CustomerId,
                    TenantId = tenantId,
                    IPointChange = pointsEarned,
                    SType = "EARN",
                    SNote = $"Tích điểm đơn hàng #{order.OrderId}"
                });
            }
        }

        await _context.SaveChangesAsync();

        var created = await _orderRepo.GetOrderWithDetailsAsync(order.OrderId);
        return MapToDto(created!);
    }

    public async Task<OrderResponseDto?> UpdateOrderStatusAsync(Guid orderId, Guid tenantId, byte newStatus)
    {
        var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId && o.TenantId == tenantId);
        if (order == null) return null;

        order.IStatus = newStatus;
        if (newStatus == 1) order.DPaidAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var updated = await _orderRepo.GetOrderWithDetailsAsync(orderId);
        return MapToDto(updated!);
    }

    private static void UpdateMemberLevel(Customer customer)
    {
        customer.SMemberLevel = customer.ILoyaltyPoint switch
        {
            >= 5000 => "PLATINUM",
            >= 2000 => "GOLD",
            >= 500  => "SILVER",
            _       => "BRONZE"
        };
    }

    private static OrderResponseDto MapToDto(Order o) => new()
    {
        OrderId = o.OrderId,
        TenantId = o.TenantId,
        Status = o.IStatus,
        Total = o.FTotal,
        PaymentMethod = o.SPaymentMethod,
        Note = o.SNote,
        CreatedAt = o.DCreatedAt,
        PaidAt = o.DPaidAt,
        CashierName = o.User?.SFullName ?? string.Empty,
        CustomerName = o.Customer?.SFullName,
        CustomerPhone = o.Customer?.SPhone,
        Items = o.Items.Select(i => new OrderItemResponseDto
        {
            OrderItemId = i.OrderItemId,
            ProductId = i.ProductId,
            ProductName = i.Product?.SProductName ?? string.Empty,
            Quantity = i.IQuantity,
            UnitPrice = i.FUnitPrice
        }).ToList()
    };
}
