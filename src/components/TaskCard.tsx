import { DragEvent } from 'react';
import { GripVertical, Clock, CheckCircle, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';
import { Task, Subject } from '../types';

interface TaskCardProps {
    task: Task;
    subject?: Subject;
    onClick?: () => void;
    compact?: boolean;
    draggable?: boolean;
}

const PriorityIcon = ({ priority }: { priority?: string }) => {
    if (priority === 'high') return <ArrowUp className="w-3 h-3 text-red-500" />;
    if (priority === 'low') return <ArrowDown className="w-3 h-3 text-green-500" />;
    return null;
};

const TaskCard = ({ task, subject, onClick, compact = false, draggable = false }: TaskCardProps) => {
    const isDelayed = task.status === 'delayed';
    const isCompleted = task.status === 'completed';

    const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('taskId', task.id);
        e.dataTransfer.effectAllowed = 'move';
        (e.target as HTMLElement).style.opacity = '0.5';
    };

    const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
        (e.target as HTMLElement).style.opacity = '1';
    };

    if (compact) {
        return (
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    onClick?.();
                }}
                draggable={draggable}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                className={`
          group relative p-1.5 rounded-lg border-l-[3px] shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:-translate-y-0.5
          ${isCompleted ? 'bg-green-50 dark:bg-green-900/20 opacity-60' : 'bg-white dark:bg-gray-800'}
          ${isDelayed ? 'bg-red-50 dark:bg-red-900/10' : ''}
          ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}
        `}
                style={{ borderLeftColor: subject?.color || '#ccc' }}
            >
                <div className="flex items-center gap-1">
                    <PriorityIcon priority={task.priority} />
                    <div className={`text-[11px] font-medium leading-tight break-words flex-1 ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                        {task.title}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            draggable={draggable}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={`
        bg-white dark:bg-gray-800 rounded-xl p-3.5 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-all duration-300 relative group hover:-translate-y-0.5
        ${isDelayed ? 'ring-1 ring-red-200 dark:ring-red-900/30 bg-red-50/30 dark:bg-red-900/5' : ''}
        ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}
      `}
        >
            <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: subject?.color }} />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{subject?.name}</span>
                        <PriorityIcon priority={task.priority} />
                    </div>
                    <h4 className={`font-semibold text-sm text-gray-800 dark:text-gray-100 ${isCompleted ? 'line-through opacity-60' : ''}`}>
                        {task.title}
                    </h4>
                </div>
                {draggable && <GripVertical className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-200" />}
            </div>
            {task.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{task.description}</p>
            )}
            {isDelayed && (
                <div className="mt-2 flex items-center gap-1 text-[10px] text-red-500 font-semibold animate-pulse">
                    <Clock className="w-3 h-3" /> Delayed
                </div>
            )}
        </div>
    );
};

export default TaskCard;
