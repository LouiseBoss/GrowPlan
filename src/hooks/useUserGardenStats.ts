import { useState, useEffect } from 'react';
import { type User } from '@supabase/supabase-js';
import { 
    countUserPlantsInGarden, 
    countUserWishlistItems 
} from '../services/plantsService'; 

interface GardenStats {
    totalPlants: number;
    wishlistItems: number;
    loading: boolean;
}

export const useUserGardenStats = (user: User | null): GardenStats => {
    const [stats, setStats] = useState<GardenStats>({
        totalPlants: 0,
        wishlistItems: 0,
        loading: true,
    });

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) {
                setStats({ totalPlants: 0, wishlistItems: 0, loading: false });
                return;
            }

            setStats(prev => ({ ...prev, loading: true }));
            
            try {
                const plantCount = await countUserPlantsInGarden(user.id);
                const wishlistCount = await countUserWishlistItems(user.id);
                
                setStats({
                    totalPlants: plantCount,
                    wishlistItems: wishlistCount,
                    loading: false,
                });
            } catch (error) {
                console.error("Fel vid hämtning av trädgårdsstatistik:", error);
                setStats({ totalPlants: 0, wishlistItems: 0, loading: false });
            }
        };

        fetchStats();
    }, [user]);

    return stats;
};