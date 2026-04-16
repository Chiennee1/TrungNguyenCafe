import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, ArrowDownToLine, ArrowUpFromLine, AlertTriangle, Search, X, Clock } from 'lucide-react';
import { SEO } from '../../components/SEO';

import axiosInstance from '../../utils/axiosInstance';

export function InventoryPage() {
  const [activeTab, setActiveTab] = useState('STOCK');
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'IMPORT' | 'EXPORT'>('IMPORT');
  const [inventory, setInventory] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axiosInstance.get('/inventory');
        const mapped = res.data.map((i: any) => ({
          id: i.ingredientId,
          name: i.name,
          unit: i.unit,
          stock: i.stockQuantity,
          minStock: i.alertThreshold || 0,
          status: (i.stockQuantity <= (i.alertThreshold || 0)) ? 'LOW' : 'GOOD'
        }));
        setInventory(mapped);
      } catch (err) {
        console.error("Failed to load inventory", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const handleOpenActionModal = (type: 'IMPORT' | 'EXPORT') => {
    setActionType(type);
    setIsActionModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="p-6 max-w-7xl mx-auto"
    >
      <SEO title="Quản Lý Kho" description="Kiểm soát tồn kho nguyên vật liệu." />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-coffee-dark">Quản Lý Kho</h1>
          <p className="text-text-muted mt-1">Theo dõi tồn kho, nhập/xuất nguyên vật liệu.</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOpenActionModal('EXPORT')}
            className="flex items-center gap-2 bg-white border-2 border-coffee-dark text-coffee-dark px-5 py-2.5 rounded-xl font-bold hover:bg-coffee-50 transition-colors"
          >
            <ArrowUpFromLine className="w-5 h-5" />
            Xuất Kho
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOpenActionModal('IMPORT')}
            className="flex items-center gap-2 bg-gold text-coffee-dark px-5 py-2.5 rounded-xl font-bold hover:bg-[#c29262] transition-colors shadow-lg shadow-gold/20"
          >
            <ArrowDownToLine className="w-5 h-5" />
            Nhập Kho
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div whileHover={{ y: -4, scale: 1.01 }} className="bg-white p-6 rounded-3xl shadow-sm border border-coffee-100 flex items-center gap-4 hover:shadow-xl hover:shadow-gold/10 transition-all duration-300">
          <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center">
            <Package className="w-7 h-7 text-gold" />
          </div>
          <div>
            <p className="text-sm text-text-muted uppercase tracking-wider font-medium">Tổng Mặt Hàng</p>
            <p className="text-2xl font-bold text-coffee-dark">124</p>
          </div>
        </motion.div>
        <motion.div whileHover={{ y: -4, scale: 1.01 }} className="bg-white p-6 rounded-3xl shadow-sm border border-red-100 flex items-center gap-4 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-text-muted uppercase tracking-wider font-medium">Sắp Hết Hàng</p>
            <p className="text-2xl font-bold text-red-600">12</p>
          </div>
        </motion.div>
        <motion.div whileHover={{ y: -4, scale: 1.01 }} className="bg-white p-6 rounded-3xl shadow-sm border border-coffee-100 flex items-center gap-4 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
            <ArrowDownToLine className="w-7 h-7 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-text-muted uppercase tracking-wider font-medium">Đã Nhập (Tháng)</p>
            <p className="text-2xl font-bold text-coffee-dark">45.2M ₫</p>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl shadow-sm border border-coffee-100 overflow-hidden">
        <div className="border-b border-coffee-100 flex px-6 pt-4 gap-6">
          {['STOCK', 'HISTORY'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-medium text-sm transition-colors relative ${
                activeTab === tab ? 'text-gold' : 'text-coffee-400 hover:text-coffee-600'
              }`}
            >
              {tab === 'STOCK' ? 'Tồn Kho Hiện Tại' : 'Lịch Sử Nhập/Xuất'}
              {activeTab === tab && (
                <motion.div layoutId="inventoryTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="relative mb-6 max-w-md">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" />
            <input
              type="text"
              placeholder="Tìm kiếm nguyên liệu..."
              className="w-full pl-12 pr-4 py-3 bg-coffee-50 border border-transparent focus:border-gold/50 focus:bg-white rounded-xl outline-none transition-all duration-300 focus:shadow-sm"
            />
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'STOCK' ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-coffee-50/50 text-coffee-600 text-sm uppercase tracking-wider">
                    <th className="p-4 font-medium rounded-l-xl">Tên Nguyên Liệu</th>
                    <th className="p-4 font-medium">Đơn Vị</th>
                    <th className="p-4 font-medium">Tồn Kho</th>
                    <th className="p-4 font-medium">Định Mức Tối Thiểu</th>
                    <th className="p-4 font-medium rounded-r-xl">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coffee-50">
                  {isLoading ? (
                    <tr><td colSpan={5} className="p-6 text-center text-coffee-400">Đang tải dữ liệu...</td></tr>
                  ) : inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-coffee-50/30 transition-colors">
                      <td className="p-4 font-medium text-coffee-950">{item.name}</td>
                      <td className="p-4 text-coffee-600">{item.unit}</td>
                      <td className="p-4 font-bold text-coffee-dark">{item.stock}</td>
                      <td className="p-4 text-coffee-400">{item.minStock}</td>
                      <td className="p-4">
                        {item.status === 'LOW' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                            <AlertTriangle className="w-3 h-3" /> Sắp Hết
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                            An Toàn
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-coffee-50/50 text-coffee-600 text-sm uppercase tracking-wider">
                    <th className="p-4 font-medium rounded-l-xl">Thời Gian</th>
                    <th className="p-4 font-medium">Loại</th>
                    <th className="p-4 font-medium">Nguyên Liệu</th>
                    <th className="p-4 font-medium">Số Lượng</th>
                    <th className="p-4 font-medium">Người Thực Hiện</th>
                    <th className="p-4 font-medium rounded-r-xl">Ghi Chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coffee-50">
                  {history.map((record) => (
                    <tr key={record.id} className="hover:bg-coffee-50/30 transition-colors">
                      <td className="p-4 text-coffee-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {record.date}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          record.type === 'IMPORT' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {record.type === 'IMPORT' ? (
                            <><ArrowDownToLine className="w-3 h-3" /> Nhập</>
                          ) : (
                            <><ArrowUpFromLine className="w-3 h-3" /> Xuất</>
                          )}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-coffee-950">{record.item}</td>
                      <td className="p-4 font-bold text-coffee-dark">
                        {record.type === 'IMPORT' ? '+' : '-'}{record.quantity} {record.unit}
                      </td>
                      <td className="p-4 text-coffee-600">{record.user}</td>
                      <td className="p-4 text-coffee-400">{record.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Action Modal */}
      <AnimatePresence>
        {isActionModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-coffee-dark/40 backdrop-blur-sm z-40"
              onClick={() => setIsActionModalOpen(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl shadow-xl border border-coffee-100 p-6 w-full max-w-lg pointer-events-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-serif font-bold text-coffee-dark">
                    {actionType === 'IMPORT' ? 'Nhập Kho' : 'Xuất Kho'}
                  </h3>
                  <button onClick={() => setIsActionModalOpen(false)} className="p-2 text-coffee-400 hover:text-coffee-dark hover:bg-coffee-50 rounded-xl transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-coffee-900 mb-2">Nguyên liệu</label>
                    <select className="block w-full pl-4 pr-4 py-3 border border-coffee-200 rounded-2xl focus:ring-2 focus:ring-gold focus:border-gold text-base bg-coffee-50/50 hover:bg-white focus:bg-white transition-all duration-300 focus:shadow-lg focus:shadow-gold/10 outline-none">
                      <option value="">Chọn nguyên liệu...</option>
                      {inventory.map(item => (
                        <option key={item.id} value={item.id}>{item.name} ({item.unit})</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-coffee-900 mb-2">Số lượng</label>
                      <input type="number" className="block w-full pl-4 pr-4 py-3 border border-coffee-200 rounded-2xl focus:ring-2 focus:ring-gold focus:border-gold text-base bg-coffee-50/50 hover:bg-white focus:bg-white transition-all duration-300 focus:shadow-lg focus:shadow-gold/10 outline-none" placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-coffee-900 mb-2">Đơn giá (VNĐ)</label>
                      <input type="number" className="block w-full pl-4 pr-4 py-3 border border-coffee-200 rounded-2xl focus:ring-2 focus:ring-gold focus:border-gold text-base bg-coffee-50/50 hover:bg-white focus:bg-white transition-all duration-300 focus:shadow-lg focus:shadow-gold/10 outline-none" placeholder="0" disabled={actionType === 'EXPORT'} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-coffee-900 mb-2">Ghi chú</label>
                    <textarea rows={3} className="block w-full pl-4 pr-4 py-3 border border-coffee-200 rounded-2xl focus:ring-2 focus:ring-gold focus:border-gold text-base bg-coffee-50/50 hover:bg-white focus:bg-white transition-all duration-300 focus:shadow-lg focus:shadow-gold/10 outline-none" placeholder="Lý do nhập/xuất..."></textarea>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-8">
                  <button 
                    onClick={() => setIsActionModalOpen(false)}
                    className="px-6 py-3 rounded-xl font-medium text-coffee-600 hover:bg-coffee-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={() => setIsActionModalOpen(false)}
                    className="px-6 py-3 rounded-xl font-medium bg-coffee-dark text-cream hover:bg-coffee-rich transition-colors shadow-lg shadow-coffee-dark/20"
                  >
                    Xác nhận {actionType === 'IMPORT' ? 'Nhập' : 'Xuất'}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
