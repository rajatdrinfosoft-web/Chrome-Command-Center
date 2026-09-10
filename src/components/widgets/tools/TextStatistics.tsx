import React, { useState } from 'react';

export const TextStatistics = () => {
  const [text, setText] = useState('');
  return (
    <div className="flex flex-col gap-2 mt-2">
      <textarea value={text} onChange={e => setText(e.target.value)} className="w-full h-20 bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-neutral-300" placeholder="Paste text..." />
      <div className="text-xs text-neutral-400">Chars: {text.length}, Words: {text.split(/\s+/).filter(Boolean).length}</div>
    </div>
  );
};
