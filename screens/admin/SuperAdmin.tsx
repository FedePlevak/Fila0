import React from 'react';
import { Shield, MapPin, Trash2, Edit } from 'lucide-react';

export default function SuperAdmin() {
    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-black text-charcoal">Panel SuperAdmin</h1>
                    <p className="text-slate-500 font-medium">Gestionar plazas de comida y organizaciones globales.</p>
                </div>
                <div className="bg-primary text-white p-3 rounded-2xl shadow-lg">
                    <Shield size={24} />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Placeholder for Organizations */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-48">
                    <div>
                        <h3 className="font-bold text-lg text-charcoal">Patio de Comidas Palermo</h3>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><MapPin size={12} /> Palermo Soho, CABA</p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Edit size={20} /></button>
                        <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                    </div>
                </div>

                <button className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-primary hover:text-primary transition-all group h-48">
                    <span className="text-2xl font-bold">+ Nueva Plaza</span>
                </button>
            </div>
        </div>
    );
}
