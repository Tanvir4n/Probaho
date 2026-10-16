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
  X
} from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { ProbahoLogo, ProbahoBrand } from './components/ProbahoLogo';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  const [isDesignSystemOpen, setIsDesignSystemOpen] = useState(false);
  const [systemTab, setSystemTab] = useState<'tokens' | 'workbench' | 'spec'>('tokens');

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-primary)] flex flex-col font-sans selection:bg-[var(--color-surface-raised)] selection:text-white transition-colors duration-200 relative">
      {/* 
        Main Viewport with Slide-In-Up Page Entrance
      */}
      <motion.main
        className="flex-1"
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <MassMarketingView
          onOpenDesignSystem={() => setIsDesignSystemOpen(true)}
        />
      </motion.main>

      {/* 
        Design System & Token Architecture Modal Overlay with Slide-In-Up Animation
      */}
      <AnimatePresence>
        {isDesignSystemOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col p-4 sm:p-6 overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 35, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel rounded-[8px] flex-1 flex flex-col overflow-hidden shadow-2xl max-w-7xl w-full mx-auto"
            >
            {/* Modal Header */}
            <div className="p-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between bg-black/30 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <ProbahoBrand size={20} textSize="text-xs" />
                <span className="text-[var(--color-text-tertiary)]">|</span>
                <span className="text-xs text-[var(--color-text-primary)] font-semibold">Design System & Component Guidance</span>
                <span className="text-[10px] text-[var(--color-text-secondary)] font-mono hidden sm:inline">(probaho.bd)</span>
              </div>

              <div className="flex items-center gap-3">
                {/* System Navigation Tabs */}
                <div className="flex items-center gap-1 glass-pill p-1 rounded-[4px]">
                  <button
                    onClick={() => setSystemTab('tokens')}
                    className={`px-3 py-1 text-xs font-mono rounded-[3px] transition-colors flex items-center gap-1.5 cursor-pointer ${
                      systemTab === 'tokens'
                        ? 'bg-[var(--color-surface-raised)] text-white font-semibold shadow-sm'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10'
                    }`}
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Tokens & WCAG</span>
                  </button>

                  <button
                    onClick={() => setSystemTab('workbench')}
                    className={`px-3 py-1 text-xs font-mono rounded-[3px] transition-colors flex items-center gap-1.5 cursor-pointer ${
                      systemTab === 'workbench'
                        ? 'bg-[var(--color-surface-raised)] text-white font-semibold shadow-sm'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10'
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    <span>7-State Workbench</span>
                  </button>

                  <button
                    onClick={() => setSystemTab('spec')}
                    className={`px-3 py-1 text-xs font-mono rounded-[3px] transition-colors flex items-center gap-1.5 cursor-pointer ${
                      systemTab === 'spec'
                        ? 'bg-[var(--color-surface-raised)] text-white font-semibold shadow-sm'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10'
                    }`}
                  >
                    <FileCode className="w-3 h-3" />
                    <span>QA Checklist & Spec</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsDesignSystemOpen(false)}
                  className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] rounded-[3px] glass-tile cursor-pointer"
                  aria-label="Close Design System Specs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body with Slide-In-Up Tab Transitions */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[var(--color-surface-base)]/80">
              <AnimatePresence mode="wait">
                <motion.div
                  key={systemTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {systemTab === 'tokens' && <MassTokenInspector />}
                  {systemTab === 'workbench' && <MassComponentWorkbench />}
                  {systemTab === 'spec' && <MassSpecDocument />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
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
