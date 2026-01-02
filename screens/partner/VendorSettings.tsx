import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Save, Loader2, Store, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { storageService } from '../../services/storageService';

export default function VendorSettings() {
    const navigate = useNavigate();
    const vendorId = 'e1234567-e89b-12d3-a456-426614174001'; // Default fixed ID for demo
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [vendor, setVendor] = useState<any>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        async function fetchVendor() {
            try {
                const { data, error } = await supabase
                    .from('vendors')
                    .select('*')
                    .eq('id', vendorId)
                    .single();

                if (error) throw error;
                if (data) {
                    setVendor(data);
                    setName(data.name);
                    setDescription(data.description || '');
                    setImageUrl(data.image_url || '');
                }
            } catch (err: any) {
                console.error('Error fetching vendor:', err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchVendor();
    }, [vendorId]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSaving(true);
        const url = await storageService.uploadImage(file, `vendors/${vendorId}`);
        if (url) {
            setImageUrl(url);
        }
        setSaving(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setSuccess(false);
        try {
            const { error } = await supabase
                .from('vendors')
                .update({
                    name,
                    description,
                    image_url: imageUrl
                })
                .eq('id', vendorId);

            if (error) throw error;
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            alert('Error al guardar: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-xl font-black text-charcoal dark:text-white tracking-tight">Preferencias del Puesto</h1>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-primary hover:bg-[#3d5460] text-white px-6 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : success ? <CheckCircle2 size={18} /> : <Save size={18} />}
                        {success ? 'Guardado' : 'Guardar Cambios'}
                    </button>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-12">
                {/* Branding Section */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2.5 rounded-xl">
                            <Store className="text-primary" size={20} />
                        </div>
                        <h2 className="text-lg font-black text-charcoal dark:text-white uppercase tracking-widest text-xs">Identidad de Marca</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Profile Image */}
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Logo / Foto Principal</label>
                            <div className="relative group">
                                <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-xl">
                                    <img
                                        src={imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80'}
                                        alt="Current branding"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-[2.5rem]">
                                    <div className="bg-white p-4 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                        <Camera className="text-primary" size={24} />
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium text-center italic">Calidad sugerida: 800x800px (JPG/PNG)</p>
                        </div>

                        {/* Text Info */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Nombre del Puesto</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="Ej: La Hamburguesería"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Eslogan / Descripción Corta</label>
                                <textarea
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-medium text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                    placeholder="Cuéntale a tus clientes qué hace especial a tu comida..."
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="bg-primary/5 dark:bg-primary/10 rounded-3xl p-6 border border-primary/10 flex gap-4">
                    <ImageIcon className="text-primary shrink-0" size={24} />
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        <span className="font-bold text-primary block mb-1">Nota sobre las imágenes:</span>
                        La foto principal se mostrará tanto en el listado de puestos como en el encabezado de tu menú. Asegúrate de que los colores contrasten bien con el texto blanco.
                    </p>
                </div>
            </main>
        </div>
    );
}
