import React from 'react';
import { ClockWidget } from './widgets/ClockWidget';
import { SearchWidget } from './widgets/SearchWidget';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="command-shell min-h-screen overflow-hidden px-4 py-4 sm:px-8 sm:py-6" data-page="dashboard">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 relative">
        <nav className="command-topbar command-reveal flex items-center justify-between rounded-2xl px-4 py-3 sm:px-5" aria-label="Primary navigation">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent-color)] text-sm font-black text-[#071014]">CC</span>
            <div>
              <div className="text-sm font-bold tracking-tight text-[var(--page-ink)]">Command Center</div>
              <div className="command-kicker">Personal browser OS</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-xs text-[var(--page-muted)] sm:flex">
            <span className="h-2 w-2 rounded-full bg-[var(--accent-lime)] shadow-[0_0_12px_var(--accent-lime)]" />
            Local workspace active
          </div>
        </nav>

        <header className="command-reveal command-reveal-delay-1 grid gap-7 py-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:py-10">
          <div className="flex flex-col gap-4">
            <div className="command-kicker text-[var(--accent-coral)]">Good to see you</div>
            <ClockWidget />
          </div>
          <div className="w-full lg:justify-self-end lg:max-w-2xl">
             <SearchWidget />
          </div>
        </header>

        <main className="command-reveal command-reveal-delay-2">{children}</main>
      </div>
    </div>
  );
};
