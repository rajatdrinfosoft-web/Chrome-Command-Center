import { useState, useEffect } from 'react';

export const ClockWidget = () => {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const formattedHours = is24Hour 
    ? hours.toString().padStart(2, '0') 
    : (hours % 12 || 12).toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div 
          onClick={() => setIs24Hour(!is24Hour)}
          className="cursor-pointer group flex items-baseline gap-1 select-none font-mono"
          title="Click to toggle 12h/24h format"
        >
          <span className="text-5xl sm:text-7xl font-bold tracking-tight text-[var(--page-ink)] drop-shadow-[0_0_25px_rgba(var(--widget-accent-rgb),0.2)]">
            {formattedHours}:{formattedMinutes}
          </span>
          <span className="text-2xl sm:text-3xl font-semibold text-[var(--widget-accent)] font-mono ml-1">
            :{formattedSeconds}
          </span>
          {!is24Hour && (
            <span className="text-xs sm:text-sm font-bold text-amber-400 ml-1.5 uppercase tracking-wider">
              {period}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--page-muted)]">
        <span className="font-medium text-[var(--page-ink)] text-sm">
          {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
    </div>
  );
};
