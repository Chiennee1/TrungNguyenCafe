import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, Plus, Search, MapPin, User, Lock, Unlock, Edit, X } from 'lucide-react';
import { SEO } from '../../components/SEO';

import axiosInstance from '../../utils/axiosInstance';

const INITIAL_MOCK_TENANTS: any[] = [];

export function TenantManagementPage() {
  const [tenants, setTenants] = useState<any[]>(INITIAL_MOCK_TENANTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Add state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTenant, setNewTenant] = useState({ name: '', address: '', manager: '' });

  // Edit state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<{id: string, name: string, address: string, manager: string} | null>(null);
  
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await axiosInstance.get('/tenants');
        const mapped = res.data.map((t: any) => ({
          id: t.tenantId,
          name: t.sTenantName,
          address: t.sAddress,
          manager: t.sEmail || 'Chưa cập nhật',
          status: t.iStatus === 1 ? 'ACTIVE' : 'LOCKED'
        }));
        setTenants(mapped);
      } catch (err) {
        console.error("Failed to load tenants", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTenants();
  }, []);

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenant.name || !newTenant.address || !newTenant.manager) return;
    
    try {
      const res = await axiosInstance.post('/tenants', {
        sTenantName: newTenant.name,
        sAddress: newTenant.address,
        sEmail: newTenant.manager,
        sPhone: "N/A",
        sFranchiseType: "FRANCHISE",
        iStatus: 1
      });
      const t = res.data;
      const tenant = {
        id: t.tenantId,
        name: t.sTenantName,
        address: t.sAddress,
        manager: t.sEmail || 'Chưa cập nhật',
        status: t.iStatus === 1 ? 'ACTIVE' : 'LOCKED'
      };

      setTenants([tenant, ...tenants]);
      setNewTenant({ name: '', address: '', manager: '' });
      setIsAddModalOpen(false);
    } catch(err) {
      console.error(err);
      alert("Thêm chi nhánh thất bại.");
    }
  };

  const handleToggleStatus = async (id: string) => {
    const tenant = tenants.find(t => t.id === id);
    if (!tenant) return;
    const newStatus = tenant.status === 'ACTIVE' ? 0 : 1;
    
    try {
      await axiosInstance.patch(`/tenants/${id}/status`, newStatus, {
        headers: { 'Content-Type': 'application/json' }
      });
      setTenants(tenants.map(t => 
        t.id === id ? { ...t, status: newStatus === 1 ? 'ACTIVE' : 'LOCKED' } : t
      ));
    } catch(err) {
      console.error(err);
      alert("Đổi trạng thái thất bại.");
    }
  };

  const handleUpdateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;
    
    try {
      await axiosInstance.put(`/tenants/${editingTenant.id}`, {
        sTenantName: editingTenant.name,
        sAddress: editingTenant.address,
        sEmail: editingTenant.manager,
        sPhone: "N/A",
        sFranchiseType: "FRANCHISE",
        iStatus: 1 // Defaultly assuming keeping the same status since it's toggled individually
      });
      setTenants(tenants.map(t => 
        t.id === editingTenant.id ? { ...t, ...editingTenant } : t
      ));
      setIsEditModalOpen(false);
      setEditingTenant(null);
    } catch(err) {
      console.error(err);
      alert("Cập nhật thất bại.");
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="p-6 max-w-7xl mx-auto"
    >
      <SEO title="Quản Lý Chuỗi (Tenants)" description="Quản lý danh sách các cửa hàng trong chuỗi." />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-coffee-dark">Quản Lý Chuỗi Quán</h1>
          <p className="text-text-muted mt-1">Quản lý thông tin, trạng thái của các chi nhánh (Tenants).</p>
        </div>
        <motion.button
          onClick={() => setIsAddModalOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-coffee-dark text-cream px-6 py-3 rounded-xl font-medium hover:bg-coffee-rich transition-colors shadow-lg shadow-coffee-dark/20"
        >
          <Plus className="w-5 h-5" />
          Thêm Chi Nhánh Mới
        </motion.button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-coffee-100 overflow-hidden">
        <div className="p-6 border-b border-coffee-100">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" />
            <input
              type="text"
              placeholder="Tìm kiếm chi nhánh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-coffee-50 border border-transparent focus:border-gold/50 rounded-xl outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-coffee-50/30">
          <AnimatePresence>
          {filteredTenants.map((tenant) => (
            <motion.div 
              key={tenant.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="bg-white p-6 rounded-2xl border border-coffee-100 shadow-sm hover:shadow-xl hover:shadow-gold/10 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-gold" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  tenant.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {tenant.status === 'ACTIVE' ? 'Hoạt Động' : 'Tạm Khóa'}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-coffee-dark mb-3 line-clamp-1">{tenant.name}</h3>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-start gap-2 text-sm text-text-muted">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="line-clamp-2">{tenant.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <User className="w-4 h-4 shrink-0" />
                  <span>Quản lý: <strong className="text-coffee-900">{tenant.manager}</strong></span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-coffee-50">
                <button 
                  onClick={() => {
                    setEditingTenant({ id: tenant.id, name: tenant.name, address: tenant.address, manager: tenant.manager });
                    setIsEditModalOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-coffee-50 text-coffee-700 rounded-lg text-sm font-medium hover:bg-coffee-100 transition-colors"
                >
                  <Edit className="w-4 h-4" /> Sửa
                </button>
                {tenant.status === 'ACTIVE' ? (
                  <button 
                    onClick={() => handleToggleStatus(tenant.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    <Lock className="w-4 h-4" /> Khóa
                  </button>
                ) : (
                  <button 
                    onClick={() => handleToggleStatus(tenant.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                  >
                    <Unlock className="w-4 h-4" /> Mở Khóa
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-coffee-dark/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-coffee-100 flex justify-between items-center bg-coffee-50/50">
                <h2 className="text-xl font-bold font-serif text-coffee-dark">Thêm Chi Nhánh Mới</h2>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 hover:bg-white rounded-full text-text-muted hover:text-coffee-dark transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddTenant} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-coffee-dark mb-2">Tên Chi Nhánh</label>
                  <input 
                    type="text" 
                    required
                    value={newTenant.name}
                    onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                    placeholder="VD: Trung Nguyên Legend - Quận 10"
                    className="w-full px-4 py-3 bg-coffee-50 border border-transparent focus:border-gold/50 focus:bg-white rounded-xl outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-coffee-dark mb-2">Địa Chỉ</label>
                  <input 
                    type="text" 
                    required
                    value={newTenant.address}
                    onChange={(e) => setNewTenant({...newTenant, address: e.target.value})}
                    placeholder="VD: 123 Đường 3/2, Quận 10, TP.HCM"
                    className="w-full px-4 py-3 bg-coffee-50 border border-transparent focus:border-gold/50 focus:bg-white rounded-xl outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-coffee-dark mb-2">Người Quản Lý</label>
                  <input 
                    type="text" 
                    required
                    value={newTenant.manager}
                    onChange={(e) => setNewTenant({...newTenant, manager: e.target.value})}
                    placeholder="VD: Nguyễn Văn E"
                    className="w-full px-4 py-3 bg-coffee-50 border border-transparent focus:border-gold/50 focus:bg-white rounded-xl outline-none transition-all"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-3 text-coffee-dark bg-coffee-50 hover:bg-coffee-100 font-bold rounded-xl transition-colors"
                  >
                    Hủy Bỏ
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 text-coffee-dark bg-gold hover:bg-[#c29262] font-bold rounded-xl transition-colors shadow-lg shadow-gold/20"
                  >
                    Thêm Chi Nhánh
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && editingTenant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsEditModalOpen(false); setEditingTenant(null); }}
              className="absolute inset-0 bg-coffee-dark/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-coffee-100 flex justify-between items-center bg-coffee-50/50">
                <h2 className="text-xl font-bold font-serif text-coffee-dark">Cập Nhật Chi Nhánh</h2>
                <button 
                  onClick={() => { setIsEditModalOpen(false); setEditingTenant(null); }}
                  className="p-2 hover:bg-white rounded-full text-text-muted hover:text-coffee-dark transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateTenant} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-coffee-dark mb-2">Tên Chi Nhánh</label>
                  <input 
                    type="text" 
                    required
                    value={editingTenant.name}
                    onChange={(e) => setEditingTenant({...editingTenant, name: e.target.value})}
                    placeholder="VD: Trung Nguyên Legend - Quận 10"
                    className="w-full px-4 py-3 bg-coffee-50 border border-transparent focus:border-gold/50 focus:bg-white rounded-xl outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-coffee-dark mb-2">Địa Chỉ</label>
                  <input 
                    type="text" 
                    required
                    value={editingTenant.address}
                    onChange={(e) => setEditingTenant({...editingTenant, address: e.target.value})}
                    placeholder="VD: 123 Đường 3/2, Quận 10, TP.HCM"
                    className="w-full px-4 py-3 bg-coffee-50 border border-transparent focus:border-gold/50 focus:bg-white rounded-xl outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-coffee-dark mb-2">Người Quản Lý</label>
                  <input 
                    type="text" 
                    required
                    value={editingTenant.manager}
                    onChange={(e) => setEditingTenant({...editingTenant, manager: e.target.value})}
                    placeholder="VD: Nguyễn Văn E"
                    className="w-full px-4 py-3 bg-coffee-50 border border-transparent focus:border-gold/50 focus:bg-white rounded-xl outline-none transition-all"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => { setIsEditModalOpen(false); setEditingTenant(null); }}
                    className="flex-1 py-3 text-coffee-dark bg-coffee-50 hover:bg-coffee-100 font-bold rounded-xl transition-colors"
                  >
                    Hủy Bỏ
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 text-coffee-dark bg-gold hover:bg-[#c29262] font-bold rounded-xl transition-colors shadow-lg shadow-gold/20"
                  >
                    Lưu Thay Đổi
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
