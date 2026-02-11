import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task } from '../types';
import TaskFormModal from '../components/TaskFormModal';

const TodayPage = () => {
    const { tasks, subjects, updateTask, deleteTask, translate } = useApp();
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const todayStr = new Date().toISOString().split('T')[0];
    const todaysTasks = tasks.filter(t => t.dueDate === todayStr && t.status !== 'delayed');
    const completedCount = todaysTasks.filter(t => t.status === 'completed').length;
    const progress = todaysTasks.length > 0 ? Math.round((completedCount / todaysTasks.length) * 100) : 0;

    const toggleComplete = (task: Task) => {
        updateTask({
            ...task,
            status: task.status === 'completed' ? 'pending' : 'completed',
            completedAt: task.status === 'completed' ? undefined : new Date().toISOString(),
        });
    };

    const handleSaveEdit = (updatedData: Partial<Task>) => {
        if (editingTask && updatedData.id) {
            updateTask({ ...editingTask, ...updatedData });
        }
        setEditingTask(null);
    };

    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const sortedTasks = [...todaysTasks].sort((a, b) => {
        // Completed tasks go to the end
        if (a.status === 'completed' && b.status !== 'completed') return 1;
        if (a.status !== 'completed' && b.status === 'completed') return -1;
        return (priorityOrder[a.priority || 'medium']) - (priorityOrder[b.priority || 'medium']);
    });

    return (
        <div className="p-6 max-w-4xl mx-auto h-full overflow-y-auto">
            {/* Header with progress */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{translate('nav_today')}</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{new Date().toDateString()}</p>
                </div>
                <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" className="text-gray-100 dark:text-gray-800" strokeWidth="6" />
                        <circle
                            cx="40" cy="40" r="34" fill="none" stroke="url(#progressGradient)" strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 34}`}
                            strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
                            className="transition-all duration-700"
                        />
                        <defs>
                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className="absolute text-sm font-bold text-gray-700 dark:text-gray-200">{completedCount}/{todaysTasks.length}</span>
                </div>
            </div>

            {/* Progress bar */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                    <span>{translate('completed_today')}: {completedCount}</span>
                    <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-700"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Tasks */}
            <div className="space-y-3">
                {sortedTasks.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-dashed border-gray-300 dark:border-gray-700">
                        <CheckCircle className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-gray-500 font-medium">{translate('no_tasks_today')}</p>
                    </div>
                ) : (
                    sortedTasks.map(task => {
                        const subject = subjects.find(s => s.id === task.subjectId);
                        const priorityColors: Record<string, string> = {
                            high: 'border-l-red-500',
                            medium: 'border-l-yellow-500',
                            low: 'border-l-green-500',
                        };
                        return (
                            <div
                                key={task.id}
                                className={`flex items-center gap-4 p-4 rounded-2xl border border-l-4 transition-all duration-300 ${task.status === 'completed'
                                        ? 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 border-l-gray-300 opacity-60'
                                        : `bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md ${priorityColors[task.priority || 'medium']}`
                                    }`}
                            >
                                <button
                                    onClick={() => toggleComplete(task)}
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${task.status === 'completed'
                                            ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-500 text-white scale-110 shadow-md shadow-green-500/30'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                                        }`}
                                >
                                    {task.status === 'completed' && <CheckCircle className="w-5 h-5" />}
                                </button>
                                <div
                                    className="flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => setEditingTask(task)}
                                >
                                    <h3 className={`font-semibold text-gray-900 dark:text-white ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>{task.title}</h3>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: subject?.color }}>{subject?.name}</span>
                                        {task.description && <span className="text-xs text-gray-400 truncate max-w-[200px] hidden sm:inline-block">— {task.description}</span>}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <TaskFormModal
                isOpen={!!editingTask}
                onClose={() => setEditingTask(null)}
                task={editingTask}
                subjects={subjects}
                translate={translate}
                onSave={handleSaveEdit}
                onDelete={deleteTask}
            />
        </div>
    );
};

export default TodayPage;
