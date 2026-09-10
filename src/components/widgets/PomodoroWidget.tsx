import { useState, useEffect, useRef } from 'react';

export const PomodoroWidget = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { setIsActive(false); setTimeLeft(25 * 60); };

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-neutral-400">Pomodoro</h2>
      <div className="text-3xl font-mono text-white">
        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </div>
      <div className="flex gap-2">
        <button onClick={toggleTimer} className="text-xs bg-neutral-800 px-3 py-1 rounded">{isActive ? 'Pause' : 'Start'}</button>
        <button onClick={resetTimer} className="text-xs bg-neutral-800 px-3 py-1 rounded">Reset</button>
      </div>
    </div>
  );
};
