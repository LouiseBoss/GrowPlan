import { useParams } from "react-router";
import { supabase } from "../services/supabaseClient";
import { useEffect, useState } from "react";
import { type User } from "@supabase/supabase-js";
import { type Plant } from "../types/Plant";
import { getImageUrl } from "../utils/getImageUrl";
import {
    getPlantById,
    addPlantToGarden,
    removePlantFromGarden,
    isPlantInGarden,
    isPlantOnWishlist,
    togglePlantWishlist
} from "../services/plantsService";

const PlantDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const plantId = Number(id);

    const [plant, setPlant] = useState<Plant | null>(null);

    const [user, setUser] = useState<User | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [isOnWishlist, setIsOnWishlist] = useState(false);

    const [gardenActionLoading, setGardenActionLoading] = useState(false);
    const [wishlistActionLoading, setWishlistActionLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                console.log("Försöker hämta ID:", plantId);
                const fetchedPlant = await getPlantById(plantId);
                console.log("Resultat från service:", fetchedPlant);
                setPlant(fetchedPlant);

                if (!fetchedPlant) {
                    setIsLoading(false);
                    return;
                }

                const { data: userData } = await supabase.auth.getUser();
                const loggedInUser = userData.user;
                setUser(loggedInUser);

                if (loggedInUser) {
                    const userId = loggedInUser.id;

                    const savedStatus = await isPlantInGarden(userId, plantId);
                    setIsSaved(savedStatus);

                    const wishlistStatus = await isPlantOnWishlist(userId, plantId);
                    setIsOnWishlist(wishlistStatus);
                }

            } catch (error) {
                console.error("Fel vid hämtning av data:", error);
                setPlant(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [plantId]);

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

    const handleWishlistToggle = async () => {
        if (!user) return alert("Du måste vara inloggad för att hantera din önskelista.");
        if (!plant) return;

        setWishlistActionLoading(true);
        try {
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
                <h1>{plant.name} {plant.latin_name ? `(${plant.latin_name})` : ''}</h1>

                <button
                    onClick={handleWishlistToggle}
                    disabled={!user || wishlistActionLoading}
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

            <img
                src={getImageUrl(plant.image)}
                alt={plant.name}
                style={{
                    maxWidth: "300px",
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: "8px"
                }}
            />

            <p>{plant.description}</p>

            <h3>Skötsel</h3>
            <ul>
                <li>Vattning: {plant.watering.interval} ({plant.watering.months.join(", ")})</li>
                <li>Beskärning: {plant.pruning.notes ? plant.pruning.notes : 'Ej angivet'} ({plant.pruning.months.join(", ")})</li>
                <li>Plantering: {plant.planting.months.join(", ")}</li>
                <li>Gödsla: {plant.fertilizing.months.join(", ")}</li>
                <li>Vinter: {plant.winter.months.join(", ")}</li>
            </ul>

            <button
                onClick={handleGardenToggle}
                disabled={!user || gardenActionLoading}
                style={{ backgroundColor: isSaved ? '#dc3545' : '#28a745', color: 'white' }}
            >
                {gardenActionLoading
                    ? "Uppdaterar..."
                    : isSaved
                        ? "🗑 Ta bort från Trädgård"
                        : "🌱 Lägg till i min Trädgård"}
            </button>

            {!user && (
                <p style={{ color: "red" }}>
                    Logga in för att spara växter
                </p>
            )}
        </div>
    );
}

export default PlantDetailPage;