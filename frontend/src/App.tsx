  /**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence } from 'motion/react';
import { MainLayout } from './components/Layout/MainLayout';
import { PrivateRoute } from './components/Layout/PrivateRoute';

// Lazy load pages for performance (Code Splitting)
const LandingPage = lazy(() => import('./pages/Landing/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./pages/Login/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/Register/RegisterPage').then(m => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const POSPage = lazy(() => import('./pages/POS/POSPage').then(m => ({ default: m.POSPage })));
const ProductListPage = lazy(() => import('./pages/Products/ProductListPage').then(m => ({ default: m.ProductListPage })));
const ProductFormPage = lazy(() => import('./pages/Products/ProductFormPage').then(m => ({ default: m.ProductFormPage })));
const OrderHistoryPage = lazy(() => import('./pages/Orders/OrderHistoryPage').then(m => ({ default: m.OrderHistoryPage })));
const InventoryPage = lazy(() => import('./pages/Inventory/InventoryPage').then(m => ({ default: m.InventoryPage })));
const CustomerPage = lazy(() => import('./pages/Customers/CustomerPage').then(m => ({ default: m.CustomerPage })));
const UserManagementPage = lazy(() => import('./pages/Users/UserManagementPage').then(m => ({ default: m.UserManagementPage })));
const TenantManagementPage = lazy(() => import('./pages/Tenants/TenantManagementPage').then(m => ({ default: m.TenantManagementPage })));
const RevenueReportPage = lazy(() => import('./pages/Reports/RevenueReportPage').then(m => ({ default: m.RevenueReportPage })));
const NotificationPage = lazy(() => import('./pages/Notifications/NotificationPage').then(m => ({ default: m.NotificationPage })));

function AnimatedRoutes() {
  const location = useLocation();
  const topLevelKey = location.pathname === '/' ? '/' : location.pathname === '/login' ? '/login' : location.pathname === '/register' ? '/register' : '/app';

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={topLevelKey}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['SYSTEM_ADMIN', 'CHAIN_MANAGER', 'FRANCHISE_OWNER', 'STORE_MANAGER']}>
              <DashboardPage />
            </PrivateRoute>
          } />
          
          <Route path="/pos" element={
            <PrivateRoute allowedRoles={['STAFF_POS', 'STORE_MANAGER']}>
              <POSPage />
            </PrivateRoute>
          } />
          
          <Route path="/products" element={
            <PrivateRoute allowedRoles={['STORE_MANAGER', 'SYSTEM_ADMIN']}>
              <ProductListPage />
            </PrivateRoute>
          } />

          <Route path="/products/new" element={
            <PrivateRoute allowedRoles={['STORE_MANAGER', 'SYSTEM_ADMIN']}>
              <ProductFormPage />
            </PrivateRoute>
          } />
          
          <Route path="/orders" element={
            <PrivateRoute allowedRoles={['STORE_MANAGER', 'SYSTEM_ADMIN', 'CHAIN_MANAGER', 'FRANCHISE_OWNER', 'BARISTA']}>
              <OrderHistoryPage />
            </PrivateRoute>
          } />

          <Route path="/inventory" element={
            <PrivateRoute allowedRoles={['WAREHOUSE', 'STORE_MANAGER']}>
              <InventoryPage />
            </PrivateRoute>
          } />

          <Route path="/customers" element={
            <PrivateRoute allowedRoles={['STORE_MANAGER', 'SYSTEM_ADMIN', 'STAFF_POS']}>
              <CustomerPage />
            </PrivateRoute>
          } />

          <Route path="/users" element={
            <PrivateRoute allowedRoles={['STORE_MANAGER', 'SYSTEM_ADMIN']}>
              <UserManagementPage />
            </PrivateRoute>
          } />

          <Route path="/tenants" element={
            <PrivateRoute allowedRoles={['SYSTEM_ADMIN']}>
              <TenantManagementPage />
            </PrivateRoute>
          } />

          <Route path="/reports" element={
            <PrivateRoute allowedRoles={['SYSTEM_ADMIN', 'CHAIN_MANAGER', 'FRANCHISE_OWNER', 'STORE_MANAGER']}>
              <RevenueReportPage />
            </PrivateRoute>
          } />

          <Route path="/notifications" element={
            <PrivateRoute allowedRoles={['SYSTEM_ADMIN', 'CHAIN_MANAGER', 'FRANCHISE_OWNER', 'STORE_MANAGER', 'STAFF_POS', 'WAREHOUSE']}>
              <NotificationPage />
            </PrivateRoute>
          } />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-cream text-coffee-dark font-serif text-xl">
            Đang tải...
          </div>
        }>
          <AnimatedRoutes />
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}
