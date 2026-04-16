import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Coffee, ArrowRight, Mail, Lock, User, Building } from 'lucide-react';
import { motion } from 'motion/react';
import { SEO } from '../../components/SEO';
import axiosInstance from '../../utils/axiosInstance';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await axiosInstance.post('/auth/register', {
        fullName: name,
        email: email,
        password: password,
        tenantName: tenantName
      });
      
      setIsLoading(false);
      navigate('/login');
    } catch (error) {
      console.error("Register failed", error);
      alert("Đăng ký thất bại. Email có thể đã được sử dụng.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Đăng Ký" 
        description="Đăng ký tài khoản mới trên hệ thống quản lý chuỗi quán cafe Trung Nguyên."
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
        className="min-h-screen bg-coffee-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden"
      >
      {/* Decorative background elements */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-coffee-200/30 blur-3xl"
      ></motion.div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-coffee-300/20 blur-3xl"
      ></motion.div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-coffee-900 rounded-full flex items-center justify-center shadow-xl shadow-coffee-900/20">
            <Coffee className="w-10 h-10 text-coffee-50" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-4xl font-serif font-bold text-coffee-950">
          Đăng Ký
        </h2>
        <p className="mt-2 text-center text-sm text-coffee-600 uppercase tracking-widest font-medium">
          Tạo Tài Khoản Mới
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white py-10 px-6 shadow-2xl shadow-coffee-900/5 sm:rounded-3xl sm:px-10 border border-coffee-100">
          <form className="space-y-5" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium text-coffee-900">
                Họ và tên
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-coffee-400" />
                </div>
                <motion.input
                  whileFocus={{ y: -2 }}
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 border border-coffee-200 rounded-2xl focus:ring-2 focus:ring-gold focus:border-gold text-base bg-coffee-50/50 hover:bg-white focus:bg-white transition-all duration-300 focus:shadow-lg focus:shadow-gold/10 outline-none"
                  placeholder="Nguyễn Văn A"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-coffee-900">
                Tên quán (Tenant)
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-coffee-400" />
                </div>
                <motion.input
                  whileFocus={{ y: -2 }}
                  type="text"
                  required
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 border border-coffee-200 rounded-2xl focus:ring-2 focus:ring-gold focus:border-gold text-base bg-coffee-50/50 hover:bg-white focus:bg-white transition-all duration-300 focus:shadow-lg focus:shadow-gold/10 outline-none"
                  placeholder="Trung Nguyên Legend - Quận 1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-coffee-900">
                Email
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-coffee-400" />
                </div>
                <motion.input
                  whileFocus={{ y: -2 }}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 border border-coffee-200 rounded-2xl focus:ring-2 focus:ring-gold focus:border-gold text-base bg-coffee-50/50 hover:bg-white focus:bg-white transition-all duration-300 focus:shadow-lg focus:shadow-gold/10 outline-none"
                  placeholder="admin@trungnguyen.com.vn"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-coffee-900">
                Mật khẩu
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-coffee-400" />
                </div>
                <motion.input
                  whileFocus={{ y: -2 }}
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 border border-coffee-200 rounded-2xl focus:ring-2 focus:ring-gold focus:border-gold text-base bg-coffee-50/50 hover:bg-white focus:bg-white transition-all duration-300 focus:shadow-lg focus:shadow-gold/10 outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-coffee-dark/20 text-base font-bold text-coffee-dark bg-gold hover:bg-[#c29262] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold transition-all duration-300 disabled:opacity-70 mt-6"
              >
                {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </motion.button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-coffee-600">Đã có tài khoản? </span>
            <Link to="/login" className="font-medium text-coffee-900 hover:text-coffee-700 underline">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
    </>
  );
}
