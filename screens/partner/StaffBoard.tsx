import { Link } from 'react-router-dom';
import { LogOut, Bell, Clock, ShoppingBag, CreditCard, CheckCircle, RefreshCcw, Ticket, Settings } from 'lucide-react';
import { useStaffOrders } from '../../hooks/useStaffOrders';
import { supabase } from '../../services/supabaseClient';
import { Order, OrderStatus } from '../../types';

export default function StaffBoard() {
  // TODO: Obtener el ID de la relación FoodTruckPlaza real del usuario logueado.
  // Por ahora hardcodeamos uno para probar o tomamos del primer pedido si existe.
  const vendorId = 'e1234567-e89b-12d3-a456-426614174001';
  const { orders, loading } = useStaffOrders(vendorId);

  const updateStatus = async (orderId: string, newStatus: OrderStatus | string) => {
    // Cast string to any if needed because Typescript might complain if string doesn't perfectly match enum in strict mode
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) alert('Error updating status: ' + error.message);
  };

  // Definición de columnas basada en estados
  // Nuevos: Pagados que esperan preparación (o creados si son mostrador, pero priorizamos pagados)
  const pendingOrders = orders.filter(o => o.status === 'paid' || (o.status === 'created' && o.payment_method === 'counter'));
  const preparingOrders = orders.filter(o => o.status === 'in_progress');
  const readyOrders = orders.filter(o => o.status === 'ready');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-[#121212] font-sans text-charcoal dark:text-slate-200 antialiased min-h-screen flex flex-col overflow-hidden transition-colors">
      <header className="sticky top-0 z-50 bg-white dark:bg-[#1E1E1E] shadow-sm border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-secondary shadow-md">
              <Ticket size={24} className="transform -rotate-12 fill-current" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary dark:text-white leading-tight tracking-tight">FoodTruck Ops</h1>
              <p className="text-[10px] font-bold text-slate-500 flex items-center mt-1 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-secondary mr-2 animate-pulse shadow-glow-mint"></span>
                En línea
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link to="/config" className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
              <Settings size={20} />
            </Link>
            <button
              onClick={() => supabase.auth.signOut()}
              className="p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow overflow-x-auto md:overflow-x-visible p-6">
        <div className="flex md:grid md:grid-cols-3 gap-6 h-full">
          {/* Columna: Nuevos (Pagados) */}
          <section className="min-w-[85vw] md:min-w-0 flex flex-col h-full space-y-5">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-bold text-xl flex items-center text-charcoal dark:text-white">
                <span className="w-3 h-3 rounded-full bg-blue-500 mr-3"></span>
                Nuevos
                <span className="ml-3 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold px-2.5 py-1 rounded-full min-w-[24px] text-center">{pendingOrders.length}</span>
              </h2>
            </div>
            <div className="flex flex-col gap-5 pb-24 md:pb-6 overflow-y-auto no-scrollbar">
              {pendingOrders.map(order => (
                <article key={order.id} className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 shadow-card border-l-[6px] border-yellow-400 relative hover:shadow-lg transition-all animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-3xl font-black text-charcoal dark:text-white tracking-tight">#{order.pickup_code}</span>
                      <div className="text-[10px] text-slate-500 font-bold mt-1 flex items-center uppercase tracking-widest">
                        <Clock size={14} className="mr-1.5 opacity-70" /> {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {order.status === 'paid' ? 'Pagado' : 'Por cobrar'}
                    </span>
                  </div>
                  <div className="space-y-2 mb-5">
                    {order.snapshot?.items?.map((i, idx) => (
                      <p key={idx} className="text-sm text-slate-700 dark:text-slate-300">
                        <span className="font-bold text-charcoal dark:text-white">{i.quantity}x</span> {i.name}
                        {i.selected_modifiers && i.selected_modifiers.length > 0 && (
                          <span className="block text-xs text-slate-400 pl-4 mt-0.5">
                            + {i.selected_modifiers.map(m => m.option_name).join(', ')}
                          </span>
                        )}
                      </p>
                    ))}
                  </div>
                  <div className="pt-2 flex gap-3">
                    <button onClick={() => updateStatus(order.id, 'cancelled_unpaid')} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition active:scale-95">Rechazar</button>
                    <button
                      onClick={() => updateStatus(order.id, 'in_progress')} // Move to preparing
                      className="flex-1 bg-primary text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-md active:scale-95 flex items-center justify-center"
                    >
                      <CreditCard size={16} className="mr-2" /> Preparar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Columna: Cocinando */}
          <section className="min-w-[85vw] md:min-w-0 flex flex-col h-full space-y-5">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-bold text-xl flex items-center text-charcoal dark:text-white">
                <span className="w-3 h-3 rounded-full bg-orange-400 mr-3 animate-pulse"></span>
                Cocinando
                <span className="ml-3 bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 text-xs font-bold px-2.5 py-1 rounded-full min-w-[24px] text-center">{preparingOrders.length}</span>
              </h2>
            </div>
            <div className="flex flex-col gap-5 pb-24 md:pb-6 overflow-y-auto no-scrollbar">
              {preparingOrders.map(order => (
                <article key={order.id} className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 shadow-card border-t-[6px] border-orange-400 hover:shadow-lg transition-all animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-3xl font-black text-charcoal dark:text-white tracking-tight">#{order.pickup_code}</span>
                      <div className="text-[10px] text-orange-600 font-bold mt-1 flex items-center uppercase tracking-widest">
                        <RefreshCcw size={14} className="mr-1.5 animate-spin" /> Cocinando
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-5 border border-slate-100 dark:border-slate-800">
                    {order.snapshot?.items?.map((i, idx) => (
                      <div key={idx} className="mb-2">
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          <span className="font-bold text-charcoal dark:text-white">{i.quantity}x</span> {i.name}
                        </p>
                        {i.selected_modifiers && i.selected_modifiers.length > 0 && (
                          <p className="text-xs text-slate-500 pl-4">+ {i.selected_modifiers.map(m => m.option_name).join(', ')}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => updateStatus(order.id, 'ready')}
                    className="w-full bg-secondary hover:bg-secondary-dark text-charcoal font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition flex items-center justify-center shadow-md active:scale-95"
                  >
                    <CheckCircle size={18} className="mr-2" /> Marcar Listo
                  </button>
                </article>
              ))}
            </div>
          </section>

          {/* Columna: Para Retiro */}
          <section className="min-w-[85vw] md:min-w-0 flex flex-col h-full space-y-5">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-bold text-xl flex items-center text-secondary-dark">
                <span className="w-3 h-3 rounded-full bg-secondary mr-3 shadow-glow-mint"></span>
                Para Retiro
                <span className="ml-3 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs font-bold px-2.5 py-1 rounded-full min-w-[24px] text-center">{readyOrders.length}</span>
              </h2>
            </div>
            <div className="flex flex-col gap-5 pb-24 md:pb-6 overflow-y-auto no-scrollbar">
              {readyOrders.map(order => (
                <article key={order.id} className="bg-gradient-to-br from-secondary/10 to-transparent dark:from-secondary/5 dark:to-transparent bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 shadow-card border-2 border-secondary relative overflow-hidden animate-in zoom-in duration-300">
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <span className="text-5xl font-black text-charcoal dark:text-white tracking-tight">#{order.pickup_code}</span>
                      <div className="text-[10px] text-secondary-dark font-bold mt-3 flex items-center uppercase tracking-widest">
                        <Bell size={16} className="mr-2 animate-bounce" /> Cliente Notificado
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-black/20 rounded-xl p-4 mb-5 backdrop-blur-sm relative z-10 border border-white/50 dark:border-white/10">
                    {order.snapshot?.items?.map((i, idx) => (
                      <p key={idx} className="text-sm text-slate-800 dark:text-slate-200">
                        <span className="font-bold text-charcoal dark:text-white">{i.quantity}x</span> {i.name}
                      </p>
                    ))}
                  </div>
                  <button
                    onClick={() => updateStatus(order.id, 'delivered')}
                    className="w-full bg-charcoal dark:bg-white text-white dark:text-charcoal font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition flex items-center justify-center shadow-lg active:scale-95"
                  >
                    <CheckCircle size={18} className="mr-2" /> Entregado
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
