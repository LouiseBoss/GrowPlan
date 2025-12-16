import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMonthlyTasks, type MonthlyTask } from '../hooks/useMonthlyTasks';
import { getMonthName } from '../utils/dateHelpers';
import { useUserGardenStats } from '../hooks/useUserGardenStats';
import '../assets/scss/pages/OverviewPage.scss';


interface TaskListCardProps {
    tasks: MonthlyTask[];
    loading: boolean;
    currentDate: Date;
}

const TaskListCard: React.FC<TaskListCardProps> = ({ tasks, loading, currentDate }) => {

    const currentMonthNumber = currentDate.getMonth() + 1; 
    const currentMonthName = getMonthName(currentMonthNumber);
    const currentDay = currentDate.getDate(); 

    return (
        <div className="current-month-card">
            <div className="card-header">
                <span className="current-month-label">
                    {currentMonthName.toUpperCase()} {currentDay}
                </span>
                <h2 className="month-name">{currentMonthName} {currentDate.getFullYear()}</h2>

                <p className="task-count">
                    {loading
                        ? 'Laddar...'
                        : `${tasks.length} ${tasks.length === 1 ? 'uppgift' : 'uppgifter'} schemalagda denna månad`}
                </p>
                <div className="month-number-large">{currentMonthNumber}</div>
            </div>

            {loading ? (
                <div className="task-list-placeholder">Laddar uppgifter...</div>
            ) : tasks.length === 0 ? (
                <div className="no-tasks">
                    <p>Inga uppgifter schemalagda för denna månad. Se kalendern för inspiration!</p>
                    <Link to="/calendar" className="view-all-link">Gå till Kalender →</Link>
                </div>
            ) : (
                <div className="task-list">
                    {tasks.slice(0, 3).map(task => (
                        <div key={task.id} className={`task-item-card task-${task.category.toLowerCase()}`}>
                            <div className="task-icon">
                                {task.category.slice(0, 1)}
                            </div>
                            <div className="task-info">
                                <h4 className="task-title">{task.title}</h4>
                                <span className="task-detail">
                                    {task.plantName || task.category}
                                </span>
                                <p className="task-description">
                                    {task.description || 'Ingen detaljerad beskrivning angiven.'}
                                </p>
                                <p className="task-dates">
                                    <span style={{ fontWeight: 'bold' }}>Schema:</span> {task.interval || currentMonthName}
                                </p>
                            </div>
                        </div>
                    ))}

                    {tasks.length > 3 && (
                        <Link to="/calendar" className="view-all-link">
                            Se alla {tasks.length} {currentMonthName} uppgifter →
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

const OverviewPage = () => {
    const { user } = useAuth();
    const currentDate = new Date();

    const { tasks, loading: tasksLoading } = useMonthlyTasks(user);

    const { totalPlants, wishlistItems, loading: statsLoading } = useUserGardenStats(user);

    if (!user) {
        return (
            <div className="overview-container not-logged-in">
                <header className="page-header">
                    <h1>Välkommen till GrowPlan!</h1>
                    <p>Logga in för att se din personliga översikt.</p>
                </header>
            </div>
        );
    }

    return (
        <div className="overview-container">
            <header className="page-header">
                <h1>Välkommen tillbaka, {user?.email || 'GrowPlan användare'}! 🪴</h1>
                <p>Här är vad som händer i din trädgård idag.</p>
            </header>

            <section className="dashboard-grid">

                <TaskListCard
                    tasks={tasks}
                    loading={tasksLoading}
                    currentDate={currentDate}
                />

                <div className="widgets-row">

                    <Link to="/plants" className="info-widget plants-widget">
                        <div className="widget-icon">🪴</div>
                        {statsLoading ? (
                            <p>Laddar...</p>
                        ) : (
                            <>
                                <p>Gå till min trädgård</p>
                                <span className="widget-number">{totalPlants}</span>
                                <span className="widget-label">Växter i min trädgård</span>
                            </>
                        )}
                    </Link>

                    <Link to="/wishlist" className="info-widget wishlist-widget">
                        <div className="widget-icon">💖</div>
                        {statsLoading ? (
                            <p>Laddar...</p>
                        ) : (
                            <>
                                <p>Gå till min önskelista</p>
                                <span className="widget-number">{wishlistItems}</span>
                                <span className="widget-label">Önskelistade växter</span>
                            </>
                        )}
                    </Link>
                </div>

            </section>
        </div>
    );
};

export default OverviewPage;