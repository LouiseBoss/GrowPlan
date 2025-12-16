import { supabase } from "./supabaseClient";
import { type Plant, type PlantListItem } from "../types/Plant";

export type UserPlantRow = {
  id: number;
  user_id: string;
  plant_id: number;
};


export async function getPlantById(plantId: number): Promise<Plant | null> {
  const { data, error } = await supabase
    .from("plants")
    .select(`
      id,
      name,
      latin_name,
      category,
      type,
      description,
      usage,
      image,
      image_source,
      soil,
      zone,
      height_cm,
      care_guide,
      care_interval_days,
      bloom_period,
      watering,
      pruning,
      planting,
      fertilizing,
      winter
    `)
    .eq("id", plantId)
    .single();

  if (error) {
    console.error("Fel vid hämtning av växt:", error);
    return null;
  }

  return data as Plant;
}

// =======================
// USER PLANTS (MIN TRÄDGÅRD)
// =======================

export async function getUserPlants(userId: string): Promise<number[]> {
  const { data, error } = await supabase
    .from("user_plants")
    .select("plant_id")
    .eq("user_id", userId);

  if (error) throw error;

  return data?.map((row) => row.plant_id) ?? [];
}

export async function addPlantToGarden(userId: string, plantId: number) {
  const { error } = await supabase
    .from("user_plants")
    .insert([{ user_id: userId, plant_id: plantId }]);

  if (error) throw error;
}

export async function removePlantFromGarden(userId: string, plantId: number) {
  const { error } = await supabase
    .from("user_plants")
    .delete()
    .eq("user_id", userId)
    .eq("plant_id", plantId);

  if (error) throw error;
}

export async function isPlantInGarden(userId: string, plantId: number): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_plants")
    .select("id")
    .eq("user_id", userId)
    .eq("plant_id", plantId)
    .maybeSingle();

  if (error) throw error;

  return !!data;
}

// =======================
// WISHLIST
// =======================

export async function isPlantOnWishlist(
  userId: string,
  plantId: number
): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_wishlist_plants")
    .select("id")
    .eq("user_id", userId)
    .eq("plant_id", plantId)
    .maybeSingle();

  if (error) throw error;

  return !!data;
}

export async function togglePlantWishlist(
  userId: string,
  plantId: number,
  isCurrentlyOnList: boolean
): Promise<boolean> {
  if (isCurrentlyOnList) {
    const { error } = await supabase
      .from("user_wishlist_plants")
      .delete()
      .eq("user_id", userId)
      .eq("plant_id", plantId);

    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase
      .from("user_wishlist_plants")
      .insert([{ user_id: userId, plant_id: plantId }]);

    if (error) throw error;
    return true;
  }
}
export async function getAllPlants(): Promise<PlantListItem[]> {
  const { data, error } = await supabase
    .from("plants")
    .select(`
      id,
      name,
      category,
      type,
      image
    `);

  if (error) throw error;
  return data ?? [];
}
