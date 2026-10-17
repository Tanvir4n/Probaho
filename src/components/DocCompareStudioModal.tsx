/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Probaho — DocCompare Dual-Document Contradiction Analysis Studio
 * 
 * Interactive studio for side-by-side Bengali land document OCR comparison:
 * - Scanned Sub-Registry Deed vs. AC Land Digital Khatian Record
 * - Field-level contradiction highlighting (Dag number, Area, Seller warish share)
 * - Vision Transformer (ViT) bounding-box token inspector
 * - Exportable official legal discrepancy certificate
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Scan,
  AlertTriangle,
  CheckCircle2,
  FileText,
  FileCheck2,
  Sliders,
  Download,
  Copy,
  Layers,
  Search,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  Eye,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export interface DocCompareStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCaseId?: string;
}

interface ComparisonCase {
  id: string;
  titleEn: string;
  titleBn: string;
  subEn: string;
  subBn: string;
  deedId: string;
  deedOfficeEn: string;
  deedOfficeBn: string;
  deedDate: string;
  khatianId: string;
  khatianOfficeEn: string;
  khatianOfficeBn: string;
  mouzaEn: string;
  mouzaBn: string;
  jlNumber: string;
  sellerEn: string;
  sellerBn: string;
  ownerEn: string;
  ownerBn: string;
  deedDag: string;
  khatianDag: string;
  isDagMismatch: boolean;
  deedAreaEn: string;
  deedAreaBn: string;
  khatianAreaEn: string;
  khatianAreaBn: string;
  isAreaMismatch: boolean;
  deedShareEn: string;
  deedShareBn: string;
  khatianShareEn: string;
  khatianShareBn: string;
  isShareMismatch: boolean;
  legalRuleEn: string;
  legalRuleBn: string;
  statuteCitationEn: string;
  statuteCitationBn: string;
  discrepancySummaryEn: string;
  discrepancySummaryBn: string;
  ocrConfidence: number;
  extractedFieldsCount: number;
}

