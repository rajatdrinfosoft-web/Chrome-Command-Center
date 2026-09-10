import React from 'react';

export const SettingsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Settings</h2>
        <div className="space-y-4">
          <p className="text-sm text-neutral-400">Settings implementation in progress...</p>
        </div>
        <button onClick={onClose} className="mt-6 text-xs text-neutral-500 hover:text-white">Close</button>
      </div>
    </div>
  );
};
