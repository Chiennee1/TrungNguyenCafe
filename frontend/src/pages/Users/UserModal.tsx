import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuthStore } from '../../store/authStore';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  editingUser?: any;
}

export function UserModal({ isOpen, onClose, onSaved, editingUser }: UserModalProps) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'SYSTEM_ADMIN' || user?.role === 'CHAIN_MANAGER';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    roleId: '',
    tenantId: isAdmin ? '' : (user?.tenantId || ''),
    status: 1
  });

  const [roles, setRoles] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingUser) {
        setFormData({
          fullName: editingUser.fullName,
          email: editingUser.email,
          password: '',
          phone: editingUser.phone || '',
          roleId: editingUser.roleId,
          tenantId: editingUser.tenantId,
          status: editingUser.status
        });
      } else {
        setFormData({
          fullName: '',
          email: '',
          password: '',
          phone: '',
          roleId: '',
          tenantId: isAdmin ? '' : (user?.tenantId || ''),
          status: 1
        });
      }
      
      const fetchOptions = async () => {
        try {
          const rolesRes = await axiosInstance.get('/roles');
          setRoles(rolesRes.data);
          
          if (isAdmin) {
            const tenantsRes = await axiosInstance.get('/tenants');
            setTenants(tenantsRes.data);
          }
        } catch (err) {
          console.error('Failed to load options', err);
        }
      };
      
      fetchOptions();
      setError('');
    }
  }, [isOpen, editingUser, isAdmin, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload: any = { ...formData };
      
      // Admin should provide tenantId, otherwise fallback to user's tenantId.
      if (!payload.tenantId && isAdmin) {
        setError('Vui lòng chọn chi nhánh');
        return;
      }
      
      if (editingUser) {
        delete payload.password; // Do not send password when updating via this form
        await axiosInstance.put(`/users/${editingUser.userId}`, payload);
      } else {
        await axiosInstance.post('/users', payload);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-coffee-dark/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-paper border border-gold/20 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden pointer-events-auto"
        >
          <div className="flex justify-between items-center p-6 border-b border-coffee-50">
            <h3 className="text-2xl font-serif text-coffee-dark">
              {editingUser ? 'Sửa Thông Tin Nhân Viên' : 'Thêm Nhân Viên Mới'}
            </h3>
            <button onClick={onClose} className="text-text-muted hover:text-coffee-dark">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-coffee-700 mb-1">Họ Và Tên</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-coffee-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
                  placeholder="Nhập họ và tên..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-coffee-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-coffee-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
                  placeholder="nhanvien@email.com"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-coffee-700 mb-1">Mật khẩu</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-coffee-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
                    placeholder="Tối thiểu 6 ký tự"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-coffee-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-coffee-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
                  placeholder="0912345678"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-coffee-700 mb-1">Vai Trò</label>
                  <select
                    required
                    value={formData.roleId}
                    onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-coffee-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Chọn vai trò</option>
                    {roles.map(r => (
                      <option key={r.roleId} value={r.roleId}>{r.sRoleName}</option>
                    ))}
                  </select>
                </div>
                
                {isAdmin && (
                  <div>
                    <label className="block text-sm font-medium text-coffee-700 mb-1">Chi Nhánh</label>
                    <select
                      required
                      value={formData.tenantId}
                      onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-coffee-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Chọn chi nhánh</option>
                      {tenants.map(t => (
                        <option key={t.tenantId} value={t.tenantId}>{t.sTenantName}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              {editingUser && (
                <div>
                  <label className="block text-sm font-medium text-coffee-700 mb-1">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-white border border-coffee-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
                  >
                    <option value={1}>Hoạt động</option>
                    <option value={0}>Bị khóa</option>
                  </select>
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-medium text-coffee-600 hover:bg-coffee-50 transition-colors"
                disabled={isLoading}
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl font-medium bg-coffee-dark text-white hover:bg-coffee-rich transition-colors shadow-sm disabled:opacity-50"
              >
                {isLoading ? 'Đang Xử Lý...' : (editingUser ? 'Lưu Thay Đổi' : 'Thêm Nhân Viên')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
