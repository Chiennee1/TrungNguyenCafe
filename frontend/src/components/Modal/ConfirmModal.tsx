import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-coffee-dark/40 backdrop-blur-sm z-40"
            onClick={onCancel}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-paper rounded-2xl shadow-xl border border-gold/20 p-6 w-full max-w-md pointer-events-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-serif font-bold text-coffee-dark">{title}</h3>
                <button onClick={onCancel} className="text-text-muted hover:text-coffee-dark transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-text-muted font-sans mb-8">{message}</p>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={onCancel}
                  className="px-4 py-2 rounded-lg font-medium font-sans text-coffee-dark hover:bg-coffee-50 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={onConfirm}
                  className="px-4 py-2 rounded-lg font-medium font-sans bg-coffee-dark text-cream hover:bg-coffee-rich transition-colors"
                >
                  Xác nhận
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
