import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Volume2, VolumeX, Shield, HelpCircle, Info, RefreshCw } from 'lucide-react';
import { isFirebaseConfigured } from '../services/firebase';

export default function SettingsModal({ isOpen, onClose, soundOn, onToggleSound }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-panel rounded-3xl p-6 max-w-md w-full border border-brand-500/30 shadow-2xl relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Game Settings</h3>
                <p className="text-xs text-slate-400">Preferences & Game Rules</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Audio Toggle */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-800 text-brand-400">
                  {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Sound Effects</div>
                  <div className="text-slate-400 text-[11px]">Web Audio API synthesized SFX</div>
                </div>
              </div>

              <button
                onClick={onToggleSound}
                className={`w-12 h-6 rounded-full transition-colors p-1 relative ${
                  soundOn ? 'bg-brand-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    soundOn ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Cloud Status */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-800 text-emerald-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Backend Service</div>
                  <div className="text-slate-400 text-[11px]">
                    {isFirebaseConfigured ? '🔥 Firebase Firestore Active' : '⚡ Local Persistence Mode'}
                  </div>
                </div>
              </div>

              <span className="px-2 py-1 rounded bg-brand-500/20 text-brand-300 font-bold text-[10px]">
                {isFirebaseConfigured ? 'CONNECTED' : 'LOCAL'}
              </span>
            </div>

            {/* How to Play Rules */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="font-bold text-white text-sm flex items-center gap-1.5 text-brand-300">
                <HelpCircle className="w-4 h-4" />
                <span>How to Play & Score</span>
              </div>
              <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px] leading-relaxed">
                <li>30 seconds per round equation.</li>
                <li>Division equations always result in whole integers.</li>
                <li>Answer 5 fast questions in a row to activate **Hyperdrive Fire Mode** (2X Points).</li>
                <li>Tickets regenerate 1 per 15 minutes (Max 5).</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
