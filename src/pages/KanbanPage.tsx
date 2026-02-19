import { useState, DragEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { CanvasRevealEffect } from '../components/ui/canvas-reveal-effect';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal';
import { Task } from '../types';

type Column = 'pending' | 'in_progress' | 'completed';

const KanbanPage = () => {
    const { tasks, subjects, updateTask, deleteTask, translate } = useApp();
    const [dragOverCol, setDragOverCol] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const columns: { id: Column; title: string; dotColor: string; canvasColors: number[][]; canvasBg: string }[] = [
        {
            id: 'pending',
            title: translate('kanban_pending'),
            dotColor: 'bg-blue-500',
            canvasColors: [[59, 130, 246], [99, 102, 241]],
            canvasBg: 'bg-blue-900',
        },
        {
            id: 'in_progress',
            title: translate('kanban_in_progress'),
            dotColor: 'bg-amber-500',
            canvasColors: [[245, 158, 11], [234, 88, 12]],
            canvasBg: 'bg-amber-900',
        },
        {
            id: 'completed',
            title: translate('kanban_completed'),
            dotColor: 'bg-green-500',
            canvasColors: [[34, 197, 94], [16, 185, 129]],
            canvasBg: 'bg-emerald-900',
        },
    ];

    const getColumnTasks = (col: Column) => tasks.filter(t => t.status === col);

    const handleDrop = (e: DragEvent<HTMLDivElement>, col: Column) => {
        e.preventDefault();
        setDragOverCol(null);
        const taskId = e.dataTransfer.getData('taskId');
        const task = tasks.find(t => t.id === taskId);
        if (task && task.status !== col) {
            updateTask({
                ...task,
                status: col,
                completedAt: col === 'completed' ? new Date().toISOString() : undefined,
            });
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>, col: Column) => {
        e.preventDefault();
        if (dragOverCol !== col) setDragOverCol(col);
    };

    const handleSave = (data: Partial<Task>) => {
        if (activeTask) updateTask({ ...activeTask, ...data });
        setActiveTask(null);
    };

    // Corner "+" icon for the canvas card reveal
    const CornerIcon = ({ className }: { className?: string }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={className}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
        </svg>
    );

    return (
        <div className="p-4 lg:p-6 h-full flex flex-col overflow-hidden">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{translate('kanban_title')}</h1>

            <div className="flex-1 flex gap-4 lg:gap-6 overflow-x-auto overflow-y-hidden pb-4 snap-x snap-mandatory">
                {columns.map(col => {
                    const colTasks = getColumnTasks(col.id);
                    return (
                        <div
                            key={col.id}
                            className="flex-1 min-w-[85vw] sm:min-w-[300px] lg:min-w-[320px] flex flex-col rounded-2xl overflow-hidden snap-center"
                            onDragOver={(e) => handleDragOver(e, col.id)}
                            onDrop={(e) => handleDrop(e, col.id)}
                            onDragLeave={() => setDragOverCol(null)}
                        >
                            {/* Content Container (Header + Body) */}
                            <div className="relative z-10 flex flex-col h-full bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm p-3 rounded-2xl">
                                {/* Column Header */}
                                <div className="flex items-center gap-3 mb-4 px-1 py-2">
                                    <div className={`w-3 h-3 rounded-full ${col.dotColor} shrink-0 shadow-lg`} />
                                    <h2 className="font-bold text-lg text-gray-800 dark:text-gray-200">
                                        {col.title}
                                    </h2>
                                    <span className="ml-auto bg-gray-100/50 dark:bg-gray-800/50 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full">
                                        {colTasks.length}
                                    </span>
                                </div>

                                {/* Column Body */}
                                <div className={`
                                    flex-1 rounded-xl space-y-3 overflow-y-auto transition-all duration-200 p-1
                                    ${dragOverCol === col.id
                                        ? 'bg-primary-50/20 dark:bg-primary-900/20 ring-2 ring-primary-400/50'
                                        : ''
                                    }
                                `}>
                                    {colTasks.length === 0 ? (
                                        <div className="flex items-center justify-center h-32 text-center">
                                            <p className="text-sm text-gray-500/70">{translate('kanban_empty')}</p>
                                        </div>
                                    ) : (
                                        colTasks.map(task => (
                                            <div
                                                key={task.id}
                                                className="group/canvas-card relative rounded-xl overflow-hidden border border-black/[0.1] dark:border-white/[0.1]"
                                                onMouseEnter={(e) => e.currentTarget.setAttribute('data-hovered', 'true')}
                                                onMouseLeave={(e) => e.currentTarget.removeAttribute('data-hovered')}
                                            >
                                                {/* Corner Icons */}
                                                <CornerIcon className="absolute h-4 w-4 -top-1 -left-1 dark:text-white/30 text-black/30 opacity-0 group-hover/canvas-card:opacity-100 transition-opacity z-30" />
                                                <CornerIcon className="absolute h-4 w-4 -bottom-1 -left-1 dark:text-white/30 text-black/30 opacity-0 group-hover/canvas-card:opacity-100 transition-opacity z-30" />
                                                <CornerIcon className="absolute h-4 w-4 -top-1 -right-1 dark:text-white/30 text-black/30 opacity-0 group-hover/canvas-card:opacity-100 transition-opacity z-30" />
                                                <CornerIcon className="absolute h-4 w-4 -bottom-1 -right-1 dark:text-white/30 text-black/30 opacity-0 group-hover/canvas-card:opacity-100 transition-opacity z-30" />

                                                {/* Canvas Reveal on Card Hover */}
                                                <AnimatePresence>
                                                    {/* Use CSS to detect hover via group */}
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 0 }}
                                                        className="h-full w-full absolute inset-0 z-10 pointer-events-none opacity-0 group-hover/canvas-card:opacity-100 transition-opacity duration-300"
                                                    >
                                                        <CanvasRevealEffect
                                                            animationSpeed={5}
                                                            containerClassName={col.canvasBg}
                                                            colors={col.canvasColors}
                                                            dotSize={2}
                                                        />
                                                        <div className="absolute inset-0 [mask-image:radial-gradient(300px_at_center,white,transparent)] bg-black/50 dark:bg-black/80" />
                                                    </motion.div>
                                                </AnimatePresence>

                                                {/* Task Card Content */}
                                                <div className="relative z-20">
                                                    <TaskCard
                                                        task={task}
                                                        subject={subjects.find(s => s.id === task.subjectId)}
                                                        draggable
                                                        onClick={() => setActiveTask(task)}
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <TaskFormModal
                isOpen={!!activeTask}
                onClose={() => setActiveTask(null)}
                task={activeTask}
                subjects={subjects}
                translate={translate}
                onSave={handleSave}
                onDelete={deleteTask}
            />
        </div>
    );
};

export default KanbanPage;
