import { useState } from "react";
import Pagination from "../components/Pagination";
import PlantFilters from "../components/PlantFilters";
import { Link } from "react-router"; 
import "../assets/scss/components/PlantList.scss";
import { getImageUrl } from "../utils/getImageUrl";
import { usePlants } from "../hooks/usePlants"; 

const ITEMS_PER_PAGE = 20;

const PlantListPage = () => {
    const { plants, loading, error } = usePlants(); 

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [page, setPage] = useState(0);

    const filtered = plants
        .filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
        )
        .filter((p) => (category ? p.category === category : true))
        .filter((p) => (type ? p.type === type : true));

    const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const safePage = Math.min(page, Math.max(pageCount - 1, 0));
    const start = safePage * ITEMS_PER_PAGE;
    const paginatedPlants = filtered.slice(start, start + ITEMS_PER_PAGE);

    if (loading) {
        return <p style={{ padding: "20px" }}>Laddar växter...</p>;
    }
    
    if (error) {
        return <p style={{ padding: "20px", color: "red" }}>Kunde inte ladda växter från databasen: {error.message}</p>;
    }

    if (plants.length === 0 && !loading) {
        return <p style={{ padding: "20px" }}>Hittade inga växter i katalogen.</p>;
    }
    // ------------------------------------


    return (
        <div style={{ padding: "20px" }}>
            <h1>Växtkatalog</h1>

            {/* Sökfält */}
            <input
                style={{ marginBottom: "20px", width: "50%" }}
                placeholder="Sök växt..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                }}
            />

            {/* FILTERS */}
            <PlantFilters
                category={category}
                type={type}
                onCategoryChange={(v) => {
                    setCategory(v);
                    setPage(0);
                }}
                onTypeChange={(v) => {
                    setType(v);
                    setPage(0);
                }}
            />

            <p>
                Visar <strong>{paginatedPlants.length}</strong> av{" "}
                <strong>{filtered.length}</strong> växter
            </p>

            <ul className="plant-list">
                {paginatedPlants.map((plant) => (
                    <li key={plant.id} className="plant-item">
                        <img
                            src={getImageUrl(plant.image)}
                            alt={plant.name}
                            style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                                borderRadius: "4px"
                            }}
                        />

                        <Link to={`/plant/${plant.id}`}>
                            {plant.name}
                        </Link>
                    </li>
                ))}
            </ul>

            <Pagination
                page={safePage}
                totalPages={pageCount}
                onPrev={() => setPage((p) => Math.max(p - 1, 0))}
                onNext={() => setPage((p) => Math.min(p + 1, pageCount - 1))}
            />
        </div>
    );
};

export default PlantListPage;