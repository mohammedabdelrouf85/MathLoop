import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, X, Trophy, Flame, Coins, Zap } from 'lucide-react';

export default function StatsModal({ isOpen, onClose, userStats }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-panel rounded-3xl p-6 max-w-sm w-full border border-brand-500/30 text-center shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400 mx-auto mb-3 flex items-center justify-center">
            <BarChart3 className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-extrabold text-white mb-1">
            Player Statistics
          </h3>
          <p className="text-slate-400 text-xs mb-6">Your mental math career summary</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <div className="text-xs text-slate-400 font-semibold">High Score</div>
              <div className="text-xl font-mono font-extrabold text-white">
                {userStats?.highScore || 0}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <Zap className="w-5 h-5 text-brand-400 mx-auto mb-1" />
              <div className="text-xs text-slate-400 font-semibold">Max Level</div>
              <div className="text-xl font-mono font-extrabold text-white">
                {userStats?.highLevel || 1}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <Coins className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <div className="text-xs text-slate-400 font-semibold">Coins Earned</div>
              <div className="text-xl font-mono font-extrabold text-white">
                {userStats?.coins || 0}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <Flame className="w-5 h-5 text-fire-glow mx-auto mb-1" />
              <div className="text-xs text-slate-400 font-semibold">Total Points</div>
              <div className="text-xl font-mono font-extrabold text-white">
                {userStats?.totalPoints || 0}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
