import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ReceiptText, Search, X, ChevronLeft, ChevronRight,
  CheckCircle2, Clock, XCircle, Coffee, CreditCard,
  Eye, Calendar, Filter
} from 'lucide-react';
import { SEO } from '../../components/SEO';
import { orderApi } from '../../api/orderApi';
import { useAuthStore } from '../../store/authStore';

// ─── Types ─────────────────────────────────────────────────────────────────
interface OrderItem {
  orderItemId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Order {
  orderId: string;
  tenantId: string;
  status: number;
  statusText: string;
  total: number;
  paymentMethod: string;
  note: string | null;
  createdAt: string;
  paidAt: string | null;
  cashierName: string;
  customerName: string | null;
  customerPhone: string | null;
  items: OrderItem[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────
const STATUS_MAP: Record<number, { label: string; color: string; icon: React.ReactNode }> = {
  0: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-3 h-3" /> },
  1: { label: 'Đã thanh toán', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="w-3 h-3" /> },
  2: { label: 'Đang pha chế', color: 'bg-blue-100 text-blue-700', icon: <Coffee className="w-3 h-3" /> },
  3: { label: 'Sẵn sàng', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 className="w-3 h-3" /> },
  4: { label: 'Thất bại', color: 'bg-red-100 text-red-700', icon: <XCircle className="w-3 h-3" /> },
};

const PAYMENT_LABELS: Record<string, string> = {
  CASH: 'Tiền mặt',
  VNPAY: 'VNPay',
  MOMO: 'MoMo',
  ZALOPAY: 'ZaloPay',
  CARD: 'Thẻ',
};

function formatCurrency(v: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
}

function formatDate(d: string) {
  return new Date(d).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── Detail Modal ───────────────────────────────────────────────────────────
function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const statusInfo = STATUS_MAP[order.status] ?? STATUS_MAP[0];
  return (
    <AnimatePresence>
      <>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-coffee-dark/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-3xl shadow-2xl border border-coffee-100 w-full max-w-2xl pointer-events-auto overflow-hidden"
          >
            {/* Header */}
            <div className="bg-coffee-dark text-cream px-6 py-5 flex justify-between items-start">
              <div>
                <p className="text-xs tracking-widest uppercase opacity-60 font-sans mb-1">Chi tiết đơn hàng</p>
                <h2 className="font-serif text-xl font-normal">
                  #{order.orderId.substring(0, 8).toUpperCase()}
                </h2>
                <p className="text-xs opacity-60 mt-1 font-sans">{formatDate(order.createdAt)}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Meta */}
            <div className="px-6 py-4 grid grid-cols-2 gap-4 border-b border-coffee-100">
              <div>
                <p className="text-xs uppercase text-text-muted font-sans tracking-wider mb-1">Trạng thái</p>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}>
                  {statusInfo.icon} {statusInfo.label}
                </span>
              </div>
              <div>
                <p className="text-xs uppercase text-text-muted font-sans tracking-wider mb-1">Thanh toán</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-coffee-50 text-coffee-700">
                  <CreditCard className="w-3 h-3" />
                  {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
                </span>
              </div>
              <div>
                <p className="text-xs uppercase text-text-muted font-sans tracking-wider mb-1">Thu ngân</p>
                <p className="text-sm font-medium text-coffee-dark">{order.cashierName || '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-text-muted font-sans tracking-wider mb-1">Khách hàng</p>
                <p className="text-sm font-medium text-coffee-dark">
                  {order.customerName ? `${order.customerName} (${order.customerPhone})` : 'Khách vãng lai'}
                </p>
              </div>
              {order.note && (
                <div className="col-span-2">
                  <p className="text-xs uppercase text-text-muted font-sans tracking-wider mb-1">Ghi chú</p>
                  <p className="text-sm text-coffee-600 italic">"{order.note}"</p>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="px-6 py-4 max-h-64 overflow-y-auto">
              <p className="text-xs uppercase text-text-muted font-sans tracking-wider mb-3">Sản phẩm</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-text-muted border-b border-coffee-100">
                    <th className="pb-2 font-medium">Tên sản phẩm</th>
                    <th className="pb-2 font-medium text-center">SL</th>
                    <th className="pb-2 font-medium text-right">Đơn giá</th>
                    <th className="pb-2 font-medium text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coffee-50">
                  {order.items.map((item) => (
                    <tr key={item.orderItemId}>
                      <td className="py-2.5 text-coffee-dark font-medium">{item.productName}</td>
                      <td className="py-2.5 text-center text-coffee-600">{item.quantity}</td>
                      <td className="py-2.5 text-right text-coffee-600">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-2.5 text-right font-bold text-coffee-dark">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="px-6 py-4 bg-coffee-50 flex justify-between items-center border-t border-coffee-100">
              <span className="text-sm font-sans uppercase tracking-wider text-coffee-600">Tổng cộng</span>
              <span className="text-2xl font-serif text-coffee-dark font-normal">{formatCurrency(order.total)}</span>
            </div>
          </motion.div>
        </div>
      </>
    </AnimatePresence>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export function OrderHistoryPage() {
  const { user } = useAuthStore();
  const role = user?.role;

  // BARISTA: chỉ xem đơn hôm nay, ẩn filter nâng cao
  const isBarista = role === 'BARISTA';
  const canFilter = !isBarista;

  // ── State ────────────────────────────────────────────────────────────────
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [fromDate, setFromDate] = useState(isBarista ? todayStart.toISOString().split('T')[0] : '');
  const [toDate, setToDate] = useState(isBarista ? todayEnd.toISOString().split('T')[0] : '');
  const [statusFilter, setStatusFilter] = useState<string>('1'); // default: Paid
  const [paymentFilter, setPaymentFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [hasMore, setHasMore] = useState(false);

  // Detail modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async (currentPage: number) => {
    setIsLoading(true);
    setError('');
    try {
      const params: any = {
        page: currentPage,
        pageSize,
      };

      // Date filters
      if (fromDate) {
        const d = new Date(fromDate);
        d.setHours(0, 0, 0, 0);
        params.from = d.toISOString();
      }
      if (toDate) {
        const d = new Date(toDate);
        d.setHours(23, 59, 59, 999);
        params.to = d.toISOString();
      }

      // BARISTA: luôn lock vào hôm nay
      if (isBarista) {
        params.from = todayStart.toISOString();
        params.to   = todayEnd.toISOString();
      }

      if (statusFilter !== '')  params.status = parseInt(statusFilter);
      if (paymentFilter !== '') params.paymentMethod = paymentFilter;

      const res = await orderApi.getOrders(params);
      const data: Order[] = Array.isArray(res.data) ? res.data : [];
      setOrders(data);
      setHasMore(data.length === pageSize);
    } catch (err: any) {
      console.error('Order history fetch error:', err);
      setError('Không thể tải dữ liệu đơn hàng. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [fromDate, toDate, statusFilter, paymentFilter, isBarista, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [fromDate, toDate, statusFilter, paymentFilter]);

  useEffect(() => {
    fetchOrders(page);
  }, [fetchOrders, page]);

  // ── Filtered (client-side search) ────────────────────────────────────────
  const filtered = orders.filter((o) => {
    if (!search) return true;
    const kw = search.toLowerCase();
    return (
      o.orderId.toLowerCase().includes(kw) ||
      (o.customerName ?? '').toLowerCase().includes(kw) ||
      (o.cashierName ?? '').toLowerCase().includes(kw) ||
      (o.customerPhone ?? '').includes(kw)
    );
  });

  // ─── Status summary counts ──────────────────────────────────────────────
  const statusSummary = Object.entries(STATUS_MAP).map(([k, v]) => ({
    status: parseInt(k),
    ...v,
    count: orders.filter((o) => o.status === parseInt(k)).length,
  }));

  return (
    <>
      <SEO title="Lịch Sử Đơn Hàng" description="Xem lịch sử các đơn hàng đã xử lý." />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-7xl mx-auto p-6 flex flex-col gap-6"
      >
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-serif font-normal text-coffee-dark">Lịch Sử Đơn Hàng</h1>
            <p className="text-text-muted text-sm mt-1 font-sans">
              {isBarista ? 'Hiển thị đơn hàng trong ca làm việc hôm nay.' : 'Tra cứu và xem chi tiết các đơn hàng đã xử lý.'}
            </p>
          </div>
          {isBarista && (
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-sm font-medium">
              <Coffee className="w-4 h-4" />
              Chế độ xem: Ca hôm nay
            </span>
          )}
        </div>

        {/* ── Status Summary Chips ── */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              statusFilter === ''
                ? 'bg-coffee-dark text-cream border-coffee-dark shadow-md'
                : 'bg-white text-coffee-600 border-coffee-100 hover:border-coffee-300'
            }`}
          >
            Tất cả ({orders.length})
          </button>
          {statusSummary.map((s) => (
            <button
              key={s.status}
              onClick={() => setStatusFilter(String(s.status))}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                statusFilter === String(s.status)
                  ? 'bg-coffee-dark text-cream border-coffee-dark shadow-md'
                  : 'bg-white text-coffee-600 border-coffee-100 hover:border-coffee-300'
              }`}
            >
              {s.label} ({s.count})
            </button>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="bg-white rounded-2xl border border-coffee-100 p-5 flex flex-wrap gap-4 items-end shadow-sm">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-coffee-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mã đơn, khách hàng, thu ngân..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 bg-coffee-50 focus:bg-white transition-all"
            />
          </div>

          {/* Date filters — ẩn với BARISTA */}
          {canFilter && (
            <>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-coffee-400" />
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="py-2.5 px-3 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 bg-coffee-50 focus:bg-white transition-all"
                />
                <span className="text-coffee-400 text-sm">—</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="py-2.5 px-3 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 bg-coffee-50 focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-coffee-400" />
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="py-2.5 px-3 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 bg-coffee-50 focus:bg-white transition-all"
                >
                  <option value="">Tất cả PTTT</option>
                  {Object.entries(PAYMENT_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Reset */}
          {canFilter && (fromDate || toDate || paymentFilter || statusFilter !== '1') && (
            <button
              onClick={() => {
                setFromDate('');
                setToDate('');
                setStatusFilter('1');
                setPaymentFilter('');
                setSearch('');
              }}
              className="py-2.5 px-4 rounded-xl border border-red-200 text-red-500 text-sm hover:bg-red-50 transition-colors flex items-center gap-1.5"
            >
              <X className="w-4 h-4" /> Xóa filter
            </button>
          )}
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-3xl border border-coffee-100 shadow-sm overflow-hidden">
          {error && (
            <div className="p-6 text-center text-red-500 text-sm font-medium bg-red-50">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-coffee-50/60 text-xs uppercase tracking-wider text-coffee-500 border-b border-coffee-100">
                  <th className="px-5 py-4 font-medium">Mã đơn</th>
                  <th className="px-5 py-4 font-medium">Thời gian</th>
                  <th className="px-5 py-4 font-medium">Khách hàng</th>
                  {!isBarista && <th className="px-5 py-4 font-medium">Thu ngân</th>}
                  <th className="px-5 py-4 font-medium">PTTT</th>
                  <th className="px-5 py-4 font-medium text-right">Tổng tiền</th>
                  <th className="px-5 py-4 font-medium text-center">Trạng thái</th>
                  <th className="px-5 py-4 font-medium text-center">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-coffee-50">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: isBarista ? 6 : 7 }).map((__, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 bg-coffee-50 rounded-lg" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={isBarista ? 7 : 8} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-coffee-300">
                        <ReceiptText className="w-12 h-12" />
                        <p className="text-base font-medium">Không có đơn hàng nào</p>
                        <p className="text-sm">Hãy thử thay đổi bộ lọc hoặc ngày tháng.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => {
                    const statusInfo = STATUS_MAP[order.status] ?? STATUS_MAP[0];
                    return (
                      <motion.tr
                        key={order.orderId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-coffee-50/40 transition-colors group"
                      >
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs bg-coffee-50 px-2.5 py-1 rounded-lg font-medium text-coffee-700">
                            #{order.orderId.substring(0, 8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-coffee-600">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-5 py-4 text-sm">
                          {order.customerName
                            ? <span className="font-medium text-coffee-dark">{order.customerName}</span>
                            : <span className="text-coffee-400 italic">Khách vãng lai</span>
                          }
                        </td>
                        {!isBarista && (
                          <td className="px-5 py-4 text-sm text-coffee-600">{order.cashierName || '—'}</td>
                        )}
                        <td className="px-5 py-4">
                          <span className="text-xs font-medium text-coffee-600 bg-coffee-50 px-2.5 py-1 rounded-lg">
                            {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-coffee-dark text-sm">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}>
                            {statusInfo.icon}
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 rounded-xl text-coffee-400 hover:text-gold hover:bg-gold/10 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && (
            <div className="px-6 py-4 border-t border-coffee-100 flex items-center justify-between">
              <p className="text-sm text-coffee-400 font-sans">
                Hiển thị {filtered.length} đơn hàng — Trang {page}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-2 rounded-xl border border-coffee-200 text-coffee-600 disabled:opacity-30 hover:bg-coffee-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={!hasMore}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-2 rounded-xl border border-coffee-200 text-coffee-600 disabled:opacity-30 hover:bg-coffee-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </>
  );
}
