import React from 'react';
import { 
  Trophy, 
  ShoppingBag, 
  BarChart3, 
  Volume2, 
  VolumeX, 
  Ticket, 
  Coins, 
  User as UserIcon, 
  Settings,
  Flame,
  Sparkles
} from 'lucide-react';
import { formatTimeRemaining } from '../services/ticketSystem';

export default function Header({
  user,
  tickets,
  secondsUntilNext,
  coins,
  highScore,
  soundOn,
  onToggleSound,
  onOpenLeaderboard,
  onOpenShop,
  onOpenStats,
  onOpenAuth,
  onOpenSettings
}) {
  return (
    <header className="w-full border-b border-emerald-500/20 bg-[#0a1020]/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-brand-500 to-cyan-500 flex items-center justify-center shadow-glow-emerald text-white text-2xl font-black group-hover:scale-105 transition-transform duration-300">
              ♾️
            </div>
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-30 blur transition-opacity duration-300" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5 font-sans">
              Math<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Loop</span>
            </h1>
            <p className="text-[10px] text-emerald-400/80 font-bold tracking-widest uppercase hidden sm:flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
              Mental Math Arcade
            </p>
          </div>
        </div>

        {/* Center Stats Bar: Ticket Energy & Brain Coins */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Ticket Energy Pill */}
          <div 
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-xs font-semibold shadow-card-glass hover:border-emerald-400/60 transition group cursor-default"
            title={tickets < 5 ? `Next ticket in ${formatTimeRemaining(secondsUntilNext)}` : 'Tickets Full'}
          >
            <div className="relative flex items-center justify-center">
              <Ticket className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
              {tickets > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              )}
            </div>
            <span className="text-emerald-300 font-extrabold font-mono text-sm">{tickets}<span className="text-slate-500 font-normal">/5</span></span>
            {tickets < 5 && secondsUntilNext > 0 && (
              <span className="text-[11px] text-slate-400 font-mono hidden md:inline border-l border-slate-800 pl-2">
                {formatTimeRemaining(secondsUntilNext)}
              </span>
            )}
          </div>

          {/* Brain Coins Pill */}
          <button 
            onClick={onOpenShop}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-inner hover:bg-amber-500/20 hover:border-amber-400/60 hover:scale-105 transition-all group"
            title="Open Brain Shop"
          >
            <Coins className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="font-mono text-sm text-amber-200">{coins}</span>
            <span className="text-[10px] bg-amber-500/30 text-amber-300 px-1.5 py-0.5 rounded-md uppercase font-extrabold hidden sm:inline">Shop</span>
          </button>
        </div>

        {/* Right Controls & Auth */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Shop Icon Button */}
          <button
            onClick={onOpenShop}
            className="p-2.5 rounded-xl bg-slate-900/80 text-slate-300 hover:text-emerald-400 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/40 transition relative group"
            title="Brain Shop"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-glow-emerald" />
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={onOpenLeaderboard}
            className="p-2.5 rounded-xl bg-slate-900/80 text-slate-300 hover:text-amber-400 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 transition group"
            title="Leaderboard"
          >
            <Trophy className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </button>

          {/* Stats Button */}
          <button
            onClick={onOpenStats}
            className="p-2.5 rounded-xl bg-slate-900/80 text-slate-300 hover:text-cyan-400 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 transition hidden sm:block group"
            title="Statistics"
          >
            <BarChart3 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2.5 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800/90 border border-slate-800 transition"
            title={soundOn ? 'Mute Audio' : 'Enable Audio'}
          >
            {soundOn ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800/90 border border-slate-800 transition"
            title="Settings"
          >
            <Settings className="w-4 h-4 text-slate-400" />
          </button>

          {/* User Auth Avatar / Login CTA */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2.5 ml-1 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 border border-emerald-500/40 text-white text-xs font-semibold shadow-sm hover:border-emerald-400 transition"
          >
            {user && user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName} 
                className="w-6 h-6 rounded-full border border-emerald-400"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center border border-emerald-400">
                <UserIcon className="w-3.5 h-3.5 text-emerald-300" />
              </div>
            )}
            <span className="hidden md:inline max-w-[100px] truncate font-bold text-slate-200">
              {user ? (user.displayName || 'Player') : 'Login'}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
}
