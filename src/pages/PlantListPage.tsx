import { useState } from "react";
import plants from "../data/plants.json";
import Pagination from "../components/Pagination";
import PlantFilters from "../components/PlantFilters";
import { Link } from "react-router";
import "../assets/scss/components/PlantList.scss";
import { getImageUrl } from "../utils/getImageUrl";

const ITEMS_PER_PAGE = 20;

const PlantListPage = () => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [page, setPage] = useState(0);

    // ⭐ Filtrering
    const filtered = plants
        .filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
        )
        .filter((p) => (category ? p.category === category : true))
        .filter((p) => (type ? p.type === type : true))

    const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    const safePage = Math.min(page, pageCount - 1);

    const start = safePage * ITEMS_PER_PAGE;
    const paginatedPlants = filtered.slice(start, start + ITEMS_PER_PAGE);

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
                page={page}
                totalPages={pageCount}
                onPrev={() => setPage(page - 1)}
                onNext={() => setPage(page + 1)}
            />
        </div>
    );
};

export default PlantListPage;
