export interface Plant {
  id: number;
  name: string;
  latin_name: string;
  category: string;
  type: string;
  description: string;
  image: string;
  image_source: string;

  watering: {
    months: string[];
    interval: string;
  };

  pruning: {
    months: string[];
    notes: string;
  };

  planting: {
    months: string[];
    notes: string;
  };

  fertilizing: {
    months: string[];
    notes: string;
  };

  winter: {
    months: string[];
    notes: string;
  };
}
