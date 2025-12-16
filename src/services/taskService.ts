import { supabase } from "./supabaseClient";
import { type CustomTask } from "../types/Task";


export async function getCustomTasks(userId: string): Promise<CustomTask[] | null> {
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

    return data as CustomTask[] | null;
}

export async function addCustomTask(
    userId: string,
    title: string,
    month: number,
    description: string = '', 
    interval?: string
) {
    const { error } = await supabase
        .from("user_tasks")
        .insert([{
            user_id: userId,
            title: title,
            month: month,
            description: description, 
            interval: interval      
        }]);

    if (error) {
        console.error("Fel vid tillägg av anpassad uppgift:", error);
        throw error;
    }
}