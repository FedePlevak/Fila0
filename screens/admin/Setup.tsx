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
            // 1. Check if organization already exists by slug
            const { data: existingOrg } = await supabase
                .from('organizations')
                .select('id')
                .eq('slug', 'palermo-soho')
                .single();

            const orgId = existingOrg?.id || crypto.randomUUID();

            // 2. Upsert Organization (using existing ID if found)
            const { error: orgError } = await supabase.from('organizations').upsert({
                id: orgId,
                name: 'Patio de Comidas Palermo',
                slug: 'palermo-soho'
            });
            if (orgError) throw orgError;

            // 3. Create Vendors with the determined orgId
            const vendor1Id = 'e1234567-e89b-12d3-a456-426614174001';
            const vendor2Id = 'e1234567-e89b-12d3-a456-426614174002';
            const vendor3Id = 'e1234567-e89b-12d3-a456-426614174003';

            const vendors = [
                { id: vendor1Id, org_id: orgId, name: 'La Hamburguesería', description: 'Artesanales y rústicas', is_open: true, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80' },
                { id: vendor2Id, org_id: orgId, name: 'Tacos El Güero', description: 'Auténticos tacos mexicanos', is_open: true, image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865202?auto=format&fit=crop&q=80' },
                { id: vendor3Id, org_id: orgId, name: 'Pizza Al Taglio', description: 'Estilo romano por porciones', is_open: true, image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80' }
            ];

            const { error: vendorError } = await supabase.from('vendors').upsert(vendors);
            if (vendorError) throw vendorError;

            // 4. Create Menu Items
            const menuItems = [
                { vendor_id: vendor1Id, name: 'Classic Smashed', price: 12.50, category: 'Hamburguesas', available: true, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80' },
                { vendor_id: vendor1Id, name: 'Bacon King', price: 14.00, category: 'Hamburguesas', available: true, image_url: 'https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&q=80' },
                { vendor_id: vendor2Id, name: 'Tacos Pastor x3', price: 9.00, category: 'Tacos', available: true, image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865202?auto=format&fit=crop&q=80' },
                { vendor_id: vendor3Id, name: 'Porción Muzarella', price: 4.50, category: 'Pizza', available: true, image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80' }
            ];

            const { error: menuError } = await supabase.from('menu_items').upsert(menuItems);
            if (menuError) throw menuError;

            setResult({ success: true, message: '¡Base de datos inicializada con éxito!' });
        } catch (err: any) {
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
                    <h1 className="text-2xl font-bold text-charcoal tracking-tight">Configuración Fila0</h1>
                    <p className="text-slate-500 text-sm mt-2">Inicializa la base de datos con datos de prueba para empezar a testear.</p>
                </div>

                {result && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 ${result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {result.success ? <Check size={20} /> : <AlertCircle size={20} />}
                        <p className="text-sm font-bold">{result.message}</p>
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
                        <><Database size={20} /> Inicializar Datos</>
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
