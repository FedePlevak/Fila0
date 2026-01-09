import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Store, Check, Ticket } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { AppContext } from '../../App';
import { OrderStatus } from '../../types';

export default function Checkout() {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [payment, setPayment] = useState<'app' | 'cash'>('app');

  const total = context?.cart.reduce((sum, i) => sum + (i.product.price * i.quantity), 0) || 0;
  // TODO: Obtener nombre del vendor real. Asumimos que todos son del mismo vendor por ahora.
  const vendorName = context?.cart[0]?.product.food_truck_id ? 'FoodTruck' : 'FoodTruck';

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!context || context.cart.length === 0) return;

    setIsSubmitting(true);
    try {
      // Generar snapshot de items
      const snapshotItems = context.cart.map(item => ({
        product_id: item.product.id,
        name: item.product.name,
        unit_price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
        selected_modifiers: [] // TODO: Map actual modifiers if they were in cart
      }));

      // Generar Pickup Code simple (4 dígitos)
      const pickupCode = Math.floor(Math.random() * 9000 + 1000).toString();

      // Determinar estado inicial
      const initialStatus: OrderStatus = payment === 'app' ? 'paid' : 'created';

      // TODO: Usar el ID de FoodTruckPlaza real.
      // Por el momento, usamos placeholder.
      const fakeFoodTruckPlazaId = 'e1234567-e89b-12d3-a456-426614174001';

      // 1. Create the order with SNAPSHOT
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          food_truck_plaza_id: fakeFoodTruckPlazaId,
          total: total,
          status: initialStatus,
          payment_method: payment === 'app' ? 'online' : 'counter',
          pickup_code: pickupCode,
          snapshot: { items: snapshotItems }
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Local update and navigate
      context.addOrder({
        ...orderData, // Use the returned data which matches Order interface (mostly)
        // Ensure TS happy
        id: orderData.id,
        food_truck_plaza_id: orderData.food_truck_plaza_id,
        status: orderData.status as OrderStatus,
        total: orderData.total,
        payment_method: orderData.payment_method,
        pickup_code: orderData.pickup_code,
        created_at: orderData.created_at,
        snapshot: orderData.snapshot
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
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 px-6 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
          <Ticket size={40} />
        </div>
        <h2 className="text-xl font-bold dark:text-white">Tu carrito está vacío</h2>
        <p className="text-slate-500 text-sm">Parece que aún no has elegido nada delicioso.</p>
        <button onClick={() => navigate('/')} className="bg-primary text-white font-bold px-8 py-3 rounded-2xl shadow-lg active:scale-95 transition-all">Explorar Menú</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-32 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between h-20">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-extrabold text-primary dark:text-white tracking-tight">Fila</span>
            <div className="bg-primary text-secondary rounded-lg p-1.5 transform -rotate-12 shadow-sm shrink-0">
              <Ticket size={24} fill="currentColor" className="text-secondary" />
            </div>
          </div>
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>
      </header>

      <main className="flex-grow px-5 pt-8 space-y-10 max-w-3xl mx-auto w-full">
        <div className="text-center space-y-2">
          <p className="text-[10px] font-bold text-primary dark:text-secondary uppercase tracking-[0.3em]">Resumen de pedido</p>
          <h1 className="text-3xl font-black text-charcoal dark:text-white tracking-tight">{vendorName}</h1>
        </div>

        <section className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-soft border border-gray-100 dark:border-gray-700">
          <div className="space-y-6">
            {context.cart.map(item => (
              <div key={item.uuid} className="flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center font-black text-primary text-sm">
                    {item.quantity}x
                  </div>
                  <div>
                    <p className="font-bold text-charcoal dark:text-white text-base leading-tight">{item.product.name}</p>
                    <p className="text-xs text-slate-400 mt-1 font-medium">${item.product.price.toFixed(2)} c/u</p>
                  </div>
                </div>
                <span className="font-bold text-charcoal dark:text-white tracking-tight">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-dashed border-slate-100 dark:border-slate-700 space-y-4">
            <div className="flex justify-between text-sm font-medium text-slate-400">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-charcoal dark:text-white text-lg">Total a pagar</span>
              <span className="text-4xl font-black text-primary dark:text-white tracking-tighter">${total.toFixed(2)}</span>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-4">Método de Pago</h3>
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setPayment('app')}
              className={`group p-6 rounded-[2rem] border-2 transition-all text-left flex items-center justify-between ${payment === 'app' ? 'border-primary bg-primary/5 ring-4 ring-primary/5' : 'border-white dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm'}`}
            >
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl transition-colors ${payment === 'app' ? 'bg-primary text-white' : 'bg-slate-50 dark:bg-slate-700 text-slate-400'}`}>
                  <CreditCard size={24} />
                </div>
                <div>
                  <p className={`font-black tracking-tight ${payment === 'app' ? 'text-primary' : 'text-charcoal dark:text-white'}`}>Pagar ahora</p>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Tarjeta o MercadoPago</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${payment === 'app' ? 'bg-primary border-primary' : 'border-slate-200 dark:border-slate-700'}`}>
                {payment === 'app' && <Check size={14} className="text-white" strokeWidth={4} />}
              </div>
            </button>

            <button
              onClick={() => setPayment('cash')}
              className={`group p-6 rounded-[2rem] border-2 transition-all text-left flex items-center justify-between ${payment === 'cash' ? 'border-primary bg-primary/5 ring-4 ring-primary/5' : 'border-white dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm'}`}
            >
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl transition-colors ${payment === 'cash' ? 'bg-primary text-white' : 'bg-slate-50 dark:bg-slate-700 text-slate-400'}`}>
                  <Store size={24} />
                </div>
                <div>
                  <p className={`font-black tracking-tight ${payment === 'cash' ? 'text-primary' : 'text-charcoal dark:text-white'}`}>Pagar al retirar</p>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Efectivo o tarjeta en el local</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${payment === 'cash' ? 'bg-primary border-primary' : 'border-slate-200 dark:border-slate-700'}`}>
                {payment === 'cash' && <Check size={14} className="text-white" strokeWidth={4} />}
              </div>
            </button>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 p-6 z-40">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={`w-full bg-primary hover:bg-[#3d5460] text-white font-black h-16 px-8 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-between transition-all transform active:scale-[0.98] group disabled:opacity-50`}
          >
            <div className="flex items-center gap-3">
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div>
              ) : (
                <Check size={20} className="text-secondary" />
              )}
              <span className="uppercase tracking-widest text-xs">{isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}</span>
            </div>
            <div className="bg-white/10 px-4 py-1.5 rounded-xl text-sm font-black border border-white/10">
              ${total.toFixed(2)}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
