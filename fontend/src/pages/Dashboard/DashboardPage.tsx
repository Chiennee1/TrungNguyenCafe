import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Coffee, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion, type Variants } from 'motion/react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/SEO';
import axiosInstance from '../../utils/axiosInstance';

export function DashboardPage() {
  const [stats, setStats] = useState([
    { name: 'Doanh Thu Cửa Hàng', value: '...', change: 'Đang tải...', trend: 'up', icon: TrendingUp },
    { name: 'Đơn Hàng Gần Đây', value: '...', change: 'Đang tải...', trend: 'up', icon: Coffee },
  ]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [ordersTotal, setOrdersTotal] = useState(0);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [revRes, stockRes, ordRes] = await Promise.all([
          axiosInstance.get('/reports/revenue').catch(() => ({ data: { totalRevenue: 0, totalOrders: 0 }})),
          axiosInstance.get('/inventory/low-stock').catch(() => ({ data: [] })),
          axiosInstance.get('/orders').catch(() => ({ data: [] }))
        ]);
        
        setStats([
          { 
            name: 'Doanh Thu Hệ Thống', 
            value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(revRes.data.totalRevenue || 0), 
            change: 'Cập nhật trực tiếp', trend: 'up', icon: TrendingUp 
          },
          { 
            name: 'Số Lượng Đơn', 
            value: (revRes.data.totalOrders || 0).toString(), 
            change: 'Cập nhật trực tiếp', trend: 'up', icon: Coffee 
          },
        ]);

        const stockData = Array.isArray(stockRes.data) ? stockRes.data : [];
        setLowStock(stockData.slice(0, 4).map((i: any) => ({
          name: i.name || 'Unknown',
          qty: `${i.stockQuantity} ${i.unit || ''}`
        })));

        const ordersData = Array.isArray(ordRes.data) ? ordRes.data : [];
        setRecentOrders(ordersData.slice(0, 4).map((o: any) => ({
          name: `Đơn #${(o.orderId || '').toString().substring(0, 8)}`,
          price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(o.total || 0)
        })));
        
        const sum = ordersData.reduce((acc: number, curr: any) => acc + (curr.total || 0), 0);
        setOrdersTotal(sum);
      } catch (err) {
        console.error("Dashboard fetch error", err);
      }
    };
    fetchDashboard();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } 
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <>
      <SEO 
        title="Bảng Điều Khiển" 
        description="Tổng quan doanh thu, đơn hàng và tình trạng hoạt động của quán cafe."
      />
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        className="max-w-7xl mx-auto flex flex-col gap-8"
      >
      <motion.div variants={itemVariants} className="flex justify-between items-end">
        <div>
          <h1 className="text-[2.2rem] font-serif font-normal text-coffee-dark">Bảng Điều Khiển</h1>
          <p className="font-sans text-[0.9rem] text-text-muted mt-1">Chào buổi sáng, hệ thống đang vận hành ổn định tại 08:30 AM.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((stat) => (
            <motion.div 
              key={stat.name} 
              variants={itemVariants} 
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-paper rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:shadow-gold/10 border border-gold/10 flex flex-col justify-between transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="text-[0.75rem] uppercase tracking-[1px] text-text-muted font-sans">{stat.name}</div>
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-gold" />
                </div>
              </div>
              <div className="text-[1.8rem] font-light text-coffee-dark my-2">{stat.value}</div>
              <div className="text-[0.7rem] font-sans text-accent">{stat.change}</div>
            </motion.div>
          ))}

          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -4 }}
            className="md:col-span-2 bg-paper rounded-[32px] p-6 border border-dashed border-gold hover:shadow-lg hover:shadow-gold/5 transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[0.9rem] uppercase font-sans text-coffee-dark font-bold">Cảnh Báo Tồn Kho</h3>
              <span className="text-[0.7rem] text-gold underline cursor-pointer">Xem chi tiết</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {lowStock.length === 0 ? <p className="text-xs text-text-muted">Kho đủ dùng, không có cảnh báo.</p> : null}
              {lowStock.map((item, i) => (
                <div key={i} className="bg-cream p-3 rounded-2xl text-center">
                  <div className="text-[0.7rem] uppercase text-text-muted font-sans">{item.name}</div>
                  <div className="font-bold text-coffee-dark text-[0.9rem] mt-1">{item.qty}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -4 }}
            className="md:col-span-2 rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:shadow-gold/10 border border-gold/10 bg-gradient-to-r from-white to-[#fdfaf7] transition-all duration-300"
          >
            <div className="text-[0.75rem] uppercase tracking-[1px] text-text-muted font-sans">Khách Hàng Thành Viên Mới</div>
            <div className="flex items-baseline gap-4 mt-2">
              <div className="text-[1.8rem] font-light text-coffee-dark">32</div>
              <span className="text-[0.9rem] text-accent italic font-serif">+5 hạng Platinum mới</span>
            </div>
          </motion.div>
        </div>

        <motion.div 
          variants={itemVariants} 
          whileHover={{ y: -4 }}
          className="bg-coffee-rich rounded-[32px] p-6 text-cream shadow-lg hover:shadow-2xl hover:shadow-coffee-dark/40 border border-gold flex flex-col transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-[1.1rem] font-normal font-serif">Đơn Hàng Gần Đây</h3>
            <span className="text-[0.7rem] opacity-60 font-sans">ID: POS-8842</span>
          </div>
          <ul className="list-none flex-1">
            {recentOrders.length === 0 ? <p className="text-xs opacity-70">Chưa có đơn hàng nào</p> : null}
            {recentOrders.map((item, i) => (
              <li key={i} className="flex justify-between py-3 border-b border-gold/20 text-[0.9rem] font-sans">
                <span className="opacity-70">{item.name}</span>
                <b className="text-gold font-medium">{item.price}</b>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-4 border-t-2 border-gold flex justify-between items-center">
            <span className="text-[0.8rem] opacity-80 font-sans tracking-widest">TỔNG GIAO DỊCH GẦN ĐÂY</span>
            <span className="text-[1.5rem] text-gold font-serif">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ordersTotal)}
            </span>
          </div>
          <Link to="/pos">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gold text-coffee-dark border-none py-3 px-6 rounded-full font-bold uppercase text-[0.7rem] cursor-pointer mt-5 w-full transition-colors hover:bg-yellow-600 font-sans tracking-wider"
            >
              Mở POS Bán Hàng
            </motion.button>
          </Link>
          <div className="mt-4 text-[0.65rem] text-center opacity-50 font-sans">
            Phần mềm quản lý Trung Nguyên Cafe v2.0.4
          </div>
        </motion.div>
      </div>
    </motion.div>
    </>
  );
}
