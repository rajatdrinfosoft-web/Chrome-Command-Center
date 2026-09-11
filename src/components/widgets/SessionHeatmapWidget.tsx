import { useState, useEffect } from 'react';
import { SessionHeatmapProvider, SessionData } from '../../providers/SessionHeatmapProvider';
import { Activity } from 'lucide-react';

export const SessionHeatmapWidget = () => {
  const [data, setData] = useState<SessionData[]>([]);

  useEffect(() => {
    SessionHeatmapProvider.getData().then(setData);
  }, []);

  const maxActivity = Math.max(...data.map((d) => d.activityLevel), 1);
  const peakHour = data.reduce(
    (best, current) => (current.activityLevel > best.activityLevel ? current : best),
    data[0] ?? { hour: 0, activityLevel: 0 }
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[var(--widget-accent)]" />
          <span className="command-kicker text-[var(--widget-accent)]">ACTIVE HOURS</span>
        </div>
        <span className="rounded-full border border-[var(--widget-accent)]/20 bg-[var(--widget-accent)]/10 px-2 py-0.5 text-[9px] font-mono text-[var(--widget-accent)]">
          Peak {peakHour.hour.toString().padStart(2, '0')}:00
        </span>
      </div>

      <div className="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/20 p-3">
        <div className="flex h-28 items-end gap-1.5">
          {data.map((d) => {
            const height = Math.max(12, (d.activityLevel / maxActivity) * 100);
            return (
              <div key={d.hour} className="flex flex-1 flex-col items-center justify-end gap-1.5">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-cyan-500 via-sky-400 to-emerald-300 shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all duration-300"
                  style={{
                    height: `${height}%`,
                    opacity: Math.max(0.35, d.activityLevel / 100),
                  }}
                  title={`Hour ${d.hour}: ${Math.round(d.activityLevel)}% activity`}
                />
                <span className="text-[8px] font-mono text-[var(--page-muted)]">
                  {d.hour % 6 === 0 ? `${String(d.hour).padStart(2, '0')}` : ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between text-[9px] text-[var(--page-muted)] uppercase tracking-wider font-bold px-1">
        <span>00</span>
        <span>06</span>
        <span>12</span>
        <span>18</span>
        <span>23</span>
      </div>
    </div>
  );
};
