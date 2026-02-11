import { AppState } from '../types';

const STORAGE_KEY = 'iplan_app_state';

const defaultState: AppState = {
  user: {
    name: 'Guest User',
    joinedAt: new Date().toISOString(),
  },
  subjects: [],
  tasks: [],
  language: 'en',
  theme: 'light',
};

export const loadState = (): AppState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return defaultState;
    }
    return JSON.parse(serializedState);
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
