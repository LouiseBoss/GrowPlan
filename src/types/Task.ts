
export interface CustomTask {
    id: number; 
    user_id: string;
    title: string;
    month: number;
    description: string;
    interval?: string;
    created_at: string; 
}


export interface MonthlyTask {
    id: string | number;
    title: string;
    category: 'Skötsel' | 'Anpassad';
    plantName?: string;
    monthNumber: number;
    description: string;
    interval: string;
}