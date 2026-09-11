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
import { DeveloperToolsDialog } from './components/DeveloperToolsDialog';

export default function App() {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeveloperToolsOpen, setIsDeveloperToolsOpen] = useState(false);
  const [requestedTool, setRequestedTool] = useState<string | null>(null);
  const {
    keyboardShortcuts,
    customCommands,
    theme,
    accentColor,
    backgroundMode,
    customBackground,
    reducedMotion,
    fontFamily,
    spacingScale,
    radiusScale,
    animationIntensity,
    enabledWidgets,
    setEnabledWidgets,
  } = useAppStore();

  useEffect(() => {
    const homeOnlyWidgets = ['quickTools', 'workspaces'];
    if (enabledWidgets.some((widgetId) => homeOnlyWidgets.includes(widgetId))) {
      setEnabledWidgets(enabledWidgets.filter((widgetId) => !homeOnlyWidgets.includes(widgetId)));
    }
  }, [enabledWidgets, setEnabledWidgets]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.background = backgroundMode;
    document.documentElement.dataset.reducedMotion = reducedMotion ? 'true' : 'false';
    document.documentElement.dataset.font = fontFamily;
    document.documentElement.dataset.spacing = spacingScale;
    document.documentElement.dataset.radius = radiusScale;
    document.documentElement.dataset.animation = animationIntensity;
    document.documentElement.style.setProperty('--accent-color', accentColor);
    document.documentElement.style.setProperty('--custom-background', customBackground ? `url(${customBackground})` : 'none');
  }, [accentColor, animationIntensity, backgroundMode, customBackground, fontFamily, radiusScale, reducedMotion, spacingScale, theme]);

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
    const handleOpenToolbox = () => {
      setRequestedTool(null);
      setIsDeveloperToolsOpen(true);
    };
    const handleOpenTool = (event: Event) => {
      setRequestedTool((event as CustomEvent<string>).detail);
      setIsDeveloperToolsOpen(true);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('command-center:open-toolbox', handleOpenToolbox);
    window.addEventListener('command-center:open-tool', handleOpenTool);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('command-center:open-toolbox', handleOpenToolbox);
      window.removeEventListener('command-center:open-tool', handleOpenTool);
    };
  }, [customCommands, keyboardShortcuts.focusSearch, keyboardShortcuts.openPalette]);

  return (
    <WidgetProvider>
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <DeveloperToolsDialog isOpen={isDeveloperToolsOpen} initialTool={requestedTool} onClose={() => setIsDeveloperToolsOpen(false)} />
      <OfflineIndicator />
      <DashboardLayout>
        <WidgetGrid />
      </DashboardLayout>
    </WidgetProvider>
  );
}
