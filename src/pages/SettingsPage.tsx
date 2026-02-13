import { useState, useRef } from 'react';
import { BookOpen, Moon, Sun, LogOut, Camera, Mail, Calendar, User, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateEmail } from 'firebase/auth';
import { auth } from '../firebase';

const SettingsPage = () => {
    const navigate = useNavigate();
    const { user, updateUser, language, setLanguage, theme, setTheme, translate, logout } = useApp();
    const [uploading, setUploading] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [emailError, setEmailError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && user.uid) {
            const file = e.target.files[0];
            const storageRef = ref(storage, `profile_pictures/${user.uid}`);
            setUploading(true);
            try {
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);
                updateUser({ avatarUrl: downloadURL });
            } catch (error) {
                console.error("Error uploading file:", error);
                alert("Failed to upload image. Please try again.");
            } finally {
                setUploading(false);
            }
        }
    };

    const handleEmailUpdate = async () => {
        if (!newEmail) return;
        try {
            if (auth.currentUser) {
                await updateEmail(auth.currentUser, newEmail);
                updateUser({ email: newEmail });
                setIsEditingEmail(false);
                setNewEmail('');
                setEmailError('');
                alert("Email updated successfully!");
            }
        } catch (error: any) {
            console.error("Error updating email:", error);
            setEmailError(error.message || "Failed to update email. You may need to re-login.");
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6 h-full overflow-y-auto pb-24">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-500">{translate('settings_title')}</h1>

            {/* Profile Card */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-xl relative group">
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-purple-500/5 to-transparent pointer-events-none" />

                {/* Profile Header */}
                <div className="h-32 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 relative">
                    <div className="absolute -bottom-10 left-8">
                        <div className="relative">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-24 h-24 rounded-2xl bg-gray-900 border-4 border-gray-900 shadow-2xl flex items-center justify-center text-white font-bold text-3xl uppercase overflow-hidden cursor-pointer group/avatar relative"
                            >
                                {user.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 w-full h-full flex items-center justify-center">
                                        {user.name.charAt(0)}
                                    </span>
                                )}

                                {/* Upload Overlay */}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200">
                                    {uploading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : <Camera className="w-8 h-8 text-white" />}
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-8 pt-14 space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                            <p className="text-sm text-gray-400 font-medium">Productivity Master</p>
                        </div>
                        {user.birthDate && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">
                                <Calendar className="w-3.5 h-3.5 text-primary-400" />
                                <span>{user.birthDate}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        {/* Display Name */}
                        <div className="group/input">
                            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider ml-1">{translate('display_name')}</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within/input:text-primary-400 transition-colors" />
                                <input
                                    type="text"
                                    value={user.name}
                                    onChange={(e) => updateUser({ name: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="group/input">
                            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider ml-1">{translate('email')}</label>
                            {isEditingEmail ? (
                                <div className="space-y-2">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within/input:text-primary-400 transition-colors" />
                                        <input
                                            type="email"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            placeholder="Enter new email"
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all duration-200"
                                        />
                                    </div>
                                    {emailError && <p className="text-xs text-red-400 ml-1">{emailError}</p>}
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={() => { setIsEditingEmail(false); setEmailError(''); }}
                                            className="px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleEmailUpdate}
                                            className="px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold transition-colors shadow-lg shadow-primary-500/20"
                                        >
                                            Save Email
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative group/email">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <div className="w-full pl-11 pr-20 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 flex items-center justify-between">
                                        <span className="truncate">{user.email}</span>
                                        <button
                                            onClick={() => setIsEditingEmail(true)}
                                            className="ml-2 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] font-bold text-white transition-all uppercase tracking-wide"
                                        >
                                            Change
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-6 border-t border-white/10">
                            <button
                                onClick={logout}
                                className="w-full px-6 py-3.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <LogOut className="w-4 h-4" />
                                {translate('logout')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preferences */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-xl">
                <h2 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary-500 rounded-full" />
                    {translate('preferences')}
                </h2>

                {/* Theme Toggle — BB8 */}
                <div className="flex flex-col sm:flex-row items-center justify-between py-6 border-b border-white/5 gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl transition-colors duration-300 ${theme === 'dark' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-orange-500/20 text-orange-400'}`}>
                            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </div>
                        <span className="text-gray-200 font-medium">{translate('theme')}</span>
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
                        <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="text-gray-200 font-medium">{translate('language')}</span>
                    </div>
                    <div className="flex gap-1.5 bg-gray-900/50 rounded-xl p-1 border border-white/5">
                        {[
                            { value: 'en' as Language, label: 'EN' },
                            { value: 'ar' as Language, label: 'عر' },
                            { value: 'ru' as Language, label: 'РУ' },
                        ].map(lang => (
                            <button
                                key={lang.value}
                                onClick={() => setLanguage(lang.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${language === lang.value
                                    ? 'bg-white/10 text-white shadow-sm border border-white/5'
                                    : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* About Developer Button */}
            <div className="flex justify-center pt-8">
                <button
                    onClick={() => navigate('/about-dev')}
                    className="btn-glow px-8 py-3 rounded-full text-xs font-black tracking-widest text-white/50 hover:text-white transition-colors"
                >
                    ABOUT DEVELOPER
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
