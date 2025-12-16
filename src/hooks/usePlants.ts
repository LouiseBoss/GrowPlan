// src/hooks/usePlants.ts

import { useState, useEffect } from "react";
import { getAllPlants } from "../services/plantsService"; // Använder din existerande getAllPlants
import { type PlantListItem } from "../types/Plant"; // Använder list-typen

/**
 * Hook för att hämta alla växter från Supabase.
 * Returnerar växterna, laddningsstatus och felstatus.
 */
export const usePlants = () => {
    // Sätter initiala värden
    const [plants, setPlants] = useState<PlantListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchPlants = async () => {
            setLoading(true);
            setError(null);

            try {
                // Anropar din servicefunktion
                const data = await getAllPlants(); 
                
                // Om data finns, sätt den.
                setPlants(data ?? []);
            } catch (err) {
                console.error("Fel vid hämtning av växter i usePlants:", err);
                setError(err as Error);
                setPlants([]); 
            } finally {
                setLoading(false);
            }
        };

        fetchPlants();
    }, []); 

    return { plants, loading, error };
};