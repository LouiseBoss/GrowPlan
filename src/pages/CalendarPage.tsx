import { useMemo, useState, useRef, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAnnualTasks } from "../hooks/useAnnualTasks";
import { type CustomTask, type CalendarTask } from "../types/Task";
import TaskForm from "../components/TaskForm";
import { deleteTask, toggleTaskStatus } from "../services/taskService";

import { TfiPencilAlt, TfiTrash, TfiCheck } from "react-icons/tfi";
import { HiOutlineScissors } from "react-icons/hi2";
import { GiWateringCan } from "react-icons/gi";
import { LuShovel } from "react-icons/lu";
import { PiPlant } from "react-icons/pi";
import { TbSnowflake } from "react-icons/tb";
import { TiPinOutline } from "react-icons/ti";

import { toast } from "react-toastify";
import { getMonthName } from "../utils/dateHelpers";
import "../assets/scss/pages/CalendarPage.scss";

const getTaskIcon = (title: string, category?: string) => {
    const t = title.toLowerCase();
    const size = 16;
    if (t.includes("vinter") || t.includes("skydd") || t.includes("frost")) return <TbSnowflake size={size} />;
    if (t.includes("beskär")) return <HiOutlineScissors size={size} />;
    if (t.includes("vattna")) return <GiWateringCan size={size} />;
    if (t.includes("plantera")) return <LuShovel size={size} />;
    if (t.includes("göd")) return <PiPlant size={size} />;
    if (category === "Anpassad") return <TiPinOutline size={size} />;
    return null;
};


