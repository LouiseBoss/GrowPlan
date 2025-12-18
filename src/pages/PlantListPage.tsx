import { useState } from "react";
import Pagination from "../components/Pagination";
import PlantFilters from "../components/PlantFilters";
import PlantCard from "../components/PlantCard";
import "../assets/scss/pages/PlantListPage.scss";
import { usePlants } from "../hooks/usePlants";
import { useEffect } from "react";
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
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [page, setPage] = useState(0);
    const { user } = useAuth();
    const [gardenIds, setGardenIds] = useState<number[]>([]);
    const [wishlistIds, setWishlistIds] = useState<number[]>([]);

    useEffect(() => {
        if (!user) return;

        getUserPlants(user.id).then(setGardenIds);
        getWishlistPlantIds(user.id).then(setWishlistIds);
    }, [user]);



    const filtered = plants
        .filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
        )
        .filter((p) => (category ? p.category === category : true))

    const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    const safePage = Math.min(page, Math.max(pageCount - 1, 0));
    if (page !== safePage) {
        setPage(safePage);
    }

    const start = safePage * ITEMS_PER_PAGE;
    const paginatedPlants = filtered.slice(start, start + ITEMS_PER_PAGE);

    const handleNext = () => setPage((p) => Math.min(p + 1, pageCount - 1));
    const handlePrev = () => setPage((p) => Math.max(p - 1, 0));


    if (loading) {
        return <div className="page-container"><p>Laddar växter...</p></div>;
    }

    if (error) {
        return <div className="page-container"><p style={{ color: "red" }}>Kunde inte ladda växter: {error.message}</p></div>;
    }

    if (plants.length === 0 && !loading) {
        return <div className="page-container"><p>Hittade inga växter i katalogen.</p></div>;
    }

    const handleAddToGarden = async (plantId: number) => {
        if (!user) {
            toast.info("Du måste vara inloggad för att lägga till växter 🌱");
            return;
        }

        if (gardenIds.includes(plantId)) return;

        await addPlantToGarden(user.id, plantId);
        setGardenIds((prev) => [...prev, plantId]);
    };

    const handleToggleWishlist = async (plantId: number) => {
        if (!user) {
            toast.info("Logga in för att använda önskelistan ❤️");
            return;
        }

        const isOnList = wishlistIds.includes(plantId);

        const newState = await togglePlantWishlist(
            user.id,
            plantId,
            isOnList
        );

        setWishlistIds((prev) =>
            newState
                ? [...prev, plantId]
                : prev.filter((id) => id !== plantId)
        );
    };




    return (
        <div className="page-container plantlist-page">
            <header className="page-header">
                <h1>Växtkatalog 🔍</h1>
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
                <strong>{filtered.length}</strong> matchande växter.
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
                    page={safePage}
                    totalPages={pageCount}
                    onPrev={handlePrev}
                    onNext={handleNext}
                />
            )}
        </div>
    );
};

export default PlantListPage;