import { useState, useEffect } from 'react';
import { Clock as ClockIcon, Globe } from 'lucide-react';

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

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div 
          onClick={() => setIs24Hour(!is24Hour)}
          className="cursor-pointer group flex items-baseline gap-1 select-none font-mono"
          title="Click to toggle 12h/24h format"
        >
          <span className="text-5xl sm:text-7xl font-bold tracking-tight text-[var(--page-ink)] drop-shadow-[0_0_25px_rgba(40,215,209,0.2)]">
            {formattedHours}:{formattedMinutes}
          </span>
          <span className="text-2xl sm:text-3xl font-semibold text-cyan-400 font-mono ml-1">
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
        <span className="font-medium text-[var(--page-ink)]">
          {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <span className="text-[var(--surface-line)]">•</span>
        <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-400/80 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
          <Globe className="h-3 w-3" />
          {timezone}
        </span>
      </div>
    </div>
  );
};
