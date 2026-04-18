import React from 'react';
import { Navigate, useLocation, useOutlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'motion/react';

export function MainLayout() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const outlet = useOutlet();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="min-h-screen bg-coffee-50 flex"
    >
      <Sidebar />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-hidden w-full relative">
        <Topbar />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden relative">
          <AnimatePresence mode="wait">
            {outlet && React.cloneElement(outlet as React.ReactElement, { key: location.pathname })}
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
}
