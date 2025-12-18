import { useAuth } from '../hooks/useAuth';
import { useUserList } from '../hooks/useUserList';
import { getUserPlants, removePlantFromGarden } from '../services/plantsService';
import PlantCard from '../components/PlantCard';
import Pagination from '../components/Pagination';
import { Link } from 'react-router-dom';
import "../assets/scss/pages/MyGardenPage.scss";

const MyGardenPage = () => {
    const { user } = useAuth();

    const {
        plants,
        loading,
        refetch,
        page,
        totalPages,
        onNext,
        onPrev
    } = useUserList(user, getUserPlants);

    const handleRemoveFromGarden = async (plantId: number) => {
        if (!user) return;

        await removePlantFromGarden(user.id, plantId);
        refetch();
    };

    if (!user) {
        return <div className="page-container"><p>Logga in för att se din trädgård.</p></div>;
    }

    return (
        <div className="page-container garden-page">
            <header className="page-header">
                <h1>Min Trädgård 🌳</h1>
            </header>

            <section className="info-section">
                <div className="info-card">
                    <div className="info-text">
                        <h3>Gröna fingrar i arbete</h3>
                        <p>"Att odla en trädgård är att tro på morgondagen. Här frodas dina gröna visioner!"</p>
                    </div>
                    <div className="info-stats">
                        <div className="stat-item">
                            <span className="stat-label">Växter</span>
                            <span className="stat-value">{plants.length}</span>
                        </div>
                    </div>
                </div>
            </section>

            {loading ? (
                <p>Laddar din trädgård...</p>
            ) : plants.length === 0 && totalPages === 0 ? (
                <div className="empty-list-message">
                    <p>Din trädgård är tom. Dags att plantera något!</p>
                    <Link to="/plants" className="plant-btn" style={{ maxWidth: '200px', margin: '1rem auto' }}>
                        Sök växter
                    </Link>
                </div>
            ) : (
                <>
                    <div className="plant-grid">
                        {plants.map((plant) => (
                            <PlantCard
                                key={plant.id}
                                plant={plant}
                                listType="garden"
                                onRemove={handleRemoveFromGarden}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onNext={onNext}
                            onPrev={onPrev}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default MyGardenPage;