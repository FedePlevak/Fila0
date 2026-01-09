import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { storageService } from '../../services/storageService';
import { Product } from '../../types';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// New or existing utility for Modal? Using inline for now to be fast.
function ProductModal({
    product,
    onSave,
    onCancel,
    foodTruckId
}: {
    product: Partial<Product> | null,
    onSave: (p: Partial<Product>) => Promise<void>,
    onCancel: () => void,
    foodTruckId: string
}) {
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        description: '',
        price: 0,
        category: 'General',
        image_url: '',
        is_base_product: true,
        available: true,
        ...product
    });
    const [uploading, setUploading] = useState(false);

    // If editing, init with product
    useEffect(() => {
        if (product) {
            setFormData({
                name: '', description: '', price: 0, category: 'General', image_url: '', is_base_product: true, available: true,
                ...product
            });
        }
    }, [product]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const url = await storageService.uploadImage(file, `products/${foodTruckId}`);
        if (url) {
            setFormData(prev => ({ ...prev, image_url: url }));
        }
        setUploading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-charcoal dark:text-white">
                        {product?.id ? 'Editar Producto' : 'Nuevo Producto'}
                    </h3>
                    <button onClick={onCancel} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><X size={20} /></button>
                </div>

                <div className="space-y-4">
                    {/* Image Upload */}
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-200 dark:border-slate-700">
                            {formData.image_url ? (
                                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400"><ImageIcon size={24} /></div>
                            )}
                            {uploading && <div className="absolute inset-0 bg-black/30 flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>}
                        </div>
                        <label className="cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl font-bold text-xs transition-colors">
                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                            Subir Imagen
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 block">Nombre</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 font-bold text-charcoal dark:text-white text-sm"
                                placeholder="Ej. Burger Doble"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 block">Precio</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 font-bold text-charcoal dark:text-white text-sm"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Descripción</label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 font-medium text-slate-600 dark:text-slate-300 text-sm resize-none"
                            placeholder="Ingredientes y detalles..."
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Categoría</label>
                        {/* Simple text input for now, could be dropdown */}
                        <input
                            type="text"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 font-bold text-charcoal dark:text-white text-sm"
                            placeholder="Ej. Hamburguesas, Bebidas..."
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="available"
                            checked={formData.available}
                            onChange={e => setFormData({ ...formData, available: e.target.checked })}
                            className="w-5 h-5 rounded-md text-primary focus:ring-primary"
                        />
                        <label htmlFor="available" className="text-sm font-bold text-charcoal dark:text-white cursor-pointer">Disponible para venta</label>
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <button onClick={onCancel} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors">Cancelar</button>
                    <button onClick={() => onSave(formData)} className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-lg active:scale-95">Guardar</button>
                </div>
            </div>
        </div>
    );
}

export default function MenuConfig() {
    const navigate = useNavigate();
    const vendorId = 'e1234567-e89b-12d3-a456-426614174001'; // Default fixed
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('food_truck_id', vendorId)
            .order('category', { ascending: true });

        if (data && !error) {
            // Map types if necessary or simple cast if DB matches
            // DB uses snake_case, frontend uses snake_case too mostly for new schema
            setProducts(data as Product[]);
        }
        setLoading(false);
    }

    const handleEdit = (p: Product) => {
        setEditingProduct(p);
        setIsModalOpen(true);
    };

    const handleNew = () => {
        setEditingProduct(null); // Clean state
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) {
            setProducts(products.filter(p => p.id !== id));
        } else {
            alert(error.message);
        }
    };

    const saveProduct = async (productData: Partial<Product>) => {
        // Prepare payload
        const payload = {
            food_truck_id: vendorId,
            name: productData.name,
            description: productData.description,
            price: productData.price,
            category: productData.category,
            image_url: productData.image_url,
            is_base_product: productData.is_base_product,
            available: productData.available
        };

        let error;
        if (editingProduct?.id) {
            // Update
            const { error: err } = await supabase
                .from('products')
                .update(payload)
                .eq('id', editingProduct.id);
            error = err;
        } else {
            // Insert
            const { error: err } = await supabase
                .from('products')
                .insert(payload);
            error = err;
        }

        if (!error) {
            setIsModalOpen(false);
            fetchProducts(); // Refresh list
        } else {
            alert('Error saving: ' + error.message);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

    // Group items by category
    const categories = Array.from(new Set(products.map(p => p.category || 'Sin Categoría')));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-xl font-black text-charcoal dark:text-white tracking-tight">Gestión de Menú</h1>
                    </div>
                    <button onClick={handleNew} className="bg-primary text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-[#3d5460] transition-colors shadow-lg active:scale-95">
                        <Plus size={18} /> Nuevo Item
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8 space-y-10">
                {categories.map(cat => (
                    <section key={cat}>
                        <h2 className="text-lg font-black text-charcoal dark:text-white mb-4 flex items-center gap-3">
                            {cat}
                            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded-full">{products.filter(p => p.category === cat).length}</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {products.filter(p => p.category === cat).map(product => (
                                <div key={product.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex gap-4 hover:shadow-md transition-all group">
                                    <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-charcoal dark:text-white truncate pr-2">{product.name}</h3>
                                            <span className={`w-2 h-2 rounded-full shrink-0 mt-2 ${product.available ? 'bg-green-500' : 'bg-red-400'}`}></span>
                                        </div>
                                        <p className="text-xs text-slate-400 line-clamp-2 mt-1 min-h-[2.5em]">{product.description}</p>
                                        <div className="flex justify-between items-end mt-2">
                                            <span className="font-black text-primary dark:text-white">${product.price.toFixed(2)}</span>
                                            <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(product)} className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 hover:text-primary transition-colors"><Edit2 size={14} /></button>
                                                <button onClick={() => handleDelete(product.id)} className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-500 hover:bg-red-100 transition-colors"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}

                {products.length === 0 && (
                    <div className="text-center py-20 text-slate-400">
                        <p>No hay productos en el menú.</p>
                        <button onClick={handleNew} className="text-primary font-bold mt-2">Crear el primero</button>
                    </div>
                )}
            </main>

            {isModalOpen && (
                <ProductModal
                    product={editingProduct}
                    onSave={saveProduct}
                    onCancel={() => setIsModalOpen(false)}
                    foodTruckId={vendorId}
                />
            )}
        </div>
    );
}
