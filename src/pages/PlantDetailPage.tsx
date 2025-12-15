import { useParams } from "react-router-dom";
import plants from "../data/plants.json";
import { supabase } from "../services/supabaseClient";
import { useEffect, useState } from "react";
import { type User } from "@supabase/supabase-js";
import { 
    addPlantToGarden, 
    removePlantFromGarden, 
    isPlantInGarden,
    isPlantOnWishlist, // Ny funktion (Steg 2)
    togglePlantWishlist // Ny funktion (Steg 2)
} from "../services/plantsService";

// Definiera typen för en växt (baserat på din plants.json)
type Plant = {
    id: number;
    name: string;
    image: string;
    description: string;
    watering: { interval: string; months: string[] };
    pruning: { months: string[] };
    planting: { months: string[] };
    fertilizing: { months: string[] };
    winter: { months: string[] };
};

const PlantDetailPage = () => {
    const { id } = useParams<{ id: string }>(); // Typa useParams
    const plantId = Number(id);
    const plant: Plant | undefined = plants.find((p) => p.id === plantId); 
    
    // Använd User-typen från Supabase.js
    const [user, setUser] = useState<User | null>(null); 
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [isOnWishlist, setIsOnWishlist] = useState(false); // NYTT STATE
    
    const [gardenActionLoading, setGardenActionLoading] = useState(false);
    const [wishlistActionLoading, setWishlistActionLoading] = useState(false); // NYTT STATE

    // Hämta användaren och båda statusarna (Trädgård & Önskelista)
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const { data: userData } = await supabase.auth.getUser();
                const loggedInUser = userData.user;
                setUser(loggedInUser);

                if (loggedInUser) {
                    const userId = loggedInUser.id;
                    
                    // Hämta Trädgård-status
                    const savedStatus = await isPlantInGarden(userId, plantId);
                    setIsSaved(savedStatus);
                    
                    // Hämta Önskelista-status
                    const wishlistStatus = await isPlantOnWishlist(userId, plantId);
                    setIsOnWishlist(wishlistStatus);
                }

            } catch (error) {
                console.error("Fel vid hämtning av data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [plantId]);

    // Funktion för att lägga till/ta bort från Trädgården
    const handleGardenToggle = async () => {
        if (!user) return alert("Du måste vara inloggad för att hantera din trädgård.");
        if (!plant) return;
        
        setGardenActionLoading(true);
        try {
            if (isSaved) {
                await removePlantFromGarden(user.id, plant.id);
                setIsSaved(false);
            } else {
                await addPlantToGarden(user.id, plant.id);
                setIsSaved(true);
            }
        } catch (error) {
            console.error("Fel vid hantering av trädgård:", error);
            alert("Kunde inte uppdatera trädgården. Försök igen.");
        } finally {
            setGardenActionLoading(false);
        }
    };
    
    // NY FUNKTION: För att lägga till/ta bort från Önskelistan
    const handleWishlistToggle = async () => {
        if (!user) return alert("Du måste vara inloggad för att hantera din önskelista.");
        if (!plant) return;
        
        setWishlistActionLoading(true);
        try {
            // Vi använder den nya toggle-funktionen från servicen
            const newStatus = await togglePlantWishlist(user.id, plant.id, isOnWishlist); 
            setIsOnWishlist(newStatus);
        } catch (error) {
            console.error("Fel vid hantering av önskelista:", error);
            alert("Kunde inte uppdatera önskelistan. Försök igen.");
        } finally {
            setWishlistActionLoading(false);
        }
    };

    if (isLoading) return <h2>Laddar information...</h2>;
    if (!plant) return <h2>Växt hittades inte</h2>;
    
    const isActionDisabled = !user || gardenActionLoading || wishlistActionLoading;

    return (
        <div className="plant-detail">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>{plant.name}</h1>
                
                {/* NY KNAPP FÖR ÖNSKELISTA */}
                <button 
                    onClick={handleWishlistToggle} 
                    disabled={isActionDisabled}
                    title={isOnWishlist ? "Ta bort från önskelista" : "Lägg till på önskelista"}
                    style={{ 
                        fontSize: '24px', 
                        background: 'none', 
                        border: 'none', 
                        cursor: isActionDisabled ? 'not-allowed' : 'pointer',
                        color: isOnWishlist ? 'red' : 'gray' 
                    }}
                >
                    {wishlistActionLoading ? "..." : (isOnWishlist ? "❤️" : "🤍")}
                </button>
            </div>

            <img src={plant.image} alt={plant.name} />

            <p>{plant.description}</p>

            <h3>Skötsel</h3>
            <ul>
                <li>Vattning: {plant.watering.interval} ({plant.watering.months.join(", ")})</li>
                <li>Beskärning: {plant.pruning.months.join(", ")}</li>
                <li>Plantering: {plant.planting.months.join(", ")}</li>
                <li>Gödsla: {plant.fertilizing.months.join(", ")}</li>
                <li>Vinter: {plant.winter.months.join(", ")}</li>
            </ul>

            <button 
                onClick={handleGardenToggle} 
                disabled={isActionDisabled}
                style={{ backgroundColor: isSaved ? '#dc3545' : '#28a745', color: 'white' }}
            >
                {gardenActionLoading 
                    ? "Uppdaterar..." 
                    : isSaved 
                        ? "🗑 Ta bort från Trädgård" 
                        : "🌱 Lägg till i min Trädgård"}
            </button>
            
            {!user && <p style={{ color: 'red', marginTop: '10px' }}>Logga in för att hantera dina listor.</p>}
        </div>
    );
}

export default PlantDetailPage;