import React, { createContext, useContext } from 'react';
import { useAppStore } from '../stores/appStore';

interface WidgetContextType {
  enabledWidgets: string[];
  setEnabledWidgets: (widgets: string[]) => void;
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

export const WidgetProvider = ({ children }: { children: React.ReactNode }) => {
  const { enabledWidgets, setEnabledWidgets } = useAppStore();

  return (
    <WidgetContext.Provider value={{ enabledWidgets, setEnabledWidgets }}>
      {children}
    </WidgetContext.Provider>
  );
};

export const useWidgetContext = () => {
  const context = useContext(WidgetContext);
  if (!context) throw new Error('useWidgetContext must be used within a WidgetProvider');
  return context;
};
