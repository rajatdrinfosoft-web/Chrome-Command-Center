import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Maximize2, Coffee, Shield, Sparkles, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { ZenFocusOverlay } from './ZenFocusOverlay';
import { playNotificationChime } from '../../lib/audioNotifier';

export const PomodoroWidget = () => {
  const {
    focusMode,
    setFocusMode,
    blockedSites,
    addBlockedSite,
    removeBlockedSite,
    startFocusSession,
    endFocusSession,
    focusSessions,
  } = useAppStore();

  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  // Break State
  const [isBreak, setIsBreak] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(5 * 60);

  // Focus Goal
  const [focusGoal, setFocusGoal] = useState('');
  const [customSite, setCustomSite] = useState('');

  // Zen Mode Overlay State
  const [isZenOpen, setIsZenOpen] = useState(false);

  // Notification Banner
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'break' | 'info' } | null>(null);

  const timerRef = useRef<number | null>(null);

  // Timer Ticking Logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        if (isBreak) {
          setBreakTimeLeft((prev) => {
            if (prev <= 1) {
              // Break finished
              setIsActive(false);
              setIsBreak(false);
              playNotificationChime('completion');
              setNotification({ message: '☕ Break completed! Ready to start another focus session?', type: 'info' });
              return 0;
            }
            return prev - 1;
          });
        } else {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              // Session finished!
              setIsActive(false);
              setFocusMode(false);
              endFocusSession(sessionLength);
              playNotificationChime('completion');
              setNotification({
                message: `🎉 Focus session complete (${sessionLength}m)! Take a 5-minute break now.`,
                type: 'success',
              });
              // Auto-prepare break
              setIsBreak(true);
              setBreakTimeLeft(5 * 60);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, isBreak, sessionLength, setFocusMode, endFocusSession]);

  const toggleTimer = () => {
    const nextState = !isActive;
    setIsActive(nextState);

    if (!isBreak) {
      setFocusMode(nextState);
      if (nextState) {
        playNotificationChime('start');
        startFocusSession(sessionLength, blockedSites);
        setNotification({ message: `⚡ Focus mode active (${sessionLength}m). ${blockedSites.length} sites blocked.`, type: 'info' });
      } else {
        endFocusSession(sessionLength);
      }
    } else if (nextState) {
      playNotificationChime('break');
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setFocusMode(false);
    setTimeLeft(sessionLength * 60);
    setBreakTimeLeft(5 * 60);
    setNotification(null);
  };

  const setSession = (minutes: number) => {
    setSessionLength(minutes);
    setTimeLeft(minutes * 60);
    setIsBreak(false);
    setIsActive(false);
    setFocusMode(false);
    setNotification(null);
  };

  const startBreakMode = () => {
    setIsBreak(true);
    setBreakTimeLeft(5 * 60);
    setIsActive(true);
    setFocusMode(false);
    playNotificationChime('break');
    setNotification({ message: '☕ 5-minute break started! Step away and refresh.', type: 'break' });
  };

  // Calculations for summaries
  const currentDisplayTime = isBreak ? breakTimeLeft : timeLeft;
  const currentTotalSeconds = isBreak ? 5 * 60 : sessionLength * 60;
  const progress = Math.min(100, Math.max(0, ((currentTotalSeconds - currentDisplayTime) / currentTotalSeconds) * 100));

  const minutes = Math.floor(currentDisplayTime / 60);
  const seconds = currentDisplayTime % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const completedSessions = focusSessions.length;
  const totalFocusMinutes = focusSessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const resistanceScore = completedSessions > 0 ? Math.min(98, 85 + completedSessions * 2) : 100;

  return (
    <div className="flex flex-col gap-4">
      {/* Header & Mode Toggles */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--widget-accent)]" />
          <span className="command-kicker text-[var(--widget-accent)]">FOCUS & POMODORO</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsZenOpen(true)}
            className="flex items-center gap-1 rounded-lg border border-[var(--surface-line)] bg-[var(--surface-strong)] px-2 py-1 text-[11px] font-medium text-[var(--page-muted)] hover:border-[var(--widget-accent)]/40 hover:text-[var(--page-ink)] transition-all"
            title="Open Zen Fullscreen Mode"
          >
            <Maximize2 className="h-3 w-3 text-[var(--widget-accent)]" />
            <span>Zen Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setFocusMode(!focusMode)}
            className={`rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-all border ${
              focusMode
                ? 'bg-[var(--widget-accent)]/20 text-[var(--widget-accent)] border-[var(--widget-accent)]/30'
                : 'bg-[var(--surface-strong)]/80 text-[var(--page-muted)] border-[var(--surface-line)] hover:text-[var(--page-ink)]'
            }`}
          >
            {focusMode ? 'Shield On' : 'Shield Off'}
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`flex items-center justify-between gap-2 rounded-xl p-2.5 text-xs font-medium border ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              : notification.type === 'break'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
              : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : notification.type === 'break' ? (
              <Coffee className="h-4 w-4 shrink-0 text-amber-400" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-cyan-400" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-[10px] opacity-60 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Timer Section with Circular Visual Progress */}
      <div className="relative flex flex-col items-center justify-center rounded-2xl border border-neutral-800/80 bg-neutral-950/60 p-4 shadow-inner">
        <div className="flex items-center justify-between w-full mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            {isBreak ? '☕ Short Break' : isActive ? '⚡ Focus Session' : '⏱ Timer Setup'}
          </span>
          <span className="text-[10px] text-neutral-400 font-mono">
            Goal: {isBreak ? '5 min' : `${sessionLength} min`}
          </span>
        </div>

        {/* Big Digit Timer Display */}
        <div className="my-1 text-4xl font-mono font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
          {formattedTime}
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-900 my-2">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isBreak ? 'bg-emerald-400' : 'bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Preset Session Selector */}
        <div className="flex items-center gap-1.5 mt-2 w-full justify-center">
          {[15, 25, 45, 60].map((mins) => (
            <button
              key={mins}
              type="button"
              onClick={() => setSession(mins)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                sessionLength === mins && !isBreak
                  ? 'bg-cyan-500 text-neutral-950 font-bold shadow-sm'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 mt-4 w-full">
          <button
            type="button"
            onClick={toggleTimer}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold shadow-md transition-all ${
              isActive
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                : 'bg-cyan-500 text-neutral-950 hover:bg-cyan-400 font-bold'
            }`}
          >
            {isActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
            <span>{isActive ? 'Pause' : isBreak ? 'Start Break' : 'Start Focus'}</span>
          </button>

          <button
            type="button"
            onClick={resetTimer}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-700 transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {!isBreak && (
            <button
              type="button"
              onClick={startBreakMode}
              className="flex items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 transition-all"
              title="Take a 5 minute break"
            >
              <Coffee className="h-3.5 w-3.5" />
              <span>Break</span>
            </button>
          )}
        </div>
      </div>

      {/* Productive Hours & Distraction Resistance Summary Cards */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-2.5">
          <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
            <Shield className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Focus Resistance</span>
          </div>
          <div className="text-lg font-semibold text-white">{resistanceScore}%</div>
          <p className="text-[10px] text-neutral-500">{completedSessions} completed sessions</p>
        </div>

        <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-2.5">
          <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
            <Clock className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Productive Time</span>
          </div>
          <div className="text-lg font-semibold text-white">{totalFocusMinutes}m</div>
          <p className="text-[10px] text-neutral-500">Logged focus today</p>
        </div>
      </div>

      {/* Site Blocker Rules */}
      <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-2.5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">Site Blocker Shield</p>
          <span className="text-[10px] text-cyan-400">{blockedSites.length} Active Rules</span>
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
          {blockedSites.map((site) => (
            <button
              key={site}
              type="button"
              onClick={() => removeBlockedSite(site)}
              className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-200 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-200 transition-all"
              title="Click to remove rule"
            >
              {site} ×
            </button>
          ))}
        </div>

        <div className="mt-2 flex gap-1.5">
          <input
            type="text"
            value={customSite}
            onChange={(event) => setCustomSite(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customSite.trim()) {
                addBlockedSite(customSite.trim());
                setCustomSite('');
              }
            }}
            placeholder="Block website (e.g. reddit.com)..."
            className="flex-1 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-[11px] text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
          />
          <button
            type="button"
            onClick={() => {
              if (customSite.trim()) {
                addBlockedSite(customSite.trim());
                setCustomSite('');
              }
            }}
            className="rounded-lg bg-cyan-500 px-3 py-1 text-[11px] font-semibold text-neutral-950 hover:bg-cyan-400 transition-all"
          >
            Add Rule
          </button>
        </div>
      </div>

      {/* Zen Focus Overlay */}
      <ZenFocusOverlay
        isOpen={isZenOpen}
        onClose={() => setIsZenOpen(false)}
        timeLeft={timeLeft}
        sessionLength={sessionLength}
        isActive={isActive}
        isBreak={isBreak}
        breakTimeLeft={breakTimeLeft}
        onToggleTimer={toggleTimer}
        onResetTimer={resetTimer}
        onStartBreak={startBreakMode}
        focusGoal={focusGoal}
        setFocusGoal={setFocusGoal}
      />
    </div>
  );
};
