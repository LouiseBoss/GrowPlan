import { usePlants } from "../hooks/usePlants";


// Standard fallback-bild om ingen fil hittas
const FALLBACK_IMAGE_URL = "https://via.placeholder.com/150?text=Ingen+Bild";

function getImageUrl(name: string): string {
    if (!name || name.trim() === "") {
        return FALLBACK_IMAGE_URL;
    }

    try {
        return new URL(`../assets/images/${name}`, import.meta.url).href;
    } catch (e) {
        console.warn(`Varning: Lokal bildfil '${name}' kunde inte hittas.`);
        return FALLBACK_IMAGE_URL;
    }
}

const ImageTestPage = () => {
    const plants = usePlants();

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Testar Bilder (Korrigerad)</h1>

            {plants.slice(0, 30).map((p) => (
                <div key={p.id} style={{ marginBottom: "20px" }}>
                    <h3>{p.name}</h3>

                    <img
                        src={getImageUrl(p.image)}
                        alt={p.name}

                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png";
                        }}
                        style={{
                            width: "150px",
                            height: "auto",
                            border: "1px solid #ccc",
                            padding: "4px",
                            background: "white"
                        }}
                    />

                    <p>Källa: {p.image_source}</p>
                </div>
            ))}
        </div>
    );
};

export default ImageTestPage;