
import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Store, Receipt, Kanban, Sun, Moon } from 'lucide-react';
import Home from './screens/client/Home';
import VendorMenu from './screens/client/VendorMenu';
import Checkout from './screens/client/Checkout';
import OrderTracking from './screens/client/OrderTracking';
import StaffBoard from './screens/partner/StaffBoard';
import MPConfig from './screens/partner/MPConfig';
import Setup from './screens/admin/Setup';
import VendorSettings from './screens/partner/VendorSettings';
import Login from './screens/auth/Login';
import Register from './screens/auth/Register';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { CartItem, Order, OrderStatus } from './types';

// Context for global state
interface AppContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  // Rutas donde se oculta el menú para dar prioridad a los botones de acción (Confirmar, Ver Pedido, etc)
  const hideNav =
    ['/board', '/mercadopago', '/checkout', '/tracking'].includes(location.pathname) ||
    location.pathname.startsWith('/vendor/');

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

import Landing from './screens/Landing';

// ... imports remain ...

const SubdomainRouter = () => {
  const host = window.location.hostname;
  let subdomain = 'landing';

  if (host.startsWith('admin')) subdomain = 'admin';
  else if (host.startsWith('user') || host.startsWith('partner')) subdomain = 'partner';
  else if (host.startsWith('app')) subdomain = 'client';
  else if (host.includes('localhost')) {
    // For development, we might want to default to 'client' or have a way to switch.
    // Let's check for a query param ?app=admin for testing locally
    const params = new URLSearchParams(window.location.search);
    const appParam = params.get('app');
    if (appParam) subdomain = appParam;
    else subdomain = 'client'; // Default dev mode
  }

  // --- CLIENT APP ---
  if (subdomain === 'client') {
    return (
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vendor/:id" element={<VendorMenu />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/tracking" element={<OrderTracking />} />
          {/* Shared Auth Routes for Client? Maybe simply login for persistence? */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <BottomNav />
      </>
    );
  }

  // --- PARTNER APP ---
  if (subdomain === 'partner') {
    return (
      <div className="bg-slate-50 dark:bg-gray-900 min-h-screen">
        <Routes>
          <Route path="/" element={<PrivateRoute roles={['vendor', 'organizer', 'superadmin']}><StaffBoard /></PrivateRoute>} />
          <Route path="/board" element={<PrivateRoute roles={['vendor', 'organizer', 'superadmin']}><StaffBoard /></PrivateRoute>} />
          <Route path="/config" element={<PrivateRoute roles={['vendor', 'organizer', 'superadmin']}><VendorSettings /></PrivateRoute>} />
          <Route path="/mercadopago" element={<PrivateRoute roles={['vendor', 'organizer', 'superadmin']}><MPConfig /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    );
  }

  // --- ADMIN APP ---
  if (subdomain === 'admin') {
    return (
      <div className="bg-slate-100 dark:bg-gray-950 min-h-screen">
        <Routes>
          <Route path="/" element={<PrivateRoute roles={['superadmin']}><Setup /></PrivateRoute>} />
          <Route path="/setup" element={<PrivateRoute roles={['superadmin']}><Setup /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    );
  }

  // --- LANDING ---
  return (
    <Routes>
      <Route path="*" element={<Landing />} />
    </Routes>
  );
};

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // ... state handlers ...

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== id);
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
          <div className="min-h-screen relative overflow-x-hidden transition-colors">
            <ThemeToggle />
            <SubdomainRouter />
          </div>
        </BrowserRouter>
      </AppContext.Provider>
    </AuthProvider>
  );
}
