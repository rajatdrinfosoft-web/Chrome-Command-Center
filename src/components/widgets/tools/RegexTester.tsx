import React, { useState } from 'react';

export const RegexTester = () => {
  const [regex, setRegex] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');

  let matchResult: RegExpMatchArray | null = null;
  let error = '';

  try {
    if (regex) {
      const re = new RegExp(regex, flags);
      matchResult = testString.match(re);
    }
  } catch (err: any) {
    error = err.message;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={regex}
          onChange={(e) => setRegex(e.target.value)}
          placeholder="Regular Expression (e.g., ^[a-z]+)"
          className="flex-1 bg-[var(--surface-strong)] border border-[var(--surface-line)] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[var(--widget-accent)]/50"
        />
        <input
          type="text"
          value={flags}
          onChange={(e) => setFlags(e.target.value)}
          placeholder="Flags (e.g., g, i, m)"
          className="w-16 bg-[var(--surface-strong)] border border-[var(--surface-line)] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[var(--widget-accent)]/50"
        />
      </div>
      <textarea
        value={testString}
        onChange={(e) => setTestString(e.target.value)}
        placeholder="Test string..."
        className="h-20 bg-[var(--surface-strong)] border border-[var(--surface-line)] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[var(--widget-accent)]/50 custom-scrollbar"
      />
      <div className="min-h-[2.5rem] bg-[var(--surface-strong)]/30 border border-[var(--surface-line)] rounded px-2 py-1.5 text-xs text-[var(--page-muted)]">
        {error ? (
          <span className="text-rose-400">{error}</span>
        ) : matchResult ? (
          <div>
            <span className="text-emerald-400 font-bold">{matchResult.length} Match(es)</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {matchResult.map((m, i) => (
                <span key={i} className="bg-[var(--widget-accent)]/10 text-[var(--widget-accent)] px-1 rounded">{m}</span>
              ))}
            </div>
          </div>
        ) : regex ? (
          <span>No matches</span>
        ) : (
          <span>Enter regex to test</span>
        )}
      </div>
    </div>
  );
};
