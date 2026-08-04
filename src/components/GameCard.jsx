import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Flame, 
  Clock, 
  Sparkles, 
  Lightbulb, 
  PlusCircle, 
  Snowflake, 
  SkipForward, 
  Play, 
  RotateCcw, 
  Ticket, 
  Coins,
  CheckCircle,
  XCircle,
  Keyboard,
  Grid,
  Trophy,
  Brain
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateQuestion, calculateScore } from '../services/mathEngine';
import { 
  playCorrectSound, 
  playWrongSound, 
  playClickSound, 
  playFireModeSound, 
  playPowerupSound, 
  playTickSound 
} from '../services/soundEffects';

const TIMER_DURATION = 30; // 30 seconds per question

export default function GameCard({
  tickets,
  coins,
  onDeductTicket,
  onEarnCoins,
  onUpdateScore,
  onGameOver
}) {
  // Game states
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [isFireMode, setIsFireMode] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [adaptiveFactor, setAdaptiveFactor] = useState(1.0);

  // Active Question
  const [question, setQuestion] = useState(null);
  const [disabledChoices, setDisabledChoices] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [inputMode, setInputMode] = useState('choice'); // 'choice' or 'keypad'

  // Timer states
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const [isFrozen, setIsFrozen] = useState(false);

  // Feedback states
  const [feedback, setFeedback] = useState(null); // { type: 'correct' | 'wrong', points: number }
  const [softFail, setSoftFail] = useState(false);

  // Question start timestamp for fast answer calculation
  const questionStartTimeRef = useRef(Date.now());

  // Trigger confetti burst safely
  const triggerConfetti = useCallback(() => {
    try {
      const isMobile = window.innerWidth < 768;
      confetti({
        particleCount: isMobile ? 25 : 65,
        spread: isMobile ? 50 : 80,
        origin: { y: 0.6 },
        disableForReducedMotion: true,
        colors: ['#00ffaa', '#10b981', '#06b6d4', '#8b5cf6', '#ffffff']
      });
    } catch (e) {
      // Ignore confetti errors on low-end mobile devices
    }
  }, []);

  // Start new round
  const startNewGame = () => {
    if (tickets <= 0) return;
    onDeductTicket();
    setLevel(1);
    setStreak(0);
    setIsFireMode(false);
    setCurrentScore(0);
    setAdaptiveFactor(1.0);
    setSoftFail(false);
    setIsPlaying(true);
    loadNextQuestion(1, 0, 1.0);
  };

  // Load next question
  const loadNextQuestion = (nextLevel, currentStreak, adaptive) => {
    const q = generateQuestion(nextLevel, currentStreak, adaptive);
    setQuestion(q);
    setDisabledChoices([]);
    setUserInput('');
    setTimeRemaining(TIMER_DURATION);
    setIsFrozen(false);
    setFeedback(null);
    questionStartTimeRef.current = Date.now();
  };

  // Timer Effect
  useEffect(() => {
    if (!isPlaying || softFail || isFrozen || !question) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }

        // Sound tick warning under 5 seconds
        if (prev <= 5) {
          playTickSound();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, softFail, isFrozen, question]);

  // Handle Time Out
  const handleTimeOut = () => {
    playWrongSound();
    setStreak(0);
    setIsFireMode(false);
    setAdaptiveFactor((prev) => Math.max(0.7, prev - 0.1));
    setSoftFail(true);
  };

  // Handle Answer Submission
  const handleAnswer = (selectedVal) => {
    if (!isPlaying || softFail || !question) return;

    // Bulletproof precision match for choices vs correct answer
    const valNum = Math.round(Number(selectedVal));
    const ansNum = Math.round(Number(question.answer));
    const isCorrect = valNum === ansNum || Math.abs(Number(selectedVal) - Number(question.answer)) < 0.01;
    const timeTaken = (Date.now() - questionStartTimeRef.current) / 1000;

    if (isCorrect) {
      playCorrectSound();

      // Streak logic
      const newStreak = streak + 1;
      setStreak(newStreak);

      // Fire mode logic (5 fast correct answers in a row)
      if (newStreak >= 5 && !isFireMode) {
        setIsFireMode(true);
        playFireModeSound();
        triggerConfetti();
      }

      // Calculate score
      const { totalPoints } = calculateScore(question.difficultyScore, timeRemaining, isFireMode);
      const newScore = currentScore + totalPoints;
      setCurrentScore(newScore);
      onUpdateScore(newScore, level);

      // Award coin every 3 questions or Fire Mode
      if (newStreak % 3 === 0 || isFireMode) {
        onEarnCoins(5);
      }

      // Adaptive difficulty ramp up
      if (timeTaken < 4) {
        setAdaptiveFactor((prev) => Math.min(2.5, prev + 0.08));
      }

      // Set positive feedback
      setFeedback({ type: 'correct', points: totalPoints });

      // Level milestone check
      const nextLevel = level + 1;
      setLevel(nextLevel);

      if (nextLevel % 5 === 0) {
        triggerConfetti();
      }

      setTimeout(() => {
        loadNextQuestion(nextLevel, newStreak, adaptiveFactor);
      }, 450);

    } else {
      playWrongSound();
      setStreak(0);
      setIsFireMode(false);
      setAdaptiveFactor((prev) => Math.max(0.7, prev - 0.15));
      setFeedback({ type: 'wrong', points: 0 });
      setSoftFail(true);
    }
  };

  // Keyboard shortcut listener (1,2,3,4 for choice mode, or keypad numbers)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlaying || softFail || !question) return;

      if (inputMode === 'choice') {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const choiceIndex = parseInt(e.key, 10) - 1;
          if (question.choices[choiceIndex] !== undefined) {
            const selectedChoice = question.choices[choiceIndex];
            if (!disabledChoices.includes(selectedChoice)) {
              playClickSound();
              handleAnswer(selectedChoice);
            }
          }
        }
      } else if (inputMode === 'keypad') {
        if (e.key >= '0' && e.key <= '9') {
          setUserInput((prev) => (prev.length < 5 ? prev + e.key : prev));
        } else if (e.key === 'Backspace') {
          setUserInput((prev) => prev.slice(0, -1));
        } else if (e.key === 'Enter' && userInput !== '') {
          handleAnswer(userInput);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, softFail, userInput, question, inputMode, disabledChoices]);

  // Power-up 1: Hint
  const handleUseHint = () => {
    if (!question || disabledChoices.length > 0) return;
    if (coins < 15) return;
    onEarnCoins(-15);
    playPowerupSound();

    const wrongChoices = question.choices.filter((c) => c !== question.answer);
    setDisabledChoices(wrongChoices.slice(0, 2));
  };

  // Power-up 2: Add 10s
  const handleAddTime = () => {
    if (coins < 20) return;
    onEarnCoins(-20);
    playPowerupSound();
    setTimeRemaining((prev) => prev + 10);
  };

  // Power-up 3: Freeze Timer
  const handleFreezeTimer = () => {
    if (coins < 25 || isFrozen) return;
    onEarnCoins(-25);
    playPowerupSound();
    setIsFrozen(true);
    setTimeout(() => setIsFrozen(false), 10000);
  };

  // Power-up 4: Skip Question
  const handleSkipQuestion = () => {
    if (coins < 30) return;
    onEarnCoins(-30);
    playPowerupSound();
    loadNextQuestion(level + 1, streak, adaptiveFactor);
  };

  // Soft Fail: Try Again using 1 ticket
  const handleTryAgainWithTicket = () => {
    if (tickets <= 0) return;
    onDeductTicket();
    setSoftFail(false);
    loadNextQuestion(level, streak, adaptiveFactor);
  };

  // Give Up & Quit to Start Menu
  const handleQuitGame = () => {
    setIsPlaying(false);
    setSoftFail(false);
    onGameOver(currentScore, level);
  };

  // Timer Bar Color Logic
  const timerRatio = timeRemaining / TIMER_DURATION;
  let timerBarColor = 'bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-glow-emerald';
  if (timerRatio < 0.25) {
    timerBarColor = 'bg-gradient-to-r from-rose-500 to-amber-500 animate-pulse shadow-glow-neon';
  } else if (timerRatio < 0.5) {
    timerBarColor = 'bg-gradient-to-r from-amber-400 to-emerald-400';
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* 1. START GAME HERO CARD */}
      {!isPlaying && (
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="glass-panel rounded-3xl p-8 sm:p-12 text-center border border-emerald-500/30 relative overflow-hidden shadow-2xl backdrop-blur-2xl"
        >
          {/* Glowing background ambient gradient */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Hero Icon Badge */}
          <div className="inline-flex p-5 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-brand-500/10 to-cyan-500/20 border border-emerald-500/40 text-emerald-400 mb-6 shadow-glow-emerald animate-float relative group">
            <Zap className="w-12 h-12 text-emerald-300 drop-shadow-md group-hover:scale-110 transition-transform" />
            <Sparkles className="w-5 h-5 text-cyan-300 absolute -top-1 -right-1 animate-pulse" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3 font-sans">
            Ready to Train Your Brain?
          </h2>
          <p className="text-slate-300/90 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
            Solve infinite adaptive mental math equations under time pressure. Chain streaks to unlock <span className="text-emerald-400 font-bold">Hyperdrive Fire Mode</span> and climb the global ranks!
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8 text-xs font-semibold text-slate-300">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center gap-1.5">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span>30s Pressure</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center gap-1.5">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>Fire Streaks</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center gap-1.5">
              <Coins className="w-5 h-5 text-cyan-400" />
              <span>Brain Economy</span>
            </div>
          </div>

          {/* Start CTA Button */}
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <button
              onClick={startNewGame}
              disabled={tickets <= 0}
              className={`w-full py-4 px-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 transform active:scale-95 shadow-xl relative overflow-hidden group ${
                tickets > 0
                  ? 'bg-gradient-to-r from-emerald-400 via-brand-500 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 shadow-glow-neon'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              {/* Shimmer Light Bar */}
              {tickets > 0 && (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
              )}
              <Play className="w-6 h-6 fill-current" />
              <span>START GAME (1 🎟️)</span>
            </button>

            {tickets <= 0 && (
              <p className="text-xs text-rose-400 font-semibold animate-pulse mt-2">
                Out of tickets! Energy regenerates 1 ticket every 15 minutes.
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* 2. ACTIVE GAMEPLAY ARENA */}
      {isPlaying && question && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`glass-panel rounded-3xl p-4 sm:p-8 border relative overflow-hidden transition-all duration-300 shadow-2xl ${
            isFireMode ? 'fire-mode-glow bg-[#080f20]/95' : 'border-emerald-500/30'
          }`}
        >
          {/* HYPERDRIVE FIRE MODE BANNER */}
          {isFireMode && (
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-4 py-1.5 px-3 sm:py-2 sm:px-4 rounded-full bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400 text-slate-950 font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-glow-neon animate-fire-pulse"
            >
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-slate-950" />
              <span>🔥 HYPERDRIVE FIRE MODE (2X MULTIPLIER) 🔥</span>
            </motion.div>
          )}

          {/* GAMEPLAY METRICS BAR */}
          <div className="flex items-center justify-between gap-2 mb-4 text-xs font-bold">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-1 sm:gap-1.5 shadow-sm text-[11px] sm:text-xs">
                <Brain className="w-3.5 h-3.5 text-emerald-400" />
                Lvl {level}
              </span>
              {streak > 1 && (
                <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 flex items-center gap-1 sm:gap-1.5 shadow-sm text-[11px] sm:text-xs">
                  <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  {streak} Streak
                </span>
              )}
            </div>

            <div className="text-right">
              <span className="text-slate-400 uppercase tracking-widest text-[9px] sm:text-[10px] block font-semibold">Score</span>
              <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">{currentScore}</div>
            </div>
          </div>

          {/* TIMER BAR & COUNTDOWN */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5 sm:mb-2">
              <span className="flex items-center gap-1.5 text-slate-300 text-[11px] sm:text-xs">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                {isFrozen ? '❄️ FROZEN' : 'TIME'}
              </span>
              <span className={`font-mono text-sm sm:text-base font-bold ${timeRemaining <= 5 ? 'text-rose-400 animate-pulse' : 'text-slate-200'}`}>
                {timeRemaining}s
              </span>
            </div>
            <div className="w-full h-3 sm:h-3.5 bg-slate-900/90 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: `${timerRatio * 100}%` }}
                transition={{ ease: 'linear', duration: 0.4 }}
                className={`h-full rounded-full ${timerBarColor}`}
              />
            </div>
          </div>

          {/* MAIN EQUATION CARD */}
          <div className="my-4 sm:my-6 py-6 sm:py-9 px-3 sm:px-4 rounded-3xl bg-slate-950/80 border border-emerald-500/25 text-center relative shadow-inner group">
            <div className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-emerald-400/80 mb-2 sm:mb-3 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {question.type === 'blitz' && '🔥 SPEED BLITZ MULTI-OP'}
                {question.type === 'exponents' && '⚡ EXPONENTS & SQUARE ROOTS'}
                {question.type === 'percent' && '📊 PERCENTAGES'}
                {question.type === 'algebra' && '🔤 ALGEBRAIC EQUATION'}
                {question.type === 'div' && '➗ DIVISION'}
                {question.type === 'mul' && '✖️ MULTIPLICATION'}
                {question.type === 'sub' && '➖ SUBTRACTION'}
                {question.type === 'add' && '➕ ADDITION'}
              </span>
            </div>
            <div className="text-3xl sm:text-5xl font-black font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-white to-cyan-300 drop-shadow-md flex items-center justify-center gap-2 select-none">
              <span dangerouslySetInnerHTML={{ __html: question.promptText }} />
              {!question.promptText.includes('=') && <span>= ?</span>}
            </div>

            {/* Input display in Keypad Mode */}
            {inputMode === 'keypad' && (
              <div className="mt-5 inline-block min-w-[140px] px-5 py-2.5 rounded-2xl bg-slate-900 border border-emerald-500/40 text-3xl font-mono font-bold text-emerald-300 shadow-glow-emerald">
                {userInput || <span className="opacity-25">__</span>}
              </div>
            )}
          </div>

          {/* INPUT MODE TOGGLE */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                playClickSound();
                setInputMode(inputMode === 'choice' ? 'keypad' : 'choice');
              }}
              className="text-xs text-slate-400 hover:text-emerald-300 flex items-center gap-1.5 transition px-2.5 py-1 rounded-lg hover:bg-slate-800/60 focus:outline-none focus:ring-0"
            >
              {inputMode === 'choice' ? (
                <>
                  <Keyboard className="w-3.5 h-3.5 text-emerald-400" /> Switch to Keypad Mode
                </>
              ) : (
                <>
                  <Grid className="w-3.5 h-3.5 text-emerald-400" /> Switch to Choices (1,2,3,4)
                </>
              )}
            </button>
          </div>

          {/* ANSWER CHOICES GRID WITH KEYBOARD SHORTCUT BADGES */}
          {inputMode === 'choice' ? (
            <div className="grid grid-cols-2 gap-3.5 mb-6">
              {question.choices.map((choice, idx) => {
                const isDisabled = disabledChoices.includes(choice);
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                    whileTap={{ scale: isDisabled ? 1 : 0.96 }}
                    disabled={isDisabled}
                    onClick={() => {
                      playClickSound();
                      handleAnswer(choice);
                    }}
                    className={`py-4 px-4 rounded-2xl font-mono text-2xl font-black transition-all border shadow-lg relative group focus:outline-none focus:ring-0 active:outline-none select-none ${
                      isDisabled
                        ? 'bg-slate-900/30 text-slate-700 border-slate-800/40 cursor-not-allowed line-through'
                        : isFireMode
                        ? 'bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-200 border-emerald-500/40 hover:border-emerald-400 shadow-glow-emerald'
                        : 'bg-slate-900/80 hover:bg-emerald-950/60 text-white border-slate-800 hover:border-emerald-500/50 hover:shadow-glow-emerald'
                    }`}
                  >
                    {/* Keybinding Badge [1], [2], [3], [4] */}
                    <span className="absolute top-2 left-2.5 px-1.5 py-0.5 rounded-md bg-slate-800/80 text-[10px] font-sans font-bold text-slate-400 border border-slate-700/60 group-hover:text-emerald-300 group-hover:border-emerald-500/40">
                      [{idx + 1}]
                    </span>
                    {choice}
                  </motion.button>
                );
              })}
            </div>
          ) : (
            /* ON-SCREEN NUMBER PAD */
            <div className="mb-6 max-w-xs mx-auto">
              <div className="grid grid-cols-3 gap-2 mb-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      playClickSound();
                      setUserInput((prev) => (prev.length < 5 ? prev + num : prev));
                    }}
                    className="py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xl border border-slate-800 active:bg-emerald-600 transition shadow-sm focus:outline-none focus:ring-0"
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    playClickSound();
                    setUserInput((prev) => prev.slice(0, -1));
                  }}
                  className="py-3 rounded-xl bg-slate-900 hover:bg-rose-900/30 text-rose-300 font-bold text-sm border border-slate-800 transition focus:outline-none focus:ring-0"
                >
                  ⌫
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    setUserInput((prev) => (prev.length < 5 ? prev + '0' : prev));
                  }}
                  className="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xl border border-slate-800 transition focus:outline-none focus:ring-0"
                >
                  0
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    if (userInput !== '') handleAnswer(userInput);
                  }}
                  className="py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-bold text-sm shadow-glow-emerald transition focus:outline-none focus:ring-0"
                >
                  ↵ OK
                </button>
              </div>
            </div>
          )}

          {/* POWER-UPS TOOLBAR */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
            {/* Hint */}
            <button
              onClick={handleUseHint}
              disabled={disabledChoices.length > 0 || coins < 15}
              className="flex-1 py-2.5 px-2 rounded-2xl bg-slate-900/70 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 text-slate-300 flex flex-col items-center gap-0.5 transition disabled:opacity-35 disabled:cursor-not-allowed group focus:outline-none focus:ring-0"
              title="Eliminates 2 incorrect choices (15 🪙)"
            >
              <Lightbulb className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-semibold">Hint</span>
              <span className="text-[10px] text-amber-300 font-bold font-mono">15 🪙</span>
            </button>

            {/* +10s */}
            <button
              onClick={handleAddTime}
              disabled={coins < 20}
              className="flex-1 py-2.5 px-2 rounded-2xl bg-slate-900/70 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/40 text-slate-300 flex flex-col items-center gap-0.5 transition disabled:opacity-35 disabled:cursor-not-allowed group focus:outline-none focus:ring-0"
              title="Adds 10 seconds to clock (20 🪙)"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-semibold">+10s</span>
              <span className="text-[10px] text-amber-300 font-bold font-mono">20 🪙</span>
            </button>

            {/* Freeze */}
            <button
              onClick={handleFreezeTimer}
              disabled={coins < 25 || isFrozen}
              className="flex-1 py-2.5 px-2 rounded-2xl bg-slate-900/70 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/40 text-slate-300 flex flex-col items-center gap-0.5 transition disabled:opacity-35 disabled:cursor-not-allowed group focus:outline-none focus:ring-0"
              title="Freezes timer countdown for 10s (25 🪙)"
            >
              <Snowflake className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-semibold">Freeze</span>
              <span className="text-[10px] text-amber-300 font-bold font-mono">25 🪙</span>
            </button>

            {/* Skip */}
            <button
              onClick={handleSkipQuestion}
              disabled={coins < 50}
              className="flex-1 py-2.5 px-2 rounded-2xl bg-slate-900/70 hover:bg-purple-500/10 border border-slate-800 hover:border-purple-500/40 text-slate-300 flex flex-col items-center gap-0.5 transition disabled:opacity-35 disabled:cursor-not-allowed group focus:outline-none focus:ring-0"
              title="Skip question safely without losing streak (50 🪙)"
            >
              <SkipForward className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-semibold">Skip</span>
              <span className="text-[10px] text-amber-300 font-bold font-mono">50 🪙</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* 3. SOFT FAIL / ROUND END OVERLAY MODAL */}
      <AnimatePresence>
        {softFail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-rose-500/30 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto mb-4 flex items-center justify-center shadow-inner">
                <XCircle className="w-9 h-9" />
              </div>

              <h3 className="text-2xl font-black text-white mb-1 tracking-tight font-sans">
                Round Ended!
              </h3>
              <p className="text-slate-300 text-xs mb-4">
                Correct Answer: <span className="text-emerald-400 font-bold font-mono text-sm border-b border-emerald-400/40 pb-0.5">{question?.answer}</span>
              </p>

              {/* Stats Breakdown */}
              <div className="py-3 px-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6 text-xs flex items-center justify-between">
                <div className="text-left">
                  <span className="text-slate-400 block font-medium">Reached Level</span>
                  <span className="text-white font-bold text-sm">{level}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block font-medium">Current Score</span>
                  <span className="text-emerald-400 font-bold text-sm font-mono">{currentScore}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleTryAgainWithTicket}
                  disabled={tickets <= 0}
                  className={`w-full py-3.5 px-4 rounded-2xl font-extrabold flex items-center justify-center gap-2.5 transition shadow-lg ${
                    tickets > 0
                      ? 'bg-gradient-to-r from-emerald-400 via-brand-500 to-cyan-500 text-slate-950 shadow-glow-emerald hover:opacity-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Ticket className="w-4 h-4" />
                  <span>Resume Game (1 🎟️ left: {tickets}/5)</span>
                </button>

                <button
                  onClick={handleQuitGame}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 transition"
                >
                  Save & Exit to Main Menu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
