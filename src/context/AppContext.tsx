import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { AppState, Language, Subject, Task, Theme, UserProfile } from '../types';
import { loadState, saveState } from '../services/storage';
import { getTranslation } from '../services/i18n';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase';

// --- Context Type ---
export interface AppContextType extends AppState {
    setLanguage: (lang: Language) => void;
    setTheme: (theme: Theme) => void;
    addSubject: (subject: Subject) => void;
    updateSubject: (subject: Subject) => void;
    deleteSubject: (id: string) => void;
    addTask: (task: Task) => void;
    updateTask: (task: Task) => void;
    deleteTask: (id: string) => void;
    updateUser: (user: Partial<UserProfile>) => void;
    translate: (key: string) => string;
    logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
};

// --- Streak Calculator ---
function calculateStreak(tasks: Task[]): number {
    const completedDates = new Set<string>();
    tasks.forEach(t => {
        if (t.status === 'completed' && t.completedAt) {
            completedDates.add(t.completedAt.split('T')[0]);
        }
    });

    if (completedDates.size === 0) return 0;

    let streak = 0;
    const today = new Date();
    const checkDate = new Date(today);

    // Check if today has completions, if not start from yesterday
    const todayStr = today.toISOString().split('T')[0];
    if (!completedDates.has(todayStr)) {
        checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (completedDates.has(dateStr)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
}

export { calculateStreak };

// --- Provider ---
interface AppProviderProps {
    children: ReactNode;
    initialUser: FirebaseUser | null;
}

export const AppProvider = ({ children, initialUser }: AppProviderProps) => {
    const [state, setState] = useState<AppState>(loadState());

    useEffect(() => {
        if (initialUser) {
            setState(prev => ({
                ...prev,
                user: {
                    ...prev.user,
                    name: initialUser.displayName || initialUser.email?.split('@')[0] || 'User',
                    email: initialUser.email || undefined,
                    uid: initialUser.uid
                }
            }));
        }
    }, [initialUser]);

    useEffect(() => {
        saveState(state);
        if (state.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        // Set direction for Arabic
        document.documentElement.dir = state.language === 'ar' ? 'rtl' : 'ltr';
    }, [state]);

    // Auto-mark overdue tasks as delayed
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const needsUpdate = state.tasks.some(t => t.dueDate && t.dueDate < today && t.status === 'pending');

        if (needsUpdate) {
            setState(prev => ({
                ...prev,
                tasks: prev.tasks.map(t =>
                    (t.dueDate && t.dueDate < today && t.status === 'pending')
                        ? { ...t, status: 'delayed' as const }
                        : t
                )
            }));
        }
    }, []);

    const value: AppContextType = {
        ...state,
        setLanguage: (lang) => setState(prev => ({ ...prev, language: lang })),
        setTheme: (theme) => setState(prev => ({ ...prev, theme })),
        addSubject: (s) => setState(prev => ({ ...prev, subjects: [...prev.subjects, s] })),
        updateSubject: (s) => setState(prev => ({ ...prev, subjects: prev.subjects.map(sub => sub.id === s.id ? s : sub) })),
        deleteSubject: (id) => setState(prev => ({
            ...prev,
            subjects: prev.subjects.filter(s => s.id !== id),
            tasks: prev.tasks.filter(t => t.subjectId !== id)
        })),
        addTask: (t) => setState(prev => ({ ...prev, tasks: [...prev.tasks, t] })),
        updateTask: (t) => setState(prev => ({ ...prev, tasks: prev.tasks.map(task => task.id === t.id ? t : task) })),
        deleteTask: (id) => setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) })),
        updateUser: (u) => setState(prev => ({ ...prev, user: { ...prev.user, ...u } })),
        translate: (key) => getTranslation(state.language, key),
        logout: () => signOut(auth)
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
