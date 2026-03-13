import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

const Toast = () => {
    const [toast, setToast] = useState<{ title: string; body: string } | null>(null);

    useEffect(() => {
        const handleToast = (e: any) => {
            setToast(e.detail);
            // Auto hide after 5 seconds
            setTimeout(() => setToast(null), 5000);
        };

        window.addEventListener('app-toast', handleToast);
        return () => window.removeEventListener('app-toast', handleToast);
    }, []);

    if (!toast) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] animate-slideIn">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 min-w-[300px] max-w-md flex gap-4 items-start group">
                <div className="p-2 bg-primary-500/20 text-primary-400 rounded-xl">
                    <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-white mb-1">{toast.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{toast.body}</p>
                </div>
                <button onClick={() => setToast(null)} className="p-1 text-gray-500 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 h-1 bg-primary-500 rounded-full animate-progress-shrink" />
            </div>
        </div>
    );
};

export default Toast;
