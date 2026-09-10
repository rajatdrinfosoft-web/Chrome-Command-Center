import React, { useState } from 'react';
import { JsonFormatter } from './tools/JsonFormatter';
import { Base64Converter } from './tools/Base64Converter';
import { UrlParser } from './tools/UrlParser';
import { JwtDecoder } from './tools/JwtDecoder';
import { UuidGenerator } from './tools/UuidGenerator';
import { HashGenerator } from './tools/HashGenerator';
import { TimestampConverter } from './tools/TimestampConverter';
import { Calculator } from './tools/Calculator';
import { PasswordGenerator } from './tools/PasswordGenerator';
import { UnitConverter } from './tools/UnitConverter';
import { TextStatistics } from './tools/TextStatistics';
import { QrGenerator } from './tools/QrGenerator';
import { CountdownTimer } from './tools/CountdownTimer';

export const QuickToolsWidget = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const tools = [
    { id: 'json', name: 'JSON', component: <JsonFormatter /> },
    { id: 'base64', name: 'Base64', component: <Base64Converter /> },
    { id: 'url', name: 'URL', component: <UrlParser /> },
    { id: 'jwt', name: 'JWT', component: <JwtDecoder /> },
    { id: 'uuid', name: 'UUID', component: <UuidGenerator /> },
    { id: 'hash', name: 'Hash', component: <HashGenerator /> },
    { id: 'time', name: 'Time', component: <TimestampConverter /> },
    { id: 'calc', name: 'Calc', component: <Calculator /> },
    { id: 'pass', name: 'Pass', component: <PasswordGenerator /> },
    { id: 'unit', name: 'Unit', component: <UnitConverter /> },
    { id: 'text', name: 'Stats', component: <TextStatistics /> },
    { id: 'qr', name: 'QR', component: <QrGenerator /> },
    { id: 'cdown', name: 'Timer', component: <CountdownTimer /> },
  ];

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-neutral-400">Quick Tools</h2>
      <div className="flex flex-wrap gap-2">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
            className={`px-3 py-1 rounded-full text-xs transition ${
              activeTool === tool.id ? 'bg-cyan-900 text-cyan-200' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
            }`}
          >
            {tool.name}
          </button>
        ))}
      </div>
      {activeTool && tools.find(t => t.id === activeTool)?.component}
    </div>
  );
};
