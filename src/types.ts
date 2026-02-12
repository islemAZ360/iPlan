export type Language = 'en' | 'ar' | 'ru';
export type Theme = 'light' | 'dark';
export type Priority = 'high' | 'medium' | 'low';

export interface UserProfile {
  uid?: string;
  email?: string;
  name: string;
  birthDate?: string;
  joinedAt: string;
  avatarUrl?: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
}

export type TaskDueType = 'open' | 'specific' | 'today' | 'tomorrow';

export interface Task {
  id: string;
  title: string;
  description?: string;
  subjectId: string;
  dueType: TaskDueType;
  dueDate: string | null;
  status: 'pending' | 'completed' | 'delayed';
  priority?: Priority;
  createdAt: string;
  completedAt?: string;
}

// --- Notes ---
export interface Note {
  id: string;
  title: string;
  content: string;
  subjectId?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
}

// --- Habits ---
export interface Habit {
  id: string;
  name: string;
  icon: string; // emoji
  color: string;
  createdAt: string;
}

export interface HabitLog {
  habitId: string;
  date: string; // YYYY-MM-DD
}

// --- Pomodoro ---
export interface PomodoroSession {
  id: string;
  subjectId?: string;
  duration: number; // minutes
  completedAt: string;
}

// --- Gamification ---
export type BadgeId =
  | 'first_task'
  | 'ten_tasks'
  | 'fifty_tasks'
  | 'hundred_tasks'
  | 'streak_3'
  | 'streak_7'
  | 'streak_30'
  | 'first_pomodoro'
  | 'ten_pomodoros'
  | 'all_today'
  | 'note_taker'
  | 'habit_starter'
  | 'night_owl'
  | 'early_bird';

export interface Badge {
  id: BadgeId;
  unlockedAt: string;
}

// --- App State ---
export interface AppState {
  user: UserProfile;
  subjects: Subject[];
  tasks: Task[];
  notes: Note[];
  habits: Habit[];
  habitLogs: HabitLog[];
  pomodoroSessions: PomodoroSession[];
  xp: number;
  badges: Badge[];
  language: Language;
  theme: Theme;
}