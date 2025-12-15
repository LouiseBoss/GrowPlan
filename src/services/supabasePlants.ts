import { supabase } from "./supabaseClient";

export async function addPlantToGarden(userId: string, plantId: number) {
  return await supabase.from("user_plants").insert([
    { user_id: userId, plant_id: plantId }
  ]);
}

export async function removePlantFromGarden(userId: string, plantId: number) {
  return await supabase
    .from("user_plants")
    .delete()
    .eq("user_id", userId)
    .eq("plant_id", plantId);
}

export async function getUserPlants(userId: string) {
  const { data } = await supabase
    .from("user_plants")
    .select("plant_id")
    .eq("user_id", userId);

  return data?.map((d) => d.plant_id) ?? [];
}
