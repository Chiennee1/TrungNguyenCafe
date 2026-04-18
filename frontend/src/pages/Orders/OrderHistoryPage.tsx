import { motion } from 'motion/react';
import { SEO } from '../../components/SEO';

export function OrderHistoryPage() {
  return (
    <>
      <SEO title="Lịch Sử Đơn Hàng" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="bg-paper rounded-[32px] p-8 shadow-[0_10px_30px_rgba(26,15,10,0.08)] border border-gold/10"
      >
        <h1 className="text-[2.2rem] font-serif font-normal text-coffee-dark mb-6">Lịch Sử Đơn Hàng</h1>
        <p className="text-text-muted font-sans">Danh sách các đơn hàng đã xử lý sẽ hiển thị ở đây.</p>
      </motion.div>
    </>
  );
}
