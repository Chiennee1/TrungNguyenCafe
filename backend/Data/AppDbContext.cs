using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Tenant> Tenants { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Ingredient> Ingredients { get; set; }
    public DbSet<Recipe> Recipes { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<StockHistory> StockHistories { get; set; }
    public DbSet<LoyaltyHistory> LoyaltyHistories { get; set; }
    public DbSet<PaymentTransaction> PaymentTransactions { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── tbl_Tenant ─────────────────────────────────────────────────────────
        modelBuilder.Entity<Tenant>(e =>
        {
            e.ToTable("tbl_Tenant");
            e.HasKey(t => t.TenantId);
            e.Property(t => t.TenantId).HasColumnName("TenantId").HasDefaultValueSql("NEWSEQUENTIALID()");
            e.Property(t => t.STenantName).HasColumnName("sTenantName").HasMaxLength(150).IsRequired();
            e.Property(t => t.SAddress).HasColumnName("sAddress").HasMaxLength(300).IsRequired();
            e.Property(t => t.SPhone).HasColumnName("sPhone").HasMaxLength(15).IsRequired().IsUnicode(false);
            e.Property(t => t.SEmail).HasColumnName("sEmail").HasMaxLength(150).IsUnicode(false);
            e.Property(t => t.SFranchiseType).HasColumnName("sFranchiseType").HasMaxLength(20).IsRequired().IsUnicode(false).HasDefaultValue("FRANCHISE");
            e.Property(t => t.IStatus).HasColumnName("iStatus").HasDefaultValue((byte)1);
            e.Property(t => t.DCreatedAt).HasColumnName("dCreatedAt").HasDefaultValueSql("SYSDATETIME()");
        });

        // ── tbl_Role ───────────────────────────────────────────────────────────
        modelBuilder.Entity<Role>(e =>
        {
            e.ToTable("tbl_Role");
            e.HasKey(r => r.RoleId);
            e.Property(r => r.RoleId).HasColumnName("RoleId").HasDefaultValueSql("NEWSEQUENTIALID()");
            e.Property(r => r.SRoleName).HasColumnName("sRoleName").HasMaxLength(30).IsRequired().IsUnicode(false);
            e.Property(r => r.SDescription).HasColumnName("sDescription").HasMaxLength(200);
            e.HasIndex(r => r.SRoleName).IsUnique();
        });

        // ── tbl_User ───────────────────────────────────────────────────────────
        modelBuilder.Entity<User>(e =>
        {
            e.ToTable("tbl_User");
            e.HasKey(u => u.UserId);
            e.Property(u => u.UserId).HasColumnName("UserId").HasDefaultValueSql("NEWSEQUENTIALID()");
            e.Property(u => u.TenantId).HasColumnName("TenantId");
            e.Property(u => u.RoleId).HasColumnName("RoleId");
            e.Property(u => u.SFullName).HasColumnName("sFullName").HasMaxLength(100).IsRequired();
            e.Property(u => u.SEmail).HasColumnName("sEmail").HasMaxLength(150).IsRequired().IsUnicode(false);
            e.Property(u => u.SPasswordHash).HasColumnName("sPasswordHash").HasMaxLength(256).IsRequired().IsUnicode(false);
            e.Property(u => u.SPhone).HasColumnName("sPhone").HasMaxLength(15).IsUnicode(false);
            e.Property(u => u.IStatus).HasColumnName("iStatus").HasDefaultValue((byte)1);
            e.Property(u => u.DCreatedAt).HasColumnName("dCreatedAt").HasDefaultValueSql("SYSDATETIME()");
            e.Property(u => u.DLastLogin).HasColumnName("dLastLogin");
            e.HasIndex(u => u.SEmail).IsUnique();
            e.HasOne(u => u.Tenant).WithMany(t => t.Users).HasForeignKey(u => u.TenantId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(u => u.Role).WithMany(r => r.Users).HasForeignKey(u => u.RoleId).OnDelete(DeleteBehavior.Restrict);
        });

        // ── tbl_Customer ───────────────────────────────────────────────────────
        modelBuilder.Entity<Customer>(e =>
        {
            e.ToTable("tbl_Customer");
            e.HasKey(c => c.CustomerId);
            e.Property(c => c.CustomerId).HasColumnName("CustomerId").HasDefaultValueSql("NEWSEQUENTIALID()");
            e.Property(c => c.SFullName).HasColumnName("sFullName").HasMaxLength(100).IsRequired();
            e.Property(c => c.SPhone).HasColumnName("sPhone").HasMaxLength(15).IsRequired().IsUnicode(false);
            e.Property(c => c.SEmail).HasColumnName("sEmail").HasMaxLength(150).IsUnicode(false);
            e.Property(c => c.ILoyaltyPoint).HasColumnName("iLoyaltyPoint").HasDefaultValue(0);
            e.Property(c => c.SMemberLevel).HasColumnName("sMemberLevel").HasMaxLength(10).IsRequired().IsUnicode(false).HasDefaultValue("BRONZE");
            e.Property(c => c.DRegisteredAt).HasColumnName("dRegisteredAt").HasDefaultValueSql("SYSDATETIME()");
            e.HasIndex(c => c.SPhone).IsUnique();
        });

        // ── tbl_Category ───────────────────────────────────────────────────────
        modelBuilder.Entity<Category>(e =>
        {
            e.ToTable("tbl_Category");
            e.HasKey(c => c.CategoryId);
            e.Property(c => c.CategoryId).HasColumnName("CategoryId").HasDefaultValueSql("NEWSEQUENTIALID()");
            e.Property(c => c.SCategoryName).HasColumnName("sCategoryName").HasMaxLength(80).IsRequired();
            e.Property(c => c.SDescription).HasColumnName("sDescription").HasMaxLength(200);
        });

        // ── tbl_Product ────────────────────────────────────────────────────────
        modelBuilder.Entity<Product>(e =>
        {
            e.ToTable("tbl_Product");
            e.HasKey(p => p.ProductId);
            e.Property(p => p.ProductId).HasColumnName("ProductId").HasDefaultValueSql("NEWSEQUENTIALID()");
            e.Property(p => p.TenantId).HasColumnName("TenantId");
            e.Property(p => p.CategoryId).HasColumnName("CategoryId");
            e.Property(p => p.SProductName).HasColumnName("sProductName").HasMaxLength(100).IsRequired();
            e.Property(p => p.SDescription).HasColumnName("sDescription").HasMaxLength(300);
            e.Property(p => p.FPrice).HasColumnName("fPrice").HasColumnType("decimal(12,2)");
            e.Property(p => p.IStatus).HasColumnName("iStatus").HasDefaultValue((byte)1);
            e.Property(p => p.DCreatedAt).HasColumnName("dCreatedAt").HasDefaultValueSql("SYSDATETIME()");
            e.HasOne(p => p.Tenant).WithMany(t => t.Products).HasForeignKey(p => p.TenantId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(p => p.Category).WithMany(c => c.Products).HasForeignKey(p => p.CategoryId).OnDelete(DeleteBehavior.SetNull);
        });

        // ── tbl_Ingredient ─────────────────────────────────────────────────────
        modelBuilder.Entity<Ingredient>(e =>
        {
            e.ToTable("tbl_Ingredient");
            e.HasKey(i => i.IngredientId);
            e.Property(i => i.IngredientId).HasColumnName("IngredientId").HasDefaultValueSql("NEWSEQUENTIALID()");
            e.Property(i => i.TenantId).HasColumnName("TenantId");
            e.Property(i => i.SIngredientName).HasColumnName("sIngredientName").HasMaxLength(100).IsRequired();
            e.Property(i => i.SUnit).HasColumnName("sUnit").HasMaxLength(20).IsRequired();
            e.Property(i => i.FStockQuantity).HasColumnName("fStockQuantity").HasColumnType("decimal(12,3)").HasDefaultValue(0m);
            e.Property(i => i.FAlertThreshold).HasColumnName("fAlertThreshold").HasColumnType("decimal(12,3)").HasDefaultValue(0m);
            e.Property(i => i.FUnitCost).HasColumnName("fUnitCost").HasColumnType("decimal(12,2)").HasDefaultValue(0m);
            e.Property(i => i.DUpdatedAt).HasColumnName("dUpdatedAt").HasDefaultValueSql("SYSDATETIME()");
            e.HasOne(i => i.Tenant).WithMany(t => t.Ingredients).HasForeignKey(i => i.TenantId).OnDelete(DeleteBehavior.Restrict);
        });

        // ── tbl_Recipe ─────────────────────────────────────────────────────────
        modelBuilder.Entity<Recipe>(e =>
        {
            e.ToTable("tbl_Recipe");
            e.HasKey(r => r.RecipeId);
            e.Property(r => r.RecipeId).HasColumnName("RecipeId").HasDefaultValueSql("NEWSEQUENTIALID()");
            e.Property(r => r.ProductId).HasColumnName("ProductId");
            e.Property(r => r.IngredientId).HasColumnName("IngredientId");
            e.Property(r => r.FAmountRequired).HasColumnName("fAmountRequired").HasColumnType("decimal(10,3)");
            e.Property(r => r.SNote).HasColumnName("sNote").HasMaxLength(100);
            e.HasIndex(r => new { r.ProductId, r.IngredientId }).IsUnique();
            e.HasOne(r => r.Product).WithMany(p => p.Recipes).HasForeignKey(r => r.ProductId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(r => r.Ingredient).WithMany(i => i.Recipes).HasForeignKey(r => r.IngredientId).OnDelete(DeleteBehavior.Restrict);
        });

        // ── tbl_Order ──────────────────────────────────────────────────────────
        modelBuilder.Entity<Order>(e =>
        {
            e.ToTable("tbl_Order");
            e.HasKey(o => o.OrderId);
            e.Property(o => o.OrderId).HasColumnName("OrderId").HasDefaultValueSql("NEWSEQUENTIALID()");
            e.Property(o => o.TenantId).HasColumnName("TenantId");
            e.Property(o => o.UserId).HasColumnName("UserId");
            e.Property(o => o.CustomerId).HasColumnName("CustomerId");
            e.Property(o => o.IStatus).HasColumnName("iStatus").HasDefaultValue((byte)0);
            e.Property(o => o.FTotal).HasColumnName("fTotal").HasColumnType("decimal(12,2)").HasDefaultValue(0m);
            e.Property(o => o.SPaymentMethod).HasColumnName("sPaymentMethod").HasMaxLength(20).IsRequired().IsUnicode(false).HasDefaultValue("CASH");
            e.Property(o => o.SNote).HasColumnName("sNote").HasMaxLength(200);
            e.Property(o => o.DCreatedAt).HasColumnName("dCreatedAt").HasDefaultValueSql("SYSDATETIME()");
            e.Property(o => o.DPaidAt).HasColumnName("dPaidAt");
            e.HasOne(o => o.Tenant).WithMany(t => t.Orders).HasForeignKey(o => o.TenantId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(o => o.User).WithMany(u => u.Orders).HasForeignKey(o => o.UserId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(o => o.Customer).WithMany(c => c.Orders).HasForeignKey(o => o.CustomerId).OnDelete(DeleteBehavior.SetNull);
        });

        // ── tbl_OrderItem ──────────────────────────────────────────────────────
        modelBuilder.Entity<OrderItem>(e =>
        {
            e.ToTable("tbl_OrderItem");
            e.HasKey(oi => oi.OrderItemId);
            e.Property(oi => oi.OrderItemId).HasColumnName("OrderItemId").HasDefaultValueSql("NEWSEQUENTIALID()");
            e.Property(oi => oi.OrderId).HasColumnName("OrderId");
            e.Property(oi => oi.ProductId).HasColumnName("ProductId");
            e.Property(oi => oi.IQuantity).HasColumnName("iQuantity");
            e.Property(oi => oi.FUnitPrice).HasColumnName("fUnitPrice").HasColumnType("decimal(12,2)");
            e.HasOne(oi => oi.Order).WithMany(o => o.Items).HasForeignKey(oi => oi.OrderId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(oi => oi.Product).WithMany(p => p.OrderItems).HasForeignKey(oi => oi.ProductId).OnDelete(DeleteBehavior.Restrict);
        });

        // ── tbl_StockHistory ───────────────────────────────────────────────────
        modelBuilder.Entity<StockHistory>(e =>
        {
            e.ToTable("tbl_StockHistory");
            e.HasKey(s => s.HistoryId);
            e.Property(s => s.HistoryId).HasColumnName("HistoryId").HasDefaultValueSql("NEWSEQUENTIALID()");
            e.Property(s => s.TenantId).HasColumnName("TenantId");
            e.Property(s => s.IngredientId).HasColumnName("IngredientId");
            e.Property(s => s.OrderId).HasColumnName("OrderId");
            e.Property(s => s.FChangeAmount).HasColumnName("fChangeAmount").HasColumnType("decimal(12,3)");
            e.Property(s => s.FUnitPrice).HasColumnName("fUnitPrice").HasColumnType("decimal(12,2)").HasDefaultValue(0m);
            e.Property(s => s.FTotalValue).HasColumnName("fTotalValue").HasColumnType("decimal(14,2)").HasDefaultValue(0m);
            e.Property(s => s.SType).HasColumnName("sType").HasMaxLength(10).IsRequired().IsUnicode(false);
            e.Property(s => s.SNote).HasColumnName("sNote").HasMaxLength(200);
            e.Property(s => s.UserId).HasColumnName("UserId");
            e.Property(s => s.DCreatedAt).HasColumnName("dCreatedAt").HasDefaultValueSql("SYSDATETIME()");
            e.HasOne(s => s.Tenant).WithMany().HasForeignKey(s => s.TenantId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(s => s.Ingredient).WithMany(i => i.StockHistories).HasForeignKey(s => s.IngredientId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(s => s.Order).WithMany(o => o.StockHistories).HasForeignKey(s => s.OrderId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(s => s.User).WithMany(u => u.StockHistories).HasForeignKey(s => s.UserId).OnDelete(DeleteBehavior.Restrict);
        });

        // ── tbl_LoyaltyHistory ─────────────────────────────────────────────────
        modelBuilder.Entity<LoyaltyHistory>(e =>
        {
            e.ToTable("tbl_LoyaltyHistory");
            e.HasKey(l => l.HistoryId);
            e.Property(l => l.HistoryId).HasColumnName("HistoryId").HasDefaultValueSql("NEWSEQUENTIALID()");
            e.Property(l => l.CustomerId).HasColumnName("CustomerId");
            e.Property(l => l.TenantId).HasColumnName("TenantId");
            e.Property(l => l.OrderId).HasColumnName("OrderId");
            e.Property(l => l.IPointChange).HasColumnName("iPointChange");
            e.Property(l => l.SType).HasColumnName("sType").HasMaxLength(10).IsRequired().IsUnicode(false);
            e.Property(l => l.SNote).HasColumnName("sNote").HasMaxLength(200);
            e.Property(l => l.DCreatedAt).HasColumnName("dCreatedAt").HasDefaultValueSql("SYSDATETIME()");
            e.HasOne(l => l.Customer).WithMany(c => c.LoyaltyHistories).HasForeignKey(l => l.CustomerId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(l => l.Tenant).WithMany().HasForeignKey(l => l.TenantId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(l => l.Order).WithMany(o => o.LoyaltyHistories).HasForeignKey(l => l.OrderId).OnDelete(DeleteBehavior.SetNull);
        });

        // ── tbl_PaymentTransaction ─────────────────────────────────────────────
        modelBuilder.Entity<PaymentTransaction>(e =>
        {
            e.ToTable("tbl_PaymentTransaction");
            e.HasKey(p => p.TransactionId);
            e.Property(p => p.TransactionId).HasColumnName("TransactionId").HasDefaultValueSql("NEWSEQUENTIALID()");
            e.Property(p => p.OrderId).HasColumnName("OrderId");
            e.Property(p => p.TenantId).HasColumnName("TenantId");
            e.Property(p => p.SGateway).HasColumnName("sGateway").HasMaxLength(20).IsRequired().IsUnicode(false);
            e.Property(p => p.SGatewayTransId).HasColumnName("sGatewayTransId").HasMaxLength(100).IsUnicode(false);
            e.Property(p => p.FAmount).HasColumnName("fAmount").HasColumnType("decimal(12,2)");
            e.Property(p => p.IStatus).HasColumnName("iStatus").HasDefaultValue((byte)0);
            e.Property(p => p.SRawResponse).HasColumnName("sRawResponse");
            e.Property(p => p.DCreatedAt).HasColumnName("dCreatedAt").HasDefaultValueSql("SYSDATETIME()");
            e.Property(p => p.DUpdatedAt).HasColumnName("dUpdatedAt");
            e.HasOne(p => p.Order).WithMany(o => o.PaymentTransactions).HasForeignKey(p => p.OrderId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(p => p.Tenant).WithMany().HasForeignKey(p => p.TenantId).OnDelete(DeleteBehavior.Restrict);
        });

        // ── tbl_AuditLog ───────────────────────────────────────────────────────
        modelBuilder.Entity<AuditLog>(e =>
        {
            e.ToTable("tbl_AuditLog");
            e.HasKey(a => a.LogId);
            e.Property(a => a.LogId).HasColumnName("LogId").HasDefaultValueSql("NEWSEQUENTIALID()");
            e.Property(a => a.TenantId).HasColumnName("TenantId");
            e.Property(a => a.UserId).HasColumnName("UserId");
            e.Property(a => a.SAction).HasColumnName("sAction").HasMaxLength(100).IsRequired();
            e.Property(a => a.SEntityName).HasColumnName("sEntityName").HasMaxLength(50).IsUnicode(false);
            e.Property(a => a.SEntityId).HasColumnName("sEntityId").HasMaxLength(50).IsUnicode(false);
            e.Property(a => a.SOldValue).HasColumnName("sOldValue");
            e.Property(a => a.SNewValue).HasColumnName("sNewValue");
            e.Property(a => a.SIpAddress).HasColumnName("sIpAddress").HasMaxLength(45).IsUnicode(false);
            e.Property(a => a.DCreatedAt).HasColumnName("dCreatedAt").HasDefaultValueSql("SYSDATETIME()");
            e.HasOne(a => a.Tenant).WithMany().HasForeignKey(a => a.TenantId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(a => a.User).WithMany(u => u.AuditLogs).HasForeignKey(a => a.UserId).OnDelete(DeleteBehavior.SetNull);
        });
    }
}
