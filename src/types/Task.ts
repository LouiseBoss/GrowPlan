export interface CustomTask {
    id: number;
    user_id: string;
    title: string;
    month: number;
    description: string;
    interval?: string;
    created_at: string;
    is_completed: boolean;
    last_completed_year: number;
    category?: string;
    plant_name?: string;
}

export interface MonthlyTask {
    id: string | number;
    title: string;
    category: 'Skötsel' | 'Anpassad';
    plantName?: string;
    plant_name?: string; 
    monthNumber: number;
    description: string;
    interval: string;
    is_completed?: boolean;
    last_completed_year?: number;
}

export type CalendarTask = MonthlyTask & {
    user_id?: string;
    displayCompleted?: boolean;
};