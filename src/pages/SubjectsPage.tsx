import { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SubjectsPage = () => {
    const { subjects, tasks, addSubject, updateSubject, deleteSubject, translate } = useApp();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempName, setTempName] = useState('');
    const [tempColor, setTempColor] = useState('#6366f1');

    const handleAdd = () => {
        if (!tempName) return;
        addSubject({
            id: Date.now().toString(),
            name: tempName,
            color: tempColor
        });
        setTempName('');
    };

    const handleUpdate = () => {
        if (!editingId || !tempName) return;
        updateSubject({ id: editingId, name: tempName, color: tempColor });
        setEditingId(null);
        setTempName('');
    };

    const presetColors = [
        '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
        '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
    ];

    return (
        <div className="p-6 space-y-6 h-full overflow-y-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{translate('subjects_title')}</h1>

            {/* Add/Edit Form */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1.5 block uppercase tracking-wider">{translate('subject_name')}</label>
                        <input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (editingId ? handleUpdate() : handleAdd())}
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all duration-200"
                            placeholder={translate('subject_name_placeholder')}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1.5 block uppercase tracking-wider">{translate('subject_color')}</label>
                        <div className="flex items-center gap-1.5">
                            {presetColors.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setTempColor(c)}
                                    className={`w-7 h-7 rounded-full transition-all duration-200 hover:scale-110 ${tempColor === c ? 'ring-2 ring-offset-2 ring-primary-500 scale-110' : ''}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                            <input
                                type="color"
                                value={tempColor}
                                onChange={(e) => setTempColor(e.target.value)}
                                className="h-7 w-7 rounded-full cursor-pointer border-0 p-0 overflow-hidden"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            onClick={editingId ? handleUpdate : handleAdd}
                            className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all duration-200 active:scale-95"
                        >
                            {editingId ? translate('save') : translate('add_subject')}
                        </button>
                        {editingId && (
                            <button
                                onClick={() => { setEditingId(null); setTempName(''); }}
                                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                            >
                                {translate('cancel')}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map(sub => {
                    const taskCount = tasks.filter(t => t.subjectId === sub.id).length;
                    const completedCount = tasks.filter(t => t.subjectId === sub.id && t.status === 'completed').length;
                    const progress = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

                    return (
                        <div
                            key={sub.id}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 relative group transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
                                    style={{ backgroundColor: sub.color, boxShadow: `0 4px 14px ${sub.color}40` }}
                                >
                                    {sub.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                    <button
                                        onClick={() => { setEditingId(sub.id); setTempName(sub.name); setTempColor(sub.color); }}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors"
                                    >
                                        <Settings className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm(translate('delete_subject_confirm'))) {
                                                deleteSubject(sub.id);
                                            }
                                        }}
                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-red-500 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{sub.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{taskCount} {translate('tasks_associated')}</p>

                            {/* Progress bar */}
                            {taskCount > 0 && (
                                <div className="mt-2">
                                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                        <span>{completedCount}/{taskCount}</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{ width: `${progress}%`, backgroundColor: sub.color }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SubjectsPage;
