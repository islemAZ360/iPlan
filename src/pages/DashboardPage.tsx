import { Link } from 'react-router-dom';
import { CalendarDays, Flame, Zap, Target, Clock, ChevronRight, CheckCircle2, Timer, ArrowRight } from 'lucide-react';
import { useApp, calculateStreak, getLevel } from '../context/AppContext';

const DashboardPage = () => {
    const { tasks, subjects, habits, pomodoroSessions, notes, xp, translate, isHabitDone, toggleHabitLog } = useApp();
    const { user } = useApp();

    const todayStr = new Date().toISOString().split('T')[0];
    const hour = new Date().getHours();
    const greeting = hour < 12 ? translate('good_morning') : hour < 18 ? translate('good_afternoon') : translate('good_evening');

    const todayTasks = tasks.filter(t => t.dueDate === todayStr);
    const completedToday = todayTasks.filter(t => t.status === 'completed').length;
    const todayProgress = todayTasks.length > 0 ? Math.round((completedToday / todayTasks.length) * 100) : 0;

    const streak = calculateStreak(tasks);
    const { level, currentLevelXp, nextLevelXp } = getLevel(xp);

    const todayFocus = pomodoroSessions
        .filter(s => s.completedAt.startsWith(todayStr))
        .reduce((sum, s) => sum + s.duration, 0);

    const upcomingTasks = tasks
        .filter(t => t.status === 'pending' && t.dueDate && t.dueDate >= todayStr)
        .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
        .slice(0, 5);

    const recentNotes = [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3);

    return (
        <div className="p-4 lg:p-6 h-full overflow-y-auto space-y-6 mesh-bg">
            {/* Hero */}
            <div className="hero-gradient rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden shadow-2xl shadow-violet-600/30 noise-overlay animate-slideUp">
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-sm" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-sm" />
                <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/3 rounded-full blur-2xl animate-float" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">{greeting} 👋</p>
                        <h1 className="text-3xl lg:text-4xl font-extrabold mb-1 tracking-tight">{user.name}</h1>
                        <p className="text-white/60 text-sm font-medium">{translate('dashboard_subtitle')}</p>
                        <div className="flex items-center gap-3 mt-5 flex-wrap">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3.5 py-2 border border-white/15 shadow-sm shadow-violet-500/10">
                                <Zap className="w-4 h-4 text-yellow-300 drop-shadow-[0_0_4px_rgba(250,204,21,0.5)]" />
                                <span className="text-sm font-bold">{translate('level')} {level}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3.5 py-2 border border-white/15 shadow-sm shadow-orange-500/10">
                                <Flame className="w-4 h-4 text-orange-300 drop-shadow-[0_0_4px_rgba(251,146,60,0.5)]" />
                                <span className="text-sm font-bold">{streak} {translate('streak_days')}</span>
                            </div>
                            <Link to="/pomodoro" className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3.5 py-2 border border-white/15 hover:bg-white/20 transition-all group shadow-sm shadow-cyan-500/10">
                                <Timer className="w-4 h-4 text-cyan-300" />
                                <span className="text-sm font-bold">{translate('start_focus')}</span>
                                <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </Link>
                        </div>
                    </div>

                    {/* XP Ring */}
                    <div className="relative w-32 h-32 flex-shrink-0">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                            <circle cx="50" cy="50" r="42" fill="none" stroke="url(#xpGrad)" strokeWidth="6" strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 42}`}
                                strokeDashoffset={`${2 * Math.PI * 42 * (1 - currentLevelXp / nextLevelXp)}`}
                                className="transition-all duration-700"
                                style={{ filter: 'drop-shadow(0 0 6px rgba(251,191,36,0.4))' }}
                            />
                            <defs>
                                <linearGradient id="xpGrad" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#fbbf24" />
                                    <stop offset="100%" stopColor="#f97316" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                            <span className="text-3xl font-extrabold">{currentLevelXp}</span>
                            <span className="text-[10px] opacity-40 font-medium">/ {nextLevelXp} XP</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
                {[
                    { icon: Target, label: translate('tasks_due_today'), value: `${completedToday}/${todayTasks.length}`, color: 'from-blue-500 to-indigo-600', iconBg: 'from-blue-500 to-indigo-600', progress: todayProgress },
                    { icon: Flame, label: translate('streak'), value: `${streak} ${translate('streak_days')}`, color: 'from-orange-500 to-red-500', iconBg: 'from-orange-500 to-red-500', progress: Math.min(streak * 14, 100) },
                    { icon: Clock, label: translate('focus_time'), value: todayFocus >= 60 ? `${Math.floor(todayFocus / 60)}${translate('hours_short')} ${todayFocus % 60}${translate('minutes_short')}` : `${todayFocus}${translate('minutes_short')}`, color: 'from-emerald-500 to-teal-600', iconBg: 'from-emerald-500 to-teal-600', progress: Math.min(todayFocus / 120 * 100, 100) },
                    { icon: Zap, label: translate('total_xp'), value: `${xp} XP`, color: 'from-amber-500 to-orange-500', iconBg: 'from-amber-500 to-orange-500', progress: (currentLevelXp / nextLevelXp) * 100 },
                ].map((stat, i) => (
                    <div key={i} className="bg-[rgba(15,10,40,0.6)] backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[rgba(139,92,246,0.12)] card-hover group">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`} style={{ filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.3))' }}>
                            <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-[11px] text-violet-300/50 font-bold uppercase tracking-wider mb-0.5">{stat.label}</p>
                        <p className="text-2xl font-extrabold text-white tracking-tight">{stat.value}</p>
                        <div className="w-full bg-[rgba(139,92,246,0.1)] rounded-full h-1.5 mt-3 overflow-hidden">
                            <div className={`h-full rounded-full bg-gradient-to-r ${stat.color} transition-all duration-700`} style={{ width: `${stat.progress}%` }} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming Tasks */}
                <div className="lg:col-span-2 bg-[rgba(15,10,40,0.6)] backdrop-blur-sm rounded-2xl shadow-sm border border-[rgba(139,92,246,0.12)] overflow-hidden card-hover">
                    <div className="flex items-center justify-between p-5 border-b border-[rgba(139,92,246,0.1)]">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-violet-400" /> {translate('upcoming_tasks')}
                        </h3>
                        <Link to="/" className="text-xs text-primary-500 font-bold hover:underline flex items-center gap-1 group">
                            {translate('view_all')} <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                    <div className="divide-y divide-[rgba(139,92,246,0.08)]">
                        {upcomingTasks.length === 0 ? (
                            <div className="p-10 text-center text-gray-400">
                                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="text-sm font-medium">{translate('no_tasks_today')}</p>
                            </div>
                        ) : (
                            upcomingTasks.map((task, i) => {
                                const sub = subjects.find(s => s.id === task.subjectId);
                                return (
                                    <div key={task.id} className="flex items-center gap-3 p-4 hover:bg-[rgba(139,92,246,0.05)] transition-all duration-200 group" style={{ animationDelay: `${i * 60}ms` }}>
                                        <div className="w-2.5 h-2.5 rounded-full shadow-sm ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800" style={{ backgroundColor: sub?.color }} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-200 truncate group-hover:text-violet-400 transition-colors">{task.title}</p>
                                            <p className="text-[11px] text-gray-500">{sub?.name} · {task.dueDate}</p>
                                        </div>
                                        {task.priority === 'high' && <span className="text-[10px] px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full font-bold">{translate('priority_high')}</span>}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6 stagger-children">
                    {/* Quick Habits */}
                    <div className="bg-[rgba(15,10,40,0.6)] backdrop-blur-sm rounded-2xl shadow-sm border border-[rgba(139,92,246,0.12)] overflow-hidden card-hover">
                        <div className="flex items-center justify-between p-5 border-b border-[rgba(139,92,246,0.1)]">
                            <h3 className="font-bold text-white text-sm">{translate('quick_habits')}</h3>
                            <Link to="/habits" className="text-xs text-primary-500 font-bold hover:underline">{translate('view_all')}</Link>
                        </div>
                        <div className="p-4 space-y-1.5">
                            {habits.slice(0, 4).map(h => {
                                const done = isHabitDone(h.id, todayStr);
                                return (
                                    <button
                                        key={h.id}
                                        onClick={() => toggleHabitLog(h.id, todayStr)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${done ? 'bg-emerald-500/10 ring-1 ring-emerald-500/30' : 'hover:bg-[rgba(139,92,246,0.05)]'
                                            }`}
                                    >
                                        <span className={`text-xl transition-transform duration-300 ${done ? 'scale-110' : ''}`}>{h.icon}</span>
                                        <span className={`text-sm font-medium flex-1 text-left ${done ? 'text-emerald-400 line-through' : 'text-gray-200'}`}>{h.name}</span>
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${done ? 'bg-emerald-500 text-white scale-110 shadow-md shadow-emerald-500/30' : 'bg-[rgba(139,92,246,0.1)]'
                                            }`}>
                                            {done && <CheckCircle2 className="w-4 h-4" />}
                                        </div>
                                    </button>
                                );
                            })}
                            {habits.length === 0 && (
                                <Link to="/habits" className="flex items-center justify-center gap-2 py-6 text-sm text-gray-400 hover:text-primary-500 transition-colors group">
                                    <span className="text-lg">🌱</span>
                                    {translate('add_habit')}
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Recent Notes */}
                    <div className="bg-[rgba(15,10,40,0.6)] backdrop-blur-sm rounded-2xl shadow-sm border border-[rgba(139,92,246,0.12)] overflow-hidden card-hover">
                        <div className="flex items-center justify-between p-5 border-b border-[rgba(139,92,246,0.1)]">
                            <h3 className="font-bold text-white text-sm">{translate('recent_notes')}</h3>
                            <Link to="/notes" className="text-xs text-primary-500 font-bold hover:underline">{translate('view_all')}</Link>
                        </div>
                        <div className="p-4 space-y-2">
                            {recentNotes.map(n => (
                                <div key={n.id} className="p-3 rounded-xl bg-[rgba(139,92,246,0.06)] border-l-3 hover:bg-[rgba(139,92,246,0.1)] transition-all cursor-pointer group" style={{ borderLeftWidth: '3px', borderLeftColor: n.color }}>
                                    <p className="text-sm font-semibold text-gray-200 truncate group-hover:text-violet-400 transition-colors">{n.title}</p>
                                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{n.content.slice(0, 60)}</p>
                                </div>
                            ))}
                            {notes.length === 0 && (
                                <Link to="/notes" className="flex items-center justify-center gap-2 py-6 text-sm text-gray-400 hover:text-primary-500 transition-colors group">
                                    <span className="text-lg">📝</span>
                                    {translate('add_note')}
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
