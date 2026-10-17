/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Probaho — Animated Cadastral Engine Widgets & Section Transition Telemetry
 * 
 * Provides interactive, real-time micro-animated visualizations for:
 * 1. OwnershipGraphWidget: Temporal Dag lineage graph with traveling energy packets
 * 2. FraudEngineGaugeWidget: Radial risk score gauge with multi-signal telemetry bars
 * 3. DocCompareScannerWidget: Holographic dual-document scanner with sweeping laser
 * 4. AdversarialSimulatorWidget: Real-time synthetic attack oscilloscope & defense shield
 * 5. CadastralSectionTransitionBeam: High-tech coordinate stream between Hero and Section 02
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  GitBranch,
  FileCheck2,
  Cpu,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Radio,
  Scan,
  Activity,
  ArrowDown,
  Layers,
  Fingerprint,
  Lock,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// ============================================================================
// 1. OWNERSHIP GRAPH WIDGET (Engine 01)
// ============================================================================
export const OwnershipGraphWidget: React.FC<{ onLaunchStudio?: () => void }> = ({ onLaunchStudio }) => {
  const { isBangla } = useLanguage();
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [showCollisionBranch, setShowCollisionBranch] = useState<boolean>(true);

  const nodes = [
    {
      id: 0,
      label: 'CS 102',
      sub: '1940',
      year: '1940',
      x: 26,
      y: 55,
      r: 13,
      stroke: '#60a5fa',
      fill: 'url(#grad-node-cs)',
      subColor: '#93c5fd',
      type: 'CS',
    },
    {
      id: 1,
      label: 'SA 102',
      sub: '1962',
      year: '1962',
      x: 74,
      y: 32,
      r: 13,
      stroke: '#38bdf8',
      fill: 'url(#grad-node-sa)',
      subColor: '#7dd3fc',
      type: 'SA',
    },
    {
      id: 2,
      label: 'RS 912',
      sub: '1988',
      year: '1988',
      x: 124,
      y: 78,
      r: 14,
      stroke: '#2dd4bf',
      fill: 'url(#grad-node-rs)',
      subColor: '#5eead4',
      type: 'RS',
    },
    {
      id: 3,
      label: 'BS 1042',
      sub: '2021',
      year: '2021',
      x: 178,
      y: 48,
      r: 16,
      stroke: '#34d399',
      fill: 'url(#grad-node-bs)',
      subColor: '#6ee7b7',
      isTarget: true,
      type: 'BS',
    },
    {
      id: 4,
      label: 'Deed 6102',
      sub: '2026',
      year: '2026',
      x: 236,
      y: 30,
      r: 14,
      stroke: '#10b981',
      fill: 'url(#grad-node-deed)',
      subColor: '#a7f3d0',
      type: 'DEED',
    },
    // Collision Branch Nodes
    {
      id: 5,
      label: 'Deed 9810',
      sub: 'Fraud',
      year: '2026',
      x: 236,
      y: 84,
      r: 14,
      stroke: '#f43f5e',
      fill: 'url(#grad-node-fraud)',
      subColor: '#fca5a5',
      isDispute: true,
      type: 'FRAUD',
    },
    {
      id: 6,
      label: 'Lock 794',
      sub: '72h',
      year: '2026',
      x: 288,
      y: 84,
      r: 13,
      stroke: '#fbbf24',
      fill: 'url(#grad-node-lock)',
      subColor: '#fef08a',
      isLock: true,
      type: 'LOCK',
    },
  ];

  return (
    <div className="relative w-full rounded-[8px] bg-[#070b13] border border-emerald-500/30 dark:border-emerald-500/40 overflow-hidden p-3.5 flex flex-col justify-between select-none shadow-[0_8px_30px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.08)]">
      {/* Background Cartographic Micro-Grid with Radial Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,#070b13_95%)]" />

      {/* Top Status Bar with Collision Toggle */}
      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono mb-1.5 pb-1 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          </span>
          <span className="font-bold tracking-wider text-emerald-400 uppercase text-[10px]">
            {isBangla ? 'কালানুক্রমিক স্বত্ব টপোলজি' : 'TEMPORAL DAG TOPOLOGY'}
          </span>
          <span className="hidden sm:inline-block text-[9px] text-slate-500 font-mono tracking-tight">
            [CS·SA·RS·BS]
          </span>
        </div>

        {/* Quick Collision Branch Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowCollisionBranch(!showCollisionBranch);
          }}
          className={`px-2.5 py-0.5 rounded-[4px] border transition-all cursor-pointer flex items-center gap-1.5 text-[9.5px] font-medium tracking-tight ${
            showCollisionBranch
              ? 'bg-rose-950/70 border-rose-500/60 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)] hover:bg-rose-900/80'
              : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-500'
          }`}
          title="Toggle Fraud Collision Branch & Soft-Lock"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${showCollisionBranch ? 'bg-rose-400 shadow-[0_0_6px_#f43f5e] animate-pulse' : 'bg-emerald-400 shadow-[0_0_4px_#34d399]'}`} />
          <span>
            {isBangla
              ? (showCollisionBranch ? 'দ্বৈত বিক্রয় শাখা: সক্রিয়' : 'শুধুমাত্র বৈধ চেইন')
              : (showCollisionBranch ? 'Dispute Branch: ON' : 'Clean Chain Only')}
          </span>
        </button>
      </div>

      {/* Interactive Network Canvas */}
      <div className="relative z-10 w-full h-[108px] flex items-center justify-center">
        <svg viewBox="0 0 310 115" className="w-full h-full max-h-[115px]">
          <defs>
            {/* Multi-stop Node Fills for Tactile Optical Depth */}
            <radialGradient id="grad-node-cs" cx="35%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0b1324" />
            </radialGradient>
            <radialGradient id="grad-node-sa" cx="35%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#0c4a6e" />
              <stop offset="100%" stopColor="#082f49" />
            </radialGradient>
            <radialGradient id="grad-node-rs" cx="35%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#134e4a" />
              <stop offset="100%" stopColor="#042f2e" />
            </radialGradient>
            <radialGradient id="grad-node-bs" cx="35%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#065f46" />
              <stop offset="100%" stopColor="#022c22" />
            </radialGradient>
            <radialGradient id="grad-node-deed" cx="35%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064e3b" />
            </radialGradient>
            <radialGradient id="grad-node-fraud" cx="35%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#881337" />
              <stop offset="100%" stopColor="#4c0519" />
            </radialGradient>
            <radialGradient id="grad-node-lock" cx="35%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#451a03" />
            </radialGradient>

            {/* Edge Gradients */}
            <linearGradient id="edge-grad-legit" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.85"/>
              <stop offset="100%" stopColor="#34d399" stopOpacity="1"/>
            </linearGradient>
            <linearGradient id="edge-grad-deed" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#10b981" stopOpacity="1"/>
            </linearGradient>
            <linearGradient id="edge-grad-fraud" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.8"/>
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.95"/>
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="1"/>
            </linearGradient>
            <linearGradient id="edge-grad-lock" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="1"/>
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="1"/>
            </linearGradient>

            {/* Radiant Laser Dropshadow Filters */}
            <filter id="node-glow-legit" x="-35%" y="-35%" width="170%" height="170%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#34d399" floodOpacity="0.75"/>
            </filter>
            <filter id="node-glow-fraud" x="-35%" y="-35%" width="170%" height="170%">
              <feDropShadow dx="0" dy="0" stdDeviation="4.5" floodColor="#f43f5e" floodOpacity="0.85"/>
            </filter>
            <filter id="node-glow-lock" x="-35%" y="-35%" width="170%" height="170%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#fbbf24" floodOpacity="0.75"/>
            </filter>
          </defs>

          {/* Legitimate Lineage Edges */}
          <line x1="26" y1="55" x2="74" y2="32" stroke="rgba(96, 165, 250, 0.45)" strokeWidth="1.8" strokeDasharray="3 3"/>
          <line x1="74" y1="32" x2="124" y2="78" stroke="rgba(56, 189, 248, 0.55)" strokeWidth="1.8" strokeDasharray="3 3"/>
          <line x1="124" y1="78" x2="178" y2="48" stroke="url(#edge-grad-legit)" strokeWidth="2.5"/>
          <line x1="178" y1="48" x2="236" y2="30" stroke="url(#edge-grad-deed)" strokeWidth="2.2"/>

          {/* Traveling Legitimate Energy Pulses */}
          <circle r="2.8" fill="#93c5fd">
            <animateMotion path="M 26 55 L 74 32" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle r="3" fill="#38bdf8">
            <animateMotion path="M 74 32 L 124 78" dur="2.6s" repeatCount="indefinite" begin="0.6s" />
          </circle>
          <circle r="3.4" fill="#ffffff" filter="url(#node-glow-legit)">
            <animateMotion path="M 124 78 L 178 48" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle r="3" fill="#6ee7b7">
            <animateMotion path="M 178 48 L 236 30" dur="2.0s" repeatCount="indefinite" begin="0.4s" />
          </circle>

          {/* Disputed Double-Sale Collision Branch */}
          {showCollisionBranch && (
            <g className="collision-branch-layer">
              <path
                d="M 178 48 C 195 55, 210 75, 236 84"
                fill="none"
                stroke="url(#edge-grad-fraud)"
                strokeWidth="2.6"
                strokeDasharray="3 3"
                filter="url(#node-glow-fraud)"
              />
              <line x1="236" y1="84" x2="288" y2="84" stroke="url(#edge-grad-lock)" strokeWidth="2.6" strokeDasharray="2 3"/>

              {/* Red Collision Pulse Particle */}
              <circle r="3.5" fill="#f43f5e" filter="url(#node-glow-fraud)">
                <animateMotion path="M 178 48 C 195 55, 210 75, 236 84" dur="1.6s" repeatCount="indefinite" />
              </circle>
            </g>
          )}

          {/* Graph Nodes */}
          {nodes
            .filter((n) => (!n.isDispute && !n.isLock) || showCollisionBranch)
            .map((n) => {
              const isSelected = activeNode === n.id;
              return (
                <g
                  key={n.id}
                  className="cursor-pointer select-none group"
                  onMouseEnter={() => setActiveNode(n.id)}
                  onMouseLeave={() => setActiveNode(null)}
                  onClick={() => onLaunchStudio?.()}
                >
                  {/* Invisible Extended Hitbox to Guarantee 100% Stable Mouse Tracking Without Vibration */}
                  <circle cx={n.x} cy={n.y} r={n.r + 14} fill="transparent" />

                  {/* Outer Hover Accent Ring */}
                  {isSelected && (
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={n.r + 5}
                      fill="none"
                      stroke={n.stroke}
                      strokeWidth="1.6"
                      strokeDasharray="3 3"
                      opacity="0.85"
                      className="pointer-events-none"
                    />
                  )}

                  {/* Target / Conflict Radar Rings */}
                  {n.isTarget && (
                    <>
                      <circle cx={n.x} cy={n.y} r={n.r + 6} fill="none" stroke="#34d399" strokeWidth="1.2" opacity="0.6">
                        <animate attributeName="r" values="20;30;20" dur="2.4s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" values="0.8;0;0.8" dur="2.4s" repeatCount="indefinite"/>
                      </circle>
                      <circle cx={n.x} cy={n.y} r={n.r + 11} fill="none" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4">
                        <animate attributeName="r" values="24;36;24" dur="3s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite"/>
                      </circle>
                    </>
                  )}
                  {n.isDispute && (
                    <circle cx={n.x} cy={n.y} r={n.r + 5} fill="none" stroke="#f43f5e" strokeWidth="1.6" opacity="0.8">
                      <animate attributeName="r" values="18;28;18" dur="1.8s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.9;0;0.9" dur="1.8s" repeatCount="indefinite"/>
                    </circle>
                  )}
                  {n.isLock && (
                    <circle cx={n.x} cy={n.y} r={n.r + 4} fill="none" stroke="#fbbf24" strokeWidth="1.2" opacity="0.7">
                      <animate attributeName="r" values="16;24;16" dur="2.2s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.8;0;0.8" dur="2.2s" repeatCount="indefinite"/>
                    </circle>
                  )}

                  {/* Node Outer Circle with Radial Gradient & Glow Filter */}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={isSelected ? n.r + 2 : n.r}
                    fill={n.fill}
                    stroke={isSelected ? '#ffffff' : n.stroke}
                    strokeWidth={isSelected ? 2.6 : n.isTarget || n.isDispute ? 2.2 : 1.8}
                    filter={n.isTarget ? 'url(#node-glow-legit)' : n.isDispute ? 'url(#node-glow-fraud)' : n.isLock ? 'url(#node-glow-lock)' : undefined}
                    className="transition-all duration-150"
                  />

                  {/* Inner Optical Pip */}
                  <circle cx={n.x} cy={n.y - 4} r="2.2" fill={n.stroke} />

                  {/* Node Labels (High-contrast typography) */}
                  <text
                    x={n.x}
                    y={n.y + 3}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="6.6"
                    fontWeight="800"
                    fontFamily="monospace"
                    letterSpacing="-0.2px"
                  >
                    {n.label}
                  </text>
                  <text
                    x={n.x}
                    y={n.y + 9}
                    textAnchor="middle"
                    fill={n.subColor}
                    fontSize="5.6"
                    fontFamily="monospace"
                    fontWeight="700"
                  >
                    {n.sub}
                  </text>
                </g>
              );
            })}
        </svg>
      </div>

      {/* Bottom Live Diagnostic Chip */}
      <div className={`relative z-10 flex items-center justify-between px-3 py-1.5 rounded-[5px] border text-[9.5px] font-mono transition-all shadow-inner ${
        showCollisionBranch
          ? 'bg-rose-950/45 border-rose-500/35'
          : 'bg-emerald-950/35 border-emerald-500/30'
      }`}>
        <div className="flex items-center gap-1.5 truncate mr-2">
          {showCollisionBranch ? (
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-pulse" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          )}
          <span className="text-slate-200 truncate font-medium">
            {activeNode !== null
              ? activeNode === 5
                ? (isBangla ? 'দলিল ৯৮১০: তেজগাঁওয়ে অবৈধ দ্বৈত বিক্রয় চেষ্টা!' : 'Deed #9810: Illegal Concurrent Conveyance Draft!')
                : activeNode === 6
                ? (isBangla ? 'সফট লক #RES-৭৯৪০২১: লেনদেন ৭২ ঘণ্টার জন্য স্থগিত' : 'Soft-Lock #RES-794021: 72h Automated Caveat Active')
                : (isBangla ? `${nodes[activeNode].label} (${nodes[activeNode].year}) · ১৪.৫০ শতক খতিয়ান সংরক্ষিত` : `Inspecting ${nodes[activeNode].label} (${nodes[activeNode].year}) · 14.50 Dec Intact`)
              : showCollisionBranch
              ? (isBangla ? 'সতর্কতা: তেজগাঁওয়ে সমসাময়িক দ্বৈত বিক্রয় প্রতিহত' : 'Alert: Intercepted Concurrent Dual-Sale in Tejgaon')
              : (isBangla ? 'ধারাবাহিক হস্তান্তর রেকর্ড: ১০০% অক্ষত ও সুরক্ষিত' : 'Temporal Transfer Lineage: 100% Intact')}
          </span>
        </div>
        <span className={`shrink-0 font-bold px-2 py-0.5 rounded text-[9px] flex items-center gap-1 font-mono tracking-tight ${
          showCollisionBranch
            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
        }`}>
          {showCollisionBranch ? (
            <>
              <span>{isBangla ? 'লক ৭৯৪' : 'LOCK 794'}</span>
              <Lock className="w-2.5 h-2.5" />
            </>
          ) : (
            <>
              <span>{isBangla ? 'দাগ ১০৪২' : 'DAG 1042'}</span>
              <span>✓</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// 2. FRAUDENGINE RADIAL RISK GAUGE WIDGET (Engine 02)
// ============================================================================
export const FraudEngineGaugeWidget: React.FC = () => {
  const { isBangla } = useLanguage();
  const [score, setScore] = useState(84);

  useEffect(() => {
    const interval = setInterval(() => {
      setScore((prev) => (prev === 84 ? 86 : 84));
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[155px] rounded-[8px] bg-[#070b13] border border-rose-500/30 dark:border-rose-500/35 overflow-hidden p-3.5 flex flex-col justify-between select-none shadow-[0_8px_30px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.08)]">
      {/* Background Cartographic Micro-Grid with Radial Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(244, 63, 94, 0.35) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,#070b13_95%)]" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono mb-1 pb-1 border-b border-white/5">
        <div className="flex items-center gap-1.5 text-rose-400">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span className="font-bold tracking-wider">
            {isBangla ? 'আইনি ধারা #P3-04 সক্রিয়' : 'RULE #P3-04 TRIGGERED'}
          </span>
        </div>
        <span className="text-slate-400 text-[9px]">
          {isBangla ? '০-১০০ ব্যাখ্যাযোগ্য' : '0-100 EXPLAINABLE'}
        </span>
      </div>

      {/* Split Body: Left Circular Gauge, Right Multi-Signal Breakdown */}
      <div className="relative z-10 grid grid-cols-12 gap-2 items-center my-auto">
        {/* Left Gauge */}
        <div className="col-span-5 flex items-center justify-center relative">
          <svg viewBox="0 0 100 100" className="w-[84px] h-[84px]">
            {/* Background Track Arc */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="7"
              strokeDasharray="180 60"
              strokeLinecap="round"
              transform="rotate(135 50 50)"
            />
            {/* Active Risk Value Arc (Gradient Red-Amber) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="7.5"
              strokeDasharray="155 85"
              strokeLinecap="round"
              transform="rotate(135 50 50)"
              className="transition-all duration-700 ease-out"
              style={{ filter: 'drop-shadow(0 0 8px rgba(244,63,94,0.8))' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold font-mono text-rose-300 leading-none">{score}</span>
            <span className="text-[7.5px] font-mono text-rose-400 uppercase tracking-tighter mt-0.5 font-bold">
              {isBangla ? 'উচ্চ ঝুঁকি' : 'HIGH RISK'}
            </span>
          </div>
        </div>

        {/* Right Multi-Signal Meters */}
        <div className="col-span-7 space-y-1.5 text-[9.5px] font-mono">
          <div>
            <div className="flex justify-between text-slate-300 mb-0.5">
              <span>{isBangla ? 'দ্বৈত-বিক্রয় প্রি-লক' : 'Double-Sale Pre-Lock'}</span>
              <span className="text-rose-400 font-bold">96%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full w-[96%] animate-pulse shadow-[0_0_6px_#f43f5e]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-0.5">
              <span>{isBangla ? 'হিস্যা অতিরিক্ত হিসেব' : 'Area Share Inflation'}</span>
              <span className="text-amber-400 font-bold">14%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full w-[14%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-0.5">
              <span>{isBangla ? 'বাংলা এনএলপি ফনেটিক্স' : 'Bangla NLP Phonetics'}</span>
              <span className="text-emerald-400 font-bold">88%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[88%] shadow-[0_0_6px_#10b981]" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="relative z-10 flex items-center justify-between bg-rose-950/45 border border-rose-500/35 px-2.5 py-1.5 rounded-[5px] text-[9.5px] font-mono text-rose-200 shadow-inner">
        <span className="truncate">
          {isBangla ? 'কনকারেন্সি সংঘাত: ৭২ ঘণ্টা সফট-লক' : 'CONCURRENCY COLLISION: 72H SOFT-LOCK'}
        </span>
        <span className="text-rose-400 font-bold shrink-0 ml-1">
          {isBangla ? 'কার্যকর ✕' : 'ENFORCED ✕'}
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// 3. DOCCOMPARE DUAL-SCANNER WIDGET (Engine 03)
// ============================================================================
export const DocCompareScannerWidget: React.FC = () => {
  const { isBangla } = useLanguage();
  return (
    <div className="relative w-full h-[155px] rounded-[8px] bg-[#070b13] border border-cyan-500/30 dark:border-cyan-500/35 overflow-hidden p-3.5 flex flex-col justify-between select-none shadow-[0_8px_30px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.08)]">
      {/* Background Cartographic Micro-Grid with Radial Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,#070b13_95%)]" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono mb-1 pb-1 border-b border-white/5">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <Scan className="w-3 h-3 animate-spin text-cyan-400" />
          <span className="font-bold tracking-wider">
            {isBangla ? 'বাংলা ওসিআর তুলনামূলক স্ক্যান' : 'BANGLA OCR COMPARISON'}
          </span>
        </div>
        <span className="text-slate-400 text-[9px]">
          {isBangla ? 'নির্ভুলতা: ৯৯.১%' : 'CONFIDENCE: 99.1%'}
        </span>
      </div>

      {/* Side-by-Side Dual Document Panels with Scanning Laser */}
      <div className="relative z-10 my-auto grid grid-cols-2 gap-2 h-[82px] overflow-hidden">
        {/* The Sweeping Neon Laser Beam */}
        <motion.div
          className="absolute left-0 right-0 h-[1.8px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] z-20 pointer-events-none"
          animate={{ y: [0, 78, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Document A: Sub-Registry Deed */}
        <div className="bg-[#0b1424]/90 border border-cyan-500/30 rounded-[5px] p-2 flex flex-col justify-between font-mono text-[9px] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 border-b border-white/10 pb-1">
            <span>{isBangla ? 'দলিল #৯১২' : 'DEED #912'}</span>
            <span className="text-cyan-400 font-bold">{isBangla ? 'আইন বিভাগ' : 'LAW MIN'}</span>
          </div>
          <div className="space-y-1 mt-1 text-slate-200">
            <div>{isBangla ? 'বিক্রেতা: মোঃ রফিকুল' : 'Seller: Md. Rafiqul'}</div>
            <div className="text-emerald-400 font-bold">{isBangla ? 'দাগ: ১০৪২' : 'Dag: 1042'}</div>
            <div className="text-slate-400">{isBangla ? 'পরিমাণ: ১৪.৫০ শতাংশ' : 'Area: 14.50 Shotok'}</div>
          </div>
        </div>

        {/* Document B: AC Land Khatian (With Flagged Contradiction) */}
        <div className="bg-[#1f0b12]/90 border border-rose-500/40 rounded-[5px] p-2 flex flex-col justify-between font-mono text-[9px] relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between text-slate-400 border-b border-white/10 pb-1">
            <span>{isBangla ? 'খতিয়ান #১০৪২' : 'KHATIAN #1042'}</span>
            <span className="text-amber-400 font-bold">{isBangla ? 'ভূমি বিভাগ' : 'LAND MIN'}</span>
          </div>
          <div className="space-y-1 mt-1">
            <div className="text-slate-200">{isBangla ? 'মালিক: মোঃ রফিকুল' : 'Owner: Md. Rafiqul'}</div>
            <div className="text-rose-400 font-bold flex items-center justify-between">
              <span>{isBangla ? 'দাগ: ১০২৪' : 'Dag: 1024'}</span>
              <span className="bg-rose-500 text-black text-[7px] px-1 py-0.2 rounded font-black animate-pulse">
                {isBangla ? 'অসঙ্গতি' : 'MISMATCH'}
              </span>
            </div>
            <div className="text-slate-400">{isBangla ? 'পরিমাণ: ১৪.৫০ শতাংশ' : 'Area: 14.50 Shotok'}</div>
          </div>
        </div>
      </div>

      {/* Bottom Contradiction Telemetry Badge */}
      <div className="relative z-10 flex items-center justify-between bg-black/80 px-2.5 py-1.5 rounded-[5px] border border-white/10 text-[9.5px] font-mono shadow-inner">
        <span className="text-rose-400 font-medium truncate">
          {isBangla ? 'দাগ নম্বর অসঙ্গতি: ১০৪২ ≠ ১০২৪' : 'DAG NUMBER CONTRADICTION: 1042 ≠ 1024'}
        </span>
        <span className="text-emerald-400 font-semibold shrink-0 ml-1">
          {isBangla ? 'প্রমাণ সংরক্ষিত' : 'EVIDENCE LOGGED'}
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// 4. ADVERSARIAL SIMULATOR BENCHMARK WIDGET (Engine 04)
// ============================================================================
export const AdversarialSimulatorWidget: React.FC = () => {
  const { isBangla } = useLanguage();
  const [attackCount, setAttackCount] = useState(5000);

  useEffect(() => {
    const interval = setInterval(() => {
      setAttackCount((prev) => prev + Math.floor(Math.random() * 12) + 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[155px] rounded-[8px] bg-[#070b13] border border-emerald-500/30 dark:border-emerald-500/35 overflow-hidden p-3.5 flex flex-col justify-between select-none shadow-[0_8px_30px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.08)]">
      {/* Background Cartographic Micro-Grid with Radial Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(52, 211, 153, 0.35) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,#070b13_95%)]" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono mb-1 pb-1 border-b border-white/5">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span className="font-bold tracking-wider">
            {isBangla ? 'স্ট্রেস-টেস্ট বেঞ্চমার্ক' : 'STRESS-TEST BENCHMARK'}
          </span>
        </div>
        <span className="text-slate-400 text-[9px]">
          {isBangla ? 'সিন্থেটিক ইনজেকশন' : 'SYNTHETIC INJECTION'}
        </span>
      </div>

      {/* Attack Injection Oscilloscope / Stream Waveform */}
      <div className="relative z-10 my-auto w-full h-[76px] flex items-center justify-center">
        <svg viewBox="0 0 280 65" className="w-full h-full">
          <defs>
            <linearGradient id="shield-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.0"/>
            </linearGradient>
          </defs>

          {/* Oscilloscope Grid Lines */}
          <line x1="0" y1="32" x2="280" y2="32" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="2 4"/>
          <line x1="140" y1="0" x2="140" y2="65" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="2 4"/>

          {/* Defense Firewall Barrier at Center */}
          <line x1="140" y1="6" x2="140" y2="59" stroke="#34d399" strokeWidth="2.2" strokeDasharray="4 2"/>
          <circle cx="140" cy="32" r="16" fill="url(#shield-grad)" stroke="#34d399" strokeWidth="1" opacity="0.8">
            <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
          </circle>

          {/* Incoming Rogue Attack Particles (Left to Center) */}
          <circle r="3" fill="#f43f5e">
            <animate attributeName="cx" values="15;140" dur="1.8s" repeatCount="indefinite"/>
            <animate attributeName="cy" values="22;32" dur="1.8s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0" dur="1.8s" repeatCount="indefinite"/>
          </circle>
          <circle r="3" fill="#f43f5e">
            <animate attributeName="cx" values="10;140" dur="2.3s" repeatCount="indefinite" begin="0.6s"/>
            <animate attributeName="cy" values="42;32" dur="2.3s" repeatCount="indefinite" begin="0.6s"/>
            <animate attributeName="opacity" values="1;0" dur="2.3s" repeatCount="indefinite" begin="0.6s"/>
          </circle>

          {/* Defense Signal Waveform */}
          <path
            d="M 140 32 Q 160 12 180 32 T 220 32 T 260 32 T 280 32"
            fill="none"
            stroke="#34d399"
            strokeWidth="2"
            className="animate-pulse"
          />
        </svg>

        {/* Live Attack Counter Floating Overlay */}
        <div className="absolute right-2 top-1 text-right font-mono">
          <div className="text-[12px] font-bold text-white tracking-tight">{attackCount.toLocaleString()}</div>
          <div className="text-[7.5px] text-emerald-400/80 uppercase font-semibold">
            {isBangla ? 'পরীক্ষিত ভেক্টর' : 'VECTORS TESTED'}
          </div>
        </div>
      </div>

      {/* Bottom KPI Row */}
      <div className="relative z-10 grid grid-cols-3 gap-1.5 bg-black/80 px-2.5 py-1.5 rounded-[5px] border border-white/10 text-[9px] font-mono text-center shadow-inner">
        <div>
          <span className="text-slate-400">{isBangla ? 'শনাক্তকরণ: ' : 'CATCH RATE: '}</span>
          <span className="text-emerald-400 font-bold">99.8%</span>
        </div>
        <div>
          <span className="text-slate-400">{isBangla ? 'বিলম্ব: ' : 'LATENCY: '}</span>
          <span className="text-cyan-400 font-bold">12ms</span>
        </div>
        <div>
          <span className="text-slate-400">{isBangla ? 'ভুল সংকেত: ' : 'FP RATE: '}</span>
          <span className="text-slate-200 font-bold">&lt;0.02%</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 5. CADASTRAL SECTION TRANSITION BEAM (Divider between Hero & Section 02)
// ============================================================================
export const CadastralSectionTransitionBeam: React.FC = () => {
  const { isBangla, t } = useLanguage();
  return (
    <div className="relative w-full overflow-hidden bg-[var(--color-surface-strong)] border-y border-[var(--color-border-subtle)] py-3 px-4 sm:px-8 select-none transition-colors duration-200">
      {/* Moving Laser Beam Runner along the Top Edge */}
      <motion.div
        className="absolute top-0 left-0 w-48 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-surface-raised)] to-transparent shadow-[0_0_12px_#22c55e]"
        animate={{ x: ['-100%', '800%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] font-mono">
        {/* Left Telemetry Feed */}
        <div className="flex items-center gap-2.5 text-[var(--color-text-secondary)]">
          <span className="w-2 h-2 rounded-full bg-[var(--color-surface-raised)] animate-ping" />
          <span className="text-[var(--color-surface-raised)] font-bold">
            {isBangla ? 'ক্যাডাস্ট্রাল লাইভ স্ট্রিম:' : 'STREAMING CADASTRAL TELEMETRY:'}
          </span>
          <span className="text-[var(--color-text-secondary)] opacity-85 hidden sm:inline">
            {isBangla
              ? 'ধানমন্ডি মৌজা (দাগ ১০৪২) · ৪টি ইঞ্জিন সক্রিয় · ১০০% লেজার সততা'
              : 'DHANMONDI MOUZA (DAG 1042) · 4 ENGINES ONLINE · 100% LEDGER INTEGRITY'}
          </span>
        </div>

        {/* Right Section Navigation Indicator */}
        <div className="flex items-center gap-4 text-[var(--color-text-secondary)]">
          <span className="text-xs text-[var(--color-surface-raised)] font-bold">
            {t.transitionBeam.section02}
          </span>
          <motion.a
            href="#tools"
            className="flex items-center gap-1.5 text-[var(--color-text-primary)] hover:text-[var(--color-surface-raised)] transition-colors cursor-pointer group font-semibold"
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span>{t.transitionBeam.exploreEngines}</span>
            <ArrowDown className="w-3.5 h-3.5 text-[var(--color-surface-raised)] group-hover:translate-y-0.5 transition-transform" />
          </motion.a>
        </div>
      </div>
    </div>
  );
};
