import React from "react";
import Form from "react-bootstrap/Form";

interface PlantFiltersProps {
    category: string;
    type: string;
    onCategoryChange: (value: string) => void;
    onTypeChange: (value: string) => void;
}

const PlantFilters: React.FC<PlantFiltersProps> = ({
    category,
    type,
    onCategoryChange,
    onTypeChange,
}) => {
    return (
        <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
            
            {/* KATEGORI */}
            <Form.Select 
                value={category} 
                onChange={(e) => onCategoryChange(e.target.value)}
            >
                <option value="">Alla kategorier</option>
                <option value="blomma">Blommor</option>
                <option value="buske">Buskar</option>
                <option value="träd">Träd</option>
                <option value="ört">Örter</option>
                <option value="inomhusväxt">Inomhusväxter</option>
                <option value="utomhusväxt">Utomhusväxter</option>
            </Form.Select>

            {/* TYP */}
            <Form.Select 
                value={type} 
                onChange={(e) => onTypeChange(e.target.value)}
            >
                <option value="">Alla typer</option>
                <option value="perenn">Perenn</option>
                <option value="sommarblomma">Sommarblomma</option>
                <option value="lövträd">Lövträd</option>
                <option value="barrträd">Barrträd</option>
                <option value="kryddväxt">Kryddväxt</option>
                <option value="suckulent">Suckulent</option>
                <option value="kaktus">Kaktus</option>
            </Form.Select>

        </div>
    );
};

export default PlantFilters;
