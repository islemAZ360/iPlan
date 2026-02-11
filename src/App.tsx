import { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from './firebase';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import LoginPage from './LoginPage';
import './index.css';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 login-bg">
        <div className="flex flex-col items-center gap-4 animate-fadeIn">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={() => { }} />;
  }

  return (
    <AppProvider initialUser={user}>
      <HashRouter>
        <Layout />
      </HashRouter>
    </AppProvider>
  );
}