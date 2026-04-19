import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Coffee, 
  ShoppingCart, 
  Package, 
  ReceiptText,
  Users, 
  Store, 
  BarChart3, 
  Bell,
  Settings,
  LogOut,
  Building2,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { cn } from '../../utils/cn';

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const { isSidebarOpen, closeSidebar } = useUIStore();
  const location = useLocation();

  const navItems = [
    { name: 'Tổng Quan', path: '/dashboard', icon: LayoutDashboard, roles: ['SYSTEM_ADMIN', 'CHAIN_MANAGER', 'FRANCHISE_OWNER', 'STORE_MANAGER'] },
    { name: 'POS Bán Hàng', path: '/pos', icon: ShoppingCart, roles: ['STAFF_POS', 'STORE_MANAGER'] },
    { name: 'Đơn Hàng', path: '/orders', icon: ReceiptText, roles: ['STORE_MANAGER', 'SYSTEM_ADMIN', 'CHAIN_MANAGER', 'FRANCHISE_OWNER', 'BARISTA'] },
    { name: 'Quản Lý Menu', path: '/products', icon: Package, roles: ['STORE_MANAGER', 'SYSTEM_ADMIN'] },
    { name: 'Kho Nguyên Liệu', path: '/inventory', icon: Store, roles: ['WAREHOUSE', 'STORE_MANAGER'] },
    { name: 'Báo Cáo', path: '/reports', icon: BarChart3, roles: ['SYSTEM_ADMIN', 'CHAIN_MANAGER', 'FRANCHISE_OWNER', 'STORE_MANAGER'] },
    { name: 'Thông Báo', path: '/notifications', icon: Bell, roles: ['SYSTEM_ADMIN', 'CHAIN_MANAGER', 'FRANCHISE_OWNER', 'STORE_MANAGER', 'STAFF_POS', 'WAREHOUSE', 'BARISTA'] },
    { name: 'Nhân Viên', path: '/users', icon: Users, roles: ['STORE_MANAGER', 'SYSTEM_ADMIN'] },
    { name: 'Quản Lý Quán', path: '/tenants', icon: Building2, roles: ['SYSTEM_ADMIN'] },
  ];

  const allowedItems = navItems.filter(item => user?.role && item.roles.includes(user.role));

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-coffee-dark/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside className={cn(
        "w-64 bg-coffee-dark text-cream flex flex-col h-screen fixed left-0 top-0 z-50 border-r border-gold/20 transition-transform duration-300 ease-in-out lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 pb-12 relative">
          <div className="font-bold text-xl tracking-[2px] text-gold border-b-2 border-gold pb-2 font-sans">TRUNG NGUYÊN</div>
          <div className="text-[0.6rem] tracking-[3px] mt-1 opacity-80 font-sans">LEGEND COFFEE</div>
          <button onClick={closeSidebar} className="lg:hidden absolute top-8 right-4 text-cream/60 hover:text-gold transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col relative">
          {allowedItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={cn(
                  "relative flex items-center gap-3 px-8 py-4 font-sans text-[0.85rem] font-medium tracking-[1px] uppercase transition-all duration-300 active:scale-95 z-10 group",
                  isActive ? "text-gold" : "text-cream/60 hover:text-gold hover:bg-white/5"
                )}
              >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute inset-0 bg-gradient-to-r from-gold/20 to-transparent border-l-4 border-gold z-[-1]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", isActive && "scale-110")} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="m-8 p-4 bg-coffee-rich rounded-xl border border-gold">
        <div className="text-[0.65rem] text-gold uppercase opacity-80 font-sans">Hệ Thống SaaS</div>
        <div className="text-[0.9rem] font-bold mt-1 truncate font-sans">{user?.name}</div>
        <div className="text-xs text-cream/60 mt-1 truncate font-sans">{user?.role.replace('_', ' ')}</div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            logout();
            closeSidebar();
          }}
          className="mt-4 w-full flex items-center gap-2 text-xs text-gold/80 hover:text-gold transition-colors font-sans uppercase tracking-wider"
        >
          <LogOut className="w-4 h-4" /> Đăng Xuất
        </motion.button>
      </div>
    </aside>
    </>
  );
}
