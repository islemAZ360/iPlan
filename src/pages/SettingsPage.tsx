import { BookOpen, Moon, Sun, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';

const SettingsPage = () => {
    const { user, updateUser, language, setLanguage, theme, setTheme, translate, logout } = useApp();

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6 h-full overflow-y-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{translate('settings_title')}</h1>

            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                {/* Profile Header */}
                <div className="h-24 bg-gradient-to-r from-primary-500 via-primary-600 to-purple-600 relative">
                    <div className="absolute -bottom-8 left-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 border-4 border-white dark:border-gray-800 shadow-xl flex items-center justify-center text-white font-bold text-2xl uppercase">
                            {user.name.charAt(0)}
                        </div>
                    </div>
                </div>

                <div className="p-8 pt-12">
                    <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">{translate('profile')}</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{translate('display_name')}</label>
                            <input
                                type="text"
                                value={user.name}
                                onChange={(e) => updateUser({ name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all duration-200"
                            />
                        </div>
                        {user.email && (
                            <div>
                                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{translate('email')}</label>
                                <p className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">{user.email}</p>
                            </div>
                        )}
                        <div className="pt-4">
                            <button
                                onClick={logout}
                                className="px-6 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl font-bold transition-all duration-200 flex items-center gap-2 hover:scale-105"
                            >
                                <LogOut className="w-4 h-4" />
                                {translate('logout')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preferences */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">{translate('preferences')}</h2>

                {/* Theme Toggle */}
                <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl transition-colors duration-300 ${theme === 'dark' ? 'bg-indigo-900/50 text-indigo-400' : 'bg-orange-100 text-orange-500'}`}>
                            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </div>
                        <span className="text-gray-700 dark:text-gray-200 font-medium">{translate('theme')}</span>
                    </div>
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-primary-500 to-purple-500' : 'bg-gray-200'}`}
                    >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>

                {/* Language */}
                <div className="flex items-center justify-between py-4 pt-6">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-500">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-200 font-medium">{translate('language')}</span>
                    </div>
                    <div className="flex gap-1.5 bg-gray-100 dark:bg-gray-900 rounded-xl p-1">
                        {[
                            { value: 'en' as Language, label: 'EN' },
                            { value: 'ar' as Language, label: 'عر' },
                            { value: 'ru' as Language, label: 'РУ' },
                        ].map(lang => (
                            <button
                                key={lang.value}
                                onClick={() => setLanguage(lang.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${language === lang.value
                                        ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
