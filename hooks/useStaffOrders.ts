import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export interface StaffOrder {
    id: string;
    status: string;
    total: number;
    payment_status: string;
    created_at: string;
    order_number: number;
    items: {
        name: string;
        quantity: number;
    }[];
}

export function useStaffOrders(vendorId: string) {
    const [orders, setOrders] = useState<StaffOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!vendorId) return;

        async function fetchOrders() {
            const { data, error } = await supabase
                .from('orders')
                .select(`
          id, status, total, payment_status, created_at, order_number,
          order_items (
            quantity,
            menu_items (name)
          )
        `)
                .eq('vendor_id', vendorId)
                .order('created_at', { ascending: false });

            if (data) {
                setOrders(formatOrders(data));
            }
            setLoading(false);
        }

        fetchOrders();

        const channel = supabase
            .channel(`staff-orders-${vendorId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders', filter: `vendor_id=eq.${vendorId}` },
                () => {
                    fetchOrders(); // Reload on any change
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [vendorId]);

    return { orders, loading };
}

function formatOrders(data: any[]): StaffOrder[] {
    return data.map(o => ({
        id: o.id,
        status: o.status,
        total: o.total,
        payment_status: o.payment_status,
        created_at: new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        order_number: o.order_number,
        items: o.order_items.map((oi: any) => ({
            name: oi.menu_items.name,
            quantity: oi.quantity
        }))
    }));
}
