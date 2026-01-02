
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Store, Link as LinkIcon, Link2Off, ShieldCheck, Info } from 'lucide-react';

export default function MPConfig() {
  const navigate = useNavigate();
  
  return (
    <div className="bg-background-light dark:bg-background-dark text-charcoal dark:text-slate-100 font-sans min-h-screen flex flex-col items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-[#1E1E1E] rounded-[2.5rem] shadow-card overflow-hidden border border-slate-100 dark:border-slate-800 relative flex flex-col transition-colors">
        <header className="px-6 py-6 flex items-center justify-between border-b border-slate-50 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-primary tracking-tight">Fila</span>
          </div>
          <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X size={24} />
          </button>
        </header>

        <main className="flex-grow p-8 flex flex-col items-center text-center">
          <div className="w-full flex items-center justify-center space-x-6 mb-12 animate-in slide-in-from-top-4 duration-700">
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 bg-primary rounded-[1.5rem] flex items-center justify-center shadow-lg text-white">
                <Store size={40} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tu Local</span>
            </div>
            
            <div className="flex flex-col items-center justify-center relative w-16 -mt-6">
              <div className="w-full border-t-2 border-dashed border-slate-200 dark:border-slate-800 absolute top-1/2 left-0"></div>
              <div className="relative z-10 bg-slate-100 dark:bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center">
                <Link2Off size={16} className="text-slate-400" />
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] flex items-center justify-center shadow-sm relative overflow-hidden">
                <div className="flex flex-row items-end gap-1.5 pb-2">
                  <div className="w-3 h-6 bg-mp-blue rounded-sm opacity-60"></div>
                  <div className="w-3 h-10 bg-mp-blue rounded-sm"></div>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">MercadoPago</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-2.5 rounded-full border border-slate-100 dark:border-slate-700 inline-flex items-center gap-2 mb-8 animate-in fade-in duration-1000">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">No vinculado</span>
          </div>

          <div className="space-y-3 max-w-xs mx-auto mb-10">
            <h1 className="text-3xl font-black text-charcoal dark:text-white leading-tight tracking-tight">Conectá tus cobros</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">Vinculá tu cuenta para recibir pagos automáticos directamente de tus clientes.</p>
          </div>

          <div className="w-full bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex gap-4 text-left mb-10">
            <ShieldCheck size={24} className="text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="text-primary dark:text-secondary font-bold text-sm mb-1.5 uppercase tracking-wide">Tu dinero está seguro</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                <span className="font-bold text-charcoal dark:text-slate-200">Fila no retiene tus fondos.</span> El dinero va directamente a tu cuenta. Nosotros solo verificamos la transacción.
              </p>
            </div>
          </div>

          <div className="w-full space-y-4 mt-auto">
            <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-slate-800 text-white font-bold h-16 px-6 rounded-2xl shadow-lg transition-all active:scale-[0.98]">
              <LinkIcon size={20} className="text-secondary" />
              <span className="uppercase tracking-widest text-xs">Conectar MercadoPago</span>
            </button>
            <button className="w-full py-2 text-[10px] font-bold text-slate-400 hover:text-primary transition-colors flex items-center justify-center gap-1.5 uppercase tracking-[0.15em]">
              <Info size={14} />
              ¿No tienes cuenta? Crea una gratis
            </button>
          </div>
        </main>

        <footer className="bg-slate-50 dark:bg-slate-800/80 px-8 py-5 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[10px] text-slate-400 font-medium leading-tight">Al conectar, aceptas los términos y condiciones de Fila y MercadoPago.</p>
        </footer>
      </div>
    </div>
  );
}
