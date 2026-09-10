import React, { useState } from 'react';

export const JwtDecoder = () => {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<any>(null);

  const decode = () => {
    try {
      const payload = token.split('.')[1];
      setDecoded(JSON.parse(atob(payload)));
    } catch (e) {
      setDecoded('Invalid JWT');
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      <textarea 
        value={token} 
        onChange={(e) => setToken(e.target.value)}
        className="w-full h-20 bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-neutral-300"
        placeholder="Enter JWT..."
      />
      <button onClick={decode} className="bg-cyan-800 text-white text-xs py-1 rounded">Decode</button>
      {decoded && <pre className="text-xs text-neutral-400 bg-neutral-950 p-2 rounded overflow-auto">{JSON.stringify(decoded, null, 2)}</pre>}
    </div>
  );
};
