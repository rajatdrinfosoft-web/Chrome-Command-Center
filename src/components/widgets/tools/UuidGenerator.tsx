import React, { useState } from 'react';

export const UuidGenerator = () => {
  const [uuid, setUuid] = useState('');

  return (
    <div className="flex flex-col gap-2 mt-2">
      <button onClick={() => setUuid(crypto.randomUUID())} className="bg-cyan-800 text-white text-xs py-1 rounded">Generate UUID</button>
      <input 
        readOnly
        value={uuid}
        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-neutral-300"
      />
    </div>
  );
};
