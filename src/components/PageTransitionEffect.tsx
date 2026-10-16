/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Probaho — Professional Page Transition & Section Navigator System
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Sparkles, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export interface SectionMeta {
  id: string;
  name: string;
  num: string;
  nextLabel: string;
}

export const SECTIONS: SectionMeta[] = [
  { id: 'hero', name: 'Overview', num: '01', nextLabel: 'Detection Engines' },
  { id: 'tools', name: 'Detection Engines', num: '02', nextLabel: 'Evidence Archive' },
  { id: 'projects', name: 'Evidence Archive', num: '03', nextLabel: 'Adversarial Simulator' },
  { id: 'methodology', name: 'Adversarial Simulator', num: '04', nextLabel: 'Cadastral Practice' },
  { id: 'practice', name: 'Cadastral Practice', num: '05', nextLabel: 'Pricing Plans' },
  { id: 'pricing', name: 'Pricing & Plans', num: '06', nextLabel: 'Back to Top' },
];

interface PageTransitionEffectProps {
  onTransitionStart?: () => void;
}

export const PageTransitionEffect: React.FC<PageTransitionEffectProps> = ({
  onTransitionStart,
}) => {
  const { isDay } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [isTransitionWipeActive, setIsTransitionWipeActive] = useState(false);
  const [wipeDirection, setWipeDirection] = useState<'down' | 'up'>('down');
  const [transitionLabel, setTransitionLabel] = useState('');

  // Track window scroll progress and active section
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));

      // Determine active section by measuring offsets
      const sectionElements = SECTIONS.map((s) => {
        if (s.id === 'hero') return { id: s.id, top: 0 };
        const el = document.getElementById(s.id);
        return {
          id: s.id,
          top: el ? el.offsetTop - 180 : Infinity,
        };
      });

      let currentIdx = 0;
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        if (currentScroll >= sectionElements[i].top) {
          currentIdx = i;
          break;
        }
      }
      setActiveSectionIndex(currentIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger high-tech cinematic page/section transition effect
  const triggerTransition = (targetIndex: number) => {
    const isGoingDown = targetIndex > activeSectionIndex;
    setWipeDirection(isGoingDown ? 'down' : 'up');
    const targetSection = SECTIONS[targetIndex];
    setTransitionLabel(targetSection.name);
    setIsTransitionWipeActive(true);

    if (onTransitionStart) onTransitionStart();

    // Scroll after slight delay so the transition curtain sweeps seamlessly
    setTimeout(() => {
      if (targetSection.id === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(targetSection.id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 120);

    // Fade out transition wipe
    setTimeout(() => {
      setIsTransitionWipeActive(false);
    }, 600);
  };

  const handleNextSection = () => {
    if (activeSectionIndex < SECTIONS.length - 1) {
      triggerTransition(activeSectionIndex + 1);
    } else {
      triggerTransition(0); // Loop back to top
    }
  };

  const handlePrevSection = () => {
    if (activeSectionIndex > 0) {
      triggerTransition(activeSectionIndex - 1);
    }
  };

  const currentSection = SECTIONS[activeSectionIndex] || SECTIONS[0];
  const nextSection = SECTIONS[activeSectionIndex + 1];

  return (
    <>
      {/* 
        ========================================================================
        1. TOP LUMINOUS SCROLL PROGRESS BAR WITH GLOWING RUNNER
        ========================================================================
      */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none select-none">
        <div
          className="h-full bg-gradient-to-r from-[var(--color-surface-raised)] via-[#3b82f6] to-[var(--color-surface-raised)] shadow-[0_0_12px_rgba(34,197,94,0.9)] transition-all duration-150 ease-out relative"
          style={{ width: `${scrollProgress}%` }}
        >
          {/* Glowing head pip */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#22c55e] animate-pulse" />
        </div>
      </div>

      {/* 
        ========================================================================
        2. CINEMATIC SHUTTER / BEAM VIEW TRANSITION OVERLAY
        Fires whenever the user advances to the next page or clicks a transition
        ========================================================================
      */}
      <AnimatePresence>
        {isTransitionWipeActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 pointer-events-none select-none overflow-hidden flex flex-col justify-center items-center backdrop-blur-sm"
          >
            {/* Luminous Shutter Beam */}
            <motion.div
              initial={{
                y: wipeDirection === 'down' ? '-100%' : '100%',
                opacity: 0.9,
              }}
              animate={{
                y: '0%',
                opacity: [0, 0.85, 0.95, 0.85, 0],
              }}
              exit={{
                y: wipeDirection === 'down' ? '100%' : '-100%',
                opacity: 0,
              }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0 h-44 bg-gradient-to-b from-transparent via-[var(--color-surface-raised)]/20 to-transparent flex items-center justify-center"
            >
              <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-[var(--color-surface-raised)] to-transparent shadow-[0_0_20px_rgba(34,197,94,1)]" />
            </motion.div>

            {/* HUD Transition Pill in Center */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: wipeDirection === 'down' ? -15 : 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: wipeDirection === 'down' ? 15 : -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={`glass-panel px-6 py-3 rounded-[6px] border border-[var(--color-surface-raised)]/40 shadow-2xl flex items-center gap-3 font-mono text-xs ${
                isDay ? 'bg-white/90 text-black' : 'bg-black/90 text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[var(--color-surface-raised)] animate-ping" />
              <div className="flex flex-col">
                <span className="text-[9.5px] uppercase tracking-wider text-[var(--color-surface-raised)] font-bold">
                  PROBAHO // CADASTRAL NAVIGATION
                </span>
                <span className="font-semibold text-sm">
                  Entering {transitionLabel}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        ========================================================================
        3. FLOATING SECTION NAVIGATOR & "NEXT PAGE" CONTROLLER (BOTTOM-LEFT)
        ========================================================================
      */}
      <div className="fixed bottom-5 left-4 sm:left-8 z-40 select-none flex items-center gap-2">
        <div
          className={`flex items-center gap-2 p-1.5 rounded-[6px] border transition-all duration-300 backdrop-blur-2xl backdrop-saturate-180 shadow-2xl ${
            isDay
              ? 'bg-white/80 border-white/90 text-[#111113] shadow-[0_12px_36px_rgba(0,0,0,0.1)]'
              : 'bg-[#0d0f12]/80 border-white/15 text-[#eceae6] shadow-[0_16px_40px_rgba(0,0,0,0.7)]'
          }`}
        >
          {/* Previous Section Button */}
          {activeSectionIndex > 0 && (
            <button
              onClick={handlePrevSection}
              className={`p-1.5 rounded-[4px] transition-colors cursor-pointer ${
                isDay
                  ? 'hover:bg-black/5 text-[#4b5563] hover:text-black'
                  : 'hover:bg-white/10 text-[#8a8a86] hover:text-white'
              }`}
              title="Previous section"
              aria-label="Previous section"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Section Indicator Readout */}
          <div className="px-2.5 py-1 flex items-center gap-2 border-r border-[var(--color-border-subtle)] font-mono text-xs">
            <span className="text-[10px] text-[var(--color-surface-raised)] font-bold">
              {currentSection.num}
            </span>
            <span className="text-[10px] text-[var(--color-text-tertiary)]">/</span>
            <span className="text-[10px] text-[var(--color-text-secondary)] font-medium">
              06
            </span>
            <span className="hidden sm:inline text-xs font-semibold text-[var(--color-text-primary)] pl-1">
              {currentSection.name}
            </span>
          </div>

          {/* Next Page / Section Primary Action */}
          <button
            onClick={handleNextSection}
            className="flex items-center gap-2 px-3 py-1.5 rounded-[4px] font-mono text-xs font-bold text-white bg-[var(--color-surface-raised)] hover:brightness-110 active:translate-y-[0.5px] transition-all cursor-pointer shadow-[0_4px_14px_rgba(34,197,94,0.35)] group"
            title={nextSection ? `Advance to ${nextSection.name}` : 'Back to Top'}
          >
            <span>{currentSection.nextLabel}</span>
            {nextSection ? (
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};
