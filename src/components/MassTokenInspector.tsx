import React, { useState } from 'react';
import {
  MASS_COLOR_TOKENS,
  MASS_TYPOGRAPHY_SCALE,
  MASS_SPACING_SCALE,
  MASS_RADIUS_TOKENS,
  MASS_SHADOW_TOKENS,
  MASS_MOTION_TOKENS,
} from '../data/tokens';
import { Check, Copy, ShieldCheck, Download, Code2, Sliders, Eye, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Relative luminance & contrast ratio calculation per W3C WCAG 2.2 specifications
function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function calculateContrast(fgHex: string, bgHex: string): number {
  const lum1 = getLuminance(fgHex);
  const lum2 = getLuminance(bgHex);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
}

export const MassTokenInspector: React.FC = () => {
  const { mode, isDay, toggleMode, setMode, palette } = useTheme();
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing' | 'motion' | 'contrast'>('colors');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  // Contrast pairs to audit for active mode
  const contrastPairs = isDay
    ? [
        { fg: palette.textPrimary, bg: palette.surfaceBase, label: 'color.text.primary on color.surface.base (Main body & headings)' },
        { fg: palette.textPrimary, bg: palette.surfaceMuted, label: 'color.text.primary on color.surface.muted (Card titles)' },
        { fg: palette.textPrimary, bg: palette.surfaceStrong, label: 'color.text.primary on color.surface.strong (Dialogs & panels)' },
        { fg: palette.textSecondary, bg: palette.surfaceBase, label: 'color.text.secondary on color.surface.base (Subtitles & metadata)' },
        { fg: palette.textSecondary, bg: palette.surfaceMuted, label: 'color.text.secondary on color.surface.muted (Card footnotes)' },
        { fg: palette.surfaceRaised, bg: palette.surfaceBase, label: 'color.surface.raised (Cobalt Blue) on color.surface.base (Accent icons)' },
        { fg: '#ffffff', bg: palette.surfaceRaised, label: 'white text on color.surface.raised (Primary button text)' },
        { fg: palette.textTertiary, bg: palette.surfaceBase, label: 'color.text.tertiary on color.surface.base (Disabled indicators & captions)' },
      ]
    : [
        { fg: palette.textPrimary, bg: palette.surfaceBase, label: 'color.text.primary on color.surface.base (Main body & headings)' },
        { fg: palette.textPrimary, bg: palette.surfaceMuted, label: 'color.text.primary on color.surface.muted (Card titles)' },
        { fg: palette.textPrimary, bg: palette.surfaceStrong, label: 'color.text.primary on color.surface.strong (Workbench & dialogs)' },
        { fg: palette.textSecondary, bg: palette.surfaceBase, label: 'color.text.secondary on color.surface.base (Subtitles & metadata)' },
        { fg: palette.textSecondary, bg: palette.surfaceMuted, label: 'color.text.secondary on color.surface.muted (Card footnotes)' },
        { fg: palette.surfaceRaised, bg: palette.surfaceBase, label: 'color.surface.raised (Ember Orange) on color.surface.base (Accent icons)' },
        { fg: '#000000', bg: palette.surfaceRaised, label: 'color.surface.base on color.surface.raised (Primary button text)' },
        { fg: palette.textTertiary, bg: palette.surfaceBase, label: 'color.text.tertiary on color.surface.base (Disabled indicators - Non-text)' },
      ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[var(--color-border-subtle)] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10.56px] text-[var(--color-text-secondary)] uppercase tracking-widest mb-2 font-mono">
            <span>MassLabs Token Architecture</span>
            <span>·</span>
            <span>Production Specification</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            Design Token Inspector & WCAG Auditor
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)] text-sm max-w-2xl leading-relaxed">
            Strict token-driven UI governance for masslabs-archi.com. All components consume verified semantic tokens rather than arbitrary raw CSS values.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Theme Palette Mode Selector */}
          <div className="bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] p-1 rounded-[2px] flex items-center gap-1 font-mono text-xs">
            <button
              onClick={() => setMode('night')}
              className={`px-2.5 py-1 rounded-[2px] flex items-center gap-1.5 transition-all cursor-pointer ${
                !isDay
                  ? 'bg-[#e8802e] text-black font-bold'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
              title="Switch to Night Mode (Dark-Base / Obsidian & Ember)"
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Night Mode</span>
            </button>
            <button
              onClick={() => setMode('day')}
              className={`px-2.5 py-1 rounded-[2px] flex items-center gap-1.5 transition-all cursor-pointer ${
                isDay
                  ? 'bg-[#1a56db] text-white font-bold'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
              title="Switch to Day Mode (Light-Base / Off-White & Cobalt Blue)"
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Day Mode</span>
            </button>
          </div>

          {/* Tab Navigator */}
          <div className="bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] p-1 rounded-[2px] flex flex-wrap gap-1">
            {[
              { id: 'colors', label: 'Colors' },
              { id: 'typography', label: 'Typography' },
              { id: 'spacing', label: 'Spacing' },
              { id: 'motion', label: 'Radius & Motion' },
              { id: 'contrast', label: 'WCAG 2.2 Auditor' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 text-[11.52px] font-mono transition-colors rounded-[2px] cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[var(--color-surface-raised)] text-white font-semibold shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Colors Tab */}
      {activeTab === 'colors' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
            <div>
              <h2 className="text-lg font-medium text-[var(--color-text-primary)]">
                {palette.name}
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                {isDay ? 'Light architectural palette using warm off-white canvas and high-contrast cobalt blue accent.' : 'Dark architectural palette using deep obsidian canvas and signature ember orange accent.'}
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded-[2px] bg-[var(--color-surface-muted)] text-[var(--color-surface-raised)] font-semibold border border-[var(--color-border-subtle)]">
              {isDay ? 'Day Mode Active' : 'Night Mode Active'}
            </span>
          </div>

          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'color.text.primary', hex: palette.textPrimary, role: 'Primary text, titles, headlines' },
                { name: 'color.text.secondary', hex: palette.textSecondary, role: 'Secondary copy, metadata, captions' },
                { name: 'color.text.tertiary', hex: palette.textTertiary, role: 'Disabled copy, subtle separators' },
                { name: 'color.border.strong', hex: palette.borderStrong, role: 'High contrast outlines, active borders' },
                { name: 'color.surface.base', hex: palette.surfaceBase, role: isDay ? 'Canvas ground, architectural warm off-white' : 'Canvas ground, deep obsidian' },
                { name: 'color.surface.muted', hex: palette.surfaceMuted, role: 'Card surface elevation 1' },
                { name: 'color.surface.strong', hex: palette.surfaceStrong, role: 'Interactive container, modal background' },
                { name: 'color.surface.raised', hex: palette.surfaceRaised, role: isDay ? 'Primary architectural cobalt blue accent' : 'Primary architectural ember orange accent' },
              ].map((token) => (
                <div
                  key={token.name}
                  className="bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] p-4 rounded-[2px] space-y-3 group hover:border-[var(--color-surface-raised)] transition-colors"
                >
                  <div
                    className="w-full h-16 rounded-[2px] border border-[var(--color-border-subtle)] flex items-end p-2 transition-transform group-hover:scale-[1.01]"
                    style={{ backgroundColor: token.hex }}
                  >
                    <span
                      className="text-[9.6px] font-mono px-1 rounded-[2px]"
                      style={{
                        backgroundColor: getLuminance(token.hex) > 0.5 ? '#111113' : '#ffffff',
                        color: getLuminance(token.hex) > 0.5 ? '#ffffff' : '#111113',
                      }}
                    >
                      {token.hex}
                    </span>
                  </div>

                  <div>
                    <div className="text-[11.52px] font-mono font-medium text-[var(--color-text-primary)]">{token.name}</div>
                    <div className="text-[10.56px] text-[var(--color-text-secondary)] mt-0.5">{token.role}</div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(`var(--${token.name.replace(/\./g, '-')})`, token.name)}
                    className="w-full py-1 px-2 text-[10.56px] font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] rounded-[2px] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedToken === token.name ? (
                      <>
                        <Check className="w-3 h-3 text-[#e8802e]" />
                        <span>Copied Var</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy CSS Var</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Typography Tab */}
      {activeTab === 'typography' && (
        <div className="space-y-8">
          <div className="bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] p-6 rounded-[2px] space-y-4">
            <h2 className="text-lg font-medium text-[var(--color-text-primary)]">Font Stack & Mathematical Base</h2>
            <div className="font-mono text-sm text-[var(--color-surface-raised)] bg-[var(--color-surface-base)] p-3 rounded-[2px] border border-[var(--color-border-subtle)]">
              font.family.stack = Paperlogy, Inter, "Inter Fallback", Geist, "Geist Fallback", -apple-system, Helvetica Neue, sans-serif
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11.52px] text-[var(--color-text-secondary)] font-mono">
              <div>Base Size: <strong className="text-[var(--color-text-primary)]">16px</strong></div>
              <div>Base Weight: <strong className="text-[var(--color-text-primary)]">400 (Regular)</strong></div>
              <div>Base Line-Height: <strong className="text-[var(--color-text-primary)]">24px (1.5)</strong></div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-mono text-[var(--color-text-secondary)] uppercase">Formal Typography Scale (Exact Tokens)</h3>
            <div className="divide-y divide-[var(--color-border-subtle)] bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] rounded-[2px]">
              {MASS_TYPOGRAPHY_SCALE.map((item) => (
                <div key={item.token} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="w-48 shrink-0">
                    <div className="text-[11.52px] font-mono text-[var(--color-surface-raised)] font-semibold">{item.token}</div>
                    <div className="text-[10.56px] text-[var(--color-text-secondary)] font-mono">{item.value} ({item.rem})</div>
                  </div>
                  <div className="flex-1">
                    <div
                      style={{ fontSize: item.value }}
                      className="text-[var(--color-text-primary)] tracking-tight truncate leading-normal"
                    >
                      MassLabs: Computational Form & Structural Assembly ({item.value})
                    </div>
                    <div className="text-[9.6px] text-[var(--color-text-tertiary)] mt-0.5">{item.role}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`var(--${item.token.replace(/\./g, '-')})`, item.token)}
                    className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] rounded-[2px] cursor-pointer"
                    title="Copy Token"
                  >
                    {copiedToken === item.token ? <Check className="w-3.5 h-3.5 text-[var(--color-surface-raised)]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Spacing Tab */}
      {activeTab === 'spacing' && (
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-[var(--color-text-primary)]">Strict 8-Point Spacing Scale</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MASS_SPACING_SCALE.map((space) => (
              <div key={space.token} className="bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] p-4 rounded-[2px] flex items-center justify-between">
                <div>
                  <div className="text-[11.52px] font-mono text-[var(--color-surface-raised)] font-semibold">{space.token} = {space.value}</div>
                  <div className="text-[10.56px] text-[var(--color-text-secondary)] mt-0.5">{space.useCase}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="bg-[var(--color-surface-raised)] rounded-[1px]"
                    style={{ width: space.value, height: space.value }}
                    title={`${space.token} (${space.value})`}
                  />
                  <button
                    onClick={() => copyToClipboard(space.value, space.token)}
                    className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Radius & Motion Tab */}
      {activeTab === 'motion' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-medium text-[var(--color-text-primary)] mb-3">Radius & Elevation Shadow Tokens</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MASS_RADIUS_TOKENS.map((r) => (
                <div key={r.token} className="bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] p-5 rounded-[2px] space-y-2">
                  <div className="text-[11.52px] font-mono text-[var(--color-surface-raised)] font-semibold">{r.token} = {r.value}</div>
                  <p className="text-[10.56px] text-[var(--color-text-secondary)]">{r.useCase}</p>
                  <div className="h-12 w-full bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)] rounded-[2px] flex items-center justify-center text-[10.56px] font-mono text-[var(--color-text-primary)]">
                    Sharpened 2px Architectural Edge
                  </div>
                </div>
              ))}

              {MASS_SHADOW_TOKENS.map((s) => (
                <div key={s.token} className="bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] p-5 rounded-[2px] space-y-2">
                  <div className="text-[11.52px] font-mono text-[var(--color-surface-raised)] font-semibold">{s.token}</div>
                  <p className="text-[10.56px] text-[var(--color-text-secondary)]">{s.useCase}</p>
                  <div
                    className="h-12 w-full bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] rounded-[2px] flex items-center justify-center text-[10.56px] font-mono text-[var(--color-text-primary)]"
                    style={{ boxShadow: s.value }}
                  >
                    {isDay ? 'Subtle Architectural Soft Shadow' : 'Deep Ambient Obsidian + Ember Glow'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-[var(--color-text-primary)] mb-3">Motion Duration Tokens</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MASS_MOTION_TOKENS.map((m) => (
                <div key={m.token} className="bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] p-4 rounded-[2px] space-y-2">
                  <div className="text-[11.52px] font-mono text-[var(--color-surface-raised)] font-semibold">{m.token}</div>
                  <div className="text-xl font-mono text-[var(--color-text-primary)]">{m.value}</div>
                  <p className="text-[9.6px] text-[var(--color-text-secondary)]">{m.useCase}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* WCAG 2.2 Auditor Tab */}
      {activeTab === 'contrast' && (
        <div className="space-y-6">
          <div className="bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] p-6 rounded-[2px] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[var(--color-surface-raised)] font-mono text-xs mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>WCAG 2.2 Level AA / AAA Mathematical Audit ({isDay ? 'Day Mode' : 'Night Mode'})</span>
              </div>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Color Contrast Certification Matrix
              </h2>
              <p className="text-[var(--color-text-secondary)] text-xs mt-1">
                Active Palette: <strong className="text-[var(--color-text-primary)]">{palette.name}</strong>. Calculated using W3C Relative Luminance.
              </p>
            </div>
            <div className="text-right font-mono text-xs text-[var(--color-text-secondary)]">
              Target: <strong className="text-[var(--color-text-primary)]">WCAG 2.2 AA (4.5:1 text, 3:1 UI components)</strong>
            </div>
          </div>

          <div className="divide-y divide-[var(--color-border-subtle)] bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] rounded-[2px]">
            {contrastPairs.map((pair, idx) => {
              const ratio = calculateContrast(pair.fg, pair.bg);
              const passesAANormal = ratio >= 4.5;
              const passesAALarge = ratio >= 3.0;
              const passesAAA = ratio >= 7.0;

              return (
                <div key={idx} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-[2px] border border-[var(--color-border-subtle)] flex items-center justify-center font-bold text-xs"
                      style={{ backgroundColor: pair.bg, color: pair.fg }}
                    >
                      Aa
                    </div>
                    <div>
                      <div className="text-[11.52px] font-mono text-[var(--color-text-primary)]">{pair.label}</div>
                      <div className="text-[9.6px] font-mono text-[var(--color-text-secondary)]">
                        Foreground: {pair.fg} · Background: {pair.bg}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 font-mono text-xs">
                    <div className="text-right">
                      <div className="text-sm font-bold text-[var(--color-text-primary)] mass-num">
                        {ratio.toFixed(2)} : 1
                      </div>
                      <div className="text-[9.6px] text-[var(--color-text-secondary)]">Contrast Ratio</div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {passesAAA ? (
                        <span className="px-2 py-0.5 text-[9.6px] bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 rounded-[2px]">
                          PASS AAA (7.0+)
                        </span>
                      ) : passesAANormal ? (
                        <span className="px-2 py-0.5 text-[9.6px] bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 rounded-[2px]">
                          PASS AA (4.5+)
                        </span>
                      ) : passesAALarge ? (
                        <span className="px-2 py-0.5 text-[9.6px] bg-amber-950/70 text-amber-300 border border-amber-500/30 rounded-[2px]">
                          PASS AA Large / UI (3.0+)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[9.6px] bg-red-950/70 text-red-300 border border-red-500/30 rounded-[2px]">
                          Non-Text Token Only
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
