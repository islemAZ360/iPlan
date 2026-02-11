import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import HomePage from '../pages/HomePage';
import SubjectsPage from '../pages/SubjectsPage';
import TodayPage from '../pages/TodayPage';
import AchievementsPage from '../pages/AchievementsPage';
import SettingsPage from '../pages/SettingsPage';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    useEffect(() => setSidebarOpen(false), [location]);

    return (
        <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm animate-fadeIn"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-40 transform lg:transform-none lg:static transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-0">
                {/* Mobile Header */}
                <header className="h-16 flex items-center px-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 lg:hidden justify-between sticky top-0 z-10">
                    <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                            <Menu className="w-6 h-6" />
                        </button>
                        <span className="ml-3 font-extrabold text-lg bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">iPlan</span>
                    </div>
                </header>

                <main className="flex-1 overflow-hidden relative">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/subjects" element={<SubjectsPage />} />
                        <Route path="/today" element={<TodayPage />} />
                        <Route path="/achievements" element={<AchievementsPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default Layout;
