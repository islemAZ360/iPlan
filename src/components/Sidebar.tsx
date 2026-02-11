import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, PieChart, Settings, Calendar as CalendarIcon, LogOut, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Sidebar = () => {
    const { translate, user, logout } = useApp();
    const location = useLocation();

    const navItems = [
        { path: '/', icon: CalendarIcon, label: 'nav_home' },
        { path: '/subjects', icon: BookOpen, label: 'nav_subjects' },
        { path: '/today', icon: LayoutDashboard, label: 'nav_today' },
        { path: '/achievements', icon: PieChart, label: 'nav_achievements' },
        { path: '/settings', icon: Settings, label: 'nav_settings' },
    ];

    return (
        <div className="w-20 lg:w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full transition-all duration-300 z-30 shadow-sm">
            {/* Logo */}
            <div className="p-6 flex items-center justify-center lg:justify-start gap-3 h-24">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/30 transition-transform hover:scale-110 duration-300">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="hidden lg:block font-extrabold text-2xl bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                    {translate('app_name')}
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1.5 py-4">
                {navItems.map(item => {
                    const isActive = location.pathname === item.path;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`
                flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative overflow-hidden
                ${isActive
                                    ? 'bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 text-primary-600 dark:text-primary-400 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200'
                                }
              `}
                        >
                            <item.icon className={`w-6 h-6 lg:w-5 lg:h-5 transition-all duration-200 ${isActive ? 'stroke-[2.5px] scale-110' : 'group-hover:scale-110'}`} />
                            <span className="hidden lg:block font-semibold text-sm">{translate(item.label)}</span>
                            {isActive && <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-l-full bg-gradient-to-b from-primary-500 to-purple-500" />}
                        </NavLink>
                    );
                })}
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 hidden lg:flex items-center gap-3 mx-3 mb-3 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/60 dark:to-gray-800/30 p-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 border-2 border-white dark:border-gray-700 shadow-lg flex items-center justify-center text-white font-bold uppercase text-lg">
                    {user.name.charAt(0)}
                </div>
                <div className="overflow-hidden flex-1">
                    <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email || ''}</p>
                </div>
                <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-all duration-200 hover:scale-110" title={translate('logout')}>
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
