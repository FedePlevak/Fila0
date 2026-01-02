import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Vendor } from '../types';

export function useVendors() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchVendors() {
            try {
                const { data, error } = await supabase
                    .from('vendors')
                    .select('*');

                if (error) throw error;

                // Map database fields to frontend fields if they differ
                const mappedVendors: Vendor[] = (data || []).map(v => ({
                    id: v.id,
                    name: v.name,
                    description: v.description,
                    image: v.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80',
                    rating: 4.5, // Default for now
                    waitTime: '15-20 min', // Default for now
                    category: 'Comida',
                    isOpen: v.is_open
                }));

                setVendors(mappedVendors);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchVendors();
    }, []);

    return { vendors, loading, error };
}

export function useVendor(id: string | undefined) {
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        async function fetchVendor() {
            try {
                const { data, error } = await supabase
                    .from('vendors')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                if (data) {
                    setVendor({
                        id: data.id,
                        name: data.name,
                        description: data.description,
                        image: data.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80',
                        rating: 4.5,
                        waitTime: '15-20 min',
                        category: 'Comida',
                        isOpen: data.is_open
                    });
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchVendor();
    }, [id]);

    return { vendor, loading, error };
}
