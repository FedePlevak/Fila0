import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { OrderStatus } from '../types';

export function useOrderTracking(orderId: string | undefined) {
    const [status, setStatus] = useState<OrderStatus>('created');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId) return;

        // 1. Initial fetch
        async function fetchStatus() {
            const { data, error } = await supabase
                .from('orders')
                .select('status')
                .eq('id', orderId)
                .single();

            if (data && !error) {
                setStatus(data.status as OrderStatus);
            }
            setLoading(false);
        }

        fetchStatus();

        // 2. Real-time subscription
        const channel = supabase
            .channel(`order-${orderId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `id=eq.${orderId}`
                },
                (payload) => {
                    setStatus(payload.new.status as OrderStatus);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [orderId]);

    return { status, loading };
}
