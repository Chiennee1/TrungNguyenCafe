import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { SEO } from '../../components/SEO';

import axiosInstance from '../../utils/axiosInstance';

export function RevenueReportPage() {
  const [timeRange, setTimeRange] = useState('week');
  const [reportData, setReportData] = useState<any>({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    dailyBreakdown: [],
    topProducts: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get('/reports/revenue');
        
        const mappedDaily = res.data.dailyBreakdown.map((d: any) => ({
          name: new Date(d.date).toLocaleDateString('vi-VN', { weekday: 'short' }),
          revenue: d.revenue,
          orders: d.orderCount
        }));

        const mappedProducts = res.data.topProducts.map((p: any) => ({
          name: p.productName,
          sales: p.totalQuantity
        }));

        setReportData({
          totalRevenue: res.data.totalRevenue,
          totalOrders: res.data.totalOrders,
          averageOrderValue: res.data.averageOrderValue,
          dailyBreakdown: mappedDaily,
          topProducts: mappedProducts,
        });
      } catch(err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [timeRange]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="p-6 max-w-7xl mx-auto"
    >
      <SEO title="Báo Cáo Doanh Thu" description="Thống kê doanh thu và hiệu quả kinh doanh." />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-coffee-dark">Báo Cáo Doanh Thu</h1>
          <p className="text-text-muted mt-1">Phân tích hiệu quả kinh doanh theo thời gian thực.</p>
        </div>
        <div className="flex bg-white rounded-xl shadow-sm border border-coffee-100 p-1">
          {['today', 'week', 'month'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range ? 'bg-gold text-coffee-dark shadow-sm' : 'text-coffee-600 hover:bg-coffee-50'
              }`}
            >
              {range === 'today' ? 'Hôm Nay' : range === 'week' ? 'Tuần Này' : 'Tháng Này'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-coffee-dark to-coffee-rich p-6 rounded-3xl shadow-lg text-cream relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <DollarSign className="w-24 h-24" />
          </div>
          <p className="text-sm uppercase tracking-wider font-medium opacity-80 mb-2">Tổng Doanh Thu</p>
          <p className="text-4xl font-bold font-serif mb-4">{formatCurrency(reportData.totalRevenue)} ₫</p>
          <div className="flex items-center gap-2 text-sm text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span>+15.2% so với tuần trước</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-coffee-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-text-muted uppercase tracking-wider font-medium mb-1">Tổng Đơn Hàng</p>
              <p className="text-3xl font-bold text-coffee-dark">{reportData.totalOrders.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-coffee-50 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-coffee-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+8.5% so với tuần trước</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-coffee-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-text-muted uppercase tracking-wider font-medium mb-1">Giá Trị Đơn TB</p>
              <p className="text-3xl font-bold text-coffee-dark">{formatCurrency(reportData.averageOrderValue)} ₫</p>
            </div>
            <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-gold" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-coffee-400">
            <span>Tương đương tuần trước</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-coffee-100">
          <h3 className="text-lg font-serif font-bold text-coffee-dark mb-6">Biểu Đồ Doanh Thu</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportData.dailyBreakdown} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0e6d2" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B5E51' }} dy={10} />
                <YAxis yAxisId="left" tickFormatter={formatCurrency} axisLine={false} tickLine={false} tick={{ fill: '#6B5E51' }} dx={-10} />
                <RechartsTooltip 
                  formatter={(value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="revenue" name="Doanh thu" stroke="#D4A373" strokeWidth={4} dot={{ r: 4, fill: '#D4A373', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-coffee-100">
          <h3 className="text-lg font-serif font-bold text-coffee-dark mb-6">Top Sản Phẩm</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData.topProducts} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0e6d2" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#1A0F0A', fontSize: 12 }} />
                <RechartsTooltip cursor={{ fill: '#fdfaf7' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="sales" name="Đã bán" fill="#1A0F0A" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
