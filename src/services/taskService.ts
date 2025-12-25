import { supabase } from "./supabaseClient";
import { type CustomTask, type CalendarTask } from "../types/Task";

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
            interval,
            is_completed,
            last_completed_year,
            category,
            plant_name
        `)
        .eq("user_id", userId)
        .order("month", { ascending: true });

    if (error) {
        console.error("Fel vid hämtning av uppgifter:", error);
        throw error;
    }
    return (data as CustomTask[]) || [];
}

export async function addCustomTask(
    task: Omit<CustomTask, 'id' | 'created_at' | 'is_completed' | 'last_completed_year'>
): Promise<void> {
    const { error } = await supabase
        .from("user_tasks")
        .insert([{
            ...task,
            category: 'Anpassad'
        }]);

    if (error) {
        console.error("Fel vid tillägg av anpassad uppgift:", error);
        throw error;
    }
}


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


export async function updateTask(
    taskId: number | string,
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
export const toggleTaskStatus = async (
    task: CalendarTask,
    isCompleted: boolean
) => {
    if (String(task.id).startsWith('auto-')) {
        return {
            ...task,
            displayCompleted: isCompleted
        };
    }

    const currentYear = new Date().getFullYear();

    const { data, error } = await supabase
        .from('user_tasks')
        .update({
            is_completed: isCompleted,
            last_completed_year: currentYear
        })
        .eq('id', task.id);

    if (error) throw error;
    return data;
};
