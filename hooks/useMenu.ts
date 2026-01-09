import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Product } from '../types';

export function useMenu(foodTruckId: string | undefined) {
    const [items, setItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!foodTruckId) return;

        async function fetchMenu() {
            try {
                // Query 'products' table, matching new schema
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('food_truck_id', foodTruckId)
                    .eq('available', true);

                if (error) throw error;

                // Data matches Product interface mostly, but DB uses snake_case and ID
                const mappedItems: Product[] = (data || []).map(item => ({
                    id: item.id,
                    food_truck_id: item.food_truck_id,
                    name: item.name,
                    description: item.description || '',
                    price: item.price,
                    image_url: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80',
                    is_base_product: item.is_base_product,
                    base_ingredients: item.base_ingredients,
                    available: item.available,
                    category: item.category || 'General'
                }));

                setItems(mappedItems);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchMenu();
    }, [foodTruckId]);

    return { items, loading, error };
}
