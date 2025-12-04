import { useState } from "react";
import plants from "../data/plants.json";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 20;

const PlantListPage = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);

    const filtered = plants.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    const safePage = Math.min(page, pageCount - 1);

    const start = safePage * ITEMS_PER_PAGE;
    const paginatedPlants = filtered.slice(start, start + ITEMS_PER_PAGE);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Växtkatalog</h1>

            <input
                placeholder="Sök växt..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                }}
            />

            <ul>
                {paginatedPlants.map((plant) => (
                    <li key={plant.id}>{plant.name}</li>
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
