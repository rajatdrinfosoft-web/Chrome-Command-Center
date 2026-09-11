import React, { useState } from 'react';

export const CronParser = () => {
  const [cron, setCron] = useState('* * * * *');

  const parseCron = (expression: string) => {
    const parts = expression.trim().split(/\s+/);
    if (parts.length < 5) return 'Incomplete expression (needs 5 parts)';
    if (parts.length > 5) return 'Too many parts (expected 5)';
    
    // Very basic descriptive logic for demo purposes
    return `Runs at minute ${parts[0]}, hour ${parts[1]}, day ${parts[2]} of the month, month ${parts[3]}, day ${parts[4]} of the week`;
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={cron}
        onChange={(e) => setCron(e.target.value)}
        placeholder="* * * * *"
        className="w-full bg-[var(--surface-strong)] border border-[var(--surface-line)] rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-[var(--widget-accent)]/50"
      />
      <div className="bg-[var(--surface-strong)]/30 border border-[var(--surface-line)] rounded px-2 py-2 text-[11px] text-[var(--page-muted)]">
        {parseCron(cron)}
      </div>
    </div>
  );
};
