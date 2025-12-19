import { useState, useEffect, useMemo } from "react";
import Pagination from "../components/Pagination";
import PlantFilters from "../components/PlantFilters";
import PlantCard from "../components/PlantCard";
import "../assets/scss/pages/PlantListPage.scss";
import { usePlants } from "../hooks/usePlants";
import { useAuth } from "../hooks/useAuth";
import {
    getUserPlants,
    getWishlistPlantIds,
    addPlantToGarden,
    togglePlantWishlist
} from "../services/plantsService";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 20;

const PlantListPage = () => {
    const { plants, loading, error } = usePlants();
    const { user } = useAuth();
    
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [page, setPage] = useState(0);
    const [gardenIds, setGardenIds] = useState<number[]>([]);
    const [wishlistIds, setWishlistIds] = useState<number[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setGardenIds([]);
                setWishlistIds([]);
                return;
            }

            try {
                const [garden, wishlist] = await Promise.all([
                    getUserPlants(user.id),
                    getWishlistPlantIds(user.id)
                ]);
                setGardenIds(garden);
                setWishlistIds(wishlist);
            } catch (err) {
                console.error("Fel vid radering:", err);
                console.error("Kunde inte hämta användardata");
            }
        };

        fetchData();
    }, [user]);

    // Filtrering
    const filteredPlants = useMemo(() => {
        return plants
            .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
            .filter((p) => (category ? p.category === category : true));
    }, [plants, search, category]);

    const pageCount = Math.ceil(filteredPlants.length / ITEMS_PER_PAGE);
    
    const currentPage = page >= pageCount && pageCount > 0 ? pageCount - 1 : page;

    const paginatedPlants = useMemo(() => {
        const start = currentPage * ITEMS_PER_PAGE;
        return filteredPlants.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredPlants, currentPage]);

    const handleNext = () => setPage((p) => Math.min(p + 1, pageCount - 1));
    const handlePrev = () => setPage((p) => Math.max(p - 1, 0));

    const handleAddToGarden = async (plantId: number) => {
        if (!user) {
            toast.info("Du måste vara inloggad för att lägga till växter 🌱");
            return;
        }
        if (gardenIds.includes(plantId)) {
            toast.warning("Denna växt finns redan i din trädgård!");
            return;
        }
        const plantName = plants.find(p => p.id === plantId)?.name || "Växten";
        try {
            await addPlantToGarden(user.id, plantId);
            setGardenIds((prev) => [...prev, plantId]);
            toast.success(`${plantName} har lagts till i din trädgård! 🌿`);
        } catch (err) {
            console.error("Fel vid radering:", err);
            toast.error("Kunde inte lägga till i trädgården.");
        }
    };

    const handleToggleWishlist = async (plantId: number) => {
        if (!user) {
            toast.info("Logga in för att använda önskelistan ❤️");
            return;
        }
        const isOnList = wishlistIds.includes(plantId);
        const plantName = plants.find(p => p.id === plantId)?.name || "Växten";
        try {
            const isNowOnList = await togglePlantWishlist(user.id, plantId, isOnList);
            setWishlistIds((prev) =>
                isNowOnList ? [...prev, plantId] : prev.filter((id) => id !== plantId)
            );
            if (isNowOnList) {
                toast.success(`${plantName} sparad i önskelistan! ❤️`);
            } else {
                toast.info(`${plantName} borttagen från önskelistan.`);
            }
        } catch (err) {
            console.error("Fel vid radering:", err);
            toast.error("Gick inte att uppdatera önskelistan.");
        }
    };

    if (loading) return <div className="page-container"><p>Laddar växter...</p></div>;
    if (error) return <div className="page-container"><p style={{ color: "red" }}>Kunde inte ladda växter: {error.message}</p></div>;

    return (
        <div className="page-container plantlist-page">
            <header className="page-header">
                <h1>Växtkatalog</h1>
                <p>Sök och filtrera bland alla tillgängliga växter.</p>
            </header>

            <section className="filter-section">
                <div className="filter-card">
                    <div className="search-group">
                        <label htmlFor="search">Sök växt</label>
                        <input
                            id="search"
                            className="form-control"
                            placeholder="T.ex. Monstera..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(0);
                            }}
                        />
                    </div>

                    <div className="category-group">
                        <label>Filtrera på kategori</label>
                        <PlantFilters
                            category={category}
                            onCategoryChange={(value) => {
                                setCategory(value);
                                setPage(0);
                            }}
                        />
                    </div>
                </div>
            </section>

            <p className="results-count">
                Visar <strong>{paginatedPlants.length}</strong> av{" "}
                <strong>{filteredPlants.length}</strong> matchande växter.
            </p>

            <div className="plant-grid">
                {paginatedPlants.map((plant) => (
                    <PlantCard
                        key={plant.id}
                        plant={plant}
                        showActions
                        isInGarden={gardenIds.includes(plant.id)}
                        isInWishlist={wishlistIds.includes(plant.id)}
                        onAddToGarden={handleAddToGarden}
                        onToggleWishlist={handleToggleWishlist}
                    />
                ))}
            </div>

            {pageCount > 1 && (
                <Pagination
                    page={currentPage}
                    totalPages={pageCount}
                    onPrev={handlePrev}
                    onNext={handleNext}
                />
            )}
        </div>
    );
};

export default PlantListPage;