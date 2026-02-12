import { useState, useEffect, DragEvent } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Task, Subject } from '../types';

interface TaskFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task | null;
    subjects: Subject[];
    onSave: (taskData: Partial<Task>) => void;
    onDelete?: (id: string) => void;
    translate: (key: string) => string;
}

const TaskFormModal = ({ isOpen, onClose, task, subjects, onSave, onDelete, translate }: TaskFormModalProps) => {
    const [title, setTitle] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

    useEffect(() => {
        if (isOpen) {
            if (task) {
                setTitle(task.title);
                setSubjectId(task.subjectId);
                setDate(task.dueDate || '');
                setDescription(task.description || '');
                setPriority(task.priority || 'medium');
            } else {
                setTitle('');
                setSubjectId('');
                setDate(new Date().toISOString().split('T')[0]);
                setDescription('');
                setPriority('medium');
            }
        }
    }, [isOpen, task]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!title || !subjectId) return;
        onSave({
            id: task?.id,
            title,
            subjectId,
            dueDate: date,
            description,
            priority,
        });
        onClose();
    };



    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn border border-gray-100 dark:border-gray-700">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-primary-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {task ? translate('edit') : translate('add_task')}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/60 dark:hover:bg-gray-700 rounded-full transition-all duration-200">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{translate('task_title')}</label>
                        <input
                            autoFocus
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white transition-all duration-200"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder={translate('task_placeholder')}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{translate('select_subject')}</label>
                        <select
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all duration-200 appearance-none"
                            value={subjectId}
                            onChange={e => setSubjectId(e.target.value)}
                        >
                            <option value="">{translate('select_subject_placeholder')}</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{translate('due_date')}</label>
                            <input
                                type="date"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all duration-200"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{translate('priority')}</label>
                            <div className="glass-radio-group">
                                <input
                                    type="radio"
                                    name="priority"
                                    id="glass-high"
                                    checked={priority === 'high'}
                                    onChange={() => setPriority('high')}
                                />
                                <label htmlFor="glass-high">{translate('priority_high')}</label>
                                <input
                                    type="radio"
                                    name="priority"
                                    id="glass-medium"
                                    checked={priority === 'medium'}
                                    onChange={() => setPriority('medium')}
                                />
                                <label htmlFor="glass-medium">{translate('priority_medium')}</label>
                                <input
                                    type="radio"
                                    name="priority"
                                    id="glass-low"
                                    checked={priority === 'low'}
                                    onChange={() => setPriority('low')}
                                />
                                <label htmlFor="glass-low">{translate('priority_low')}</label>
                                <div className="glass-glider"></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{translate('task_desc')}</label>
                        <textarea
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all duration-200 min-h-[80px] resize-none"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder={translate('desc_placeholder')}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        {task && onDelete && (
                            <button
                                onClick={() => {
                                    if (window.confirm(translate('delete_task_confirm'))) {
                                        onDelete(task.id);
                                        onClose();
                                    }
                                }}
                                className="px-4 py-3.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl font-bold transition-all duration-200 hover:scale-105"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={!title || !subjectId}
                            className="flex-1 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-bold shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-95"
                        >
                            {translate('save')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskFormModal;
