import { useState, useEffect, createContext, useContext, useCallback, ReactNode, useRef } from 'react';
import { AppState, Language, Subject, Task, Theme, UserProfile, Note, Habit, HabitLog, PomodoroSession, Badge, BadgeId } from '../types';
import { loadState, saveState } from '../services/storage';
import { getTranslation } from '../services/i18n';
import { signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

import { BADGE_DEFINITIONS, XP_VALUES } from '../lib/constants';

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
    const isDataLoadedFromCloud = useRef(false); // New ref to track initial sync

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
                const cloudData = snapshot.data() as AppState;
                
                // --- Robust Smart Merge Logic ---
                setState(prev => {
                    // Check if this update came from our own local setDoc to avoid echo
                    if (isRemoteUpdate.current) {
                        // isRemoteUpdate might be set by our own setDoc block below, 
                        // but actually onSnapshot is triggered by LOCAL writes too in Firestore.
                        // However, we want to know if CLOUD changed beyond our local state.
                        if (JSON.stringify(cloudData) === JSON.stringify(prev)) return prev;
                    }

                    // Priority: If first load from cloud, and local is "less" than cloud, take cloud.
                    const isLocalNewer = !isDataLoadedFromCloud.current;

                    const mergeById = (local: any[], cloud: any[]) => {
                        const map = new Map();
                        
                        // Seed map with local stuff first
                        local.forEach(item => map.set(item.id, item));

                        // Compare with cloud stuff
                        cloud.forEach(cloudItem => {
                            const localItem = map.get(cloudItem.id);
                            if (!localItem) {
                                // New item from cloud
                                map.set(cloudItem.id, cloudItem);
                            } else {
                                // Existing item: Compare timestamps
                                const cloudTime = cloudItem.updatedAt || cloudItem.createdAt || cloudItem.completedAt || "";
                                const localTime = localItem.updatedAt || localItem.createdAt || localItem.completedAt || "";
                                
                                // Cloud wins ONLY if it is strictly newer
                                if (cloudTime > localTime) {
                                    map.set(cloudItem.id, cloudItem);
                                }
                                // If equal or cloud is older, local wins (keep localItem in map)
                            }
                        });
                        return Array.from(map.values());
                    };

                    const mergedState: AppState = {
                        ...cloudData, // Master settings from cloud
                        user: { ...prev.user, ...cloudData.user },
                        subjects: mergeById(prev.subjects, cloudData.subjects || []),
                        tasks: mergeById(prev.tasks, cloudData.tasks || []),
                        notes: mergeById(prev.notes, cloudData.notes || []),
                        habits: mergeById(prev.habits, cloudData.habits || []),
                        habitLogs: mergeById(prev.habitLogs, cloudData.habitLogs || []),
                        pomodoroSessions: mergeById(prev.pomodoroSessions, cloudData.pomodoroSessions || []),
                        badges: mergeById(prev.badges, cloudData.badges || []),
                        xp: Math.max(prev.xp, cloudData.xp || 0),
                    };

                    isRemoteUpdate.current = true; // Mark as remote to prevent SAVE effect from looping back
                    return mergedState;
                });
                
                isDataLoadedFromCloud.current = true;
            } else {
                // If cloud document is missing, it means this is a truly new account or first-time sync
                if (!isDataLoadedFromCloud.current) {
                    isDataLoadedFromCloud.current = true;
                    const isLocalEmpty = state.tasks.length === 0 && state.notes.length === 0 && state.subjects.length === 0;
                    if (!isLocalEmpty) {
                        setDoc(userDocRef, cleanData(state)).catch(console.error);
                    }
                }
            }
        });

        return () => unsubscribe();
    }, [initialUser]);

    // --- BACKGROUND NOTIFICATIONS CONFIGURATION ---
    const ONESIGNAL_APP_ID = state.user.oneSignalAppId || "placeholder";
    const ONESIGNAL_REST_KEY = state.user.oneSignalRestKey || "";
    const [playerId, setPlayerId] = useState<string | null>(localStorage.getItem('onesignal_player_id'));

    useEffect(() => {
        const OneSignal = (window as any).OneSignal;
        if (OneSignal) {
            OneSignal.push(() => {
                if (ONESIGNAL_APP_ID.includes("placeholder")) {
                    console.log('OneSignal: App ID not configured.');
                    return;
                }
                
                // Initialize v16
                OneSignal.init({
                    appId: ONESIGNAL_APP_ID,
                    allowLocalActionOnly: false,
                    serviceWorkerParam: { scope: '/' },
                    serviceWorkerPath: 'OneSignalSDKWorker.js',
                }).then(() => {
                    console.log("OneSignal Initialized.");
                    
                    // Capture Player ID
                    const id = OneSignal.User.PushSubscription.id;
                    if (id) {
                        setPlayerId(id);
                        localStorage.setItem('onesignal_player_id', id);
                    }

                    // Update ID on change
                    OneSignal.User.PushSubscription.addEventListener("change", (event: any) => {
                        if (event.current.id) {
                            setPlayerId(event.current.id);
                            localStorage.setItem('onesignal_player_id', event.current.id);
                        }
                    });

                    if (Notification.permission !== 'granted') {
                        OneSignal.Notifications.requestPermission();
                    }
                });
            });
        }
    }, [ONESIGNAL_APP_ID]);

    // Save State (Local + Cloud)
    useEffect(() => {
        // Always save to local storage as backup/offline cache
        saveState(state);

        // CSS/Dom effects
        document.documentElement.classList.toggle('dark', state.theme === 'dark');
        document.documentElement.dir = state.language === 'ar' ? 'rtl' : 'ltr';

        // Sync to Firestore
        if (initialUser && !isRemoteUpdate.current && isDataLoadedFromCloud.current) {
            const userDocRef = doc(db, 'users', initialUser.uid);
            setDoc(userDocRef, cleanData(state))
                .then(() => {
                    console.log("Cloud sync successful");
                    // We don't want to toast on EVERY save as it might be annoying, 
                    // but we can send a silent log or a toast for critical actions like notes.
                })
                .catch(e => {
                    console.error("Sync error:", e);
                    sendNotification("Sync Error", "Could not save to cloud. Will retry later.");
                });
        }

        // Reset flag after render cycle
        if (isRemoteUpdate.current) {
            isRemoteUpdate.current = false;
        }

    }, [state, initialUser]);

    // Auto-delay overdue tasks
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const isOverdue = (t: Task) => t.dueDate && t.dueDate < today && (t.status === 'pending' || t.status === 'in_progress');

        if (state.tasks.some(isOverdue)) {
            setState(prev => ({
                ...prev,
                tasks: prev.tasks.map(t =>
                    isOverdue(t) ? { ...t, status: 'delayed' as const } : t
                )
            }));
        }
    }, [state.tasks]);

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
        const OneSignal = (window as any).OneSignal;
        if (OneSignal) {
            OneSignal.push(() => {
                OneSignal.showNativePrompt();
            });
        }

        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notification permission granted.');
                }
            });
        }
    }, []);

    const sendNotification = useCallback((title: string, body: string, data?: any) => {
        // 0. Play Chime (Sound)
        try {
            const chime = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            chime.volume = 0.5;
            chime.play().catch(() => console.log('Notification sound blocked by browser policy. Interaction needed.'));
        } catch (e) {
            console.error('Audio playback error:', e);
        }

        console.log('Pushing notification:', { title, body });
        
        // 1. Toast (Visual Fallback)
        const toastEvent = new CustomEvent('app-toast', { detail: { title, body } });
        window.dispatchEvent(toastEvent);

        if (!('Notification' in window)) return;

        const icon = '/icon.png';

        // 2. Service Worker (Native Feel)
        if (Notification.permission === 'granted' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, {
                    body,
                    icon,
                    badge: icon,
                    tag: 'iplan-reminder',
                    renotify: true,
                    data: { url: window.location.origin + '/dashboard', ...data }, // Deep linking
                    vibrate: [200, 100, 200, 100, 200],
                    requireInteraction: true // Keeps it until user acts
                } as any).catch(err => {
                    new Notification(title, { body, icon });
                });
            });
        } else if (Notification.permission === 'granted') {
            new Notification(title, { body, icon });
        }
    }, []);

    // Expose for testing
    useEffect(() => {
        (window as any).appNotify = sendNotification;
    }, [sendNotification]);

    // Periodic reminder check (Improved for mobile background/throttling)
    useEffect(() => {
        // Check every 30 seconds instead of 60 to catch narrow windows
        const interval = setInterval(() => {
            const now = new Date();
            const nowTime = now.getTime();
            
            state.notes.forEach(note => {
                note.reminders?.forEach(rem => {
                    const remTime = new Date(rem.time).getTime();
                    const diff = remTime - nowTime;
                    
                    // Trigger if it was supposed to happen in the last 35 seconds 
                    // (to catch up if interval was throttled)
                    if (diff <= 0 && diff > -35000) {
                        // We need a way to mark reminder as "sent" locally to avoid double triggers
                        // For now we rely on the narrow window
                        sendNotification(note.title, getTranslation(state.language, 'reminders'));
                    }
                });
            });
        }, 30000);
        return () => clearInterval(interval);
    }, [state.notes, sendNotification, state.language]);

    // --- CLOUD SCHEDULING LOGIC ---
    const scheduleOneSignalPush = async (time: string, title: string): Promise<string | undefined> => {
        if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_KEY || !playerId) return;

        try {
            const response = await fetch('https://onesignal.com/api/v1/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Basic ${ONESIGNAL_REST_KEY}`
                },
                body: JSON.stringify({
                    app_id: ONESIGNAL_APP_ID,
                    contents: { en: title, ar: title },
                    include_subscription_ids: [playerId],
                    send_after: new Date(time).toUTCString(),
                    data: { url: '/#/notes' }
                })
            });
            const data = await response.json();
            return data.id;
        } catch (error) {
            console.error("OneSignal Scheduling Error:", error);
            return undefined;
        }
    };

    const cancelOneSignalPush = async (notificationId: string) => {
        if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_KEY || !notificationId) return;
        try {
            await fetch(`https://onesignal.com/api/v1/notifications/${notificationId}?app_id=${ONESIGNAL_APP_ID}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Basic ${ONESIGNAL_REST_KEY}`
                }
            });
        } catch (error) {
            console.error("OneSignal Cancellation Error:", error);
        }
    };

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
            if (oldTask) {
                if (oldTask.status !== 'completed' && t.status === 'completed') {
                    xpChange = t.priority === 'high' ? XP_VALUES.completeHighPriority : XP_VALUES.completeTask;
                } else if (oldTask.status === 'completed' && t.status !== 'completed') {
                    xpChange = -(t.priority === 'high' ? XP_VALUES.completeHighPriority : XP_VALUES.completeTask);
                }
            }
            const newXp = Math.max(0, prev.xp + xpChange);
            const newState = { ...prev, tasks: prev.tasks.map(task => task.id === t.id ? t : task), xp: newXp };
            newState.badges = checkBadges(newState);
            return newState;
        }),
        deleteTask: (id) => setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) })),
        updateUser: (u) => setState(prev => ({ ...prev, user: { ...prev.user, ...u } })),

        addNote: async (n) => {
            const updatedReminders = [...(n.reminders || [])];
            for (let i = 0; i < updatedReminders.length; i++) {
                const nid = await scheduleOneSignalPush(updatedReminders[i].time, n.title);
                if (nid) updatedReminders[i] = { ...updatedReminders[i], notificationId: nid };
            }
            const finalNote = { ...n, reminders: updatedReminders };
            setState(prev => {
                const newState = { ...prev, notes: [...prev.notes, finalNote], xp: prev.xp + XP_VALUES.createNote };
                newState.badges = checkBadges(newState);
                return newState;
            });
        },
        updateNote: async (n) => {
            // Check for new reminders to schedule
            const oldNote = state.notes.find(x => x.id === n.id);
            const updatedReminders = [...(n.reminders || [])];
            
            for (let i = 0; i < updatedReminders.length; i++) {
                const rem = updatedReminders[i];
                const oldRem = oldNote?.reminders?.find(r => r.id === rem.id);
                
                // If new or time changed
                if (!oldRem || oldRem.time !== rem.time) {
                    // Cancel old if exists
                    if (oldRem?.notificationId) {
                        cancelOneSignalPush(oldRem.notificationId);
                    }
                    // Schedule new
                    const nid = await scheduleOneSignalPush(rem.time, n.title);
                    if (nid) updatedReminders[i] = { ...rem, notificationId: nid };
                }
            }

            const finalNote = { ...n, reminders: updatedReminders };
            setState(prev => ({ ...prev, notes: prev.notes.map(note => note.id === n.id ? finalNote : note) }));
        },
        deleteNote: (id) => {
            const noteToDelete = state.notes.find(n => n.id === id);
            noteToDelete?.reminders?.forEach(rem => {
                if (rem.notificationId) cancelOneSignalPush(rem.notificationId);
            });
            setState(prev => ({ ...prev, notes: prev.notes.filter(n => n.id !== id) }));
        },

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

