import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../stores/appStore';

export const PomodoroWidget = () => {
  const {
    focusMode,
    setFocusMode,
    blockedSites,
    addBlockedSite,
    removeBlockedSite,
    startFocusSession,
    endFocusSession,
  } = useAppStore();

  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [sessionLength, setSessionLength] = useState(25);
  const [isActive, setIsActive] = useState(false);
  const [customSite, setCustomSite] = useState('');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
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
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setFocusMode(false);
      endFocusSession(sessionLength);
    }
  }, [timeLeft, isActive, setFocusMode, endFocusSession, sessionLength]);

  const toggleTimer = () => {
    const nextState = !isActive;
    setIsActive(nextState);
    setFocusMode(nextState);

    if (nextState) {
      startFocusSession(sessionLength, blockedSites);
    } else {
      endFocusSession(sessionLength);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setFocusMode(false);
    setTimeLeft(sessionLength * 60);
  };

  const setSession = (minutes: number) => {
    setSessionLength(minutes);
    setTimeLeft(minutes * 60);
    setIsActive(false);
    setFocusMode(false);
  };

  const progress = ((sessionLength * 60 - timeLeft) / (sessionLength * 60)) * 100;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-400">Focus Mode</h2>
        <button
          onClick={() => setFocusMode(!focusMode)}
          className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-widest ${
            focusMode ? 'bg-cyan-500/20 text-cyan-200' : 'bg-neutral-800 text-neutral-300'
          }`}
        >
          {focusMode ? 'On' : 'Off'}
        </button>
      </div>

      <div className="text-3xl font-mono text-white">
        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </div>

      <div className="flex gap-2">
        {[15, 25, 45].map((minutes) => (
          <button
            key={minutes}
            onClick={() => setSession(minutes)}
            className={`rounded px-2 py-1 text-[10px] ${
              sessionLength === minutes ? 'bg-cyan-500 text-black' : 'bg-neutral-800 text-neutral-300'
            }`}
          >
            {minutes}m
          </button>
        ))}
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
        <div
          className="h-full rounded-full bg-cyan-500 transition-all duration-300"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>

      <div className="flex gap-2">
        <button onClick={toggleTimer} className="text-xs bg-neutral-800 px-3 py-1 rounded">
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button onClick={resetTimer} className="text-xs bg-neutral-800 px-3 py-1 rounded">
          Reset
        </button>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-2">
        <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-neutral-500">Blocked sites</p>
        <div className="flex flex-wrap gap-1.5">
          {blockedSites.map((site) => (
            <button
              key={site}
              onClick={() => removeBlockedSite(site)}
              className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-[10px] text-cyan-200"
            >
              {site}
            </button>
          ))}
        </div>

        <div className="mt-2 flex gap-2">
          <input
            value={customSite}
            onChange={(event) => setCustomSite(event.target.value)}
            placeholder="Add site"
            className="flex-1 rounded border border-neutral-800 bg-neutral-950 px-2 py-1 text-[11px] text-white placeholder:text-neutral-500"
          />
          <button
            type="button"
            onClick={() => {
              if (customSite.trim()) {
                addBlockedSite(customSite.trim());
                setCustomSite('');
              }
            }}
            className="rounded bg-cyan-500 px-2 py-1 text-[10px] font-medium text-black"
          >
            Add
          </button>
        </div>
      </div>

      {focusMode && (
        <p className="text-[11px] text-neutral-400">
          Focus mode is active. Keep this tab open and avoid distracting sites during the current session.
        </p>
      )}
    </div>
  );
};
