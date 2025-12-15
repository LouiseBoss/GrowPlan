import { supabase } from "./supabaseClient";

// Typ för raden i user_plants
export type UserPlantRow = {
  id: number;
  user_id: string;
  plant_id: number;
};

// Hämtar alla plant_id som användaren sparat
export async function getUserPlants(userId: string): Promise<number[]> {
  const { data, error } = await supabase
    .from("user_plants")
    .select("plant_id")
    .eq("user_id", userId);

  if (error) throw error;

  return data?.map((row) => row.plant_id) ?? [];
}

// Lägger till växter i "Min Trädgård"
export async function addPlantToGarden(userId: string, plantId: number) {
  const { data, error } = await supabase
    .from("user_plants")
    .insert([{ user_id: userId, plant_id: plantId }]);

  if (error) throw error;
  return data;
}

// Tar bort växter från "Min Trädgård"
export async function removePlantFromGarden(userId: string, plantId: number) {
  const { error } = await supabase
    .from("user_plants")
    .delete()
    .eq("user_id", userId)
    .eq("plant_id", plantId);

  if (error) throw error;

  return true;
}

// Kontrollerar om en växt är sparad
export async function isPlantInGarden(userId: string, plantId: number) {
  const { data, error } = await supabase
    .from("user_plants")
    .select("id")
    .eq("user_id", userId)
    .eq("plant_id", plantId)
    .maybeSingle();

  if (error) throw error;

  return !!data;
}

// Kontrollerar om en växt finns på önskelistan
export async function isPlantOnWishlist(userId: string, plantId: number): Promise<boolean> {
    const { data, error } = await supabase
        .from("user_wishlist_plants") // Ny tabell
        .select("id")
        .eq("user_id", userId)
        .eq("plant_id", plantId)
        .maybeSingle();

    if (error) throw error;
    return !!data;
}

// Lägger till ELLER tar bort från önskelistan baserat på aktuell status
export async function togglePlantWishlist(
    userId: string, 
    plantId: number, 
    isCurrentlyOnList: boolean
): Promise<boolean> {
    
    if (isCurrentlyOnList) {
        // Ta bort
        const { error } = await supabase
            .from("user_wishlist_plants")
            .delete()
            .eq("user_id", userId)
            .eq("plant_id", plantId);

        if (error) throw error;
        return false; // Nu borttagen
        
    } else {
        // Lägg till
        const { error } = await supabase
            .from("user_wishlist_plants")
            .insert([{ user_id: userId, plant_id: plantId }]);

        if (error) throw error;
        return true; // Nu tillagd
    }
}
