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
    const startTime = Date.now();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 2000 - elapsedTime);

      setTimeout(() => {
        setUser(currentUser);
        setLoading(false);
      }, remainingTime);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Loader />
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