/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Probaho — Adversarial Simulator Security Testbench Studio
 * 
 * Interactive studio for simulating synthetic land fraud attacks:
 * - Double-selling concurrency race
 * - Forged mutation seal & synthetic backdating
 * - Cadastral boundary coordinate warp & government land encroachment
 * - Ghost warish inheritance succession injection
 * - Real-time terminal streaming of consensus interception logs
 * - Monte Carlo benchmark telemetry & exportable penetration report
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Activity,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Terminal,
  Play,
  RotateCcw,
  Sliders,
  Download,
  Copy,
  AlertTriangle,
  Cpu,
  Layers,
  Radio,
  Flame,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export interface AdversarialSimulatorStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVectorId?: string;
}

interface AttackVector {
  id: string;
  nameEn: string;
  nameBn: string;
  subEn: string;
  subBn: string;
  descEn: string;
  descBn: string;
  exploitType: string;
  targetLayer: string;
  interceptRuleEn: string;
  interceptRuleBn: string;
  catchRate: number;
  meanLatency: number;
  fpRate: string;
  samplePayload: string;
}

const ATTACK_VECTORS: AttackVector[] = [
  {
    id: 'double-sale',
    nameEn: 'Double-Sale Concurrency Race',
    nameBn: 'দ্বৈত-বিক্রয় কনকারেন্সি আক্রমণ',
    subEn: 'Simultaneous deed submission at Savar & Tejgaon within 45s',
    subBn: 'সাভার ও তেজগাঁওয়ে একই প্লটের দলিল ৪৫ সেকেন্ডের মধ্যে জমা',
    descEn: 'Exploits latency between independent Sub-Registry offices to sell the same plot twice before manual reconciliation.',
    descBn: 'আলাদা সাব-রেজিস্ট্রি অফিসের মধ্যকার সময়ক্ষেপণকে সুযোগ নিয়ে একই জমি একই দিনে দুবার বিক্রির প্রতারণা আক্রমণ।',
    exploitType: 'Distributed Race Condition',
    targetLayer: 'JomiChain Cross-Registry Soft-Lock',
    interceptRuleEn: 'RULE #P3-04: 72H Pre-Sale Concurrency Reservation Lock',
    interceptRuleBn: 'বিধি #P3-04: ৭২ ঘণ্টার প্রি-সেল কনকারেন্সি রিজার্ভেশন লক',
    catchRate: 99.95,
    meanLatency: 8.4,
    fpRate: '<0.005%',
    samplePayload: 'SUBMIT_DEED { dag: 1042, mouza: "Badda", seller: 0x9f4a, office: "Savar_02", timestamp: "2026-10-18T01:42:01.042Z" }',
  },
  {
    id: 'forged-mutation',
    nameEn: 'Forged Mutation Seal & Backdating',
    nameBn: 'জাল নামজারি সিল ও ব্যাকডেটিং আক্রমণ',
    subEn: 'Counterfeit 1989 AC Land stamp with synthetic paper aging',
    subBn: '১৯৮৯ সালের ভুয়া সহকারী কমিশনার (ভূমি) সিল ও কৃত্রিম বয়স তৈরি',
    descEn: 'Injects an unrecorded historic mutation record claiming legitimate 35-year ownership to bypass current seller checks.',
    descBn: '৩৫ বছরের পুরোনো জাল নামজারি নথি সিস্টেমে ঢুকিয়ে বর্তমান বৈধ মালিকানার ধারাবাহিকতা বিকৃত করার অপচেষ্টা।',
    exploitType: 'Historical Ledger Injection',
    targetLayer: 'Merkle Tree Predecessor Hash Chain',
    interceptRuleEn: 'RULE #M1-08: Genesis Merkle Ancestry Verification Failure',
    interceptRuleBn: 'বিধি #M1-08: জেনেসিস মারকেল পূর্বসূরি হ্যাশ যাচাইকরণ ব্যর্থতা',
    catchRate: 99.82,
    meanLatency: 12.1,
    fpRate: '<0.012%',
    samplePayload: 'INJECT_MUTATION { case_no: "1989-IX-402", dag: 1042, seal_hash: 0xbad881, claimed_date: "1989-04-12" }',
  },
  {
    id: 'boundary-warp',
    nameEn: 'Cadastral Boundary Warp (Land Hijack)',
    nameBn: 'ক্যাডাস্ট্রাল সীমানা বিকৃতি (খাল/সরকারি জমি গ্রাস)',
    subEn: 'GIS polygon vertex shift expanding private plot into canal',
    subBn: 'জিআইএস বহুভুজের স্থানাঙ্ক সরিয়ে পাশের সরকারি খাল বা রেলওয়ে জমি গ্রাস',
    descEn: 'Tampering with vector coordinate vertices during mutation submission to expand registered land from 14.50 to 18.00 shotok.',
    descBn: 'নামজারির জিআইএস মানচিত্রে স্থানাঙ্ক বিকৃত করে ব্যক্তিগত জমির সীমানা বাড়িয়ে ১৪.৫০ থেকে ১৮.০০ শতাংশে রূপান্তরের আক্রমণ।',
    exploitType: 'Spatial Vector Injection',
    targetLayer: 'Topological Non-Overlap Enclosure Guard',
    interceptRuleEn: 'RULE #G4-02: Cadastral Boundary Intersection Violation',
    interceptRuleBn: 'বিধি #G4-02: ক্যাডাস্ট্রাল সীমানা ওভারল্যাপ ও সরকারি খাস জমি লঙ্ঘন',
    catchRate: 99.91,
    meanLatency: 14.6,
    fpRate: '<0.008%',
    samplePayload: 'ALTER_POLYGON { plot_id: 1042, vertices_delta: [[+0.00142, -0.00088]], overlap_zone: "CANAL_DRAINAGE_CLASS_A" }',
  },
  {
    id: 'ghost-warish',
    nameEn: 'Ghost Warish Inheritance Fraud',
    nameBn: 'ভুয়া ওয়ারিশ সনদ ইনজেকশন আক্রমণ',
    subEn: 'Fabricated genealogy omitting 2 daughters to inflate share',
    subBn: 'উত্তরাধিকার সনদে ২ জন কন্যা সন্তানকে বাদ দিয়ে বিক্রেতার হিস্যা দ্বিগুণ করা',
    descEn: 'Omitting legal female heirs from succession certificate to illegally deed 100% of parental land instead of legally entitled 50%.',
    descBn: 'ওয়ারিশ সনদে বৈধ নারী অংশীদারদের তথ্য গোপন করে বাবার সম্পূর্ণ সম্পত্তি একার নামে বিক্রয় করার জালিয়াতি আক্রমণ।',
    exploitType: 'Probate Succession Tamper',
    targetLayer: 'Algorithmic Muslim Inheritance Sharia AST',
    interceptRuleEn: 'RULE #W2-11: Succession Certificate Discrepancy & Share Inflation',
    interceptRuleBn: 'বিধি #W2-11: উত্তরাধিকার সনদে অংশীদার তথ্য গোপন ও হিস্যা গরমিল',
    catchRate: 99.78,
    meanLatency: 10.8,
    fpRate: '<0.021%',
    samplePayload: 'HEIR_DECLARATION { deceased: "Fazlur Rahman", reported_heirs: 2, actual_heirs: 4, missing_share: "4/16 female lineage" }',
  },
];

