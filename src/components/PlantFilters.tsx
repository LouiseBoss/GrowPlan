import React from "react";
import Form from "react-bootstrap/Form";

interface PlantFiltersProps {
  category: string;
  onCategoryChange: (value: string) => void;
}

const PlantFilters: React.FC<PlantFiltersProps> = ({
  category,
  onCategoryChange,
}) => {
  return (
    <div style={{ maxWidth: "300px", marginBottom: "20px" }}>
      <Form.Select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">Alla kategorier</option>

        <option value="blomma">Blommor</option>
        <option value="ört">Örter</option>
        <option value="buske">Buskar</option>
        <option value="träd">Träd</option>

        <option value="perenn">Perenner</option>
        <option value="sommarblomma">Sommarblommor</option>

        <option value="inomhus">Inomhusväxter</option>
        <option value="utomhus">Utomhusväxter</option>

        <option value="bärväxt">Bärväxter</option>
        <option value="grönsak">Grönsaker</option>
        <option value="klätterväxt">Klätterväxter</option>
        <option value="lök">Lökväxter</option>
        <option value="knölväxt">Knölväxter</option>
      </Form.Select>
    </div>
  );
};

export default PlantFilters;
