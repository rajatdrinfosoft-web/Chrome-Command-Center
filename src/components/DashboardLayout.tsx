import React from 'react';
import { ClockWidget } from './widgets/ClockWidget';
import { SearchWidget } from './widgets/SearchWidget';
import { useWidgetContext } from '../context/WidgetContext';
import { WIDGET_REGISTRY } from '../lib/widgetRegistry';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 p-8 selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none animate-pulse" />
      <div className="max-w-7xl mx-auto flex flex-col gap-12 relative">
        {/* Header/Hero Zone */}
        <header className="flex flex-col items-center gap-6 pt-16 pb-8">
          <div className="flex flex-col items-center gap-2">
            <ClockWidget />
            <div className="text-cyan-400 font-medium tracking-wider text-sm uppercase">Command Center</div>
          </div>
          <div className="w-full max-w-xl">
             <SearchWidget />
          </div>
        </header>

        {/* Dynamic Widget Zones */}
        {children}
      </div>
    </div>
  );
};
