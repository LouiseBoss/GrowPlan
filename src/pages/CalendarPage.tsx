import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAnnualTasks } from "../hooks/useAnnualTasks";
import { type CustomTask, type MonthlyTask } from "../types/Task";
import TaskForm from "../components/TaskForm";
import { deleteTask } from "../services/taskService";

import { TfiPencilAlt, TfiTrash } from "react-icons/tfi";
import { HiOutlineScissors } from "react-icons/hi2";
import { GiWateringCan } from "react-icons/gi";
import { LuShovel } from "react-icons/lu";
import { PiPlant } from "react-icons/pi";
import { TbSnowflake } from "react-icons/tb";
import { TiPinOutline } from "react-icons/ti";

import { toast } from "react-toastify";
import "../assets/scss/pages/CalendarPage.scss";

const getMonthName = (monthIndex: number): string => {
    const monthNames = [
        "Januari", "Februari", "Mars", "April", "Maj", "Juni",
        "Juli", "Augusti", "September", "Oktober", "November", "December"
    ];
    return monthNames[monthIndex - 1];
};

const getTaskIcon = (title: string, isCustom: boolean) => {
    const t = title.toLowerCase();
    const color = "#3A4A3D";
    const size = 16;

    if (isCustom) return <TiPinOutline size={size} color={color} />;
    if (t.includes("beskär")) return <HiOutlineScissors size={size} color={color} />;
    if (t.includes("vattna")) return <GiWateringCan size={size} color={color} />;
    if (t.includes("plantera") || t.includes("ta upp") || t.includes("dahlia")) return <LuShovel size={size} color={color} />;
    if (t.includes("göd") || t.includes("näring")) return <PiPlant size={size} color={color} />;
    if (t.includes("vinter") || t.includes("skydd") || t.includes("krukor") || t.includes("flytta in")) return <TbSnowflake size={size} color={color} />;

    return null;
};

const CalendarPage = () => {
    const { user, loading: userLoading } = useAuth();
    const { allTasks, loading: tasksLoading, refetch } = useAnnualTasks(user);
    const [taskToEdit, setTaskToEdit] = useState<CustomTask | null>(null);

    const groupedData = useMemo(() => {
        const months: Record<number, Record<string, (CustomTask | MonthlyTask)[]>> = {};
        for (let i = 1; i <= 12; i++) months[i] = {};

        (allTasks as (CustomTask | MonthlyTask)[]).forEach((task) => {
            const m = 'month' in task ? task.month : task.monthNumber;
            if (m && months[m]) {
                const plantName = task.title.split(' ').pop() || "Övrigt"; 
                
                if (!months[m][plantName]) {
                    months[m][plantName] = [];
                }
                months[m][plantName].push(task);
            }
        });
        return months;
    }, [allTasks]);

    const handleDelete = async (id: string | number) => {
        if (!window.confirm("Vill du ta bort uppgiften?")) return;
        try {
            await deleteTask(id); 
            toast.success("Uppgiften raderades!");
            await refetch();
        } catch (err) {
            console.error("Fel vid radering:", err);
            toast.error("Kunde inte ta bort uppgiften.");
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
                    <div key={m} className="calendar-month">
                        <h3>{getMonthName(m)}</h3>
                        <div className="month-content">
                            {Object.keys(groupedData[m]).length === 0 ? (
                                <p className="no-tasks">Inga uppgifter.</p>
                            ) : (
                                Object.entries(groupedData[m]).map(([plant, tasks]) => (
                                    <div key={plant} className="plant-group-card">
                                        <div className="plant-header">
                                            <span className="plant-name">{plant}</span>
                                        </div>
                                        <ul className="task-list">
                                            {tasks.map((task) => {
                                                const isCustom = ('user_id' in task && task.user_id) || ('category' in task && task.category === 'Anpassad');
                                                const category = 'category' in task ? task.category : 'Anpassad';
                                                
                                                return (
                                                    <li key={task.id} className={`task-item task-${category.toLowerCase()} ${isCustom ? 'is-user-task' : ''}`}>
                                                        <div className="task-row">
                                                            <div className="task-main">
                                                                <span className="task-icon-wrapper">
                                                                    {getTaskIcon(task.title, !!isCustom)}
                                                                </span>
                                                                <span className="task-title">{task.title}</span>
                                                            </div>
                                                            {isCustom && (
                                                                <div className="task-actions">
                                                                    <button onClick={() => {
                                                                        setTaskToEdit(task as CustomTask);
                                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                    }} className="action-btn edit-btn">
                                                                        <TfiPencilAlt size={14} />
                                                                    </button>
                                                                    <button onClick={() => handleDelete(task.id)} className="action-btn delete-btn">
                                                                        <TfiTrash size={14} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarPage;