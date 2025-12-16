import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { type User } from "@supabase/supabase-js";
import { type Plant, type CarePeriod } from "../types/Plant"; 
import { getImageUrl } from "../utils/getImageUrl";
import {
    getPlantById,
    addPlantToGarden,
    removePlantFromGarden,
    isPlantInGarden,
    isPlantOnWishlist,
    togglePlantWishlist
} from "../services/plantsService";
import { toast } from 'react-toastify'; 
import '../assets/scss/pages/PlantDetailPage.scss';


const renderCareGuideItem = (care: CarePeriod | undefined, title: string, icon: string) => {
    if (!care) return null;

    const monthsText = care.months && care.months.length > 0 ? care.months.join(', ') : 'När det behövs';
    
    return (
        <div className="care-guide-item">
            <span className="care-icon">{icon}</span>
            <div className="care-details">
                <p className="care-title">{title}</p>
                <small>Bäst under: {monthsText}</small>
                <p className="care-notes">{care.notes || care.interval || 'Ingen specifik anvisning.'}</p>
            </div>
        </div>
    );
};

const renderMonthStrip = (plant: Plant) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
    const activeMonths = [
        ...plant.watering.months, ...plant.pruning.months, 
        ...plant.planting.months, ...plant.fertilizing.months, 
        ...plant.winter.months, ...plant.bloom_period
    ].map(s => s.substring(0, 3)); 

    return (
        <div className="month-strip">
            {monthNames.map(m => {
                const isBloom = plant.bloom_period.map(s => s.substring(0, 3)).includes(m);
                const isActive = activeMonths.includes(m);
                
                let className = '';
                if (isBloom) {
                    className = 'bloom';
                } else if (isActive) {
                    className = 'active'; 
                }
                
                return (
                    <div 
                        key={m} 
                        className={`month-indicator ${className}`}
                    >
                        {m}
                    </div>
                );
            })}
        </div>
    );
};

const PlantDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
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
                const fetchedPlant = await getPlantById(plantId);
                setPlant(fetchedPlant);

                if (!fetchedPlant) return;

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
                toast.error("Kunde inte hämta växtdata.");
                setPlant(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [plantId]);

    const handleGardenToggle = async () => {
        if (!user) {
            toast.warn("Du måste logga in för att hantera din trädgård.");
            navigate('/auth'); 
            return;
        }
        if (!plant) return;

        setGardenActionLoading(true);
        try {
            if (isSaved) {
                await removePlantFromGarden(user.id, plant.id);
                setIsSaved(false);
                toast.info(`🗑️ ${plant.name} borttagen från din trädgård.`);
            } else {
                await addPlantToGarden(user.id, plant.id);
                setIsSaved(true);
                toast.success(`🌱 ${plant.name} tillagd i din trädgård!`);
            }
        } catch (error) {
            console.error("Fel vid hantering av trädgård:", error);
            toast.error("Kunde inte uppdatera trädgården. Försök igen.");
        } finally {
            setGardenActionLoading(false);
        }
    };

    const handleWishlistToggle = async () => {
        if (!user) {
            toast.warn("Du måste logga in för att hantera din önskelista.");
            navigate('/auth'); 
            return;
        }
        if (!plant) return;

        setWishlistActionLoading(true);
        try {
            const newStatus = await togglePlantWishlist(user.id, plant.id, isOnWishlist);
            setIsOnWishlist(newStatus);
            toast.success(newStatus ? `💖 ${plant.name} tillagd i önskelistan!` : `🤍 ${plant.name} borttagen från önskelistan.`);
        } catch (error) {
            console.error("Fel vid hantering av önskelista:", error);
            toast.error("Kunde inte uppdatera önskelistan. Försök igen.");
        } finally {
            setWishlistActionLoading(false);
        }
    };

    if (isLoading) return <div className="loading-page">Laddar information...</div>;
    if (!plant) return <div className="error-page">Växt hittades inte</div>;


    return (
        <div className="plant-detail-page-container">
            
            <section className="top-section">
                
                <div className="image-gallery">
                    <img src={getImageUrl(plant.image)} alt={plant.name} className="main-image" />
                </div>

                <div className="info-panel">
                    <h2 className="plant-name">{plant.name}</h2>
                    <p className="latin-name">{plant.latin_name}</p>
                    
                    <div className="description">
                        <h3>Om {plant.name}</h3>
                        <p>{plant.description}</p>
                        <p className="small-text">Växtzon: **{plant.zone}**. Höjd: **{plant.height_cm} cm**.</p>
                    </div>

                    <div className="quick-care-tags">
                        <div className="tag-item"><span>💧</span> Intervall: {plant.care_interval_days} dagar</div>
                        <div className="tag-item"><span>🌱</span> {plant.category}</div>
                        <div className="tag-item"><span>🌡️</span> Zon {plant.zone}</div>
                    </div>

                    <div className="action-buttons">
                        <button 
                            className={`btn-add-garden ${isSaved ? 'saved' : ''}`}
                            onClick={handleGardenToggle}
                            disabled={!user || gardenActionLoading}
                        >
                            {gardenActionLoading ? 'Uppdaterar...' : (isSaved ? '🗑️ Ta bort från Trädgård' : '🌱 Lägg till i min Trädgård')}
                        </button>
                        <button 
                            className={`btn-wishlist ${isOnWishlist ? 'active' : ''}`} 
                            onClick={handleWishlistToggle}
                            disabled={!user || wishlistActionLoading}
                            title={isOnWishlist ? "Ta bort från önskelista" : "Lägg till på önskelista"}
                        >
                            {wishlistActionLoading ? '...' : (isOnWishlist ? '💖' : '🤍')} Önskelista
                        </button>
                    </div>

                    {!user && (
                         <p className="login-prompt">
                             Logga in för att hantera växter i din trädgård och önskelista.
                         </p>
                    )}
                </div>
            </section>

            <section className="detailed-care-guide">
                <h2>Komplett Skötselguide</h2>
                
                <div className="care-guide-grid">
                    <div className="guide-box">
                        <h3>Plats & Jord</h3>
                        <p>{plant.care_guide.replace(/\*\*/g, '')} Jorden bör vara {plant.soil}.</p>
                    </div>
                    <div className="guide-box">
                        <h3>Blomning</h3>
                        <p>Blommar från **{plant.bloom_period.join(', ')}**. Typ: {plant.type}.</p>
                    </div>
                    <div className="guide-box">
                        <h3>Användning</h3>
                        <p>{plant.usage}</p>
                    </div>
                    <div className="guide-box">
                        <h3>Växtkälla</h3>
                        <p>Bildkälla: {plant.image_source}. Kategori: {plant.category}</p>
                    </div>
                </div>

                <div className="care-activities">
                    <h3>Månatliga Aktiviteter</h3>
                    {renderCareGuideItem(plant.watering, 'Vattning', '💧')}
                    {renderCareGuideItem(plant.fertilizing, 'Gödsling', '✨')}
                    {renderCareGuideItem(plant.pruning, 'Beskärning', '✂️')}
                    {renderCareGuideItem(plant.planting, 'Plantering', '🪴')}
                    {renderCareGuideItem(plant.winter, 'Vinterskydd', '❄️')}
                </div>
            </section>

            <section className="seasonal-calendar-preview">
                <h2>Aktivitet under Året</h2>
                {renderMonthStrip(plant)}
            </section>
            
        </div>
    );
}

export default PlantDetailPage;