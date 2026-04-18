import { useMemo, useState } from 'react';
import {
  Bell,
  CheckCheck,
  Clock3,
  Megaphone,
  Package,
  ShieldAlert,
  ShoppingCart,
} from 'lucide-react';
import { motion, type Variants } from 'motion/react';
import { SEO } from '../../components/SEO';
import { cn } from '../../utils/cn';

type NotificationType = 'system' | 'inventory' | 'order' | 'promotion';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  isRead: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    title: 'Đơn hàng mới #POS-1024',
    message: 'Khách tại quầy vừa thanh toán đơn hàng trị giá 245.000₫.',
    time: '2 phút trước',
    type: 'order',
    isRead: false,
  },
  {
    id: 2,
    title: 'Cảnh báo tồn kho thấp',
    message: 'Nguyên liệu “Cà phê Legend” chỉ còn 4.2kg, cần nhập thêm.',
    time: '15 phút trước',
    type: 'inventory',
    isRead: false,
  },
  {
    id: 3,
    title: 'Thông báo hệ thống',
    message: 'Hệ thống sẽ bảo trì nhanh vào 23:30 tối nay (dự kiến 10 phút).',
    time: '1 giờ trước',
    type: 'system',
    isRead: true,
  },
  {
    id: 4,
    title: 'Chiến dịch khuyến mãi mới',
    message: 'Chương trình “Mua 2 tặng 1” cho Cold Brew bắt đầu từ ngày mai.',
    time: '3 giờ trước',
    type: 'promotion',
    isRead: true,
  },
];

function getNotificationMeta(type: NotificationType) {
  switch (type) {
    case 'inventory':
      return {
        label: 'Kho',
        icon: Package,
        badgeClass: 'bg-amber-100 text-amber-800',
      };
    case 'order':
      return {
        label: 'Đơn hàng',
        icon: ShoppingCart,
        badgeClass: 'bg-emerald-100 text-emerald-800',
      };
    case 'promotion':
      return {
        label: 'Khuyến mãi',
        icon: Megaphone,
        badgeClass: 'bg-violet-100 text-violet-800',
      };
    case 'system':
    default:
      return {
        label: 'Hệ thống',
        icon: ShieldAlert,
        badgeClass: 'bg-sky-100 text-sky-800',
      };
  }
}

export function NotificationPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08, duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } },
  };

  return (
    <>
      <SEO
        title="Thông Báo"
        description="Theo dõi các cảnh báo tồn kho, đơn hàng và thông báo hệ thống mới nhất."
      />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        className="max-w-7xl mx-auto flex flex-col gap-6"
      >
        <motion.div variants={itemVariants} className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[2.2rem] font-serif font-normal text-coffee-dark">Thông Báo</h1>
            <p className="font-sans text-[0.9rem] text-text-muted mt-1">
              Cập nhật nhanh các sự kiện quan trọng trong cửa hàng.
            </p>
          </div>
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-2 rounded-full border border-gold bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-coffee-dark transition hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck className="h-4 w-4" />
            Đánh dấu tất cả đã đọc
          </button>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
          <motion.div
            variants={itemVariants}
            className="rounded-[32px] border border-gold/10 bg-paper p-4 shadow-sm"
          >
            <div className="mb-3 px-2">
              <h2 className="text-[0.95rem] font-bold uppercase tracking-wide text-coffee-dark font-sans">
                Danh sách thông báo
              </h2>
            </div>

            <div className="space-y-3">
              {notifications.map((notification) => {
                const meta = getNotificationMeta(notification.type);
                const TypeIcon = meta.icon;

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      'rounded-2xl border p-4 transition-all',
                      notification.isRead
                        ? 'border-gold/10 bg-white'
                        : 'border-gold/40 bg-gold/5 shadow-sm'
                    )}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-coffee-dark p-2 text-cream">
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-sans text-[0.9rem] font-semibold text-coffee-dark">
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-red-700">
                                Mới
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-[0.85rem] text-text-muted">{notification.message}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide',
                            meta.badgeClass
                          )}
                        >
                          {meta.label}
                        </span>
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="rounded-full border border-gold px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-coffee-dark transition hover:bg-gold/10"
                          >
                            Đã đọc
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-[0.75rem] text-text-muted">
                      <Clock3 className="h-4 w-4" />
                      <span>{notification.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-[32px] border border-gold bg-coffee-rich p-6 text-cream shadow-lg"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-[1.15rem]">Tóm tắt</h3>
              <Bell className="h-5 w-5 text-gold" />
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-[0.7rem] uppercase tracking-[1px] text-gold/80 font-sans">
                  Chưa đọc
                </p>
                <p className="mt-1 text-3xl font-light text-gold">{unreadCount}</p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-[0.7rem] uppercase tracking-[1px] text-gold/80 font-sans">
                  Tổng thông báo
                </p>
                <p className="mt-1 text-3xl font-light text-gold">{notifications.length}</p>
              </div>
            </div>

            <p className="mt-6 text-xs text-cream/70 font-sans">
              Gợi ý: ưu tiên xử lý thông báo tồn kho và đơn hàng mới để tránh gián đoạn vận hành.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}