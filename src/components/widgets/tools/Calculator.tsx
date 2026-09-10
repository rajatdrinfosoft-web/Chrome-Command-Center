import React, { useState } from 'react';

export const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const calculate = () => {
    try {
      setResult(eval(input).toString()); // Simple eval for MVP, note security constraints
    } catch (e) {
      setResult('Error');
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-neutral-300"
        placeholder="Enter expression (e.g. 2+2)..."
      />
      <button onClick={calculate} className="bg-cyan-800 text-white text-xs py-1 rounded">=</button>
      <div className="text-xs text-neutral-400">{result}</div>
    </div>
  );
};
