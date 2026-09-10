import React, { useState } from 'react';
import { JsonFormatter } from './tools/JsonFormatter'; // Need to create this
import { Base64Converter } from './tools/Base64Converter';
import { UrlParser } from './tools/UrlParser';

export const QuickToolsWidget = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const tools = [
    { id: 'json', name: 'JSON', component: <JsonFormatter /> },
    { id: 'base64', name: 'Base64', component: <Base64Converter /> },
    { id: 'url', name: 'URL', component: <UrlParser /> },
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
