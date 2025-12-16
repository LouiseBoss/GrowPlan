import React from "react";
import Button from "react-bootstrap/Button";
import "../assets/scss/components/Pagination.scss";

interface PaginationProps {
    page: number; 
    totalPages: number; 
    onNext: () => void;
    onPrev: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
    page,
    totalPages,
    onNext,
    onPrev,
}) => {

    const hasNext = page < totalPages - 1;
    const hasPrev = page > 0;

    return (
        <div className="pagination-container">

            <Button
                variant="dark"
                disabled={!hasPrev}
                onClick={onPrev}
            >
                ⬅ Föregående
            </Button>

            <div className="pagination-status">
                Sida <strong>{page + 1}</strong> / {totalPages}
            </div>

            <Button
                variant="dark"
                disabled={!hasNext}
                onClick={onNext}
            >
                Nästa ➡
            </Button>
        </div>
    );
};

export default Pagination;
