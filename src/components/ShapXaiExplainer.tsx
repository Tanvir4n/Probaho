/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Probaho — SHAP XAI (SHapley Additive exPlanations) Land Risk Explainer
 * 
 * Provides an interactive, mathematically grounded Explainable AI (XAI) interface:
 * - Mathematical Decomposition: f(x) = E[f(x)] + Σ ϕᵢ
 * - Interactive SHAP Waterfall Plot (Base Value -> Positive Risk Drivers -> Negative Protective Mitigators -> Final Risk)
 * - Feature Importance Ranking (Tornado Bar Plot)
 * - Causal Counterfactual / What-If Remedy Simulator
 * - Multi-plot comparative inspection (Plot #1042 Clean vs. Plot #3078 High Anomaly)
 * - Plain-language legal & cryptographic statutory citations
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Cpu,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Download,
  Copy,
  Info,
  Check,
  Layers,
  ArrowRight,
  Eye,
  GitBranch,
  FileCheck2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface ShapFactor {
  id: string;
  nameEn: string;
  nameBn: string;
  category: 'CONCURRENCY' | 'SPATIAL' | 'LEGAL' | 'IDENTITY' | 'LINEAGE';
  actualValEn: string;
  actualValBn: string;
  phi: number; // Positive = pushes risk UP (red), Negative = pushes risk DOWN (green)
  status: 'PASS' | 'WARNING' | 'FAIL' | 'CURED';
  statuteEn: string;
  statuteBn: string;
  explanationEn: string;
  explanationBn: string;
  remedyKey?: string;
  remedyTitleEn?: string;
  remedyTitleBn?: string;
  remedyDelta?: number;
}

export interface ShapPlotProfile {
  plotId: string;
  plotNumber: string;
  mouzaEn: string;
  mouzaBn: string;
  ownerEn: string;
  ownerBn: string;
  areaShotok: number;
  baseExpectedScore: number; // E[f(x)]
  factors: ShapFactor[];
}

const SHAP_PROFILES: Record<string, ShapPlotProfile> = {
  'plot-1042': {
    plotId: 'plot-1042',
    plotNumber: 'Dag 1042',
    mouzaEn: 'Dhanmondi (Mouza 04)',
    mouzaBn: 'ধানমন্ডি (মৌজা ০৪)',
    ownerEn: 'Mohammad Rafiqul Islam',
    ownerBn: 'মোহাম্মদ রফিকুল ইসলাম',
    areaShotok: 14.5,
    baseExpectedScore: 18.2,
    factors: [
      {
        id: 'lineage',
        nameEn: 'Survey Lineage Conservation',
        nameBn: 'জরিপ ধারাবাহিকতা ও আয়তন সংরক্ষণ',
        category: 'LINEAGE',
        actualValEn: '0.0% variance (14.5 shotok across CS→SA→RS→BS)',
        actualValBn: '০.০% তারতম্য (সিএস→এসএ→আরএস→বিএস নিরবচ্ছিন্ন)',
        phi: -5.4,
        status: 'PASS',
        statuteEn: 'SAT Act §89 · Continuous Cadastral Lineage',
        statuteBn: 'রাষ্ট্রীয় অধিগ্রহণ আইন ৮৯ ধারা · নিরবচ্ছিন্ন ধারাবাহিকতা',
        explanationEn: 'Area across CS (29.0), SA (14.5 partition), RS (14.5), and BS (14.5) matches perfectly with unbroken ownership chain.',
        explanationBn: 'সিএস (২৯.০), এসএ (১৪.৫ ভাগ), আরএস (১৪.৫) ও বিএস (১৪.৫) জরিপের জমির পরিমাণ শতভাগ সংগতিপূর্ণ। কোনো গোপন বণ্টন নেই।',
      },
      {
        id: 'hashchain',
        nameEn: 'Ed25519 Cryptographic Hash Chain',
        nameBn: 'Ed25519 ক্রিপ্টোগ্রাফিক লেজার সততা',
        category: 'LEGAL',
        actualValEn: '5/5 blocks signed · Merkle root intact',
        actualValBn: '৫/৫ ব্লক ডিজিটাল স্বাক্ষরিত · মারকেল রুট অক্ষত',
        phi: -4.2,
        status: 'PASS',
        statuteEn: 'Registration Act §52 · Verified Ledger Hash',
        statuteBn: 'রেজিস্ট্রেশন আইন ৫২ ধারা · যাচাইকৃত ডিজিটাল লেজার',
        explanationEn: 'All 5 survey and deed records are cryptographically verified with Ed25519 digital signatures and zero tampering.',
        explanationBn: 'সকল ৫টি জরিপ ও দলিল রেকর্ড Ed25519 ডিজিটাল স্বাক্ষরে সুরক্ষিত। কোনো ডাটাবেস বিকৃতি বা টেম্পারিং নেই।',
      },
      {
        id: 'concurrency',
        nameEn: 'Double-Sale Concurrency Protection',
        nameBn: 'দ্বৈত-বিক্রয় কনকারেন্সি সফট-লক',
        category: 'CONCURRENCY',
        actualValEn: '0 overlapping sub-registry soft-locks',
        actualValBn: 'কোনো সমান্তরাল সাব-রেজিস্ট্রি সফট-লক নেই',
        phi: -2.8,
        status: 'PASS',
        statuteEn: 'JomiChain Rule §P3-04 · 72h Concurrency Pre-Lock',
        statuteBn: 'জমিচেইন বিধি §P3-04 · ৭২ ঘণ্টা কনকারেন্সি প্রি-লক',
        explanationEn: 'No pending deed registration or reservation lock detected across 4 metropolitan sub-registry offices.',
        explanationBn: '৪টি মেট্রোপলিটন সাব-রেজিস্ট্রি অফিসে কোনো অপেক্ষমাণ দলিল বা সমান্তরাল বিক্রি চেষ্টা পাওয়া যায়নি।',
      },
      {
        id: 'encumbrance',
        nameEn: 'Encumbrance & Mortgage Lien Check',
        nameBn: 'দায়মুক্তি ও ব্যাংক বন্ধকী যাচাই',
        category: 'LEGAL',
        actualValEn: 'No unsatisfied bank liens recorded',
        actualValBn: 'কোনো অপরিশোধিত ব্যাংক দায় বা মর্টগেজ নেই',
        phi: -1.8,
        status: 'PASS',
        statuteEn: 'Transfer of Property Act §58 · Clear Title',
        statuteBn: 'সম্পত্তি হস্তান্তর আইন ৫৮ ধারা · নির্ভেজাল স্বত্ব',
        explanationEn: 'No bank mortgage charge, court attachment, or litigation encumbrance exists on this plot passport.',
        explanationBn: 'এই জমির প্লট পাসপোর্টে কোনো ব্যাংক ঋণ, আদালতের নিষেধাজ্ঞা বা দায়দেনা নেই। শতভাগ দায়মুক্ত।',
      },
    ],
  },
  'plot-3078': {
    plotId: 'plot-3078',
    plotNumber: 'Dag 3078',
    mouzaEn: 'Mirpur (Mouza 12)',
    mouzaBn: 'মিরপুর (মৌজা ১২)',
    ownerEn: 'Md. Enamul Haque',
    ownerBn: 'মোঃ এনামুল হক',
    areaShotok: 18.2,
    baseExpectedScore: 18.2,
    factors: [
      {
        id: 'concurrency',
        nameEn: 'Double-Sale Concurrency Collision',
        nameBn: 'দ্বৈত-বিক্রয় সমান্তরাল সংঘাত আক্রমণ',
        category: 'CONCURRENCY',
        actualValEn: 'Pending unverified deed at Mohammadpur (#9124)',
        actualValBn: 'মোহাম্মদপুর সাব-রেজিস্ট্রিতে সক্রিয় দলিল জমা (#৯১২৪)',
        phi: 32.4,
        status: 'FAIL',
        statuteEn: 'TP Act §53A · Double-Sale Pre-Lock Collision',
        statuteBn: 'সম্পত্তি হস্তান্তর আইন ৫৩এ ধারা · দ্বৈত-বিক্রয় সংঘাত',
        explanationEn: 'Sub-registry lock collision detected! A concurrent deed submission occurred 42 seconds prior at Mohammadpur office.',
        explanationBn: 'সাব-রেজিস্ট্রি লক সংঘাত শনাক্ত হয়েছে! মোহাম্মদপুর অফিসে ৪২ সেকেন্ড পূর্বে একই দাগে একটি বিকল্প দলিল জমা দেওয়া হয়েছে।',
        remedyKey: 'softLock',
        remedyTitleEn: 'Enforce JomiChain 72h Concurrency Pre-Lock',
        remedyTitleBn: '৭২ ঘণ্টার কনকারেন্সি প্রি-লক কার্যকর করে সংঘাত কোয়ারেন্টাইন',
        remedyDelta: -32.4,
      },
      {
        id: 'spatial',
        nameEn: 'Unexplained Cadastral Area Inflation',
        nameBn: 'ব্যাখ্যাহীন ক্যাডাস্ট্রাল জমি স্ফীতি',
        category: 'SPATIAL',
        actualValEn: '+6.2 shotok unexplained surplus (18.2 vs 12.0)',
        actualValBn: '+৬.২ শতাংশ অতিরিক্ত জমি (১৮.২ বনাম ১২.০)',
        phi: 24.8,
        status: 'FAIL',
        statuteEn: 'SAT Act §89 · Unapportioned Surplus Encroachment',
        statuteBn: 'রাষ্ট্রীয় অধিগ্রহণ আইন ৮৯ ধারা · অতিরিক্ত জমি দখল',
        explanationEn: 'BS Khatian claims 18.2 shotok, whereas historic RS Khatian recorded 12.0 shotok with no supporting registered partition deed.',
        explanationBn: 'বিএস খতিয়ানে ১৮.২ শতাংশ দাবি করা হয়েছে, যেখানে আরএস রেকর্ডে ছিল ১২.০ শতাংশ। ৬.২ শতাংশ জমির কোনো বণ্টন দলিল নেই।',
        remedyKey: 'rectifyArea',
        remedyTitleEn: 'Execute Rectification Deed (ভ্রম সংশোধন) for 6.2 shotok',
        remedyTitleBn: 'ভ্রম সংশোধন দলিল সম্পাদন ও ৬.২ শতাংশ হিস্যা প্রত্যাহার',
        remedyDelta: -27.3,
      },
      {
        id: 'lien',
        nameEn: 'Active Unsatisfied Mortgage Lien',
        nameBn: 'সক্রিয় অপরিশোধিত ব্যাংক বন্ধকী দায়',
        category: 'LEGAL',
        actualValEn: 'Agrani Bank Charge: ৳ 45,00,000 active',
        actualValBn: 'অগ্রণী ব্যাংক বন্ধক: ৪৫,০০,০০০ টাকা সক্রিয় দায়',
        phi: 18.5,
        status: 'FAIL',
        statuteEn: 'TP Act §58 · Undischarged Financial Encumbrance',
        statuteBn: 'সম্পত্তি হস্তান্তর আইন ৫৮ ধারা · অপরিশোধিত আর্থিক দায়',
        explanationEn: 'Unsatisfied bank mortgage charge registered at Mirpur Branch without release deed or legal No-Objection Certificate.',
        explanationBn: 'অগ্রণী ব্যাংক মিরপুর শাখায় ৪৫ লাখ টাকার বন্ধকী দায় রয়েছে। ব্যাংক থেকে কোনো দায়মুক্তি বা এনওসি পাওয়া যায়নি।',
        remedyKey: 'releaseLien',
        remedyTitleEn: 'Obtain Bank Mortgage Discharge & Lien NOC',
        remedyTitleBn: 'ব্যাংক দায়মুক্তি সনদ (NOC) ও বন্ধক অবমুক্তকরণ দলিল সম্পাদন',
        remedyDelta: -18.5,
      },
      {
        id: 'identity',
        nameEn: 'Bangla Name Fuzzy Anomaly',
        nameBn: 'বাংলা নাম ফনেটিক ও এনআইডি গরমিল',
        category: 'IDENTITY',
        actualValEn: 'Similarity: 68% ("এনামুল হক" vs "মোঃ এনামুল কবির")',
        actualValBn: 'সাদৃশ্য: ৬৮% ("এনামুল হক" বনাম "মোঃ এনামুল কবির")',
        phi: 12.1,
        status: 'WARNING',
        statuteEn: 'Registration Act §22A · Identity Verification Gap',
        statuteBn: 'রেজিস্ট্রেশন আইন ২২এ ধারা · পরিচয় যাচাইকরণ গরমিল',
        explanationEn: 'Deed seller name diverges from Khatian record beyond acceptable phonetic threshold (68% vs 85% requirement).',
        explanationBn: 'দলিলে উল্লিখিত বিক্রেতার নাম ও খতিয়ানের নামে ৩২% অমিল রয়েছে, যা অনুমোদিত ফনেটিক সীমার বাইরে।',
        remedyKey: 'nidAffidavit',
        remedyTitleEn: 'Submit Smart NID Biometric Affidavit from EC',
        remedyTitleBn: 'নির্বাচন কমিশনের স্মার্ট এনআইডি বায়োমেট্রিক হলফনামা সমন্বয়',
        remedyDelta: -15.1,
      },
      {
        id: 'lineage-base',
        nameEn: 'Historical CS/SA Ancestry Roots',
        nameBn: 'ঐতিহাসিক সিএস/এসএ মূল জরিপ সত্যতা',
        category: 'LINEAGE',
        actualValEn: 'CS 1940 & SA 1963 verified in ledger',
        actualValBn: 'সিএস ১৯৪০ ও এসএ ১৯৬৩ রেকর্ডে নিশ্চিত',
        phi: -14.0,
        status: 'PASS',
        statuteEn: 'Evidence Act §90 · 30-Year-Old Document Presumption',
        statuteBn: 'সাক্ষ্য আইন ৯০ ধারা · ৩০ বছরের পুরোনো দলিলের বৈধতা',
        explanationEn: 'Original 1940 land grant authentic; fraud is isolated to recent mutation rather than root title severance.',
        explanationBn: 'মূল ১৯৪০ সালের সিএস স্বত্ব খাঁটি ও প্রমাণিত। জালিয়াতি কেবল সাম্প্রতিক নামজারি ও সীমানায় সীমাবদ্ধ।',
      },
    ],
  },
};

export const ShapXaiExplainer: React.FC<{
  currentPlotId?: string;
  onOpenTrustReport?: () => void;
}> = ({ currentPlotId = 'plot-1042', onOpenTrustReport }) => {
  const { isBangla } = useLanguage();
  const [selectedPlotId, setSelectedPlotId] = useState<string>(currentPlotId);

  useEffect(() => {
    if (currentPlotId && (currentPlotId === 'plot-1042' || currentPlotId === 'plot-3078')) {
      setSelectedPlotId(currentPlotId);
    }
  }, [currentPlotId]);
  const [viewMode, setViewMode] = useState<'waterfall' | 'importance' | 'whatif'>('waterfall');
  const [activeRemedies, setActiveRemedies] = useState<Record<string, boolean>>({
    softLock: false,
    rectifyArea: false,
    releaseLien: false,
    nidAffidavit: false,
  });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const profile = SHAP_PROFILES[selectedPlotId] || SHAP_PROFILES['plot-1042'];

  // Calculate dynamic SHAP values based on active remedies
  const computedFactors = useMemo(() => {
    return profile.factors.map((f) => {
      if (f.remedyKey && activeRemedies[f.remedyKey]) {
        return {
          ...f,
          phi: Math.max(-4.0, f.phi + (f.remedyDelta || 0)),
          status: 'CURED' as const,
        };
      }
      return f;
    });
  }, [profile, activeRemedies]);

  // Total SHAP attribution
  const totalPhi = useMemo(() => {
    return computedFactors.reduce((acc, f) => acc + f.phi, 0);
  }, [computedFactors]);

  // Final predicted risk score = clamp(0, round(E[f(x)] + Σ ϕᵢ), 100)
  const finalScore = useMemo(() => {
    const raw = profile.baseExpectedScore + totalPhi;
    return Math.max(0, Math.min(100, Math.round(raw)));
  }, [profile.baseExpectedScore, totalPhi]);

  // Severity classification
  const severity = useMemo(() => {
    if (finalScore <= 20) return { labelEn: 'PRISTINE / SAFE', labelBn: 'নিরাপদ / নির্ভেজাল', color: 'emerald', hex: '#10b981' };
    if (finalScore <= 55) return { labelEn: 'MODERATE RISK', labelBn: 'মাঝারি ঝুঁকি', color: 'amber', hex: '#f59e0b' };
    return { labelEn: 'CRITICAL FRAUD ALERT', labelBn: 'মারাত্মক জালিয়াতি সতর্কতা', color: 'rose', hex: '#f43f5e' };
  }, [finalScore]);

  // Toggle remedy in counterfactual what-if simulator
  const toggleRemedy = (key: string) => {
    setActiveRemedies((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      const remedyFactor = profile.factors.find((f) => f.remedyKey === key);
      const isNowActive = next[key];
      setToastMsg(
        isNowActive
          ? isBangla
            ? `✓ প্রতিকার কার্যকর: ${remedyFactor?.remedyTitleBn} (Δ ${remedyFactor?.remedyDelta} পয়েন্ট)`
            : `✓ Remedy Applied: ${remedyFactor?.remedyTitleEn} (Δ ${remedyFactor?.remedyDelta} pts)`
          : isBangla
            ? 'প্রতিকার প্রত্যাহার করা হয়েছে'
            : 'Remedy reverted'
      );
      setTimeout(() => setToastMsg(null), 3200);
      return next;
    });
  };

  // Copy JSON SHAP Payload
  const copyShapPayload = () => {
    const payload = JSON.stringify(
      {
        model: 'JomiChain-TreeSHAP-v4',
        plot: profile.plotNumber,
        mouza: profile.mouzaEn,
        baseExpectedScore: profile.baseExpectedScore,
        shapleyValues: computedFactors.map((f) => ({
          feature: f.nameEn,
          phi: Number(f.phi.toFixed(2)),
          category: f.category,
          status: f.status,
          statute: f.statuteEn,
        })),
        sumOfShapleyAttributions: Number(totalPhi.toFixed(2)),
        finalRiskScore: finalScore,
        evaluatedAt: new Date().toISOString(),
        cryptographicProofHash: '0x9f8a3c42e81b67f104d52e3a7b940182',
      },
      null,
      2
    );
    navigator.clipboard?.writeText(payload);
    setToastMsg(
      isBangla
        ? '✓ SHAP XAI গাণিতিক অডিট পেলোড ক্লিপবোর্ডে কপি সম্পন্ন'
        : '✓ SHAP XAI Mathematical Audit Payload Copied to Clipboard'
    );
    setTimeout(() => setToastMsg(null), 3200);
  };

  return (
    <div className="glass-card p-5 sm:p-7 rounded-[8px] border border-[var(--color-border-subtle)] space-y-6 select-none relative overflow-hidden shadow-2xl">
      {/* Background Cartographic XAI Ambient Glow */}
      <div 
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-15"
        style={{
          background: severity.hex,
        }}
      />

      {/* Top Header: SHAP Title, Mathematical HUD, and Plot Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--color-border-subtle)] pb-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-emerald-400" />
              <span>SHAP (SHapley Additive exPlanations) · Game-Theoretic XAI</span>
            </span>
            <span className="text-[10px] font-mono text-[var(--color-text-secondary)] hidden sm:inline">
              Novelty #5
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
            {isBangla
              ? 'ব্যাখ্যাযোগ্য ঝুঁকি নির্ণয় ও SHAP XAI ফিচার অ্যাট্রিবিউশন'
              : 'Deterministic Risk Scoring & SHAP XAI Feature Attribution'}
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            {isBangla
              ? 'কৃত্রিম বুদ্ধিমত্তার প্রতিটি ০-১০০ ঝুঁকি স্কোরকে গাণিতিক শ্যাপলে যোগফল দ্বারা ব্যাখ্যা করা হয়: f(x) = E[f(x)] + Σ ϕᵢ। প্রতিটি ধনাত্মক মান ঝুঁকি বাড়ায়, আর ঋণাত্মক মান নির্ভেজাল মালিকানা প্রমাণ করে।'
              : 'Decomposing 0–100 land risk into mathematically auditable Shapley contributions: f(x) = E[f(x)] + Σ ϕᵢ. Every positive value pushes fraud risk up; every negative value proves title integrity.'}
          </p>
        </div>

        {/* Plot Selector & Trust Report CTA */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 glass-pill p-1 rounded-[6px]">
            <button
              onClick={() => {
                setSelectedPlotId('plot-1042');
                setActiveRemedies({ softLock: false, rectifyArea: false, releaseLien: false, nidAffidavit: false });
              }}
              className={`px-3 py-1.5 text-xs font-mono rounded-[4px] transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedPlotId === 'plot-1042'
                  ? 'bg-emerald-500 text-black font-bold shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:text-emerald-400 hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isBangla ? 'দাগ ১০৪২ (নিরাপদ)' : 'Plot 1042 (Clean)'}</span>
            </button>
            <button
              onClick={() => {
                setSelectedPlotId('plot-3078');
                setActiveRemedies({ softLock: false, rectifyArea: false, releaseLien: false, nidAffidavit: false });
              }}
              className={`px-3 py-1.5 text-xs font-mono rounded-[4px] transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedPlotId === 'plot-3078'
                  ? 'bg-rose-500 text-white font-bold shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:text-rose-400 hover:bg-white/5'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isBangla ? 'দাগ ৩০৭৮ (ঝুঁকিপূর্ণ)' : 'Plot 3078 (Disputed)'}</span>
            </button>
          </div>

          {onOpenTrustReport && (
            <button
              onClick={onOpenTrustReport}
              className="px-3.5 py-1.5 rounded-[4px] text-xs font-mono font-bold bg-[var(--color-surface-raised)] hover:brightness-110 text-white flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isBangla ? 'নাগরিক ট্রাস্ট রিপোর্ট' : 'Citizen Trust Report'}</span>
            </button>
          )}
        </div>
      </div>

      {/* SHAP Mathematical Formula HUD & Real-Time Score Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
        {/* Box 1: Base Value E[f(x)] */}
        <div className="p-3.5 glass-tile rounded-[6px] border border-[var(--color-border-subtle)] space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-between">
            <span>{isBangla ? 'বেস প্রত্যাশিত মান' : 'Base Expected Value'}</span>
            <span className="text-slate-400">E[f(X)]</span>
          </div>
          <div className="text-xl font-extrabold text-white">
            {profile.baseExpectedScore.toFixed(1)} <span className="text-xs text-slate-400 font-normal">pts</span>
          </div>
          <p className="text-[10px] text-[var(--color-text-secondary)]">
            {isBangla ? 'ঢাকা মহানগরীয় ভূমি রেজিস্ট্রি গড়' : 'Dhaka Metro Registry Population Mean'}
          </p>
        </div>

        {/* Box 2: Total Shapley Attribution Σ ϕᵢ */}
        <div className="p-3.5 glass-tile rounded-[6px] border border-[var(--color-border-subtle)] space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-between">
            <span>{isBangla ? 'মোট শ্যাপলে প্রভাব' : 'Total Attribution'}</span>
            <span className="text-slate-400">Σ ϕᵢ</span>
          </div>
          <div className={`text-xl font-extrabold flex items-center gap-1.5 ${totalPhi > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {totalPhi > 0 ? `+${totalPhi.toFixed(1)}` : totalPhi.toFixed(1)}
            <span className="text-xs font-normal">pts</span>
            {totalPhi > 0 ? <TrendingUp className="w-4 h-4 text-rose-400" /> : <TrendingDown className="w-4 h-4 text-emerald-400" />}
          </div>
          <p className="text-[10px] text-[var(--color-text-secondary)]">
            {totalPhi > 0
              ? isBangla ? 'প্রতারণা ঝুঁকি বৃদ্ধি করেছে' : 'Pushes risk score higher'
              : isBangla ? 'মালিকানা সুরক্ষা হ্রাস করেছে' : 'Mitigates risk toward safety'}
          </p>
        </div>

        {/* Box 3: Final Model Output Score f(x) */}
        <div className={`p-3.5 rounded-[6px] border space-y-1 ${
          severity.color === 'emerald'
            ? 'glass-tile border-emerald-500/40 bg-emerald-500/10'
            : severity.color === 'amber'
              ? 'glass-tile border-amber-500/40 bg-amber-500/10'
              : 'glass-tile border-rose-500/50 bg-rose-500/15'
        }`}>
          <div className="text-[10px] uppercase font-semibold flex items-center justify-between">
            <span className={severity.color === 'emerald' ? 'text-emerald-300' : 'text-rose-300'}>
              {isBangla ? 'চূড়ান্ত মডেল স্কোর' : 'Final Output Score'}
            </span>
            <span className="font-bold">f(x)</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black ${
              severity.color === 'emerald' ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {finalScore}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
            <span className={`ml-auto text-[9.5px] px-2 py-0.5 rounded font-bold uppercase ${
              severity.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
            }`}>
              {isBangla ? severity.labelBn : severity.labelEn}
            </span>
          </div>
          <p className="text-[10px] text-[var(--color-text-secondary)] truncate">
            {profile.plotNumber} · {isBangla ? profile.mouzaBn : profile.mouzaEn}
          </p>
        </div>

        {/* Box 4: View Mode Toggles */}
        <div className="p-2.5 glass-tile rounded-[6px] border border-[var(--color-border-subtle)] flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">
            {isBangla ? 'এক্সএআই প্রদর্শন মোড' : 'XAI Visualizer Mode'}
          </div>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => setViewMode('waterfall')}
              className={`py-1.5 px-2 rounded text-[10px] font-mono transition-all cursor-pointer text-center ${
                viewMode === 'waterfall'
                  ? 'bg-cyan-500 text-black font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isBangla ? 'ওয়াটারফল' : 'Waterfall'}
            </button>
            <button
              onClick={() => setViewMode('importance')}
              className={`py-1.5 px-2 rounded text-[10px] font-mono transition-all cursor-pointer text-center ${
                viewMode === 'importance'
                  ? 'bg-cyan-500 text-black font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isBangla ? 'র‌্যাংকিং' : 'Ranking'}
            </button>
            <button
              onClick={() => setViewMode('whatif')}
              className={`py-1.5 px-2 rounded text-[10px] font-mono transition-all cursor-pointer text-center ${
                viewMode === 'whatif'
                  ? 'bg-cyan-500 text-black font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isBangla ? 'হোয়াট-ইফ' : 'What-If'}
            </button>
          </div>
        </div>
      </div>

      {/* 
        ====================================================================
        MODE 1: SHAP WATERFALL / FORCE DECOMPOSITION
        ====================================================================
      */}
      {viewMode === 'waterfall' && (
        <div className="space-y-3 p-4 rounded-[6px] bg-[#060a12] border border-cyan-500/25 font-mono">
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-300 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="font-bold text-cyan-400">{isBangla ? 'শ্যাপলে ওয়াটারফল ফোর্স ডিকম্পোজিশন' : 'SHAP Waterfall Force Decomposition'}</span>
              <span className="text-[10px] text-slate-500">· Step-by-step additive attribution</span>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                <span>+ϕ {isBangla ? 'ঝুঁকি বৃদ্ধি' : 'Risk Driver'}</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                <span>-ϕ {isBangla ? 'সুরক্ষা হ্রাস' : 'Protective Mitigator'}</span>
              </span>
            </div>
          </div>

          {/* Sequential Waterfall Stack */}
          <div className="space-y-2 pt-2">
            {/* Step 0: Baseline Prior */}
            <div className="flex items-center gap-3 text-xs">
              <span className="w-48 text-[11px] text-slate-400 truncate">
                {isBangla ? 'বেস মডেল এক্সপেক্টেশন E[f(x)]' : 'Base Expectation E[f(x)]'}
              </span>
              <div className="flex-1 bg-white/5 h-6 rounded flex items-center px-3 text-[11px] text-slate-300 font-bold">
                18.2 pts
              </div>
            </div>

            {/* Step 1..N: Factors */}
            {computedFactors.map((f, i) => {
              const isPositive = f.phi > 0;
              const barWidth = Math.min(100, Math.max(8, Math.abs(f.phi) * 2.4));

              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 text-xs group"
                >
                  <span className="w-48 text-[11px] font-semibold text-[var(--color-text-primary)] truncate" title={f.nameEn}>
                    {isBangla ? f.nameBn : f.nameEn}
                  </span>

                  <div className="flex-1 bg-black/40 h-7 rounded border border-white/5 relative flex items-center px-2 overflow-hidden">
                    {/* Directional Waterfall Bar */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className={`h-full rounded-[3px] opacity-90 flex items-center px-2 ${
                        isPositive
                          ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                          : 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                      }`}
                    >
                      <span className="font-bold text-[10px] whitespace-nowrap">
                        {isPositive ? `+${f.phi.toFixed(1)}` : f.phi.toFixed(1)}
                      </span>
                    </motion.div>

                    <span className="text-[10px] text-slate-400 ml-3 truncate hidden sm:inline">
                      {isBangla ? f.actualValBn : f.actualValEn}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* Final Step: Output Result */}
            <div className="flex items-center gap-3 text-xs pt-2 border-t border-white/10">
              <span className="w-48 text-[11px] font-bold text-white uppercase">
                {isBangla ? 'চূড়ান্ত মডেল আউটপুট f(x)' : 'Final Prediction f(x)'}
              </span>
              <div className={`flex-1 h-8 rounded flex items-center justify-between px-3 font-bold text-sm ${
                severity.color === 'emerald'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                <span>{finalScore} / 100</span>
                <span className="text-[10px] tracking-wider uppercase font-extrabold">
                  {isBangla ? severity.labelBn : severity.labelEn}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 
        ====================================================================
        MODE 2: FEATURE IMPORTANCE RANKING (TORNADO BAR CHART)
        ====================================================================
      */}
      {viewMode === 'importance' && (
        <div className="space-y-3 p-4 rounded-[6px] bg-[#060a12] border border-cyan-500/25 font-mono">
          <div className="flex items-center justify-between text-[11px] text-slate-300 pb-2 border-b border-white/10">
            <span className="font-bold text-cyan-400">
              {isBangla ? 'পরম শ্যাপলে গুরুত্ব র‌্যাংকিং (|ϕᵢ| Magnitude)' : 'Absolute Shapley Magnitude (|ϕᵢ| Feature Importance)'}
            </span>
            <span className="text-[10px] text-slate-400">
              {isBangla ? 'ভূমি রেজিস্ট্রি ঝুঁকির প্রধান নিয়ামকসমূহ' : 'Ranked by overall impact on land title decision'}
            </span>
          </div>

          <div className="space-y-2.5 pt-2">
            {[...computedFactors]
              .sort((a, b) => Math.abs(b.phi) - Math.abs(a.phi))
              .map((f, rank) => {
                const absVal = Math.abs(f.phi);
                const percent = Math.min(100, (absVal / 35) * 100);

                return (
                  <div key={f.id} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-white font-semibold flex items-center gap-2">
                        <span className="text-slate-500 font-bold text-[10px]">#{rank + 1}</span>
                        <span>{isBangla ? f.nameBn : f.nameEn}</span>
                      </span>
                      <span className="text-slate-300 font-bold">
                        |ϕ| = {absVal.toFixed(1)} pts
                      </span>
                    </div>

                    <div className="w-full bg-black/60 h-3 rounded overflow-hidden p-0.5 border border-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className={`h-full rounded-sm ${
                          f.phi > 0 ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 
        ====================================================================
        MODE 3: WHAT-IF CAUSAL COUNTERFACTUAL REMEDY SIMULATOR
        ====================================================================
      */}
      {viewMode === 'whatif' && (
        <div className="space-y-4 p-4 rounded-[6px] bg-[#060a12] border border-cyan-500/25 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10 text-xs">
            <div>
              <span className="font-bold text-cyan-400">
                {isBangla ? 'কাউন্টারফ্যাকচুয়াল প্রতিকার সিমুলেটর' : 'Counterfactual Causal Remedy Simulator'}
              </span>
              <p className="text-[10px] text-slate-400">
                {isBangla
                  ? 'আইনি প্রতিকার বাস্তবায়ন করুন এবং দেখুন কিভাবে তাৎক্ষণিকভাবে শ্যাপলে স্কোর কমে'
                  : 'Toggle remedial deeds & legal proofs to observe real-time risk score reduction.'}
              </p>
            </div>

            <button
              onClick={() => {
                setActiveRemedies({ softLock: false, rectifyArea: false, releaseLien: false, nidAffidavit: false });
                setToastMsg(isBangla ? 'সকল প্রতিকার রিসেট করা হয়েছে' : 'All remedies reset');
                setTimeout(() => setToastMsg(null), 2500);
              }}
              className="px-2.5 py-1 text-[10px] rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isBangla ? 'রিসেট' : 'Reset All'}</span>
            </button>
          </div>

          {/* Interactive Checklist of Available Legal Remedies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {profile.factors
              .filter((f) => f.remedyKey)
              .map((f) => {
                const isRemedied = !!activeRemedies[f.remedyKey!];

                return (
                  <div
                    key={f.id}
                    onClick={() => toggleRemedy(f.remedyKey!)}
                    className={`p-3 rounded-[6px] border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      isRemedied
                        ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_16px_rgba(16,185,129,0.25)]'
                        : 'bg-white/5 border-white/10 hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white text-[11px]">
                          {isBangla ? f.remedyTitleBn : f.remedyTitleEn}
                        </span>
                        <div className="text-[9.5px] text-slate-400">{f.statuteEn}</div>
                      </div>

                      <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                        isRemedied ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-white/20'
                      }`}>
                        {isRemedied && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5">
                      <span className="text-slate-400">
                        {isBangla ? 'প্রতিকারের প্রভাব:' : 'Causal Impact:'}
                      </span>
                      <span className="text-emerald-400 font-bold font-mono">
                        ΔRisk = {f.remedyDelta} pts
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Live Causal Remedy Synthesis Card */}
          <div className="p-3.5 rounded-[6px] bg-black/60 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                {isBangla ? 'প্রতিকার প্রয়োগের ফলাফল' : 'Post-Remedy Title Diagnosis'}
              </span>
              <div className="font-bold text-white">
                {isBangla
                  ? `ঝুঁকি স্কোর ${finalScore}/১০০ (${severity.labelBn})`
                  : `Risk Score Adjusted to ${finalScore}/100 (${severity.labelEn})`}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Total Δ = {totalPhi < 0 ? totalPhi.toFixed(1) : `+${totalPhi.toFixed(1)}`} pts
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 
        ====================================================================
        DETAILED SHAP FACTOR ATTRIBUTION CARDS (Enriched 4+ Core Checks)
        ====================================================================
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {computedFactors.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-[6px] border transition-all flex flex-col justify-between space-y-2.5 ${
              item.status === 'PASS'
                ? 'glass-tile border-emerald-500/25 hover:border-emerald-500/40'
                : item.status === 'CURED'
                  ? 'glass-tile border-cyan-500/40 bg-cyan-500/10'
                  : item.status === 'WARNING'
                    ? 'glass-tile border-amber-500/30 bg-amber-500/5'
                    : 'glass-tile border-rose-500/40 bg-rose-500/10'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-[var(--color-text-primary)] text-[12px]">
                  {isBangla ? item.nameBn : item.nameEn}
                </span>

                <div className="flex items-center gap-1.5">
                  {/* SHAP Contribution Tag */}
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    item.phi > 0
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/35'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/35'
                  }`}>
                    ϕ = {item.phi > 0 ? `+${item.phi.toFixed(1)}` : item.phi.toFixed(1)}
                  </span>

                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    item.status === 'PASS'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : item.status === 'CURED'
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                        : item.status === 'WARNING'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-semibold mb-1">
                {isBangla ? item.statuteBn : item.statuteEn}
              </div>

              <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                {isBangla ? item.explanationBn : item.explanationEn}
              </p>
            </div>

            {/* Bottom Telemetry Bar */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
              <span className="truncate">
                {isBangla ? item.actualValBn : item.actualValEn}
              </span>
              <span className={item.phi > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                {item.phi > 0 ? '↑ Risk Amplifier' : '↓ Risk Mitigator'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Bar: Actionable XAI Exports */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs font-mono">
        <div className="text-slate-400 text-[10.5px]">
          {isBangla
            ? 'গাণিতিক সূত্র: f(x) = E[f(x)] + Σ ϕᵢ · মডেল: JomiChain-TreeSHAP-v4'
            : 'Formulation: f(x) = E[f(x)] + Σ ϕᵢ · Model: JomiChain-TreeSHAP-v4'}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyShapPayload}
            className="px-3 py-1.5 rounded-[4px] bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isBangla ? 'SHAP JSON কপি' : 'Copy SHAP JSON'}</span>
          </button>

          <button
            onClick={() => {
              setToastMsg(
                isBangla
                  ? '✓ সার্টিফাইড এক্সএআই অডিট ডসিয়ার (PDF) প্রস্তুত হচ্ছে...'
                  : '✓ Certified XAI Audit Dossier (PDF) Generated'
              );
              setTimeout(() => setToastMsg(null), 3500);
            }}
            className="px-3 py-1.5 rounded-[4px] bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-300 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isBangla ? 'এক্সএআই ডসিয়ার (PDF)' : 'Download XAI Dossier'}</span>
          </button>
        </div>
      </div>

      {/* Live Toast */}
      {toastMsg && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-cyan-950/95 text-cyan-200 border border-cyan-400 text-xs font-mono shadow-2xl backdrop-blur-md flex items-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>{toastMsg}</span>
        </motion.div>
      )}
    </div>
  );
};
