import React, { useState } from 'react';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import { LandingPage } from './components/Landing/LandingPage';
import GridLines from './components/common/GridLines';
import { useAuth } from './contexts/AuthContext';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#0c0c0c] relative">
      <GridLines />
      <div className="relative z-10">
        {currentUser ? (
          <Dashboard user={currentUser} onLogout={logout} />
        ) : showLogin ? (
          <LoginPage onBack={() => setShowLogin(false)} />
        ) : (
          <LandingPage onGetStarted={() => setShowLogin(true)} />
        )}
      </div>
    </div>
  );
}

export default App;
