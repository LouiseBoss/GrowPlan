import { useState, useEffect } from "react";
import { getAllPlants } from "../services/plantsService"; 
import { type PlantListItem } from "../types/Plant";

export const usePlants = () => {
    const [plants, setPlants] = useState<PlantListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchPlants = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getAllPlants(); 
                
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