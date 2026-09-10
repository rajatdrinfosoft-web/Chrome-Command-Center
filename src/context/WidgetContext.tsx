import React, { createContext, useContext, useState } from 'react';

interface WidgetContextType {
  enabledWidgets: string[];
  setEnabledWidgets: (widgets: string[]) => void;
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

export const WidgetProvider = ({ children }: { children: React.ReactNode }) => {
  const [enabledWidgets, setEnabledWidgets] = useState(['clock', 'search']);

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