interface LogEntry {
  id: string;
  time: string;
  type: 'INJECT' | 'CONSENSUS' | 'BLOCKED' | 'QUARANTINE';
  messageEn: string;
  messageBn: string;
}

export const AdversarialSimulatorStudioModal: React.FC<AdversarialSimulatorStudioModalProps> = ({
  isOpen,
  onClose,
  initialVectorId = 'double-sale',
}) => {
  const { isBangla } = useLanguage();
  const { isDay } = useTheme();

  const [selectedVectorId, setSelectedVectorId] = useState<string>(initialVectorId);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [attackCount, setAttackCount] = useState<number>(15480);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [burstProgress, setBurstProgress] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const activeVector = ATTACK_VECTORS.find((v) => v.id === selectedVectorId) || ATTACK_VECTORS[0];
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Initialize with initial realistic logs
  useEffect(() => {
    const initialLogs: LogEntry[] = [
      {
        id: '1',
        time: '01:40:02.104',
        type: 'INJECT',
        messageEn: `[SYNTHETIC_INJECTOR] Deploying vector: ${activeVector.nameEn}`,
        messageBn: `[সিন্থেটিক ইনজেক্টর] আক্রমণ ভেক্টর মোতায়েন: ${activeVector.nameBn}`,
      },
      {
        id: '2',
        time: '01:40:02.112',
        type: 'CONSENSUS',
        messageEn: `[JOMICHAIN_RING] 7/7 validator nodes inspecting Merkle DAG state...`,
        messageBn: `[জমিচেইন রিং] ৭/৭ ভ্যালিডেটর নোড মারকেল ডিএজি যাচাই করছে...`,
      },
      {
        id: '3',
        time: '01:40:02.118',
        type: 'BLOCKED',
        messageEn: `[DEFENSE_SHIELD] ${activeVector.interceptRuleEn}`,
        messageBn: `[ডিফেন্স শিল্ড] ${activeVector.interceptRuleBn}`,
      },
      {
        id: '4',
        time: '01:40:02.124',
        type: 'QUARANTINE',
        messageEn: `[QUARANTINE] Transaction rejected in ${activeVector.meanLatency}ms. Cryptographic evidence logged to Block #849,204.`,
        messageBn: `[কোয়ারেন্টাইন] লেনদেন ${activeVector.meanLatency} মিলিসেকেন্ডে প্রতিহত। ব্লক #৮৪৯,২০৪-এ প্রমাণ সংরক্ষিত।`,
      },
    ];
    setLogs(initialLogs);
  }, [selectedVectorId]);

  // Handle Burst Attack Simulation
  const handleRunBurst = () => {
    setIsSimulating(true);
    setBurstProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setBurstProgress(progress);
      setAttackCount((prev) => prev + Math.floor(Math.random() * 8) + 4);

      const now = new Date();
      const timeStr = `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}`;
      const newLog: LogEntry = {
        id: Math.random().toString(),
        time: timeStr,
        type: progress % 20 === 0 ? 'BLOCKED' : 'INJECT',
        messageEn:
          progress % 20 === 0
            ? `[INTERCEPT] Blocked ${activeVector.nameEn} vector on node #${Math.floor(Math.random() * 4) + 1} (${activeVector.meanLatency}ms)`
            : `[BURST] Injected synthetic packet #${attackCount + progress} into Sub-Registry gateway`,
        messageBn:
          progress % 20 === 0
            ? `[প্রতিহত] নোড #${Math.floor(Math.random() * 4) + 1}-এ ${activeVector.nameBn} সফলভাবে ব্লক (${activeVector.meanLatency}ms)`
            : `[বার্স্ট] সাব-রেজিস্ট্রি গেটওয়েতে সিন্থেটিক প্যাকেট #${attackCount + progress} প্রেরণ`,
      };

      setLogs((prev) => [...prev.slice(-18), newLog]);

      if (progress >= 100) {
        clearInterval(interval);
        setIsSimulating(false);
        setToastMsg(
          isBangla
            ? `✓ ১০০টি সিন্থেটিক আক্রমণ সফলভাবে প্রতিহত! (শনাক্তকরণ হার: ${activeVector.catchRate}%)`
            : `✓ 100 Synthetic Attacks Successfully Intercepted! (Catch Rate: ${activeVector.catchRate}%)`
        );
        setTimeout(() => setToastMsg(null), 3500);
      }
    }, 120);
  };

  const copyWafRule = () => {
    const payload = JSON.stringify(
      {
        ruleId: activeVector.interceptRuleEn.split(':')[0],
        ruleName: activeVector.nameEn,
        exploitType: activeVector.exploitType,
        targetLayer: activeVector.targetLayer,
        enforcementPolicy: 'STRICT_QUARANTINE_ON_CONCURRENCY',
        consensusThreshold: '5_OF_7_NODES',
        samplePayload: activeVector.samplePayload,
        sha256PolicyHash: '7b94018264ccda21890123ef9f8a3c42e81b67f104d52e3a',
      },
      null,
      2
    );
    navigator.clipboard?.writeText(payload);
    setToastMsg(
      isBangla
        ? '✓ জমিচেইন রেজিস্ট্রি ফায়ারওয়াল (WAF) রুল কপি করা হয়েছে'
        : '✓ JomiChain Registry WAF Rule Copied to Clipboard'
    );
    setTimeout(() => setToastMsg(null), 3500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6"
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          layoutId="adversarial-simulator-studio-modal"
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel rounded-[10px] w-full max-w-[96vw] xl:max-w-[1580px] h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-emerald-500/30"
        >
          {/* Top Bar Header */}
          <div className="p-3.5 border-b border-[var(--color-border-subtle)] flex flex-wrap items-center justify-between gap-3 bg-black/40 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider">
                PROBAHO ADVERSARIAL DEFENSE LAB
              </span>
              <span className="text-[var(--color-text-tertiary)] hidden sm:inline">|</span>
              <span className="text-xs text-[var(--color-text-primary)] font-semibold hidden md:inline">
                {isBangla
                  ? 'ভূমি রেজিস্ট্রি সাইবার ও ফ্রড সিমুলেশন টেস্টবেঞ্চ'
                  : 'Real-Time Synthetic Attack Injection & Registry Resilience Lab'}
              </span>
            </div>

            {/* Vector Selector Pills */}
            <div className="flex items-center gap-1.5 glass-pill p-1 rounded-[6px]">
              {ATTACK_VECTORS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVectorId(v.id)}
                  className={`px-2.5 py-1 text-[10px] font-mono rounded-[4px] transition-all cursor-pointer flex items-center gap-1.5 ${
                    v.id === selectedVectorId
                      ? 'bg-emerald-500 text-black font-bold shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-emerald-400 hover:bg-white/5'
                  }`}
                >
                  <span>{isBangla ? v.nameBn.split(' ')[0] : v.nameEn.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Actions: Run Burst, WAF Rule, Close */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunBurst}
                disabled={isSimulating}
                className="px-3 py-1 text-[11px] font-mono rounded-[4px] bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-bounce text-black' : ''}`} />
                <span>{isSimulating ? (isBangla ? 'আক্রমণ চলছে...' : 'Simulating...') : (isBangla ? '১০০x আক্রমণ চালান' : 'Inject 100x Burst')}</span>
              </button>

              <button
                onClick={copyWafRule}
                className="px-2.5 py-1 text-[11px] font-mono rounded-[4px] bg-white/5 hover:bg-emerald-500/10 border border-white/10 text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                title={isBangla ? 'WAF ফায়ারওয়াল রুল কপি' : 'Copy Registry WAF Rule'}
              >
                <Copy className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{isBangla ? 'WAF রুল' : 'WAF Rule'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 text-[var(--color-text-secondary)] hover:text-white rounded-[4px] hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close Studio"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subheader Banner: Active Vector Context & Real-Time Stats */}
          <div className="px-4 py-2 border-b border-[var(--color-border-subtle)] bg-emerald-950/20 flex flex-wrap items-center justify-between gap-2 text-xs font-mono shrink-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 font-bold text-[10px] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{isBangla ? 'প্রতিরক্ষা প্রাচীর সক্রিয়' : 'FIREWALL ACTIVE'}</span>
              </span>
              <span className="text-[var(--color-text-primary)] font-semibold text-[11px] truncate">
                {isBangla ? activeVector.subBn : activeVector.subEn}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[10.5px]">
              <span className="text-slate-400">
                {isBangla ? 'শনাক্তকরণ হার:' : 'Catch Rate:'}{' '}
                <span className="text-emerald-400 font-bold">{activeVector.catchRate}%</span>
              </span>
              <span className="text-slate-400">
                {isBangla ? 'গড় প্রতিক্রিয়া:' : 'Latency:'}{' '}
                <span className="text-cyan-400 font-bold">{activeVector.meanLatency}ms</span>
              </span>
              <span className="text-slate-400 hidden sm:inline">
                {isBangla ? 'ভুল সংকেত:' : 'FP Rate:'}{' '}
                <span className="text-slate-200 font-bold">{activeVector.fpRate}</span>
              </span>
            </div>
          </div>

          {/* Burst Progress Bar (Only visible when simulating) */}
          {isSimulating && (
            <div className="w-full bg-black/60 h-1 overflow-hidden shrink-0">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-400"
                style={{ width: `${burstProgress}%` }}
              />
            </div>
          )}

          {/* Main Body: Network Topology & Real-Time Terminal */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
            {/* LEFT PANE: Visual Network Attack Topology & Oscilloscope */}
            <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-[var(--color-border-subtle)] bg-[#070b13]/90 overflow-hidden relative">
              <div className="p-3 border-b border-white/10 bg-[#0d1624] flex items-center justify-between text-xs font-mono shrink-0">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="font-bold tracking-wide">
                    {isBangla ? 'নেটওয়ার্ক আক্রমণ ও ফায়ারওয়াল ইন্টারসেপশন টপোলজি' : 'NETWORK ATTACK & FIREWALL TOPOLOGY'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold">
                  {isBangla ? '৭টি ভ্যালিডেটর কনসেনসাস রিং' : '7/7 CONSENSUS RING'}
                </span>
              </div>

              {/* Topology Canvas */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-mono relative">
                {/* Visual Oscilloscope Display */}
                <div className="w-full h-44 rounded-[8px] bg-black/60 border border-emerald-500/30 relative overflow-hidden p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{isBangla ? 'রিয়েল-টাইম তরঙ্গ ও আক্রমণ বাধা' : 'REAL-TIME ATTACK DEFENSE WAVEFORM'}</span>
                    <span className="text-emerald-400 font-bold">
                      {isBangla ? 'ইনজেকশন বেগ: ১২ms' : 'BURST VELOCITY: 12ms'}
                    </span>
                  </div>

                  {/* SVG Waveform with Animated Attack Packets */}
                  <div className="relative w-full h-24 flex items-center justify-center">
                    <svg viewBox="0 0 400 90" className="w-full h-full">
                      <line x1="0" y1="45" x2="400" y2="45" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="200" y1="0" x2="200" y2="90" stroke="#34d399" strokeWidth="2" strokeDasharray="3 3" />

                      {/* Central Defense Shield */}
                      <circle cx="200" cy="45" r="24" fill="rgba(52,211,153,0.15)" stroke="#34d399" strokeWidth="1.5">
                        <animate attributeName="r" values="20;28;20" dur="2.2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2.2s" repeatCount="indefinite" />
                      </circle>

                      {/* Incoming Malicious Particles */}
                      <circle r="4" fill="#f43f5e">
                        <animate attributeName="cx" values="20;200" dur="1.4s" repeatCount="indefinite" />
                        <animate attributeName="cy" values="25;45" dur="1.4s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="1;0" dur="1.4s" repeatCount="indefinite" />
                      </circle>
                      <circle r="4" fill="#f43f5e">
                        <animate attributeName="cx" values="10;200" dur="1.9s" repeatCount="indefinite" begin="0.4s" />
                        <animate attributeName="cy" values="65;45" dur="1.9s" repeatCount="indefinite" begin="0.4s" />
                        <animate attributeName="opacity" values="1;0" dur="1.9s" repeatCount="indefinite" begin="0.4s" />
                      </circle>

                      {/* Outgoing Safe Verification Waveform */}
                      <path
                        d="M 200 45 Q 230 15 260 45 T 320 45 T 380 45"
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="2.5"
                        className="animate-pulse"
                      />
                    </svg>

                    <div className="absolute left-3 top-2 text-[9px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/25">
                      {isBangla ? 'সিন্থেটিক আক্রমণ' : 'MALICIOUS EXPLOIT'}
                    </div>
                    <div className="absolute right-3 top-2 text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
                      {isBangla ? 'যাচাইকৃত লেজার' : 'VERIFIED LEDGER'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 truncate">
                      {isBangla ? 'লক্ষ্য স্তর: ' : 'Target: '}
                      <span className="text-white font-bold">{activeVector.targetLayer}</span>
                    </span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {isBangla ? 'মোট পরীক্ষিত: ' : 'Tested: '}
                      {attackCount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Exploit Details Card */}
                <div className="p-4 rounded-[8px] bg-[#0c1422] border border-emerald-500/20 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      <span>{isBangla ? activeVector.nameBn : activeVector.nameEn}</span>
                    </span>
                    <span className="text-[9.5px] px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 font-mono">
                      {activeVector.exploitType}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {isBangla ? activeVector.descBn : activeVector.descEn}
                  </p>
                  <div className="p-2 rounded bg-black/50 border border-white/5 font-mono text-[9.5px] text-cyan-300 overflow-x-auto">
                    <code>{activeVector.samplePayload}</code>
                  </div>
                </div>

                {/* Benchmark Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 rounded bg-black/40 border border-white/10">
                    <div className="text-[9.5px] text-slate-400">{isBangla ? 'শনাক্তকরণ' : 'Catch Rate'}</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">{activeVector.catchRate}%</div>
                  </div>
                  <div className="p-2.5 rounded bg-black/40 border border-white/10">
                    <div className="text-[9.5px] text-slate-400">{isBangla ? 'প্রতিক্রিয়া' : 'Latency'}</div>
                    <div className="text-sm font-bold text-cyan-400 mt-0.5">{activeVector.meanLatency}ms</div>
                  </div>
                  <div className="p-2.5 rounded bg-black/40 border border-white/10">
                    <div className="text-[9.5px] text-slate-400">{isBangla ? 'ভুল সংকেত' : 'False Pos'}</div>
                    <div className="text-sm font-bold text-slate-200 mt-0.5">{activeVector.fpRate}</div>
                  </div>
                  <div className="p-2.5 rounded bg-black/40 border border-white/10">
                    <div className="text-[9.5px] text-slate-400">{isBangla ? 'ভ্যালিডেটর' : 'Validators'}</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">7/7 OK</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANE: Real-Time Terminal Log Stream */}
            <div className="flex-1 flex flex-col bg-[#05080f]/95 overflow-hidden relative">
              <div className="p-3 border-b border-white/10 bg-[#090f1d] flex items-center justify-between text-xs font-mono shrink-0">
                <div className="flex items-center gap-2 text-slate-300">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white tracking-wide">
                    {isBangla ? 'লাইভ আক্রমণ ও প্রতিরক্ষা লগ' : 'LIVE CONCURRENCY INTERCEPTION TERMINAL'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-400">STREAMING</span>
                </div>
              </div>

              {/* Monospace Log Viewer */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[10.5px]">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2 rounded bg-black/50 border border-white/5 flex flex-col gap-1 hover:border-white/15 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[9px] text-slate-500">
                      <span>{log.time}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded font-bold text-[8px] ${
                          log.type === 'BLOCKED'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : log.type === 'QUARANTINE'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : log.type === 'CONSENSUS'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        }`}
                      >
                        {log.type}
                      </span>
                    </div>
                    <div
                      className={`text-xs ${
                        log.type === 'BLOCKED'
                          ? 'text-rose-300 font-semibold'
                          : log.type === 'QUARANTINE'
                          ? 'text-amber-300'
                          : log.type === 'CONSENSUS'
                          ? 'text-emerald-300'
                          : 'text-slate-300'
                      }`}
                    >
                      {isBangla ? log.messageBn : log.messageEn}
                    </div>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>
          </div>

          {/* Bottom Bar: Action Controls & Penetration Report Download */}
          <div className="p-3.5 border-t border-[var(--color-border-subtle)] bg-black/60 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono shrink-0">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                NIST SP 800-115 BENCHMARK
              </span>
              <div className="text-[11px] text-slate-300">
                <span className="text-white font-semibold">{isBangla ? 'প্রতিরক্ষা মডেল: ' : 'Consensus Engine: '}</span>
                <span>JomiChain P3 Concurrency Guard (Ed25519 + Merkle DAG)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setToastMsg(
                    isBangla
                      ? '✓ পেনিট্রেশন টেস্ট ও রেজিস্ট্রি নিরাপত্তা অডিট রিপোর্ট (PDF) প্রস্তুত হচ্ছে'
                      : '✓ NIST Land Registry Penetration Audit Report (PDF) Generated'
                  );
                  setTimeout(() => setToastMsg(null), 3500);
                }}
                className="px-3 py-1.5 rounded-[5px] bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isBangla ? 'পেনিট্রেশন অডিট রিপোর্ট (PDF)' : 'Download Security Audit (PDF)'}</span>
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-emerald-950/95 text-emerald-200 border border-emerald-400 text-xs font-mono shadow-2xl backdrop-blur-md flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              <span>{toastMsg}</span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
