import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, ArrowRight, Mail, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuthStore, Role } from '../../store/authStore';
import { SEO } from '../../components/SEO';
import axiosInstance from '../../utils/axiosInstance';

export function LoginPage() {
  const [email, setEmail] = useState('admin@trungnguyen.com.vn');
  const [password, setPassword] = useState('Password@123');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password
      });

      const data = response.data;

      login(
        {
          id: data.userId,
          email: data.email,
          name: data.fullName,
          role: data.role as Role,
          tenantId: data.tenantId,
        },
        data.token
      );
      
      // Save token to localStorage (axiosInstance interceptor relies on this)
      localStorage.setItem('token', data.token);

      navigate(data.role === 'STAFF_POS' ? '/pos' : '/dashboard');
    } catch (error) {
      console.error("Login failed", error);
      alert("Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Đăng Nhập" 
        description="Đăng nhập vào hệ thống quản lý chuỗi quán cafe Trung Nguyên."
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
          Trung Nguyên
        </h2>
        <p className="mt-2 text-center text-sm text-coffee-600 uppercase tracking-widest font-medium">
          Cafe Chain Management
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white py-10 px-6 shadow-2xl shadow-coffee-900/5 sm:rounded-3xl sm:px-10 border border-coffee-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-coffee-900">
                Email address
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
                Password
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-coffee-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-coffee-700">
                  Ghi nhớ
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-coffee-600 hover:text-coffee-500">
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-coffee-dark/20 text-base font-bold text-coffee-dark bg-gold hover:bg-[#c29262] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold transition-all duration-300 disabled:opacity-70 mt-2"
              >
                {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </motion.button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-coffee-600">Chưa có tài khoản? </span>
            <a href="/register" className="font-medium text-coffee-900 hover:text-coffee-700 underline">
              Đăng ký ngay
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-coffee-100">
            <p className="text-xs text-center text-coffee-500">
              Tài khoản Test:<br/>
              admin@trungnguyen.com.vn (System Admin)<br/>
              manager@trungnguyen.com.vn (Store Manager)<br/>
              staff@trungnguyen.com.vn (POS Staff)
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
    </>
  );
}
