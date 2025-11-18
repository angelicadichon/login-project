import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase/config';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Logo from './components/Logo';
import Dashboard from './components/Dashboard';
import './App.css';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="App">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, show dashboard
  if (user) {
    return <Dashboard />;
  }

  // If user is not logged in, show login/signup
  return (
    <div className="App">
      <div className="container">
        <Logo />
        
        <div className="view-toggle">
          <button 
            className={currentView === 'login' ? 'active' : ''}
            onClick={() => setCurrentView('login')}
          >
            Login
          </button>
          <button 
            className={currentView === 'signup' ? 'active' : ''}
            onClick={() => setCurrentView('signup')}
          >
            Sign Up
          </button>
        </div>

        {currentView === 'login' ? <Login /> : <SignUp />}
      </div>
    </div>
  );
};

export default App;