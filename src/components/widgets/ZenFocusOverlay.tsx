import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X, Shield, Coffee, Sparkles, Maximize2, Minimize2, Bell, Headphones, Volume2, VolumeX } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { playNotificationChime } from '../../lib/audioNotifier';
import { ambientAudio } from '../../lib/audio/ambientGenerator';

interface ZenFocusOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  timeLeft: number;
  sessionLength: number;
  isActive: boolean;
  isBreak: boolean;
  breakTimeLeft: number;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onStartBreak: () => void;
  focusGoal: string;
  setFocusGoal: (goal: string) => void;
}

export const ZenFocusOverlay = ({
  isOpen,
  onClose,
  timeLeft,
  sessionLength,
  isActive,
  isBreak,
  breakTimeLeft,
  onToggleTimer,
  onResetTimer,
  onStartBreak,
  focusGoal,
  setFocusGoal,
}: ZenFocusOverlayProps) => {
  const { blockedSites, focusSessions } = useAppStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [ambientType, setAmbientType] = useState(ambientAudio.getType());

  useEffect(() => {
    return () => {
      // Ensure we stop audio when the overlay closes/unmounts
      ambientAudio.stop();
    };
  }, []);

  const toggleAmbientSound = () => {
    if (isAmbientPlaying) {
      ambientAudio.stop();
      setIsAmbientPlaying(false);
    } else {
      ambientAudio.play();
      setIsAmbientPlaying(true);
    }
  };

  const displayTime = isBreak ? breakTimeLeft : timeLeft;
  const totalSeconds = isBreak ? 5 * 60 : sessionLength * 60;
  const progress = Math.min(100, Math.max(0, ((totalSeconds - displayTime) / totalSeconds) * 100));

  const minutes = Math.floor(displayTime / 60);
  const seconds = displayTime % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const completedCount = focusSessions.length;
  const totalFocusMin = focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const resistanceScore = completedCount > 0 ? Math.min(98, 85 + completedCount * 2) : 100;

  const toggleFullscreenMode = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-neutral-950/95 p-6 text-white backdrop-blur-2xl selection:bg-cyan-500/30 selection:text-cyan-200"
      >
        {/* Glowing Background Pulse */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          isActive ? 'opacity-40' : 'opacity-10'
        } bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-600/30 via-violet-900/10 to-transparent animate-pulse`} />

        {/* Top Controls Bar */}
        <div className="relative z-10 flex w-full max-w-4xl items-center justify-between border-b border-neutral-800/60 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h1 className="text-sm font-semibold tracking-wider uppercase text-neutral-200">Zen Focus Space</h1>
              <p className="text-xs text-neutral-400">Minimal Distraction-Free Environment</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`flex items-center rounded-xl border transition-all ${
              isAmbientPlaying
                ? 'bg-cyan-500/20 border-cyan-500/50'
                : 'bg-neutral-900/80 border-neutral-800'
            }`}>
              <button
                type="button"
                onClick={toggleAmbientSound}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors ${
                  isAmbientPlaying ? 'text-cyan-200' : 'text-neutral-300 hover:text-white'
                }`}
                title="Toggle Ambient Focus Noise"
              >
                {isAmbientPlaying ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">Ambient Focus</span>
              </button>
              
              <div className="h-4 w-[1px] bg-neutral-700 mx-1" />
              
              <select
                className={`appearance-none bg-transparent py-1.5 px-2 pr-3 text-xs outline-none cursor-pointer transition-colors ${
                  isAmbientPlaying ? 'text-cyan-200' : 'text-neutral-400 hover:text-neutral-300'
                }`}
                value={ambientType}
                onChange={(e) => {
                  const type = e.target.value as any;
                  ambientAudio.setType(type);
                  setAmbientType(type);
                }}
                title="Select Ambient Sound"
              >
                <option value="deep_focus" className="bg-neutral-900 text-neutral-200">Deep Focus (Brown Noise)</option>
                <option value="rain" className="bg-neutral-900 text-neutral-200">Heavy Rain</option>
                <option value="ocean" className="bg-neutral-900 text-neutral-200">Ocean Waves</option>
                <option value="bowl" className="bg-neutral-900 text-neutral-200">Zen Singing Bowl</option>
              </select>
            </div>

            <button
              type="button"
              onClick={toggleFullscreenMode}
              className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-1.5 text-xs text-neutral-300 hover:border-cyan-500/40 hover:text-white transition-all"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                ambientAudio.stop();
                setIsAmbientPlaying(false);
                onClose();
              }}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:border-red-500/40 hover:text-white transition-all"
              aria-label="Close Zen Mode"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Center Main Focal Ring & Controls */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto max-w-md w-full text-center">
          {/* Target Focus Goal Input */}
          <div className="mb-8 w-full">
            <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Current Focus Task</label>
            <input
              type="text"
              value={focusGoal}
              onChange={(e) => setFocusGoal(e.target.value)}
              placeholder="What are you focusing on right now?"
              className="w-full text-center bg-neutral-900/60 border border-neutral-800 rounded-2xl py-3 px-4 text-sm text-cyan-200 placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50 transition-all shadow-inner"
            />
          </div>

          {/* Animated Circular Progress Canvas */}
          <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-neutral-800/80 bg-neutral-900/40 shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-md my-4">
            {/* SVG Ring Progress */}
            <svg className="absolute inset-0 h-full w-full -rotate-90">
              <circle
                cx="144"
                cy="144"
                r="130"
                stroke="currentColor"
                strokeWidth="6"
                className="text-neutral-800/60"
                fill="transparent"
              />
              <motion.circle
                cx="144"
                cy="144"
                r="130"
                stroke="currentColor"
                strokeWidth="6"
                strokeDasharray={816}
                strokeDashoffset={816 - (816 * progress) / 100}
                strokeLinecap="round"
                className={isBreak ? 'text-emerald-400' : 'text-cyan-400'}
                fill="transparent"
                initial={{ strokeDashoffset: 816 }}
                animate={{ strokeDashoffset: 816 - (816 * progress) / 100 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </svg>

            {/* Glowing Inner Core */}
            <div className="flex flex-col items-center justify-center z-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-1">
                {isBreak ? '☕ Rest & Recharge' : isActive ? '⚡ Focus Mode Active' : '⏸ Session Paused'}
              </span>
              <span className="text-6xl font-mono font-bold tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                {formattedTime}
              </span>
              <span className="text-xs text-neutral-400 mt-2 font-medium">
                {isBreak ? '5 min short break' : `${sessionLength} min goal`}
              </span>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="flex items-center gap-4 mt-6">
            <button
              type="button"
              onClick={onToggleTimer}
              className={`flex items-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-semibold shadow-lg transition-all transform active:scale-95 ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 shadow-amber-500/10'
                  : 'bg-cyan-500 text-neutral-950 hover:bg-cyan-400 shadow-cyan-500/20 font-bold'
              }`}
            >
              {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
              <span>{isActive ? 'Pause Session' : 'Start Focus'}</span>
            </button>

            <button
              type="button"
              onClick={onResetTimer}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:border-neutral-700 hover:text-white transition-all active:scale-95"
              title="Reset Timer"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {!isBreak && (
              <button
                type="button"
                onClick={onStartBreak}
                className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all active:scale-95"
                title="Start 5m Break"
              >
                <Coffee className="h-4 w-4" />
                <span>Take Break</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Distraction Shield & Summary Banner */}
        <div className="relative z-10 grid w-full max-w-4xl grid-cols-1 sm:grid-cols-3 gap-3 border-t border-neutral-800/60 pt-4 text-xs">
          <div className="flex items-center gap-3 rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-3">
            <Shield className="h-5 w-5 text-cyan-400 shrink-0" />
            <div>
              <div className="font-semibold text-neutral-200">Distraction Shield</div>
              <div className="text-neutral-400 text-[11px]">{blockedSites.length} websites blocked automatically</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-3">
            <Sparkles className="h-5 w-5 text-violet-400 shrink-0" />
            <div>
              <div className="font-semibold text-neutral-200">Distraction Resistance</div>
              <div className="text-neutral-400 text-[11px]">{resistanceScore}% Focus Score ({completedCount} sessions)</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-3">
            <Bell className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <div className="font-semibold text-neutral-200">Break Reminders</div>
              <div className="text-neutral-400 text-[11px]">{totalFocusMin} min focused today · Audio chimes enabled</div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
