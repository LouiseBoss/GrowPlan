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
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, listType, onRemove }) => {

    const cardStyle = {
        borderColor: '#96AD90',
        backgroundColor: '#F7D6C0'
    };

    const removeText = listType === 'garden' ? 'Ta bort från Trädgård' : 'Ta bort från Önskelista';

    const removeButtonStyle = {
        backgroundColor: '#F4B9B8',
        borderColor: '#F4B9B8',
        color: '#3A4A3D',
        fontWeight: 'bold'
    };

    const infoButtonStyle = {
        backgroundColor: '#3A4A3D',
        borderColor: '#3A4A3D',
        color: 'white'
    };

    return (
        <div className='CardGroup'>
            <Card className="h-100 d-flex flex-column plant-card-custom" style={cardStyle}>

                <Link to={`/plant/${plant.id}`}>
                    <Card.Img
                        variant="top"
                        src={getImageUrl ? getImageUrl(plant.image) : plant.image}
                        alt={plant.name}
                        className="plant-card-image-top"
                    />
                </Link>

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
                            style={infoButtonStyle}
                            role="button"
                        >
                            Mer info
                        </Nav.Link>

                        {listType && onRemove && (
                            <Button
                                variant="danger"
                                className="mt-2 btn-remove-card btn-block"
                                style={removeButtonStyle}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onRemove(plant.id);
                                }}
                            >
                                <span aria-hidden="true">❌</span> {removeText}
                            </Button>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export default PlantCard;