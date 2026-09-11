import { useEffect, useRef } from 'react';
import { X, Wrench } from 'lucide-react';
import { QuickToolsWidget } from './widgets/QuickToolsWidget';

interface DeveloperToolsDialogProps {
  isOpen: boolean;
  initialTool?: string | null;
  onClose: () => void;
}

export const DeveloperToolsDialog = ({ isOpen, initialTool, onClose }: DeveloperToolsDialogProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    panelRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-neutral-950/80 p-4 pt-[8vh] backdrop-blur-md"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="developer-tools-title"
        className="w-full max-w-5xl overflow-hidden rounded-2xl border border-[var(--surface-line)] bg-[var(--surface-strong)] text-[var(--page-ink)] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[var(--surface-line)] px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-400/15 text-amber-300">
              <Wrench className="h-4 w-4" />
            </span>
            <div>
              <h2 id="developer-tools-title" className="text-sm font-semibold">Developer Utilities</h2>
              <p className="command-kicker">Command palette workspace</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close developer utilities" className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--surface-line)] text-[var(--page-muted)] hover:border-amber-300 hover:text-[var(--page-ink)]">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[78vh] overflow-y-auto p-5">
          <QuickToolsWidget initialTool={initialTool} />
        </div>
      </div>
    </div>
  );
};
