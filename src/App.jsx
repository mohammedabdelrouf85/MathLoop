import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TicketToast from './components/TicketToast';
import GameCard from './components/GameCard';
import LeaderboardModal from './components/LeaderboardModal';
import ShopModal from './components/ShopModal';
import AuthModal from './components/AuthModal';
import SettingsModal from './components/SettingsModal';
import StatsModal from './components/StatsModal';
import { calculateTicketState } from './services/ticketSystem';
import { subscribeToAuthState, fetchUserData, syncUserData } from './services/firebase';
import { setSoundEnabled } from './services/soundEffects';

export default function App() {
  // User Auth State
  const [user, setUser] = useState(null);

  // User Stats & Economy State
  const [userStats, setUserStats] = useState({
    highScore: 0,
    totalPoints: 0,
    highLevel: 1,
    coins: 50,
    tickets: 5,
    lastRegenTimestamp: Date.now()
  });

  // Ticket Timer state
  const [secondsUntilNext, setSecondsUntilNext] = useState(0);
  const [lastTicketsEarned, setLastTicketsEarned] = useState(0);

  // Audio state
  const [soundOn, setSoundOn] = useState(true);

  // Modals state
  const [modalState, setModalState] = useState({
    leaderboard: false,
    shop: false,
    auth: false,
    settings: false,
    stats: false
  });

  // Subscribe to Auth State
  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (authUser) => {
      setUser(authUser);
      if (authUser) {
        const stats = await fetchUserData(authUser);
        if (stats) {
          setUserStats(stats);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time Ticket Energy Regeneration Loop (15 mins = 1 ticket)
  useEffect(() => {
    const updateTickets = () => {
      setUserStats((prev) => {
        const state = calculateTicketState(
          prev.lastRegenTimestamp,
          prev.tickets
        );

        if (state.ticketsEarned && state.ticketsEarned > 0) {
          setLastTicketsEarned(state.ticketsEarned);
        }

        setSecondsUntilNext(state.secondsUntilNext);

        if (prev.tickets === state.tickets && prev.lastRegenTimestamp === state.lastRegenTimestamp) {
          return prev;
        }

        const next = {
          ...prev,
          tickets: state.tickets,
          lastRegenTimestamp: state.lastRegenTimestamp
        };
        syncUserData(user, next);
        return next;
      });
    };

    updateTickets();
    const interval = setInterval(updateTickets, 1000);
    return () => clearInterval(interval);
  }, [user]);

  // Audio toggle
  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  // Deduct 1 ticket to play
  const handleDeductTicket = () => {
    if (userStats.tickets <= 0) return;
    const nextTickets = userStats.tickets - 1;
    const nextStats = {
      ...userStats,
      tickets: nextTickets,
      lastRegenTimestamp: userStats.tickets === 5 ? Date.now() : userStats.lastRegenTimestamp
    };
    setUserStats(nextStats);
    syncUserData(user, nextStats);
  };

  // Earn/Spend Brain Coins
  const handleEarnCoins = (amount) => {
    setUserStats((prev) => {
      const nextCoins = Math.max(0, prev.coins + amount);
      const nextStats = { ...prev, coins: nextCoins };
      syncUserData(user, nextStats);
      return nextStats;
    });
  };

  // Update Game Score & Level
  const handleUpdateScore = (score, level) => {
    setUserStats((prev) => {
      const nextHighScore = Math.max(prev.highScore, score);
      const nextHighLevel = Math.max(prev.highLevel, level);
      const nextTotalPoints = prev.totalPoints + score;
      const nextStats = {
        ...prev,
        highScore: nextHighScore,
        highLevel: nextHighLevel,
        totalPoints: nextTotalPoints
      };
      syncUserData(user, nextStats);
      return nextStats;
    });
  };

  // Game Over callback
  const handleGameOver = (finalScore, finalLevel) => {
    handleUpdateScore(finalScore, finalLevel);
  };

  const openModal = (name) => setModalState((prev) => ({ ...prev, [name]: true }));
  const closeModal = (name) => setModalState((prev) => ({ ...prev, [name]: false }));

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-100 relative bg-[#070a12] cyber-grid-overlay overflow-x-hidden">
      {/* Dynamic Ambient Background Glowing Blobs (Mobile Optimized) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl opacity-70 animate-float-slow" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl opacity-70 animate-float-slow" style={{ animationDelay: '-3s' }} />
        <div className="absolute -bottom-40 left-1/4 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl opacity-70 animate-float-slow" style={{ animationDelay: '-5s' }} />

        {/* Floating Ambient Math Glyphs */}
        <div className="absolute top-24 left-[10%] text-slate-800/20 text-7xl font-mono select-none font-bold animate-float">∫</div>
        <div className="absolute top-1/2 left-[5%] text-slate-800/20 text-6xl font-mono select-none font-bold animate-float" style={{ animationDelay: '-2s' }}>∑</div>
        <div className="absolute top-1/3 right-[8%] text-slate-800/20 text-8xl font-mono select-none font-bold animate-float" style={{ animationDelay: '-4s' }}>π</div>
        <div className="absolute bottom-24 right-[12%] text-slate-800/20 text-7xl font-mono select-none font-bold animate-float" style={{ animationDelay: '-1s' }}>√</div>
      </div>

      {/* Top Header */}
      <Header
        user={user}
        tickets={userStats.tickets}
        secondsUntilNext={secondsUntilNext}
        coins={userStats.coins}
        highScore={userStats.highScore}
        soundOn={soundOn}
        onToggleSound={handleToggleSound}
        onOpenLeaderboard={() => openModal('leaderboard')}
        onOpenShop={() => openModal('shop')}
        onOpenStats={() => openModal('stats')}
        onOpenAuth={() => openModal('auth')}
        onOpenSettings={() => openModal('settings')}
      />

      {/* Ticket Notifications Toast */}
      <TicketToast
        tickets={userStats.tickets}
        secondsUntilNext={secondsUntilNext}
        lastTicketsEarned={lastTicketsEarned}
      />

      {/* Main Game Interface */}
      <main className="flex-1 flex items-center justify-center py-6 sm:py-10 px-4 relative z-10">
        <GameCard
          tickets={userStats.tickets}
          coins={userStats.coins}
          onDeductTicket={handleDeductTicket}
          onEarnCoins={handleEarnCoins}
          onUpdateScore={handleUpdateScore}
          onGameOver={handleGameOver}
        />
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-xs text-slate-500/80 border-t border-slate-800/40 relative z-10 backdrop-blur-sm bg-slate-950/40">
        <p className="flex items-center justify-center gap-1.5 font-medium">
          <span>MathLoop</span>
          <span className="text-emerald-400 font-mono">♾️</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">Powered by DeepMind Mental Math Engine</span>
        </p>
      </footer>

      {/* Modals */}
      <LeaderboardModal
        isOpen={modalState.leaderboard}
        onClose={() => closeModal('leaderboard')}
        user={user}
        userHighScore={userStats.highScore}
      />

      <ShopModal
        isOpen={modalState.shop}
        onClose={() => closeModal('shop')}
        coins={userStats.coins}
        onEarnCoins={handleEarnCoins}
      />

      <AuthModal
        isOpen={modalState.auth}
        onClose={() => closeModal('auth')}
        user={user}
        onAuthSuccess={(u) => {
          setUser(u);
          if (u) fetchUserData(u).then((st) => st && setUserStats(st));
        }}
      />

      <SettingsModal
        isOpen={modalState.settings}
        onClose={() => closeModal('settings')}
        soundOn={soundOn}
        onToggleSound={handleToggleSound}
      />

      <StatsModal
        isOpen={modalState.stats}
        onClose={() => closeModal('stats')}
        userStats={userStats}
      />
    </div>
  );
}
