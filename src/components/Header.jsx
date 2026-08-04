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
  const userPhoto = user?.photoURL || (user?.email ? `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}` : null);
  const displayName = user?.displayName ? user.displayName.split(' ')[0] : 'Profile';

  return (
    <header className="w-full border-b border-emerald-500/20 bg-[#0a1020]/90 backdrop-blur-xl px-2.5 sm:px-6 py-2.5 sm:py-3.5 sticky top-0 z-40 transition-all select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0">
          <div className="relative">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-400 via-brand-500 to-cyan-500 flex items-center justify-center shadow-glow-emerald text-white text-xl sm:text-2xl font-black group-hover:scale-105 transition-transform duration-300">
              ♾️
            </div>
            <div className="absolute -inset-0.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-30 blur transition-opacity duration-300" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-1 font-sans">
              Math<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Loop</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] text-emerald-400/80 font-bold tracking-widest uppercase hidden md:flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
              Mental Math Arcade
            </p>
          </div>
        </div>

        {/* Center Stats Bar: Ticket Energy & Brain Coins */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Ticket Energy Pill */}
          <div 
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-xs font-semibold shadow-card-glass hover:border-emerald-400/60 transition cursor-default"
            title={tickets < 5 ? `Next ticket in ${formatTimeRemaining(secondsUntilNext)}` : 'Tickets Full'}
          >
            <div className="relative flex items-center justify-center">
              <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              {tickets > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              )}
            </div>
            <span className="text-emerald-300 font-extrabold font-mono text-xs sm:text-sm">{tickets}<span className="text-slate-500 font-normal">/5</span></span>
            {tickets < 5 && secondsUntilNext > 0 && (
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono hidden lg:inline border-l border-slate-800 pl-2">
                {formatTimeRemaining(secondsUntilNext)}
              </span>
            )}
          </div>

          {/* Brain Coins Pill */}
          <button 
            onClick={onOpenShop}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-inner hover:bg-amber-500/20 hover:border-amber-400/60 transition group"
            title="Open Brain Shop"
          >
            <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="font-mono text-xs sm:text-sm text-amber-200">{coins}</span>
            <span className="text-[9px] bg-amber-500/30 text-amber-300 px-1 py-0.5 rounded uppercase font-extrabold hidden sm:inline">Shop</span>
          </button>
        </div>

        {/* Right Controls & User Profile Button */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Leaderboard Button */}
          <button
            onClick={onOpenLeaderboard}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 text-slate-300 hover:text-amber-400 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 transition group"
            title="Leaderboard"
          >
            <Trophy className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800/90 border border-slate-800 transition"
            title={soundOn ? 'Mute Audio' : 'Enable Audio'}
          >
            {soundOn ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800/90 border border-slate-800 transition hidden xs:block"
            title="Settings"
          >
            <Settings className="w-4 h-4 text-slate-400" />
          </button>

          {/* User Auth / Profile Badge with Visible Photo & Name */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 sm:gap-2.5 ml-0.5 sm:ml-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 border border-emerald-500/40 text-white text-xs font-semibold shadow-glow-emerald hover:border-emerald-400 transition"
            title="User Profile & Settings"
          >
            {userPhoto ? (
              <img 
                src={userPhoto} 
                alt={user?.displayName || 'User Profile'} 
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-emerald-400 object-cover"
              />
            ) : (
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500/30 flex items-center justify-center border border-emerald-400">
                <UserIcon className="w-3.5 h-3.5 text-emerald-300" />
              </div>
            )}
            <span className="font-bold text-slate-200 text-xs max-w-[70px] sm:max-w-[120px] truncate">
              {displayName}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
}
