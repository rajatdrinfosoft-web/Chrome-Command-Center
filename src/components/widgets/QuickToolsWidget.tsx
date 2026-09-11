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
import { RegexTester } from './tools/RegexTester';
import { ColorConverter } from './tools/ColorConverter';
import { CronParser } from './tools/CronParser';
import { Wrench, TerminalSquare, Key, Link, Brackets, Fingerprint, Lock, Clock, Calculator as CalcIcon, RefreshCw, BarChart2, QrCode, Timer, Regex, Palette, CalendarClock } from 'lucide-react';

export const QuickToolsWidget = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const tools = [
    { id: 'json', name: 'JSON', icon: Brackets, component: <JsonFormatter /> },
    { id: 'base64', name: 'Base64', icon: RefreshCw, component: <Base64Converter /> },
    { id: 'url', name: 'URL', icon: Link, component: <UrlParser /> },
    { id: 'jwt', name: 'JWT', icon: Key, component: <JwtDecoder /> },
    { id: 'uuid', name: 'UUID', icon: Fingerprint, component: <UuidGenerator /> },
    { id: 'hash', name: 'Hash', icon: Lock, component: <HashGenerator /> },
    { id: 'time', name: 'Time', icon: Clock, component: <TimestampConverter /> },
    { id: 'calc', name: 'Calc', icon: CalcIcon, component: <Calculator /> },
    { id: 'pass', name: 'Pass', icon: Key, component: <PasswordGenerator /> },
    { id: 'unit', name: 'Unit', icon: RefreshCw, component: <UnitConverter /> },
    { id: 'text', name: 'Stats', icon: BarChart2, component: <TextStatistics /> },
    { id: 'qr', name: 'QR', icon: QrCode, component: <QrGenerator /> },
    { id: 'cdown', name: 'Timer', icon: Timer, component: <CountdownTimer /> },
    { id: 'regex', name: 'Regex', icon: Regex, component: <RegexTester /> },
    { id: 'color', name: 'Color', icon: Palette, component: <ColorConverter /> },
    { id: 'cron', name: 'Cron', icon: CalendarClock, component: <CronParser /> },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Wrench className="h-4 w-4 text-[var(--widget-accent)]" />
        <span className="command-kicker text-[var(--widget-accent)]">DEVELOPER UTILITIES</span>
      </div>

      {!activeTool ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
          {tools.map(tool => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="group flex flex-col items-center justify-center gap-2 rounded-xl bg-[var(--surface-strong)]/40 border border-[var(--surface-line)] p-3 transition-all hover:bg-[var(--widget-accent)]/10 hover:border-[var(--widget-accent)]/30 hover:-translate-y-0.5"
              >
                <Icon className="h-5 w-5 text-[var(--page-muted)] group-hover:text-[var(--widget-accent)] transition-colors" />
                <span className="text-[10px] font-medium text-[var(--page-muted)] group-hover:text-[var(--page-ink)] uppercase tracking-wider">
                  {tool.name}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-3 rounded-xl bg-[var(--surface-strong)]/20 border border-[var(--surface-line)] p-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[var(--surface-line)] pb-2 mb-1">
            <div className="flex items-center gap-2">
              {React.createElement(tools.find(t => t.id === activeTool)?.icon || TerminalSquare, { className: "h-4 w-4 text-[var(--widget-accent)]" })}
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--page-ink)]">
                {tools.find(t => t.id === activeTool)?.name}
              </span>
            </div>
            <button
              onClick={() => setActiveTool(null)}
              className="text-[10px] uppercase font-bold text-[var(--page-muted)] hover:text-rose-400 transition-colors bg-[var(--surface-strong)] px-2 py-1 rounded-md"
            >
              CLOSE
            </button>
          </div>
          <div className="pt-1">
            {tools.find(t => t.id === activeTool)?.component}
          </div>
        </div>
      )}
    </div>
  );
};
