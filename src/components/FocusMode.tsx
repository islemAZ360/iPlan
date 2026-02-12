import { useState, useEffect } from 'react';
import { X, Pause, Play, RotateCcw } from 'lucide-react';

interface FocusModeProps {
    isOpen: boolean;
    onClose: () => void;
    taskTitle?: string;
    translate: (key: string) => string;
}

const FocusMode = ({ isOpen, onClose, taskTitle, translate }: FocusModeProps) => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [breathePhase, setBreathePhase] = useState(0);

    useEffect(() => {
        if (!isOpen) { setTimeLeft(25 * 60); setIsRunning(false); return; }
    }, [isOpen]);

    useEffect(() => {
        if (!isRunning || timeLeft <= 0) return;
        const id = setInterval(() => setTimeLeft(p => p - 1), 1000);
        return () => clearInterval(id);
    }, [isRunning, timeLeft]);

    // Breathing animation
    useEffect(() => {
        if (!isOpen) return;
        const id = setInterval(() => setBreathePhase(p => (p + 1) % 4), 4000);
        return () => clearInterval(id);
    }, [isOpen]);

    if (!isOpen) return null;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const breatheScale = breathePhase < 2 ? 1 + breathePhase * 0.15 : 1 + (3 - breathePhase) * 0.15;

    return (
        <div className="fixed inset-0 z-[100] bg-gray-950 flex flex-col items-center justify-center animate-fadeIn">
            {/* Breathing Orb Background */}
            <div
                className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary-500/20 to-purple-500/10 blur-3xl transition-transform duration-[4000ms] ease-in-out"
                style={{ transform: `scale(${breatheScale})` }}
            />

            {/* Exit */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white/60 hover:text-white transition-all duration-200 backdrop-blur-sm"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Current Task */}
            {taskTitle && (
                <div className="relative z-10 mb-8 text-center">
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-2">{translate('focus_current_task')}</p>
                    <h2 className="text-2xl font-bold text-white">{taskTitle}</h2>
                </div>
            )}

            {/* Timer */}
            <div className="relative z-10 mb-12">
                <div className="relative w-64 h-64 flex items-center justify-center">
                    <svg className="w-64 h-64 absolute" viewBox="0 0 256 256">
                        <circle cx="128" cy="128" r="120" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                        <circle cx="128" cy="128" r="120" fill="none" stroke="url(#focusGrad)" strokeWidth="6" strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 120}`}
                            strokeDashoffset={`${2 * Math.PI * 120 * (1 - timeLeft / (25 * 60))}`}
                            transform="rotate(-90 128 128)"
                            className="transition-all duration-1000"
                        />
                        <defs>
                            <linearGradient id="focusGrad" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="text-center">
                        <span className="text-6xl font-bold text-white tabular-nums tracking-tight">
                            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="relative z-10 flex gap-4">
                <button
                    onClick={() => { setTimeLeft(25 * 60); setIsRunning(false); }}
                    className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white shadow-2xl shadow-primary-500/30 hover:scale-105 transition-all active:scale-95"
                >
                    {isRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
                </button>
                <div className="w-11" /> {/* Spacer */}
            </div>

            {/* Breathing text */}
            <p className="relative z-10 mt-12 text-white/20 text-sm tracking-widest animate-pulse">
                {translate('focus_breathe')}
            </p>
        </div>
    );
};

export default FocusMode;
