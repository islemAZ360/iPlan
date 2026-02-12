import { AppState } from '../types';

const STORAGE_KEY = 'iplan_app_state';

const defaultState: AppState = {
  user: {
    name: 'Guest User',
    joinedAt: new Date().toISOString(),
  },
  subjects: [],
  tasks: [],
  notes: [],
  habits: [],
  habitLogs: [],
  pomodoroSessions: [],
  xp: 0,
  badges: [],
  language: 'en',
  theme: 'light',
};

export const loadState = (): AppState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return defaultState;
    }
    const parsed = JSON.parse(serializedState);
    // Merge with defaults for new fields
    return { ...defaultState, ...parsed };
  } catch (err) {
    console.error('Could not load state', err);
    return defaultState;
  }
};

export const saveState = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Could not save state', err);
  }
};