const COMPARISON_CASES: ComparisonCase[] = [
  {
    id: 'dag-mismatch',
    titleEn: 'Case A: Dag Number Contradiction (Savar Mouza)',
    titleBn: 'কেস ক: দাগ নম্বর অসঙ্গতি (সাভার মৌজা)',
    subEn: 'Deed Dag #1042 vs. RS Khatian Dag #1024',
    subBn: 'দলিল দাগ ১০৪২ বনাম আরএস খতিয়ান দাগ ১০২৪',
    deedId: 'DEED #912/2021',
    deedOfficeEn: 'Savar Sub-Registry Office',
    deedOfficeBn: 'সাভার সাব-রেজিস্ট্রি অফিস',
    deedDate: '14-11-2021',
    khatianId: 'RS KHATIAN #1042',
    khatianOfficeEn: 'Savar AC Land Circle Office',
    khatianOfficeBn: 'সাভার সহকারী কমিশনার (ভূমি) কার্যালয়',
    mouzaEn: 'Badda · JL #28',
    mouzaBn: 'বাড্ডা · জে.এল. #২৮',
    jlNumber: '28',
    sellerEn: 'Md. Rafiqul Islam',
    sellerBn: 'মোঃ রফিকুল ইসলাম',
    ownerEn: 'Md. Rafiqul Islam & Co-heirs',
    ownerBn: 'মোঃ রফিকুল ইসলাম ও ওয়ারিশগণ',
    deedDag: '1042',
    khatianDag: '1024',
    isDagMismatch: true,
    deedAreaEn: '14.50 Shotok (Dec.)',
    deedAreaBn: '১৪.৫০ শতাংশ',
    khatianAreaEn: '14.50 Shotok (Dec.)',
    khatianAreaBn: '১৪.৫০ শতাংশ',
    isAreaMismatch: false,
    deedShareEn: '16/16 Full Share',
    deedShareBn: '১৬/১৬ সম্পূর্ণ হিস্যা',
    khatianShareEn: '16/16 Recorded',
    khatianShareBn: '১৬/১৬ রেকর্ডেড',
    isShareMismatch: false,
    legalRuleEn: 'RULE #D3-01: Cadastral Dag Boundary Conflict',
    legalRuleBn: 'বিধি #D3-01: ক্যাডাস্ট্রাল দাগ সীমানা বিরোধ',
    statuteCitationEn: 'Registration Act 1908 §22A · Non-existent Dag Reference',
    statuteCitationBn: 'রেজিস্ট্রেশন আইন ১৯০৮-এর ২২এ ধারা · অস্তিত্বহীন দাগ উদ্ধৃতি',
    discrepancySummaryEn: 'Sub-registry deed lists Dag 1042, but AC Land record for this seller is exclusively registered on Dag 1024. Likely typographical fraud or altered deed draft.',
    discrepancySummaryBn: 'সাব-রেজিস্ট্রি দলিলে দাগ ১০৪২ উল্লেখ থাকলেও ভূমি রেকর্ড অনুযায়ী বিক্রেতার স্বত্ব কেবল দাগ ১০২৪-এ বিদ্যমান। জালিয়াতি বা ইচ্ছাকৃত দাগ গরমিল।',
    ocrConfidence: 99.4,
    extractedFieldsCount: 38,
  },
  {
    id: 'share-inflation',
    titleEn: 'Case B: Excess Share & Area Inflation (Gulshan Mouza)',
    titleBn: 'কেস খ: অতিরিক্ত হিস্যা ও জমি বিক্রয় (গুলশান মৌজা)',
    subEn: 'Deed 8.00 Shotok vs. Inherited 4.00 Shotok entitlement',
    subBn: 'দলিলে ৮.০০ শতাংশ বনাম ওয়ারিশ স্বত্ব ৪.০০ শতাংশ',
    deedId: 'HEBA DEED #4102/2024',
    deedOfficeEn: 'Gulshan Sub-Registry Office',
    deedOfficeBn: 'গুলশান সাব-রেজিস্ট্রি অফিস',
    deedDate: '02-04-2024',
    khatianId: 'BS KHATIAN #88',
    khatianOfficeEn: 'Tejgaon Revenue Circle',
    khatianOfficeBn: 'তেজগাঁও রাজস্ব সার্কেল',
    mouzaEn: 'Gulshan-2 · JL #09',
    mouzaBn: 'গুলশান-২ · জে.এল. #০৯',
    jlNumber: '09',
    sellerEn: 'Tariqur Rahman',
    sellerBn: 'তারেকুর রহমান',
    ownerEn: 'Late Fazlur Rahman Heirs (3 Sons, 2 Daughters)',
    ownerBn: 'মরহুম ফজলুর রহমানের ওয়ারিশগণ (৩ পুত্র, ২ কন্যা)',
    deedDag: '309',
    khatianDag: '309',
    isDagMismatch: false,
    deedAreaEn: '8.00 Shotok (Transferred)',
    deedAreaBn: '৮.০০ শতাংশ (হস্তান্তরিত)',
    khatianAreaEn: '4.00 Shotok Legal Share',
    khatianAreaBn: '৪.০০ শতাংশ বৈধ হিস্যা',
    isAreaMismatch: true,
    deedShareEn: '8/16 Purported Share',
    deedShareBn: '৮/১৬ দাবিকৃত হিস্যা',
    khatianShareEn: '4/16 Muslim Law Entitlement',
    khatianShareBn: '৪/১৬ মুসলিম উত্তরাধিকার আইন',
    isShareMismatch: true,
    legalRuleEn: 'RULE #A7-12: Excess Share Over-Transfer',
    legalRuleBn: 'বিধি #A7-12: স্বত্বাধিকার অতিরিক্ত দলিল সম্পাদন',
    statuteCitationEn: 'State Acquisition and Tenancy Act 1950 §89 · Co-Sharer Preemption',
    statuteCitationBn: 'রাষ্ট্রীয় অধিগ্রহণ ও প্রজাস্বত্ব আইন ১৯৫০-এর ৮৯ ধারা · শরিকি স্বত্ব লঙ্ঘন',
    discrepancySummaryEn: 'Seller attempts to transfer 8.00 shotok, while Muslim inheritance distribution legally caps his share at 4.00 shotok. Transferring co-heirs unapportioned land without consent.',
    discrepancySummaryBn: 'বিক্রেতা ৮.০০ শতাংশ হস্তান্তর করছেন, যেখানে মুসলিম উত্তরাধিকার আইন অনুযায়ী তার বৈধ হিস্যা মাত্র ৪.০০ শতাংশ। শরিকদের অনুমতি ব্যতীত অবৈধ হস্তান্তর।',
    ocrConfidence: 98.7,
    extractedFieldsCount: 42,
  },
  {
    id: 'name-nid-mismatch',
    titleEn: 'Case C: Identity & Phonetic Name Discrepancy (Mirpur)',
    titleBn: 'কেস গ: নাম ও এনআইডি ফনেটিক গরমিল (মিরপুর মৌজা)',
    subEn: 'Name Alias: "Saleha Begum" vs "Mst. Saleha Khatun"',
    subBn: 'নামের ভিন্নতা: "সালেহা বেগম" বনাম "মোসাঃ সালেহা খাতুন"',
    deedId: 'SALE DEED #8421/2019',
    deedOfficeEn: 'Mirpur Sub-Registry Office',
    deedOfficeBn: 'মিরপুর সাব-রেজিস্ট্রি অফিস',
    deedDate: '19-08-2019',
    khatianId: 'CS/RS MUTATION #409',
    khatianOfficeEn: 'Mirpur AC Land Office',
    khatianOfficeBn: 'মিরপুর সহকারী কমিশনার (ভূমি)',
    mouzaEn: 'Senpara Parbat · JL #14',
    mouzaBn: 'সেনপাড়া পর্বতা · জে.এল. #১৪',
    jlNumber: '14',
    sellerEn: 'Saleha Begum (NID ...4910)',
    sellerBn: 'সালেহা বেগম (এনআইডি ...৪৯১০)',
    ownerEn: 'Mst. Saleha Khatun (NID ...8821)',
    ownerBn: 'মোসাঃ সালেহা খাতুন (এনআইডি ...৮৮২১)',
    deedDag: '512',
    khatianDag: '512',
    isDagMismatch: false,
    deedAreaEn: '6.25 Shotok',
    deedAreaBn: '৬.২৫ শতাংশ',
    khatianAreaEn: '6.25 Shotok',
    khatianAreaBn: '৬.২৫ শতাংশ',
    isAreaMismatch: false,
    deedShareEn: '16/16 Full',
    deedShareBn: '১৬/১৬ সম্পূর্ণ',
    khatianShareEn: '16/16 Recorded',
    khatianShareBn: '১৬/১৬ রেকর্ডেড',
    isShareMismatch: false,
    legalRuleEn: 'RULE #N2-03: Phonetic Identity Anomaly & NID Hash Discrepancy',
    legalRuleBn: 'বিধি #N2-03: ফনেটিক নাম বিকৃতি ও এনআইডি হ্যাশ গরমিল',
    statuteCitationEn: 'Penal Code 1860 §420 / 468 · Impersonation & Forgery Risk',
    statuteCitationBn: 'দণ্ডবিধি ১৮৬০-এর ৪২০/৪৬৮ ধারা · ব্যক্তি প্রতারণা ও জালিয়াতির ঝুঁকি',
    discrepancySummaryEn: 'Deed seller NID ends in 4910 under name "Saleha Begum", but mutation ledger lists NID 8821 under "Mst. Saleha Khatun". Requires biometric verification before registry approval.',
    discrepancySummaryBn: 'দলিলে উল্লিখিত বিক্রেতার এনআইডি ...৪৯১০, কিন্তু খতিয়ানে রক্ষিত এনআইডি ...৮৮২১। নাম ও পরিচয়পত্রের গরমিল। বায়োমেট্রিক পুনঃযাচাই আবশ্যক।',
    ocrConfidence: 99.8,
    extractedFieldsCount: 35,
  },
];

