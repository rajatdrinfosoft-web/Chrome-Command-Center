import React, { useState } from 'react';

export const UnitConverter = () => {
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');

  return (
    <div className="flex flex-col gap-2 mt-2">
      <input value={value} onChange={e => setValue(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-neutral-300" placeholder="Value..." />
      <button onClick={() => setResult((parseFloat(value) * 0.621371).toFixed(2) + ' miles')} className="bg-cyan-800 text-white text-xs py-1 rounded">km to miles</button>
      <div className="text-xs text-neutral-400">{result}</div>
    </div>
  );
};
