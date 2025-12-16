import React, { useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAnnualTasks } from "../hooks/useAnnualTasks";
import { type MonthlyTask } from "../hooks/useMonthlyTasks";
import TaskForm from "../components/TaskForm";
import "../assets/scss/pages/CalendarPage.scss";

const getMonthName = (monthIndex: number): string => {
    const monthNames = [
        "Januari", "Februari", "Mars", "April", "Maj", "Juni",
        "Juli", "Augusti", "September", "Oktober", "November", "December"
    ];
    return monthNames[monthIndex - 1];
};

interface CalendarMonthProps {
    monthNumber: number;
    tasks: MonthlyTask[];
}

const CalendarMonth: React.FC<CalendarMonthProps> = ({ monthNumber, tasks }) => {
    return (
        <div className="calendar-month">
            <h3>{getMonthName(monthNumber)}</h3>
            {tasks.length === 0 ? (
                <p className="no-tasks">Inga uppgifter.</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id} className={`task-item task-${task.category.toLowerCase()}`}>
                            <span className="task-type">[{task.category.slice(0, 1)}]</span>
                            {task.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


const CalendarPage = () => {
    const { user, loading: userLoading } = useAuth();
    const { allTasks, loading: tasksLoading, refetch } = useAnnualTasks(user);
    const groupedTasks = useMemo(() => {
        const groups: Record<number, MonthlyTask[]> = Array.from({ length: 12 }, (_, i) => i + 1)
            .reduce((acc, month) => ({ ...acc, [month]: [] }), {});

        allTasks.forEach((task: MonthlyTask) => {
            if (task.monthNumber && groups[task.monthNumber]) {
                groups[task.monthNumber].push(task);
            }
        });

        return groups;
    }, [allTasks]);


    if (userLoading || tasksLoading) {
        return <div className="loading">Laddar kalender...</div>;
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <div className="calendar-container">
            <h1>Årsöversikt & Planering</h1>

            <div className="task-form-section">
                <h2>Lägg till ny uppgift</h2>
                <TaskForm userId={user.id} onTaskAdded={refetch} />
            </div>

            <hr />

            <div className="calendar-grid">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((monthNumber) => (
                    <CalendarMonth
                        key={monthNumber}
                        monthNumber={monthNumber}
                        tasks={groupedTasks[monthNumber]}
                    />
                ))}
            </div>
        </div>
    );
};

export default CalendarPage;