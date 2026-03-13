import { BadgeId } from '../types';

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

export const XP_VALUES = {
    completeTask: 15,
    completeHighPriority: 25,
    completePomodoroSession: 20,
    createNote: 5,
    checkHabit: 10,
    streakBonus: 5, // per day
};
