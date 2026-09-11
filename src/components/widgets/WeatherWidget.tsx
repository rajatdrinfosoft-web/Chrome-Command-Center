import { Cloud, Sun, CloudRain } from 'lucide-react';
import { useState } from 'react';

export const WeatherWidget = () => {
  const [weather] = useState({ temp: 72, condition: 'Partly Cloudy', location: 'San Francisco, CA' });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <Cloud className="h-4 w-4 text-[var(--widget-accent)]" />
          <span className="command-kicker text-[var(--widget-accent)]">LOCAL WEATHER</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 p-3 rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/40">
         <div className="text-[var(--widget-accent)]">
            {weather.condition.includes('Cloud') ? <Cloud className="h-10 w-10" /> : <Sun className="h-10 w-10" />}
         </div>
         <div className="flex flex-col">
            <span className="text-2xl font-bold text-[var(--page-ink)]">{weather.temp}°F</span>
            <span className="text-xs text-[var(--page-muted)]">{weather.condition}</span>
            <span className="text-[10px] text-[var(--page-muted)] uppercase tracking-wider">{weather.location}</span>
         </div>
      </div>
    </div>
  );
};
