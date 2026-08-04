import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, X, LogOut, CheckCircle2, ShieldCheck, Sparkles, Mail } from 'lucide-react';
import { signInWithGoogle, logoutUser, isFirebaseConfigured } from '../services/firebase';

export default function AuthModal({ isOpen, onClose, user, onAuthSuccess }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
      setErrorMsg('Google Sign-in failed. Running in Guest Mode instead.');
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
  const userPhoto = user?.photoURL || (user?.email ? `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}` : null);
  const firstName = user?.displayName ? user.displayName.split(' ')[0] : 'Player';

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
          <div className="relative inline-block mx-auto mb-4">
            {userPhoto ? (
              <img 
                src={userPhoto} 
                alt={user?.displayName || 'User Profile'} 
                className="w-20 h-20 rounded-full border-2 border-emerald-400 object-cover shadow-glow-emerald mx-auto"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center shadow-glow-emerald">
                <User className="w-10 h-10" />
              </div>
            )}
            {user && (
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-400 border-2 border-slate-950 flex items-center justify-center text-[10px]" title="Cloud Sync Active">
                ✓
              </span>
            )}
          </div>

          {user ? (
            <div>
              {/* First Name & Full Display Name */}
              <h3 className="text-2xl font-black text-white mb-1 font-sans tracking-tight">
                {user.displayName || 'Guest Player'}
              </h3>
              
              {/* Gmail / Email Address */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-emerald-400 font-mono mb-6">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>{user.email || 'guest@mathloop.local'}</span>
              </div>

              {/* Cloud Sync Active Status */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-emerald-500/20 text-xs text-slate-300 mb-6 space-y-1 text-left shadow-inner">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Cloud Progression Active</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Your High Score, Brain Coins, Level progress, and Tickets are synced automatically.
                </p>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={handleLogout}
                className="w-full py-3.5 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-extrabold text-sm border border-rose-500/30 flex items-center justify-center gap-2 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                Sign In to MathLoop
              </h3>
              <p className="text-slate-300 text-xs mb-6 leading-relaxed">
                Connect your Google account to show your profile picture, Gmail address, and climb the global rankings!
              </p>

              {errorMsg && (
                <p className="text-xs text-rose-400 mb-4 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                  {errorMsg}
                </p>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-sm flex items-center justify-center gap-3 shadow-xl transition transform active:scale-95"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{loading ? 'Connecting...' : 'Sign In with Google'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 transition"
                >
                  Continue in Guest Mode
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
