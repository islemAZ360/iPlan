import { useState } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, PieChart, Settings, Calendar, LogOut, Sparkles, Timer, FileText, Columns3, CheckSquare } from 'lucide-react';
import { useApp, getLevel } from '../context/AppContext';

const Sidebar = () => {
    const { translate, user, xp, logout } = useApp();
    const location = useLocation();
    const { level, currentLevelXp, nextLevelXp } = getLevel(xp);
    const [hovered, setHovered] = useState(false);

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'nav_dashboard' },
        { path: '/', icon: Calendar, label: 'nav_home' },
        { path: '/today', icon: CheckSquare, label: 'nav_today' },
        { path: '/pomodoro', icon: Timer, label: 'nav_pomodoro' },
        { path: '/kanban', icon: Columns3, label: 'nav_kanban' },
        { path: '/notes', icon: FileText, label: 'nav_notes' },
        { path: '/habits', icon: CheckSquare, label: 'nav_habits' },
        { path: '/subjects', icon: BookOpen, label: 'nav_subjects' },
        { path: '/achievements', icon: PieChart, label: 'nav_achievements' },
        { path: '/settings', icon: Settings, label: 'nav_settings' },
    ];

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="sidebar-aceternity group/sidebar bg-[rgba(8,4,30,0.75)] backdrop-blur-2xl border-r border-[rgba(139,92,246,0.15)] flex flex-col h-full"
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 h-16 border-b border-[rgba(139,92,246,0.15)] shrink-0">
                <img src="/icon.png" alt="iPlan" className="w-8 h-8 rounded-lg shadow-lg shadow-violet-500/30 shrink-0 transition-all duration-300 hover:scale-110 hover:shadow-violet-500/50" />
                <div className="sidebar-label overflow-hidden whitespace-nowrap">
                    <span className="font-extrabold text-lg text-shimmer tracking-tight">iPlan</span>
                    <p className="text-[10px] text-violet-300/60 font-medium -mt-0.5">Productivity Hub</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
                {navItems.map(item => {
                    const isActive = location.pathname === item.path;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative ${isActive
                                ? 'bg-gradient-to-r from-violet-600/20 to-indigo-600/10 shadow-sm shadow-violet-500/10 text-white border border-violet-500/20'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 shrink-0 transition-all duration-300 ${isActive ? 'text-violet-400 stroke-[2.5px] drop-shadow-[0_0_6px_rgba(139,92,246,0.5)]' : 'text-gray-500 group-hover:text-gray-300'}`} />
                            <span className="sidebar-label text-sm font-medium truncate whitespace-nowrap">{translate(item.label)}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* XP Section */}
            <div className="px-3 py-3 border-t border-[rgba(139,92,246,0.15)] sidebar-label-block">
                <div className="bg-[rgba(139,92,246,0.08)] rounded-xl p-3 border border-[rgba(139,92,246,0.15)]">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-base">⚡</span>
                            <span className="text-xs font-bold text-gray-200 whitespace-nowrap">{translate('level')} {level}</span>
                        </div>
                        <span className="text-[10px] font-bold text-amber-300">{currentLevelXp}/{nextLevelXp}</span>
                    </div>
                    <div className="w-full bg-[rgba(139,92,246,0.15)] rounded-full h-1.5 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-violet-500 transition-all duration-700 shadow-[0_0_8px_rgba(168,85,247,0.4)]" style={{ width: `${(currentLevelXp / nextLevelXp) * 100}%` }} />
                    </div>
                </div>
            </div>

            {/* User */}
            <div className="px-3 py-3 border-t border-[rgba(139,92,246,0.15)]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xs uppercase shrink-0 shadow-lg shadow-violet-500/30 ring-2 ring-violet-500/20">
                        {user.name.charAt(0)}
                    </div>
                    <div className="sidebar-label overflow-hidden flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate whitespace-nowrap">{user.name}</p>
                        <p className="text-[10px] text-violet-300/50 truncate whitespace-nowrap">{user.email || ''}</p>
                    </div>
                    <button onClick={logout} className="sidebar-label p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 shrink-0" title={translate('logout')}>
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
