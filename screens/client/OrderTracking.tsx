import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Store, ChefHat, CheckCircle2, History, Timer, Utensils, Ticket } from 'lucide-react';
import { AppContext } from '../../App';
import { OrderStatus } from '../../types';

import { useOrderTracking } from '../../hooks/useOrderTracking';
import { supabase } from '../../services/supabaseClient';

export default function OrderTracking() {
  const context = useContext(AppContext);
  const activeOrder = context?.orders[0]; // Tracking most recent order for demo
  const { status: realTimeStatus } = useOrderTracking(activeOrder?.id);

  // Use real-time status if available, fallback to demo/initial
  const status = realTimeStatus;

  if (!activeOrder) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 px-10 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
          <History size={40} />
        </div>
        <h2 className="text-xl font-bold dark:text-white">No hay pedidos activos</h2>
        <p className="text-slate-500 text-sm">Escanea un código QR o elige una tienda para empezar a pedir sin filas.</p>
        <Link to="/" className="bg-primary text-white font-bold px-8 py-3 rounded-xl shadow-lg">Explorar Tiendas</Link>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-[#1E1E1E] min-h-screen flex flex-col pb-32 transition-colors">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-md border-b border-slate-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-primary dark:text-secondary">Fila</span>
            <div className="bg-primary dark:bg-secondary text-secondary dark:text-primary rounded-lg p-1.5 transform -rotate-12 shadow-sm shrink-0">
              <Ticket size={24} fill="currentColor" className="text-current" />
            </div>
          </Link>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <Menu className="text-charcoal dark:text-white" />
          </button>
        </div>
      </header>

      <main className="px-6 space-y-8 overflow-y-auto animate-in fade-in duration-700 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Tu Pedido</p>
            <h1 className="text-4xl font-extrabold text-charcoal dark:text-white tracking-tight">#{activeOrder.order_number || activeOrder.id}</h1>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="flex items-center gap-1 text-slate-400 mb-0.5">
              <Store size={14} />
              <span className="text-xs font-medium">Local</span>
            </div>
            <h2 className="text-lg font-bold text-primary dark:text-secondary tracking-tight">{activeOrder.vendorName}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-8">
            {/* State Card */}
            <div className={`relative w-full rounded-[2.5rem] p-8 shadow-soft overflow-hidden min-h-[340px] flex flex-col items-center justify-center text-center transition-all duration-500 border-2
              ${status === 'preparing' ? 'bg-primary border-primary text-white' : ''}
              ${status === 'ready' ? 'bg-secondary border-secondary text-charcoal' : ''}
              ${status === 'delivered' ? 'bg-white border-slate-200 text-charcoal' : ''}
              ${status === 'pending' ? 'bg-white border-slate-100 text-charcoal' : ''}
`}>
              {status === 'preparing' && (
                <div className="flex flex-col items-center w-full space-y-8 animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse">
                    <ChefHat size={48} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold tracking-tight">En preparación</h3>
                    <p className="text-slate-100/90 text-sm font-medium px-4">Relájate, nosotros nos ocupamos. Te avisaremos cuando esté listo.</p>
                  </div>
                </div>
              )}

              {status === 'ready' && (
                <div className="flex flex-col items-center w-full space-y-8 animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-charcoal rounded-full flex items-center justify-center shadow-xl animate-bounce">
                    <CheckCircle2 size={48} className="text-secondary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-4xl font-extrabold text-charcoal tracking-tight">¡Listo!</h3>
                    <p className="text-charcoal/70 font-bold text-sm">Retirá en el mostrador</p>
                  </div>
                  <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 w-full border border-charcoal/5 shadow-sm">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/60 font-bold mb-2">Mostrá esta pantalla</p>
                    <div className="text-5xl font-mono font-black text-charcoal tracking-widest">#{activeOrder.order_number || activeOrder.id}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 rounded-[2rem] p-6 shadow-soft dark:shadow-none border border-slate-100 dark:border-white/5 space-y-6 transition-colors">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Detalles</h3>
              <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full">{activeOrder.items.length} items</span>
            </div>
            <ul className="space-y-5">
              {activeOrder.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="flex-grow pt-0.5">
                    <div className="flex justify-between text-charcoal dark:text-slate-200 text-sm font-bold">
                      <span>{item.name}</span>
                      <span className="text-slate-400 font-medium">x{item.quantity}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-5 flex justify-between items-end">
              <span className="text-slate-400 text-xs font-medium mb-1">Total abonado</span>
              <span className="text-2xl font-bold text-charcoal dark:text-white tracking-tight">${activeOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
