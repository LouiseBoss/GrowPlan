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

// --- Importera Dina Specifika React Icons ---
import { TfiTrash } from "react-icons/tfi";
import { HiOutlineScissors } from "react-icons/hi2";
import { GiWateringCan } from "react-icons/gi";
import { LuShovel, LuSun, LuInfo, LuTrees } from "react-icons/lu";
import { PiPlant } from "react-icons/pi";
import { TbSnowflake } from "react-icons/tb";
import { TiPinOutline } from "react-icons/ti";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoArrowBack, IoFlowerOutline } from "react-icons/io5";

import '../assets/scss/pages/PlantDetailPage.scss';

const renderCareGuideItem = (care: CarePeriod | undefined, title: string, IconComponent: React.ReactNode) => {
    if (!care) return null;

    const monthsText = care.months && care.months.length > 0 ? care.months.join(', ') : 'När det behövs';

    return (
        <div className="care-guide-item">
            <span className="care-icon">{IconComponent}</span>
            <div className="care-details">
                <p className="care-title">{title}</p>
                <small className="care-months">Bäst under: {monthsText}</small>
                <p className="care-notes">{care.notes || care.interval || 'Ingen specifik anvisning.'}</p>
            </div>
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
                toast.info(`Borttagen från din trädgård.`);
            } else {
                await addPlantToGarden(user.id, plant.id);
                setIsSaved(true);
                toast.success(`Tillagd i din trädgård!`);
            }
        } catch (error) {
            console.error("Fel vid radering:", error);
            toast.error("Kunde inte uppdatera trädgården.");
        } finally {
            setGardenActionLoading(false);
        }
    };

    const handleWishlistToggle = async () => {
        if (!user) {
            toast.warn("Du måste logga in.");
            navigate('/auth');
            return;
        }
        if (!plant) return;

        setWishlistActionLoading(true);
        try {
            const newStatus = await togglePlantWishlist(user.id, plant.id, isOnWishlist);
            setIsOnWishlist(newStatus);
            toast.success(newStatus ? `Tillagd i önskelistan!` : `Borttagen från önskelistan.`);
        } catch (error) {
            console.error("Fel vid radering:", error);
            toast.error("Kunde inte uppdatera önskelistan.");
        } finally {
            setWishlistActionLoading(false);
        }
    };

    if (isLoading) return <div className="loading-page">Laddar information...</div>;
    if (!plant) return <div className="error-page">Växt hittades inte</div>;

    return (
        <div className="plant-detail-page-container">
            <div className="top-navigation">
                <button className="btn-back" onClick={() => navigate(-1)}>
                    <IoArrowBack /> Tillbaka
                </button>
            </div>

            <section className="hero-info-section">
                <div className="image-wrapper">
                    <img src={getImageUrl(plant.image)} alt={plant.name} className="main-image" />
                    <div className="category-badge">
                        <PiPlant className="badge-icon" /> {plant.category}
                    </div>
                </div>

                <div className="info-panel">
                    <div className="title-area">
                        <h1 className="plant-name">{plant.name}</h1>
                        <p className="latin-name">{plant.latin_name}</p>
                    </div>

                    <div className="description-card">
                        <h3><LuInfo className="card-title-icon" /> Om växten</h3>
                        <p>{plant.description}</p>
                        <div className="plant-specs">
                            <span><TiPinOutline /> Zon: {plant.zone}</span>
                            <span><LuTrees /> Höjd: {plant.height_cm} cm</span>
                        </div>
                    </div>

                    <div className="quick-stats-grid">
                        <div className="stat-pill">
                            <GiWateringCan className="icon water" />
                            <div className="stat-text">
                                <small>Vattning</small>
                                <span>Var {plant.care_interval_days}:e dag</span>
                            </div>
                        </div>
                        <div className="stat-pill">
                            <LuSun className="icon sun" />
                            <div className="stat-text">
                                <small>Läge</small>
                                <span>Zon {plant.zone}</span>
                            </div>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button
                            className={`btn-primary-action ${isSaved ? 'saved' : ''}`}
                            onClick={handleGardenToggle}
                            disabled={!user || gardenActionLoading}
                        >
                            {gardenActionLoading ? '...' : (isSaved ? <><TfiTrash /> Ta bort</> : <><PiPlant /> I min trädgård</>)}
                        </button>
                        <button
                            className={`btn-wishlist-action ${isOnWishlist ? 'active' : ''}`}
                            onClick={handleWishlistToggle}
                            disabled={!user || wishlistActionLoading}
                        >
                            {isOnWishlist ? <FaHeart color="#fff" /> : <FaRegHeart />}
                        </button>
                    </div>
                </div>
            </section>

            <section className="detailed-care-section">
                <h2 className="section-title">Skötsel & Råd</h2>

                <div className="care-cards-grid">
                    <div className="care-card">
                        <div className="card-header">
                            <TiPinOutline className="card-icon" />
                            <h3>Plats & Jord</h3>
                        </div>
                        <p>{plant.care_guide.replace(/\*\*/g, '')}</p>
                        <p className="soil-info"><strong>Jord:</strong> {plant.soil}</p>
                    </div>

                    <div className="care-card">
                        <div className="card-header">
                            <IoFlowerOutline className="card-icon bloom" />
                            <h3>Blomning</h3>
                        </div>
                        <p>Denna {plant.type.toLowerCase()} blommar under månaderna: <strong>{plant.bloom_period.join(', ')}</strong>.</p>
                    </div>

                    <div className="care-card">
                        <div className="card-header">
                            <LuInfo className="card-icon usage" />
                            <h3>Användning</h3>
                        </div>
                        <p>{plant.usage}</p>
                    </div>
                </div>

                <div className="monthly-activities-container">
                    <h3>Månatliga Aktiviteter</h3>
                    <div className="activities-list">
                        {renderCareGuideItem(plant.watering, 'Vattning', <GiWateringCan />)}
                        {renderCareGuideItem(plant.fertilizing, 'Gödsling', <PiPlant />)}
                        {renderCareGuideItem(plant.pruning, 'Beskärning', <HiOutlineScissors />)}
                        {renderCareGuideItem(plant.planting, 'Plantering', <LuShovel />)}
                        {renderCareGuideItem(plant.winter, 'Vinterskydd', <TbSnowflake />)}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default PlantDetailPage;