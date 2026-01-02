
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bell, Settings, Star, Clock, Utensils, Sparkles, QrCode, Instagram, Twitter, Linkedin, Mail, Ticket, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useVendors } from '../../hooks/useVendors';
import { getAIRecommendation } from '../../services/geminiService';
import { useAuth } from '../../context/AuthContext';
import { User as UserIcon, LogOut } from 'lucide-react';

export default function Home() {
  const [aiRec, setAiRec] = useState<{ suggestion: string, reason: string } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const { vendors, loading, error } = useVendors();
  const { user, profile, signOut } = useAuth();

  const handleAiClick = async () => {
    setLoadingAi(true);
    const rec = await getAIRecommendation("Tengo mucha hambre y quiero algo sustancioso");
    setAiRec(rec);
    setLoadingAi(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          <div className="flex items-center gap-2 group cursor-pointer">
            <span className="text-3xl font-extrabold text-primary dark:text-white tracking-tight">Fila</span>
            <div className="bg-primary text-secondary rounded-lg p-1.5 transform -rotate-12 shadow-sm group-hover:rotate-0 transition-all shrink-0">
              <Ticket size={24} fill="currentColor" className="text-secondary" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col items-end mr-2">
                  <p className="text-xs font-bold text-charcoal dark:text-white leading-none">{profile?.full_name || user.email}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{profile?.role}</p>
                </div>
                <Link to="/mercadopago" className="p-2.5 rounded-full bg-slate-50 dark:bg-gray-800 text-primary transition-colors">
                  <UserIcon size={24} />
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-2.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <LogOut size={22} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-primary hover:bg-slate-800 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md active:scale-95">
                Entrar
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-50 dark:bg-gray-900 pb-20 pt-16 sm:pb-32 lg:pb-40">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4A6572 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-charcoal dark:text-white tracking-tight mb-8 leading-[1.2] lg:leading-[1.1]">
              Pedí sin fila,<br className="hidden sm:block" />
              <span className="text-primary relative inline sm:inline-block sm:whitespace-nowrap">
                retirás cuando
                <svg className="absolute w-full h-3 -bottom-2 left-0 text-secondary opacity-50 hidden sm:block" preserveAspectRatio="none" viewBox="0 0 100 10">
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8" />
                </svg>
                {" "}esté listo.
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
              Explorá los Food Trucks disponibles, hacé tu pedido desde el celular y relajate. Nosotros te avisamos.
            </p>
            <div className="flex justify-center">
              <div className="inline-flex items-center bg-white dark:bg-gray-800 px-6 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
                <span className="flex h-3 w-3 relative mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                </span>
                <span className="text-sm font-bold text-charcoal dark:text-gray-200 flex items-center gap-1.5">
                  <MapPin size={16} className="text-primary" /> Patio de Comidas - Palermo Soho
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* AI Recommendation Tool */}
        <div className="max-w-4xl mx-auto px-4 -mt-12 mb-20 relative z-20">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center gap-6">
            <div className="bg-primary/10 p-4 rounded-2xl">
              <Sparkles size={32} className="text-primary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-bold text-charcoal dark:text-white">¿No sabes qué elegir hoy?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Deja que nuestra Inteligencia Artificial te sugiera el plato perfecto.</p>
            </div>
            {aiRec ? (
              <div className="bg-slate-50 dark:bg-gray-700/50 p-4 rounded-xl border border-slate-100 dark:border-gray-600 flex-1">
                <p className="text-sm font-bold text-primary">{aiRec.suggestion}</p>
                <p className="text-xs italic text-gray-600 dark:text-gray-400">"{aiRec.reason}"</p>
              </div>
            ) : (
              <button
                onClick={handleAiClick}
                disabled={loadingAi}
                className="bg-primary hover:bg-[#3d5460] text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
              >
                {loadingAi ? 'Pensando...' : '¡Sugiéreme algo!'}
              </button>
            )}
          </div>
        </div>

        {/* Vendors Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              Error al cargar puestos: {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vendors.map(vendor => (
                <article key={vendor.id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-card dark:border dark:border-gray-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
                  <div className="h-64 bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                    <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className={`absolute top-4 right-4 ${vendor.isOpen ? 'bg-secondary' : 'bg-gray-400'} text-charcoal text-xs font-bold tracking-widest px-4 py-1.5 rounded-full shadow-sm`}>
                      {vendor.isOpen ? 'ABIERTO' : 'CERRADO'}
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-charcoal dark:text-white tracking-tight">{vendor.name}</h3>
                      <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-xl">
                        <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1.5" />
                        <span className="text-charcoal dark:text-yellow-100 font-bold">{vendor.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                      {vendor.description}
                    </p>
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-6 mt-auto flex items-center justify-between">
                      <div className="flex items-center text-sm font-semibold text-slate-500 dark:text-gray-400">
                        <Clock size={18} className="mr-2 text-primary" />
                        {vendor.waitTime}
                      </div>
                      <Link to={`/vendor/${vendor.id}`} className="bg-primary hover:bg-[#37474F] text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-md shadow-primary/20 flex items-center group-hover:pl-5 group-hover:pr-7">
                        Pedir ahora
                        <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* How it works */}
        <section className="bg-slate-50 dark:bg-gray-800 py-24">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal dark:text-white mb-4">¿Cómo funciona Fila?</h2>
            <p className="text-lg text-gray-500 mb-16 max-w-2xl mx-auto">Simple, rápido y sin perder tiempo parado. Pedí lo que quieras, cuando quieras.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: '1. Elegí tu comida', desc: 'Explorá el menú de todos los locales desde tu mesa o antes de llegar. Fotos reales y precios claros.', icon: <Utensils /> },
                { title: '2. Pedí y Pagá', desc: 'Hacé tu pedido y pagá online de forma segura con todos los medios de pago. Recibirás actualizaciones en vivo.', icon: <Settings /> },
                { title: '3. ¡Listo para retirar!', desc: 'Te avisamos con una notificación cuando tu pedido esté listo. Acercate al mostrador solo para retirar.', icon: <CheckCircle2 /> }
              ].map((step, i) => (
                <div key={i} className="bg-white dark:bg-gray-700 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-600">
                  <div className="bg-primary/10 text-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    {React.cloneElement(step.icon as React.ReactElement, { size: 32 })}
                  </div>
                  <h3 className="text-xl font-bold text-charcoal dark:text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-charcoal text-white pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-gray-700 pb-12">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl font-extrabold tracking-tight">Fila</span>
              <div className="bg-white text-charcoal rounded-lg p-1">
                <Ticket size={18} className="text-primary fill-current" />
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">Optimizá tu tiempo y disfrutá de tu comida favorita sin esperas innecesarias.</p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 tracking-tight">Clientes</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-secondary transition-colors">Mis Pedidos</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Centro de Ayuda</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Términos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 tracking-tight">Negocios</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-secondary transition-colors">Registrar mi local</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Planes</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 tracking-tight">Contacto</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center gap-3"><Mail size={18} /> hola@fila0.com</li>
              <li className="flex items-center gap-3"><MapPin size={18} /> Montevideo, UY</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© 2023 Fila. Todos los derechos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Instagram size={18} className="cursor-pointer hover:text-white transition-colors" />
            <Twitter size={18} className="cursor-pointer hover:text-white transition-colors" />
            <Linkedin size={18} className="cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}
