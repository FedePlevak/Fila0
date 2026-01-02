
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, CreditCard, Store, Check, ChevronRight, Ticket } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { AppContext } from '../../App';
import { OrderStatus } from '../../types';

export default function Checkout() {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [payment, setPayment] = useState<'app' | 'cash'>('app');

  const total = context?.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0) || 0;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!context || context.cart.length === 0) return;

    setIsSubmitting(true);
    try {
      // 1. Create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          vendor_id: context.cart[0].vendorId,
          total: total,
          status: 'pending',
          payment_status: payment === 'app' ? 'pending' : 'cash'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert order items
      const orderItems = context.cart.map(item => ({
        order_id: orderData.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Local update and navigate
      context.addOrder({
        id: orderData.id,
        vendorName: "Puesto", // Would fetch from vendor info
        items: [...context.cart],
        total,
        status: OrderStatus.PREPARING,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        paymentMethod: payment
      });

      context.clearCart();
      navigate('/tracking');
    } catch (error: any) {
      alert('Error al crear el pedido: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!context || context.cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-slate-500">Tu carrito está vacío</p>
        <button onClick={() => navigate('/')} className="bg-primary text-white px-6 py-2 rounded-full">Volver al inicio</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-32 min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-charcoal dark:text-slate-300">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-extrabold text-primary dark:text-white tracking-tight">Fila</span>
            <div className="bg-primary text-secondary rounded-lg p-1.5 transform -rotate-12 shadow-sm shrink-0">
              <Ticket size={24} fill="currentColor" className="text-secondary" />
            </div>
          </div>
          <button className="p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-charcoal dark:text-slate-300">
            <MoreVertical size={24} />
          </button>
        </div>
      </header>

      <main className="flex-grow px-5 pt-6 space-y-8 max-w-3xl mx-auto w-full">
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Tu pedido en</p>
          <h1 className="text-2xl font-bold text-charcoal dark:text-white">Burger Station #4</h1>
        </div>

        <section className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 shadow-card border border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-primary dark:text-secondary mb-6 flex items-center gap-2">Resumen</h2>
          <div className="space-y-6">
            {context.cart.map(item => (
              <div key={item.id} className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex-grow pr-4">
                  <p className="font-bold text-charcoal dark:text-white text-base">{item.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                  <p className="text-sm font-semibold text-primary dark:text-secondary mt-2">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-1 text-sm font-bold text-charcoal dark:text-white">
                  x{item.quantity}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 flex justify-between items-end">
            <span className="font-semibold text-slate-500 text-[10px] uppercase tracking-wider">Total</span>
            <span className="text-3xl font-bold text-charcoal dark:text-white tracking-tight">${total.toFixed(2)}</span>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-bold text-charcoal dark:text-white uppercase tracking-widest px-1">Método de Pago</h3>
          <div className="space-y-3">
            <button
              onClick={() => setPayment('app')}
              className={`w-full p-5 rounded-2xl border-2 transition-all text-left flex items-center justify-between ${payment === 'app' ? 'border-secondary bg-secondary/5 ring-1 ring-secondary' : 'border-white dark:border-slate-800 bg-white dark:bg-[#1E1E1E]'}`}
            >
              <div className="flex items-center gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-primary">
                  <CreditCard size={24} />
                </div>
                <div>
                  <p className="font-bold text-charcoal dark:text-white">Pagar ahora</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Tarjeta, MercadoPago, Apple Pay</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${payment === 'app' ? 'bg-secondary border-secondary' : 'border-slate-200 dark:border-slate-700'}`}>
                {payment === 'app' && <Check size={14} className="text-white" strokeWidth={4} />}
              </div>
            </button>

            <button
              onClick={() => setPayment('cash')}
              className={`w-full p-5 rounded-2xl border-2 transition-all text-left flex items-center justify-between ${payment === 'cash' ? 'border-secondary bg-secondary/5 ring-1 ring-secondary' : 'border-white dark:border-slate-800 bg-white dark:bg-[#1E1E1E]'}`}
            >
              <div className="flex items-center gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-primary">
                  <Store size={24} />
                </div>
                <div>
                  <p className="font-bold text-charcoal dark:text-white">Pagar en mostrador</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Efectivo o tarjeta al retirar</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${payment === 'cash' ? 'bg-secondary border-secondary' : 'border-slate-200 dark:border-slate-700'}`}>
                {payment === 'cash' && <Check size={14} className="text-white" strokeWidth={4} />}
              </div>
            </button>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 p-5 shadow-floating z-40">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={`w-full bg-primary hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-between transition-all transform active:scale-[0.98] group ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <span className="flex items-center gap-2">
              {isSubmitting ? 'Confirmando...' : 'Confirmar Pedido'}
              {!isSubmitting && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-lg text-sm font-bold">${total.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
