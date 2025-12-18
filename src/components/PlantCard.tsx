import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Card, Nav, Button } from 'react-bootstrap';
import { type PlantListItem } from '../types/Plant';
import { getImageUrl } from '../utils/getImageUrl';
import '../assets/scss/components/PlantCard.scss';

interface PlantCardProps {
    plant: PlantListItem;
    listType?: 'garden' | 'wishlist';
    onRemove?: (plantId: number) => void;

    showActions?: boolean;
    isInGarden?: boolean;
    isInWishlist?: boolean;
    onAddToGarden?: (plantId: number) => void;
    onToggleWishlist?: (plantId: number) => void;
}

const PlantCard: React.FC<PlantCardProps> = ({
    plant,
    listType,
    onRemove,
    showActions = false,
    isInGarden,
    isInWishlist,
    onAddToGarden,
    onToggleWishlist
}) => {

    return (
        <div className="CardGroup">
            <Card className="h-100 d-flex flex-column plant-card-custom">

                {/* 🖼 IMAGE + ❤️ */}
                <div className="plant-image-wrapper">
                    <Link to={`/plant/${plant.id}`}>
                        <Card.Img
                            src={getImageUrl ? getImageUrl(plant.image) : plant.image}
                            alt={plant.name}
                            className="plant-card-image-top"
                        />
                    </Link>

                    {showActions && (
                        <button
                            className={`wishlist-heart ${isInWishlist ? "active" : ""}`}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onToggleWishlist?.(plant.id);
                            }}
                            aria-label="Lägg till i önskelista"
                        >
                            ♥
                        </button>
                    )}
                </div>

                <Card.Body className="d-flex flex-column">
                    <Card.Title>{plant.name}</Card.Title>
                    <Card.Text className="text-muted">
                        {plant.category} ({plant.type})
                    </Card.Text>

                    <div className="mt-auto">

                        <Nav.Link
                            as={NavLink}
                            to={`/plant/${plant.id}`}
                            className="btn btn-secondary btn-block"
                        >
                            Mer info
                        </Nav.Link>

                        {/* 🌱 LÄGG TILL I TRÄDGÅRD */}
                        {showActions && onAddToGarden && !isInGarden && (
                            <Button
                                className="btn-add-garden mt-2"
                                onClick={() => onAddToGarden(plant.id)}
                            >
                                🌱 Lägg till i min trädgård
                            </Button>
                        )}

                        {/* ❌ TA BORT */}
                        {listType && onRemove && (
                            <Button
                                className="mt-2 btn-remove-card btn-block"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onRemove(plant.id);
                                }}
                            >
                                ❌ Ta bort
                            </Button>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default PlantCard;
