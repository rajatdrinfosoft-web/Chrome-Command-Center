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
import { useAppStore } from './stores/appStore';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { keyboardShortcuts, customCommands, theme, accentColor, backgroundMode, customBackground, reducedMotion } = useAppStore();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.background = backgroundMode;
    document.documentElement.dataset.reducedMotion = reducedMotion ? 'true' : 'false';
    document.documentElement.style.setProperty('--accent-color', accentColor);
    document.documentElement.style.setProperty('--custom-background', customBackground ? `url(${customBackground})` : 'none');
  }, [accentColor, backgroundMode, customBackground, reducedMotion, theme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const shortcut = keyboardShortcuts.openPalette;
      const palettePressed = shortcut === 'mod+k'
        ? (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
        : e.key.toLowerCase() === shortcut;
      if (palettePressed) {
        e.preventDefault();
        setIsPaletteOpen(true);
      }
      const searchPressed = keyboardShortcuts.focusSearch === 'mod+k'
        ? (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
        : !e.metaKey && !e.ctrlKey && !e.altKey && e.key.toLowerCase() === keyboardShortcuts.focusSearch;
      if (searchPressed && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement)) {
        e.preventDefault();
        window.dispatchEvent(new Event('command-center:focus-search'));
      }
      const customCommand = customCommands.find((command) => {
        if (command.shortcut === 'mod+k') return (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
        return !e.metaKey && !e.ctrlKey && !e.altKey && e.key.toLowerCase() === command.shortcut;
      });
      if (customCommand && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement)) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('command-center:run-action', { detail: customCommand.action }));
      }
      if (e.key === 'Escape') {
        setIsPaletteOpen(false);
        setIsSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [customCommands, keyboardShortcuts.focusSearch, keyboardShortcuts.openPalette]);

  return (
    <WidgetProvider>
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <OfflineIndicator />
      <DashboardLayout>
        <WidgetGrid />
      </DashboardLayout>
    </WidgetProvider>
  );
}
