import React, { useState } from 'react';

export const UrlParser = () => {
  const [url, setUrl] = useState('');
  const [parsed, setParsed] = useState<any>(null);

  const parse = () => {
    try {
      const u = new URL(url);
      setParsed({
        host: u.host,
        path: u.pathname,
        params: Object.fromEntries(u.searchParams.entries()),
      });
    } catch (e) {
      setParsed('Invalid URL');
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      <input 
        value={url} 
        onChange={(e) => setUrl(e.target.value)}
        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-neutral-300"
        placeholder="Enter URL..."
      />
      <button onClick={parse} className="bg-cyan-800 text-white text-xs py-1 rounded">Parse</button>
      {parsed && <pre className="text-xs text-neutral-400 bg-neutral-950 p-2 rounded overflow-auto">{JSON.stringify(parsed, null, 2)}</pre>}
    </div>
  );
};
