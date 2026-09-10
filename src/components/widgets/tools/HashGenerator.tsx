import React, { useState } from 'react';

export const HashGenerator = () => {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');

  const generate = async () => {
    const msgUint8 = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    setHash(hashArray.map(b => b.toString(16).padStart(2, '0')).join(''));
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-neutral-300"
        placeholder="Enter text..."
      />
      <button onClick={generate} className="bg-cyan-800 text-white text-xs py-1 rounded">SHA-256 Hash</button>
      <div className="text-xs text-neutral-400 bg-neutral-950 p-2 rounded overflow-auto break-all">{hash}</div>
    </div>
  );
};