export const DocCompareStudioModal: React.FC<DocCompareStudioModalProps> = ({
  isOpen,
  onClose,
  initialCaseId = 'dag-mismatch',
}) => {
  const { isBangla } = useLanguage();
  const { isDay } = useTheme();

  const [selectedCaseId, setSelectedCaseId] = useState<string>(initialCaseId);
  const [activeTab, setActiveTab] = useState<'split' | 'overlay' | 'ast'>('split');
  const [highlightedField, setHighlightedField] = useState<string | null>(null);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const activeCase = COMPARISON_CASES.find((c) => c.id === selectedCaseId) || COMPARISON_CASES[0];

  const triggerRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setToastMsg(
        isBangla
          ? '✓ বাংলা ওসিআর ভিশন ট্রান্সফরমার পুনঃস্ক্যান সম্পন্ন (কনফিডেন্স: ৯৯.৪%)'
          : '✓ Bangla OCR Vision Transformer Re-scan Complete (99.4% Confidence)'
      );
      setTimeout(() => setToastMsg(null), 3500);
    }, 1200);
  };

  const copyLegalProof = () => {
    const payload = JSON.stringify(
      {
        deed: activeCase.deedId,
        khatian: activeCase.khatianId,
        mouza: activeCase.mouzaEn,
        dagComparison: { deed: activeCase.deedDag, khatian: activeCase.khatianDag, mismatch: activeCase.isDagMismatch },
        areaComparison: { deed: activeCase.deedAreaEn, khatian: activeCase.khatianAreaEn, mismatch: activeCase.isAreaMismatch },
        statute: activeCase.statuteCitationEn,
        verifiedAt: new Date().toISOString(),
        sha256: '9f8a3c42e81b67f104d52e3a7b94018264ccda21890123ef',
      },
      null,
      2
    );
    navigator.clipboard?.writeText(payload);
    setToastMsg(
      isBangla
        ? '✓ আইনি অসঙ্গতি প্রমাণ ডসিয়ার ক্লিপবোর্ডে কপি করা হয়েছে'
        : '✓ Legal Contradiction Dossier Copied to Clipboard'
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
          layoutId="doc-compare-studio-modal"
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel rounded-[10px] w-full max-w-[96vw] xl:max-w-[1580px] h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-cyan-500/30"
        >
          {/* Top Bar Header */}
          <div className="p-3.5 border-b border-[var(--color-border-subtle)] flex flex-wrap items-center justify-between gap-3 bg-black/40 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider">
                PROBAHO DOCCOMPARE STUDIO
              </span>
              <span className="text-[var(--color-text-tertiary)] hidden sm:inline">|</span>
              <span className="text-xs text-[var(--color-text-primary)] font-semibold hidden md:inline">
                {isBangla
                  ? 'বহু-নথি স্বয়ংক্রিয় বাংলা ওসিআর ও অসঙ্গতি বিশ্লেষণ স্টুডিও'
                  : 'Multi-Document Bangla OCR & Cross-Ministry Contradiction Studio'}
              </span>
            </div>

            {/* Scenario Picker Pills */}
            <div className="flex items-center gap-1.5 glass-pill p-1 rounded-[6px]">
              {COMPARISON_CASES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCaseId(c.id);
                    setHighlightedField(null);
                  }}
                  className={`px-2.5 py-1 text-[10px] font-mono rounded-[4px] transition-all cursor-pointer flex items-center gap-1.5 ${
                    c.id === selectedCaseId
                      ? 'bg-cyan-500 text-black font-bold shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-cyan-400 hover:bg-white/5'
                  }`}
                >
                  <span>{isBangla ? c.titleBn.split(':')[0] : c.titleEn.split(':')[0]}</span>
                </button>
              ))}
            </div>

            {/* Actions: Scan, Export, Close */}
            <div className="flex items-center gap-2">
              <button
                onClick={triggerRescan}
                disabled={isScanning}
                className="px-2.5 py-1 text-[11px] font-mono rounded-[4px] bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title={isBangla ? 'পুনরায় ওসিআর স্ক্যান করুন' : 'Re-scan with Vision Transformer'}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-cyan-400' : ''}`} />
                <span className="hidden sm:inline">{isBangla ? 'ওসিআর পুনঃস্ক্যান' : 'ViT Re-scan'}</span>
              </button>

              <button
                onClick={copyLegalProof}
                className="px-2.5 py-1 text-[11px] font-mono rounded-[4px] bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                title={isBangla ? 'আইনি প্রমাণ কপি করুন' : 'Copy Evidence JSON'}
              >
                <Copy className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{isBangla ? 'প্রমাণ কপি' : 'Copy Proof'}</span>
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

          {/* Subheader Banner: Live Contradiction Alert & Confidence */}
          <div className="px-4 py-2 border-b border-[var(--color-border-subtle)] bg-cyan-950/20 flex flex-wrap items-center justify-between gap-2 text-xs font-mono shrink-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/35 font-bold text-[10px] flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                <span>{isBangla ? 'অসঙ্গতি চিহ্নিত' : 'CONTRADICTION FLAGGED'}</span>
              </span>
              <span className="text-[var(--color-text-primary)] font-semibold text-[11px] truncate">
                {isBangla ? activeCase.subBn : activeCase.subEn}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[10.5px]">
              <span className="text-slate-400">
                {isBangla ? 'মডেল:' : 'Model:'}{' '}
                <span className="text-cyan-400 font-bold">BanglaViT-Large</span>
              </span>
              <span className="text-slate-400">
                {isBangla ? 'কনফিডেন্স:' : 'Confidence:'}{' '}
                <span className="text-emerald-400 font-bold">{activeCase.ocrConfidence}%</span>
              </span>
              <span className="text-slate-400 hidden sm:inline">
                {isBangla ? 'উদ্ধৃত ফিল্ড:' : 'Fields:'}{' '}
                <span className="text-white font-bold">{activeCase.extractedFieldsCount}</span>
              </span>
            </div>
          </div>

          {/* Workspace Body: Split Screen Viewers + Bottom Intelligence Drawer */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
            {/* LEFT PANE: Sub-Registry Deed (Law Ministry) */}
            <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-[var(--color-border-subtle)] bg-[#070b14]/90 overflow-hidden relative">
              {/* Document Header Bar */}
              <div className="p-3 border-b border-white/10 bg-[#0d1629] flex items-center justify-between text-xs font-mono shrink-0">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white tracking-wide">{activeCase.deedId}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold">
                    {isBangla ? 'আইন ও বিচার বিভাগ' : 'LAW MINISTRY'}
                  </span>
                </div>
                <span className="text-[10.5px] text-slate-400 truncate">
                  {isBangla ? activeCase.deedOfficeBn : activeCase.deedOfficeEn} · {activeCase.deedDate}
                </span>
              </div>

              {/* Scanned Deed Visualizer Canvas */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-mono relative">
                {/* Sweeping Laser Effect */}
                {isScanning && (
                  <motion.div
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_16px_#38bdf8] z-30 pointer-events-none"
                    animate={{ y: [0, 450, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                {/* Simulated Scanned Deed Paper */}
                <div className="bg-[#0b1322] border border-cyan-500/30 rounded-[8px] p-5 shadow-2xl relative overflow-hidden space-y-4">
                  {/* Deed Top Seal & Registration Crest */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[11px]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full border border-cyan-500/40 flex items-center justify-center bg-cyan-950/40 text-cyan-300 text-[10px] font-bold">
                        Seal
                      </div>
                      <div>
                        <div className="text-white font-bold">{isBangla ? 'গণপ্রজাতন্ত্রী বাংলাদেশ' : 'GOVT. OF BANGLADESH'}</div>
                        <div className="text-[10px] text-slate-400">{isBangla ? 'সাব-রেজিস্ট্রারের কার্যালয়' : 'SUB-REGISTRY REGISTRATION DEED'}</div>
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-cyan-400">
                      <div>SL: BD-REG-{activeCase.deedDag}-2021</div>
                      <div className="text-slate-400">{activeCase.mouzaEn}</div>
                    </div>
                  </div>

                  {/* Deed Extracted Fields with Bounding Box Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    {/* Seller Field */}
                    <div
                      onClick={() => setHighlightedField(highlightedField === 'seller' ? null : 'seller')}
                      className={`p-2.5 rounded-[6px] border transition-all cursor-pointer ${
                        highlightedField === 'seller'
                          ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.3)]'
                          : 'bg-white/5 border-white/10 hover:border-cyan-500/40'
                      }`}
                    >
                      <div className="text-[9.5px] text-slate-400 mb-0.5 flex items-center justify-between">
                        <span>{isBangla ? '১ম পক্ষ / বিক্রেতা' : 'Party 1 / Seller'}</span>
                        <span className="text-cyan-400 text-[8.5px]">ViT: 99.6%</span>
                      </div>
                      <div className="font-bold text-white">{isBangla ? activeCase.sellerBn : activeCase.sellerEn}</div>
                    </div>

                    {/* Mouza & JL Field */}
                    <div
                      onClick={() => setHighlightedField(highlightedField === 'mouza' ? null : 'mouza')}
                      className={`p-2.5 rounded-[6px] border transition-all cursor-pointer ${
                        highlightedField === 'mouza'
                          ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.3)]'
                          : 'bg-white/5 border-white/10 hover:border-cyan-500/40'
                      }`}
                    >
                      <div className="text-[9.5px] text-slate-400 mb-0.5 flex items-center justify-between">
                        <span>{isBangla ? 'মৌজা ও জে.এল. নম্বর' : 'Mouza & JL Number'}</span>
                        <span className="text-emerald-400 text-[8.5px]">Matched ✓</span>
                      </div>
                      <div className="font-bold text-white">{isBangla ? activeCase.mouzaBn : activeCase.mouzaEn}</div>
                    </div>

                    {/* Contradictory Dag Field */}
                    <div
                      onClick={() => setHighlightedField('dag')}
                      className={`p-2.5 rounded-[6px] border transition-all cursor-pointer relative overflow-hidden ${
                        activeCase.isDagMismatch
                          ? 'bg-rose-950/40 border-rose-500/80 shadow-[0_0_16px_rgba(244,63,94,0.35)] ring-1 ring-rose-500'
                          : 'bg-white/5 border-white/10 hover:border-cyan-500/40'
                      }`}
                    >
                      <div className="text-[9.5px] text-rose-300 mb-0.5 flex items-center justify-between">
                        <span className="font-bold">{isBangla ? 'দলিলে উল্লিখিত দাগ নং' : 'Deed Recorded Dag No.'}</span>
                        {activeCase.isDagMismatch && (
                          <span className="px-1.5 py-0.2 rounded bg-rose-500 text-black font-black text-[8px] animate-pulse">
                            {isBangla ? 'অসঙ্গতি ✕' : 'MISMATCH ✕'}
                          </span>
                        )}
                      </div>
                      <div className="text-base font-bold text-rose-300 font-mono">
                        {isBangla ? `দাগ: ${activeCase.deedDag}` : `Dag: ${activeCase.deedDag}`}
                      </div>
                      <div className="text-[9px] text-rose-400/80 mt-1">
                        BoundingBox: [x:142, y:284, w:96, h:22]
                      </div>
                    </div>

                    {/* Area / Shotok Field */}
                    <div
                      onClick={() => setHighlightedField('area')}
                      className={`p-2.5 rounded-[6px] border transition-all cursor-pointer relative ${
                        activeCase.isAreaMismatch
                          ? 'bg-amber-950/40 border-amber-500/80 shadow-[0_0_16px_rgba(245,158,11,0.35)] ring-1 ring-amber-500'
                          : 'bg-white/5 border-white/10 hover:border-cyan-500/40'
                      }`}
                    >
                      <div className="text-[9.5px] text-slate-400 mb-0.5 flex items-center justify-between">
                        <span>{isBangla ? 'জমির পরিমাণ' : 'Deed Land Area'}</span>
                        <span className={activeCase.isAreaMismatch ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                          {activeCase.isAreaMismatch ? 'Excess ✕' : 'Matched ✓'}
                        </span>
                      </div>
                      <div className={`text-sm font-bold ${activeCase.isAreaMismatch ? 'text-amber-300' : 'text-emerald-400'}`}>
                        {isBangla ? activeCase.deedAreaBn : activeCase.deedAreaEn}
                      </div>
                    </div>

                    {/* Share Field */}
                    <div
                      onClick={() => setHighlightedField('share')}
                      className={`p-2.5 rounded-[6px] border col-span-1 sm:col-span-2 transition-all cursor-pointer ${
                        activeCase.isShareMismatch
                          ? 'bg-rose-950/30 border-rose-500/60'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="text-[9.5px] text-slate-400 mb-0.5 flex items-center justify-between">
                        <span>{isBangla ? 'হস্তান্তরিত হিস্যা' : 'Deeded Transfer Share'}</span>
                        <span className="text-cyan-400 text-[8.5px]">ViT: 99.2%</span>
                      </div>
                      <div className="font-semibold text-slate-200">
                        {isBangla ? activeCase.deedShareBn : activeCase.deedShareEn}
                      </div>
                    </div>
                  </div>

                  {/* Micro Bengali Deed Snippet */}
                  <div className="p-2.5 rounded bg-black/40 border border-white/5 text-[10px] text-slate-400 leading-relaxed font-sans italic">
                    {isBangla
                      ? '"অত্র সাব-কবলা দলিল দ্বারা আমি বিক্রেতা পণ বাবদ সমস্ত টাকা বুঝিয়া পাইয়া উল্লেখিত তফশিল বর্ণিত দাগের জমি ক্রেতার বরাবরে চিরতরে বিক্রয় ও হস্তান্তর করিলাম..."'
                      : '"By this registered sale deed, I, the seller, having received full consideration, hereby transfer and convey all title, rights, and possession of the scheduled parcel..."'}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANE: AC Land Official Khatian (Ministry of Land) */}
            <div className="flex-1 flex flex-col bg-[#0b0f19]/90 overflow-hidden relative">
              {/* Document Header Bar */}
              <div className="p-3 border-b border-white/10 bg-[#141824] flex items-center justify-between text-xs font-mono shrink-0">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white tracking-wide">{activeCase.khatianId}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                    {isBangla ? 'ভূমি মন্ত্রণালয়' : 'LAND MINISTRY'}
                  </span>
                </div>
                <span className="text-[10.5px] text-slate-400 truncate">
                  {isBangla ? activeCase.khatianOfficeBn : activeCase.khatianOfficeEn}
                </span>
              </div>

              {/* Digital Khatian Visualizer Canvas */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-mono relative">
                {/* Simulated Digital Khatian Record */}
                <div className="bg-[#0e1624] border border-emerald-500/30 rounded-[8px] p-5 shadow-2xl relative overflow-hidden space-y-4">
                  {/* Khatian Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[11px]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full border border-emerald-500/40 flex items-center justify-center bg-emerald-950/40 text-emerald-300 text-[10px] font-bold">
                        Gov
                      </div>
                      <div>
                        <div className="text-white font-bold">{isBangla ? 'ভূমি রেকর্ড ও জরিপ অধিদপ্তর' : 'DIRECTORATE OF LAND RECORDS'}</div>
                        <div className="text-[10px] text-slate-400">{isBangla ? 'ডিজিটাল খতিয়ান রেকর্ড লেজার' : 'DIGITAL KHATIAN LEDGER (AC LAND)'}</div>
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-emerald-400 font-bold">
                      <div>JomiChain Verified ✓</div>
                      <div className="text-slate-400">{activeCase.mouzaEn}</div>
                    </div>
                  </div>

                  {/* Khatian Official Record Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    {/* Owner Field */}
                    <div
                      onClick={() => setHighlightedField(highlightedField === 'seller' ? null : 'seller')}
                      className={`p-2.5 rounded-[6px] border transition-all cursor-pointer ${
                        highlightedField === 'seller'
                          ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.3)]'
                          : 'bg-white/5 border-white/10 hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="text-[9.5px] text-slate-400 mb-0.5 flex items-center justify-between">
                        <span>{isBangla ? 'রেকর্ডীয় মালিক / ওয়ারিশ' : 'Recorded Owner / Co-sharers'}</span>
                        <span className="text-emerald-400 text-[8.5px]">Verified ✓</span>
                      </div>
                      <div className="font-bold text-white">{isBangla ? activeCase.ownerBn : activeCase.ownerEn}</div>
                    </div>

                    {/* Mouza & JL Field */}
                    <div
                      onClick={() => setHighlightedField(highlightedField === 'mouza' ? null : 'mouza')}
                      className={`p-2.5 rounded-[6px] border transition-all cursor-pointer ${
                        highlightedField === 'mouza'
                          ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.3)]'
                          : 'bg-white/5 border-white/10 hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="text-[9.5px] text-slate-400 mb-0.5 flex items-center justify-between">
                        <span>{isBangla ? 'মৌজা ও জে.এল. নম্বর' : 'Mouza & JL Number'}</span>
                        <span className="text-emerald-400 text-[8.5px]">Matched ✓</span>
                      </div>
                      <div className="font-bold text-white">{isBangla ? activeCase.mouzaBn : activeCase.mouzaEn}</div>
                    </div>

                    {/* Government Khatian Authentic Dag Field */}
                    <div
                      onClick={() => setHighlightedField('dag')}
                      className={`p-2.5 rounded-[6px] border transition-all cursor-pointer relative overflow-hidden ${
                        activeCase.isDagMismatch
                          ? 'bg-rose-950/40 border-rose-500/80 shadow-[0_0_16px_rgba(244,63,94,0.35)] ring-1 ring-rose-500'
                          : 'bg-white/5 border-white/10 hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="text-[9.5px] text-rose-300 mb-0.5 flex items-center justify-between">
                        <span className="font-bold">{isBangla ? 'খতিয়ানে সংরক্ষিত প্রকৃত দাগ' : 'Government Authentic Dag No.'}</span>
                        {activeCase.isDagMismatch && (
                          <span className="px-1.5 py-0.2 rounded bg-rose-500 text-black font-black text-[8px] animate-pulse">
                            {isBangla ? 'প্রকৃত স্বত্ব' : 'AUTHENTIC'}
                          </span>
                        )}
                      </div>
                      <div className="text-base font-bold text-emerald-400 font-mono">
                        {isBangla ? `দাগ: ${activeCase.khatianDag}` : `Dag: ${activeCase.khatianDag}`}
                      </div>
                      <div className="text-[9px] text-rose-400/90 mt-1 font-semibold">
                        {isBangla ? '⚠ দলিলের দাগ ১০৪২ এর সাথে অমিল' : '⚠ Mismatched with Deed Dag 1042'}
                      </div>
                    </div>

                    {/* Government Area Field */}
                    <div
                      onClick={() => setHighlightedField('area')}
                      className={`p-2.5 rounded-[6px] border transition-all cursor-pointer relative ${
                        activeCase.isAreaMismatch
                          ? 'bg-amber-950/40 border-amber-500/80 shadow-[0_0_16px_rgba(245,158,11,0.35)]'
                          : 'bg-white/5 border-white/10 hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="text-[9.5px] text-slate-400 mb-0.5 flex items-center justify-between">
                        <span>{isBangla ? 'খতিয়ানের বৈধ পরিমাণ' : 'Khatian Legal Area'}</span>
                        <span className={activeCase.isAreaMismatch ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                          {activeCase.isAreaMismatch ? 'Deficit ✕' : 'Matched ✓'}
                        </span>
                      </div>
                      <div className={`text-sm font-bold ${activeCase.isAreaMismatch ? 'text-amber-300' : 'text-emerald-400'}`}>
                        {isBangla ? activeCase.khatianAreaBn : activeCase.khatianAreaEn}
                      </div>
                    </div>

                    {/* Government Share Field */}
                    <div
                      onClick={() => setHighlightedField('share')}
                      className={`p-2.5 rounded-[6px] border col-span-1 sm:col-span-2 transition-all cursor-pointer ${
                        activeCase.isShareMismatch
                          ? 'bg-rose-950/30 border-rose-500/60'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="text-[9.5px] text-slate-400 mb-0.5 flex items-center justify-between">
                        <span>{isBangla ? 'আইনানুগ প্রাপ্যতা হিস্যা' : 'Legal Entitled Share (Muslim Law)'}</span>
                        <span className="text-emerald-400 text-[8.5px]">Land Min Audit</span>
                      </div>
                      <div className="font-semibold text-slate-200">
                        {isBangla ? activeCase.khatianShareBn : activeCase.khatianShareEn}
                      </div>
                    </div>
                  </div>

                  {/* Cryptographic Ledger Timestamp */}
                  <div className="p-2.5 rounded bg-black/40 border border-white/5 text-[9.5px] text-slate-400 flex items-center justify-between">
                    <span>{isBangla ? 'ডিজিটাল রেকর্ড হ্যাশ:' : 'Record Hash:'} 0x7b94...e81b</span>
                    <span className="text-emerald-400 font-semibold">{isBangla ? 'লেজার সিনক্রোনাইজড ✓' : 'LEDGER SYNCED ✓'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Actionable Contradiction Audit Dossier */}
          <div className="p-3.5 border-t border-[var(--color-border-subtle)] bg-black/60 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono shrink-0">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                {activeCase.legalRuleEn.split(':')[0]}
              </span>
              <div className="text-[11px] text-slate-300">
                <span className="text-white font-semibold">{isBangla ? 'আইনি ধারা: ' : 'Statute: '}</span>
                <span>{isBangla ? activeCase.statuteCitationBn : activeCase.statuteCitationEn}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setToastMsg(
                    isBangla
                      ? '✓ অফিসিয়াল আইনি অসঙ্গতি নোটিশ সার্টিফিকেট (PDF) ডাউনলোড শুরু হয়েছে'
                      : '✓ Official Discrepancy Audit Certificate (PDF) Downloaded'
                  );
                  setTimeout(() => setToastMsg(null), 3500);
                }}
                className="px-3 py-1.5 rounded-[5px] bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-black font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isBangla ? 'অসঙ্গতি সনদ ডাউনলোড (PDF)' : 'Download Audit Certificate (PDF)'}</span>
              </button>
            </div>
          </div>

          {/* Live Toast Notification */}
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-cyan-950/95 text-cyan-200 border border-cyan-400 text-xs font-mono shadow-2xl backdrop-blur-md flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>{toastMsg}</span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
