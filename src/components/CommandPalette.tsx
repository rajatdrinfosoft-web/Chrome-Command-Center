import React, { useState, useEffect } from 'react';

export const CommandPalette = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl p-4">
        <input 
          autoFocus
          placeholder="Type a command..."
          className="w-full bg-transparent text-white text-lg focus:outline-none"
        />
        <button onClick={onClose} className="mt-4 text-xs text-neutral-500">Press Esc to close</button>
      </div>
    </div>
  );
};
