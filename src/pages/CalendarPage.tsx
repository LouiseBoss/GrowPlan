import React, { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAnnualTasks } from "../hooks/useAnnualTasks";
import { type CustomTask, type MonthlyTask } from "../types/Task";
import TaskForm from "../components/TaskForm";
// Se till att detta är rätt filnamn (tasksService eller taskService?)
import { deleteTask } from "../services/taskService";

import { TfiPencilAlt, TfiTrash } from "react-icons/tfi";
import { HiOutlineScissors } from "react-icons/hi2";
import { GiWateringCan } from "react-icons/gi";
import { LuShovel } from "react-icons/lu";
import { PiPlant } from "react-icons/pi";
import { TbSnowflake } from "react-icons/tb";

import { toast } from "react-toastify";
import "../assets/scss/pages/CalendarPage.scss";

const getMonthName = (monthIndex: number): string => {
    const monthNames = [
        "Januari", "Februari", "Mars", "April", "Maj", "Juni",
        "Juli", "Augusti", "September", "Oktober", "November", "December"
    ];
    return monthNames[monthIndex - 1];
};

const getTaskIcon = (title: string) => {
    const t = title.toLowerCase();
    const color = "#3A4A3D";
    const size = 18;

    if (t.includes("beskär")) return <HiOutlineScissors size={size} color={color} />;
    if (t.includes("vattna")) return <GiWateringCan size={size} color={color} />;
    if (t.includes("plantera") || t.includes("ta upp") || t.includes("dahlia")) return <LuShovel size={size} color={color} />;
    if (t.includes("göd") || t.includes("näring")) return <PiPlant size={size} color={color} />;
    if (t.includes("vinter") || t.includes("skydd") || t.includes("krukor") || t.includes("flytta in")) return <TbSnowflake size={size} color={color} />;

    return null;
};

interface CalendarMonthProps {
    monthNumber: number;
    tasks: (CustomTask | MonthlyTask)[];
    onDelete: (id: number) => void;
    onEdit: (task: CustomTask) => void;
}

const CalendarMonth: React.FC<CalendarMonthProps> = ({ tasks, onDelete, onEdit, monthNumber }) => {
    return (
        <div className="calendar-month">
            <h3>{getMonthName(monthNumber)}</h3>
            {tasks.length === 0 ? (
                <p className="no-tasks">Inga uppgifter.</p>
            ) : (
                <ul>
                    {tasks.map((task) => {
                        const isCustom = ('user_id' in task && task.user_id) || ('category' in task && task.category === 'Anpassad');
                        const category = 'category' in task ? task.category : 'Anpassad';

                        return (
                            <li key={task.id} className={`task-item task-${category.toLowerCase()}`}>
                                <div className="task-row">
                                    <div className="task-main">
                                        <span className="task-icon-wrapper">
                                            {getTaskIcon(task.title)}
                                        </span>
                                        <span className="task-title">{task.title}</span>
                                    </div>

                                    {isCustom && (
                                        <div className="task-actions">
                                            <button
                                                onClick={() => onEdit(task as CustomTask)}
                                                className="action-btn edit-btn"
                                            >
                                                <TfiPencilAlt size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(Number(task.id))}
                                                className="action-btn delete-btn"
                                            >
                                                <TfiTrash size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

const CalendarPage = () => {
    const { user, loading: userLoading } = useAuth();
    const { allTasks, loading: tasksLoading, refetch } = useAnnualTasks(user);
    const [taskToEdit, setTaskToEdit] = useState<CustomTask | null>(null);

    const groupedTasks = useMemo(() => {
        const groups: Record<number, (CustomTask | MonthlyTask)[]> = {};
        for (let i = 1; i <= 12; i++) groups[i] = [];

        (allTasks as (CustomTask | MonthlyTask)[]).forEach((task) => {
            const m = 'month' in task ? task.month : task.monthNumber;
            if (m && groups[m]) {
                groups[m].push(task);
            }
        });
        return groups;
    }, [allTasks]);

    // FIX FÖR RADERING
    const handleDelete = async (id: number) => {
        // Om du vill slippa den "fula" fönstret kan du ta bort if-checken nedan, 
        // men det är säkrast att ha en bekräftelse.
        if (!window.confirm("Vill du ta bort uppgiften?")) return;

        try {
            await deleteTask(id);
            toast.success("Uppgiften raderades!");
            await refetch(); // Vänta på att listan uppdateras
        } catch (err) {
            console.error("Fel vid radering:", err);
            toast.error("Kunde inte ta bort uppgiften. Prova att ladda om sidan.");
        }
    };

    if (userLoading || tasksLoading) return <div className="loading">Laddar kalender...</div>;
    if (!user) return <Navigate to="/auth" replace />;

    return (
        <div className="calendar-container">
            <h1>Årsöversikt & Planering</h1>

            <div className="task-form-section">
                <div className="form-card">
                    <h2>{taskToEdit ? "Redigera uppgift" : "Lägg till ny uppgift"}</h2>
                    <TaskForm
                        userId={user.id}
                        onTaskAdded={() => {
                            refetch();
                            setTaskToEdit(null);
                        }}
                        editTask={taskToEdit}
                        onCancel={() => setTaskToEdit(null)}
                    />
                </div>
            </div>

            <hr />

            <div className="calendar-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                    <CalendarMonth
                        key={m}
                        monthNumber={m}
                        tasks={groupedTasks[m] || []} // SÄKERHETSKOLL FÖR RAD 126
                        onDelete={handleDelete}
                        onEdit={(task) => {
                            setTaskToEdit(task);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default CalendarPage;