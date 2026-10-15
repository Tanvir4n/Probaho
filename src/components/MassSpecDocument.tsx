import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Download,
  Copy,
  Check,
  FileText,
  AlertTriangle,
  Layers,
  Sparkles,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ChecklistItem {
  id: string;
  category: string;
  text: string;
  mandatory: boolean;
}

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: 'c1', category: 'Tokens', text: 'All component colors reference semantic tokens (color.text.*, color.surface.*), zero raw hex values in components.', mandatory: true },
  { id: 'c2', category: 'Tokens', text: 'Spacing strictly matches 8-point scale (space.1: 7px to space.8: 18px), zero one-off margins.', mandatory: true },
  { id: 'c3', category: 'Tokens', text: 'Corner radius fixed to radius.xs (2px) across all interactive elements.', mandatory: true },
  { id: 'c4', category: 'States', text: 'Every interactive component implements all 7 lifecycle states: default, hover, focus-visible, active, disabled, loading, error.', mandatory: true },
  { id: 'c5', category: 'Accessibility', text: 'All text meets WCAG 2.2 AA contrast: minimum 4.5:1 for body, 3:1 for large display text and UI outlines.', mandatory: true },
  { id: 'c6', category: 'Accessibility', text: 'Keyboard-first navigation verified: visible 2px focus ring with offset, full Tab/Shift+Tab and Enter/Space event handlers.', mandatory: true },
  { id: 'c7', category: 'Accessibility', text: 'Touch targets meet minimum 40px (44px on mobile) hit geometry.', mandatory: true },
  { id: 'c8', category: 'Density', text: 'Page density requirements verified: 13 buttons, 13 links, and 2 navigation planes operational.', mandatory: true },
  { id: 'c9', category: 'Anti-Slop', text: 'Anti-slop discipline verified: zero rounded pill enclosures for metadata, zero mechanical "//" comment headers, zero fake tickers.', mandatory: true },
  { id: 'c10', category: 'Copy', text: 'Copywriting tone verified: concise, confident, implementation-focused prose with explicit action verbs.', mandatory: true },
];

