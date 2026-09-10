import { useState, useEffect } from 'react';

export const ClockWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="command-kicker">Local time</div>
      <div className="text-5xl font-semibold tracking-[-0.06em] text-[var(--page-ink)] sm:text-7xl">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-sm text-[var(--page-muted)]">
        {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
};
