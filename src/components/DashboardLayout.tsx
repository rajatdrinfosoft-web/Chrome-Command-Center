import React, { useState } from 'react';
import { ClockWidget } from './widgets/ClockWidget';
import { SearchWidget } from './widgets/SearchWidget';
import { useAppStore } from '../stores/appStore';
import { Terminal, Shield, Sparkles, Command, Sliders, Layers, ChevronDown, Pin, PinOff } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { currentWorkspace, workspaces, setCurrentWorkspace, focusMode, keyboardShortcuts } = useAppStore();
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isIdle, setIsIdle] = useState(false);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    const resetIdle = () => {
      setIsIdle(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsIdle(true), 15000);
    };
    
    // Initial setup
    resetIdle();

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      clearTimeout(timeout);
    };
  }, []);

  const isVisible = isPinned || isHovered || !isIdle;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, ' ');
  const switchWorkspace = (workspaceId: string) => {
    setIsHovered(true);
    setCurrentWorkspace(workspaceId);
  };

  return (
    <div className="command-shell min-h-screen overflow-x-hidden px-4 py-3 sm:px-8 sm:py-5" data-page="dashboard">
      <div className="mx-auto flex max-w-[1500px] flex-col relative pt-16 sm:pt-20">
        {/* Auto-Hiding Command Deck Topbar Container */}
        <div 
          className="command-topbar-wrapper group/topbar absolute top-0 left-0 right-0 z-30"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setIsHovered(false);
            }
          }}
        >
          {/* Peek Indicator Handle (visible when auto-hidden to maximize screen space) */}
          <div 
            className={`flex items-center justify-center transition-all duration-300 ${
              isVisible ? 'opacity-0 -translate-y-2 pointer-events-none h-0' : 'opacity-100 translate-y-0 h-6'
            }`}
          >
            <div className="cursor-pointer flex items-center gap-2 rounded-full border border-cyan-500/30 bg-[var(--surface)] px-3.5 py-0.5 text-[10px] font-mono font-semibold tracking-wider text-cyan-400 shadow-[0_0_15px_rgba(40,215,209,0.25)] backdrop-blur-md hover:border-cyan-400 hover:scale-105 transition-all">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>COMMAND DECK</span>
              <ChevronDown className="h-3 w-3 text-cyan-400 animate-bounce" />
            </div>
          </div>

          {/* Sliding Topbar Navigation */}
          <nav 
            className={`command-topbar flex flex-wrap items-center justify-between gap-4 rounded-2xl px-4 py-3 sm:px-6 shadow-2xl border border-[var(--surface-line)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isVisible 
                ? 'translate-y-0 opacity-100 pointer-events-auto scale-100' 
                : '-translate-y-12 opacity-0 pointer-events-none scale-[0.98] h-0 overflow-hidden py-0 border-transparent'
            }`} 
            aria-label="Primary navigation"
          >
            {/* Logo & System Brand */}
            <div className="flex items-center gap-3.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-teal-600 text-sm font-black text-neutral-950 shadow-[0_0_20px_rgba(40,215,209,0.35)] transition-transform hover:scale-105">
                <Terminal className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold tracking-tight text-[var(--page-ink)]">COMMAND CENTER</span>
                  <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider text-cyan-400 border border-cyan-500/30">
                    v2.5 OS
                  </span>
                </div>
                <div className="command-kicker flex items-center gap-2 text-[11px]">
                  <span>Browser Command Deck</span>
                  <span className="text-[var(--surface-line)]">•</span>
                  <span className="text-emerald-400 font-mono">Win/Linux</span>
                </div>
              </div>
            </div>

            {/* Quick Workspace Switcher Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl bg-[var(--surface-strong)]/60 p-1 border border-[var(--surface-line)]">
              <div className="flex items-center gap-1 px-2 text-[10px] uppercase font-bold tracking-widest text-[var(--page-muted)]">
                <Layers className="h-3 w-3 text-cyan-400" />
                <span className="hidden md:inline">Space:</span>
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => switchWorkspace(ws.id)}
                  aria-pressed={currentWorkspace === ws.id}
                  title={`Switch to ${ws.name} workspace`}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    currentWorkspace === ws.id
                      ? 'bg-cyan-500 text-neutral-950 font-bold shadow-[0_0_12px_rgba(40,215,209,0.4)]'
                      : 'text-[var(--page-muted)] hover:text-[var(--page-ink)] hover:bg-[var(--surface-line)]/50'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ws.color || '#28d7d1' }} />
                  <span>{ws.name}</span>
                </button>
              ))}
            </div>

            {/* Quick Status, Telemetry & Pin/Unpin Control */}
            <div className="flex items-center gap-2.5">
              {focusMode && (
                <div className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-300 animate-pulse">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Shield On</span>
                </div>
              )}
              <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--page-muted)] bg-[var(--surface-strong)]/40 px-3 py-1.5 rounded-xl border border-[var(--surface-line)]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] animate-ping" />
                <span className="font-mono text-[11px]">Online</span>
              </div>
              
              <div 
                className="hidden md:flex items-center gap-1.5 text-xs text-[var(--page-muted)] bg-[var(--surface-strong)]/40 px-2.5 py-1.5 rounded-xl border border-[var(--surface-line)] cursor-pointer hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
                title="Open Command Palette"
                onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
              >
                <Command className="h-3.5 w-3.5" />
                <span className="font-mono text-[11px] font-bold uppercase">{keyboardShortcuts.openPalette === 'mod+k' ? 'Ctrl + K' : keyboardShortcuts.openPalette}</span>
              </div>

              {/* Pin/Unpin Button */}
              <button
                type="button"
                onClick={() => setIsPinned(!isPinned)}
                className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all border ${
                  isPinned
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(40,215,209,0.2)]'
                    : 'text-[var(--page-muted)] hover:text-[var(--page-ink)] border-[var(--surface-line)] bg-[var(--surface-strong)]/40'
                }`}
                title={isPinned ? 'Unpin topbar (enable auto-hide)' : 'Pin topbar (keep always visible)'}
              >
                {isPinned ? <Pin className="h-3.5 w-3.5 text-cyan-400 fill-cyan-400" /> : <PinOff className="h-3.5 w-3.5" />}
                <span className="hidden lg:inline text-[11px]">{isPinned ? 'Pinned' : 'Auto-Hide'}</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Hero Section with Digital Clock & Universal Search */}
        <header className="command-reveal command-reveal-delay-1 grid gap-6 py-2 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="command-kicker text-cyan-400">SYSTEM TIME & TELEMETRY</span>
              <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-mono text-cyan-300 border border-cyan-500/20">LIVE</span>
              <span className="command-kicker text-[var(--page-muted)]">LOCAL TIME</span>
              <span className="rounded-full border border-[var(--accent-color)]/20 bg-[var(--accent-color)]/10 px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider text-[var(--accent-color)]">{timezone}</span>
            </div>
            <ClockWidget />
          </div>
          <div className="w-full lg:justify-self-end lg:max-w-2xl">
             <SearchWidget />
          </div>
        </header>

        {/* Dynamic Widget Grid View */}
        <main className="command-reveal command-reveal-delay-2">{children}</main>
      </div>
    </div>
  );
};
