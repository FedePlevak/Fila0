import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import { Store, Receipt, Kanban, Sun, Moon } from 'lucide-react';

import Home from './screens/client/Home';
import VendorMenu from './screens/client/VendorMenu';
import Checkout from './screens/client/Checkout';
import OrderTracking from './screens/client/OrderTracking';

import StaffBoard from './screens/partner/StaffBoard';
import VendorSettings from './screens/partner/VendorSettings';
import MenuConfig from './screens/partner/MenuConfig';
import MPConfig from './screens/partner/MPConfig';

import Dashboard from './screens/admin/Dashboard';
import Setup from './screens/admin/Setup';

import Login from './screens/auth/Login';
import Register from './screens/auth/Register';
import Landing from './screens/Landing';

import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { CartItem, Order, OrderStatus } from './types';

// Context for global state
interface AppContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (uuid: string) => void;
  clearCart: () => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  // Rutas donde se oculta el menú para dar prioridad a los botones de acción
  const hideNav =
    ['/board', '/mercadopago', '/checkout', '/tracking'].includes(location.pathname) ||
    location.pathname.startsWith('/vendor/') ||
    location.pathname.startsWith('/config') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/partner');

  if (hideNav) return null;

  return (
    <nav className="fixed bottom-0 w-full bg-white dark:bg-[#1E1E1E] border-t border-gray-100 dark:border-gray-800 pb-safe pt-1 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between md:justify-center md:gap-20">
        <Link to="/" className={`flex flex-col items-center justify-center gap-1 group w-16 ${isActive('/') ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-primary'}`}>
          <div className={`px-4 py-1 rounded-full group-hover:bg-primary/5 transition-colors ${isActive('/') ? 'bg-primary/10' : ''}`}>
            <Store size={24} />
          </div>
          <span className="text-[11px] font-semibold">Tiendas</span>
        </Link>
        <Link to="/tracking" className={`flex flex-col items-center justify-center gap-1 group w-16 ${isActive('/tracking') ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-primary'}`}>
          <div className={`px-4 py-1 rounded-full group-hover:bg-primary/5 transition-colors ${isActive('/tracking') ? 'bg-primary/10' : ''}`}>
            <Receipt size={24} />
          </div>
          <span className="text-[11px] font-medium">Pedidos</span>
        </Link>
        <Link to="/board" className={`flex flex-col items-center justify-center gap-1 group w-16 ${isActive('/board') ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-primary'}`}>
          <div className={`px-4 py-1 rounded-full group-hover:bg-primary/5 transition-colors ${isActive('/board') ? 'bg-primary/10' : ''}`}>
            <Kanban size={24} />
          </div>
          <span className="text-[11px] font-medium">Staff</span>
        </Link>
      </div>
    </nav>
  );
};

const ThemeToggle = () => {
  const [dark, setDark] = useState(false);
  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('dark');
  };
  return (
    <button onClick={toggleDark} className="fixed bottom-20 right-4 z-[60] bg-charcoal dark:bg-white text-white dark:text-charcoal w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 opacity-80 hover:opacity-100">
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

const ClientLayout = () => {
  return (
    <div className="pb-20">
      <Outlet />
      <BottomNav />
    </div>
  );
};

const SubdomainRouter = () => {
  const hostname = window.location.hostname;
  let subdomain = 'landing';

  if (hostname.startsWith('admin')) subdomain = 'admin';
  else if (hostname.startsWith('user') || hostname.startsWith('partner')) subdomain = 'partner';
  else if (hostname.startsWith('app')) subdomain = 'client';
  else if (hostname.includes('localhost')) {
    // For development, we allow simple toggling via URL or default to combined view
    // If we are on localhost, we might want to access EVERYTHING for ease of dev
    // So we'll return a special 'dev' router or just the client one with extra routes
    subdomain = 'dev';
  }

  // --- ADMIN APP ---
  if (subdomain === 'admin') {
    return (
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // --- PARTNER APP ---
  if (subdomain === 'partner') {
    return (
      <Routes>
        <Route path="/" element={<StaffBoard />} />
        <Route path="/board" element={<StaffBoard />} />
        <Route path="/config" element={<VendorSettings />} />
        <Route path="/config/menu" element={<MenuConfig />} />
        <Route path="/mercadopago" element={<MPConfig />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // --- CLIENT / DEV APP (Includes everything for testing) ---
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* Client Flow */}
      <Route element={<ClientLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/vendor/:id" element={<VendorMenu />} />
        <Route path="/tracking" element={<OrderTracking />} />
      </Route>
      <Route path="/checkout" element={<Checkout />} />

      {/* Partner Flow (Accessible in Dev) */}
      <Route path="/partner/board" element={<StaffBoard />} />
      <Route path="/config" element={<VendorSettings />} />
      <Route path="/config/menu" element={<MenuConfig />} />
      <Route path="/mercadopago" element={<MPConfig />} />

      {/* Admin Flow (Accessible in Dev) */}
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/setup" element={<Setup />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(i => i.uuid === item.uuid);
      if (existingIndex >= 0) {
        const newCart = [...prev];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + item.quantity
        };
        return newCart;
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (uuid: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.uuid === uuid);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.uuid === uuid ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.uuid !== uuid);
    });
  };

  const clearCart = () => setCart([]);

  const addOrder = (order: Order) => setOrders(prev => [order, ...prev]);

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <AuthProvider>
      <AppContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, orders, addOrder, updateOrderStatus }}>
        <BrowserRouter>
          <div className="min-h-screen relative overflow-x-hidden transition-colors bg-slate-50 dark:bg-slate-950">
            <ThemeToggle />
            <SubdomainRouter />
          </div>
        </BrowserRouter>
      </AppContext.Provider>
    </AuthProvider>
  );
}
