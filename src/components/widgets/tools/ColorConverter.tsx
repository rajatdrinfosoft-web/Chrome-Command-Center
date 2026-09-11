import React, { useState } from 'react';

export const ColorConverter = () => {
  const [color, setColor] = useState('#28D7D1');

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '';
  };

  const hexToHsl = (hex: string) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt("0x" + hex[1] + hex[1]);
      g = parseInt("0x" + hex[2] + hex[2]);
      b = parseInt("0x" + hex[3] + hex[3]);
    } else if (hex.length === 7) {
      r = parseInt("0x" + hex[1] + hex[2]);
      g = parseInt("0x" + hex[3] + hex[4]);
      b = parseInt("0x" + hex[5] + hex[6]);
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
        />
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="flex-1 bg-[var(--surface-strong)] border border-[var(--surface-line)] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[var(--widget-accent)]/50"
        />
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-[var(--surface-strong)]/30 border border-[var(--surface-line)] rounded p-2 flex flex-col items-center justify-center">
          <span className="text-[10px] text-[var(--page-muted)] uppercase tracking-wider mb-1">RGB</span>
          <span className="font-mono text-[var(--page-ink)]">{hexToRgb(color) || '—'}</span>
        </div>
        <div className="bg-[var(--surface-strong)]/30 border border-[var(--surface-line)] rounded p-2 flex flex-col items-center justify-center">
          <span className="text-[10px] text-[var(--page-muted)] uppercase tracking-wider mb-1">HSL</span>
          <span className="font-mono text-[var(--page-ink)]">{hexToHsl(color) || '—'}</span>
        </div>
      </div>
    </div>
  );
};
