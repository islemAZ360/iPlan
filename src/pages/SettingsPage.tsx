import { BookOpen, Moon, Sun, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Language } from '../types';

const SettingsPage = () => {
    const navigate = useNavigate();
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

                {/* Theme Toggle — BB8 */}
                <div className="flex flex-col sm:flex-row items-center justify-between py-6 border-b border-gray-100 dark:border-gray-700 gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl transition-colors duration-300 ${theme === 'dark' ? 'bg-indigo-900/50 text-indigo-400' : 'bg-orange-100 text-orange-500'}`}>
                            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </div>
                        <span className="text-gray-700 dark:text-gray-200 font-medium">{translate('theme')}</span>
                    </div>
                    <label className="bb8-toggle">
                        <input
                            className="bb8-toggle__checkbox"
                            type="checkbox"
                            checked={theme === 'dark'}
                            onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        />
                        <div className="bb8-toggle__container">
                            <div className="bb8-toggle__scenery">
                                <div className="bb8-toggle__star"></div>
                                <div className="bb8-toggle__star"></div>
                                <div className="bb8-toggle__star"></div>
                                <div className="bb8-toggle__star"></div>
                                <div className="bb8-toggle__star"></div>
                                <div className="bb8-toggle__star"></div>
                                <div className="bb8-toggle__star"></div>
                                <div className="tatto-1"></div>
                                <div className="tatto-2"></div>
                                <div className="gomrassen"></div>
                                <div className="hermes"></div>
                                <div className="chenini"></div>
                                <div className="bb8-toggle__cloud"></div>
                                <div className="bb8-toggle__cloud"></div>
                                <div className="bb8-toggle__cloud"></div>
                            </div>
                            <div className="bb8">
                                <div className="bb8__head-container">
                                    <div className="bb8__antenna"></div>
                                    <div className="bb8__antenna"></div>
                                    <div className="bb8__head"></div>
                                </div>
                                <div className="bb8__body"></div>
                            </div>
                            <div className="artificial__hidden">
                                <div className="bb8__shadow"></div>
                            </div>
                        </div>
                    </label>
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

            {/* About Developer Button */}
            <div className="flex justify-center pt-4 pb-8">
                <button
                    onClick={() => navigate('/about-dev')}
                    className="btn-glow"
                >
                    ABOUT DEVELOPER
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
