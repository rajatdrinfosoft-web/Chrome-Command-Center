import { useState, useEffect } from 'react';
import { SessionHeatmapProvider, SessionData } from '../../providers/SessionHeatmapProvider';

export const SessionHeatmapWidget = () => {
  const [data, setData] = useState<SessionData[]>([]);

  useEffect(() => {
    SessionHeatmapProvider.getData().then(setData);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-neutral-400">Session Heatmap</h2>
      <div className="flex items-end gap-1 h-24">
        {data.map(d => (
          <div 
            key={d.hour} 
            className="flex-1 bg-neutral-700 rounded-t"
            style={{ height: `${d.activityLevel}%` }}
            title={`Hour ${d.hour}: ${Math.round(d.activityLevel)}%`}
          />
        ))}
      </div>
    </div>
  );
};
