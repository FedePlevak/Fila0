import React from 'react';
import { Ticket, ArrowRight, Store, ChefHat, ShieldCheck, Mail, MessageSquare, Timer, Coffee, Smartphone, BellRing, Heart } from 'lucide-react';

export default function Landing() {
    const currentHost = window.location.hostname.replace('www.', '');
    const baseDomain = currentHost.includes('localhost') ? 'localhost:3000' : 'fila0.com';
    const protocol = window.location.protocol;

    const getUrl = (sub: string) => {
        if (baseDomain.includes('localhost')) {
            return `${protocol}//${sub}.${baseDomain}`;
        }
        return `${protocol}//${sub}.${baseDomain}`;
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col font-sans transition-colors">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-slate-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <span className="text-3xl font-extrabold text-primary dark:text-white tracking-tight">Fila0</span>
                        <div className="bg-primary text-secondary rounded-lg p-1.5 transform -rotate-12 shadow-sm">
                            <Ticket size={24} fill="currentColor" className="text-secondary" />
                        </div>
                    </div>
                    <nav className="hidden md:flex gap-8 text-sm font-bold text-slate-500 dark:text-slate-400">
                        <button onClick={() => scrollToSection('nosotros')} className="hover:text-primary transition-colors">Nuestro ADN</button>
                        <button onClick={() => scrollToSection('contacto')} className="hover:text-primary transition-colors">Contacto</button>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main id="hero" className="flex-grow flex flex-col items-center justify-center text-center px-6 py-40 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4A6572 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                <div className="relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-8xl font-black text-charcoal dark:text-white tracking-tight leading-tight">
                            Fila0 transforma la <br />
                            <span className="text-primary">espera en tranquilidad.</span>
                        </h1>
                        <p className="max-w-xl mx-auto text-xl md:text-2xl text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest bg-secondary/10 py-2 rounded-full px-6 inline-block">
                            Pedís sin fila, retirás cuando esté listo.
                        </p>
                    </div>

                    <p className="max-w-xl mx-auto text-xl text-slate-400 dark:text-gray-500 font-medium italic">
                        "No aceleramos la cocina. Sacamos a la gente de la fila."
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full pt-10">
                        {/* App Cliente */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-gray-700 hover:scale-105 transition-transform duration-300 group text-left">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:rotate-6 transition-transform">
                                <Store size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-charcoal dark:text-white mb-2 tracking-tight">Para vos</h3>
                            <p className="text-sm text-slate-400 mb-6 font-medium leading-relaxed">Escaneá el QR, pedí y seguí con lo tuyo. Te avisamos por Pantalla cuando esté listo.</p>
                            <a /* href={getUrl('app')} */ className="inline-flex items-center text-blue-600 font-black text-sm uppercase tracking-wider hover:gap-2 transition-all">
                                Probar Fila0 <ArrowRight size={16} className="ml-1" />
                            </a>
                        </div>

                        {/* Partner Portal */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-gray-700 hover:scale-105 transition-transform duration-300 group text-left">
                            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6 group-hover:rotate-6 transition-transform">
                                <ChefHat size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-charcoal dark:text-white mb-2 tracking-tight">Para tu local</h3>
                            <p className="text-sm text-slate-400 mb-6 font-medium leading-relaxed">Cocina organizada, pedidos sin gritos y clientes felices que no amontonan gente.</p>
                            <a /* href={getUrl('user')} */ className="inline-flex items-center text-orange-600 font-black text-sm uppercase tracking-wider hover:gap-2 transition-all">
                                Gestionar Pedidos <ArrowRight size={16} className="ml-1" />
                            </a>
                        </div>

                        {/* Master Admin */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-gray-700 hover:scale-105 transition-transform duration-300 group text-left">
                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:rotate-6 transition-transform">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-charcoal dark:text-white mb-2 tracking-tight">Para la plaza</h3>
                            <p className="text-sm text-slate-400 mb-6 font-medium leading-relaxed">Control total del flujo, métricas reales y un ambiente tranquilo para que todos disfruten.</p>
                            <a /* href={getUrl('admin')} */ className="inline-flex items-center text-purple-600 font-black text-sm uppercase tracking-wider hover:gap-2 transition-all">
                                Dashboard Admin <ArrowRight size={16} className="ml-1" />
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            {/* Nuestro ADN Section */}
            <section id="nosotros" className="py-32 bg-slate-50 dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center space-y-4 mb-20">
                        <p className="text-primary font-black uppercase tracking-[0.2em] text-sm">Nuestro ADN</p>
                        <h2 className="text-4xl md:text-6xl font-black text-charcoal dark:text-white tracking-tight">Experiencias mejor conectadas.</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Esperar sin fila */}
                        <div className="bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] shadow-soft space-y-6 flex flex-col">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <Timer size={28} />
                            </div>
                            <div className="space-y-4 flex-grow">
                                <h4 className="text-xl font-black text-charcoal dark:text-white tracking-tight leading-tight">Esperar sin <br />hacer fila</h4>
                                <p className="text-slate-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                                    Con Fila0 no tenés que quedarte parado esperando.
                                    Pedís desde tu celular y seguís con tu plan.
                                    <br /><br />
                                    <strong>Te avisamos cuando está listo. Nada más.</strong>
                                </p>
                            </div>
                        </div>

                        {/* Tu tiempo vuelve a ser tuyo */}
                        <div className="bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] shadow-soft space-y-6 flex flex-col">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <Coffee size={28} />
                            </div>
                            <div className="space-y-4 flex-grow">
                                <h4 className="text-xl font-black text-charcoal dark:text-white tracking-tight leading-tight">Tu tiempo <br />vuelve a ser tuyo</h4>
                                <p className="text-slate-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                                    La espera no desaparece, pero cambia.
                                    Podés sentarte, charlar, disfrutar el lugar.
                                    <br /><br />
                                    Sin ansiedad. Sin gente apurada. Sin preguntar <strong>"¿falta mucho?"</strong>.
                                </p>
                            </div>
                        </div>

                        {/* Simple de verdad */}
                        <div className="bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] shadow-soft space-y-6 flex flex-col">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <Smartphone size={28} />
                            </div>
                            <div className="space-y-4 flex-grow">
                                <h4 className="text-xl font-black text-charcoal dark:text-white tracking-tight leading-tight">Simple <br />de verdad</h4>
                                <p className="text-slate-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                                    No hay app. No hay registros. No hay vueltas.
                                    <br /><br />
                                    Escaneás el QR, pedís y listo. <strong>Así de simple.</strong>
                                </p>
                            </div>
                        </div>

                        {/* Retiro sin estrés */}
                        <div className="bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] shadow-soft space-y-6 flex flex-col">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <BellRing size={28} />
                            </div>
                            <div className="space-y-4 flex-grow">
                                <h4 className="text-xl font-black text-charcoal dark:text-white tracking-tight leading-tight">Aviso claro, <br />retiro sin estrés</h4>
                                <p className="text-slate-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                                    Cuando tu pedido está listo, te avisamos.
                                    Vas, retirás y seguís.
                                    <br /><br />
                                    Sin empujones. Sin gritos de nombres. <strong>Sin confusión.</strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Nueva Cita */}
                    <div className="mt-20 bg-charcoal rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden text-center max-w-4xl mx-auto">
                        <div className="absolute top-0 right-0 p-12 opacity-5">
                            <Ticket size={200} />
                        </div>
                        <h3 className="text-3xl md:text-5xl font-black leading-tight relative z-10">
                            “Fila0 existe para eliminar el desorden de la espera y devolverle tranquilidad tanto al que pide como al que cocina.”
                        </h3>
                    </div>
                </div>
            </section>

            {/* Es / No es Section */}
            <section className="py-32">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Fila0 Es */}
                        <div className="bg-green-50/50 dark:bg-green-900/10 p-12 rounded-[3rem] border border-green-100 dark:border-green-800/20">
                            <h3 className="text-2xl font-black text-green-700 dark:text-green-400 mb-8 uppercase tracking-widest">Fila0 es:</h3>
                            <ul className="space-y-6">
                                {['orden', 'calma', 'claridad', 'simpleza'].map(item => (
                                    <li key={item} className="flex items-center gap-4 text-2xl font-black text-charcoal dark:text-white">
                                        <Heart className="text-green-500 fill-green-500" size={32} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Fila0 No es */}
                        <div className="bg-red-50/50 dark:bg-red-900/10 p-12 rounded-[3rem] border border-red-100 dark:border-red-800/20">
                            <h3 className="text-2xl font-black text-red-700 dark:text-red-400 mb-8 uppercase tracking-widest">Fila0 no es:</h3>
                            <ul className="space-y-6">
                                {['una app compleja', 'un sistema de delivery', 'un software técnico', 'promesas infladas'].map(item => (
                                    <li key={item} className="flex items-center gap-4 text-2xl font-black text-charcoal/40 dark:text-white/40">
                                        <div className="w-8 h-8 flex items-center justify-center bg-red-400/20 rounded-full text-red-500 font-bold border-2 border-red-500">X</div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contacto Section */}
            <section id="contacto" className="py-32 bg-charcoal text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10">
                            <div className="space-y-6">
                                <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">Hagamos <br />equipo.</h2>
                                <p className="text-xl text-slate-400 font-medium max-w-md">¿Gestionas un patio de comidas o un evento masivo? Hablemos de cómo mejorar la experiencia.</p>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-primary transition-colors">Escribinos</p>
                                        <p className="font-bold text-lg">hola@fila0.com</p>
                                    </div>
                                </div>
                                {/* <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors">
                                        <MessageSquare size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-primary transition-colors">Instagram</p>
                                        <p className="font-bold text-lg">@fila0_ok</p>
                                    </div>
                                </div> */}
                            </div>
                        </div>

                        <div className="bg-white rounded-[3rem] p-10 text-charcoal shadow-2xl">
                            {window.location.search.includes('sent=true') ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <Heart size={40} fill="currentColor" />
                                    </div>
                                    <h3 className="text-2xl font-black text-charcoal">¡Mensaje enviado!</h3>
                                    <p className="text-slate-500 font-medium whitespace-pre-line">
                                        Gracias por escribirnos.
                                        Nos pondremos en contacto con vos muy pronto.
                                    </p>
                                    <button
                                        onClick={() => window.history.replaceState({}, '', window.location.pathname)}
                                        className="text-primary font-bold text-sm hover:underline"
                                    >
                                        Enviar otro mensaje
                                    </button>
                                </div>
                            ) : (
                                <form
                                    className="space-y-6"
                                    action="https://formsubmit.co/hola@fila0.com"
                                    method="POST"
                                >
                                    {/* FormSubmit Configuration */}
                                    <input type="hidden" name="_subject" value="Nuevo contacto desde Fila0 Landing!" />
                                    <input type="hidden" name="_template" value="table" />
                                    <input type="hidden" name="_next" value={window.location.origin + window.location.pathname + "?app=landing&sent=true"} />

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tu Nombre</label>
                                        <input type="text" name="name" required className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Escribí aquí..." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email</label>
                                        <input type="email" name="email" required className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="tu@empresa.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">¿Cómo podemos ayudarte?</label>
                                        <textarea name="message" required rows={4} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary outline-none transition-all resize-none" placeholder="Contanos sobre tu proyecto..."></textarea>
                                    </div>
                                    <button type="submit" className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm">
                                        Enviar Mensaje
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-charcoal text-white border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center space-y-8">
                    <div className="flex items-center gap-2 opacity-50">
                        <span className="text-2xl font-extrabold tracking-tight">Fila0</span>
                        <div className="bg-white text-charcoal rounded-md p-1 transform -rotate-12">
                            <Ticket size={16} fill="currentColor" />
                        </div>
                    </div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">
                        © 2026 Fila0 Inc. • Tranquilidad en cada espera.
                    </p>
                </div>
            </footer>
        </div>
    );
}
