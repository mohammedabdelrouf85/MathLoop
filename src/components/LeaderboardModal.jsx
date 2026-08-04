import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Medal, Crown, Star, RefreshCw } from 'lucide-react';
import { fetchGlobalLeaderboard } from '../services/firebase';

export default function LeaderboardModal({ isOpen, onClose, user, userHighScore }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadLeaderboard();
    }
  }, [isOpen]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await fetchGlobalLeaderboard();
      setLeaderboard(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-panel rounded-3xl p-6 max-w-md w-full border border-amber-500/30 max-h-[85vh] flex flex-col shadow-2xl relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Global Leaderboard</h3>
                <p className="text-xs text-slate-400">Top mental math grandmasters</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Leaderboard Table List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar">
            {loading ? (
              <div className="py-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                Loading rankings...
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No scores recorded yet. Be the first to claim #1!
              </div>
            ) : (
              leaderboard.map((item, index) => {
                const rank = index + 1;
                const isCurrentUser = user && (user.displayName === item.displayName || user.uid === item.id);

                return (
                  <div
                    key={item.id || index}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition ${
                      isCurrentUser
                        ? 'bg-brand-500/15 border-brand-400/50 text-white shadow-glow-emerald'
                        : rank === 1
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank Icon */}
                      <div className="w-8 h-8 rounded-xl bg-slate-800/80 flex items-center justify-center font-black text-sm">
                        {rank === 1 ? (
                          <Crown className="w-5 h-5 text-amber-400" />
                        ) : rank === 2 ? (
                          <Medal className="w-4 h-4 text-slate-300" />
                        ) : rank === 3 ? (
                          <Medal className="w-4 h-4 text-amber-600" />
                        ) : (
                          <span className="text-slate-400 font-mono">#{rank}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <img
                        src={item.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.displayName || rank}`}
                        alt={item.displayName}
                        className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                      />

                      {/* Name & High Level */}
                      <div>
                        <div className="font-bold text-sm leading-tight flex items-center gap-1.5">
                          <span>{item.displayName || 'Anonymous'}</span>
                          {isCurrentUser && (
                            <span className="px-1.5 py-0.2 rounded bg-brand-500/20 text-brand-300 text-[10px] font-bold">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <span>Level {item.highLevel || 1}</span>
                          {item.updatedAtDate && (
                            <span className="text-[10px] text-slate-500 font-mono">
                              • {item.updatedAtDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* High Score */}
                    <div className="text-right font-mono font-extrabold text-sm text-brand-300">
                      {item.highScore || 0} <span className="text-[10px] text-slate-500 font-sans">PTS</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer User Rank Summary with Date */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Highest Rank Record: #1</span>
            </div>
            <span className="text-amber-400 font-mono font-bold text-sm">{userHighScore} PTS</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