const CalendarPage = () => {
    const { user, loading: userLoading } = useAuth();
    const { allTasks, loading: tasksLoading, refetch } = useAnnualTasks(user);

    const [taskToEdit, setTaskToEdit] = useState<CustomTask | null>(null);
    const [activeMonth, setActiveMonth] = useState<number>(1);
    const [localCompleted, setLocalCompleted] = useState<Record<string, boolean>>({});
    const [expandedPlants, setExpandedPlants] = useState<Record<string, boolean>>({});

    const monthRefs = useRef<(HTMLDivElement | null)[]>([]);
    const currentYear = new Date().getFullYear();

    const togglePlant = (plantKey: string) => {
        setExpandedPlants(prev => ({
            ...prev,
            [plantKey]: !prev[plantKey]
        }));
    };

    const handleToggle = async (task: CalendarTask, e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        const newStatus = !task.displayCompleted;

        setLocalCompleted((prev) => ({
            ...prev,
            [task.id]: newStatus
        }));

        try {
            await toggleTaskStatus(task, newStatus);
        } catch (error) {
            console.error("Toggle error:", error);
            toast.error("Kunde inte spara.");
            setLocalCompleted((prev) => ({
                ...prev,
                [task.id]: !newStatus
            }));
        }
    };

    const handleEditClick = (task: CalendarTask) => {
        if (!task.user_id) return;
        setTaskToEdit({
            id: Number(task.id),
            user_id: task.user_id,
            title: task.title,
            month: task.monthNumber,
            description: task.description || "",
            interval: task.interval,
            created_at: new Date().toISOString(),
            is_completed: !!task.displayCompleted,
            last_completed_year: task.last_completed_year || currentYear,
            category: task.category,
            plant_name: task.plant_name || task.plantName
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const groupedData = useMemo(() => {
        const months: Record<number, Record<string, CalendarTask[]>> = {};
        for (let i = 1; i <= 12; i++) months[i] = {};

        allTasks.forEach((task) => {
            const m = task.monthNumber;
            if (!m) return;

            const rawName = task.plant_name || task.plantName || "ÖVRIGT";
            const plantKey = rawName.toUpperCase().trim();

            if (!months[m][plantKey]) months[m][plantKey] = [];

            const isCompletedInDB = task.last_completed_year === currentYear && !!task.is_completed;
            const isCompleted = localCompleted[task.id] ?? isCompletedInDB;

            months[m][plantKey].push({
                ...task,
                displayCompleted: isCompleted
            });
        });

        return months;
    }, [allTasks, localCompleted, currentYear]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const monthIndex = Number(entry.target.getAttribute("data-month"));
                        setActiveMonth(monthIndex);
                    }
                });
            },
            { threshold: 0.6 }
        );
        monthRefs.current.forEach((ref) => ref && observer.observe(ref));
        return () => observer.disconnect();
    }, [tasksLoading]);

    const scrollToMonth = (index: number) => {
        monthRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
    };

    if (userLoading || tasksLoading) return <div className="loading">Laddar kalender…</div>;
    if (!user) return <Navigate to="/auth" replace />;

    return (
        <div className="calendar-container">
            <h1>Årsöversikt & Planering</h1>

            <div className="task-form-section">
                <div className="form-header">
                    <h2>{taskToEdit ? "Redigera uppgift" : "Lägg till ny uppgift"}</h2>
                    <p>Planera din trädgård månad för månad</p>

                </div>
                <TaskForm
                    userId={user.id}
                    editTask={taskToEdit}
                    onCancel={() => setTaskToEdit(null)}
                    onTaskAdded={() => {
                        refetch();
                        setTaskToEdit(null);
                    }}
                />
            </div>

            <div className="month-nav-mobile">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m, i) => (
                    <button
                        key={m}
                        onClick={() => scrollToMonth(i)}
                        className={activeMonth === m ? "active" : ""}
                    >
                        {getMonthName(m).slice(0, 3)}
                    </button>
                ))}
            </div>

            <div className="swipe-guide">
                <span>Bläddra mellan månader</span>
                <div className="arrow-animation">→</div>
            </div>

            <div className="calendar-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m, i) => (
                    <div
                        key={m}
                        data-month={m}
                        ref={(el) => { monthRefs.current[i] = el; }}
                        className="calendar-month"
                    >
                        <h3>{getMonthName(m)}</h3>

                        <div className="month-content">
                            {Object.entries(groupedData[m]).map(([plantKey, tasks]) => {
                                const uniqueKey = `${m}-${plantKey}`;
                                const isExpanded = expandedPlants[uniqueKey] || false;
                                const allDone = tasks.every(t => t.displayCompleted);

                                return (
                                    <div key={plantKey} className={`plant-group-card ${isExpanded ? 'is-expanded' : ''}`}>
                                        <div className="plant-header" onClick={() => togglePlant(uniqueKey)}>
                                            <span className="plant-name">
                                                {plantKey}
                                                {allDone && <TfiCheck className="all-done-icon" />}
                                            </span>
                                            <span className={`expand-arrow ${isExpanded ? 'up' : 'down'}`}>▼</span>
                                        </div>

                                        {isExpanded && (
                                            <ul className="task-list">
                                                {tasks.map((task) => (
                                                    <li key={task.id} className={`task-item ${task.displayCompleted ? "completed-row" : ""}`}>
                                                        <div className="task-row">
                                                            <div className="task-main">
                                                                <div
                                                                    className={`custom-checkbox ${task.displayCompleted ? "checked" : ""}`}
                                                                    onClick={(e) => handleToggle(task, e)}
                                                                >
                                                                    {task.displayCompleted && <TfiCheck size={12} />}
                                                                </div>
                                                                <span className="task-icon-wrapper">
                                                                    {getTaskIcon(task.title, task.category)}
                                                                </span>
                                                                <span className="task-title">{task.title}</span>
                                                            </div>

                                                            {!String(task.id).startsWith("auto-") && (
                                                                <div className="task-actions">
                                                                    {task.category === "Anpassad" && (
                                                                        <button className="action-btn" onClick={() => handleEditClick(task)}>
                                                                            <TfiPencilAlt />
                                                                        </button>
                                                                    )}
                                                                    <button className="action-btn delete-btn" onClick={() => {
                                                                        if (confirm("Radera?")) deleteTask(task.id).then(refetch);
                                                                    }}>
                                                                        <TfiTrash />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarPage;