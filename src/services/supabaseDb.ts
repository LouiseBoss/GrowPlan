import { supabase } from '../lib/supabaseClient';

// --- CREATE ---
export async function addPlantToUser(userId: string, plantId: number, notes: string = '') {
    const { data, error } = await supabase
        .from('user_plants')
        .insert([
            {
                user_id: userId,
                plant_id: plantId,
                notes: notes
            },
        ]);

    if (error) {
        console.error('Kunde inte lägga till växt:', error.message);
        return false;
    }

    console.log('Växt tillagd:', data);
    return true;
}


// --- DELETE ---
export async function deleteUserPlant(rowId: string) {
    const { error } = await supabase
        .from('user_plants')
        .delete()
        .eq('id', rowId);

    if (error) {
        console.error('Kunde inte ta bort växt:', error.message);
        return false;
    }

    console.log('Växt borttagen (ID:', rowId + ')');
    return true;
}

// --- READ (inloggade användarens sparade växter) ---
export async function getSavedPlants(userId: string) {
    const { data, error } = await supabase
        .from('user_plants')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        throw error;
    }
    return data;
}