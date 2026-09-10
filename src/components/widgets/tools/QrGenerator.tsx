import React, { useState } from 'react';

export const QrGenerator = () => {
  const [text, setText] = useState('');
  return (
    <div className="flex flex-col gap-2 mt-2">
      <input value={text} onChange={e => setText(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-neutral-300" placeholder="Content..." />
      <div className="text-xs text-neutral-400">QR Code placeholder for: {text}</div>
    </div>
  );
};
