/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MassMarketingView } from './components/MassMarketingView';
import { MassComponentWorkbench } from './components/MassComponentWorkbench';
import { MassTokenInspector } from './components/MassTokenInspector';
import { MassSpecDocument } from './components/MassSpecDocument';
import {
  Layers,
  Sliders,
  FileCode,
  Globe,
  X,
  Code2,
  Sun,
  Moon
} from 'lucide-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
  const [isDesignSystemOpen, setIsDesignSystemOpen] = useState(false);
  const [systemTab, setSystemTab] = useState<'tokens' | 'workbench' | 'spec'>('tokens');
  const { mode, isDay, toggleMode, palette } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-primary)] flex flex-col font-sans selection:bg-[var(--color-surface-raised)] selection:text-white transition-colors duration-200 relative">
      {/* 
        Main Viewport:
        100% Pure, Pristine Clone of masslabs-archi.com
      */}
      <main className="flex-1">
        <MassMarketingView
          onOpenDesignSystem={() => setIsDesignSystemOpen(true)}
        />
      </main>

      {/* 
        Discreet Floating Button (Bottom Right)
        Allows engineers to inspect tokens, 7-state lifecycle workbench, QA checklist, and active theme palette.
      */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        {/* Floating Quick Day/Night Toggle */}
        <button
          onClick={toggleMode}
          className="p-2 bg-[var(--color-surface-strong)]/90 hover:bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] rounded-[2px] backdrop-blur-md shadow-2xl text-[11px] font-mono flex items-center gap-1.5 transition-all"
          title={isDay ? "Switch to Night Mode (Black/Orange)" : "Switch to Day Mode (Off-white/Blue)"}
          aria-label="Toggle theme mode"
        >
          {isDay ? (
            <Sun className="w-3.5 h-3.5 text-[#1a56db]" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-[#e8802e]" />
          )}
          <span className="hidden sm:inline font-bold uppercase">{mode}</span>
        </button>

        <button
          onClick={() => setIsDesignSystemOpen(true)}
          className="px-3 py-1.5 bg-[var(--color-surface-strong)]/90 hover:bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] rounded-[2px] backdrop-blur-md shadow-2xl text-[11px] font-mono flex items-center gap-2 transition-all group"
          title="Open MassLabs Design System Guidance & Token Inspector"
        >
          <Code2 className="w-3.5 h-3.5 text-[var(--color-surface-raised)] group-hover:rotate-12 transition-transform" />
          <span>Design System Specs</span>
        </button>
      </div>

      {/* 
        Design System & Token Architecture Modal Overlay
      */}
      {isDesignSystemOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col p-4 sm:p-6 overflow-hidden">
          <div className="bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] rounded-[2px] flex-1 flex flex-col overflow-hidden shadow-2xl max-w-7xl w-full mx-auto">
            {/* Modal Header */}
            <div className="p-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between bg-[var(--color-surface-base)]/90 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[var(--color-surface-raised)]">MassLabs</span>
                <span className="text-[var(--color-text-tertiary)]">|</span>
                <span className="text-xs text-[var(--color-text-primary)] font-semibold">Token Architecture & Component Guidance</span>
                <span className="text-[10px] text-[var(--color-text-secondary)] font-mono hidden sm:inline">(masslabs-archi.com)</span>
              </div>

              <div className="flex items-center gap-3">
                {/* System Navigation Tabs */}
                <div className="flex items-center gap-1 bg-[var(--color-surface-muted)] p-1 border border-[var(--color-border-subtle)] rounded-[2px]">
                  <button
                    onClick={() => setSystemTab('tokens')}
                    className={`px-3 py-1 text-xs font-mono rounded-[2px] transition-colors flex items-center gap-1.5 cursor-pointer ${
                      systemTab === 'tokens'
                        ? `bg-[var(--color-surface-raised)] ${isDay ? 'text-white' : 'text-black'} font-semibold shadow-sm`
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Tokens & WCAG</span>
                  </button>

                  <button
                    onClick={() => setSystemTab('workbench')}
                    className={`px-3 py-1 text-xs font-mono rounded-[2px] transition-colors flex items-center gap-1.5 cursor-pointer ${
                      systemTab === 'workbench'
                        ? `bg-[var(--color-surface-raised)] ${isDay ? 'text-white' : 'text-black'} font-semibold shadow-sm`
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    <span>7-State Workbench</span>
                  </button>

                  <button
                    onClick={() => setSystemTab('spec')}
                    className={`px-3 py-1 text-xs font-mono rounded-[2px] transition-colors flex items-center gap-1.5 cursor-pointer ${
                      systemTab === 'spec'
                        ? `bg-[var(--color-surface-raised)] ${isDay ? 'text-white' : 'text-black'} font-semibold shadow-sm`
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    <FileCode className="w-3 h-3" />
                    <span>QA Checklist & Spec</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsDesignSystemOpen(false)}
                  className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] rounded-[2px] hover:bg-[var(--color-surface-muted)] cursor-pointer"
                  aria-label="Close Design System Specs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[var(--color-surface-base)]">
              {systemTab === 'tokens' && <MassTokenInspector />}
              {systemTab === 'workbench' && <MassComponentWorkbench />}
              {systemTab === 'spec' && <MassSpecDocument />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
