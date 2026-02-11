export type Language = 'en' | 'ar' | 'ru';
export type Theme = 'light' | 'dark';

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
  dueDate: string | null; // ISO Date String YYYY-MM-DD
  status: 'pending' | 'completed' | 'delayed';
  createdAt: string;
  completedAt?: string;
}

export interface AppState {
  user: UserProfile;
  subjects: Subject[];
  tasks: Task[];
  language: Language;
  theme: Theme;
}