import { useState, FormEvent } from 'react';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { AlertCircle, Sparkles, ArrowRight, Calendar, User, Mail, Lock } from 'lucide-react';
import { AppState } from './types';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Check if user doc exists, if not create it
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const newUserState: AppState = {
          user: {
            uid: result.user.uid,
            email: result.user.email || '',
            name: result.user.displayName || 'User',
            joinedAt: new Date().toISOString(),
            avatarUrl: result.user.photoURL || undefined
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
          theme: 'dark'
        };
        await setDoc(userDocRef, newUserState);
      }

      onLogin();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update Auth Profile
        await updateProfile(user, { displayName: name });

        // Create Firestore Document
        const newUserState: AppState = {
          user: {
            uid: user.uid,
            email: user.email || '',
            name: name || 'User',
            birthDate: birthDate,
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
          theme: 'dark'
        };

        await setDoc(doc(db, 'users', user.uid), newUserState);
      }
      onLogin();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen login-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/20 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-pink-500/20 rounded-full blur-[100px] animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-md w-full relative z-10 animate-scaleIn">
        {/* Glass Card */}
        <div className="glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="p-8">
            {/* Logo + Header */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4 group cursor-pointer">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-primary-500/30 animate-float relative z-10 transition-transform duration-300 group-hover:scale-110">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-2xl bg-primary-500 blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
              </div>
              <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
                {isLogin ? 'Welcome Back' : 'Join iPlan'}
              </h1>
              <p className="text-white/50 text-sm font-medium">
                {isLogin ? 'Sign in to access your workspace' : 'Start your productivity journey today'}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm animate-slideDown backdrop-blur-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">

              {!isLogin && (
                <div className="space-y-4 animate-slideDown">
                  <div className="group">
                    <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:bg-white/10 focus:border-primary-500/50 text-white placeholder-gray-500 transition-all duration-200 text-sm font-medium"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider ml-1">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
                      <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:bg-white/10 focus:border-primary-500/50 text-white placeholder-gray-500 transition-all duration-200 text-sm font-medium appearance-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="group">
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:bg-white/10 focus:border-primary-500/50 text-white placeholder-gray-500 transition-all duration-200 text-sm font-medium"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:bg-white/10 focus:border-primary-500/50 text-white placeholder-gray-500 transition-all duration-200 text-sm font-medium"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-6 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 hover:from-primary-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 disabled:opacity-50 transition-all duration-300 active:scale-[0.98] relative overflow-hidden group btn-glow text-sm"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Or continue with</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-bold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-3 hover:border-white/20 text-sm group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>

            <p className="mt-8 text-center text-sm text-white/40">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="ml-2 font-bold text-primary-400 hover:text-primary-300 hover:underline outline-none transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center mt-6 text-white/10 text-[10px] font-bold tracking-[0.2em] hover:text-white/20 transition-colors cursor-default">
          POWERED BY IPLAN
        </p>
      </div>
    </div>
  );
};

export default LoginPage;