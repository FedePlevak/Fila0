import { supabase } from './supabaseClient';

export const storageService = {
    async uploadImage(file: File, path: string): Promise<string | null> {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${path}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('fila0-assets')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('fila0-assets')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    }
};
