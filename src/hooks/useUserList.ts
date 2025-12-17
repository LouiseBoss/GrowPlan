import { useState, useEffect, useCallback } from 'react';
import { type User } from '@supabase/supabase-js';
import { type PlantListItem } from '../types/Plant';
import { getPlantListItemsByIds } from '../services/plantsService';
import { toast } from 'react-toastify';

type IdFetcher = (userId: string) => Promise<number[]>;

const ITEMS_PER_PAGE = 15;

export const useUserList = (user: User | null, idFetcher: IdFetcher) => {
    const [plantIds, setPlantIds] = useState<number[]>([]);
    const [plants, setPlants] = useState<PlantListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // 1️⃣ Hämta ALLA ID:n (körs när user ändras eller refetch)
    const fetchAllIds = useCallback(async () => {
        if (!user) {
            setPlantIds([]);
            setPlants([]);
            setTotalPages(0);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const ids = await idFetcher(user.id);
            setPlantIds(ids);
            setTotalPages(Math.ceil(ids.length / ITEMS_PER_PAGE));
            setPage(0);
        } catch (error) {
            console.error(error);
            toast.error("Kunde inte ladda listan.");
            setPlantIds([]);
        } finally {
            setLoading(false);
        }
    }, [user, idFetcher]);


    // 2️⃣ Hämta detaljer för aktuell sida
    const fetchPageDetails = useCallback(async () => {
        if (plantIds.length === 0) {
            setPlants([]);
            return;
        }

        setLoading(true);

        const start = page * ITEMS_PER_PAGE;
        const idsForPage = plantIds.slice(start, start + ITEMS_PER_PAGE);

        try {
            const plantDetails = await getPlantListItemsByIds(idsForPage);
            setPlants(plantDetails);
        } catch (error) {
            console.error("Kunde inte ladda detaljer:", error);
            toast.error("Kunde inte ladda växterna.");
            setPlants([]);
        } finally {
            setLoading(false);
        }
    }, [plantIds, page]);

    // 3️⃣ Körs när användaren ändras
    useEffect(() => {
        fetchAllIds();
    }, [fetchAllIds]);

    // 4️⃣ Körs när page eller plantIds ändras
    useEffect(() => {
        fetchPageDetails();
    }, [fetchPageDetails]);

    const onNext = () => setPage((p) => Math.min(p + 1, totalPages - 1));
    const onPrev = () => setPage((p) => Math.max(p - 1, 0));

    return {
        plants,
        loading,
        refetch: fetchAllIds,
        page,
        totalPages,
        onNext,
        onPrev
    };
};
