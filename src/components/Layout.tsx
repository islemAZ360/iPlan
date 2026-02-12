import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Menu, Zap } from 'lucide-react';
import Sidebar from './Sidebar';
import FocusMode from './FocusMode';
import { BackgroundBeamsWithCollision } from './ui/background-beams-with-collision';
import { useApp } from '../context/AppContext';
import DashboardPage from '../pages/DashboardPage';
import HomePage from '../pages/HomePage';
import SubjectsPage from '../pages/SubjectsPage';
import TodayPage from '../pages/TodayPage';
import AchievementsPage from '../pages/AchievementsPage';
import SettingsPage from '../pages/SettingsPage';
import PomodoroPage from '../pages/PomodoroPage';
import NotesPage from '../pages/NotesPage';
import KanbanPage from '../pages/KanbanPage';
import HabitsPage from '../pages/HabitsPage';
import AboutDevPage from '../pages/AboutDevPage';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [focusMode, setFocusMode] = useState(false);
    const location = useLocation();
    const { translate, requestNotificationPermission } = useApp();

    useEffect(() => setSidebarOpen(false), [location]);
    useEffect(() => { requestNotificationPermission(); }, []);

    return (
        <>
            <div className="flex h-screen w-full text-gray-100 font-sans relative bg-slate-950 selection:bg-indigo-500/30">
                {/* Global Gradient Background */}
                <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 30% 0%, rgba(99,102,241,0.2), transparent 50%), radial-gradient(ellipse at 70% 10%, rgba(139,92,246,0.15), transparent 45%), radial-gradient(ellipse at 50% 90%, rgba(34,211,238,0.06), transparent 50%), radial-gradient(circle at 50% 0%, #1e0a3e, #050214 85%)' }} />
                {/* Background Beams — behind everything */}
                <BackgroundBeamsWithCollision className="!absolute inset-0 z-0 pointer-events-none h-full">
                    <div />
                </BackgroundBeamsWithCollision>

                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden animate-fadeIn" onClick={() => setSidebarOpen(false)} />
                )}

                {/* Sidebar */}
                <div className={`fixed inset-y-0 left-0 z-40 transform lg:transform-none lg:static transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                    <Sidebar />
                </div>

                {/* Main */}
                <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-[1]">
                    {/* Mobile Header */}
                    <header className="h-14 flex items-center px-4 bg-[rgba(8,4,30,0.8)] backdrop-blur-2xl border-b border-[rgba(139,92,246,0.15)] lg:hidden justify-between sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-200 hover:bg-white/10 rounded-xl transition-colors">
                                <Menu className="w-5 h-5" />
                            </button>
                            <span className="font-extrabold text-lg text-shimmer">iPlan</span>
                        </div>
                        <button
                            onClick={() => setFocusMode(true)}
                            className="p-2.5 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-xl transition-all active:scale-95"
                            title={translate('focus_mode')}
                        >
                            <Zap className="w-4 h-4" />
                        </button>
                    </header>

                    <main className="flex-1 overflow-hidden relative">
                        <Routes>
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/" element={<HomePage />} />
                            <Route path="/subjects" element={<SubjectsPage />} />
                            <Route path="/today" element={<TodayPage />} />
                            <Route path="/achievements" element={<AchievementsPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/pomodoro" element={<PomodoroPage />} />
                            <Route path="/notes" element={<NotesPage />} />
                            <Route path="/kanban" element={<KanbanPage />} />

                            <Route path="/habits" element={<HabitsPage />} />
                            <Route path="/about-dev" element={<AboutDevPage />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </main>
                </div>
            </div>

            <FocusMode isOpen={focusMode} onClose={() => setFocusMode(false)} translate={translate} />
        </>
    );
};

export default Layout;
