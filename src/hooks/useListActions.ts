import { useCallback } from 'react';
import { type User } from '@supabase/supabase-js';
import {
    removePlantFromGarden,
    togglePlantWishlist 
} from '../services/plantsService';
import { toast } from 'react-toastify';

export const useListActions = (user: User | null, refetchList: () => void) => {

    const handleRemove = useCallback(async (plantId: number, listType: 'garden' | 'wishlist') => {
        if (!user) {
            toast.error("Du måste vara inloggad för att ta bort växter.");
            return;
        }

        try {
            if (listType === 'garden') {
                await removePlantFromGarden(user.id, plantId);
                toast.success(`Växt borttagen från Trädgården.`);

            } else if (listType === 'wishlist') {
                await togglePlantWishlist(user.id, plantId, true);
                toast.success(`Växt borttagen från Önskelistan.`);
            }

            refetchList();

        } catch (error) {
            console.error(`Fel vid borttagning från ${listType}:`, error);
            toast.error("Kunde inte ta bort växten. Försök igen.");
        }
    }, [user, refetchList]);

    return { handleRemove };
};