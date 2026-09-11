import { useState, useEffect } from 'react';
import { SessionHeatmapProvider, SessionData } from '../../providers/SessionHeatmapProvider';
import { Activity } from 'lucide-react';

export const SessionHeatmapWidget = () => {
  const [data, setData] = useState<SessionData[]>([]);

  useEffect(() => {
    SessionHeatmapProvider.getData().then(setData);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[var(--widget-accent)]" />
          <span className="command-kicker text-[var(--widget-accent)]">ACTIVITY HEATMAP</span>
        </div>
      </div>
      <div className="flex items-end gap-1 h-24 mt-1 bg-[var(--surface-strong)]/20 p-3 rounded-xl border border-[var(--surface-line)]">
        {data.map(d => (
          <div 
            key={d.hour} 
            className="flex-1 bg-[var(--widget-accent)] rounded-sm hover:opacity-100 transition-opacity"
            style={{ 
              height: `${Math.max(10, d.activityLevel)}%`,
              opacity: Math.max(0.2, d.activityLevel / 100)
            }}
            title={`Hour ${d.hour}: ${Math.round(d.activityLevel)}%`}
          />
        ))}
      </div>
      <div className="flex justify-between text-[9px] text-[var(--page-muted)] uppercase tracking-wider font-bold px-1">
        <span>00:00</span>
        <span>12:00</span>
        <span>23:00</span>
      </div>
    </div>
  );
};
