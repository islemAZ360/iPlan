import { useState, DragEvent } from 'react';
import { Plus, AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task } from '../types';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal';
import SubjectChip from '../components/SubjectChip';

const HomePage = () => {
    const { tasks, subjects, addTask, updateTask, deleteTask, translate } = useApp();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [draggedOverDate, setDraggedOverDate] = useState<string | null>(null);
    const [activeTask, setActiveTask] = useState<Task | 'new' | null>(null);
    const [showDelayed, setShowDelayed] = useState(false);

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const todayStr = new Date().toISOString().split('T')[0];

    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

    const getTasksForDate = (dateStr: string) => tasks.filter(t => t.dueDate === dateStr && t.status !== 'delayed');
    const delayedTasks = tasks.filter(t => t.status === 'delayed');

    const handleDrop = (e: DragEvent<HTMLDivElement>, dateStr: string) => {
        e.preventDefault();
        setDraggedOverDate(null);
        const taskId = e.dataTransfer.getData('taskId');
        const task = tasks.find(t => t.id === taskId);

        if (task) {
            const isPastDate = dateStr < todayStr;
            let newStatus = task.status;
            if (task.status !== 'completed') {
                newStatus = isPastDate ? 'delayed' : 'pending';
            }
            updateTask({ ...task, dueDate: dateStr, status: newStatus });
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>, dateStr: string) => {
        e.preventDefault();
        if (draggedOverDate !== dateStr) setDraggedOverDate(dateStr);
    };

    const handleSaveTask = (taskData: Partial<Task>) => {
        if (activeTask === 'new') {
            const initialStatus = (taskData.dueDate && taskData.dueDate < todayStr) ? 'delayed' : 'pending';
            addTask({
                id: Date.now().toString(),
                title: taskData.title!,
                subjectId: taskData.subjectId!,
                dueType: 'specific',
                dueDate: taskData.dueDate || todayStr,
                status: initialStatus,
                priority: taskData.priority || 'medium',
                createdAt: new Date().toISOString(),
                description: taskData.description
            });
        } else if (activeTask && typeof activeTask === 'object') {
            updateTask({ ...activeTask, ...taskData });
        }
        setActiveTask(null);
    };

    const nextMonth = () => setCurrentDate(new Date(year, month + 1));
    const prevMonth = () => setCurrentDate(new Date(year, month - 1));
    const goToday = () => setCurrentDate(new Date());

    return (
        <div className="flex h-full relative overflow-hidden bg-gray-50 dark:bg-gray-950">
            {/* Calendar Section */}
            <div className="flex-1 p-4 lg:p-6 overflow-y-auto h-full flex flex-col">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <button
                        onClick={() => setActiveTask('new')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-gray-900 rounded-full text-xs font-bold shadow-lg shadow-gray-900/20 dark:shadow-white/10 hover:scale-105 transition-all duration-200"
                    >
                        <Plus className="w-4 h-4" /> {translate('new_task')}
                    </button>
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block" />
                    {subjects.map(sub => (
                        <SubjectChip key={sub.id} subject={sub} />
                    ))}

                    {/* Mobile delayed toggle */}
                    <button
                        onClick={() => setShowDelayed(!showDelayed)}
                        className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-bold"
                    >
                        <AlertCircle className="w-3.5 h-3.5" />
                        {delayedTasks.length}
                    </button>
                </div>

                {/* Calendar */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col flex-1 overflow-hidden">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between p-5 lg:p-6 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white capitalize">
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h2>
                        <div className="flex gap-1 items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                            <button onClick={prevMonth} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 transition-all duration-200">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button onClick={goToday} className="px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors">
                                {translate('today_date')}
                            </button>
                            <button onClick={nextMonth} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 transition-all duration-200">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="py-3 text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">{d}</div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 auto-rows-fr bg-gray-100 dark:bg-gray-800 gap-px flex-1 overflow-y-auto min-w-[600px] lg:min-w-0">
                        {days.map((date, idx) => {
                            if (!date) return <div key={`empty-${idx}`} className="bg-white dark:bg-gray-900 min-h-[80px] lg:min-h-[100px]" />;

                            const dateStr = date.toISOString().split('T')[0];
                            const dayTasks = getTasksForDate(dateStr);
                            const isToday = dateStr === todayStr;
                            const isDragTarget = draggedOverDate === dateStr;
                            const isPast = dateStr < todayStr;

                            return (
                                <div
                                    key={dateStr}
                                    onDragOver={(e) => handleDragOver(e, dateStr)}
                                    onDrop={(e) => handleDrop(e, dateStr)}
                                    onDragLeave={() => setDraggedOverDate(null)}
                                    className={`
                    bg-white dark:bg-gray-900 min-h-[80px] lg:min-h-[100px] p-1.5 lg:p-2 transition-all duration-200 relative flex flex-col gap-1
                    ${isDragTarget ? 'bg-primary-50 dark:bg-primary-900/20 ring-inset ring-2 ring-primary-500 z-10 scale-[1.02]' : ''}
                    ${isPast ? 'bg-gray-50/50 dark:bg-gray-900/80' : ''}
                  `}
                                >
                                    <div className={`
                    text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-0.5
                    ${isToday ? 'bg-gradient-to-br from-primary-500 to-purple-600 text-white shadow-md shadow-primary-500/30' : 'text-gray-500 dark:text-gray-400'}
                  `}>
                                        {date.getDate()}
                                    </div>
                                    <div className="flex-1 space-y-1 w-full overflow-hidden">
                                        {dayTasks.slice(0, 3).map(task => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                subject={subjects.find(s => s.id === task.subjectId)}
                                                compact
                                                draggable
                                                onClick={() => setActiveTask(task)}
                                            />
                                        ))}
                                        {dayTasks.length > 3 && (
                                            <div className="text-[10px] text-gray-400 font-medium text-center">+{dayTasks.length - 3}</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Delayed Tasks Panel - Desktop */}
            <div className="w-72 xl:w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex-col shadow-xl z-20 hidden lg:flex">
                <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-900">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm uppercase tracking-wide">
                        <AlertCircle className="w-4 h-4" />
                        {translate('delays_title')}
                        {delayedTasks.length > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {delayedTasks.length}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{translate('delays_hint')}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30 dark:bg-black/20">
                    {delayedTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                            <CheckCircle className="w-12 h-12 text-gray-400 mb-2" />
                            <p className="text-sm font-medium text-gray-500">{translate('delays_empty')}</p>
                            <p className="text-xs text-gray-400">{translate('great_job')}</p>
                        </div>
                    ) : (
                        delayedTasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                subject={subjects.find(s => s.id === task.subjectId)}
                                draggable
                                onClick={() => setActiveTask(task)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Mobile Delayed Tasks Drawer */}
            {showDelayed && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDelayed(false)} />
                    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl max-h-[60vh] flex flex-col animate-slideUp">
                        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold">
                                <AlertCircle className="w-4 h-4" /> {translate('delays_title')} ({delayedTasks.length})
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {delayedTasks.map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    subject={subjects.find(s => s.id === task.subjectId)}
                                    onClick={() => { setActiveTask(task); setShowDelayed(false); }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <TaskFormModal
                isOpen={activeTask !== null}
                onClose={() => setActiveTask(null)}
                task={activeTask === 'new' ? null : activeTask}
                subjects={subjects}
                translate={translate}
                onSave={handleSaveTask}
                onDelete={deleteTask}
            />
        </div>
    );
};

export default HomePage;
