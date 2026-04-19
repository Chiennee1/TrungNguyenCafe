import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SEO } from '../../components/SEO';
import axiosInstance from '../../utils/axiosInstance';
import { Users, Mail, UserCheck, UserX, Plus, Edit2, Trash2 } from 'lucide-react';
import { UserModal } from './UserModal';
import { ConfirmModal } from '../../components/Modal/ConfirmModal';

export function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUserId) return;
    try {
      await axiosInstance.delete(`/users/${deleteUserId}`);
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
    } finally {
      setIsConfirmOpen(false);
      setDeleteUserId(null);
    }
  };

  const handleToggleStatus = async (user: any) => {
    const newStatus = user.status === 1 ? 0 : 1;
    try {
      await axiosInstance.patch(`/users/${user.userId}/status`, newStatus, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  return (
    <>
      <SEO title="Quản Lý Nhân Viên" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="bg-paper rounded-[32px] p-8 shadow-[0_10px_30px_rgba(26,15,10,0.08)] border border-gold/10"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[2.2rem] font-serif font-normal text-coffee-dark">Quản Lý Nhân Viên</h1>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-coffee-dark text-white px-5 py-2.5 rounded-full font-medium hover:bg-gold transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Thêm Nhân Viên
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-coffee-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-coffee-50/50 text-coffee-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium rounded-tl-2xl">Họ Và Tên</th>
                <th className="p-4 font-medium">Chi Nhánh</th>
                <th className="p-4 font-medium">Vai Trò</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Trạng Thái</th>
                <th className="p-4 font-medium rounded-tr-2xl text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coffee-50">
              {isLoading ? (
                <tr><td colSpan={6} className="p-6 text-center text-coffee-400">Đang tải dữ liệu...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center text-coffee-400">Chưa có nhân viên nào</td></tr>
              ) : users.map((user) => (
                <tr key={user.userId} className="hover:bg-coffee-50/30 transition-colors">
                  <td className="p-4 font-medium text-coffee-950 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                      <Users className="w-4 h-4" />
                    </div>
                    {user.fullName}
                  </td>
                  <td className="p-4 text-coffee-600">{user.tenantName}</td>
                  <td className="p-4 text-coffee-600">
                    <span className="bg-coffee-50 px-3 py-1 rounded-full text-xs font-medium">
                      {user.roleName}
                    </span>
                  </td>
                  <td className="p-4 text-coffee-600 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-coffee-300" />
                    {user.email}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleToggleStatus(user)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        user.status === 1 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                      title="Nhấn để đổi trạng thái"
                    >
                      {user.status === 1 ? (
                        <><UserCheck className="w-3 h-3" /> Hoạt Động</>
                      ) : (
                        <><UserX className="w-3 h-3" /> Bị Khóa</>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="p-1.5 text-coffee-400 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteUserId(user.userId);
                          setIsConfirmOpen(true);
                        }}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchUsers}
        editingUser={editingUser}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Xác Nhận Xóa"
        message="Bạn có chắc chắn muốn xóa nhân viên này? Hành động này không thể hoàn tác."
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsConfirmOpen(false);
          setDeleteUserId(null);
        }}
      />
    </>
  );
}
