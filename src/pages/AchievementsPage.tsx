import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart as RePieChart, Pie } from 'recharts';
import { useApp, calculateStreak, BADGE_DEFINITIONS } from '../context/AppContext';
import { Flame, Trophy, Target } from 'lucide-react';
import BadgeCard from '../components/BadgeCard';
import XPBar from '../components/XPBar';
import { BadgeId } from '../types';

const AchievementsPage = () => {
    const { tasks, subjects, xp, badges, translate } = useApp();

    const totalCompleted = tasks.filter(t => t.status === 'completed').length;
    const todayStr = new Date().toISOString().split('T')[0];
    const completedToday = tasks.filter(t => t.status === 'completed' && t.completedAt?.startsWith(todayStr)).length;
    const streak = calculateStreak(tasks);

    const subjectStats = subjects.map(sub => ({
        name: sub.name,
        count: tasks.filter(t => t.subjectId === sub.id && t.status === 'completed').length,
        total: tasks.filter(t => t.subjectId === sub.id).length,
        color: sub.color
    })).filter(s => s.total > 0);

    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        weeklyData.push({
            day: d.toLocaleDateString('en', { weekday: 'short' }),
            count: tasks.filter(t => t.status === 'completed' && t.completedAt?.startsWith(dateStr)).length
        });
    }

    const allBadgeIds = Object.keys(BADGE_DEFINITIONS) as BadgeId[];

    return (
        <div className="p-6 space-y-6 h-full overflow-y-auto mesh-bg">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{translate('achievements_title')}</h1>

            {/* XP Bar */}
            <XPBar xp={xp} />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-indigo-500 via-primary-600 to-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative flex items-center gap-3 mb-3"><Trophy className="w-5 h-5 opacity-80" /><p className="opacity-80 font-medium text-sm uppercase tracking-wider">{translate('total_completed')}</p></div>
                    <h2 className="text-5xl font-bold relative">{totalCompleted}</h2>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 dark:bg-primary-900/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative flex items-center gap-3 mb-3"><Target className="w-5 h-5 text-primary-500" /><p className="text-gray-500 font-medium text-sm uppercase tracking-wider">{translate('completed_today')}</p></div>
                    <h2 className="text-5xl font-bold text-gray-900 dark:text-white relative">{completedToday}</h2>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 dark:bg-orange-900/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative flex items-center gap-3 mb-3"><Flame className="w-5 h-5 text-orange-500" /><p className="text-gray-500 font-medium text-sm uppercase tracking-wider">{translate('streak')}</p></div>
                    <h2 className="text-5xl font-bold text-orange-500 relative">{streak} <span className="text-lg text-gray-400 font-medium">{translate('streak_days')}</span></h2>
                </div>
            </div>

            {/* Badges */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4">{translate('badges_title')}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {allBadgeIds.map(id => {
                        const badge = badges.find(b => b.id === id);
                        return <BadgeCard key={id} badgeId={id} unlocked={!!badge} unlockedAt={badge?.unlockedAt} />;
                    })}
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 h-80">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">{translate('completed_by_subject')}</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={subjectStats}>
                            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} axisLine={false} tickLine={false} />
                            <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', fontSize: '13px' }} cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="count" radius={[8, 8, 4, 4]} barSize={36}>
                                {subjectStats.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 h-80">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">{translate('distribution')}</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <RePieChart>
                            <Pie data={subjectStats} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="count" stroke="none">
                                {subjectStats.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                            </Pie>
                            <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', fontSize: '13px' }} />
                        </RePieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Weekly */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4">{translate('weekly_activity')}</h3>
                <div className="flex items-end gap-2 h-32">
                    {weeklyData.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[10px] font-bold text-gray-500">{d.count || ''}</span>
                            <div className="w-full rounded-lg bg-gradient-to-t from-primary-500 to-purple-400 transition-all duration-500 min-h-[4px]" style={{ height: `${Math.max(d.count * 25, 4)}%` }} />
                            <span className="text-[10px] text-gray-400 font-medium">{d.day}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AchievementsPage;
