import { useAuth } from '../hooks/useAuth';
import { useUserList } from '../hooks/useUserList'; 
import { useListActions } from '../hooks/useListActions'; 
import { getWishlistPlantIds } from '../services/plantsService';
import PlantCard from '../components/PlantCard';
import Pagination from '../components/Pagination'; 
import { Link } from 'react-router-dom';

const WishlistPage = () => {
    const { user } = useAuth();
    
    const { 
        plants, 
        loading, 
        refetch, 
        page, 
        totalPages, 
        onNext, 
        onPrev 
    } = useUserList(user, getWishlistPlantIds);

    const { handleRemove } = useListActions(user, refetch);

    if (!user) {
        return <div className="page-container"><p>Logga in för att se din önskelista.</p></div>;
    }

    return (
        <div className="page-container wishlist-page">
            <header className="page-header">
                <h1>Min Önskelista 💖</h1>
                <p>Visar {plants.length} växter på sida {page + 1} av {totalPages}.</p>
            </header>
            
            {loading ? (
                <p>Laddar din önskelista...</p>
            ) : plants.length === 0 && totalPages === 0 ? (
                <div className="empty-list-message">
                    <p>Din önskelista är tom. Hitta inspiration i katalogen!</p>
                    <Link to="/plantcatalog" className="button primary">Sök växter</Link>
                </div>
            ) : (
                <>
                    <div className="plant-grid">
                        {plants.map((plant) => (
                            <PlantCard 
                                key={plant.id} 
                                plant={plant} 
                                listType="wishlist" 
                                onRemove={(plantId) => handleRemove(plantId, 'wishlist')} 
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

export default WishlistPage;