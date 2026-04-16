import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows } from '@react-three/drei';
import { ArrowRight, Coffee, Shield, Zap, BarChart3, Store, Package, Users } from 'lucide-react';
import { SEO } from '../../components/SEO';

// Abstract 3D Coffee Bean / Drop
function CoffeeShape() {
  return (
    <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2}>
      <mesh castShadow receiveShadow>
        <torusKnotGeometry args={[1.2, 0.4, 128, 32]} />
        <meshStandardMaterial 
          color="#D4A373" 
          roughness={0.2} 
          metalness={0.8} 
        />
      </mesh>
    </Float>
  );
}

export function LandingPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="min-h-screen bg-cream text-coffee-dark font-sans overflow-hidden selection:bg-gold/30"
    >
      <SEO 
        title="Trung Nguyên Cafe - Hệ thống quản lý chuỗi" 
        description="Giải pháp phần mềm quản lý chuỗi quán cafe toàn diện, tối ưu hóa quy trình bán hàng, kho hàng và báo cáo doanh thu." 
      />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/80 backdrop-blur-md border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="w-8 h-8 text-gold" />
            <div>
              <div className="font-serif font-bold text-xl tracking-wider text-coffee-dark">TRUNG NGUYÊN</div>
              <div className="text-[0.6rem] tracking-[3px] text-gold uppercase">Legend Coffee</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-sm font-bold text-coffee-600 hover:text-gold transition-colors tracking-wide uppercase">Trang Chủ</a>
            <a href="#features" className="text-sm font-bold text-coffee-600 hover:text-gold transition-colors tracking-wide uppercase">Tính Năng</a>
            <a href="#pricing" className="text-sm font-bold text-coffee-600 hover:text-gold transition-colors tracking-wide uppercase">Bảng Giá</a>
            <a href="#contact" className="text-sm font-bold text-coffee-600 hover:text-gold transition-colors tracking-wide uppercase">Liên Hệ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              to="/login"
              className="hidden md:block px-5 py-2.5 rounded-full font-bold text-coffee-dark hover:bg-gold/10 transition-colors"
            >
              Đăng Nhập
            </Link>
            <Link 
              to="/dashboard"
              className="px-6 py-2.5 rounded-full font-bold bg-coffee-dark text-cream hover:bg-coffee-rich transition-colors shadow-lg shadow-coffee-dark/20"
            >
              Hệ Thống
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              Phiên bản SaaS 2.0 mới nhất
            </div>
            <h1 className="text-5xl lg:text-7xl font-serif font-bold leading-[1.1] mb-6 text-coffee-dark">
              Quản lý chuỗi <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-coffee-400">
                Cafe Thông Minh
              </span>
            </h1>
            <p className="text-lg text-text-muted mb-8 max-w-xl leading-relaxed">
              Hệ thống phần mềm quản lý toàn diện dành riêng cho chuỗi quán Trung Nguyên. Tối ưu hóa quy trình bán hàng, kiểm soát kho chặt chẽ và báo cáo doanh thu theo thời gian thực.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/dashboard">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full bg-gold text-coffee-dark font-bold flex items-center gap-2 shadow-xl shadow-gold/20 hover:bg-[#c29262] transition-colors"
                >
                  Trải Nghiệm Ngay <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full border-2 border-coffee-dark/10 text-coffee-dark font-bold hover:bg-coffee-dark/5 transition-colors"
                >
                  Đăng Nhập Quản Trị
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* 3D Canvas */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-[500px] lg:h-[600px] relative w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-gold/20 to-transparent rounded-full blur-3xl opacity-50" />
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[10, 10, 5]} intensity={2} />
              <directionalLight position={[-10, -10, -5]} intensity={1} color="#D4A373" />
              <spotLight position={[0, 10, 0]} intensity={1.5} penumbra={1} color="#ffffff" />
              <pointLight position={[5, 0, 5]} intensity={1} color="#D4A373" />
              <Suspense fallback={null}>
                <CoffeeShape />
                <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4} color="#1A0F0A" />
              </Suspense>
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-paper relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-coffee-dark mb-4">Tính Năng Nổi Bật</h2>
            <p className="text-text-muted max-w-2xl mx-auto">Giải pháp toàn diện đáp ứng mọi nhu cầu vận hành của chuỗi quán cafe hiện đại.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'POS Bán Hàng Nhanh', desc: 'Giao diện thân thiện, xử lý hàng ngàn đơn hàng mỗi giờ mượt mà.' },
              { icon: Store, title: 'Quản Lý Đa Chi Nhánh', desc: 'Kiểm soát đồng bộ nhiều cửa hàng trên cùng một hệ thống duy nhất.' },
              { icon: BarChart3, title: 'Báo Cáo Real-time', desc: 'Theo dõi doanh thu, lợi nhuận và xu hướng bán hàng theo thời gian thực.' },
              { icon: Package, title: 'Kiểm Soát Kho Chặt Chẽ', desc: 'Tự động trừ kho khi bán hàng, cảnh báo nguyên liệu sắp hết.' },
              { icon: Users, title: 'Quản Lý Khách Hàng', desc: 'Tích điểm thành viên, phân hạng và các chương trình khuyến mãi.' },
              { icon: Shield, title: 'Phân Quyền Bảo Mật', desc: 'Hệ thống phân quyền chi tiết từ Admin, Quản lý đến Nhân viên.' },
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-[32px] bg-cream border border-gold/10 hover:border-gold/30 transition-colors group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="text-xl font-bold text-coffee-dark mb-3">{feature.title}</h3>
                <p className="text-text-muted leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-cream relative border-t border-gold/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-coffee-dark mb-4">Bảng Giá Dịch Vụ</h2>
            <p className="text-text-muted max-w-2xl mx-auto">Chọn gói giải pháp phù hợp nhất với quy mô kinh doanh của bạn.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-paper p-8 rounded-[32px] border border-coffee-100 flex flex-col"
            >
              <h3 className="text-xl font-bold text-coffee-dark mb-2">Cửa Hàng Đơn</h3>
              <p className="text-text-muted mb-6">Dành cho 1 quán cafe</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-coffee-dark">499k</span>
                <span className="text-text-muted">/tháng</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-coffee-700">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> 1 Cửa hàng</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> Tối đa 5 nhân viên</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> POS Bán hàng cơ bản</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> Quản lý sản phẩm</li>
              </ul>
              <button className="w-full py-3 rounded-xl border-2 border-gold text-coffee-dark font-bold hover:bg-gold/10 transition-colors">Dùng Thử Miễn Phí</button>
            </motion.div>

            {/* Pro */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-coffee-dark p-8 rounded-[32px] border border-gold/30 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-coffee-dark/20"
            >
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-gold text-coffee-dark px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Phổ Biến</div>
              <h3 className="text-xl font-bold text-gold mb-2">Chuỗi Cửa Hàng</h3>
              <p className="text-cream/70 mb-6">Dành cho chuỗi 2-5 quán</p>
              <div className="mb-6 text-cream">
                <span className="text-4xl font-bold">1,299k</span>
                <span className="text-cream/70">/tháng</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-cream/90">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> Tối đa 5 cửa hàng</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> Không giới hạn nhân viên</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> Quản lý kho đa điểm</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> Báo cáo doanh thu chi tiết</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> Quản lý khách hàng</li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-gold text-coffee-dark font-bold hover:bg-[#c29262] transition-colors shadow-lg shadow-gold/20">Đăng Ký Ngay</button>
            </motion.div>

            {/* Enterprise */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-paper p-8 rounded-[32px] border border-coffee-100 flex flex-col"
            >
              <h3 className="text-xl font-bold text-coffee-dark mb-2">Enterprise</h3>
              <p className="text-text-muted mb-6">Giải pháp tuỳ chỉnh</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-coffee-dark">Thỏa Thuận</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-coffee-700">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> Không giới hạn cửa hàng</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> Tính năng theo yêu cầu</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> Hỗ trợ kỹ thuật 24/7</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> Server riêng biệt</li>
              </ul>
              <button className="w-full py-3 rounded-xl border-2 border-coffee-200 text-coffee-dark font-bold hover:border-gold hover:text-gold transition-colors">Liên Hệ Tư Vấn</button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-paper relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-coffee-dark rounded-[40px] p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-serif font-bold text-cream mb-6">Bạn cần tư vấn chi tiết?</h2>
                <p className="text-cream/80 mb-8 max-w-md leading-relaxed">
                  Để lại thông tin và đội ngũ chuyên gia của chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để đưa ra giải pháp phù hợp.
                </p>
                <div className="space-y-4 text-cream/90">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center">
                       <Zap className="w-5 h-5 text-gold" />
                     </div>
                     <span>Tư vấn giải pháp miễn phí</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center">
                       <Shield className="w-5 h-5 text-gold" />
                     </div>
                     <span>Cam kết bảo mật dữ liệu</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-cream rounded-3xl p-8">
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-coffee-900 mb-2">Họ và tên</label>
                    <input type="text" placeholder="Trần Văn A" className="w-full px-4 py-3 bg-white border border-coffee-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-coffee-900 mb-2">Số điện thoại</label>
                    <input type="tel" placeholder="0901 234 567" className="w-full px-4 py-3 bg-white border border-coffee-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all" />
                  </div>
                  <button type="button" className="w-full py-4 rounded-xl bg-gold text-coffee-dark font-bold hover:bg-[#c29262] transition-colors shadow-lg shadow-gold/20 mt-4">
                    Nhận Tư Vấn Ngay
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-coffee-dark text-cream py-12 border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Coffee className="w-6 h-6 text-gold" />
            <span className="font-serif font-bold tracking-wider">TRUNG NGUYÊN LEGEND</span>
          </div>
          <p className="text-sm text-cream/60">
            © 2024 Hệ thống quản lý chuỗi Cafe. Nhóm SE.G02 - Nhập môn CNPM.
          </p>
        </div>
      </footer>
    </motion.div>
  );
}
