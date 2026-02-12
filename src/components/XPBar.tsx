import { Zap } from 'lucide-react';
import { getLevel } from '../context/AppContext';

interface XPBarProps {
    xp: number;
    compact?: boolean;
}

const XPBar = ({ xp, compact = false }: XPBarProps) => {
    const { level, currentLevelXp, nextLevelXp } = getLevel(xp);

    if (compact) {
        return (
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-sm">
                    <Zap className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1">
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-700"
                            style={{ width: `${(currentLevelXp / nextLevelXp) * 100}%` }}
                        />
                    </div>
                </div>
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Lv.{level}</span>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-4 border border-amber-200/50 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-800 dark:text-white">Level {level}</p>
                        <p className="text-[10px] text-gray-400">{xp} XP total</p>
                    </div>
                </div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{currentLevelXp}/{nextLevelXp}</span>
            </div>
            <div className="w-full bg-amber-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 transition-all duration-700"
                    style={{ width: `${(currentLevelXp / nextLevelXp) * 100}%` }}
                />
            </div>
        </div>
    );
};

export default XPBar;
