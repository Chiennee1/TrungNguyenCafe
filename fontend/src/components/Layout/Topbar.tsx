import { Bell, Search, Menu } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

export function Topbar() {
  const { user } = useAuthStore();
  const { toggleSidebar } = useUIStore();

  return (
    <header className="h-20 bg-cream flex items-center justify-between px-4 md:px-10 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <motion.button 
          onClick={toggleSidebar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="lg:hidden p-2 text-coffee-dark hover:bg-gold/10 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </motion.button>
        <div className="relative hidden md:block">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <motion.input 
            whileFocus={{ y: -1 }}
            type="text" 
            placeholder="Search orders, products..." 
            className="pl-10 pr-4 py-2.5 bg-paper border border-gold/20 focus:border-gold focus:ring-2 focus:ring-gold/20 rounded-xl w-80 outline-none transition-all duration-300 focus:shadow-md font-sans text-sm"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 text-coffee-dark hover:bg-gold/10 rounded-xl transition-colors"
        >
          <Bell className="w-6 h-6" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-cream"></span>
        </motion.button>
        
        <div className="h-8 w-px bg-gold/20 mx-2"></div>
        
        <div className="text-right hidden sm:block font-sans">
          <p className="text-[1rem] font-bold text-coffee-dark">{user?.name || 'Nguyễn Văn Minh'}</p>
          <p className="text-[0.75rem] uppercase text-gold tracking-[1px]">{user?.role.replace('_', ' ') || 'Store Manager'}</p>
        </div>
      </div>
    </header>
  );
}
