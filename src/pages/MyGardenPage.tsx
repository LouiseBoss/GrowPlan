import { useAuth } from '../hooks/useAuth';
import { useUserList } from '../hooks/useUserList';
import { getUserPlants, removePlantFromGarden } from '../services/plantsService';
import PlantCard from '../components/PlantCard';
import Pagination from '../components/Pagination';
import { Link } from 'react-router-dom';

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
                <p>Alla dina sparade växter ({plants.length} st).</p>
                <p>Visar {plants.length} växter på sida {page + 1} av {totalPages}.</p>
            </header>

            {loading ? (
                <p>Laddar din trädgård...</p>
            ) : plants.length === 0 && totalPages === 0 ? (
                <div className="empty-list-message">
                    <p>Din trädgård är tom. Dags att plantera något!</p>
                    <Link to="/plants" className="button primary">Sök växter</Link>
                </div>
            ) : (
                <>
                    <div className="plant-grid">
                        {plants.map((plant) => (
                            <PlantCard
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