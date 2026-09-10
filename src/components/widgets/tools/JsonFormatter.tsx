import React, { useState } from 'react';

export const JsonFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e) {
      setOutput('Invalid JSON');
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      <textarea 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        className="w-full h-24 bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-neutral-300"
        placeholder="Paste JSON..."
      />
      <button onClick={format} className="bg-cyan-800 text-white text-xs py-1 rounded">Format</button>
      <pre className="w-full h-24 bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-neutral-300 overflow-auto">{output}</pre>
    </div>
  );
};
