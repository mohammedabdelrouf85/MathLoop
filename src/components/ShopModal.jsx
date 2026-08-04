import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Coins, Lightbulb, PlusCircle, Snowflake, SkipForward, Sparkles } from 'lucide-react';
import { playPowerupSound } from '../services/soundEffects';

export default function ShopModal({ isOpen, onClose, coins, onEarnCoins }) {
  if (!isOpen) return null;

  const items = [
    {
      id: 'hint',
      name: 'Smart Hint',
      desc: 'Removes 2 incorrect choices from your current equation.',
      icon: Lightbulb,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/30',
      price: 15
    },
    {
      id: 'time',
      name: 'Time Boost (+10s)',
      desc: 'Extends your round timer by 10 additional seconds.',
      icon: PlusCircle,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30',
      price: 20
    },
    {
      id: 'freeze',
      name: 'Timer Freeze',
      desc: 'Completely stops timer countdown for 10 full seconds.',
      icon: Snowflake,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/30',
      price: 25
    },
    {
      id: 'skip',
      name: 'Question Skip',
      desc: 'Safely bypasses a hard question without breaking your streak.',
      icon: SkipForward,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/30',
      price: 50
    }
  ];

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
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Brain Power Shop</h3>
                <p className="text-xs text-slate-400">Use coins to acquire gameplay advantages</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Coins Balance */}
          <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <span className="text-xs text-amber-200 font-semibold">Your Coins Balance:</span>
            <div className="flex items-center gap-1 text-amber-300 font-bold text-base font-mono">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{coins} Coins</span>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 no-scrollbar">
            {items.map((item) => {
              const Icon = item.icon;
              const canAfford = coins >= item.price;

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${item.bgColor} ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{item.name}</h4>
                      <p className="text-[11px] text-slate-400 leading-tight max-w-[180px] sm:max-w-[200px]">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <button
                    disabled={!canAfford}
                    onClick={() => {
                      if (canAfford) {
                        onEarnCoins(-item.price);
                        playPowerupSound();
                      }
                    }}
                    className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1 border transition ${
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 shadow-sm cursor-pointer'
                        : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>{item.price}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
