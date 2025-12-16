import React, { useState } from "react";
import { addCustomTask } from "../services/taskService";

interface TaskFormProps {
    userId: string;
    onTaskAdded: () => void; 
}

const TaskForm: React.FC<TaskFormProps> = ({ userId, onTaskAdded }) => {
    const [title, setTitle] = useState("");
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const monthOptions = [
        "Januari", "Februari", "Mars", "April", "Maj", "Juni", 
        "Juli", "Augusti", "September", "Oktober", "November", "December"
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        setError(null);

        try {
            await addCustomTask(userId, title.trim(), month);
            setTitle(""); 
            onTaskAdded(); 
        } catch (err) {
            setError("Kunde inte lägga till uppgiften. Kontrollera RLS!");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <input
                type="text"
                placeholder="Titel på uppgift (t.ex. Flytta krukor till skugga)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                required
            />
            
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))} disabled={loading}>
                {monthOptions.map((name, index) => (
                    <option key={index} value={index + 1}>
                        {name}
                    </option>
                ))}
            </select>
            
            <button type="submit" disabled={loading}>
                {loading ? "Sparar..." : "Lägg till uppgift"}
            </button>
            
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
};

export default TaskForm;