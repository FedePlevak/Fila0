import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { MenuItem } from '../types';

export function useMenu(vendorId: string | undefined) {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!vendorId) return;

        async function fetchMenu() {
            try {
                const { data, error } = await supabase
                    .from('menu_items')
                    .select('*')
                    .eq('vendor_id', vendorId);

                if (error) throw error;

                const mappedItems: MenuItem[] = (data || []).map(item => ({
                    id: item.id,
                    vendorId: item.vendor_id,
                    name: item.name,
                    description: item.description || '',
                    price: item.price,
                    image: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80',
                    category: item.category || 'General',
                    popular: false
                }));

                setItems(mappedItems);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchMenu();
    }, [vendorId]);

    return { items, loading, error };
}
