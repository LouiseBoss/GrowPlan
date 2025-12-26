import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMonthlyTasks, type MonthlyTask } from '../hooks/useMonthlyTasks';
import { getMonthName } from '../utils/dateHelpers';
import { useUserGardenStats } from '../hooks/useUserGardenStats';
import { HiOutlineScissors } from "react-icons/hi2";
import { GiWateringCan } from "react-icons/gi";
import { LuShovel } from "react-icons/lu";
import { PiPlant } from "react-icons/pi";
import { TbSnowflake } from "react-icons/tb";
import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import '../assets/scss/pages/OverviewPage.scss';
import { IoHeartOutline } from "react-icons/io5";
import LoadingScreen from '../components/LoadingScreen';


const getTaskIcon = (category: string, title: string) => {
    const searchText = `${category} ${title}`.toLowerCase();

    if (searchText.includes('vinter') || searchText.includes('förvara') || searchText.includes('övervintra')) {
        return <TbSnowflake />;
    }

    if (searchText.includes('vattna')) return <GiWateringCan />;
    if (searchText.includes('beskär')) return <HiOutlineScissors />;
    if (searchText.includes('plantera')) return <LuShovel />;
    if (searchText.includes('gödsla') || searchText.includes('näring')) return <PiPlant />;

    return <PiPlant />;
};

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
                    <p>Inga uppgifter schemalagda för denna månad.</p>
                    <Link to="/calendar" className="view-all-link">Gå till Kalender →</Link>
                </div>
            ) : (
                <div className="task-list">
                    {tasks.slice(0, 3).map(task => (
                        <div key={task.id} className={`task-item-card task-${task.category.toLowerCase()}`}>
                            <div className="task-icon">
                                {getTaskIcon(task.category, task.title)}
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

                    <div className="task-list-footer">
                        <Link to="/calendar" className="goto-calendar-minimal">
                            <FaCalendarAlt /> Gå till kalender för full översikt <FaArrowRight className="arrow" />
                        </Link>
                    </div>
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

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Odlare';

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

    if (tasksLoading || statsLoading) {
        return <LoadingScreen />;
    }

    return (
        <div className="overview-container">
            <header className="page-header">
                <h1>Välkommen tillbaka, {displayName}! 🪴</h1>
                <p>Här är vad som händer i din trädgård just nu</p>
            </header>

            <section className="dashboard-grid">
                <TaskListCard
                    tasks={tasks}
                    loading={tasksLoading}
                    currentDate={currentDate}
                />

                <div className="widgets-row">
                    <Link to="/garden" className="stat-widget">
                        <div className="stat-icon garden">
                            <PiPlant />
                        </div>
                        <div className="stat-content">
                            <span className="stat-number">{totalPlants}</span>
                            <span className="stat-label">Växter i trädgården</span>
                        </div>
                        <FaArrowRight className="stat-arrow" />
                    </Link>

                    <Link to="/wishlist" className="stat-widget">
                        <div className="stat-icon wishlist">
                            <IoHeartOutline />
                        </div>
                        <div className="stat-content">
                            <span className="stat-number">{wishlistItems}</span>
                            <span className="stat-label">På önskelistan</span>
                        </div>
                        <FaArrowRight className="stat-arrow" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default OverviewPage;