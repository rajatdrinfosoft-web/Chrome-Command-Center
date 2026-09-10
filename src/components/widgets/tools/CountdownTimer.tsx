import React, { useState, useEffect } from 'react';

export const CountdownTimer = () => {
  const [seconds, setSeconds] = useState(60);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (active && seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [active, seconds]);

  return (
    <div className="flex flex-col gap-2 mt-2">
      <input type="number" value={seconds} onChange={e => setSeconds(parseInt(e.target.value))} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-neutral-300" />
      <button onClick={() => setActive(!active)} className="bg-cyan-800 text-white text-xs py-1 rounded">{active ? 'Stop' : 'Start'}</button>
      <div className="text-xs text-neutral-400">{seconds}s left</div>
    </div>
  );
};
