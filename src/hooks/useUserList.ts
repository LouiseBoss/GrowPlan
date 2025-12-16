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

    const fetchAllIds = useCallback(async () => {
        if (!user) {
            setPlantIds([]);
            setLoading(false);
            setTotalPages(0);
            return;
        }

        try {
            setLoading(true);
            const ids = await idFetcher(user.id);
            setPlantIds(ids);

            const calculatedTotalPages = Math.ceil(ids.length / ITEMS_PER_PAGE);
            setTotalPages(calculatedTotalPages);

        } catch (error) {
            console.error("Kunde inte ladda listans ID:n:", error);
            toast.error("Kunde inte ladda listans ID:n.");
            setPlantIds([]);
        } finally {
            setLoading(false);
        }
    }, [user, idFetcher]);


    const fetchPageDetails = useCallback(async () => {
        if (plantIds.length === 0) {
            setPlants([]);
            return;
        }

        setLoading(true);

        const start = page * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const idsForPage = plantIds.slice(start, end);

        try {
            const plantDetails = await getPlantListItemsByIds(idsForPage);
            setPlants(plantDetails);
        } catch (error) {
            console.error("Kunde inte ladda detaljerna för denna sida:", error);
            toast.error("Kunde inte ladda detaljerna för denna sida.");
            setPlants([]);
        } finally {
            setLoading(false);
        }

    }, [plantIds, page]);


    useEffect(() => {
        fetchAllIds();
    }, [fetchAllIds]);

    useEffect(() => {
        if (totalPages > 0 && page >= totalPages) {
            setPage(Math.max(0, totalPages - 1));
        } else if (plantIds.length === 0 && page !== 0) {
            setPage(0);
        }
    }, [plantIds.length, totalPages, page]);


    useEffect(() => {
        if (plantIds.length > 0 || !loading) {
            fetchPageDetails();
        }
    }, [fetchPageDetails, plantIds, loading]);


    const handleNext = () => setPage((p) => Math.min(p + 1, totalPages - 1));
    const handlePrev = () => setPage((p) => Math.max(p - 1, 0));

    const refetch = () => fetchAllIds();

    return {
        plants,
        loading,
        refetch,
        page,
        totalPages,
        onNext: handleNext,
        onPrev: handlePrev,
        ITEMS_PER_PAGE
    };
};