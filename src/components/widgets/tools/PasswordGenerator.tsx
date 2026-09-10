import React, { useState } from 'react';

export const PasswordGenerator = () => {
  const [password, setPassword] = useState('');

  const generate = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let res = '';
    for (let i = 0; i < 16; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      <button onClick={generate} className="bg-cyan-800 text-white text-xs py-1 rounded">Generate Password</button>
      <input 
        readOnly
        value={password}
        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-neutral-300"
      />
    </div>
  );
};
