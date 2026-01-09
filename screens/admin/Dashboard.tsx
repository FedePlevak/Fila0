import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Plaza, RelationStatus } from '../../types';
import { Store, Users, Settings, LogOut, Plus, Search, Power, MoreVertical, MapPin, Truck, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FoodTruckRelation {
    id: string; // food_truck_plaza_id
    status: RelationStatus;
    food_truck: {
        id: string;
        name: string;
        description: string;
        logo_url: string;
    };
}

export default function Dashboard() {
    const [plaza, setPlaza] = useState<Plaza | null>(null);
    const [trucks, setTrucks] = useState<FoodTruckRelation[]>([]);
    const [loading, setLoading] = useState(true);

    // TODO: Dynamic Plaza ID based on logged in user admin role
    const plazaSlug = 'palermo-soho';

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // 1. Fetch Plaza
                const { data: plazaData, error: plazaError } = await supabase
                    .from('plazas')
                    .select('*')
                    .eq('slug', plazaSlug)
                    .single();

                if (plazaError) throw plazaError;
                setPlaza(plazaData);

                // 2. Fetch Linked Trucks
                if (plazaData) {
                    const { data: truckData, error: truckError } = await supabase
                        .from('food_truck_plazas')
                        .select(`
                            id,
                            status,
                            food_truck:food_trucks (
                                id,
                                name,
                                description,
                                logo_url
                            )
                        `)
                        .eq('plaza_id', plazaData.id);

                    if (truckError) throw truckError;

                    // Safe cast needed because of joined query structure
                    setTrucks(truckData as any[]);
                }
            } catch (err: any) {
                console.error('Error fetching dashboard data:', err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const togglePlazaStatus = async () => {
        if (!plaza) return;
        const newStatus = plaza.status === 'active' ? 'closed' : 'active';

        const { error } = await supabase
            .from('plazas')
            .update({ status: newStatus })
            .eq('id', plaza.id);

        if (!error) {
            setPlaza({ ...plaza, status: newStatus as any });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!plaza) return <div className="p-8">Plaza no encontrada. Ejecuta /admin/setup primero.</div>;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-charcoal">
            {/* Sidebar / Navigation (Simplified for MVP) */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 hidden md:flex flex-col z-10">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <Store size={18} />
                        </div>
                        <span className="font-black text-xl tracking-tight">Fila0 Admin</span>
                    </div>

                    <nav className="space-y-1">
                        <a href="#" className="flex items-center gap-3 px-4 py-3 bg-slate-50 text-primary font-bold rounded-xl">
                            <Store size={20} /> Dashboard
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 font-medium rounded-xl transition-colors">
                            <Users size={20} /> Usuarios
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 font-medium rounded-xl transition-colors">
                            <Settings size={20} /> Configuración
                        </a>
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-slate-100">
                    <button className="flex items-center gap-3 text-slate-400 hover:text-red-500 transition-colors font-bold text-sm">
                        <LogOut size={18} /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            <main className="md:ml-64 p-8 max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex justify-between items-start mb-10">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight mb-2">{plaza.name}</h1>
                        <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                            <MapPin size={16} />
                            <span>Buenos Aires, Palermo</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full mx-1"></span>
                            <span className={plaza.status === 'active' ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
                                {plaza.status === 'active' ? 'Abierto al público' : 'Cerrado temporalmente'}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={togglePlazaStatus}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm border transition-all flex items-center gap-2 ${plaza.status === 'active' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'}`}
                        >
                            <Power size={18} />
                            {plaza.status === 'active' ? 'Cerrar Plaza' : 'Abrir Plaza'}
                        </button>
                    </div>
                </header>

                {/* KPI Cards (Placeholder) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                <Truck size={24} />
                            </div>
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">+12%</span>
                        </div>
                        <p className="text-slate-500 font-medium text-sm">Food Trucks Activos</p>
                        <h3 className="text-4xl font-black mt-1 text-charcoal">{trucks.length}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                                <Users size={24} />
                            </div>
                        </div>
                        <p className="text-slate-500 font-medium text-sm">Clientes Hoy</p>
                        <h3 className="text-4xl font-black mt-1 text-charcoal">1,204</h3>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                                <Ticket size={24} />
                            </div>
                        </div>
                        <p className="text-slate-500 font-medium text-sm">Pedidos en curso</p>
                        <h3 className="text-4xl font-black mt-1 text-charcoal">45</h3>
                    </div>
                </div>

                {/* Food Trucks list */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Food Trucks Gestionados</h2>
                        <button className="bg-charcoal text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors">
                            <Plus size={16} /> Invitar FoodTruck
                        </button>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                        {/* Toolbar */}
                        <div className="p-4 border-b border-slate-50 flex gap-4">
                            <div className="bg-slate-50 flex items-center px-4 py-2.5 rounded-xl flex-grow max-w-md">
                                <Search size={18} className="text-slate-400 mr-2" />
                                <input type="text" placeholder="Buscar por nombre..." className="bg-transparent border-none outline-none text-sm font-medium w-full" />
                            </div>
                        </div>

                        {/* List */}
                        <div className="divide-y divide-slate-50">
                            {trucks.map(relation => (
                                <div key={relation.id} className="p-4 hover:bg-slate-50 transition-colors group flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden relative">
                                            {relation.food_truck.logo_url && <img src={relation.food_truck.logo_url} className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-charcoal">{relation.food_truck.name}</h3>
                                            <p className="text-xs text-slate-400 font-medium line-clamp-1">{relation.food_truck.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-end">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${relation.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {relation.status}
                                            </span>
                                        </div>
                                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-400">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {trucks.length === 0 && (
                                <div className="p-10 text-center text-slate-400">
                                    No hay FoodTrucks asociados.
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
