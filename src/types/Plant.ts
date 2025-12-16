
export interface CarePeriod {
  months: string[];
  notes?: string;
  interval?: string;
}


interface PlantDetails {
  watering: CarePeriod;
  pruning: CarePeriod;
  planting: CarePeriod;
  fertilizing: CarePeriod;
  winter: CarePeriod;
  bloom_period: string[];
}

export interface DatabasePlant {
  id: number;
  name: string;
  latin_name: string;
  category: string;
  type: string;
  description: string;
  usage: string;
  image: string;
  image_source: string;
  soil: string;
  zone: number;
  height_cm: number;
  care_guide: string;
  care_interval_days: number;
  watering: PlantDetails['watering'];
  pruning: PlantDetails['pruning'];
  planting: PlantDetails['planting'];
  fertilizing: PlantDetails['fertilizing'];
  winter: PlantDetails['winter'];
  bloom_period: string[];

}

export type PlantListItem = {
  id: number;
  name: string;
  category: string;
  type: string;
  image: string;
};

export type Plant = DatabasePlant;