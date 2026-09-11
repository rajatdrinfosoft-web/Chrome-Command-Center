import { Settings2, ShieldCheck, Cpu } from 'lucide-react';
import { useState, useEffect } from 'react';

export const ExtensionInfoWidget = () => {
  const [version, setVersion] = useState('0.0.0');
  
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.runtime && (chrome.runtime as any).getManifest) {
      setVersion((chrome.runtime as any).getManifest().version || '1.0.0-ext');
    } else {
      setVersion('1.0.0-dev');
    }
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-[var(--widget-accent)]" />
          <span className="command-kicker text-[var(--widget-accent)]">SYSTEM INFO</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
         <div className="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/30 p-3 flex flex-col gap-1">
            <Cpu className="h-4 w-4 text-[var(--page-muted)] mb-1" />
            <span className="text-[10px] uppercase font-bold text-[var(--page-muted)]">Version</span>
            <span className="text-sm font-medium text-[var(--page-ink)]">v{version}</span>
         </div>
         <div className="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/30 p-3 flex flex-col gap-1">
            <ShieldCheck className="h-4 w-4 text-[var(--page-muted)] mb-1" />
            <span className="text-[10px] uppercase font-bold text-[var(--page-muted)]">Permissions</span>
            <span className="text-sm font-medium text-emerald-400">Granted</span>
         </div>
      </div>
    </div>
  );
};
