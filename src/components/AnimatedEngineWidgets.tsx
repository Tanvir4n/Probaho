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
  RotateCcw,
  SlidersHorizontal,
  Scale,
  ShieldCheck,
  Zap,
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
export interface FraudEngineGaugeWidgetProps {
  isSimulated?: boolean;
  onToggleSimulate?: (simulated: boolean) => void;
  onOpenStudio?: () => void;
}

interface DeedScenario {
  id: string;
  nameEn: string;
  nameBn: string;
  locationEn: string;
  locationBn: string;
  ruleCodeEn: string;
  ruleCodeBn: string;
  statuteCitationEn: string;
  statuteCitationBn: string;
  baseScore: number;
  remediedScore: number;
  severity: 'CRITICAL' | 'ELEVATED' | 'PRISTINE' | 'MODERATE';
  themeColor: string;
  glowColor: string;
  signals: {
    nameEn: string;
    nameBn: string;
    baseVal: number;
    remediedVal: number;
    color: string;
  }[];
  rawNoticeEn: string;
  rawNoticeBn: string;
  remedyNoticeEn: string;
  remedyNoticeBn: string;
}

const FRAUD_SCENARIOS: DeedScenario[] = [
  {
    id: 'dhanmondi',
    nameEn: 'Dhanmondi #142',
    nameBn: 'ধানমন্ডি #১৪২',
    locationEn: 'Dhanmondi · Plot #142',
    locationBn: 'ধানমন্ডি · দাগ নং ১৪২',
    ruleCodeEn: 'RULE #P3-04 TRIGGERED',
    ruleCodeBn: 'আইনি ধারা #P3-04 সক্রিয়',
    statuteCitationEn: 'TP Act §53A · Double-Sale Pre-Lock',
    statuteCitationBn: 'সম্পত্তি হস্তান্তর আইন ৫৩এ ধারা',
    baseScore: 88,
    remediedScore: 12,
    severity: 'CRITICAL',
    themeColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    signals: [
      { nameEn: 'Double-Sale Pre-Lock', nameBn: 'দ্বৈত-বিক্রয় প্রি-লক', baseVal: 96, remediedVal: 0, color: '#f43f5e' },
      { nameEn: 'Area Share Inflation', nameBn: 'হিস্যা অতিরিক্ত হিসেব', baseVal: 18, remediedVal: 4, color: '#f59e0b' },
      { nameEn: 'Bangla NLP Phonetics', nameBn: 'বাংলা এনএলপি ফনেটিক্স', baseVal: 84, remediedVal: 98, color: '#10b981' },
    ],
    rawNoticeEn: 'CONCURRENCY COLLISION: 72H SOFT-LOCK ENFORCED ✕',
    rawNoticeBn: 'কনকারেন্সি সংঘাত: ৭২ ঘণ্টা সফট-লক কার্যকর ✕',
    remedyNoticeEn: 'CURED: BIOMETRIC NID + 4-HEIR CONSENT HASH (Δ -76 PTS) ✓',
    remedyNoticeBn: 'সমাধান: বায়োমেট্রিক এনআইডি + ওয়ারিশ সম্মতি হ্যাশ (Δ -৭৬) ✓',
  },
  {
    id: 'gulshan',
    nameEn: 'Gulshan #88',
    nameBn: 'গুলশান #৮৮',
    locationEn: 'Gulshan-2 · Plot #88',
    locationBn: 'গুলশান-২ · দাগ নং ৮৮',
    ruleCodeEn: 'RULE #A7-12 TRIGGERED',
    ruleCodeBn: 'আইনি ধারা #A7-12 সক্রিয়',
    statuteCitationEn: 'SAT Act §89 · Excess Share Deeding',
    statuteCitationBn: 'রাষ্ট্রীয় অধিগ্রহণ আইন ৮৯ ধারা',
    baseScore: 64,
    remediedScore: 14,
    severity: 'ELEVATED',
    themeColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    signals: [
      { nameEn: 'Double-Sale Pre-Lock', nameBn: 'দ্বৈত-বিক্রয় প্রি-লক', baseVal: 6, remediedVal: 0, color: '#f43f5e' },
      { nameEn: 'Area Share Inflation', nameBn: 'হিস্যা অতিরিক্ত হিসেব', baseVal: 92, remediedVal: 2, color: '#f59e0b' },
      { nameEn: 'Bangla NLP Phonetics', nameBn: 'বাংলা এনএলপি ফনেটিক্স', baseVal: 48, remediedVal: 94, color: '#10b981' },
    ],
    rawNoticeEn: 'ANOMALY: 2.4 KATHA OVER CS KHATIAN CEILING ✕',
    rawNoticeBn: 'অসঙ্গতি: সিএস খতিয়ানের চেয়ে ২.৪ কাঠা বেশি ✕',
    remedyNoticeEn: 'CURED: RECTIFICATION DEED (ভ্রম সংশোধন) EXECUTED (Δ -50 PTS) ✓',
    remedyNoticeBn: 'সমাধান: ভ্রম সংশোধন দলিল সম্পাদন ও হিস্যা সমন্বয় (Δ -৫০) ✓',
  },
  {
    id: 'uttara',
    nameEn: 'Uttara #204',
    nameBn: 'উত্তরা #২০৪',
    locationEn: 'Uttara Sec-4 · Plot #204',
    locationBn: 'উত্তরা ৪ নং সেক্টর · দাগ ২০৪',
    ruleCodeEn: 'RULE #V1-01 VERIFIED',
    ruleCodeBn: 'আইনি ধারা #V1-01 যাচাইকৃত',
    statuteCitationEn: 'CS→SA→RS→BS Continuous Lineage Chain',
    statuteCitationBn: 'সিএস→এসএ→আরএস→বিএস নিরবচ্ছিন্ন ধারা',
    baseScore: 8,
    remediedScore: 8,
    severity: 'PRISTINE',
    themeColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    signals: [
      { nameEn: 'Double-Sale Pre-Lock', nameBn: 'দ্বৈত-বিক্রয় প্রি-লক', baseVal: 0, remediedVal: 0, color: '#10b981' },
      { nameEn: 'Area Share Inflation', nameBn: 'হিস্যা অতিরিক্ত হিসেব', baseVal: 2, remediedVal: 2, color: '#10b981' },
      { nameEn: 'Bangla NLP Phonetics', nameBn: 'বাংলা এনএলপি ফনেটিক্স', baseVal: 99, remediedVal: 99, color: '#10b981' },
    ],
    rawNoticeEn: 'PRISTINE TITLE: ZERO ENCUMBRANCE · FULL DAG CLEARANCE ✓',
    rawNoticeBn: 'নিখুঁত মালিকানা: কোনো দায় নেই · সম্পূর্ণ দাগ বৈধ ✓',
    remedyNoticeEn: 'PRISTINE TITLE: 86-YEAR LINEAGE VERIFIED ON LEDGER ✓',
    remedyNoticeBn: 'নিখুঁত মালিকানা: লেজারে ৮৬ বছরের ধারাবাহিকতা প্রমাণিত ✓',
  },
  {
    id: 'mirpur',
    nameEn: 'Mirpur #409',
    nameBn: 'মিরপুর #৪০৯',
    locationEn: 'Mirpur Mouza · Plot #409',
    locationBn: 'মিরপুর মৌজা · দাগ নং ৪০৯',
    ruleCodeEn: 'RULE #N2-03 RESOLVED',
    ruleCodeBn: 'আইনি ধারা #N2-03 মীমাংসিত',
    statuteCitationEn: 'Phonetic Levenshtein Distance & Soundex',
    statuteCitationBn: 'বাংলা ফোনেটিক লেভেনস্টাইন দূরত্ব বিশ্লেষণ',
    baseScore: 38,
    remediedScore: 6,
    severity: 'MODERATE',
    themeColor: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    signals: [
      { nameEn: 'Double-Sale Pre-Lock', nameBn: 'দ্বৈত-বিক্রয় প্রি-লক', baseVal: 4, remediedVal: 0, color: '#f43f5e' },
      { nameEn: 'Area Share Inflation', nameBn: 'হিস্যা অতিরিক্ত হিসেব', baseVal: 8, remediedVal: 0, color: '#f59e0b' },
      { nameEn: 'Bangla NLP Phonetics', nameBn: 'বাংলা এনএলপি ফনেটিক্স', baseVal: 76, remediedVal: 99, color: '#06b6d4' },
    ],
    rawNoticeEn: 'PHONETIC ALIAS: "মোসাঃ সালেহা" vs "সালেহা খাতুন" ✕',
    rawNoticeBn: 'নামের বানানে অমিল: "মোসাঃ সালেহা" বনাম "সালেহা খাতুন" ✕',
    remedyNoticeEn: 'CURED: NID BIOMETRIC MATCH RECONCILED IDENTITY (Δ -32 PTS) ✓',
    remedyNoticeBn: 'সমাধান: স্মার্ট এনআইডি বায়োমেট্রিক দিয়ে নাম সমন্বয় (Δ -৩২) ✓',
  },
];

