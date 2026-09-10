import React, { useState } from 'react';

export const Base64Converter = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const convert = () => {
    try {
      if (mode === 'encode') setInput(btoa(input));
      else setInput(atob(input));
    } catch (e) {
      setInput('Invalid input');
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      <div className="flex gap-2">
        <button onClick={() => setMode('encode')} className={`text-xs px-2 py-1 rounded ${mode === 'encode' ? 'bg-cyan-900' : 'bg-neutral-800'}`}>Encode</button>
        <button onClick={() => setMode('decode')} className={`text-xs px-2 py-1 rounded ${mode === 'decode' ? 'bg-cyan-900' : 'bg-neutral-800'}`}>Decode</button>
      </div>
      <textarea 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        className="w-full h-20 bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-neutral-300"
        placeholder="Enter text..."
      />
      <button onClick={convert} className="bg-cyan-800 text-white text-xs py-1 rounded">Convert</button>
    </div>
  );
};
