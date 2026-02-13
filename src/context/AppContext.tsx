import { useState, useEffect, createContext, useContext, useCallback, ReactNode, useRef } from 'react';
import { AppState, Language, Subject, Task, Theme, UserProfile, Note, Habit, HabitLog, PomodoroSession, Badge, BadgeId } from '../types';
import { loadState, saveState } from '../services/storage';
import { getTranslation } from '../services/i18n';
import { signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

// --- Badge Definitions ---
export const BADGE_DEFINITIONS: Record<BadgeId, { icon: string; title: string; titleAr: string; desc: string }> = {
    first_task: { icon: '🎯', title: 'First Step', titleAr: 'الخطوة الأولى', desc: 'Complete your first task' },
    ten_tasks: { icon: '⭐', title: 'Getting Started', titleAr: 'بداية قوية', desc: 'Complete 10 tasks' },
    fifty_tasks: { icon: '💫', title: 'Task Master', titleAr: 'سيد المهام', desc: 'Complete 50 tasks' },
    hundred_tasks: { icon: '🏆', title: 'Centurion', titleAr: 'المئوي', desc: 'Complete 100 tasks' },
    streak_3: { icon: '🔥', title: 'On Fire', titleAr: 'مشتعل', desc: '3-day streak' },
    streak_7: { icon: '💪', title: 'Unstoppable', titleAr: 'لا يوقفه شيء', desc: '7-day streak' },
    streak_30: { icon: '👑', title: 'Legend', titleAr: 'أسطورة', desc: '30-day streak' },
    first_pomodoro: { icon: '🍅', title: 'Focused', titleAr: 'مركّز', desc: 'First pomodoro session' },
    ten_pomodoros: { icon: '🧠', title: 'Deep Focus', titleAr: 'تركيز عميق', desc: '10 pomodoro sessions' },
    all_today: { icon: '✨', title: 'Perfect Day', titleAr: 'يوم مثالي', desc: 'Complete all tasks for a day' },
    note_taker: { icon: '📝', title: 'Note Taker', titleAr: 'مدوّن', desc: 'Create 5 notes' },
    habit_starter: { icon: '🌱', title: 'Habit Builder', titleAr: 'بانّي عادات', desc: 'Create 3 habits' },
    night_owl: { icon: '🦉', title: 'Night Owl', titleAr: 'بومة الليل', desc: 'Complete task after midnight' },
    early_bird: { icon: '🐦', title: 'Early Bird', titleAr: 'الطائر المبكر', desc: 'Complete task before 7 AM' },
};

// --- XP Constants ---
const XP_VALUES = {
    completeTask: 15,
    completeHighPriority: 25,
    completePomodoroSession: 20,
    createNote: 5,
    checkHabit: 10,
    streakBonus: 5, // per day
};

export const getLevel = (xp: number) => {
    const level = Math.floor(xp / 100) + 1;
    const currentLevelXp = xp % 100;
    return { level, currentLevelXp, nextLevelXp: 100 };
};

// --- Context Type ---
export interface AppContextType extends AppState {
    setLanguage: (lang: Language) => void;
    setTheme: (theme: Theme) => void;
    addSubject: (s: Subject) => void;
    updateSubject: (s: Subject) => void;
    deleteSubject: (id: string) => void;
    addTask: (t: Task) => void;
    updateTask: (t: Task) => void;
    deleteTask: (id: string) => void;
    updateUser: (u: Partial<UserProfile>) => void;
    // Notes
    addNote: (n: Note) => void;
    updateNote: (n: Note) => void;
    deleteNote: (id: string) => void;
    // Habits
    addHabit: (h: Habit) => void;
    deleteHabit: (id: string) => void;
    toggleHabitLog: (habitId: string, date: string) => void;
    isHabitDone: (habitId: string, date: string) => boolean;
    getHabitStreak: (habitId: string) => number;
    // Pomodoro
    addPomodoroSession: (s: PomodoroSession) => void;
    // XP
    addXp: (amount: number) => void;
    // Helpers
    translate: (key: string) => string;
    logout: () => void;
    requestNotificationPermission: () => void;
    sendNotification: (title: string, body: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
};

// --- Streak Calculator ---
export function calculateStreak(tasks: Task[]): number {
    const completedDates = new Set<string>();
    tasks.forEach(t => {
        if (t.status === 'completed' && t.completedAt) {
            completedDates.add(t.completedAt.split('T')[0]);
        }
    });
    if (completedDates.size === 0) return 0;

    let streak = 0;
    const d = new Date();
    const todayStr = d.toISOString().split('T')[0];
    if (!completedDates.has(todayStr)) d.setDate(d.getDate() - 1);

    while (completedDates.has(d.toISOString().split('T')[0])) {
        streak++;
        d.setDate(d.getDate() - 1);
    }
    return streak;
}

// --- Provider ---
export const AppProvider = ({ children, initialUser }: { children: ReactNode; initialUser: FirebaseUser | null }) => {
    const [state, setState] = useState<AppState>(loadState());
    const isRemoteUpdate = useRef(false);

    // Initial User Setup
    useEffect(() => {
        if (initialUser) {
            setState(prev => ({
                ...prev,
                user: {
                    ...prev.user,
                    name: initialUser.displayName || initialUser.email?.split('@')[0] || 'User',
                    email: initialUser.email || undefined,
                    uid: initialUser.uid,
                    avatarUrl: initialUser.photoURL || prev.user.avatarUrl, // Use existing if not in Auth
                }
            }));
        }
    }, [initialUser]);

    // Helper to remove undefined values (Firestore doesn't like them)
    const cleanData = (data: any) => {
        return JSON.parse(JSON.stringify(data));
    };

    // Firestore Sync
    useEffect(() => {
        if (!initialUser) return;

        const userDocRef = doc(db, 'users', initialUser.uid);
        const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data() as AppState;
                // Simple equality check to prevent loops
                if (JSON.stringify(data) !== JSON.stringify(state)) {
                    isRemoteUpdate.current = true;
                    setState(data);
                }
            } else {
                // Migration: If doc doesn't exist, upload current local state
                setDoc(userDocRef, cleanData(state)).catch(console.error);
            }
        });

        return () => unsubscribe();
    }, [initialUser]);

    // Save State (Local + Cloud)
    useEffect(() => {
        // Always save to local storage as backup/offline cache
        saveState(state);

        // CSS/Dom effects
        document.documentElement.classList.toggle('dark', state.theme === 'dark');
        document.documentElement.dir = state.language === 'ar' ? 'rtl' : 'ltr';

        // Sync to Firestore
        if (initialUser && !isRemoteUpdate.current) {
            const userDocRef = doc(db, 'users', initialUser.uid);
            setDoc(userDocRef, cleanData(state)).catch(e => console.error("Sync error:", e));
        }

        // Reset flag after render cycle
        if (isRemoteUpdate.current) {
            isRemoteUpdate.current = false;
        }

    }, [state, initialUser]);

    // Auto-delay overdue tasks
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        if (state.tasks.some(t => t.dueDate && t.dueDate < today && t.status === 'pending')) {
            setState(prev => ({
                ...prev,
                tasks: prev.tasks.map(t =>
                    (t.dueDate && t.dueDate < today && t.status === 'pending') ? { ...t, status: 'delayed' as const } : t
                )
            }));
        }
    }, []);

    // Badge checker
    const checkBadges = useCallback((s: AppState): Badge[] => {
        const newBadges = [...s.badges];
        const has = (id: BadgeId) => newBadges.some(b => b.id === id);
        const add = (id: BadgeId) => { if (!has(id)) newBadges.push({ id, unlockedAt: new Date().toISOString() }); };

        const completed = s.tasks.filter(t => t.status === 'completed').length;
        if (completed >= 1) add('first_task');
        if (completed >= 10) add('ten_tasks');
        if (completed >= 50) add('fifty_tasks');
        if (completed >= 100) add('hundred_tasks');

        const streak = calculateStreak(s.tasks);
        if (streak >= 3) add('streak_3');
        if (streak >= 7) add('streak_7');
        if (streak >= 30) add('streak_30');

        if (s.pomodoroSessions.length >= 1) add('first_pomodoro');
        if (s.pomodoroSessions.length >= 10) add('ten_pomodoros');

        if (s.notes.length >= 5) add('note_taker');
        if (s.habits.length >= 3) add('habit_starter');

        const hour = new Date().getHours();
        if (hour >= 0 && hour < 5 && completed > 0) add('night_owl');
        if (hour >= 5 && hour < 7 && completed > 0) add('early_bird');

        return newBadges;
    }, []);

    const isHabitDone = useCallback((habitId: string, date: string) => {
        return state.habitLogs.some(l => l.habitId === habitId && l.date === date);
    }, [state.habitLogs]);

    const getHabitStreak = useCallback((habitId: string) => {
        let streak = 0;
        const d = new Date();
        while (true) {
            const dateStr = d.toISOString().split('T')[0];
            if (state.habitLogs.some(l => l.habitId === habitId && l.date === dateStr)) {
                streak++;
                d.setDate(d.getDate() - 1);
            } else break;
        }
        return streak;
    }, [state.habitLogs]);

    const addXp = useCallback((amount: number) => {
        setState(prev => {
            const newState = { ...prev, xp: prev.xp + amount, badges: checkBadges({ ...prev, xp: prev.xp + amount }) };
            return newState;
        });
    }, [checkBadges]);

    const requestNotificationPermission = useCallback(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    const sendNotification = useCallback((title: string, body: string) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body, icon: '/favicon.ico' });
        }
    }, []);

    const value: AppContextType = {
        ...state,
        setLanguage: (lang) => setState(prev => ({ ...prev, language: lang })),
        setTheme: (theme) => setState(prev => ({ ...prev, theme })),

        addSubject: (s) => setState(prev => ({ ...prev, subjects: [...prev.subjects, s] })),
        updateSubject: (s) => setState(prev => ({ ...prev, subjects: prev.subjects.map(sub => sub.id === s.id ? s : sub) })),
        deleteSubject: (id) => setState(prev => ({ ...prev, subjects: prev.subjects.filter(s => s.id !== id), tasks: prev.tasks.filter(t => t.subjectId !== id) })),

        addTask: (t) => setState(prev => ({ ...prev, tasks: [...prev.tasks, t] })),
        updateTask: (t) => setState(prev => {
            const oldTask = prev.tasks.find(x => x.id === t.id);
            let xpChange = 0;

            // Check if status changed
            if (oldTask) {
                // Pending -> Completed (Add XP)
                if (oldTask.status !== 'completed' && t.status === 'completed') {
                    xpChange = t.priority === 'high' ? XP_VALUES.completeHighPriority : XP_VALUES.completeTask;
                }
                // Completed -> Pending (Subtract XP - undo)
                else if (oldTask.status === 'completed' && t.status !== 'completed') {
                    xpChange = -(t.priority === 'high' ? XP_VALUES.completeHighPriority : XP_VALUES.completeTask);
                }
            }

            const newXp = Math.max(0, prev.xp + xpChange);
            const newState = {
                ...prev,
                tasks: prev.tasks.map(task => task.id === t.id ? t : task),
                xp: newXp
            };
            newState.badges = checkBadges(newState);
            return newState;
        }),
        deleteTask: (id) => setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) })),
        updateUser: (u) => setState(prev => ({ ...prev, user: { ...prev.user, ...u } })),

        addNote: (n) => setState(prev => {
            const newState = { ...prev, notes: [...prev.notes, n], xp: prev.xp + XP_VALUES.createNote };
            newState.badges = checkBadges(newState);
            return newState;
        }),
        updateNote: (n) => setState(prev => ({ ...prev, notes: prev.notes.map(note => note.id === n.id ? n : note) })),
        deleteNote: (id) => setState(prev => ({ ...prev, notes: prev.notes.filter(n => n.id !== id) })),

        addHabit: (h) => setState(prev => {
            const newState = { ...prev, habits: [...prev.habits, h] };
            newState.badges = checkBadges(newState);
            return newState;
        }),
        deleteHabit: (id) => setState(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== id), habitLogs: prev.habitLogs.filter(l => l.habitId !== id) })),
        toggleHabitLog: (habitId, date) => setState(prev => {
            const exists = prev.habitLogs.some(l => l.habitId === habitId && l.date === date);
            const newLogs = exists
                ? prev.habitLogs.filter(l => !(l.habitId === habitId && l.date === date))
                : [...prev.habitLogs, { habitId, date }];
            const xpDelta = exists ? 0 : XP_VALUES.checkHabit;
            return { ...prev, habitLogs: newLogs, xp: prev.xp + xpDelta };
        }),
        isHabitDone,
        getHabitStreak,

        addPomodoroSession: (s) => setState(prev => {
            const newState = { ...prev, pomodoroSessions: [...prev.pomodoroSessions, s], xp: prev.xp + XP_VALUES.completePomodoroSession };
            newState.badges = checkBadges(newState);
            return newState;
        }),

        addXp,
        translate: (key) => getTranslation(state.language, key),
        logout: () => signOut(auth),
        requestNotificationPermission,
        sendNotification,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

