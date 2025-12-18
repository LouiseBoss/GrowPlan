import React from "react";
import Button from "react-bootstrap/Button";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; 
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

    const handleScrollAndNext = () => {
        onNext();
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleScrollAndPrev = () => {
        onPrev();
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="pagination-wrapper">
            <Button
                className="pagination-btn"
                disabled={!hasPrev}
                onClick={handleScrollAndPrev}
            >
                <FaChevronLeft /> <span>Föregående</span>
            </Button>

            <div className="pagination-info">
                Sida <span className="current">{page + 1}</span> av {totalPages}
            </div>

            <Button
                className="pagination-btn"
                disabled={!hasNext}
                onClick={handleScrollAndNext}
            >
                <span>Nästa</span> <FaChevronRight />
            </Button>
        </div>
    );
};

export default Pagination;