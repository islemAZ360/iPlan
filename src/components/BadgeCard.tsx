import { BADGE_DEFINITIONS } from '../context/AppContext';
import { BadgeId } from '../types';

interface BadgeCardProps {
    badgeId: BadgeId;
    unlocked: boolean;
    unlockedAt?: string;
}

const BadgeCard = ({ badgeId, unlocked, unlockedAt }: BadgeCardProps) => {
    const def = BADGE_DEFINITIONS[badgeId];

    return (
        <div className={`relative rounded-2xl p-4 text-center transition-all duration-300 border ${unlocked
                ? 'bg-white dark:bg-gray-800 border-primary-200 dark:border-primary-800 shadow-lg shadow-primary-500/10 hover:shadow-xl hover:-translate-y-0.5'
                : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 opacity-40 grayscale'
            }`}>
            {unlocked && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-[10px] shadow-md">
                    ✓
                </div>
            )}
            <div className={`text-3xl mb-2 ${unlocked ? 'animate-float' : ''}`}>{def.icon}</div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">{def.title}</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">{def.desc}</p>
            {unlocked && unlockedAt && (
                <p className="text-[9px] text-primary-400 mt-1">{new Date(unlockedAt).toLocaleDateString()}</p>
            )}
        </div>
    );
};

export default BadgeCard;
