import React, { useState, useEffect } from 'react';
import { addCustomTask, updateTask } from '../services/taskService';
import { type CustomTask } from '../types/Task';
import { toast } from 'react-toastify';

interface TaskFormProps {
    userId: string;
    onTaskAdded: () => void; // Trigger för att ladda om kalendern
    editTask: CustomTask | null; // Uppgiften som ska redigeras (om någon)
    onCancel: () => void; // Funktion för att avbryta redigering
}

const TaskForm: React.FC<TaskFormProps> = ({ userId, onTaskAdded, editTask, onCancel }) => {
    const [title, setTitle] = useState('');
    const [month, setMonth] = useState(1);
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fyll i formuläret om vi går in i "edit-läge"
    useEffect(() => {
        if (editTask) {
            setTitle(editTask.title);
            setMonth(editTask.month);
            setDescription(editTask.description || '');
        } else {
            resetForm();
        }
    }, [editTask]);

    const resetForm = () => {
        setTitle('');
        setMonth(1);
        setDescription('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);
        try {
            if (editTask) {
                // Uppdatera befintlig uppgift
                await updateTask(editTask.id, {
                    title,
                    month,
                    description
                });
                toast.success("Uppgift uppdaterad!");
            } else {
                // Skapa ny uppgift
                await addCustomTask({
                    user_id: userId,
                    title,
                    month,
                    description,
                });
                toast.success("Ny uppgift tillagd!");
            }
            
            resetForm();
            onTaskAdded(); // Ber CalendarPage att köra refetch
        } catch (error) {
            toast.error("Något gick fel. Försök igen.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <div className="form-group">
                <label htmlFor="title">Uppgift</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="T.ex. Beskära äppelträdet"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="month">Månad</label>
                <select 
                    id="month" 
                    value={month} 
                    onChange={(e) => setMonth(Number(e.target.value))}
                >
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {new Date(0, i).toLocaleString('sv-SE', { month: 'long' })}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="desc">Beskrivning (valfritt)</label>
                <textarea
                    id="desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Anteckningar om hur det ska göras..."
                />
            </div>

            <div className="form-actions">
                <button type="submit" disabled={isSubmitting} className="btn-save">
                    {isSubmitting ? 'Sparar...' : editTask ? 'Uppdatera uppgift' : 'Spara uppgift'}
                </button>
                
                {editTask && (
                    <button type="button" onClick={onCancel} className="btn-cancel">
                        Avbryt
                    </button>
                )}
            </div>
        </form>
    );
};

export default TaskForm;