export const MassSpecDocument: React.FC = () => {
  const { isDay } = useTheme();
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    c1: true,
    c2: true,
    c3: true,
    c4: true,
    c5: true,
    c6: true,
    c7: true,
    c8: true,
    c9: true,
    c10: true,
  });

  const [copiedDoc, setCopiedDoc] = useState(false);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  const markdownContent = `# MassLabs Design System Specification (v1.0.0)
URL: https://masslabs-archi.com/
Audience: Buyers, teams, and decision-makers
Product Surface: Marketing site & Architectural interface

## 1. Context & Design Intent
MassLabs provides implementation-ready, token-driven UI guidance optimized for consistency, accessibility, and high-velocity delivery across all marketing surfaces and architectural interfaces.

## 2. Style Foundations & Design Tokens
### Typography Stack
- Font Family Primary: Paperlogy
- Font Stack: Paperlogy, Inter, "Inter Fallback", Geist, "Geist Fallback", -apple-system, Helvetica Neue, sans-serif
- Base Size: 16px | Weight: 400 | Line Height: 24px
- Scale:
  * font.size.xs: 9.6px (Micro badges, coordinates)
  * font.size.sm: 10.56px (Footnotes, tabular indices)
  * font.size.md: 11.52px (Secondary links, status captions)
  * font.size.lg: 12.64px (Button labels, form labels)
  * font.size.xl: 12.8px (Subsection subtitles)
  * font.size.2xl: 13.28px (Tabs, editorial callouts)
  * font.size.3xl: 15.68px (Lead paragraph openers)
  * font.size.4xl: 16px (Base body copy)

### Color Palette
- color.text.primary: #eceae6 (18.2:1 against black - WCAG AAA)
- color.text.secondary: #8a8a86 (6.4:1 against black - WCAG AA)
- color.text.tertiary: #555552 (3.1:1 non-text disabled / dividers)
- color.border.strong: #ffffff (21:1 high contrast perimeter)
- color.surface.base: #000000 (Dominant canvas obsidian)
- color.surface.muted: #121214 (Card elevation 1)
- color.surface.strong: #0e0e0f (Interactive container ground)
- color.surface.raised: #e8802e (Signature ember accent - 7.1:1 against black)

### Spacing Scale
- space.1: 7px | space.2: 8px | space.3: 10px | space.4: 11px
- space.5: 12px | space.6: 14px | space.7: 15px | space.8: 18px

### Radius, Shadow & Motion
- radius.xs: 2px
- shadow.1: rgba(0, 0, 0, 0.62) 0px 20px 44px 0px, rgba(232, 128, 46, 0.15) 0px 0px 30px 0px
- motion.duration.instant: 150ms
- motion.duration.fast: 200ms
- motion.duration.normal: 220ms
- motion.duration.slow: 700ms

## 3. Component-Level Rules
### Mandatory 7 Lifecycle States
Every interactive element must provide testable styles and behaviors for:
1. Default
2. Hover
3. Focus-visible (2px solid outline with 2px offset)
4. Active (1px downpress displacement)
5. Disabled (aria-disabled, pointer-events-none, muted color)
6. Loading (spinner indicator, interaction lock)
7. Error (aria-invalid, red accent border, descriptive error text)

### Component Density Expectations
- Buttons: Exactly 13 functional instances
- Links: Exactly 13 editorial instances
- Navigation: Exactly 2 navigation planes (Top Bar 3-zone contract + Secondary Monograph filter)

## 4. Accessibility Acceptance Criteria (WCAG 2.2 AA)
- Contrast: >= 4.5:1 for normal text, >= 3.0:1 for large display headings.
- Keyboard: 100% operable via Tab, Shift+Tab, Enter, Space, and Escape.
- Touch Target: >= 40px (44px on mobile) hit geometry.
- Focus Indicator: Always visible, never hidden with outline:none.

## 5. Anti-Patterns & Prohibitions
- NEVER use raw hex values in components.
- NEVER wrap metadata in rounded pill boxes or colored chips.
- NEVER prefix sections with code comment syntax (e.g. "// 01").
- NEVER hide keyboard focus rings.
`;

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopiedDoc(true);
    setTimeout(() => setCopiedDoc(false), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'masslabs-design-system-guidance.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Banner */}
      <div className="border-b border-[var(--color-border-subtle)] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10.56px] text-[var(--color-text-secondary)] uppercase tracking-widest mb-2 font-mono">
            <span>MassLabs Design Constitution</span>
            <span>·</span>
            <span>Release 1.0.0</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            Implementation-Ready UI Guidance
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)] text-sm max-w-2xl leading-relaxed">
            Standardized design manual for engineering and design teams building the MassLabs architectural marketing surface.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copyMarkdown}
            className="px-3 py-2 text-xs font-mono text-[var(--color-text-primary)] bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] rounded-[2px] flex items-center gap-2 cursor-pointer transition-colors"
          >
            {copiedDoc ? <Check className="w-3.5 h-3.5 text-[var(--color-surface-raised)]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedDoc ? 'Copied Markdown' : 'Copy Full Spec'}</span>
          </button>
          <button
            onClick={downloadMarkdown}
            className={`px-4 py-2 text-xs font-medium ${isDay ? 'text-white' : 'text-black'} bg-[var(--color-surface-raised)] hover:brightness-110 rounded-[2px] flex items-center gap-2 font-mono cursor-pointer shadow-md`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Guidance .md</span>
          </button>
        </div>
      </div>

      {/* Structured Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          {/* Section 1: Context & Goals */}
          <div className="bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] p-6 rounded-[2px] space-y-4">
            <div className="flex items-center gap-2 text-[var(--color-surface-raised)] font-mono text-xs">
              <Compass className="w-4 h-4" />
              <span>01. CONTEXT & GOALS</span>
            </div>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              Design Intent & Scope
            </h2>
            <div className="text-sm text-[var(--color-text-secondary)] leading-relaxed space-y-3">
              <p>
                <strong className="text-[var(--color-text-primary)]">Mission:</strong> Create implementation-ready, token-driven UI guidance for MassLabs that is optimized for consistency, accessibility, and fast delivery across marketing sites.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[var(--color-surface-base)]/60 rounded-[2px] border border-[var(--color-border-subtle)] font-mono text-xs">
                <div>• Brand: <span className="text-[var(--color-text-primary)]">MassLabs</span></div>
                <div>• Canonical URL: <span className="text-[var(--color-surface-raised)]">masslabs-archi.com</span></div>
                <div>• Primary Audience: <span className="text-[var(--color-text-primary)]">Buyers, teams & decision-makers</span></div>
                <div>• Product Surface: <span className="text-[var(--color-text-primary)]">Marketing site & Monograph</span></div>
              </div>
            </div>
          </div>

          {/* Section 2: Component-Level Rules */}
          <div className="bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] p-6 rounded-[2px] space-y-4">
            <div className="flex items-center gap-2 text-[var(--color-surface-raised)] font-mono text-xs">
              <Layers className="w-4 h-4" />
              <span>02. COMPONENT-LEVEL RULES & 7-STATE CONTRACT</span>
            </div>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              State Completeness & Density Governance
            </h2>
            <div className="text-sm text-[var(--color-text-secondary)] leading-relaxed space-y-4">
              <p>
                Every component shipped under the MassLabs token architecture must explicitly define and render behaviors for seven lifecycle states without exception:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-[var(--color-surface-base)]/50 border border-[var(--color-border-subtle)] rounded-[2px]">
                  <strong className="text-[var(--color-text-primary)]">1. Default:</strong> Baseline rest posture with semantic surface colors.
                </div>
                <div className="p-2.5 bg-[var(--color-surface-base)]/50 border border-[var(--color-border-subtle)] rounded-[2px]">
                  <strong className="text-[var(--color-text-primary)]">2. Hover:</strong> Micro-elevation or brightness bump (150ms).
                </div>
                <div className="p-2.5 bg-[var(--color-surface-base)]/50 border border-[var(--color-border-subtle)] rounded-[2px]">
                  <strong className="text-[var(--color-text-primary)]">3. Focus-Visible:</strong> 2px solid ring with 2px offset (WCAG AA).
                </div>
                <div className="p-2.5 bg-[var(--color-surface-base)]/50 border border-[var(--color-border-subtle)] rounded-[2px]">
                  <strong className="text-[var(--color-text-primary)]">4. Active:</strong> 1px subtle displacement on press.
                </div>
                <div className="p-2.5 bg-[var(--color-surface-base)]/50 border border-[var(--color-border-subtle)] rounded-[2px]">
                  <strong className="text-[var(--color-text-primary)]">5. Disabled:</strong> aria-disabled="true", pointer-events-none, 40% opacity.
                </div>
                <div className="p-2.5 bg-[var(--color-surface-base)]/50 border border-[var(--color-border-subtle)] rounded-[2px]">
                  <strong className="text-[var(--color-text-primary)]">6. Loading:</strong> Spinner animation, interaction lock.
                </div>
                <div className="p-2.5 bg-[var(--color-surface-base)]/50 border border-[var(--color-border-subtle)] rounded-[2px] sm:col-span-2">
                  <strong className="text-[var(--color-text-primary)]">7. Error:</strong> aria-invalid="true", high-contrast red indicator, error message.
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Anti-Patterns & Prohibitions */}
          <div className="bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] p-6 rounded-[2px] space-y-4">
            <div className="flex items-center gap-2 text-red-500 font-mono text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>03. ANTI-PATTERNS & PROHIBITED IMPLEMENTATIONS</span>
            </div>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              Design Anti-Patterns Ban
            </h2>
            <div className="space-y-3 text-xs text-[var(--color-text-secondary)] font-mono">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-[2px] text-red-600 dark:text-red-300">
                ✕ <strong>No Static Pill Enclosures:</strong> Never wrap categories or dates in capsule pill badges. Use unboxed text with subtle typographic separators ("·").
              </div>
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-[2px] text-red-600 dark:text-red-300">
                ✕ <strong>No Raw CSS Magic Numbers:</strong> Never author ad-hoc padding (e.g. padding: 13px); map to space.1 through space.8 strictly.
              </div>
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-[2px] text-red-600 dark:text-red-300">
                ✕ <strong>No Hidden Focus Indicators:</strong> outline: none without an explicit :focus-visible replacement violates quality gates.
              </div>
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-[2px] text-red-600 dark:text-red-300">
                ✕ <strong>No Mechanical "//" Comment Headers:</strong> Section titles must use natural human editorial prose.
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Interactive QA Checklist */}
        <div className="space-y-6">
          <div className="bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] p-6 rounded-[2px] space-y-4 sticky top-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--color-surface-raised)] font-mono text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>QA ACCEPTANCE CHECKLIST</span>
              </div>
              <span className="text-xs font-mono text-[var(--color-text-primary)] mass-num font-bold">
                {completedCount} / {INITIAL_CHECKLIST.length} PASSED
              </span>
            </div>

            <div className="w-full bg-[var(--color-surface-base)] h-2 rounded-full overflow-hidden border border-[var(--color-border-subtle)]">
              <div
                className="bg-[var(--color-surface-raised)] h-full transition-all duration-300"
                style={{ width: `${(completedCount / INITIAL_CHECKLIST.length) * 100}%` }}
              />
            </div>

            <p className="text-xs text-[var(--color-text-secondary)]">
              All items marked with <span className="text-[var(--color-surface-raised)] font-semibold">MUST</span> are non-negotiable gates for delivery.
            </p>

            <div className="space-y-3 pt-2">
              {INITIAL_CHECKLIST.map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="w-full text-left p-2.5 rounded-[2px] bg-[var(--color-surface-base)]/50 border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] transition-all flex items-start gap-2.5 group cursor-pointer"
                  >
                    <div className="mt-0.5 shrink-0 text-[var(--color-surface-raised)]">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)]" />
                      )}
                    </div>
                    <div>
                      <div className="text-[11.52px] text-[var(--color-text-primary)] font-mono leading-snug">
                        {item.text}
                      </div>
                      <div className="text-[9.6px] text-[var(--color-text-secondary)] font-mono mt-1">
                        Category: {item.category} {item.mandatory && '· [MUST]'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
