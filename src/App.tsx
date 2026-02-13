import { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from './firebase';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import LoginPage from './LoginPage';
import './index.css';
import Loader from './components/Loader';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-950 login-bg text-white">
        <Loader />
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