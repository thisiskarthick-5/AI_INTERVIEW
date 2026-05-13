import React, { useState } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const LoginPage = ({ onBack }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError('Failed to sign in with Google: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError('Failed to authenticate: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-10 z-10">
      <button 
        onClick={onBack}
        className="absolute top-10 left-10 text-white/50 hover:text-orange-500 uppercase tracking-widest text-xs transition flex items-center gap-2 z-50"
      >
        <span>&larr;</span> Back
      </button>
      
      <div className="w-full max-w-md bg-[#111] border border-white/10 p-10 backdrop-blur-sm relative z-20 shadow-2xl">
        <h2 className="condensed text-4xl mb-2 text-center">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
        <p className="text-gray-500 text-xs uppercase tracking-widest text-center mb-10">
          {isSignUp ? 'Sign up for a new account' : 'Log in to your account'}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-3 mb-6 rounded text-center">
            {error}
          </div>
        )}

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 font-bold text-sm hover:bg-gray-200 transition mb-6 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] flex-1 bg-white/10"></div>
          <span className="text-white/40 text-xs uppercase tracking-widest">or</span>
          <div className="h-[1px] flex-1 bg-white/10"></div>
        </div>

        <form className="space-y-4" onSubmit={handleEmailAuth}>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0c0c0c] border border-white/10 p-3 text-white focus:outline-none focus:border-orange-500 transition" 
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0c0c0c] border border-white/10 p-3 text-white focus:outline-none focus:border-orange-500 transition" 
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex justify-between items-center pt-2 pb-6 text-xs text-gray-500">
            <label className="flex items-center gap-2 cursor-pointer hover:text-white transition">
              <input type="checkbox" className="accent-orange-500" />
              Remember me
            </label>
            {!isSignUp && <a href="#" className="hover:text-orange-500 transition">Forgot password?</a>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-500 text-black py-4 font-bold text-sm uppercase tracking-widest hover:bg-orange-400 transition disabled:opacity-50"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-500">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-orange-500 hover:text-white transition font-bold"
          >
            {isSignUp ? 'Log in' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
