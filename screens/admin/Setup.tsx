import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Ticket, Database, Check, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Setup() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean, message: string } | null>(null);
    const navigate = useNavigate();

    const handleSeed = async () => {
        setLoading(true);
        setResult(null);
        try {
            // 1. Crear Plaza (Antes Organization)
            const plazaSlug = 'palermo-soho';
            const { data: existingPlaza } = await supabase.from('plazas').select('id').eq('slug', plazaSlug).single();
            const plazaId = existingPlaza?.id || crypto.randomUUID();

            const { error: plazaError } = await supabase.from('plazas').upsert({
                id: plazaId,
                name: 'Patio de Comidas Palermo',
                slug: plazaSlug,
                status: 'active'
            });
            if (plazaError) throw new Error('Error creating plaza: ' + plazaError.message);

            // 2. Crear Food Trucks (Entidades Globales)
            const truck1Id = 'e1234567-e89b-12d3-a456-426614174001';
            const truck2Id = 'e1234567-e89b-12d3-a456-426614174002';

            const trucks = [
                { id: truck1Id, name: 'La Hamburguesería', slug: 'la-hamburgueseria', description: 'Artesanales y rústicas', logo_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80' },
                { id: truck2Id, name: 'Tacos El Güero', slug: 'tacos-el-guero', description: 'Auténticos tacos mexicanos', logo_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865202?auto=format&fit=crop&q=80' }
            ];

            const { error: truckError } = await supabase.from('food_trucks').upsert(trucks);
            if (truckError) throw new Error('Error creating trucks: ' + truckError.message);

            // 3. Relacionar Food Trucks con Plaza
            const relations = [
                { plaza_id: plazaId, food_truck_id: truck1Id, status: 'active' },
                { plaza_id: plazaId, food_truck_id: truck2Id, status: 'active' } // Ambos activos para probar
            ];

            const { error: relError } = await supabase.from('food_truck_plazas').upsert(relations, { onConflict: 'plaza_id, food_truck_id' });
            if (relError) throw new Error('Error linking trucks: ' + relError.message);

            // 4. Crear Productos (Menú)
            // Borramos productos viejos para este truck si limpiamos? No, Upsert.
            const products = [
                { food_truck_id: truck1Id, name: 'Classic Smashed', price: 12500, category: 'Hamburguesas', available: true, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80', is_base_product: true },
                { food_truck_id: truck1Id, name: 'Bacon King', price: 14000, category: 'Hamburguesas', available: true, image_url: 'https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&q=80', is_base_product: true },
                { food_truck_id: truck2Id, name: 'Tacos Pastor x3', price: 9000, category: 'Tacos', available: true, image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865202?auto=format&fit=crop&q=80', is_base_product: true }
            ];

            // Upsert requiere ID si queremos actualizar, aquí dejamos que genere nuevos o intentamos matchear por nombres? 
            // Para seeding determinista, mejor generar UUIDs si es necesario, o borrar e insertar.
            // Por simplicidad, borramos e insertamos para este demo setup.
            await supabase.from('products').delete().in('food_truck_id', [truck1Id, truck2Id]);
            const { error: prodError } = await supabase.from('products').insert(products);

            if (prodError) throw new Error('Error creating products: ' + prodError.message);

            setResult({ success: true, message: '¡Base de datos Fila0 v2 inicializada con éxito!' });
        } catch (err: any) {
            console.error(err);
            setResult({ success: false, message: 'Error: ' + err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-8">
                <div className="text-center">
                    <div className="inline-flex bg-primary/10 p-4 rounded-2xl text-primary mb-4">
                        <Ticket size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-charcoal tracking-tight">Admin Setup Fila0</h1>
                    <p className="text-slate-500 text-sm mt-2">Inicializa la base de datos v2 con Plazas y FoodTrucks.</p>
                </div>

                {result && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 ${result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {result.success ? <Check size={20} /> : <AlertCircle size={20} />}
                        <p className="text-xs font-bold">{result.message}</p>
                    </div>
                )}

                <button
                    onClick={handleSeed}
                    disabled={loading}
                    className="w-full bg-primary hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                    ) : (
                        <><Database size={20} /> Inicializar Datos v2</>
                    )}
                </button>

                <button
                    onClick={() => navigate('/')}
                    className="w-full text-slate-400 font-bold text-sm hover:text-primary transition-colors"
                >
                    Ir a la App
                </button>
            </div>
        </div>
    );
}