export const FraudEngineGaugeWidget: React.FC<FraudEngineGaugeWidgetProps> = ({
  isSimulated: externalSimulated,
  onToggleSimulate,
  onOpenStudio,
}) => {
  const { isBangla } = useLanguage();
  const [selectedCaseId, setSelectedCaseId] = useState<string>('dhanmondi');
  const [internalSimulated, setInternalSimulated] = useState<boolean>(false);

  const isWhatIfActive = externalSimulated !== undefined ? externalSimulated : internalSimulated;

  const handleToggleWhatIf = () => {
    const nextVal = !isWhatIfActive;
    if (onToggleSimulate) {
      onToggleSimulate(nextVal);
    } else {
      setInternalSimulated(nextVal);
    }
  };

  const scenario = FRAUD_SCENARIOS.find((s) => s.id === selectedCaseId) || FRAUD_SCENARIOS[0];
  const currentScore = isWhatIfActive ? scenario.remediedScore : scenario.baseScore;
  const isCured = isWhatIfActive && scenario.baseScore > scenario.remediedScore;
  const activeColor = isWhatIfActive ? '#10b981' : scenario.themeColor;

  // Arc math: circumference of radius 38 is ~238.8. A 240-degree arc has length 159.2.
  const arcTotal = 160;
  const arcOffset = Math.max(0, arcTotal - (currentScore / 100) * arcTotal);

  return (
    <div className="relative w-full rounded-[8px] bg-[#070b13] border border-[var(--color-border-subtle)] dark:border-rose-500/25 overflow-hidden p-3.5 flex flex-col justify-between select-none shadow-[0_8px_30px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.08)]">
      {/* Background Cartographic Micro-Grid with Radial Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, ${activeColor}55 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,#070b13_95%)]" />

      {/* Interactive Scenario Selector & What-If Switch */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-1.5 pb-2 border-b border-white/5 mb-2">
        {/* Scenario Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
          {FRAUD_SCENARIOS.map((s) => {
            const isSelected = s.id === selectedCaseId;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedCaseId(s.id)}
                className={`px-2 py-0.5 text-[9.5px] font-mono rounded-[3px] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  isSelected
                    ? 'bg-white/15 text-white font-semibold border border-white/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: s.themeColor }}
                />
                <span>{isBangla ? s.nameBn : s.nameEn}</span>
              </button>
            );
          })}
        </div>

        {/* What-If Counterfactual Toggle Switch */}
        <button
          onClick={handleToggleWhatIf}
          className={`px-2 py-0.5 text-[9px] font-mono rounded-[3px] border transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
            isWhatIfActive
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold shadow-[0_0_8px_rgba(16,185,129,0.35)]'
              : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title={isBangla ? 'কাউন্টারফ্যাকচুয়াল প্রতিকার সিমুলেশন চালু/বন্ধ' : 'Toggle Counterfactual Remedy Simulation'}
        >
          <RotateCcw className={`w-2.5 h-2.5 ${isWhatIfActive ? 'rotate-180 text-emerald-400' : 'text-slate-400'} transition-transform duration-500`} />
          <span>{isBangla ? 'প্রতিকার সিমুলেশন' : 'What-If Remedy'}</span>
          <span className={`w-1.5 h-1.5 rounded-full ${isWhatIfActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
        </button>
      </div>

      {/* Top Header: Active Rule & Statutory Citation */}
      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono mb-2 pb-1.5 border-b border-white/5">
        <div className="flex items-center gap-1.5 truncate">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{
              backgroundColor: activeColor,
              boxShadow: `0 0 8px ${activeColor}`,
            }}
          />
          <span
            className="font-bold tracking-wider truncate"
            style={{ color: activeColor }}
          >
            {isCured
              ? (isBangla ? `${scenario.ruleCodeBn} নিরাময়কৃত` : `${scenario.ruleCodeEn.replace('TRIGGERED', 'CURED')}`)
              : (isBangla ? scenario.ruleCodeBn : scenario.ruleCodeEn)}
          </span>
          <span className="text-[9px] text-slate-400 truncate hidden sm:inline">
            ({isBangla ? scenario.statuteCitationBn : scenario.statuteCitationEn})
          </span>
        </div>
        <span className="text-slate-400 text-[9px] shrink-0 font-mono">
          {isBangla ? '০-১০০ ব্যাখ্যাযোগ্য' : '0-100 SHAP SCORE'}
        </span>
      </div>

      {/* Split Body: Left Circular Gauge, Right Multi-Signal Breakdown */}
      <div className="relative z-10 grid grid-cols-12 gap-3 items-center my-1">
        {/* Left Gauge */}
        <div className="col-span-5 flex items-center justify-center relative">
          <svg viewBox="0 0 100 100" className="w-[88px] h-[88px]">
            {/* Background Track Arc */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="7"
              strokeDasharray="160 80"
              strokeLinecap="round"
              transform="rotate(135 50 50)"
            />
            {/* Active Risk Value Arc */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke={activeColor}
              strokeWidth="7.5"
              strokeDasharray="160 80"
              strokeDashoffset={arcOffset}
              strokeLinecap="round"
              transform="rotate(135 50 50)"
              className="transition-all duration-700 ease-out"
              style={{ filter: `drop-shadow(0 0 8px ${activeColor})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span
              className="text-2xl font-bold font-mono leading-none transition-colors duration-500"
              style={{ color: activeColor }}
            >
              {currentScore}
            </span>
            <span
              className="text-[7.5px] font-mono uppercase tracking-tighter mt-0.5 font-bold transition-colors duration-500"
              style={{ color: activeColor }}
            >
              {isCured
                ? (isBangla ? 'ঝুঁকিমুক্ত দলিল' : 'CLEAN TITLE')
                : (scenario.severity === 'CRITICAL'
                    ? (isBangla ? 'উচ্চ ঝুঁকি' : 'CRITICAL RISK')
                    : scenario.severity === 'ELEVATED'
                    ? (isBangla ? 'মাঝারি ঝুঁকি' : 'ELEVATED RISK')
                    : scenario.severity === 'MODERATE'
                    ? (isBangla ? 'যাচাইযোগ্য' : 'MODERATE RISK')
                    : (isBangla ? 'নিখুঁত দলিল' : 'PRISTINE TITLE'))}
            </span>
            {isCured && (
              <span className="text-[7px] font-mono text-emerald-400 font-bold bg-emerald-500/15 px-1 rounded mt-0.5 animate-pulse">
                Δ -{scenario.baseScore - scenario.remediedScore} PTS
              </span>
            )}
          </div>
        </div>

        {/* Right Multi-Signal Meters */}
        <div className="col-span-7 space-y-1.5 text-[9.5px] font-mono">
          {scenario.signals.map((sig, idx) => {
            const val = isWhatIfActive ? sig.remediedVal : sig.baseVal;
            const barColor = isWhatIfActive && val <= 10 ? '#10b981' : sig.color;
            return (
              <div key={idx}>
                <div className="flex justify-between text-slate-300 mb-0.5 text-[9px]">
                  <span className="truncate pr-1">{isBangla ? sig.nameBn : sig.nameEn}</span>
                  <span
                    className="font-bold transition-colors duration-500 shrink-0"
                    style={{ color: barColor }}
                  >
                    {val}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${val}%`,
                      backgroundColor: barColor,
                      boxShadow: val > 50 ? `0 0 6px ${barColor}` : undefined,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Footer: Contextual Verdict Notice */}
      <div
        className={`relative z-10 flex items-center justify-between px-2.5 py-1.5 rounded-[5px] text-[9.5px] font-mono transition-all duration-500 border mt-2 shadow-inner ${
          isCured || scenario.id === 'uttara'
            ? 'bg-emerald-950/40 border-emerald-500/35 text-emerald-200'
            : 'bg-rose-950/45 border-rose-500/35 text-rose-200'
        }`}
      >
        <span className="truncate pr-2">
          {isWhatIfActive
            ? (isBangla ? scenario.remedyNoticeBn : scenario.remedyNoticeEn)
            : (isBangla ? scenario.rawNoticeBn : scenario.rawNoticeEn)}
        </span>
        <span
          className="font-bold shrink-0 ml-1"
          style={{ color: isCured || scenario.id === 'uttara' ? '#34d399' : '#f87171' }}
        >
          {isCured || scenario.id === 'uttara'
            ? (isBangla ? 'যাচাইকৃত ✓' : 'VERIFIED ✓')
            : (isBangla ? 'কার্যকর ✕' : 'ENFORCED ✕')}
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// 3. DOCCOMPARE DUAL-SCANNER WIDGET (Engine 03)
// ============================================================================
export interface DocCompareScannerWidgetProps {
  onOpenStudio?: () => void;
  selectedCaseId?: string;
  onCaseChange?: (caseId: string) => void;
}

export const DocCompareScannerWidget: React.FC<DocCompareScannerWidgetProps> = ({
  onOpenStudio,
  selectedCaseId: externalCaseId,
  onCaseChange,
}) => {
  const { isBangla } = useLanguage();
  const [internalCaseId, setInternalCaseId] = useState<'dag' | 'share' | 'nid'>('dag');
  const [highlightedField, setHighlightedField] = useState<string | null>('dag');
  const [isLaserScanning, setIsLaserScanning] = useState<boolean>(false);

  const activeCase = (externalCaseId as any) || internalCaseId;

  const handleCaseSelect = (caseKey: 'dag' | 'share' | 'nid') => {
    setInternalCaseId(caseKey);
    setHighlightedField(caseKey === 'dag' ? 'dag' : caseKey === 'share' ? 'share' : 'seller');
    if (onCaseChange) onCaseChange(caseKey);
    triggerScan();
  };

  const triggerScan = () => {
    setIsLaserScanning(true);
    setTimeout(() => setIsLaserScanning(false), 1400);
  };

  const caseData = {
    dag: {
      tagEn: 'Dag Mismatch',
      tagBn: 'দাগ অসঙ্গতি',
      deedRef: 'DEED #912',
      deedOwner: 'Seller: Md. Rafiqul',
      deedOwnerBn: 'বিক্রেতা: মোঃ রফিকুল',
      deedDag: 'Dag: 1042',
      deedDagBn: 'দাগ: ১০৪২',
      deedArea: 'Area: 14.50 Shotok',
      deedAreaBn: 'পরিমাণ: ১৪.৫০ শতাংশ',
      khatianRef: 'KHATIAN #1042',
      khatianOwner: 'Owner: Md. Rafiqul',
      khatianOwnerBn: 'মালিক: মোঃ রফিকুল',
      khatianDag: 'Dag: 1024',
      khatianDagBn: 'দাগ: ১০২৪',
      khatianArea: 'Area: 14.50 Shotok',
      khatianAreaBn: 'পরিমাণ: ১৪.৫০ শতাংশ',
      mismatchField: 'dag',
      bannerEn: 'DAG NUMBER CONTRADICTION: 1042 ≠ 1024',
      bannerBn: 'দাগ নম্বর অসঙ্গতি: ১০৪২ ≠ ১০২৪ (আইন বনাম ভূমি)',
      confidence: '99.4%',
    },
    share: {
      tagEn: 'Share Inflation',
      tagBn: 'হিস্যা অতিরিক্ত',
      deedRef: 'HEBA DEED #4102',
      deedOwner: 'Seller: Tariqur Rahman',
      deedOwnerBn: 'বিক্রেতা: তারেকুর রহমান',
      deedDag: 'Dag: 309',
      deedDagBn: 'দাগ: ৩০৯',
      deedArea: 'Transfer: 8.00 Shotok',
      deedAreaBn: 'হস্তান্তর: ৮.০০ শতাংশ',
      khatianRef: 'BS KHATIAN #88',
      khatianOwner: 'Co-Heirs: Fazlur Rahman',
      khatianOwnerBn: 'ওয়ারিশ: ফজলুর রহমান',
      khatianDag: 'Dag: 309',
      khatianDagBn: 'দাগ: ৩০৯',
      khatianArea: 'Entitled: 4.00 Shotok',
      khatianAreaBn: 'বৈধ হিস্যা: ৪.০০ শতাংশ',
      mismatchField: 'area',
      bannerEn: 'EXCESS SHARE OVER-TRANSFER: 8.00 > 4.00 SHOTOK',
      bannerBn: 'অতিরিক্ত জমি হস্তান্তর: ৮.০০ > ৪.০০ শতাংশ',
      confidence: '98.7%',
    },
    nid: {
      tagEn: 'NID Mismatch',
      tagBn: 'এনআইডি অমিল',
      deedRef: 'SALE DEED #8421',
      deedOwner: 'Saleha Begum (..4910)',
      deedOwnerBn: 'সালেহা বেগম (..৪৯১০)',
      deedDag: 'Dag: 512',
      deedDagBn: 'দাগ: ৫১২',
      deedArea: 'Area: 6.25 Shotok',
      deedAreaBn: 'পরিমাণ: ৬.২৫ শতাংশ',
      khatianRef: 'MUTATION #409',
      khatianOwner: 'Mst. Saleha Khatun (..8821)',
      khatianOwnerBn: 'মোসাঃ সালেহা খাতুন (..৮৮২১)',
      khatianDag: 'Dag: 512',
      khatianDagBn: 'দাগ: ৫১২',
      khatianArea: 'Area: 6.25 Shotok',
      khatianAreaBn: 'পরিমাণ: ৬.২৫ শতাংশ',
      mismatchField: 'seller',
      bannerEn: 'PHONETIC ALIAS & NID HASH CONFLICT',
      bannerBn: 'পরিচয়পত্র ও ফনেটিক নামের গরমিল চিহ্নিত',
      confidence: '99.8%',
    },
  }[activeCase as 'dag' | 'share' | 'nid'] || {
    tagEn: 'Dag Mismatch',
    tagBn: 'দাগ অসঙ্গতি',
    deedRef: 'DEED #912',
    deedOwner: 'Seller: Md. Rafiqul',
    deedOwnerBn: 'বিক্রেতা: মোঃ রফিকুল',
    deedDag: 'Dag: 1042',
    deedDagBn: 'দাগ: ১০৪২',
    deedArea: 'Area: 14.50 Shotok',
    deedAreaBn: 'পরিমাণ: ১৪.৫০ শতাংশ',
    khatianRef: 'KHATIAN #1042',
    khatianOwner: 'Owner: Md. Rafiqul',
    khatianOwnerBn: 'মালিক: মোঃ রফিকুল',
    khatianDag: 'Dag: 1024',
    khatianDagBn: 'দাগ: ১০২৪',
    khatianArea: 'Area: 14.50 Shotok',
    khatianAreaBn: 'পরিমাণ: ১৪.৫০ শতাংশ',
    mismatchField: 'dag',
    bannerEn: 'DAG NUMBER CONTRADICTION: 1042 ≠ 1024',
    bannerBn: 'দাগ নম্বর অসঙ্গতি: ১০৪২ ≠ ১০২৪',
    confidence: '99.4%',
  };

  return (
    <div className="relative w-full rounded-[8px] bg-[#070b13] border border-cyan-500/35 overflow-hidden p-3 sm:p-3.5 flex flex-col justify-between select-none shadow-[0_8px_30px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.08)] space-y-2.5">
      {/* Background Cartographic Micro-Grid with Radial Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,#070b13_95%)]" />

      {/* Top Header with Preset Pills & Scan Action */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-mono pb-1 border-b border-white/10">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <Scan className={`w-3.5 h-3.5 ${isLaserScanning ? 'animate-spin' : ''} text-cyan-400`} />
          <span className="font-bold tracking-wider">
            {isBangla ? 'বাংলা ওসিআর তুলনামূলক স্ক্যান' : 'BANGLA OCR COMPARISON'}
          </span>
        </div>

        {/* Case Preset Selector */}
        <div className="flex items-center gap-1">
          {(['dag', 'share', 'nid'] as const).map((key) => (
            <button
              key={key}
              onClick={(e) => {
                e.stopPropagation();
                handleCaseSelect(key);
              }}
              className={`px-1.5 py-0.5 rounded text-[8.5px] transition-all cursor-pointer ${
                activeCase === key
                  ? 'bg-cyan-500 text-black font-bold shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-cyan-300 hover:bg-white/10'
              }`}
            >
              {key === 'dag' ? (isBangla ? 'দাগ অমিল' : 'Dag') : key === 'share' ? (isBangla ? 'হিস্যা' : 'Share') : (isBangla ? 'এনআইডি' : 'NID')}
            </button>
          ))}
          <span className="text-emerald-400 text-[9px] font-bold ml-1">{caseData.confidence}</span>
        </div>
      </div>

      {/* Side-by-Side Dual Document Panels with Scanning Laser */}
      <div className="relative z-10 grid grid-cols-2 gap-2 h-[86px] overflow-hidden">
        {/* The Sweeping Neon Laser Beam */}
        <motion.div
          className="absolute left-0 right-0 h-[1.8px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] z-20 pointer-events-none"
          animate={{ y: [0, 82, 0] }}
          transition={{ duration: isLaserScanning ? 1.2 : 3.0, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Document A: Sub-Registry Deed */}
        <div className="bg-[#0b1424]/95 border border-cyan-500/30 rounded-[5px] p-2 flex flex-col justify-between font-mono text-[9px] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 border-b border-white/10 pb-1">
            <span className="font-bold text-cyan-300">{caseData.deedRef}</span>
            <span className="text-cyan-400 text-[8px] font-bold">{isBangla ? 'আইন বিভাগ' : 'LAW MIN'}</span>
          </div>
          <div className="space-y-1 mt-1 text-slate-200">
            <div
              onClick={(e) => {
                e.stopPropagation();
                setHighlightedField('seller');
              }}
              className={`cursor-pointer px-1 py-0.2 rounded transition-colors ${
                highlightedField === 'seller' ? 'bg-cyan-500/20 text-cyan-300' : 'hover:text-cyan-300'
              }`}
            >
              {isBangla ? caseData.deedOwnerBn : caseData.deedOwner}
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setHighlightedField('dag');
              }}
              className={`cursor-pointer px-1 py-0.2 rounded transition-colors font-bold ${
                highlightedField === 'dag'
                  ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              {isBangla ? caseData.deedDagBn : caseData.deedDag}
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setHighlightedField('area');
              }}
              className={`cursor-pointer px-1 py-0.2 rounded transition-colors text-slate-400 ${
                highlightedField === 'area' ? 'bg-amber-500/20 text-amber-300' : 'hover:text-slate-200'
              }`}
            >
              {isBangla ? caseData.deedAreaBn : caseData.deedArea}
            </div>
          </div>
        </div>

        {/* Document B: AC Land Khatian (With Flagged Contradiction) */}
        <div className="bg-[#1f0b12]/95 border border-rose-500/40 rounded-[5px] p-2 flex flex-col justify-between font-mono text-[9px] relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between text-slate-400 border-b border-white/10 pb-1">
            <span className="font-bold text-amber-300">{caseData.khatianRef}</span>
            <span className="text-amber-400 text-[8px] font-bold">{isBangla ? 'ভূমি বিভাগ' : 'LAND MIN'}</span>
          </div>
          <div className="space-y-1 mt-1">
            <div
              onClick={(e) => {
                e.stopPropagation();
                setHighlightedField('seller');
              }}
              className={`cursor-pointer px-1 py-0.2 rounded transition-colors text-slate-200 ${
                highlightedField === 'seller' ? 'bg-rose-500/20 text-rose-300' : 'hover:text-slate-100'
              }`}
            >
              {isBangla ? caseData.khatianOwnerBn : caseData.khatianOwner}
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setHighlightedField('dag');
              }}
              className={`cursor-pointer px-1 py-0.2 rounded transition-colors flex items-center justify-between ${
                highlightedField === 'dag'
                  ? 'bg-rose-500/30 text-rose-300 font-bold border border-rose-500/50'
                  : 'text-rose-400 font-bold'
              }`}
            >
              <span>{isBangla ? caseData.khatianDagBn : caseData.khatianDag}</span>
              {activeCase === 'dag' && (
                <span className="bg-rose-500 text-black text-[7px] px-1 py-0.2 rounded font-black animate-pulse">
                  {isBangla ? 'অসঙ্গতি' : 'MISMATCH'}
                </span>
              )}
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setHighlightedField('area');
              }}
              className={`cursor-pointer px-1 py-0.2 rounded transition-colors text-slate-400 ${
                highlightedField === 'area' ? 'bg-amber-500/20 text-amber-300' : 'hover:text-slate-200'
              }`}
            >
              {isBangla ? caseData.khatianAreaBn : caseData.khatianArea}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Contradiction Telemetry Badge with Interactive Studio Button */}
      <div className="relative z-10 flex items-center justify-between bg-black/80 px-2.5 py-1.5 rounded-[5px] border border-white/10 text-[9.5px] font-mono shadow-inner">
        <span className="text-rose-400 font-medium truncate">
          {isBangla ? caseData.bannerBn : caseData.bannerEn}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenStudio) onOpenStudio();
          }}
          className="text-cyan-400 hover:text-cyan-300 font-bold shrink-0 ml-1.5 flex items-center gap-1 cursor-pointer bg-cyan-500/10 hover:bg-cyan-500/20 px-1.5 py-0.5 rounded border border-cyan-500/30 transition-colors"
        >
          <span>{isBangla ? 'স্টুডিও ↗' : 'Inspect ↗'}</span>
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 4. ADVERSARIAL SIMULATOR BENCHMARK WIDGET (Engine 04)
// ============================================================================
export interface AdversarialSimulatorWidgetProps {
  onOpenStudio?: () => void;
  onInjectAttack?: (vectorId: string) => void;
}

export const AdversarialSimulatorWidget: React.FC<AdversarialSimulatorWidgetProps> = ({
  onOpenStudio,
  onInjectAttack,
}) => {
  const { isBangla } = useLanguage();
  const [selectedVector, setSelectedVector] = useState<'double' | 'seal' | 'boundary' | 'ghost'>('double');
  const [attackCount, setAttackCount] = useState<number>(15480);
  const [isBlasting, setIsBlasting] = useState<boolean>(false);
  const [lastDefenseMessage, setLastDefenseMessage] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAttackCount((prev) => prev + Math.floor(Math.random() * 8) + 2);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const handleInject = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBlasting(true);
    setAttackCount((prev) => prev + 25);

    const message = {
      double: isBangla ? 'দ্বৈত-বিক্রয় প্রতিহত! ৭২ ঘণ্টা সফট-লক কার্যকর (৮ms)' : 'Double-Sale Blocked! 72h Soft-Lock Enforced (8ms)',
      seal: isBangla ? 'জাল সিল বাতিল! মারকেল হ্যাশ চেইন প্রত্যাখ্যান (১২ms)' : 'Forged Seal Quarantined! Merkle Hash Rejected (12ms)',
      boundary: isBangla ? 'ক্যাডাস্ট্রাল খাল ওভারল্যাপ গ্রাস প্রতিহত (১৪ms)' : 'Canal Overlap Warp Blocked! Topology Guard (14ms)',
      ghost: isBangla ? 'ভুয়া ওয়ারিশ সনদ বাতিল! হিস্যা পুনর্নির্ধারিত (১০ms)' : 'Ghost Heir Fraud Intercepted! Shares Restored (10ms)',
    }[selectedVector];

    setLastDefenseMessage(message);

    if (onInjectAttack) onInjectAttack(selectedVector);

    setTimeout(() => {
      setIsBlasting(false);
    }, 1500);
  };

  return (
    <div className="relative w-full rounded-[8px] bg-[#070b13] border border-emerald-500/35 overflow-hidden p-3 sm:p-3.5 flex flex-col justify-between select-none shadow-[0_8px_30px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.08)] space-y-2.5">
      {/* Background Cartographic Micro-Grid with Radial Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(52, 211, 153, 0.35) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,#070b13_95%)]" />

      {/* Top Header with Attack Vector Selector & Inject Action */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-mono pb-1 border-b border-white/10">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="font-bold tracking-wider">
            {isBangla ? 'স্ট্রেস-টেস্ট বেঞ্চমার্ক' : 'STRESS-TEST BENCHMARK'}
          </span>
        </div>

        {/* Attack Vector Selector Pills */}
        <div className="flex items-center gap-1">
          {(['double', 'seal', 'boundary', 'ghost'] as const).map((v) => (
            <button
              key={v}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedVector(v);
              }}
              className={`px-1.5 py-0.5 rounded text-[8.5px] transition-all cursor-pointer ${
                selectedVector === v
                  ? 'bg-rose-500 text-white font-bold shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-rose-300 hover:bg-white/10'
              }`}
            >
              {v === 'double' ? (isBangla ? 'দ্বৈত-বিক্রয়' : 'Double') : v === 'seal' ? (isBangla ? 'জাল সিল' : 'Seal') : v === 'boundary' ? (isBangla ? 'সীমানা' : 'Warp') : (isBangla ? 'ওয়ারিশ' : 'Heir')}
            </button>
          ))}
          <button
            onClick={handleInject}
            className={`px-2 py-0.5 rounded text-[8.5px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              isBlasting
                ? 'bg-rose-500 text-white animate-pulse shadow-md'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-sm'
            }`}
            title={isBangla ? 'আক্রমণ ইনজেক্ট করুন' : 'Inject Synthetic Attack'}
          >
            <Zap className="w-2.5 h-2.5" />
            <span>{isBlasting ? (isBangla ? 'আক্রমণ চলছে' : 'Injecting...') : (isBangla ? 'ইনজেক্ট ⚡' : 'Inject ⚡')}</span>
          </button>
        </div>
      </div>

      {/* Attack Injection Oscilloscope / Stream Waveform */}
      <div className="relative z-10 my-auto w-full h-[78px] flex items-center justify-center">
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
          <circle cx="140" cy="32" r={isBlasting ? 22 : 16} fill="url(#shield-grad)" stroke="#34d399" strokeWidth={isBlasting ? 2.5 : 1} opacity="0.8">
            <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
          </circle>

          {/* Incoming Rogue Attack Particles (Left to Center) */}
          <circle r={isBlasting ? 4.5 : 3} fill="#f43f5e">
            <animate attributeName="cx" values="15;140" dur={isBlasting ? "0.8s" : "1.8s"} repeatCount="indefinite"/>
            <animate attributeName="cy" values="22;32" dur={isBlasting ? "0.8s" : "1.8s"} repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0" dur={isBlasting ? "0.8s" : "1.8s"} repeatCount="indefinite"/>
          </circle>
          <circle r={isBlasting ? 4.5 : 3} fill="#f43f5e">
            <animate attributeName="cx" values="10;140" dur={isBlasting ? "1.0s" : "2.3s"} repeatCount="indefinite" begin="0.3s"/>
            <animate attributeName="cy" values="42;32" dur={isBlasting ? "1.0s" : "2.3s"} repeatCount="indefinite" begin="0.3s"/>
            <animate attributeName="opacity" values="1;0" dur={isBlasting ? "1.0s" : "2.3s"} repeatCount="indefinite" begin="0.3s"/>
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

      {/* Dynamic Status / Interception Banner */}
      {lastDefenseMessage && (
        <div className="relative z-10 bg-emerald-950/80 px-2 py-1 rounded-[4px] border border-emerald-500/30 text-[8.5px] font-mono text-emerald-300 flex items-center justify-between">
          <span className="truncate">{lastDefenseMessage}</span>
          <span className="text-emerald-400 font-bold shrink-0 ml-1">✓ BLOCKED</span>
        </div>
      )}

      {/* Bottom KPI Row with Studio Launch Action */}
      <div className="relative z-10 flex items-center justify-between bg-black/80 px-2.5 py-1.5 rounded-[5px] border border-white/10 text-[9px] font-mono shadow-inner">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-slate-400">{isBangla ? 'শনাক্ত:' : 'CATCH: '}</span>
            <span className="text-emerald-400 font-bold">99.8%</span>
          </div>
          <div>
            <span className="text-slate-400">{isBangla ? 'বিলম্ব:' : 'LATENCY: '}</span>
            <span className="text-cyan-400 font-bold">12ms</span>
          </div>
          <div>
            <span className="text-slate-400">{isBangla ? 'ভুল:' : 'FP: '}</span>
            <span className="text-slate-200 font-bold">&lt;0.02%</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenStudio) onOpenStudio();
          }}
          className="text-emerald-400 hover:text-emerald-300 font-bold shrink-0 ml-1 flex items-center gap-1 cursor-pointer bg-emerald-500/10 hover:bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30 transition-colors"
        >
          <span>{isBangla ? 'ল্যাব ↗' : 'Lab ↗'}</span>
        </button>
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
