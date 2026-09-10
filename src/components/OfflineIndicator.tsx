import { useEffect, useState } from 'react';

export const OfflineIndicator = () => {
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (online) return null;
  return <div className="fixed bottom-4 left-4 z-40 rounded-full border border-amber-500/30 bg-neutral-950 px-3 py-1 text-xs text-amber-200">Offline mode</div>;
};
