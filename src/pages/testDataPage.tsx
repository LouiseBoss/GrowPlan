import { usePlants } from "../hooks/usePlants";

function TestDataPage() {
    const plants = usePlants();

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Testar Mockdata</h1>

            <ul>
                {plants.slice(0, 10).map((plant) => (
                    <li key={plant.id}>
                        <strong>{plant.name}</strong>
                        <br />
                        <img
                            src={plant.image}
                            alt={plant.name}
                            style={{ width: "120px", height: "auto", marginTop: "6px" }}
                        />
                    </li>
                ))}
            </ul>

        </div>
    );
}

export default TestDataPage;
