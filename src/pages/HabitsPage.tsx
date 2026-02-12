import { useState } from 'react';
import { Plus, X, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

const EMOJIS = ['💪', '📚', '🏃', '🧘', '💧', '🍎', '🎵', '✍️', '🌅', '😴', '🧠', '🎯'];
const HABIT_COLORS = ['#6366f1', '#ec4899', '#22c55e', '#f97316', '#06b6d4', '#8b5cf6', '#ef4444', '#eab308'];

const HabitsPage = () => {
    const { habits, addHabit, deleteHabit, isHabitDone, toggleHabitLog, getHabitStreak, translate } = useApp();
    const [showAdd, setShowAdd] = useState(false);
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('💪');
    const [color, setColor] = useState(HABIT_COLORS[0]);

    const todayStr = new Date().toISOString().split('T')[0];

    // Last 7 days
    const last7Days: string[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        last7Days.push(d.toISOString().split('T')[0]);
    }

    const handleAdd = () => {
        if (!name) return;
        addHabit({ id: Date.now().toString(), name, icon, color, createdAt: new Date().toISOString() });
        setName('');
        setShowAdd(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto h-full overflow-y-auto space-y-6 mesh-bg">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{translate('habits_title')}</h1>
                <button
                    onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-gray-900 rounded-full text-xs font-bold shadow-lg hover:scale-105 transition-all duration-200"
                >
                    <Plus className="w-4 h-4" /> {translate('add_habit')}
                </button>
            </div>

            {habits.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                    <span className="text-5xl mb-4 block">🌱</span>
                    <p className="text-gray-400 font-medium">{translate('habits_empty')}</p>
                </div>
            ) : (
                <>
                    {/* Day Headers */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="grid gap-0" style={{ gridTemplateColumns: '1fr repeat(7, 48px)' }}>
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700" />
                            {last7Days.map(d => {
                                const date = new Date(d);
                                const isToday = d === todayStr;
                                return (
                                    <div key={d} className={`p-2 flex flex-col items-center justify-center border-b border-gray-100 dark:border-gray-700 ${isToday ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">{date.toLocaleDateString('en', { weekday: 'short' })}</span>
                                        <span className={`text-sm font-bold mt-0.5 ${isToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'}`}>
                                            {date.getDate()}
                                        </span>
                                    </div>
                                );
                            })}

                            {/* Habit Rows */}
                            {habits.map(h => {
                                const streak = getHabitStreak(h.id);
                                return (
                                    <div key={h.id} className="contents group">
                                        <div className="flex items-center gap-3 p-4 border-b border-gray-50 dark:border-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-700/30 transition-colors">
                                            <span className="text-xl">{h.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">{h.name}</p>
                                                {streak > 0 && (
                                                    <div className="flex items-center gap-1 text-[10px] text-orange-500 font-bold mt-0.5">
                                                        <Flame className="w-3 h-3" /> {streak} {translate('days')}
                                                    </div>
                                                )}
                                            </div>
                                            <button onClick={() => { if (window.confirm(translate('delete_task_confirm'))) deleteHabit(h.id); }} className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {last7Days.map(d => {
                                            const done = isHabitDone(h.id, d);
                                            const isToday = d === todayStr;
                                            return (
                                                <div
                                                    key={d}
                                                    className={`flex items-center justify-center border-b border-gray-50 dark:border-gray-800 ${isToday ? 'bg-primary-50/30 dark:bg-primary-900/5' : ''}`}
                                                >
                                                    <button
                                                        onClick={() => toggleHabitLog(h.id, d)}
                                                        className={`w-8 h-8 rounded-xl transition-all duration-300 flex items-center justify-center ${done
                                                            ? 'text-white scale-105 shadow-md'
                                                            : 'bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                            }`}
                                                        style={done ? { backgroundColor: h.color, boxShadow: `0 2px 8px ${h.color}40` } : undefined}
                                                    >
                                                        {done && <span className="text-xs">✓</span>}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}

            {/* Add Habit Modal */}
            {showAdd && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn border border-gray-100 dark:border-gray-700">
                        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{translate('add_habit')}</h3>
                            <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{translate('habit_name')}</label>
                                <input
                                    autoFocus
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder={translate('habit_name_placeholder')}
                                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{translate('habit_icon')}</label>
                                <div className="flex flex-wrap gap-2">
                                    {EMOJIS.map(e => (
                                        <button
                                            key={e}
                                            onClick={() => setIcon(e)}
                                            className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${icon === e ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500 scale-110' : 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                        >
                                            {e}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{translate('subject_color')}</label>
                                <div className="flex gap-2">
                                    {HABIT_COLORS.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setColor(c)}
                                            className={`w-8 h-8 rounded-full transition-all ${color === c ? 'ring-2 ring-offset-2 ring-primary-500 scale-110' : 'hover:scale-110'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={handleAdd}
                                disabled={!name}
                                className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 disabled:opacity-50 transition-all duration-200 active:scale-[0.98]"
                            >
                                {translate('save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HabitsPage;
