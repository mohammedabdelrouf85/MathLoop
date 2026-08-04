import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, X, LogOut, CheckCircle2, ShieldCheck, Sparkles, Mail, Save, Lock, ArrowRight, Cloud, KeyRound } from 'lucide-react';
import { signInWithGoogle, logoutUser, updateUserProfile, loginWithGmailAccount, isFirebaseConfigured } from '../services/firebase';

export default function AuthModal({ isOpen, onClose, user, onAuthSuccess }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [emailInput, setEmailInput] = useState(user?.email || '');
  const [nameInput, setNameInput] = useState(user?.displayName || '');
  const [passwordInput, setPasswordInput] = useState('');

  useEffect(() => {
    if (user) {
      setNameInput(user.displayName || '');
      setEmailInput(user.email || '');
    }
  }, [user]);

  if (!isOpen) return null;

  const handleGmailLogin = async (e) => {
    if (e) e.preventDefault();
    if (!emailInput) {
      setErrorMsg('Please enter your Gmail address');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const loggedUser = await loginWithGmailAccount(emailInput, nameInput);
      onAuthSuccess(loggedUser);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      setErrorMsg('Gmail login failed. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const loggedUser = await signInWithGoogle();
      onAuthSuccess(loggedUser);
      onClose();
    } catch (e) {
      console.error(e);
      setErrorMsg('Google Sign-in failed. You can sign in with your Gmail below.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    onAuthSuccess(null);
    onClose();
  };

  // Profile avatar URL
  const userPhoto = user?.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(emailInput || nameInput || 'mathloop')}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-panel rounded-3xl p-6 sm:p-8 max-w-md w-full border border-emerald-500/30 text-center shadow-2xl relative overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Badge */}
          <div className="relative inline-block mx-auto mb-3">
            <img 
              src={userPhoto} 
              alt={nameInput || 'User Profile'} 
              className="w-20 h-20 rounded-full border-2 border-emerald-400 object-cover shadow-glow-emerald mx-auto bg-slate-900"
            />
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-400 border-2 border-slate-950 flex items-center justify-center text-xs text-slate-950 font-bold" title="Cloud Sync Active">
              ✓
            </span>
          </div>

          <h3 className="text-2xl font-extrabold text-white mb-1 font-sans tracking-tight">
            {user && !user.isGuest ? 'Account & Cloud Progress' : 'Sign In with Gmail'}
          </h3>
          <p className="text-slate-400 text-xs mb-5 max-w-xs mx-auto">
            {user && !user.isGuest 
              ? 'Your High Score, Coins, and Tickets are linked to your Gmail account.'
              : 'Enter your Gmail to save high scores, coins, and cloud progress across devices!'}
          </p>

          {errorMsg && (
            <p className="text-xs text-rose-400 mb-4 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20 font-semibold">
              {errorMsg}
            </p>
          )}

          {savedSuccess && (
            <p className="text-xs text-emerald-300 mb-4 bg-emerald-500/15 p-2.5 rounded-xl border border-emerald-500/30 font-bold animate-pulse">
              ✓ Signed In! Syncing Cloud Progression...
            </p>
          )}

          {/* GMAIL LOGIN FORM */}
          <form onSubmit={handleGmailLogin} className="space-y-3.5 mb-5 text-left">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gmail / Email Address</span>
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="your.email@gmail.com"
                required
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-emerald-400 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Player Display Name</span>
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Alex MathMaster"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white font-semibold placeholder:text-slate-600 focus:outline-none focus:border-emerald-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-brand-500 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-emerald transition transform active:scale-95"
            >
              <Cloud className="w-4 h-4" />
              <span>{loading ? 'Connecting...' : 'Sign In with Gmail & Save Progress'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Google Sign In */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs flex items-center justify-center gap-2.5 shadow-lg transition active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>One-Click Google Sign In</span>
            </button>

            {user && (
              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs border border-rose-500/20 flex items-center justify-center gap-2 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out Account</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
