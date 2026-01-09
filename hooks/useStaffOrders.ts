import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Order } from '../types';

export function useStaffOrders(foodTruckPlazaId: string) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!foodTruckPlazaId) return;

        async function fetchOrders() {
            // Modificamos la query para traer los campos nuevos (snapshot, pickup_code)
            const { data, error } = await supabase
                .from('orders')
                .select('*') // Select all since we need snapshot and other fields
                .eq('food_truck_plaza_id', foodTruckPlazaId)
                .neq('status', 'cancelled_unpaid') // Hide cancelled unpaid
                .neq('status', 'delivered') // Optionally hide delivered from active board
                .order('created_at', { ascending: false });

            if (data) {
                setOrders(data as Order[]);
            }
            if (error) {
                console.error('Error fetching orders:', error);
            }
            setLoading(false);
        }

        fetchOrders();

        const channel = supabase
            .channel(`staff-orders-${foodTruckPlazaId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders', filter: `food_truck_plaza_id=eq.${foodTruckPlazaId}` },
                () => {
                    fetchOrders(); // Reload on any change
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [foodTruckPlazaId]);

    return { orders, loading };
}
