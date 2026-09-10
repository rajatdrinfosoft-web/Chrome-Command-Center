/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DashboardLayout } from './components/DashboardLayout';
import { WidgetGrid } from './components/WidgetGrid';
import { WidgetProvider } from './context/WidgetContext';
import { CommandPalette } from './components/CommandPalette';
import { SettingsModal } from './components/SettingsModal';
import { useState, useEffect } from 'react';

export default function App() {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        setIsPaletteOpen(false);
        setIsSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <WidgetProvider>
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <DashboardLayout>
        <WidgetGrid />
      </DashboardLayout>
    </WidgetProvider>
  );
}
