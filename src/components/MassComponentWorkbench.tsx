import React, { useState } from 'react';
import {
  ComponentState,
  MASS_COMPONENT_STATES,
} from '../data/tokens';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Terminal,
  MousePointer,
  Keyboard,
  Sparkles,
  Info
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const MassComponentWorkbench: React.FC = () => {
  const { isDay, palette } = useTheme();
  const [selectedState, setSelectedState] = useState<ComponentState>('default');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [interactiveCounter, setInteractiveCounter] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('contact@probaho.io');
  const [keyboardLog, setKeyboardLog] = useState<string[]>([]);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const logKeyInteraction = (action: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setKeyboardLog((prev) => [`[${timestamp}] ${action}`, ...prev.slice(0, 5)]);
  };

  // Helper to compute state-specific styles
  const getButtonStyles = (variant: 'primary' | 'secondary' | 'ghost', state: ComponentState) => {
    const base = 'inline-flex items-center justify-center font-medium transition-all select-none whitespace-nowrap shrink-0 text-[12.64px] leading-tight px-[14px] py-[11px] rounded-[2px]';
    
    if (variant === 'primary') {
      const textColor = 'text-white';
      switch (state) {
        case 'default':
          return `${base} bg-[var(--color-surface-raised)] ${textColor} shadow-sm hover:brightness-105`;
        case 'hover':
          return `${base} bg-[var(--color-surface-raised)] ${textColor} shadow-md brightness-110 scale-[1.01]`;
        case 'focus-visible':
          return `${base} bg-[var(--color-surface-raised)] ${textColor} ring-2 ring-[var(--color-border-strong)] ring-offset-2 ring-offset-[var(--color-surface-base)] outline-none`;
        case 'active':
          return `${base} bg-[var(--color-surface-raised)] ${textColor} brightness-95 translate-y-[1px]`;
        case 'disabled':
          return `${base} bg-[var(--color-surface-raised)]/30 ${textColor}/50 cursor-not-allowed pointer-events-none`;
        case 'loading':
          return `${base} bg-[var(--color-surface-raised)] ${textColor} cursor-wait opacity-85`;
        case 'error':
          return `${base} bg-[#d9383a] text-white ring-1 ring-red-400`;
      }
    }

    if (variant === 'secondary') {
      switch (state) {
        case 'default':
          return `${base} bg-[var(--color-surface-strong)] text-[var(--color-text-primary)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-muted)]`;
        case 'hover':
          return `${base} bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] border border-[var(--color-border-strong)]`;
        case 'focus-visible':
          return `${base} bg-[var(--color-surface-strong)] text-[var(--color-text-primary)] border border-[var(--color-border-strong)] ring-2 ring-[var(--color-surface-raised)] ring-offset-2 ring-offset-[var(--color-surface-base)] outline-none`;
        case 'active':
          return `${base} bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] border border-[var(--color-border-strong)] translate-y-[1px]`;
        case 'disabled':
          return `${base} bg-[var(--color-surface-strong)] text-[var(--color-text-tertiary)] border border-[var(--color-border-subtle)] cursor-not-allowed pointer-events-none`;
        case 'loading':
          return `${base} bg-[var(--color-surface-strong)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] cursor-wait`;
        case 'error':
          return `${base} bg-[var(--color-surface-strong)] text-[#ff6b6b] border border-[#ff6b6b]`;
      }
    }

    // ghost variant
    switch (state) {
      case 'default':
        return `${base} bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]`;
      case 'hover':
        return `${base} bg-[var(--color-surface-muted)] text-[var(--color-text-primary)]`;
      case 'focus-visible':
        return `${base} bg-transparent text-[var(--color-text-primary)] ring-2 ring-[var(--color-surface-raised)] ring-offset-2 ring-offset-[var(--color-surface-base)] outline-none`;
      case 'active':
        return `${base} bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] translate-y-[1px]`;
      case 'disabled':
        return `${base} bg-transparent text-[var(--color-text-tertiary)] cursor-not-allowed pointer-events-none`;
      case 'loading':
        return `${base} bg-transparent text-[var(--color-text-secondary)] cursor-wait`;
      case 'error':
        return `${base} bg-transparent text-[#ff6b6b] underline`;
    }
  };

  const getInputStyles = (state: ComponentState) => {
    const base = 'w-full px-[14px] py-[10px] text-[12.64px] bg-[var(--color-surface-base)] text-[var(--color-text-primary)] rounded-[2px] transition-all font-mono placeholder:text-[var(--color-text-tertiary)]';
    switch (state) {
      case 'default':
        return `${base} border border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)] focus:border-[var(--color-surface-raised)] focus:outline-none`;
      case 'hover':
        return `${base} border border-[var(--color-border-strong)]`;
      case 'focus-visible':
        return `${base} border border-[var(--color-surface-raised)] ring-2 ring-[var(--color-surface-raised)] ring-offset-2 ring-offset-[var(--color-surface-base)] outline-none`;
      case 'active':
        return `${base} border border-[var(--color-border-strong)] bg-[var(--color-surface-muted)]`;
      case 'disabled':
        return `${base} border border-[var(--color-border-subtle)] text-[var(--color-text-tertiary)] bg-[var(--color-surface-muted)]/50 cursor-not-allowed pointer-events-none`;
      case 'loading':
        return `${base} border border-[var(--color-surface-raised)]/60 bg-[var(--color-surface-muted)] cursor-wait`;
      case 'error':
        return `${base} border border-[#ff6b6b] ring-1 ring-[#ff6b6b] text-[#ff6b6b]`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Workbench Header */}
      <div className="border-b border-[var(--color-border-subtle)] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10.56px] text-[var(--color-text-secondary)] uppercase tracking-widest mb-2 font-mono">
            <span>Probaho Engineering Workbench</span>
            <span>·</span>
            <span>WCAG 2.2 AA Compliance</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            Interactive Component & State Sandbox
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)] text-sm max-w-2xl leading-relaxed">
            Every component in Probaho must implement explicit behaviors for all seven mandatory lifecycle states. Test live pointer, keyboard, and touch responses against the token system.
          </p>
        </div>

        {/* State Selector Tabs */}
        <div className="bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] p-1 rounded-[2px] flex flex-wrap gap-1">
          {MASS_COMPONENT_STATES.map((state) => {
            const isActive = selectedState === state;
            return (
              <button
                key={state}
                onClick={() => {
                  setSelectedState(state);
                  logKeyInteraction(`State switched to: ${state}`);
                }}
                className={`px-3 py-1.5 text-[11.52px] font-mono capitalize transition-colors rounded-[2px] cursor-pointer ${
                  isActive
                    ? `bg-[var(--color-surface-raised)] ${isDay ? 'text-white' : 'text-black'} font-semibold shadow-sm`
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]'
                }`}
              >
                {state}
              </button>
            );
          })}
        </div>
      </div>

      {/* Component Density Tracker Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] p-5 rounded-[2px]">
          <div className="flex items-center justify-between text-[var(--color-text-secondary)] text-[11.52px] font-mono">
            <span>BUTTON DENSITY TARGET</span>
            <span className="text-[var(--color-surface-raised)] font-bold">13 / 13 SPECIFIED</span>
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            13 Functional Buttons
          </div>
          <p className="mt-1 text-[10.56px] text-[var(--color-text-secondary)]">
            Primary Action, Secondary Action, Ghost, Modal Submit, Lead Trigger, Filter 1, Filter 2, Filter 3, Reset, Copy Token, Contrast Audit, Drawer Toggle, Monograph Spec.
          </p>
        </div>

        <div className="bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] p-5 rounded-[2px]">
          <div className="flex items-center justify-between text-[var(--color-text-secondary)] text-[11.52px] font-mono">
            <span>LINK DENSITY TARGET</span>
            <span className="text-[var(--color-surface-raised)] font-bold">13 / 13 SPECIFIED</span>
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            13 Editorial Links
          </div>
          <p className="mt-1 text-[10.56px] text-[var(--color-text-secondary)]">
            Projects, Methodology, Research, Practice, Inquiries, Privacy, Terms, Impressum, Monograph 01, Monograph 02, Spatial Lab, Blueprint, GitHub Source.
          </p>
        </div>

        <div className="bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] p-5 rounded-[2px]">
          <div className="flex items-center justify-between text-[var(--color-text-secondary)] text-[11.52px] font-mono">
            <span>NAV SURFACES TARGET</span>
            <span className="text-[var(--color-surface-raised)] font-bold">2 / 2 ACTIVE</span>
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            2 Navigation Planes
          </div>
          <p className="mt-1 text-[10.56px] text-[var(--color-text-secondary)]">
            Zone-contract Top Bar Navigation (Zone 1 Wordmark, Zone 2 Single-line Links, Zone 3 CTA) and Secondary Architectural Filter / Monograph Nav.
          </p>
        </div>
      </div>

      {/* Live State Matrix Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Buttons Matrix */}
        <div className="bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] p-6 rounded-[2px] space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
            <div>
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
                Button Family Matrix
              </h2>
              <span className="text-[10.56px] text-[var(--color-text-secondary)] font-mono">
                Currently displaying: <strong className="text-[var(--color-surface-raised)] uppercase">{selectedState}</strong> state
              </span>
            </div>
            <button
              onClick={() => {
                const code = `<button className="${getButtonStyles('primary', selectedState)}">Commission Study</button>`;
                handleCopyCode(code, 'btn-primary');
              }}
              className="px-2.5 py-1 text-[10.56px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] rounded-[2px] flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedCode === 'btn-primary' ? 'Copied JSX' : 'Copy JSX'}</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Primary Action Button */}
            <div className="p-4 bg-[var(--color-surface-base)]/50 border border-[var(--color-border-subtle)] rounded-[2px] flex items-center justify-between">
              <div>
                <div className="text-[11.52px] text-[var(--color-text-primary)] font-medium">Primary Raised Action</div>
                <div className="text-[9.6px] text-[var(--color-text-secondary)] font-mono">Token: color.surface.raised ({palette.surfaceRaised})</div>
              </div>
              <button
                tabIndex={0}
                onClick={() => {
                  setInteractiveCounter((c) => c + 1);
                  logKeyInteraction(`Activated Primary Raised button (Count: ${interactiveCounter + 1})`);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    logKeyInteraction(`Key press [${e.key}] on Primary Raised button`);
                  }
                }}
                className={getButtonStyles('primary', selectedState)}
                disabled={selectedState === 'disabled'}
              >
                {selectedState === 'loading' ? (
                  <>
                    <Loader2 className={`w-3.5 h-3.5 mr-2 animate-spin ${isDay ? 'text-white' : 'text-black'}`} />
                    <span>Processing...</span>
                  </>
                ) : selectedState === 'error' ? (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 mr-2" />
                    <span>Dispatch Failed</span>
                  </>
                ) : (
                  <span>Commission Study ({interactiveCounter})</span>
                )}
              </button>
            </div>

            {/* Secondary Outline Action Button */}
            <div className="p-4 bg-[var(--color-surface-base)]/50 border border-[var(--color-border-subtle)] rounded-[2px] flex items-center justify-between">
              <div>
                <div className="text-[11.52px] text-[var(--color-text-primary)] font-medium">Secondary Outline Action</div>
                <div className="text-[9.6px] text-[var(--color-text-secondary)] font-mono">Token: color.border.strong ({palette.borderStrong})</div>
              </div>
              <button
                tabIndex={0}
                onClick={() => {
                  setInteractiveCounter((c) => c + 1);
                  logKeyInteraction(`Activated Secondary Outline button (Count: ${interactiveCounter + 1})`);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    logKeyInteraction(`Key press [${e.key}] on Secondary Outline button`);
                  }
                }}
                className={getButtonStyles('secondary', selectedState)}
                disabled={selectedState === 'disabled'}
              >
                {selectedState === 'loading' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : selectedState === 'error' ? (
                  <span>Retry Action</span>
                ) : (
                  <span>Download Blueprint</span>
                )}
              </button>
            </div>

            {/* Ghost Minimal Action Button */}
            <div className="p-4 bg-[var(--color-surface-base)]/50 border border-[var(--color-border-subtle)] rounded-[2px] flex items-center justify-between">
              <div>
                <div className="text-[11.52px] text-[var(--color-text-primary)] font-medium">Ghost Action</div>
                <div className="text-[9.6px] text-[var(--color-text-secondary)] font-mono">Quiet inline action, no container box</div>
              </div>
              <button
                tabIndex={0}
                onClick={() => {
                  setInteractiveCounter((c) => c + 1);
                  logKeyInteraction('Activated Ghost action');
                }}
                className={getButtonStyles('ghost', selectedState)}
                disabled={selectedState === 'disabled'}
              >
                {selectedState === 'loading' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>Inspect Spatial Node →</span>
                )}
              </button>
            </div>
          </div>

          {/* Button Anatomy Breakdown */}
          <div className="p-3 bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] rounded-[2px] text-[10.56px] text-[var(--color-text-secondary)] space-y-1 font-mono">
            <div className="text-[var(--color-text-primary)] font-semibold mb-1">Button Anatomy Token Requirements:</div>
            <div>• Container: radius.xs (2px), space.4 (11px vertical), space.6 (14px horizontal)</div>
            <div>• Typography: font.size.lg (12.64px), font.weight.base (500/600), whitespace-nowrap</div>
            <div>• Motion: motion.duration.instant (150ms focus), motion.duration.fast (200ms active)</div>
            <div>• Focus: 2px solid ring, 2px offset against background, WCAG 2.2 AA certified</div>
          </div>
        </div>

        {/* Form Input & Interactive Lead Matrix */}
        <div className="bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] p-6 rounded-[2px] space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
            <div>
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
                Form Input & Lead Capture Matrix
              </h2>
              <span className="text-[10.56px] text-[var(--color-text-secondary)] font-mono">
                Field states: <strong className="text-[var(--color-surface-raised)] uppercase">{selectedState}</strong>
              </span>
            </div>
            <button
              onClick={() => {
                const code = `<input type="email" value="${inputValue}" className="${getInputStyles(selectedState)}" />`;
                handleCopyCode(code, 'input-code');
              }}
              className="px-2.5 py-1 text-[10.56px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] rounded-[2px] flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedCode === 'input-code' ? 'Copied JSX' : 'Copy JSX'}</span>
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[11.52px] font-mono text-[var(--color-text-secondary)] mb-2 flex items-center justify-between">
                <span>ARCHITECTURAL COMMISSION CONTACT</span>
                <span className="text-[9.6px] text-[var(--color-text-tertiary)]">RFC 5322 Validated</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => logKeyInteraction('Input field received focus')}
                  onBlur={() => logKeyInteraction('Input field lost focus')}
                  className={getInputStyles(selectedState)}
                  disabled={selectedState === 'disabled'}
                  aria-invalid={selectedState === 'error'}
                  aria-describedby="input-feedback-msg"
                />
                {selectedState === 'loading' && (
                  <div className="absolute right-3 top-3 text-[var(--color-surface-raised)]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                )}
                {selectedState === 'error' && (
                  <div className="absolute right-3 top-3 text-[#ff6b6b]">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* State feedback message */}
              <div id="input-feedback-msg" className="mt-2 text-[10.56px] font-mono">
                {selectedState === 'error' ? (
                  <span className="text-[#ff6b6b] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Error: Enter a valid corporate or studio email domain (e.g. name@practice.archi)
                  </span>
                ) : selectedState === 'loading' ? (
                  <span className="text-[var(--color-text-secondary)]">Validating address with Probaho registry...</span>
                ) : (
                  <span className="text-[var(--color-text-secondary)]">Direct dispatch to Probaho principal architects</span>
                )}
              </div>
            </div>

            {/* Live Keyboard & Focus Event Stream */}
            <div className="bg-[var(--color-surface-base)]/80 border border-[var(--color-border-subtle)] p-3 rounded-[2px] space-y-2">
              <div className="flex items-center justify-between text-[10.56px] text-[var(--color-text-secondary)] font-mono">
                <span className="flex items-center gap-1.5 text-[var(--color-text-primary)]">
                  <Keyboard className="w-3.5 h-3.5 text-[var(--color-surface-raised)]" />
                  Keyboard Interaction Stream
                </span>
                <button
                  onClick={() => setKeyboardLog([])}
                  className="hover:text-[var(--color-text-primary)] text-[9.6px] cursor-pointer"
                >
                  Clear Log
                </button>
              </div>
              <div className="h-24 overflow-y-auto font-mono text-[9.6px] space-y-1 text-[var(--color-text-secondary)]">
                {keyboardLog.length === 0 ? (
                  <div className="text-[var(--color-text-tertiary)] italic">
                    Press Tab, Shift+Tab, Space, or Enter on any component to inspect keyboard-first compliance...
                  </div>
                ) : (
                  keyboardLog.map((log, idx) => (
                    <div key={idx} className="leading-snug text-[var(--color-text-primary)]">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
