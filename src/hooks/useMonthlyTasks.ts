import { useState, useEffect } from "react";
import { type User } from "@supabase/supabase-js";
import { getGardenPlants } from "../services/plantsService";
import { getCustomTasks } from "../services/taskService"; 
import { getMonthName } from "../utils/dateHelpers";

export interface MonthlyTask {
    id: string | number;
    title: string;
    category: 'Skötsel' | 'Anpassad';
    plantName?: string;
    monthNumber: number;
    description: string; 
    interval: string;    
}
interface CustomTaskData {
    id: number;
    title: string;
    description: string;
    month: number;
    interval?: string; 
}

const getCurrentMonthString = () => {
    const monthNames = [
        "januari", "februari", "mars", "april", "maj", "juni",
        "juli", "augusti", "september", "oktober", "november", "december"
    ];
    return monthNames[new Date().getMonth()]; 
};

export const useMonthlyTasks = (user: User | null) => {
    const [tasks, setTasks] = useState<MonthlyTask[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentMonthNumber = new Date().getMonth() + 1; 
        if (!user) {
            setLoading(false);
            setTasks([]);
            return;
        }

        const fetchTasks = async () => {
            setLoading(true);
            try {
                const [gardenPlants, customTasks] = await Promise.all([
                    getGardenPlants(user.id),
                    getCustomTasks(user.id) as Promise<CustomTaskData[]>, 
                ]);

                const currentMonthString = getCurrentMonthString();
                const mergedTasks: MonthlyTask[] = [];
                let taskIdCounter = 0;

                gardenPlants?.forEach(plant => {
                    const careActions = [
                        { months: plant.watering.months, title: "Vattna", careDetails: plant.watering },
                        { months: plant.pruning.months, title: "Beskärning", careDetails: plant.pruning },
                        { months: plant.fertilizing.months, title: "Gödsla", careDetails: plant.fertilizing },
                        { months: plant.planting.months, title: "Plantera", careDetails: plant.planting },
                        { months: plant.winter.months, title: "Vinterskydd", careDetails: plant.winter },
                    ];

                    careActions.forEach(action => {
                        if (action.months && action.months.includes(currentMonthString)) {
                            const actionDescription = action.careDetails.notes || 'Följ rekommenderad skötsel för denna period.';
                            const actionInterval = action.careDetails.interval || getMonthName(currentMonthNumber);

                            mergedTasks.push({
                                id: plant.id + "-" + taskIdCounter++,
                                title: `${action.title} ${plant.name}`,
                                category: 'Skötsel',
                                plantName: plant.name,
                                monthNumber: currentMonthNumber,
                                
                                description: actionDescription, 
                                interval: actionInterval,
                            });
                        }
                    });
                });

                customTasks
                    ?.filter(task => task.month === currentMonthNumber)
                    .forEach(task => {
                        mergedTasks.push({
                            id: task.id,
                            title: task.title,
                            category: 'Anpassad',
                            plantName: 'Anpassad uppgift', 
                            monthNumber: task.month, 
                            description: task.description || 'Ingen beskrivning angiven.', 
                            interval: task.interval || getMonthName(task.month),
                        });
                    }); 
                
                setTasks(mergedTasks);

            } catch (error) {
                console.error("Fel vid hämtning av månadsuppgifter:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [user]);

    return { tasks, loading };
};