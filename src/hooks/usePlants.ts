import plants from "../data/plants.json";
import type { Plant } from "../types/plant";


export const usePlants = () => {
  return plants as Plant[];
};
