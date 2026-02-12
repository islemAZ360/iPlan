import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Coffee, Brain, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

type TimerMode = 'work' | 'break' | 'longBreak';

const DURATIONS: Record<TimerMode, number> = { work: 25 * 60, break: 5 * 60, longBreak: 15 * 60 };

const PomodoroPage = () => {
    const { subjects, pomodoroSessions, addPomodoroSession, translate, sendNotification } = useApp();
    const [mode, setMode] = useState<TimerMode>('work');
    const [timeLeft, setTimeLeft] = useState(DURATIONS.work);
    const [isRunning, setIsRunning] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [sessionsCount, setSessionsCount] = useState(0);
    const intervalRef = useRef<number | null>(null);

    const todayStr = new Date().toISOString().split('T')[0];
    const todaySessions = pomodoroSessions.filter(s => s.completedAt.startsWith(todayStr));
    const totalFocusToday = todaySessions.reduce((sum, s) => sum + s.duration, 0);

    const radius = 140;
    const circumference = 2 * Math.PI * radius;
    const progress = timeLeft / DURATIONS[mode];
    const offset = circumference * (1 - progress);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const modeColors: Record<TimerMode, { ring: string; bg: string; glow: string }> = {
        work: { ring: '#6366f1', bg: 'from-indigo-500/10 to-purple-500/10', glow: 'shadow-indigo-500/20' },
        break: { ring: '#22c55e', bg: 'from-green-500/10 to-emerald-500/10', glow: 'shadow-green-500/20' },
        longBreak: { ring: '#06b6d4', bg: 'from-cyan-500/10 to-blue-500/10', glow: 'shadow-cyan-500/20' },
    };

    const completeSession = useCallback(() => {
        if (mode === 'work') {
            addPomodoroSession({
                id: Date.now().toString(),
                subjectId: selectedSubject || undefined,
                duration: DURATIONS.work / 60,
                completedAt: new Date().toISOString(),
            });
            setSessionsCount(prev => prev + 1);
            sendNotification('🍅 Pomodoro Complete!', 'Time for a break.');
            const newCount = sessionsCount + 1;
            setMode(newCount % 4 === 0 ? 'longBreak' : 'break');
            setTimeLeft(newCount % 4 === 0 ? DURATIONS.longBreak : DURATIONS.break);
        } else {
            sendNotification('☕ Break Over!', 'Ready to focus again?');
            setMode('work');
            setTimeLeft(DURATIONS.work);
        }
        setIsRunning(false);
    }, [mode, selectedSubject, sessionsCount, addPomodoroSession, sendNotification]);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = window.setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current!);
                        completeSession();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isRunning, completeSession]);

    const reset = () => {
        setIsRunning(false);
        setTimeLeft(DURATIONS[mode]);
    };

    const skip = () => {
        setIsRunning(false);
        if (mode === 'work') {
            setMode('break');
            setTimeLeft(DURATIONS.break);
        } else {
            setMode('work');
            setTimeLeft(DURATIONS.work);
        }
    };

    const switchMode = (m: TimerMode) => {
        setIsRunning(false);
        setMode(m);
        setTimeLeft(DURATIONS[m]);
    };

    return (
        <div className={`h-full overflow-y-auto flex flex-col items-center justify-center p-6 bg-gradient-to-br ${modeColors[mode].bg} transition-all duration-700 mesh-bg`}>
            {/* Mode Tabs */}
            <div className="flex gap-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-1 mb-10 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                {([
                    { key: 'work' as TimerMode, icon: Brain, label: translate('pomodoro_work') },
                    { key: 'break' as TimerMode, icon: Coffee, label: translate('pomodoro_break') },
                    { key: 'longBreak' as TimerMode, icon: Clock, label: translate('pomodoro_long_break') },
                ]).map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => switchMode(tab.key)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${mode === tab.key
                            ? 'bg-white dark:bg-gray-700 shadow-md text-gray-900 dark:text-white'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Timer Circle */}
            <div className={`relative mb-10 transition-all duration-500 ${modeColors[mode].glow} shadow-2xl rounded-full`}>
                <svg width="320" height="320" viewBox="0 0 320 320">
                    <circle cx="160" cy="160" r={radius} fill="none" stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="10" />
                    <circle
                        cx="160" cy="160" r={radius} fill="none"
                        stroke={modeColors[mode].ring}
                        strokeWidth="10" strokeLinecap="round"
                        strokeDasharray={circumference} strokeDashoffset={offset}
                        transform="rotate(-90 160 160)"
                        className="transition-all duration-1000"
                        style={{ filter: `drop-shadow(0 0 8px ${modeColors[mode].ring}40)` }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-bold text-gray-900 dark:text-white tracking-tight tabular-nums">
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </span>
                    <span className="text-sm text-gray-400 font-medium mt-1 uppercase tracking-widest">
                        {mode === 'work' ? translate('pomodoro_work') : mode === 'break' ? translate('pomodoro_break') : translate('pomodoro_long_break')}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={reset} className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110">
                    <RotateCcw className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                    style={{
                        background: `linear-gradient(135deg, ${modeColors[mode].ring}, ${mode === 'work' ? '#a855f7' : mode === 'break' ? '#10b981' : '#0ea5e9'})`,
                        boxShadow: `0 8px 30px ${modeColors[mode].ring}40`
                    }}
                >
                    {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </button>
                <button onClick={skip} className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110">
                    <SkipForward className="w-5 h-5" />
                </button>
            </div>

            {/* Subject Selector */}
            <select
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                className="mb-8 px-4 py-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-primary-500 min-w-[200px]"
            >
                <option value="">{translate('pomodoro_select_subject')}</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>

            {/* Stats */}
            <div className="flex gap-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl px-8 py-4 border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{todaySessions.length}</p>
                    <p className="text-xs text-gray-400 font-medium">{translate('pomodoro_sessions')}</p>
                </div>
                <div className="w-px bg-gray-200 dark:bg-gray-700" />
                <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {totalFocusToday >= 60 ? `${Math.floor(totalFocusToday / 60)}h ${totalFocusToday % 60}m` : `${totalFocusToday}m`}
                    </p>
                    <p className="text-xs text-gray-400 font-medium">{translate('pomodoro_total')}</p>
                </div>
            </div>
        </div>
    );
};

export default PomodoroPage;
