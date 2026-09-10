import React, { useState } from 'react';

export const TimestampConverter = () => {
  const [input, setInput] = useState(Date.now().toString());
  const [date, setDate] = useState('');

  const convert = () => {
    const timestamp = parseInt(input);
    if (!isNaN(timestamp)) {
      setDate(new Date(timestamp).toLocaleString());
    } else {
      setDate('Invalid timestamp');
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-neutral-300"
        placeholder="Enter timestamp (ms)..."
      />
      <button onClick={convert} className="bg-cyan-800 text-white text-xs py-1 rounded">Convert</button>
      <div className="text-xs text-neutral-400">{date}</div>
    </div>
  );
};
