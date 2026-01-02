import React from 'react';
import { LayoutDashboard, Users, Store, Settings } from 'lucide-react';

export default function Organizer() {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-6 space-y-8">
                <div className="text-2xl font-black text-primary tracking-tighter">Fila0 Org</div>
                <nav className="flex-grow space-y-2">
                    <button className="w-full flex items-center gap-3 p-4 bg-primary/10 text-primary rounded-2xl font-bold text-sm">
                        <LayoutDashboard size={20} /> Dashboard
                    </button>
                    <button className="w-full flex items-center gap-3 p-4 text-slate-400 hover:bg-slate-50 rounded-2xl font-bold text-sm transition-colors">
                        <Store size={20} /> FoodTrucks
                    </button>
                    <button className="w-full flex items-center gap-3 p-4 text-slate-400 hover:bg-slate-50 rounded-2xl font-bold text-sm transition-colors">
                        <Users size={20} /> Staff
                    </button>
                </nav>
                <button className="flex items-center gap-3 p-4 text-slate-400 hover:text-charcoal font-bold text-sm">
                    <Settings size={20} /> Configuración
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-12">
                <header className="mb-12">
                    <h1 className="text-3xl font-black text-charcoal">Gestión de Plaza</h1>
                    <p className="text-slate-500 font-medium">Patio de Comidas Palermo - Control de puestos asociados.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Ventas Hoy" value="$12,450" change="+12%" />
                    <StatCard title="Pedidos Totales" value="245" change="+5%" />
                    <StatCard title="Puestos Activos" value="8 / 10" />
                    <StatCard title="Tiempo Promedio" value="14 min" change="-2 min" />
                </div>
            </main>
        </div>
    );
}

function StatCard({ title, value, change }: { title: string, value: string, change?: string }) {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
            <div className="flex items-end justify-between">
                <p className="text-2xl font-black text-charcoal">{value}</p>
                {change && <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>{change}</span>}
            </div>
        </div>
    );
}
