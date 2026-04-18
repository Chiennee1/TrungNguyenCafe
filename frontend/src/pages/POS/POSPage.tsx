import { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, Coffee, UserPlus, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePOSStore, Product } from '../../store/posStore';
import { SEO } from '../../components/SEO';

import axiosInstance from '../../utils/axiosInstance';

interface CustomerInfo {
  customerId: string;
  name: string;
  points: number;
  memberLevel: string;
}

export function POSPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [customerSearching, setCustomerSearching] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axiosInstance.get('/products'),
          axiosInstance.get('/categories'),
        ]);
        const mapped: Product[] = prodRes.data.map((p: any) => ({
          id: p.productId,
          name: p.name,
          price: p.price,
          category: p.categoryName || 'Khác',
          image: 'https://picsum.photos/seed/' + p.productId + '/200/200',
          status: p.status === 1 ? 'AVAILABLE' : 'OUT_OF_STOCK'
        }));
        setProducts(mapped);
        const catNames: string[] = catRes.data.map((c: any) => c.name);
        setCategories(['Tất cả', ...catNames]);
        setActiveCategory('Tất cả');
      } catch (err) {
        console.error("Failed to load POS data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);
  
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, total } = usePOSStore();

  const filteredProducts = products.filter(p =>
    (activeCategory === 'Tất cả' || p.category === activeCategory) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    p.status === 'AVAILABLE'
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleSearchCustomer = async () => {
    const phone = customerPhone.trim();
    if (phone.length < 9) {
      setCustomerInfo(null);
      setUsePoints(false);
      return;
    }
    setCustomerSearching(true);
    try {
      const res = await axiosInstance.get(`/customers/phone/${phone}`);
      const d = res.data;
      setCustomerInfo({
        customerId: d.customerId,
        name: d.fullName,
        points: d.loyaltyPoint ?? 0,
        memberLevel: d.memberLevel ?? 'STANDARD',
      });
    } catch {
      setCustomerInfo(null);
      setUsePoints(false);
    } finally {
      setCustomerSearching(false);
    }
  };

  const handlePayment = async (method: 'CASH' | 'CARD') => {
    try {
      await axiosInstance.post('/orders', {
        customerId: customerInfo?.customerId ?? null,
        paymentMethod: method,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      });

      setShowPaymentSuccess(true);
      setTimeout(() => {
        setShowPaymentSuccess(false);
        clearCart();
        setCustomerInfo(null);
        setCustomerPhone('');
        setUsePoints(false);
      }, 3000);
    } catch(err) {
      console.error("Failed to create order", err);
      alert("Tạo đơn hàng thất bại! Vui lòng kiểm tra lại.");
    }
  };

  const discount = usePoints && customerInfo ? Math.min(customerInfo.points, total * 1.1) : 0;
  const finalTotal = (total * 1.1) - discount;
  const earnedPoints = customerInfo ? Math.floor(finalTotal * 0.05) : 0; // Earn 5% of final total as points

  return (
    <>
      <SEO 
        title="POS Bán Hàng" 
        description="Giao diện bán hàng tại quầy (POS) cho nhân viên."
      />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="h-[calc(100vh-8rem)] flex gap-6 relative"
      >
        {/* Payment Success Overlay */}
        <AnimatePresence>
          {showPaymentSuccess && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl"
            >
              <motion.div 
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center border border-coffee-100"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-coffee-dark mb-2">Thanh Toán Thành Công!</h2>
                <p className="text-text-muted mb-6">Đơn hàng đã được ghi nhận vào hệ thống.</p>
                <div className="text-3xl font-bold text-gold mb-2">{formatCurrency(finalTotal)}</div>
                {customerInfo && (
                  <div className="text-sm font-medium text-green-600 bg-green-50 px-4 py-2 rounded-full mb-6">
                    + {formatCurrency(earnedPoints).replace('₫', '')} điểm tích lũy
                  </div>
                )}
                <button 
                  onClick={() => setShowPaymentSuccess(false)}
                  className="px-8 py-3 bg-coffee-dark text-cream rounded-full font-medium hover:bg-coffee-rich transition-colors mt-2"
                >
                  Đơn Hàng Mới
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Left Side - Products */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-sm border border-coffee-100 overflow-hidden">
        <div className="p-6 border-b border-coffee-100 space-y-6">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" />
            <motion.input 
              whileFocus={{ scale: 1.01 }}
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-coffee-50 border border-transparent focus:border-gold/50 focus:bg-white rounded-2xl outline-none transition-all text-coffee-dark font-medium"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${
                  activeCategory === cat 
                    ? 'bg-gold text-coffee-dark shadow-lg shadow-gold/20' 
                    : 'bg-coffee-50 text-coffee-600 hover:bg-coffee-100'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-coffee-50/30">
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredProducts.map(product => (
                <motion.button
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white border border-coffee-100 rounded-3xl p-4 text-left hover:border-gold/50 hover:shadow-xl hover:shadow-gold/5 transition-all group flex flex-col"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-coffee-50 relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all">
                        <Plus className="w-5 h-5 text-coffee-dark" />
                      </div>
                    </div>
                  </div>
                  <h3 className="font-serif font-medium text-coffee-950 truncate text-lg">{product.name}</h3>
                  <p className="text-gold font-bold mt-auto pt-2">{formatCurrency(product.price)}</p>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Cart */}
      <div className="w-[400px] bg-white rounded-3xl shadow-sm border border-coffee-100 flex flex-col overflow-hidden">
        <div className="p-5 border-b border-coffee-100 bg-coffee-dark text-cream flex items-center justify-between">
          <h2 className="font-serif font-bold text-xl flex items-center gap-2">
            <ShoppingCartIcon className="w-5 h-5 text-gold" />
            Đơn Hàng
          </h2>
          <div className="bg-gold/20 text-gold px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={cart.length}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="inline-block"
              >
                {cart.length}
              </motion.span>
            </AnimatePresence>
            <span>món</span>
          </div>
        </div>

        {/* Customer Section */}
        <div className="p-4 border-b border-coffee-100 bg-coffee-50/50">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <UserPlus className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400" />
              <input 
                type="text" 
                placeholder="SĐT Khách hàng..." 
                value={customerPhone}
                onChange={(e) => {
                  setCustomerPhone(e.target.value);
                  if (e.target.value.length < 9) {
                    setCustomerInfo(null);
                    setUsePoints(false);
                  }
                }}
                onBlur={handleSearchCustomer}
                onKeyDown={e => e.key === 'Enter' && handleSearchCustomer()}
                className="w-full pl-9 pr-3 py-2 bg-white border border-coffee-200 rounded-xl text-sm focus:border-gold outline-none"
              />
              {customerSearching && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-coffee-400">Đang tìm...</span>
              )}
            </div>
          </div>
          
          <AnimatePresence>
            {customerInfo && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 bg-white p-3 rounded-xl border border-gold/30"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-medium text-coffee-dark text-sm">{customerInfo.name}</span>
                    <span className="ml-2 text-xs bg-coffee-100 text-coffee-600 px-2 py-0.5 rounded-full">{customerInfo.memberLevel}</span>
                  </div>
                  <span className="text-gold font-bold text-sm">{customerInfo.points.toLocaleString()} điểm</span>
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={usePoints}
                    onChange={(e) => setUsePoints(e.target.checked)}
                    className="rounded text-gold focus:ring-gold"
                  />
                  <span className="text-text-muted">Sử dụng điểm thanh toán</span>
                </label>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-coffee-50/30">
          {cart.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-coffee-400 space-y-4"
            >
              <Coffee className="w-16 h-16 opacity-20" />
              <p className="font-serif italic">Chưa có sản phẩm nào</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {cart.map(item => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.8, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -50 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  key={item.id} 
                  className="flex gap-3 items-center bg-white p-3 rounded-2xl border border-coffee-100 shadow-sm origin-right"
                >
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-coffee-950 truncate text-sm">{item.name}</h4>
                    <p className="text-sm text-gold font-bold">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-coffee-50 rounded-xl border border-coffee-100 p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-white rounded-lg text-coffee-600 transition-colors shadow-sm"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-bold text-sm text-coffee-dark">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-white rounded-lg text-coffee-600 transition-colors shadow-sm"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="p-5 border-t border-coffee-100 bg-white space-y-4 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-text-muted">
              <span>Tạm tính</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Thuế (10%)</span>
              <span>{formatCurrency(total * 0.1)}</span>
            </div>
            {usePoints && customerInfo && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Giảm giá (Điểm)</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-2xl font-serif font-bold text-coffee-dark pt-3 border-t border-coffee-100">
              <span>Tổng cộng</span>
              <span className="text-gold">{formatCurrency(finalTotal)}</span>
            </div>
            {customerInfo && finalTotal > 0 && (
              <div className="flex justify-between text-xs text-green-600 font-medium pt-1">
                <span>Điểm tích lũy (+5%)</span>
                <span>+{formatCurrency(earnedPoints).replace('₫', '')}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={cart.length === 0}
              onClick={() => handlePayment('CASH')}
              className="flex items-center justify-center gap-2 py-3.5 bg-white border-2 border-coffee-dark text-coffee-dark rounded-2xl font-bold hover:bg-coffee-50 transition-colors disabled:opacity-50 disabled:border-coffee-200 disabled:text-coffee-400"
            >
              <Banknote className="w-5 h-5" />
              Tiền Mặt
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={cart.length === 0}
              onClick={() => handlePayment('CARD')}
              className="flex items-center justify-center gap-2 py-3.5 bg-gold text-coffee-dark rounded-2xl font-bold hover:bg-[#c29262] transition-colors disabled:opacity-50 shadow-lg shadow-gold/20"
            >
              <CreditCard className="w-5 h-5" />
              Thẻ / QR
            </motion.button>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={clearCart}
            disabled={cart.length === 0}
            className="w-full py-2.5 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Hủy Đơn Hàng
          </motion.button>
        </div>
      </div>
    </motion.div>
    </>
  );
}

// Helper icon
function ShoppingCartIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

