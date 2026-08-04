import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, X, LogOut, CheckCircle2, ShieldCheck, Sparkles, Mail, Save, Edit3 } from 'lucide-react';
import { signInWithGoogle, logoutUser, updateUserProfile, isFirebaseConfigured } from '../services/firebase';

export default function AuthModal({ isOpen, onClose, user, onAuthSuccess }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [nameInput, setNameInput] = useState(user?.displayName || 'Math Master');
  const [emailInput, setEmailInput] = useState(user?.email || '');

  useEffect(() => {
    if (user) {
      setNameInput(user.displayName || 'Math Master');
      setEmailInput(user.email || '');
    }
  }, [user]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const loggedUser = await signInWithGoogle();
      onAuthSuccess(loggedUser);
      onClose();
    } catch (e) {
      console.error(e);
      setErrorMsg('Google Sign-in failed. You can enter your Name & Gmail below.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const updated = await updateUserProfile(user, nameInput, emailInput);
      onAuthSuccess(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to save profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    onAuthSuccess(null);
    onClose();
  };

  // Get user profile image or avatar fallback
  const userPhoto = user?.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(emailInput || nameInput || 'mathloop')}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-panel rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-emerald-500/30 text-center shadow-2xl relative overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Profile Picture / Avatar Display */}
          <div className="relative inline-block mx-auto mb-3">
            <img 
              src={userPhoto} 
              alt={nameInput || 'User Profile'} 
              className="w-20 h-20 rounded-full border-2 border-emerald-400 object-cover shadow-glow-emerald mx-auto bg-slate-900"
            />
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-400 border-2 border-slate-950 flex items-center justify-center text-[10px] text-slate-950 font-bold" title="Cloud Progression Active">
              ✓
            </span>
          </div>

          <h3 className="text-xl font-black text-white mb-1 font-sans tracking-tight">
            Player Profile & Gmail Link
          </h3>
          <p className="text-slate-400 text-xs mb-4">
            Link your Name & Gmail to save high scores and climb rankings.
          </p>

          {errorMsg && (
            <p className="text-xs text-rose-400 mb-3 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
              {errorMsg}
            </p>
          )}

          {savedSuccess && (
            <p className="text-xs text-emerald-300 mb-3 bg-emerald-500/15 p-2.5 rounded-xl border border-emerald-500/30 font-semibold animate-pulse">
              ✓ Profile & Gmail Saved & Synced!
            </p>
          )}

          {/* Editable Name & Gmail Form */}
          <form onSubmit={handleSaveProfile} className="space-y-3 mb-5 text-left">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider flex items-center gap-1">
                <User className="w-3 h-3 text-emerald-400" />
                <span>Player Name</span>
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your name..."
                required
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-400 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider flex items-center gap-1">
                <Mail className="w-3 h-3 text-emerald-400" />
                <span>Gmail / Email Address</span>
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="user@gmail.com"
                required
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-emerald transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save & Link Data'}</span>
            </button>
          </form>

          {/* Quick Google Sign In */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
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
              <span>Auto-Fill with Google Account</span>
            </button>

            {user && (
              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs border border-rose-500/20 flex items-center justify-center gap-2 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
