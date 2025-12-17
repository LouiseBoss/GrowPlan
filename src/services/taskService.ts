import { supabase } from "./supabaseClient";
import { type CustomTask } from "../types/Task";

/**
 * Hämtar alla uppgifter 
 */
export async function getCustomTasks(userId: string): Promise<CustomTask[]> {
    const { data, error } = await supabase
        .from("user_tasks")
        .select(`
            id, 
            title, 
            month, 
            created_at, 
            user_id,
            description, 
            interval     
        `)
        .eq("user_id", userId)
        .order("month", { ascending: true });

    if (error) {
        console.error("Fel vid hämtning av anpassade uppgifter:", error);
        throw error;
    }

    return (data as CustomTask[]) || [];
}

/**
 * Lägger till en ny anpassad uppgift.
 * 
 */
export async function addCustomTask(
    task: Omit<CustomTask, 'id' | 'created_at'>
): Promise<void> {
    const { error } = await supabase
        .from("user_tasks")
        .insert([task]);

    if (error) {
        console.error("Fel vid tillägg av anpassad uppgift:", error);
        throw error;
    }
}

/**
 * Raderar en uppgift baserat på ID.
 */
export async function deleteTask(taskId: string | number): Promise<void> {
    const { error } = await supabase
        .from('user_tasks')
        .delete()
        .eq('id', taskId);

    if (error) {
        console.error("Fel vid radering av uppgift:", error);
        throw error;
    }
}

/**
 * Uppdaterar en befintlig uppgift.
 * 
 */
export async function updateTask(
    taskId: number,
    updates: Partial<Omit<CustomTask, 'id' | 'user_id' | 'created_at'>>
): Promise<void> {
    const { error } = await supabase
        .from('user_tasks')
        .update(updates)
        .eq('id', taskId);

    if (error) {
        console.error("Fel vid uppdatering av uppgift:", error);
        throw error;
    }
}