import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SEO } from '../../components/SEO';
import axiosInstance from '../../utils/axiosInstance';
import { Users, Mail, UserCheck, UserX } from 'lucide-react';

export function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get('/users');
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

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
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-coffee-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-coffee-50/50 text-coffee-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium rounded-tl-2xl">Họ Và Tên</th>
                <th className="p-4 font-medium">Chi Nhánh</th>
                <th className="p-4 font-medium">Vai Trò</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium rounded-tr-2xl">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coffee-50">
              {isLoading ? (
                <tr><td colSpan={5} className="p-6 text-center text-coffee-400">Đang tải biểu dữ liệu...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-coffee-400">Chưa có nhân viên nào</td></tr>
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
                    {user.status === 1 ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        <UserCheck className="w-3 h-3" /> Hoạt Động
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                        <UserX className="w-3 h-3" /> Bị Khóa
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
}
