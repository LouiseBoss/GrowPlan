import { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserList } from '../hooks/useUserList';
import { getWishlistPlantIds, togglePlantWishlist } from '../services/plantsService';
import PlantCard from '../components/PlantCard';
import Pagination from '../components/Pagination';
import { Link } from 'react-router-dom';
import "../assets/scss/pages/WishlistPage.scss";
import LoadingScreen from '../components/LoadingScreen';

const WishlistPage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Alla');

    const {
        plants,
        loading,
        refetch,
        page,
        totalPages,
        onNext,
        onPrev
    } = useUserList(user, getWishlistPlantIds);

    const categories = useMemo(() => {
        if (!plants) return ['Alla'];
        const uniqueCategories = Array.from(new Set(plants.map(p => p.category).filter(Boolean)));
        return ['Alla', ...uniqueCategories];
    }, [plants]);

    const filteredPlants = useMemo(() => {
        if (activeTab === 'Alla') return plants;
        return plants.filter(p => p.category === activeTab);
    }, [plants, activeTab]);

    const handleRemoveFromWishlist = async (plantId: number) => {
        if (!user) return;
        await togglePlantWishlist(user.id, plantId, true);
        refetch();
    };

    if (!user) {
        return <div className="page-container"><p>Logga in för att se din önskelista.</p></div>;
    }

    return (
        <div className="page-container wishlist-page">
            <header className="page-header">
                <h1>Min Önskelista</h1>
            </header>

            <section className="info-section">
                <div className="info-card">
                    <div className="info-text">
                        <h3>Drömmar om grönska</h3>
                        <p>"Här samlas frön till framtida projekt. Planera idag, plantera imorgon!"</p>
                    </div>
                    <div className="info-stats">
                        <div className="stat-item">
                            <span className="stat-label">Visar</span>
                            <span className="stat-value">{loading ? '...' : filteredPlants.length}</span>
                        </div>
                    </div>
                </div>
            </section>

            {!loading && plants.length > 0 && (
                <div className="category-tabs">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`tab-btn ${activeTab === cat ? 'active' : ''}`}
                            onClick={() => setActiveTab(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {loading ? (
                <LoadingScreen />
            ) : plants.length === 0 && totalPages === 0 ? (
                <div className="empty-list-message">
                    <p>Din önskelista är tom. Hitta inspiration i katalogen!</p>
                    <Link to="/plants" className="plant-btn" style={{ maxWidth: '200px', margin: '1rem auto' }}>
                        Sök växter
                    </Link>
                </div>
            ) : (
                <>
                    <div className="plant-grid">
                        {filteredPlants.map((plant) => (
                            <PlantCard
                                key={plant.id}
                                plant={plant}
                                listType="wishlist"
                                onRemove={handleRemoveFromWishlist}
                            />
                        ))}
                    </div>

                    {activeTab === 'Alla' && totalPages > 1 && (
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