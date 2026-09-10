import { useState, useEffect } from 'react';
import { HistoryProvider, HistoryItem } from '../../providers/HistoryProvider';

export const HistoryWidget = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    HistoryProvider.getData().then(setHistory);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-neutral-400">History</h2>
      <ul className="space-y-1">
        {history.map(h => (
          <li key={h.id} className="text-sm text-neutral-300">
            {h.title}
          </li>
        ))}
      </ul>
    </div>
  );
};
