/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MassLabs Architectural Glassmorphic Sidebar & Tool Dock
 */

import React, { useState } from 'react';
import { MASSLABS_TOOLS, URBAN_MAP_DATASETS, MassLabTool } from '../data/tokens';
import { ProbahoLogo } from './ProbahoLogo';
import {
  Compass,
  Layers,
  MapPin,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Sliders,
  Sparkles,
  Maximize2,
  Code2,
  CheckCircle2,
  Play,
  Pause,
  FileCode2,
  Activity
} from 'lucide-react';

interface MassGlassSidebarProps {
  activeToolId: string;
  onSelectTool: (toolId: string) => void;
  isDay: boolean;
  currentMapIndex: number;
  onSelectMap: (index: number) => void;
  onOpenSiteAnalysis: () => void;
  onOpenDesignSystem?: () => void;
  blueprintZoom?: number;
  onZoomChange?: (zoom: number) => void;
  isBlueprintPaused?: boolean;
  onTogglePause?: () => void;
  blueprintSpeed?: number;
  onSpeedChange?: (speed: number) => void;
}

export const MassGlassSidebar: React.FC<MassGlassSidebarProps> = ({
  activeToolId,
  onSelectTool,
  isDay,
  currentMapIndex,
  onSelectMap,
  onOpenSiteAnalysis,
  onOpenDesignSystem,
  blueprintZoom = 0.40,
  onZoomChange,
  isBlueprintPaused = false,
  onTogglePause,
  blueprintSpeed = 1.0,
  onSpeedChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const activeTool = MASSLABS_TOOLS.find((t) => t.id === activeToolId) || MASSLABS_TOOLS[0];
  const activeMap = URBAN_MAP_DATASETS[currentMapIndex];

  return (
    <aside
      aria-label="Glassmorphic Architectural Sidebar & Tool Suite"
      className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex items-center select-none"
    >
      {/* 
        ========================================================================
        EXPANDED GLASSMORPHIC SIDEBAR DRAWER PANEL
        Slides smoothly to the left of the dock when expanded
        ========================================================================
      */}
      {isExpanded && (
        <div
          className={`mr-3 w-72 sm:w-80 rounded-[8px] p-4 transition-all duration-300 animate-in fade-in slide-in-from-right-4 backdrop-blur-2xl backdrop-saturate-200 border ${
            isDay
              ? 'bg-white/80 border-white shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1.5px_2px_rgba(255,255,255,1)] text-[#111113]'
              : 'bg-[#0c0e10]/85 border-white/20 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1.5px_1.5px_rgba(255,255,255,0.22)] text-[#eceae6]'
          }`}
          style={{
            backgroundImage: isDay
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 245, 240, 0.82) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.02) 100%)',
          }}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-surface-raised)] animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[var(--color-surface-raised)]">
                Probaho Telemetry
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-[3px] hover:bg-white/15 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
              title="Collapse sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Active Tool Spec Sheet */}
          <div className="py-3 space-y-2 border-b border-[var(--color-border-subtle)]">
            <div className="flex items-baseline justify-between">
              <h4 className="text-base font-bold tracking-tight text-[var(--color-text-primary)]">
                {activeTool.name}
              </h4>
              <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-[2px] bg-[var(--color-surface-raised)]/15 text-[var(--color-surface-raised)] border border-[var(--color-surface-raised)]/30 font-semibold">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-[var(--color-text-secondary)]">
              {activeTool.description}
            </p>

            <div className="pt-1 flex flex-wrap gap-1.5">
              {activeTool.meta.split('·').slice(0, 4).map((spec: string, i: number) => (
                <span
                  key={i}
                  className="text-[9.6px] font-mono px-2 py-0.5 rounded-[3px] glass-tile border border-[var(--color-border-subtle)] text-[var(--color-text-primary)]"
                >
                  {spec.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Streaming Cartography Quick Switcher */}
          <div className="py-3 space-y-2 border-b border-[var(--color-border-subtle)]">
            <div className="flex items-center justify-between text-[10.5px] font-mono text-[var(--color-text-secondary)]">
              <span className="flex items-center gap-1.5 uppercase font-medium">
                <MapPin className="w-3.5 h-3.5 text-[var(--color-surface-raised)]" />
                <span>Cadastral Projection</span>
              </span>
              <span className="text-[9px] text-[var(--color-surface-raised)]">4 REGIONS</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {URBAN_MAP_DATASETS.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => onSelectMap(idx)}
                  className={`px-2.5 py-1.5 rounded-[3px] text-left text-[11px] font-mono transition-all flex flex-col cursor-pointer ${
                    currentMapIndex === idx
                      ? isDay
                        ? 'bg-[#ece8df] border-2 border-[#16a34a] font-bold text-[#111113] shadow-sm'
                        : 'bg-[#142018] border-2 border-[#22c55e] font-bold text-[#eceae6] shadow-sm'
                      : isDay
                        ? 'bg-white/60 hover:bg-white/90 border border-black/10 text-[#4b5563]'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[#8a8a86]'
                  }`}
                >
                  <span className="font-semibold truncate">{m.cityName}</span>
                  <span className="text-[8.5px] opacity-75">{m.coordinates}</span>
                </button>
              ))}
            </div>

            {/* Blueprint Zoom Readout & Controls */}
            {onZoomChange && (
              <div className="pt-2 flex items-center justify-between text-[10px] font-mono border-t border-[var(--color-border-subtle)] mt-2">
                <span className="text-[var(--color-text-secondary)]">Framing:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onZoomChange(0.40)}
                    className={`px-1.5 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
                      Math.abs(blueprintZoom - 0.40) < 0.04
                        ? 'bg-[var(--color-surface-raised)] text-white font-bold'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10'
                    }`}
                    title="40% Compact Scale (Reduced blueprint size)"
                  >
                    40% (Compact)
                  </button>
                  <button
                    onClick={() => onZoomChange(0.50)}
                    className={`px-1.5 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
                      Math.abs(blueprintZoom - 0.50) < 0.04
                        ? 'bg-[var(--color-surface-raised)] text-white font-bold'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10'
                    }`}
                    title="50% Zoomed Out View"
                  >
                    50%
                  </button>
                  <button
                    onClick={() => onZoomChange(0.75)}
                    className={`px-1.5 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
                      Math.abs(blueprintZoom - 0.75) < 0.04
                        ? 'bg-[var(--color-surface-raised)] text-white font-bold'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10'
                    }`}
                    title="75% Balanced Scale"
                  >
                    75%
                  </button>
                  <button
                    onClick={() => onZoomChange(1.00)}
                    className={`px-1.5 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
                      Math.abs(blueprintZoom - 1.00) < 0.04
                        ? 'bg-[var(--color-surface-raised)] text-white font-bold'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10'
                    }`}
                    title="100% Standard Scale"
                  >
                    100%
                  </button>
                </div>
              </div>
            )}

            {/* Blueprint Animation Sequence Controls */}
            {onTogglePause && (
              <div className="pt-2 flex items-center justify-between text-[10px] font-mono border-t border-[var(--color-border-subtle)] mt-2">
                <span className="text-[var(--color-text-secondary)]">Sequence:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onTogglePause}
                    className={`px-2 py-0.5 rounded-[2px] flex items-center gap-1 text-[9.5px] font-bold cursor-pointer transition-colors ${
                      isBlueprintPaused
                        ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40'
                        : 'bg-[var(--color-surface-raised)] text-white'
                    }`}
                  >
                    {isBlueprintPaused ? <Play className="w-2.5 h-2.5 fill-current" /> : <Pause className="w-2.5 h-2.5 fill-current" />}
                    <span>{isBlueprintPaused ? 'RESUME' : 'PAUSE'}</span>
                  </button>

                  {onSpeedChange && [0.5, 1.0, 2.0].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => onSpeedChange(spd)}
                      className={`px-1.5 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
                        blueprintSpeed === spd && !isBlueprintPaused
                          ? 'bg-[var(--color-surface-raised)] text-white font-bold'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Direct Studio Launch Action */}
          <div className="pt-3 space-y-2">
            <button
              onClick={() => {
                onOpenSiteAnalysis();
                setIsExpanded(false);
              }}
              className="w-full py-2.5 px-3 rounded-[3px] font-mono text-xs font-bold text-white bg-[var(--color-surface-raised)] hover:brightness-110 active:translate-y-[0.5px] shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch {activeTool.name} Studio</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('tools');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-1.5 px-3 rounded-[3px] font-mono text-[10.5px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.08] border border-[var(--color-border-subtle)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3 h-3 rotate-90 text-[var(--color-surface-raised)]" />
              <span>Scroll to Engines Section</span>
            </button>

            {onOpenDesignSystem && (
              <button
                onClick={() => {
                  onOpenDesignSystem();
                  setIsExpanded(false);
                }}
                className="w-full py-1.5 px-3 rounded-[3px] font-mono text-[10.5px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.08] border border-[var(--color-border-subtle)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Code2 className="w-3 h-3 text-[var(--color-surface-raised)]" />
                <span>Design System & Tokens</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        CORE VERTICAL GLASSMORPHIC DOCK (Exact clone of screenshot with glass)
        1. Expand / Details Pill Toggle
        2. MassLabs
        3. archiMap
        4. Colorgram
        5. LaserFish
        ========================================================================
      */}
      <div
        className={`flex flex-col gap-1.5 p-1.5 rounded-[7px] transition-all duration-300 backdrop-blur-2xl backdrop-saturate-200 border relative ${
          isDay
            ? 'bg-white/70 border-white/90 shadow-[0_20px_45px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.05),inset_0_1.5px_2px_rgba(255,255,255,1)]'
            : 'bg-[#0c0e12]/65 border-white/20 shadow-[0_24px_55px_rgba(0,0,0,0.8),0_4px_16px_rgba(0,0,0,0.5),inset_0_1.5px_1.5px_rgba(255,255,255,0.25)]'
        }`}
        style={{
          backgroundImage: isDay
            ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.50) 100%)'
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 100%)',
        }}
      >
        {/* Subtle Specular Top Reflection Bevel */}
        <div
          className={`absolute inset-x-2 top-0 h-[1px] ${
            isDay ? 'bg-white' : 'bg-gradient-to-r from-transparent via-white/40 to-transparent'
          }`}
        />

        {/* Top Mini Expand Drawer Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-[60px] h-5 flex items-center justify-center gap-1 rounded-[3px] text-[8.5px] font-mono tracking-wider transition-all cursor-pointer ${
            isExpanded
              ? isDay ? 'bg-[#ece8df] text-[#111113]' : 'bg-white/15 text-white'
              : isDay ? 'hover:bg-white/90 text-[#6b7280]' : 'hover:bg-white/[0.08] text-[#8a8a86]'
          }`}
          title={isExpanded ? "Collapse tool details drawer" : "Expand tool telemetry drawer"}
        >
          {isExpanded ? (
            <>
              <ChevronRight className="w-2.5 h-2.5 text-[var(--color-surface-raised)]" />
              <span>HIDE</span>
            </>
          ) : (
            <>
              <ChevronLeft className="w-2.5 h-2.5 text-[var(--color-surface-raised)]" />
              <span>INFO</span>
            </>
          )}
        </button>

        {/* The 4 Tool Tiles */}
        {MASSLABS_TOOLS.filter((t) => t.id !== 'globee').map((tool) => {
          const isActive = tool.id === activeToolId;
          return (
            <button
              key={tool.id}
              onClick={() => {
                if (isActive && isExpanded) {
                  setIsExpanded(false);
                } else {
                  onSelectTool(tool.id);
                  setIsExpanded(true);
                }
              }}
              className={`w-[60px] h-[64px] flex flex-col items-center justify-center gap-1.5 rounded-[4px] transition-all duration-200 group relative cursor-pointer select-none ${
                isActive
                  ? isDay
                    ? 'bg-[#ece8df]/95 border-2 border-[#16a34a] text-[#111113] shadow-[0_4px_16px_rgba(22,163,74,0.22),inset_0_1.5px_1px_rgba(255,255,255,1)]'
                    : 'bg-[#142218]/90 border-2 border-[#22c55e] text-[#eceae6] shadow-[0_4px_18px_rgba(34,197,94,0.36),inset_0_1.5px_1.5px_rgba(255,255,255,0.25)]'
                  : isDay
                    ? 'bg-white/75 hover:bg-white/95 border border-white/90 hover:border-white text-[#4b5563] hover:text-[#111113] shadow-[0_2px_6px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.95)] hover:-translate-y-0.5'
                    : 'bg-white/[0.05] hover:bg-white/[0.10] border border-white/10 hover:border-white/25 text-[#8a8a86] hover:text-[#eceae6] shadow-[0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.10)] hover:-translate-y-0.5'
              }`}
              title={`${tool.name}: ${tool.headline}`}
            >
              {/* Tile ambient glow overlay on hover */}
              <div
                className={`absolute inset-0 rounded-[3px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                  isDay ? 'bg-white/30' : 'bg-white/[0.04]'
                }`}
              />

              {/* 1. Probaho dynamic emblem */}
              {tool.id === 'masslabs' && (
                <ProbahoLogo
                  className={`w-5 h-5 transition-colors drop-shadow-sm ${
                    isActive
                      ? isDay ? 'text-[#111113]' : 'text-[#eceae6]'
                      : isDay ? 'text-[#374151] group-hover:text-[#111113]' : 'text-[#8a8a86] group-hover:text-[#eceae6]'
                  }`}
                />
              )}

              {/* 2. Ownership Graph connected nodes */}
              {tool.id === 'archimap' && (
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg className="w-5 h-5 drop-shadow-sm" viewBox="0 0 24 24" fill="none">
                    <circle cx="6" cy="6" r="3" fill="#22c55e" />
                    <circle cx="18" cy="18" r="3" fill="#3b82f6" />
                    <circle cx="18" cy="6" r="3" fill="#eab308" />
                    <path d="M6 6L18 6M6 6L18 18" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" />
                  </svg>
                </div>
              )}

              {/* 3. DocCompare contradiction / split document view */}
              {tool.id === 'cologram' && (
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg className="w-5 h-5 drop-shadow-sm" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="8" height="18" rx="1.5" fill="#3b82f6" fillOpacity="0.85" />
                    <rect x="13" y="3" width="8" height="18" rx="1.5" fill="#ef4444" fillOpacity="0.85" />
                    <path d="M5 8h4M5 12h4M15 8h4M15 12h4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              )}

              {/* 4. FraudEngine risk scoring pulse */}
              {tool.id === 'laserfish' && (
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg className="w-5 h-5 drop-shadow-sm" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4z" fill="#f59e0b" fillOpacity="0.9" />
                    <path d="M12 8v5M12 16h.01" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              )}

              <span className="text-[9.5px] font-mono tracking-tight leading-none text-center font-medium max-w-[54px] truncate">
                {tool.shortName || tool.name}
              </span>

              {/* Active right tab indicator pip matching image */}
              {isActive && (
                <span
                  className={`absolute -right-[2px] top-1/2 -translate-y-1/2 w-1 h-5 rounded-l-[2px] shadow-md ${
                    isDay
                      ? 'bg-[#16a34a] shadow-[0_0_8px_rgba(22,163,74,0.5)]'
                      : 'bg-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.6)]'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
