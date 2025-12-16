import { useState, useEffect, useCallback } from "react";
import { type User } from "@supabase/supabase-js";
import { getGardenPlants } from "../services/plantsService";
import { getCustomTasks } from "../services/taskService";
import { type Plant } from "../types/Plant";
import { type MonthlyTask, type CustomTask } from "../types/Task";
import { getMonthName } from "../utils/dateHelpers"; 

const MONTH_NAMES_LOWERCASE = [
    "januari", "februari", "mars", "april", "maj", "juni",
    "juli", "augusti", "september", "oktober", "november", "december"
];

const getCareDetails = (plant: Plant, actionTitle: string) => {
    switch (actionTitle) {
        case "Vattna": return plant.watering;
        case "Beskärning": return plant.pruning;
        case "Gödsla": return plant.fertilizing;
        case "Plantera": return plant.planting;
        case "Vinterskydd": return plant.winter;
        default: return { months: [], notes: undefined, interval: undefined };
    }
};


const generateAnnualTasks = (plants: Plant[], customTasks: CustomTask[]): MonthlyTask[] => {
    const tasks: MonthlyTask[] = [];
    let taskIdCounter = 0;

    for (let monthNumber = 1; monthNumber <= 12; monthNumber++) {
        const monthString = MONTH_NAMES_LOWERCASE[monthNumber - 1];
        const monthName = getMonthName(monthNumber);

        plants.forEach(plant => {
            const careActions = [
                { months: plant.watering.months, title: "Vattna", category: 'Skötsel' as const },
                { months: plant.pruning.months, title: "Beskärning", category: 'Skötsel' as const },
                { months: plant.fertilizing.months, title: "Gödsla", category: 'Skötsel' as const },
                { months: plant.planting.months, title: "Plantera", category: 'Skötsel' as const },
                { months: plant.winter.months, title: "Vinterskydd", category: 'Skötsel' as const },
            ];

            careActions.forEach(action => {
                if (action.months && action.months.includes(monthString)) {

                    const details = getCareDetails(plant, action.title);

                    tasks.push({
                        id: plant.id + "-" + taskIdCounter++ + "-" + monthNumber,
                        title: `${action.title} ${plant.name}`,
                        category: 'Skötsel',
                        plantName: plant.name,
                        monthNumber: monthNumber,

                        description: details.notes || `${action.title} behövs för ${plant.name} under denna period.`,
                        interval: details.interval || monthName, 
                    });
                }
            });
        });
    }

    customTasks?.forEach(task => {
        const monthName = getMonthName(task.month);

        tasks.push({
            id: task.id,
            title: task.title,
            category: 'Anpassad',
            plantName: undefined,
            monthNumber: task.month,

            description: task.description || 'Ingen beskrivning angiven.',
            interval: task.interval || monthName,
        });
    });

    return tasks;
};


export const useAnnualTasks = (user: User | null) => {
    const [allTasks, setAllTasks] = useState<MonthlyTask[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = useCallback(async () => {
        if (!user) {
            setAllTasks([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const [gardenPlants, customTasks] = await Promise.all([
                getGardenPlants(user.id),
                getCustomTasks(user.id),
            ]);

            const mergedTasks = generateAnnualTasks(gardenPlants || [], customTasks || []);
            setAllTasks(mergedTasks);

        } catch (error) {
            console.error("Fel vid hämtning av årsuppgifter:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return { allTasks, loading, refetch: fetchTasks };
};