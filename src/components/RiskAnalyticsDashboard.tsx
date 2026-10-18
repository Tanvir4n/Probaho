/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Probaho — Risk Analytics Dashboard Component
 * Visualizes Land Ownership Fraud Risk Scores using Recharts:
 * - Multi-quarter fraud risk and dispute velocity trends
 * - High-risk zones ranking in Dhaka metropolitan area
 * - Radar vector attack breakdown for selected zones
 * - Fraud typology distribution & capital exposure
 * - High-density cadastral plot dispute inspection table
 */

import React, { useState, useMemo, Suspense, lazy } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  Sector,
} from 'recharts';
import {
  DHAKA_RISK_ZONES,
  DHAKA_FRAUD_TRENDS,
  DHAKA_FRAUD_TYPOLOGIES,
  DHAKA_AVERAGE_VECTORS,
  DhakaZoneRiskProfile,
  DateRangePreset,
  generateDynamicTrendData,
  TrendDataPoint,
  toBnDigit,
} from '../data/riskAnalyticsData';

// Performance optimization: Heavy GIS GeoJSON radar map lazy-loaded on demand
const BangladeshNationalRiskRadarMap = lazy(() =>
  import('./BangladeshNationalRiskRadarMap').then((m) => ({ default: m.BangladeshNationalRiskRadarMap }))
);

import { NATIONAL_HUBS, NationalHub } from '../data/bangladeshNationalGeoData';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Lock,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  X,
  FileCheck2,
  Info,
  Maximize2,
  RefreshCw,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  SlidersHorizontal,
  Radio,
  BarChart3,
  Layers,
  Globe,
} from 'lucide-react';

interface RiskAnalyticsDashboardProps {
  id?: string;
  className?: string;
  defaultZoneId?: string;
  onClose?: () => void;
}

export const RiskAnalyticsDashboard: React.FC<RiskAnalyticsDashboardProps> = ({
  id = 'risk-analytics',
  className = '',
  defaultZoneId = 'dhanmondi',
  onClose,
}) => {
  const { isBangla } = useLanguage();
  const { isDay } = useTheme();

  // State management
  const [analyticsViewMode, setAnalyticsViewMode] = useState<'radar' | 'charts' | 'split'>('radar');
  const [selectedNationalHub, setSelectedNationalHub] = useState<NationalHub | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string>(defaultZoneId);
  const [timeframe, setTimeframe] = useState<DateRangePreset>('30d');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-09-17');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-10-16');
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState<boolean>(false);
  const [compareWithMetro, setCompareWithMetro] = useState<boolean>(true);
  const [trendMetric, setTrendMetric] = useState<'index' | 'incidents' | 'financial'>('index');
  const [zoneRiskFilter, setZoneRiskFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditSuccessMsg, setAuditSuccessMsg] = useState<string | null>(null);

  // Interactive Hover & Focus state for Dhaka Fraud Modality Donut Chart
  const [activeModalityIndex, setActiveModalityIndex] = useState<number | null>(null);

  // Radar Chart Interactive Baseline & Hover states
  const [showMetroBaseline, setShowMetroBaseline] = useState<boolean>(true);
  const [hoveredVectorSubject, setHoveredVectorSubject] = useState<string | null>(null);

  const activeModality = useMemo(() => {
    if (activeModalityIndex !== null && DHAKA_FRAUD_TYPOLOGIES[activeModalityIndex]) {
      return DHAKA_FRAUD_TYPOLOGIES[activeModalityIndex];
    }
    return null;
  }, [activeModalityIndex]);

  // High-performance custom active shape for Donut Chart slice hover
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g className="transition-all duration-200">
        {/* Main active slice expanded outwards with rich shadow */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 4}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          cornerRadius={4}
          style={{
            filter: `drop-shadow(0 6px 14px ${fill}99)`,
            cursor: 'pointer',
          }}
        />
        {/* Outer orbital accent arc */}
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 12}
          outerRadius={outerRadius + 15}
          fill={fill}
          cornerRadius={2}
          style={{
            opacity: 0.9,
            filter: `drop-shadow(0 0 6px ${fill})`,
          }}
        />
      </g>
    );
  };

  // Selected Zone Object
  const selectedZone = useMemo(() => {
    return (
      DHAKA_RISK_ZONES.find((z) => z.id === selectedZoneId) ||
      DHAKA_RISK_ZONES[0]
    );
  }, [selectedZoneId]);

  // Active National Hub for 360° Regional Radar Map
  const activeNationalHub = useMemo(() => {
    return (
      selectedNationalHub ||
      NATIONAL_HUBS.find((h) => h.id === 'patuakhali') ||
      NATIONAL_HUBS[0]
    );
  }, [selectedNationalHub]);

  // Dynamic Trend Data Generation (Reacts to Date Range & Selected Zone)
  const dynamicTrendResult = useMemo(() => {
    return generateDynamicTrendData({
      preset: timeframe,
      startDate: customStartDate,
      endDate: customEndDate,
      zoneId: selectedZoneId,
    });
  }, [timeframe, customStartDate, customEndDate, selectedZoneId]);

  const trendData = dynamicTrendResult.data;
  const trendSummary = dynamicTrendResult.summary;

  // Filtered Zones List for Table and Bar Chart
  const filteredZones = useMemo(() => {
    return DHAKA_RISK_ZONES.filter((zone) => {
      const matchesFilter =
        zoneRiskFilter === 'ALL' ? true : zone.riskLevel === zoneRiskFilter;
      const matchesQuery =
        !searchQuery.trim() ||
        zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        zone.nameBn.includes(searchQuery) ||
        zone.subRegistry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        zone.hotspotMouzas.some((m) =>
          m.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesFilter && matchesQuery;
    });
  }, [zoneRiskFilter, searchQuery]);

  // Bar Chart Data (Sorted by Risk Score descending)
  const barChartData = useMemo(() => {
    return [...DHAKA_RISK_ZONES]
      .sort((a, b) => b.riskScore - a.riskScore)
      .map((z, idx) => ({
        id: z.id,
        rank: idx + 1,
        name: isBangla ? z.nameBn : z.name,
        nameEn: z.name,
        nameBn: z.nameBn,
        subRegistry: z.subRegistry,
        subRegistryBn: z.subRegistryBn,
        primaryVector: z.primaryVector,
        primaryVectorBn: z.primaryVectorBn,
        hotspotMouzas: z.hotspotMouzas,
        hotspotMouzasBn: z.hotspotMouzasBn,
        shortName: isBangla
          ? z.nameBn.split(' ')[0]
          : z.name.split(' ')[0].replace(/[\(\),]/g, ''),
        riskScore: z.riskScore,
        level: z.riskLevel,
        dags: z.activeDisputedDags,
        locks: z.activeLocksCount,
        preventedCr: z.preventedFraudCr,
      }));
  }, [isBangla]);

  // Radar Chart Data for Selected Zone vs Dhaka Average
  const radarData = useMemo(() => {
    const v = selectedZone.vectors;
    const avg = DHAKA_AVERAGE_VECTORS;

    return [
      {
        subject: isBangla ? 'সিএস-বিএস নকশা অমিল' : 'Survey Variance',
        zone: v.surveyVariance,
        metroAvg: avg.surveyVariance,
        fullMark: 100,
      },
      {
        subject: isBangla ? 'দ্বৈত দলিল রেজিস্ট্রি' : 'Double Sale Velocity',
        zone: v.duplicateRegistration,
        metroAvg: avg.duplicateRegistration,
        fullMark: 100,
      },
      {
        subject: isBangla ? 'আমমোক্তারনামা জাল' : 'Power of Attorney',
        zone: v.powerOfAttorney,
        metroAvg: avg.powerOfAttorney,
        fullMark: 100,
      },
      {
        subject: isBangla ? 'নামজারি টেম্পারিং' : 'Mutation Alteration',
        zone: v.mutationTampering,
        metroAvg: avg.mutationTampering,
        fullMark: 100,
      },
      {
        subject: isBangla ? 'ওয়ারিশ সনদ গোপন' : 'Heirship Discrepancy',
        zone: v.heirDispute,
        metroAvg: avg.heirDispute,
        fullMark: 100,
      },
      {
        subject: isBangla ? 'জলাশয়/খাস দখল' : 'Wetland Encroachment',
        zone: v.wetlandEncroachment,
        metroAvg: avg.wetlandEncroachment,
        fullMark: 100,
      },
    ];
  }, [selectedZone, isBangla]);

  // Active hovered vector telemetry for Radar Chart (zero-overlap HUD)
  const activeRadarVector = useMemo(() => {
    if (hoveredVectorSubject) {
      return radarData.find((r) => r.subject === hoveredVectorSubject) || null;
    }
    return null;
  }, [hoveredVectorSubject, radarData]);

  // Color helper for Risk Levels
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return '#ef4444'; // Red-500
      case 'HIGH':
        return '#f97316'; // Orange-500
      case 'MEDIUM':
        return '#eab308'; // Amber-500
      case 'LOW':
        return '#22c55e'; // Emerald-500
      default:
        return '#3b82f6';
    }
  };

  // Color helper for Bar Chart bars
  const getBarColor = (score: number) => {
    if (score >= 80) return '#ef4444';
    if (score >= 65) return '#f97316';
    if (score >= 35) return '#eab308';
    return '#22c55e';
  };

  // Handle simulated verification
  const handleTriggerAudit = () => {
    setIsAuditing(true);
    setAuditSuccessMsg(null);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditSuccessMsg(
        isBangla
          ? `সফল: ${selectedZone.nameBn} এর ১৬টি সক্রিয় খতিয়ানে ক্রিপ্টোগ্রাফিক সফট-লক হালনাগাদ করা হয়েছে।`
          : `Verified: Cryptographic concurrency locks refreshed for 16 active Khatians in ${selectedZone.name}.`
      );
      setTimeout(() => setAuditSuccessMsg(null), 5000);
    }, 1200);
  };

  // Export CSV simulation
  const handleExportCSV = () => {
    const headers = 'Zone ID,Zone Name,Risk Score,Risk Level,Active Disputed Dags,Prevented Value (Cr BDT),Sub-Registry\n';
    const rows = DHAKA_RISK_ZONES.map(
      (z) =>
        `"${z.id}","${z.name}",${z.riskScore},"${z.riskLevel}",${z.activeDisputedDags},${z.preventedFraudCr},"${z.subRegistry}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `dhaka_land_fraud_risk_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Chart Theme Variables
  const gridColor = isDay ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
  const tickColor = isDay ? '#4b5563' : '#8a8a86';
  const tooltipBg = isDay ? '#ffffff' : '#0e0e0f';
  const tooltipBorder = isDay ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.18)';

  return (
    <section
      id={id}
      className={`py-16 sm:py-20 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] text-[var(--color-text-primary)] transition-colors duration-200 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* ====================================================================
            1. SECTION HEADER & METADATA BAR
           ==================================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[var(--color-border-subtle)] pb-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-[var(--color-surface-raised)] uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>{isBangla ? 'ঝুঁকি অ্যানালিটিক্স ড্যাশবোর্ড' : 'Risk Analytics Telemetry'}</span>
              <span className="text-[var(--color-text-tertiary)]">·</span>
              <span className="text-[var(--color-text-secondary)]">
                {isBangla ? 'ঢাকা মেট্রোপলিটন জোনসমূহ' : 'Dhaka Metropolitan Area'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
              {isBangla
                ? 'ভূমির মালিকানা জালিয়াতি ঝুঁকি সূচক ও প্রবণতা'
                : 'Land Ownership Fraud Risk Scores & Spatial Trends'}
            </h2>

            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {isBangla
                ? '১০টি ঢাকা মেট্রোপলিটন সাব-রেজিস্ট্রির সমন্বিত জরিপ অসঙ্গতি, দ্বৈত বিক্রয় ঝুঁকি এবং নামজারি টেম্পারিংয়ের বাস্তবভিত্তিক রিয়েল-টাইম পূর্বাভাস।'
                : 'Cross-registry biometric verification, CS-to-BS cadastral survey variance, and multi-signal double-sale velocity tracking across 10 Dhaka metropolitan sectors.'}
            </p>
          </div>

          {/* Action Toolbar with View Mode & Date-Range Selector */}
          <div className="flex flex-col xl:flex-row xl:items-center gap-3 shrink-0">
            {/* View Mode Switcher: Radar vs Charts vs Split */}
            <div className="flex items-center p-1.5 bg-[var(--color-surface-muted)] rounded-xl border border-[var(--color-border-subtle)] text-xs font-mono shadow-sm">
              <button
                onClick={() => setAnalyticsViewMode('radar')}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  analyticsViewMode === 'radar'
                    ? 'bg-[var(--color-surface-raised)] text-white font-bold shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5'
                }`}
                title="360° Bangladesh Regional Radar Map (D3.js)"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>{isBangla ? '৩৬০° রাডার ম্যাপ' : '360° Radar Map'}</span>
              </button>
              <button
                onClick={() => setAnalyticsViewMode('charts')}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  analyticsViewMode === 'charts'
                    ? 'bg-[var(--color-surface-raised)] text-white font-bold shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5'
                }`}
                title="Dhaka Metro Zone Rankings & Vectors (Recharts)"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>{isBangla ? 'মেট্রো চার্ট' : 'Metro Charts'}</span>
              </button>
              <button
                onClick={() => setAnalyticsViewMode('split')}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  analyticsViewMode === 'split'
                    ? 'bg-[var(--color-surface-raised)] text-white font-bold shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5'
                }`}
                title="Split View: National Radar + Metro Analytics"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isBangla ? 'স্প্লিট ভিউ' : 'Split View'}</span>
              </button>
            </div>

            {/* Date-Range Selector Controls */}
            <div className="flex items-center p-1 bg-[var(--color-surface-muted)] rounded border border-[var(--color-border-subtle)] text-xs font-mono">
              <button
                onClick={() => {
                  setTimeframe('30d');
                  setIsCustomRangeOpen(false);
                }}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  timeframe === '30d'
                    ? 'bg-[var(--color-surface-raised)] text-white font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
                title={isBangla ? 'সর্বশেষ ৩০ দিনের দৈনিক তথ্য' : 'Last 30 Days (Daily Granularity)'}
              >
                {isBangla ? '৩০ দিন' : '30D'}
              </button>
              <button
                onClick={() => {
                  setTimeframe('90d');
                  setIsCustomRangeOpen(false);
                }}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  timeframe === '90d'
                    ? 'bg-[var(--color-surface-raised)] text-white font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
                title={isBangla ? 'সর্বশেষ ৯০ দিনের সাপ্তাহিক তথ্য' : 'Last 90 Days (Weekly Granularity)'}
              >
                {isBangla ? '৯০ দিন' : '90D'}
              </button>
              <button
                onClick={() => {
                  setTimeframe('6m');
                  setIsCustomRangeOpen(false);
                }}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  timeframe === '6m'
                    ? 'bg-[var(--color-surface-raised)] text-white font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
                title={isBangla ? 'সর্বশেষ ৬ মাসের পাক্ষিক তথ্য' : 'Last 6 Months (Bi-weekly Granularity)'}
              >
                {isBangla ? '৬ মাস' : '6M'}
              </button>
              <button
                onClick={() => {
                  setTimeframe('1y');
                  setIsCustomRangeOpen(false);
                }}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  timeframe === '1y'
                    ? 'bg-[var(--color-surface-raised)] text-white font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
                title={isBangla ? 'সর্বশেষ ১ বছরের মাসিক তথ্য' : 'Last 1 Year (Monthly Granularity)'}
              >
                {isBangla ? '১ বছর' : '1Y'}
              </button>
              <button
                onClick={() => {
                  setTimeframe('custom');
                  setIsCustomRangeOpen((prev) => !prev);
                }}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                  timeframe === 'custom'
                    ? 'bg-[var(--color-surface-raised)] text-white font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
                title="Custom Date Range Picker"
              >
                <Calendar className="w-3 h-3" />
                <span>{isBangla ? 'কাস্টম' : 'Custom'}</span>
              </button>
            </div>

            {/* Quick Export CSV */}
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 text-xs font-mono font-medium rounded border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] text-[var(--color-text-primary)] hover:bg-white/5 transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              title="Download CSV Dossier"
            >
              <Download className="w-3.5 h-3.5 text-[var(--color-surface-raised)]" />
              <span>{isBangla ? 'রিপোর্ট রপ্তানি' : 'Export Dossier'}</span>
            </button>

            {/* Optional Close Studio Button when hosted in modal */}
            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-mono font-semibold rounded border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-sm"
                title={isBangla ? 'স্টুডিও বন্ধ করুন' : 'Close Studio'}
              >
                <X className="w-3.5 h-3.5" />
                <span>{isBangla ? 'স্টুডিও বন্ধ' : 'Close'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Custom Date Range Picker Popover Panel */}
        {timeframe === 'custom' && (
          <div className="p-4 rounded border border-[var(--color-border-subtle)] bg-[var(--color-surface-strong)]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[var(--color-text-secondary)] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[var(--color-surface-raised)]" />
                <span>{isBangla ? 'কাস্টম সময়কাল নির্বাচন করুন:' : 'Select Custom Date Range:'}</span>
              </span>

              <div className="flex items-center gap-2">
                <label className="text-[var(--color-text-tertiary)]">{isBangla ? 'হতে:' : 'From:'}</label>
                <input
                  type="date"
                  value={customStartDate}
                  max={customEndDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-2.5 py-1 rounded bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] focus:border-[var(--color-surface-raised)] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-[var(--color-text-tertiary)]">{isBangla ? 'পর্যন্ত:' : 'To:'}</label>
                <input
                  type="date"
                  value={customEndDate}
                  min={customStartDate}
                  max="2026-10-16"
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-2.5 py-1 rounded bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] focus:border-[var(--color-surface-raised)] focus:outline-none"
                />
              </div>
            </div>

            <div className="text-[11px] text-[var(--color-text-secondary)] flex items-center gap-2">
              <span>{trendSummary.dataPointsCount} {isBangla ? 'টি ডেটা পয়েন্ট' : 'points computed'}</span>
              <span>·</span>
              <span className="uppercase text-[var(--color-surface-raised)]">{trendSummary.resolution}</span>
            </div>
          </div>
        )}

        {/* Dynamic Date-Range Status & Trajectory Strip */}
        <div className="p-3 sm:p-4 rounded border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)]/50 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
            <Calendar className="w-3.5 h-3.5 text-[var(--color-surface-raised)] shrink-0" />
            <span className="font-semibold">
              {isBangla ? 'সক্রিয় সময়সীমা:' : 'Active Range:'}{' '}
              <span className="font-mono text-[var(--color-surface-raised)]">
                {trendSummary.startDateStr}
              </span>{' '}
              {isBangla ? 'হতে' : 'to'}{' '}
              <span className="font-mono text-[var(--color-surface-raised)]">
                {trendSummary.endDateStr}
              </span>
            </span>
            <span className="text-[var(--color-text-tertiary)] hidden sm:inline">·</span>
            <span className="text-[11px] text-[var(--color-text-secondary)] capitalize hidden sm:inline">
              {trendSummary.resolution} ({trendSummary.dataPointsCount} {isBangla ? 'পয়েন্ট' : 'points'})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1">
              <span className="text-[var(--color-text-secondary)]">{isBangla ? 'পরিবর্তন:' : 'Net Change:'}</span>
              <span
                className={`font-bold flex items-center gap-0.5 ${
                  trendSummary.netChange <= 0 ? 'text-emerald-500' : 'text-red-500'
                }`}
              >
                {trendSummary.netChange <= 0 ? (
                  <ArrowDownRight className="w-3 h-3" />
                ) : (
                  <ArrowUpRight className="w-3 h-3" />
                )}
                <span>
                  {trendSummary.netChange > 0 ? `+${trendSummary.netChange}` : trendSummary.netChange} pts
                </span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1 text-[var(--color-text-secondary)]">
              <span>{isBangla ? 'সর্বোচ্চ ঝুঁকি:' : 'Peak Risk:'}</span>
              <span className="text-[var(--color-text-primary)] font-bold">
                {trendSummary.peakDate} ({trendSummary.peakScore})
              </span>
            </div>

            <div className="flex items-center gap-1 text-[var(--color-text-secondary)]">
              <span>{isBangla ? 'রক্ষিত মূলধন:' : 'Halted in Window:'}</span>
              <span className="text-[var(--color-surface-raised)] font-bold">
                ৳ {trendSummary.totalPreventedCr} Cr
              </span>
            </div>
          </div>
        </div>

        {/* ====================================================================
            2. EXECUTIVE STATISTICAL KPI STRIP (TABULAR NUMERALS, NO PILL SANDWICH)
           ==================================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="specular-card p-6 rounded-2xl border border-[var(--color-border-subtle)] hover:border-emerald-500/40 shadow-lg hover:shadow-xl transition-all duration-300 space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
            <div className="text-[11px] font-mono text-[var(--color-text-secondary)] uppercase tracking-wider font-medium">
              {isBangla ? 'মেট্রোপলিটন গড় ঝুঁকি সূচক' : 'Metro Average Risk Index'}
            </div>
            <div className="text-2xl sm:text-4xl font-bold font-mono tabular-nums text-[var(--color-text-primary)] flex items-baseline gap-2">
              <span>52.1</span>
              <span className="text-xs font-normal text-[var(--color-text-secondary)] font-mono">/ 100</span>
            </div>
            <div className="text-[11px] font-mono text-emerald-500 flex items-center gap-1 pt-1 font-semibold">
              <span>↓ -4.3%</span>
              <span className="text-[var(--color-text-tertiary)] font-normal">{isBangla ? 'পূর্ববর্তী ত্রৈমাসিক হতে' : 'from Q2 2026'}</span>
            </div>
          </div>

          <div className="specular-card p-6 rounded-2xl border border-[var(--color-border-subtle)] hover:border-red-500/40 shadow-lg hover:shadow-xl transition-all duration-300 space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-red-500/10 transition-colors" />
            <div className="text-[11px] font-mono text-[var(--color-text-secondary)] uppercase tracking-wider font-medium">
              {isBangla ? 'উচ্চ ঝুঁকিপূর্ণ এলাকা' : 'High & Critical Zones'}
            </div>
            <div className="text-2xl sm:text-4xl font-bold font-mono tabular-nums text-red-500 flex items-baseline gap-2">
              <span>4</span>
              <span className="text-xs font-normal text-[var(--color-text-secondary)] font-mono">
                / 10 {isBangla ? 'থানা' : 'Thanas'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-[var(--color-text-secondary)] truncate pt-1">
              {isBangla ? 'ধানমন্ডি, পুরান ঢাকা, মিরপুর, বসিলা' : 'Dhanmondi, Old Dhaka, Mirpur, Bosila'}
            </div>
          </div>

          <div className="specular-card p-6 rounded-2xl border border-[var(--color-border-subtle)] hover:border-emerald-500/40 shadow-lg hover:shadow-xl transition-all duration-300 space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
            <div className="text-[11px] font-mono text-[var(--color-text-secondary)] uppercase tracking-wider font-medium">
              {isBangla ? 'প্রতিরোধকৃত দ্বৈত লেনদেন' : 'Prevented Fraud Exposure'}
            </div>
            <div className="text-2xl sm:text-4xl font-bold font-mono tabular-nums text-emerald-400 flex items-baseline gap-1.5">
              <span>৳ 584.1</span>
              <span className="text-xs font-normal text-[var(--color-text-secondary)] font-mono">
                {isBangla ? 'কোটি' : 'Cr BDT'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-[var(--color-text-secondary)] pt-1">
              {isBangla ? '২,১৮৪টি সম্ভাব্য বিরোধ স্থগিত' : '2,184 contested deeds halted'}
            </div>
          </div>

          <div className="specular-card p-6 rounded-2xl border border-[var(--color-border-subtle)] hover:border-amber-500/40 shadow-lg hover:shadow-xl transition-all duration-300 space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
            <div className="text-[11px] font-mono text-[var(--color-text-secondary)] uppercase tracking-wider font-medium">
              {isBangla ? 'সক্রিয় সফট-লক সুরক্ষিত দাগ' : 'Active Cadastral Locks'}
            </div>
            <div className="text-2xl sm:text-4xl font-bold font-mono tabular-nums text-amber-500 flex items-baseline gap-2">
              <span>88</span>
              <span className="text-xs font-normal text-[var(--color-text-secondary)] font-mono">
                {isBangla ? 'দাগে লক' : 'Dags'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-[var(--color-text-secondary)] pt-1">
              {isBangla ? 'দ্বৈত দলিল রোধে সাব-রেজিস্ট্রিতে সংযুক্ত' : 'Synced with Tejgaon & Sadar registries'}
            </div>
          </div>
        </div>

        {/* ====================================================================
            2.5 BANGLADESH 360° NATIONAL RISK RADAR SECTION (D3.js GIS Engine)
            Rendered when analyticsViewMode is 'radar' or 'split'
           ==================================================================== */}
        {(analyticsViewMode === 'radar' || analyticsViewMode === 'split') && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border-subtle)] pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-[var(--color-surface-raised)] uppercase">
                  <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  <span>{isBangla ? 'জাতীয় ভূ-স্থানিক হুমকি পর্যবেক্ষণ' : 'National Geospatial Threat Radar'}</span>
                  <span className="text-[var(--color-text-tertiary)]">·</span>
                  <span className="text-[var(--color-text-secondary)]">WGS84 D3.js GeoProjection</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                  {isBangla
                    ? 'বাংলাদেশ ৩৬০° আঞ্চলিক ঝুঁকি ও উপকূলীয় জালিয়াতি পর্যবেক্ষণ রাডার'
                    : 'Bangladesh 360° Regional Threat Radar & Coastal Alluvion Telemetry'}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                  {isBangla
                    ? 'পটুয়াখালী-বরিশাল উপকূলীয় বেল্ট, সোয়াচ অব নো গ্রাউন্ড ও ৮টি প্রশাসনিক বিভাগের রিয়েল-টাইম ক্যাডাস্ট্রাল পর্যবেক্ষণ ও বেনামি সিন্ডিকেট সনাক্তকরণ।'
                    : 'Continuous 10 RPM 360° spatial sweep centered on focal target hubs with bathymetric shelf contours, oceanic isobaths, and cross-division deed dispute telemetry.'}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono shrink-0">
                <span className="px-2.5 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                  <span>{isBangla ? 'লাইভ রাডার সক্রিয়' : 'Live Sweep Active'}</span>
                </span>
                <span className="px-2.5 py-1 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400 font-semibold">
                  10 RPM · 155 km
                </span>
              </div>
            </div>

            {/* D3 Map Canvas Component */}
            <Suspense
              fallback={
                <div
                  style={{ height: analyticsViewMode === 'split' ? '600px' : '760px' }}
                  className="w-full flex flex-col items-center justify-center gap-3 rounded-[8px] bg-black/60 border border-white/10 font-mono text-xs text-emerald-400"
                >
                  <Radio className="w-8 h-8 animate-pulse text-emerald-400" />
                  <span>{isBangla ? 'বাংলাদেশ ৩৬০° জাতীয় ঝুঁকি রাডার ইঞ্জিন লোড হচ্ছে...' : 'Initializing Bangladesh 360° National Threat Radar Engine...'}</span>
                </div>
              }
            >
              <BangladeshNationalRiskRadarMap
                height={analyticsViewMode === 'split' ? '600px' : '760px'}
                initialLockedHubId={activeNationalHub.id}
                onSelectHub={(hub) => setSelectedNationalHub(hub)}
              />
            </Suspense>

            {/* Focal Target Hub Telemetry Dossier Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-6 rounded border border-[var(--color-border-subtle)] bg-[var(--color-surface-strong)]/50 backdrop-blur-sm">
              {/* Left Column: Focal Target Status (5 Cols) */}
              <div className="lg:col-span-5 space-y-4 border-b lg:border-b-0 lg:border-r border-[var(--color-border-subtle)] pb-5 lg:pb-0 lg:pr-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                    </span>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-500">
                      {isBangla ? 'সক্রিয় টার্গেট লক' : 'Target Lock Dossier'}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded ${
                      activeNationalHub.riskScore >= 80
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : activeNationalHub.riskScore >= 65
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}
                  >
                    {activeNationalHub.riskLevel} · {activeNationalHub.riskScore}/100
                  </span>
                </div>

                <div>
                  <h4 className="text-2xl font-bold font-mono text-[var(--color-text-primary)] flex items-baseline gap-2">
                    <span>{isBangla ? activeNationalHub.nameBn : activeNationalHub.name}</span>
                    <span className="text-xs font-normal text-[var(--color-text-secondary)] font-mono">
                      ({activeNationalHub.divisionId.toUpperCase()})
                    </span>
                  </h4>
                  <p className="text-xs text-[var(--color-text-secondary)] font-mono mt-1">
                    WGS84: {activeNationalHub.coordinates[1].toFixed(4)}° N, {activeNationalHub.coordinates[0].toFixed(4)}° E
                  </p>
                </div>

                {/* Primary Threat Vector Badge */}
                <div className="p-3 rounded bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] space-y-1">
                  <div className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase">
                    {isBangla ? 'প্রধান ঝুঁকি ভেক্টর / জালিয়াতি ধরন' : 'Primary Threat Vector / Syndicate Modus'}
                  </div>
                  <div className="text-sm font-bold font-mono text-amber-500">
                    {activeNationalHub.threatVector}
                  </div>
                  <div className="text-[11px] text-[var(--color-text-secondary)]">
                    {isBangla ? activeNationalHub.threatVectorBn : 'Monitored via CS/BS satellite overlay and deed timeline.'}
                  </div>
                </div>

                {/* Quick Target Switcher Buttons */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase">
                    {isBangla ? 'দ্রুত অঞ্চল নির্বাচন করুন:' : 'Switch Focal Hub:'}
                  </div>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {NATIONAL_HUBS.slice(0, 8).map((hub) => (
                      <button
                        key={hub.id}
                        onClick={() => setSelectedNationalHub(hub)}
                        className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                          activeNationalHub.id === hub.id
                            ? 'bg-[var(--color-surface-raised)] text-white font-semibold'
                            : 'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-subtle)]'
                        }`}
                      >
                        {isBangla ? hub.nameBn : hub.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Telemetry Metrics & Incident Stream (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] space-y-1 font-mono">
                    <div className="text-[10px] text-[var(--color-text-secondary)] uppercase">
                      {isBangla ? 'বিবাদযুক্ত দাগ সংখ্যা' : 'Active Disputed Dags'}
                    </div>
                    <div className="text-xl font-bold tabular-nums text-red-500">
                      {activeNationalHub.activeDisputes}
                    </div>
                    <div className="text-[9.5px] text-[var(--color-text-tertiary)]">
                      {isBangla ? 'ক্যাডাস্ট্রাল সফট-লক কার্যকর' : 'Cadastral locks active'}
                    </div>
                  </div>

                  <div className="p-3 rounded bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] space-y-1 font-mono">
                    <div className="text-[10px] text-[var(--color-text-secondary)] uppercase">
                      {isBangla ? 'সুরক্ষিত মূলধন' : 'Prevented Fraud Exposure'}
                    </div>
                    <div className="text-xl font-bold tabular-nums text-emerald-500">
                      ৳ {activeNationalHub.preventedCr} <span className="text-xs font-normal font-sans">Cr</span>
                    </div>
                    <div className="text-[9.5px] text-[var(--color-text-tertiary)]">
                      {isBangla ? 'দ্বৈত দলিল স্থগিত' : 'Double deeds halted'}
                    </div>
                  </div>

                  <div className="p-3 rounded bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] space-y-1 font-mono col-span-2 sm:col-span-1">
                    <div className="text-[10px] text-[var(--color-text-secondary)] uppercase">
                      {isBangla ? 'সাব-রেজিস্ট্রি অফিস' : 'Linked Sub-Registries'}
                    </div>
                    <div className="text-xl font-bold tabular-nums text-[var(--color-text-primary)]">
                      {activeNationalHub.subRegistryCount}
                    </div>
                    <div className="text-[9.5px] text-[var(--color-text-tertiary)]">
                      {isBangla ? 'ডিজিটাল খতিয়ান সিঙ্ক' : 'Direct e-Khaitan API'}
                    </div>
                  </div>
                </div>

                {/* Recent Incident Feed for Active Hub */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-[var(--color-text-primary)] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      <span>{isBangla ? 'সম্প্রতি সনাক্তকৃত ভূ-স্থানিক অসংগতি' : 'Recent Cadastral Anomaly Telemetry'}</span>
                    </span>
                    <span className="text-[10px] text-[var(--color-text-secondary)]">Live Feed</span>
                  </div>

                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="p-2.5 rounded bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        <span className="text-[var(--color-text-primary)] font-semibold truncate">
                          {isBangla ? 'মৌজা দাগ নং ৪৭২: চর পয়স্তি খতিয়ান ওভারল্যাপ' : 'Mouza Dag #472: Alluvion Char Boundary Variance'}
                        </span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold shrink-0">
                        {isBangla ? 'লক কার্যকর' : 'LOCKED'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="text-[var(--color-text-primary)] font-semibold truncate">
                          {isBangla ? 'মৌজা দাগ নং ১০৮: সমসাময়িক দ্বৈত রেজিস্ট্রি প্রচেষ্টা' : 'Mouza Dag #108: Multi-Registry Concurrent Sale Attempt'}
                        </span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold shrink-0">
                        {isBangla ? 'নিরীক্ষা চলমান' : 'AUDIT'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                        <span className="text-[var(--color-text-primary)] font-semibold truncate">
                          {isBangla ? 'মৌজা দাগ নং ৯২১: ওয়ারিশ গোপনপূর্বক আমমোক্তারনামা' : 'Mouza Dag #921: Power of Attorney Heir Omission'}
                        </span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold shrink-0">
                        {isBangla ? 'স্থগিত' : 'HALTED'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            3. MAIN VISUALIZATION GRID:
               Left: Dhaka High-Risk Zones Ranking (BarChart)
               Right: Multi-Quarter Fraud Trends (AreaChart)
           ==================================================================== */}
        {(analyticsViewMode === 'charts' || analyticsViewMode === 'split') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Chart A: Dhaka High-Risk Zones Bar Chart (7 Cols) */}
            <div className="lg:col-span-7 specular-card p-6 sm:p-7 rounded-2xl border border-[var(--color-border-subtle)] hover:border-emerald-500/30 transition-all duration-300 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)]">
                    {isBangla ? 'ঢাকা মেট্রো থানাভিত্তিক জালিয়াতি ঝুঁকি স্কোর' : 'Dhaka Zones Fraud Risk Ranking'}
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {isBangla
                      ? 'ক্লিক করে যেকোনো অঞ্চলের বিস্তারিত ভেক্টর ও দাগ প্রোফাইল দেখুন'
                      : 'Select a zone bar to inspect detailed vector vulnerabilities & hot dags'}
                  </p>
                </div>

              {/* Legend indicator */}
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-red-500">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                  <span>≥80 {isBangla ? 'চরম' : 'Critical'}</span>
                </span>
                <span className="flex items-center gap-1 text-orange-500">
                  <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                  <span>65-79 {isBangla ? 'উচ্চ' : 'High'}</span>
                </span>
                <span className="flex items-center gap-1 text-amber-500">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  <span>35-64 {isBangla ? 'মাঝারি' : 'Medium'}</span>
                </span>
                <span className="flex items-center gap-1 text-emerald-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>&lt;35 {isBangla ? 'স্বাভাবিক' : 'Low'}</span>
                </span>
              </div>
            </div>

            {/* Recharts BarChart */}
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                  onClick={(state: any) => {
                    if (state && state.activePayload && state.activePayload.length > 0) {
                      const payload = state.activePayload[0].payload;
                      if (payload?.id) {
                        setSelectedZoneId(payload.id);
                      }
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={gridColor} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    stroke={tickColor}
                    tick={{ fill: tickColor, fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: gridColor }}
                  />
                  <YAxis
                    type="category"
                    dataKey="shortName"
                    stroke={tickColor}
                    tick={{ fill: tickColor, fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: gridColor }}
                    width={85}
                  />
                  <Tooltip
                    cursor={{ fill: isDay ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const zone = payload[0].payload;
                        return (
                          <div className="p-3.5 rounded border border-[var(--color-border-subtle)] bg-[var(--color-surface-strong)]/95 shadow-2xl text-xs font-mono space-y-2 backdrop-blur-md max-w-xs">
                            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-1.5">
                              <div>
                                <span className="font-bold text-[var(--color-text-primary)] text-sm">
                                  {isBangla ? zone.nameBn : zone.nameEn}
                                </span>
                                <span className="text-[10px] text-[var(--color-text-tertiary)] block">
                                  {isBangla ? `ঢাকা মেট্রো স্থান: #${zone.rank}` : `Dhaka Metro Rank #${zone.rank}`}
                                </span>
                              </div>
                              <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded border"
                                style={{
                                  backgroundColor: `${getRiskColor(zone.level)}18`,
                                  borderColor: `${getRiskColor(zone.level)}40`,
                                  color: getRiskColor(zone.level),
                                }}
                              >
                                {zone.level}
                              </span>
                            </div>

                            {/* Risk Score Progress Bar */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-[var(--color-text-secondary)]">
                                  {isBangla ? 'জালিয়াতি ঝুঁকি সূচক:' : 'Fraud Risk Score:'}
                                </span>
                                <span
                                  className="font-bold tabular-nums text-sm"
                                  style={{ color: getRiskColor(zone.level) }}
                                >
                                  {zone.riskScore} <span className="text-[10px] text-[var(--color-text-tertiary)] font-normal">/ 100</span>
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-[var(--color-surface-muted)] rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-300"
                                  style={{
                                    width: `${zone.riskScore}%`,
                                    backgroundColor: getRiskColor(zone.level),
                                  }}
                                />
                              </div>
                            </div>

                            {/* Detailed Telemetry Stats */}
                            <div className="pt-1.5 border-t border-[var(--color-border-subtle)] space-y-1 text-[11px]">
                              <div className="flex items-center justify-between">
                                <span className="text-[var(--color-text-secondary)]">
                                  {isBangla ? 'বিবাদযুক্ত সক্রিয় দাগ:' : 'Active Disputed Dags:'}
                                </span>
                                <span className="font-bold text-[var(--color-text-primary)] tabular-nums">
                                  {zone.dags}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[var(--color-text-secondary)]">
                                  {isBangla ? 'সক্রিয় সফট-লক:' : 'Cadastral Soft-Locks:'}
                                </span>
                                <span className="font-bold text-amber-500 tabular-nums flex items-center gap-1">
                                  <Lock className="w-3 h-3 inline" />
                                  <span>{zone.locks}</span>
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[var(--color-text-secondary)]">
                                  {isBangla ? 'আটককৃত আর্থিক ক্ষতি:' : 'Halted Capital:'}
                                </span>
                                <span className="font-bold text-[var(--color-surface-raised)] tabular-nums">
                                  ৳ {zone.preventedCr} Cr
                                </span>
                              </div>
                            </div>

                            {/* Primary Vector & Click Instruction */}
                            <div className="pt-1.5 border-t border-[var(--color-border-subtle)] space-y-1 text-[10px]">
                              <div className="text-[var(--color-text-secondary)] truncate">
                                <strong className="text-[var(--color-text-primary)] font-normal">Vector: </strong>
                                {isBangla ? zone.primaryVectorBn : zone.primaryVector}
                              </div>
                              <div className="text-[var(--color-surface-raised)] flex items-center gap-1 font-semibold pt-0.5">
                                <span>{isBangla ? 'ক্লিক করে এই অঞ্চলের ট্রেন্ড দেখুন' : 'Click bar to focus zone trends'}</span>
                                <ChevronRight className="w-3 h-3" />
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="riskScore"
                    radius={[0, 4, 4, 0]}
                    cursor="pointer"
                  >
                    {barChartData.map((entry) => (
                      <Cell
                        key={`cell-${entry.id}`}
                        fill={getBarColor(entry.riskScore)}
                        stroke={selectedZoneId === entry.id ? '#ffffff' : 'none'}
                        strokeWidth={selectedZoneId === entry.id ? 2 : 0}
                        opacity={selectedZoneId === entry.id ? 1 : 0.82}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Helper */}
            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-text-secondary)] border-t border-[var(--color-border-subtle)] pt-3">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--color-surface-raised)]" />
                <span>
                  {isBangla ? 'নির্বাচিত অঞ্চল:' : 'Active Zone:'}{' '}
                  <strong className="text-[var(--color-text-primary)]">
                    {isBangla ? selectedZone.nameBn : selectedZone.name}
                  </strong>{' '}
                  ({selectedZone.riskScore}/100 - {selectedZone.riskLevel})
                </span>
              </span>
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="text-[var(--color-surface-raised)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{isBangla ? 'পূর্ণাঙ্গ প্রোফাইল' : 'Inspect Zone Dossier'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chart B: Dynamic Date-Range Fraud Trends AreaChart (5 Cols) */}
          <div className="lg:col-span-5 specular-card p-6 sm:p-7 rounded-2xl border border-[var(--color-border-subtle)] hover:border-emerald-500/30 transition-all duration-300 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)]">
                  {isBangla ? 'জালিয়াতি প্রবণতা ও গতিশীল সময়রেখা' : 'Fraud Velocity & Temporal Risk Trajectory'}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  <span className="text-[var(--color-surface-raised)] font-mono font-medium">
                    {trendSummary.startDateStr}
                  </span>{' '}
                  {isBangla ? 'হতে' : 'to'}{' '}
                  <span className="text-[var(--color-surface-raised)] font-mono font-medium">
                    {trendSummary.endDateStr}
                  </span>{' '}
                  · <span className="capitalize">{trendSummary.resolution}</span> ({trendData.length} pts)
                </p>
              </div>

              {/* Metric & Comparison Selectors */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                {trendMetric === 'index' && (
                  <button
                    onClick={() => setCompareWithMetro((prev) => !prev)}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-colors cursor-pointer ${
                      compareWithMetro
                        ? 'border-[var(--color-surface-raised)] text-[var(--color-surface-raised)] bg-[var(--color-surface-raised)]/10'
                        : 'border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                    title={isBangla ? 'মেট্রোপলিটন গড়ের সাথে তুলনা চালু/বন্ধ' : 'Toggle Metro Average comparison curve'}
                  >
                    {isBangla ? 'মেট্রো গড় তুলনা' : 'vs Metro Avg'}
                  </button>
                )}

                <div className="flex items-center p-0.5 bg-[var(--color-surface-muted)] rounded border border-[var(--color-border-subtle)] text-[11px] font-mono">
                  <button
                    onClick={() => setTrendMetric('index')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      trendMetric === 'index'
                        ? 'bg-[var(--color-surface-raised)] text-white font-semibold'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    {isBangla ? 'সূচক' : 'Index'}
                  </button>
                  <button
                    onClick={() => setTrendMetric('incidents')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      trendMetric === 'incidents'
                        ? 'bg-[var(--color-surface-raised)] text-white font-semibold'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    {isBangla ? 'বিরোধ' : 'Incidents'}
                  </button>
                  <button
                    onClick={() => setTrendMetric('financial')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      trendMetric === 'financial'
                        ? 'bg-[var(--color-surface-raised)] text-white font-semibold'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    {isBangla ? 'মূল্য' : '৳ Cr'}
                  </button>
                </div>
              </div>
            </div>

            {/* Recharts AreaChart with Dynamic Date Data */}
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorZoneRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={getRiskColor(selectedZone.riskLevel)} stopOpacity={0.65} />
                      <stop offset="95%" stopColor={getRiskColor(selectedZone.riskLevel)} stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorMetroRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorDouble" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.65} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorMutation" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#eab308" stopOpacity={0.65} />
                      <stop offset="95%" stopColor="#eab308" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorWarisan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.65} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis
                    dataKey={isBangla ? 'periodBn' : 'period'}
                    stroke={tickColor}
                    tick={{ fill: tickColor, fontSize: 10 }}
                    tickLine={false}
                    interval={trendData.length > 20 ? Math.floor(trendData.length / 6) : 0}
                  />
                  <YAxis
                    stroke={tickColor}
                    tick={{ fill: tickColor, fontSize: 11 }}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ stroke: isDay ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.35)', strokeWidth: 1.5, strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const point = payload[0].payload as TrendDataPoint;
                        const zoneScore = point.zoneRiskIndex ?? point.overallRiskIndex;
                        const diffVsMetro = Math.round((zoneScore - point.overallRiskIndex) * 10) / 10;
                        const scoreColor = getRiskColor(selectedZone.riskLevel);

                        return (
                          <div className="p-3.5 rounded border border-[var(--color-border-subtle)] bg-[var(--color-surface-strong)]/95 shadow-2xl text-xs font-mono space-y-2.5 backdrop-blur-md max-w-xs">
                            {/* Header: Date & Operating Status */}
                            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-1.5">
                              <div>
                                <span className="font-bold text-[var(--color-text-primary)] text-sm">
                                  {isBangla ? point.periodBn : point.period}
                                </span>
                                {point.isoDate && (
                                  <span className="text-[10px] text-[var(--color-text-tertiary)] block">
                                    {point.isoDate} · {point.dayOfWeek}
                                  </span>
                                )}
                              </div>
                              <span
                                className={`text-[9px] px-2 py-0.5 rounded font-bold border ${
                                  point.isWeekend
                                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                    : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                }`}
                              >
                                {point.isWeekend ? 'HOLIDAY / AI AUDIT' : 'COUNTERS ACTIVE'}
                              </span>
                            </div>

                            {/* Core Risk Score Breakdown */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-[var(--color-text-secondary)]">
                                  {isBangla ? selectedZone.nameBn : selectedZone.name} {isBangla ? 'ঝুঁকি স্কোর:' : 'Risk Score:'}
                                </span>
                                <span
                                  className="font-bold tabular-nums text-sm"
                                  style={{ color: scoreColor }}
                                >
                                  {zoneScore} <span className="text-[10px] text-[var(--color-text-tertiary)] font-normal">/ 100</span>
                                </span>
                              </div>

                              {/* Visual Score Meter */}
                              <div className="w-full h-1.5 bg-[var(--color-surface-muted)] rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-300"
                                  style={{
                                    width: `${zoneScore}%`,
                                    backgroundColor: scoreColor,
                                  }}
                                />
                              </div>

                              {/* Citywide Benchmark Comparison */}
                              <div className="flex items-center justify-between text-[10px] text-[var(--color-text-secondary)] pt-0.5">
                                <span>{isBangla ? 'ঢাকা মেট্রো সার্বিক গড়:' : 'Dhaka City Baseline:'}</span>
                                <span className="font-semibold text-emerald-400 tabular-nums">
                                  {point.overallRiskIndex} / 100
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-[10px] text-[var(--color-text-tertiary)]">
                                <span>{isBangla ? 'মেট্রো গড় হতে ব্যবধান:' : 'Variance vs Metro:'}</span>
                                <span
                                  className={`font-semibold tabular-nums ${
                                    diffVsMetro > 0 ? 'text-red-400' : 'text-emerald-400'
                                  }`}
                                >
                                  {diffVsMetro > 0 ? `+${diffVsMetro}` : diffVsMetro} pts{' '}
                                  <span className="font-normal text-[9px]">
                                    ({diffVsMetro > 0 ? (isBangla ? 'উচ্চতর ঝুঁকি' : 'higher risk') : (isBangla ? 'নিরাপদ' : 'lower risk')})
                                  </span>
                                </span>
                              </div>
                            </div>

                            {/* Daily Incident Telemetry */}
                            <div className="pt-2 border-t border-[var(--color-border-subtle)] space-y-1 text-[11px]">
                              <div className="flex items-center justify-between text-red-400">
                                <span>{isBangla ? 'দ্বৈত দলিল সম্পাদন চেষ্টা:' : 'Double-Sale Alerts:'}</span>
                                <span className="font-bold tabular-nums">{point.doubleSaleIncidents}</span>
                              </div>
                              <div className="flex items-center justify-between text-amber-400">
                                <span>{isBangla ? 'নামজারি রেকর্ড টেম্পারিং:' : 'Mutation Alterations:'}</span>
                                <span className="font-bold tabular-nums">{point.mutationTamperingCount}</span>
                              </div>
                              <div className="flex items-center justify-between text-orange-400">
                                <span>{isBangla ? 'ওয়ারিশ সনদ গোপন/বিরোধ:' : 'Warisan Disputes:'}</span>
                                <span className="font-bold tabular-nums">{point.warisanDisputes}</span>
                              </div>
                            </div>

                            {/* Financial Protection & Locks */}
                            <div className="pt-2 border-t border-[var(--color-border-subtle)] space-y-1 text-[11px]">
                              <div className="flex items-center justify-between">
                                <span className="text-[var(--color-text-secondary)]">
                                  {isBangla ? 'প্রতিরোধকৃত মূলধন মূল্য:' : 'Halted Transaction Value:'}
                                </span>
                                <span className="font-bold text-blue-400 tabular-nums">
                                  ৳ {point.preventedVolumeCr} Cr
                                </span>
                              </div>
                              {point.activeLocksCount && (
                                <div className="flex items-center justify-between text-[10px] text-amber-400">
                                  <span className="flex items-center gap-1">
                                    <Lock className="w-3 h-3 inline" />
                                    <span>{isBangla ? 'মোতায়েনকৃত সফট-লক:' : 'Active Soft-Locks:'}</span>
                                  </span>
                                  <span className="font-bold tabular-nums">{point.activeLocksCount} Dags</span>
                                </div>
                              )}
                            </div>

                            {/* Operational Status Subtext */}
                            <div className="pt-1.5 border-t border-[var(--color-border-subtle)] text-[10px] text-[var(--color-text-tertiary)] leading-tight">
                              {isBangla ? point.registryStatusBn : point.registryStatus}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11, fontFamily: 'monospace' }}
                  />

                  {trendMetric === 'index' && (
                    <>
                      <Area
                        type="monotone"
                        dataKey="zoneRiskIndex"
                        name={isBangla ? `${selectedZone.nameBn} ঝুঁকি সূচক` : `${selectedZone.name} Risk Score`}
                        stroke={getRiskColor(selectedZone.riskLevel)}
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorZoneRisk)"
                        activeDot={{
                          r: 7,
                          stroke: '#ffffff',
                          strokeWidth: 2,
                          fill: getRiskColor(selectedZone.riskLevel),
                        }}
                        dot={trendData.length <= 16 ? { r: 3.5, stroke: '#ffffff', strokeWidth: 1, fill: getRiskColor(selectedZone.riskLevel) } : false}
                      />
                      {compareWithMetro && (
                        <Area
                          type="monotone"
                          dataKey="overallRiskIndex"
                          name={isBangla ? 'ঢাকা মেট্রো সার্বিক গড়' : 'Dhaka Metro Average'}
                          stroke="#22c55e"
                          strokeDasharray="4 4"
                          strokeWidth={1.5}
                          fillOpacity={0.1}
                          fill="url(#colorMetroRisk)"
                          activeDot={{
                            r: 5,
                            stroke: '#ffffff',
                            strokeWidth: 1.5,
                            fill: '#22c55e',
                          }}
                        />
                      )}
                    </>
                  )}

                  {trendMetric === 'incidents' && (
                    <>
                      <Area
                        type="monotone"
                        dataKey="doubleSaleIncidents"
                        name={isBangla ? 'দ্বৈত বিক্রয় চেষ্টা' : 'Double-Sale Rate'}
                        stroke="#ef4444"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorDouble)"
                        activeDot={{
                          r: 6,
                          stroke: '#ffffff',
                          strokeWidth: 2,
                          fill: '#ef4444',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="mutationTamperingCount"
                        name={isBangla ? 'নামজারি টেম্পারিং' : 'Mutation Alterations'}
                        stroke="#eab308"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorMutation)"
                        activeDot={{
                          r: 6,
                          stroke: '#ffffff',
                          strokeWidth: 2,
                          fill: '#eab308',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="warisanDisputes"
                        name={isBangla ? 'ওয়ারিশ বিরোধ' : 'Warisan Disputes'}
                        stroke="#f97316"
                        strokeWidth={1.5}
                        fillOpacity={0.5}
                        fill="url(#colorWarisan)"
                        activeDot={{
                          r: 5,
                          stroke: '#ffffff',
                          strokeWidth: 1.5,
                          fill: '#f97316',
                        }}
                      />
                    </>
                  )}

                  {trendMetric === 'financial' && (
                    <Area
                      type="monotone"
                      dataKey="preventedVolumeCr"
                      name={isBangla ? 'প্রতিরোধকৃত মূলধন (৳ কোটি)' : 'Halted Value (Cr BDT)'}
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={0.3}
                      fill="#3b82f6"
                      activeDot={{
                        r: 6,
                        stroke: '#ffffff',
                        strokeWidth: 2,
                        fill: '#3b82f6',
                      }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="text-[11px] font-mono text-[var(--color-text-secondary)] border-t border-[var(--color-border-subtle)] pt-3 flex items-center justify-between">
              <span className="truncate pr-2">
                {isBangla ? 'নির্বাচিত অঞ্চল:' : 'Focal Zone:'}{' '}
                <strong className="text-[var(--color-text-primary)]">
                  {isBangla ? selectedZone.nameBn : selectedZone.name}
                </strong>{' '}
                ({selectedZone.riskScore} pts)
              </span>
              <span className="text-[var(--color-surface-raised)] shrink-0 flex items-center gap-1">
                <span>{trendSummary.resolution} telemetry</span>
              </span>
            </div>
          </div>
        </div>
      )}

        {/* ====================================================================
            4. SECOND VISUALIZATION ROW:
               Left: Radar Vector Breakdown for Selected Zone vs Dhaka Average (6 cols)
               Right: Fraud Typology Distribution Donut (6 cols)
           ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Radar Chart: Multi-Signal Vectors for Selected Zone */}
          <div className="lg:col-span-6 specular-card p-6 sm:p-7 rounded-2xl border border-[var(--color-border-subtle)] hover:border-emerald-500/30 transition-all duration-300 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)]">
                    {isBangla
                      ? `${selectedZone.nameBn} এর জালিয়াতি ভেক্টর বিশ্লেষণ`
                      : `${selectedZone.name} Anomaly Vector Radar`}
                  </h3>
                  <span
                    className="text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${getRiskColor(selectedZone.riskLevel)}18`,
                      color: getRiskColor(selectedZone.riskLevel),
                      border: `1px solid ${getRiskColor(selectedZone.riskLevel)}40`,
                    }}
                  >
                    {selectedZone.riskScore} PTS · {selectedZone.riskLevel}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {isBangla
                    ? 'মেট্রোপলিটন গড়ের তুলনায় ৬টি মৌলিক ঝুঁকি মাত্রার তুলনা'
                    : 'Comparison of 6 fraud attack vectors against Dhaka citywide baseline'}
                </p>
              </div>

              {/* Controls: Baseline toggle & Zone switcher */}
              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setShowMetroBaseline(!showMetroBaseline)}
                  className={`text-[10px] font-mono px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                    showMetroBaseline
                      ? 'bg-slate-800/10 dark:bg-white/10 text-[var(--color-text-primary)] border-slate-400/40'
                      : 'bg-transparent text-[var(--color-text-tertiary)] border-[var(--color-border-subtle)]'
                  }`}
                  title={isBangla ? 'মেট্রো গড় রেফারেন্স অন/অফ' : 'Toggle Metro Average Baseline'}
                >
                  {isBangla ? 'মেট্রো গড়' : 'Metro Avg'}: {showMetroBaseline ? 'ON' : 'OFF'}
                </button>

                <div className="relative">
                  <select
                    value={selectedZoneId}
                    onChange={(e) => setSelectedZoneId(e.target.value)}
                    className="pl-2.5 pr-6 py-1 text-xs font-mono bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] rounded-lg cursor-pointer appearance-none hover:border-slate-400/60 transition-colors focus:outline-none focus:border-emerald-500"
                  >
                    {DHAKA_RISK_ZONES.map((z) => (
                      <option key={z.id} value={z.id}>
                        {isBangla ? z.nameBn : z.name} ({z.riskScore})
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-[var(--color-text-secondary)] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Intelligent Zero-Overlap Telemetry Shelf (Fixed HUD, never covers radar) */}
            <div className="min-h-[42px] px-3.5 py-2 rounded-xl bg-[var(--color-surface-muted)]/70 border border-[var(--color-border-subtle)] font-mono text-xs flex items-center justify-between transition-all">
              {activeRadarVector ? (
                <div className="w-full flex flex-wrap items-center justify-between gap-2 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full animate-pulse shadow-xs"
                      style={{
                        backgroundColor: getRiskColor(selectedZone.riskLevel),
                        boxShadow: `0 0 8px ${getRiskColor(selectedZone.riskLevel)}`,
                      }}
                    />
                    <span className="font-bold text-[var(--color-text-primary)]">
                      {activeRadarVector.subject}
                    </span>
                    <span
                      className="text-[9.5px] px-2 py-0.5 rounded font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${getRiskColor(selectedZone.riskLevel)}18`,
                        color: getRiskColor(selectedZone.riskLevel),
                        border: `1px solid ${getRiskColor(selectedZone.riskLevel)}35`,
                      }}
                    >
                      {activeRadarVector.zone >= 70 ? (isBangla ? 'উচ্চ ঝুঁকি' : 'High Threat') : (isBangla ? 'নজরদারিতে' : 'Monitored')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-[var(--color-text-secondary)]">
                      {isBangla ? selectedZone.nameBn : selectedZone.name}:{' '}
                      <strong className="font-bold tabular-nums" style={{ color: getRiskColor(selectedZone.riskLevel) }}>
                        {activeRadarVector.zone} / 100
                      </strong>
                    </span>
                    <span className="text-[var(--color-text-tertiary)]">|</span>
                    <span className="text-[var(--color-text-secondary)]">
                      Metro Avg:{' '}
                      <strong className="text-slate-400 font-bold tabular-nums">
                        {activeRadarVector.metroAvg}
                      </strong>
                    </span>
                    <span
                      className={`font-bold px-1.5 py-0.5 rounded text-[10.5px] tabular-nums ${
                        activeRadarVector.zone - activeRadarVector.metroAvg > 0
                          ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/25'
                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                      }`}
                    >
                      Δ {activeRadarVector.zone - activeRadarVector.metroAvg > 0 ? `+${activeRadarVector.zone - activeRadarVector.metroAvg}` : activeRadarVector.zone - activeRadarVector.metroAvg} pts
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full flex items-center justify-between text-[11px] text-[var(--color-text-secondary)]">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>{isBangla ? '৬টি ভেক্টর পর্যবেক্ষণরত · পয়েন্ট বা চিপসে হোভার করুন' : '6 Fraud Vectors Tracked · Hover vertex or chip to inspect'}</span>
                  </span>
                  <span className="text-[10px] text-[var(--color-text-tertiary)] hidden sm:inline">
                    {isBangla ? 'শীর্ষ ঝুঁকি: ' : 'Peak Risk: '}
                    <strong className="text-red-500 font-bold">{selectedZone.primaryVector}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* RadarChart with Cyber Glowing Gradients & Interactive Vertex Dots (Zero-Overlap Floating Inspector) */}
            <div
              className="w-full h-80 flex items-center justify-center relative"
              onMouseLeave={() => setHoveredVectorSubject(null)}
            >
              {/* Intelligent Dynamic Non-Colliding Floating Inspector Card */}
              {activeRadarVector && (
                <div
                  className={`absolute z-30 transition-all duration-300 pointer-events-none select-none ${
                    // If active vector is on the right side, dock top-left so it NEVER collides with the vertex or cursor
                    activeRadarVector.subject === (isBangla ? 'দ্বৈত দলিল রেজিস্ট্রি' : 'Double Sale Velocity') ||
                    activeRadarVector.subject === (isBangla ? 'আমমোক্তারনামা জাল' : 'Power of Attorney')
                      ? 'top-2 left-2 sm:top-3 sm:left-3 animate-in fade-in slide-in-from-left-2 duration-150'
                      : 'top-2 right-2 sm:top-3 sm:right-3 animate-in fade-in slide-in-from-right-2 duration-150'
                  }`}
                >
                  <div className="p-3.5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-strong)]/95 shadow-2xl text-xs font-mono space-y-2 backdrop-blur-md min-w-[210px] max-w-[245px]">
                    {/* Header with Title and Threat Badge */}
                    <div className="flex items-center justify-between gap-2 border-b border-[var(--color-border-subtle)] pb-1.5">
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse shadow-xs"
                          style={{
                            backgroundColor: getRiskColor(selectedZone.riskLevel),
                            boxShadow: `0 0 8px ${getRiskColor(selectedZone.riskLevel)}`,
                          }}
                        />
                        <span className="font-bold text-[var(--color-text-primary)] truncate text-[11.5px]">
                          {activeRadarVector.subject}
                        </span>
                      </div>
                      <span
                        className="text-[9.5px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0"
                        style={{
                          backgroundColor: `${getRiskColor(selectedZone.riskLevel)}18`,
                          color: getRiskColor(selectedZone.riskLevel),
                          border: `1px solid ${getRiskColor(selectedZone.riskLevel)}35`,
                        }}
                      >
                        {activeRadarVector.zone >= 70
                          ? isBangla ? 'উচ্চ ঝুঁকি' : 'High Threat'
                          : isBangla ? 'নজরদারিতে' : 'Monitored'}
                      </span>
                    </div>

                    {/* Zone Score */}
                    <div className="flex items-center justify-between gap-3 text-[11px]">
                      <span className="text-[var(--color-text-secondary)]">
                        {isBangla ? selectedZone.nameBn : selectedZone.name}:
                      </span>
                      <strong
                        className="font-bold tabular-nums text-sm"
                        style={{ color: getRiskColor(selectedZone.riskLevel) }}
                      >
                        {activeRadarVector.zone} / 100
                      </strong>
                    </div>

                    {/* Metro Average */}
                    <div className="flex items-center justify-between gap-3 text-[11px]">
                      <span className="text-[var(--color-text-secondary)]">
                        {isBangla ? 'ঢাকা মেট্রো গড়:' : 'Dhaka Metro Avg:'}
                      </span>
                      <strong className="text-slate-400 font-bold tabular-nums">
                        {activeRadarVector.metroAvg} / 100
                      </strong>
                    </div>

                    {/* Variance Calculation */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--color-border-subtle)] text-[10.5px]">
                      <span className="text-[var(--color-text-secondary)]">
                        {isBangla ? 'পার্থক্য:' : 'Variance:'}
                      </span>
                      <span
                        className={`font-bold tabular-nums ${
                          activeRadarVector.zone - activeRadarVector.metroAvg > 0
                            ? 'text-red-500'
                            : 'text-emerald-500'
                        }`}
                      >
                        {activeRadarVector.zone - activeRadarVector.metroAvg > 0
                          ? `+${activeRadarVector.zone - activeRadarVector.metroAvg}`
                          : activeRadarVector.zone - activeRadarVector.metroAvg}{' '}
                        pts{' '}
                        <span className="text-[9px] font-normal opacity-80">
                          ({activeRadarVector.zone - activeRadarVector.metroAvg > 0
                            ? isBangla ? 'অধিক ঝুঁকি' : 'higher risk'
                            : isBangla ? 'কম ঝুঁকি' : 'lower risk'})
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="75%"
                  data={radarData}
                  onMouseMove={(state: any) => {
                    if (state && state.activePayload && state.activePayload.length) {
                      const subj = state.activePayload[0].payload?.subject;
                      if (subj && subj !== hoveredVectorSubject) {
                        setHoveredVectorSubject(subj);
                      }
                    }
                  }}
                >
                  <defs>
                    <linearGradient id="zoneRadarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={getRiskColor(selectedZone.riskLevel)} stopOpacity={0.65} />
                      <stop offset="95%" stopColor={getRiskColor(selectedZone.riskLevel)} stopOpacity={0.12} />
                    </linearGradient>
                    <linearGradient id="metroRadarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>

                  {/* Silent Tooltip so Recharts calculates activePayload on hover */}
                  <Tooltip cursor={false} content={() => null} />

                  <PolarGrid
                    stroke={isDay ? 'rgba(0, 0, 0, 0.09)' : 'rgba(255, 255, 255, 0.12)'}
                    strokeDasharray="3 3"
                  />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={({ x, y, payload, textAnchor }: any) => {
                      const isHovered = hoveredVectorSubject === payload.value;
                      const rColor = getRiskColor(selectedZone.riskLevel);
                      return (
                        <text
                          x={x}
                          y={y}
                          textAnchor={textAnchor}
                          fontSize={10}
                          fontFamily="monospace"
                          fontWeight={isHovered ? 700 : 500}
                          fill={isHovered ? rColor : tickColor}
                          className="transition-colors duration-150 cursor-pointer"
                          onMouseEnter={() => setHoveredVectorSubject(payload.value)}
                        >
                          {payload.value}
                        </text>
                      );
                    }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    stroke={isDay ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.15)'}
                    tick={{ fill: tickColor, fontSize: 8, fontFamily: 'monospace' }}
                  />

                  {showMetroBaseline && (
                    <Radar
                      name={isBangla ? 'ঢাকা মেট্রো গড়' : 'Dhaka Metro Avg'}
                      dataKey="metroAvg"
                      stroke="#94a3b8"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      fill="url(#metroRadarGrad)"
                      fillOpacity={0.9}
                      dot={{ r: 2.5, fill: '#94a3b8', stroke: isDay ? '#ffffff' : '#0f172a', strokeWidth: 1 }}
                      isAnimationActive={true}
                      animationDuration={800}
                    />
                  )}

                  <Radar
                    name={isBangla ? selectedZone.nameBn : selectedZone.name}
                    dataKey="zone"
                    stroke={getRiskColor(selectedZone.riskLevel)}
                    strokeWidth={2.5}
                    fill="url(#zoneRadarGrad)"
                    fillOpacity={0.9}
                    dot={(props: any) => {
                      const { cx, cy, payload, index } = props;
                      const isHovered = hoveredVectorSubject === payload?.subject;
                      const rColor = getRiskColor(selectedZone.riskLevel);
                      return (
                        <g key={`radar-dot-${index}`}>
                          {isHovered && (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={12}
                              fill={rColor}
                              fillOpacity={0.25}
                              className="animate-ping"
                            />
                          )}
                          <circle
                            cx={cx}
                            cy={cy}
                            r={isHovered ? 6.5 : 4}
                            fill={isHovered ? '#ffffff' : rColor}
                            stroke={rColor}
                            strokeWidth={isHovered ? 2.5 : 2}
                            className="transition-all duration-200 cursor-pointer"
                            style={{
                              filter: isHovered ? `drop-shadow(0 0 10px ${rColor})` : 'none',
                            }}
                            onMouseEnter={() => setHoveredVectorSubject(payload?.subject)}
                          />
                        </g>
                      );
                    }}
                    activeDot={false}
                    isAnimationActive={true}
                    animationDuration={800}
                    animationEasing="ease-out"
                  />

                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'monospace', paddingTop: 8 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Interactive 6-Vector Telemetry Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
              {radarData.map((item) => {
                const diff = Math.round((item.zone - item.metroAvg) * 10) / 10;
                const isCritical = item.zone >= 75;
                const isHigh = item.zone >= 50 && item.zone < 75;
                const isHovered = hoveredVectorSubject === item.subject;
                return (
                  <div
                    key={item.subject}
                    onMouseEnter={() => setHoveredVectorSubject(item.subject)}
                    onMouseLeave={() => setHoveredVectorSubject(null)}
                    onClick={() => setHoveredVectorSubject(hoveredVectorSubject === item.subject ? null : item.subject)}
                    className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                      isHovered
                        ? 'border-emerald-500/50 bg-[var(--color-surface-strong)] shadow-md scale-[1.02]'
                        : 'border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)]/40 hover:bg-[var(--color-surface-muted)]/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="truncate text-[var(--color-text-secondary)] font-medium">
                        {item.subject}
                      </span>
                      <span
                        className={`font-bold tabular-nums text-[10.5px] px-1.5 py-0.2 rounded ${
                          isCritical
                            ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                            : isHigh
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {item.zone}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[9.5px] text-[var(--color-text-tertiary)]">
                      <span>Metro: {item.metroAvg}</span>
                      <span className={`font-semibold ${diff > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {diff > 0 ? `+${diff}` : diff} pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Primary Threat Dossier Box */}
            <div className="p-3.5 rounded-xl border border-[var(--color-border-subtle)] bg-gradient-to-r from-[var(--color-surface-muted)]/80 to-[var(--color-surface-muted)]/40 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)] shrink-0" />
                  <span className="text-[11px] font-mono font-bold text-[var(--color-text-primary)]">
                    {isBangla ? 'সর্বোচ্চ ঝুঁকিপূর্ণ ভেক্টর:' : 'Primary Vulnerability Vector:'}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-red-500/15 text-red-600 dark:text-red-400 font-bold border border-red-500/30">
                    {isBangla ? selectedZone.primaryVectorBn : selectedZone.primaryVector}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
                  {isBangla ? '৭২ ঘণ্টা সফট-লক এনফোর্সড' : '72h Soft-Lock Enforced'}
                </span>
              </div>
              <div className="text-[11px] font-mono text-[var(--color-text-secondary)] flex flex-wrap items-center justify-between gap-2">
                <span>
                  {isBangla ? 'তত্ত্বাবধানকারী সাব-রেজিস্ট্রি:' : 'Supervising Registry Office:'}{' '}
                  <strong className="text-[var(--color-text-primary)] font-semibold">
                    {isBangla ? selectedZone.subRegistryBn : selectedZone.subRegistry}
                  </strong>
                </span>
                <span className="text-[10.5px] text-[var(--color-text-tertiary)]">
                  Hotspot Mouzas: {selectedZone.hotspotMouzas.slice(0, 2).join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Donut Chart: Fraud Typology Distribution in Dhaka */}
          <div className="lg:col-span-6 specular-card p-6 sm:p-7 rounded-2xl border border-[var(--color-border-subtle)] hover:border-emerald-500/30 transition-all duration-300 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2 flex-wrap">
                  <span>{isBangla ? 'ঢাকায় সংঘটিত জালিয়াতির ধরন ও অনুপাত' : 'Dhaka Land Fraud Modality Distribution'}</span>
                  {activeModality && (
                    <span
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full transition-all duration-200"
                      style={{
                        color: activeModality.color,
                        backgroundColor: `${activeModality.color}18`,
                        border: `1px solid ${activeModality.color}40`,
                      }}
                    >
                      {activeModality.percentage}% ACTIVE
                    </span>
                  )}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {isBangla
                    ? 'শনাক্তকৃত জালিয়াতিগুলোর শতকরা হার এবং আটকে যাওয়া আর্থিক ক্ষতির পরিমাণ'
                    : 'Breakdown of primary fraud modalities and halted financial exposure (BDT Cr)'}
                </p>
              </div>
              {activeModalityIndex !== null && (
                <button
                  onClick={() => setActiveModalityIndex(null)}
                  className="text-[10px] font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] px-2.5 py-1 rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] transition-all cursor-pointer hover:bg-[var(--color-surface-raised)]/20 shrink-0"
                  title={isBangla ? 'নির্বাচন রিসেট করুন' : 'Reset slice selection'}
                >
                  {isBangla ? 'রিসেট ✕' : 'Reset ✕'}
                </button>
              )}
            </div>

            <div className="w-full h-80 flex flex-col sm:flex-row items-center justify-center gap-5">
              {/* Interactive Donut Visualization with Center Telemetry HUD */}
              <div className="relative w-full sm:w-1/2 h-64 sm:h-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={DHAKA_FRAUD_TYPOLOGIES}
                      cx="50%"
                      cy="50%"
                      innerRadius={54}
                      outerRadius={85}
                      paddingAngle={3.5}
                      dataKey="percentage"
                      activeIndex={activeModalityIndex !== null ? activeModalityIndex : undefined}
                      activeShape={renderActiveShape}
                      onMouseEnter={(_, index) => setActiveModalityIndex(index)}
                      onMouseLeave={() => setActiveModalityIndex(null)}
                      onClick={(_, index) => setActiveModalityIndex((prev) => (prev === index ? null : index))}
                      isAnimationActive={true}
                      animationDuration={800}
                      animationEasing="ease-out"
                    >
                      {DHAKA_FRAUD_TYPOLOGIES.map((entry, index) => {
                        const isSelected = activeModalityIndex === index;
                        const isAnySelected = activeModalityIndex !== null;
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke={isDay ? '#ffffff' : '#0f172a'}
                            strokeWidth={2}
                            style={{
                              opacity: !isAnySelected || isSelected ? 1 : 0.4,
                              filter: isSelected ? `drop-shadow(0 0 12px ${entry.color}90)` : 'none',
                              transition: 'opacity 0.25s ease-out, filter 0.25s ease-out',
                              cursor: 'pointer',
                            }}
                          />
                        );
                      })}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Core HUD Telemetry Overlay (No floating tooltip collision) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                  <div className="w-[102px] h-[102px] rounded-full flex flex-col items-center justify-center text-center p-1">
                    {activeModality ? (
                      <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-150">
                        <span
                          className="text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full mb-0.5 shadow-xs whitespace-nowrap"
                          style={{
                            color: activeModality.color,
                            backgroundColor: `${activeModality.color}18`,
                            border: `1px solid ${activeModality.color}40`,
                          }}
                        >
                          {activeModality.percentage}% SHARE
                        </span>
                        <span className="text-base font-black font-mono tracking-tight text-[var(--color-text-primary)] leading-tight">
                          ৳{activeModality.valueCr}Cr
                        </span>
                        <span className="text-[9.5px] text-[var(--color-text-secondary)] font-medium max-w-[90px] truncate leading-tight">
                          {isBangla
                            ? activeModality.nameBn.split(' ')[0]
                            : activeModality.name.length > 12
                            ? activeModality.name.split(' ')[0]
                            : activeModality.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center transition-all duration-200">
                        <span className="text-[8.5px] font-mono text-[var(--color-text-tertiary)] uppercase tracking-wider font-semibold leading-none mb-0.5">
                          {isBangla ? 'নিরীক্ষিত ঝুঁকি' : 'AUDITED RISK'}
                        </span>
                        <span className="text-base font-extrabold font-mono tracking-tight text-[var(--color-text-primary)] leading-tight">
                          ৳ 583.8Cr
                        </span>
                        <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {isBangla ? '৫টি ধারা' : '5 VECTORS'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Custom Detailed Interactive Legend List */}
              <div className="w-full sm:w-1/2 space-y-2 text-xs font-mono">
                {DHAKA_FRAUD_TYPOLOGIES.map((typology, index) => {
                  const isActive = activeModalityIndex === index;
                  const isAnyActive = activeModalityIndex !== null;
                  return (
                    <div
                      key={typology.name}
                      onMouseEnter={() => setActiveModalityIndex(index)}
                      onMouseLeave={() => setActiveModalityIndex(null)}
                      onClick={() => setActiveModalityIndex(activeModalityIndex === index ? null : index)}
                      className={`group/legend relative p-2.5 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                        isActive
                          ? 'border-[var(--color-border-strong)] bg-[var(--color-surface-strong)] shadow-lg scale-[1.02]'
                          : isAnyActive
                          ? 'border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)]/30 opacity-50 hover:opacity-100'
                          : 'border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)]/50 hover:bg-[var(--color-surface-muted)]/80 hover:border-slate-400/50'
                      }`}
                      style={{
                        borderColor: isActive ? typology.color : undefined,
                        boxShadow: isActive ? `0 4px 18px ${typology.color}25, 0 0 0 1px ${typology.color}40` : undefined,
                      }}
                    >
                      {/* Active Left Indicator Bar */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-200"
                        style={{
                          backgroundColor: typology.color,
                          opacity: isActive ? 1 : 0.4,
                          boxShadow: isActive ? `0 0 8px ${typology.color}` : 'none',
                        }}
                      />

                      <div className="pl-1.5 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-200 ${
                              isActive ? 'scale-125' : 'group-hover/legend:scale-110'
                            }`}
                            style={{
                              backgroundColor: typology.color,
                              boxShadow: isActive ? `0 0 8px ${typology.color}` : 'none',
                            }}
                          />
                          <span className={`truncate font-medium transition-colors ${
                            isActive ? 'text-[var(--color-text-primary)] font-bold' : 'text-[var(--color-text-primary)]'
                          }`}>
                            {isBangla ? typology.nameBn.split(' ')[0] : typology.name}
                          </span>
                        </div>
                        <div className="text-right shrink-0 flex items-center gap-2 font-mono">
                          <span
                            className="font-bold text-[10.5px] px-1.5 py-0.5 rounded-md"
                            style={{
                              backgroundColor: `${typology.color}15`,
                              color: typology.color,
                              border: `1px solid ${typology.color}35`,
                            }}
                          >
                            {typology.percentage}%
                          </span>
                          <span className="text-[var(--color-text-secondary)] text-[10.5px] font-semibold min-w-[50px] text-right">
                            ৳{typology.valueCr}Cr
                          </span>
                        </div>
                      </div>

                      {/* Mini Percentage Fill Bar */}
                      <div className="mt-1.5 ml-1.5 h-1 rounded-full bg-[var(--color-border-subtle)]/60 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${typology.percentage}%`,
                            backgroundColor: typology.color,
                            opacity: isActive ? 1 : 0.65,
                            boxShadow: isActive ? `0 0 6px ${typology.color}` : 'none',
                          }}
                        />
                      </div>

                      {/* Inline Expanded Description (Replaces clumsy overlapping tooltip) */}
                      {isActive && (
                        <div className="mt-2 ml-1.5 pt-1.5 border-t border-[var(--color-border-subtle)] text-[10px] text-[var(--color-text-secondary)] leading-relaxed animate-in fade-in duration-200">
                          <span className="font-semibold text-[var(--color-text-primary)]">
                            {isBangla ? 'আইনি সংঘাত:' : 'Modality Profile:'}{' '}
                          </span>
                          {isBangla ? typology.descriptionBn : typology.description}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-[11px] font-mono text-[var(--color-text-secondary)] border-t border-[var(--color-border-subtle)] pt-3 flex flex-wrap items-center justify-between gap-2">
              {activeModality ? (
                <div className="flex items-center gap-2 truncate pr-2 max-w-md">
                  <span
                    className="w-2 h-2 rounded-full shrink-0 shadow-xs animate-pulse"
                    style={{ backgroundColor: activeModality.color, boxShadow: `0 0 8px ${activeModality.color}` }}
                  />
                  <span className="font-bold text-[var(--color-text-primary)] shrink-0">
                    {isBangla ? activeModality.nameBn.split(' ')[0] : activeModality.name}:
                  </span>
                  <span className="text-[var(--color-text-secondary)] truncate">
                    {isBangla ? activeModality.descriptionBn : activeModality.description}
                  </span>
                </div>
              ) : (
                <span className="text-[10px] text-[var(--color-text-tertiary)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  {isBangla ? 'স্লাইস বা তালিকায় হোভার/ক্লিক করে বিশদ তথ্য দেখুন' : 'Hover or click any modality to inspect telemetry'}
                </span>
              )}
              <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                <span>{isBangla ? 'সর্বমোট নিরীক্ষিত মূলধন:' : 'Aggregate Capital Exposure Audited:'}</span>
                <span className="font-bold text-[var(--color-text-primary)] font-mono">৳ 583.8 Cr ($53.5M)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================
            5. INTERACTIVE HIGH-RISK ZONES CADASTRAL EXPLORER TABLE
           ==================================================================== */}
        <div className="specular-card p-6 sm:p-8 rounded-2xl border border-[var(--color-border-subtle)] hover:border-emerald-500/30 transition-all duration-300 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border-subtle)] pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)]">
                {isBangla
                  ? 'ঢাকা মেট্রো থানা ও মৌজা ক্যাডাস্ট্রাল ঝুঁকি তালিকা'
                  : 'Dhaka Metropolitan Thana & Cadastral Risk Explorer'}
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {isBangla
                  ? 'সরাসরি থানা বা মৌজা খুঁজুন এবং সক্রিয় দলিল বিরোধের তথ্য দেখুন'
                  : 'Sort, filter, and inspect specific Thanas, active disputed Dags, and concurrency locks'}
              </p>
            </div>

            {/* Filter Buttons & Search Input */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
                <input
                  type="text"
                  placeholder={isBangla ? 'থানা বা মৌজা খুঁজুন...' : 'Search thana or mouza...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs font-mono bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] rounded w-48 sm:w-56 focus:outline-none focus:border-[var(--color-surface-raised)]"
                />
              </div>

              {/* Risk Level Segmented Buttons */}
              <div className="flex items-center p-0.5 bg-[var(--color-surface-muted)] rounded border border-[var(--color-border-subtle)] text-[11px] font-mono">
                {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setZoneRiskFilter(lvl)}
                    className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                      zoneRiskFilter === lvl
                        ? 'bg-[var(--color-surface-raised)] text-white font-semibold'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Responsive Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] text-[11px]">
                  <th className="py-2.5 px-3">{isBangla ? 'থানা / অঞ্চল' : 'Thana / Sector'}</th>
                  <th className="py-2.5 px-3">{isBangla ? 'ঝুঁকি স্তর' : 'Risk Tier'}</th>
                  <th className="py-2.5 px-3 text-right">{isBangla ? 'ঝুঁকি স্কোর' : 'Score'}</th>
                  <th className="py-2.5 px-3 text-right">{isBangla ? 'বিবাদযুক্ত দাগ' : 'Disputed Dags'}</th>
                  <th className="py-2.5 px-3 text-right">{isBangla ? 'সফট-লক' : 'Locks'}</th>
                  <th className="py-2.5 px-3 text-right">{isBangla ? 'আটকে যাওয়া মূল্য' : 'Blocked (Cr)'}</th>
                  <th className="py-2.5 px-3">{isBangla ? 'প্রধান প্রতারণার কারণ' : 'Primary Fraud Vector'}</th>
                  <th className="py-2.5 px-3 text-center">{isBangla ? 'অ্যাকশন' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-subtle)]">
                {filteredZones.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-xs text-[var(--color-text-secondary)]">
                      {isBangla
                        ? 'কোনো তথ্য পাওয়া যায়নি। ফিল্টার পরিবর্তন করুন।'
                        : 'No zones found matching your search criteria.'}
                    </td>
                  </tr>
                ) : (
                  filteredZones.map((zone) => {
                    const isSelected = selectedZoneId === zone.id;
                    return (
                      <tr
                        key={zone.id}
                        onClick={() => setSelectedZoneId(zone.id)}
                        className={`hover:bg-white/5 transition-colors cursor-pointer ${
                          isSelected ? 'bg-white/10' : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-semibold text-[var(--color-text-primary)]">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[var(--color-surface-raised)] shrink-0" />
                            <span>{isBangla ? zone.nameBn : zone.name}</span>
                          </div>
                          <span className="text-[10px] text-[var(--color-text-secondary)] font-normal block pl-5">
                            {zone.hotspotMouzas[0]}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className="text-[11px] font-bold"
                            style={{ color: getRiskColor(zone.riskLevel) }}
                          >
                            {zone.riskLevel}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right font-bold tabular-nums">
                          <div className="flex items-center justify-end gap-2">
                            <span>{zone.riskScore}</span>
                            <div className="w-12 h-1.5 bg-[var(--color-surface-muted)] rounded-full overflow-hidden hidden sm:block">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${zone.riskScore}%`,
                                  backgroundColor: getRiskColor(zone.riskLevel),
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-right tabular-nums text-[var(--color-text-primary)]">
                          {zone.activeDisputedDags}
                        </td>

                        <td className="py-3 px-3 text-right tabular-nums">
                          <span className="inline-flex items-center gap-1 text-amber-500">
                            <Lock className="w-3 h-3" />
                            <span>{zone.activeLocksCount}</span>
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right tabular-nums text-[var(--color-text-primary)] font-semibold">
                          ৳ {zone.preventedFraudCr}
                        </td>

                        <td className="py-3 px-3 text-[var(--color-text-secondary)] max-w-xs truncate">
                          {isBangla ? zone.primaryVectorBn : zone.primaryVector}
                        </td>

                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedZoneId(zone.id);
                              setIsDrawerOpen(true);
                            }}
                            className="px-2.5 py-1 text-[11px] font-mono rounded border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] hover:text-white transition-colors cursor-pointer"
                          >
                            {isBangla ? 'নিরীক্ষা' : 'Audit'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ====================================================================
            6. MODAL / SLIDE-OVER DRAWER: DETAILED ZONE INTELLIGENCE DOSSIER
           ==================================================================== */}
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
            <div className="w-full max-w-2xl bg-[var(--color-surface-base)] border-l border-[var(--color-border-subtle)] h-full overflow-y-auto p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-2xl">
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex items-start justify-between border-b border-[var(--color-border-subtle)] pb-4">
                  <div>
                    <div className="text-xs font-mono text-[var(--color-surface-raised)] uppercase flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isBangla ? 'ক্যাডাস্ট্রাল ঝুঁকি প্রোফাইল' : 'Zone Cadastral Dossier'}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">
                      {isBangla ? selectedZone.nameBn : selectedZone.name}
                    </h3>
                    <div className="text-xs text-[var(--color-text-secondary)] font-mono mt-0.5">
                      {isBangla ? selectedZone.subRegistryBn : selectedZone.subRegistry}
                    </div>
                  </div>

                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1.5 rounded border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Score & Risk Level Banner */}
                <div className="p-4 rounded border border-[var(--color-border-subtle)] bg-[var(--color-surface-strong)] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-[var(--color-text-secondary)] block">
                      {isBangla ? 'সামগ্রিক ঝুঁকি মূল্যায়ন' : 'Composite Risk Assessment'}
                    </span>
                    <span
                      className="text-xl font-bold font-mono"
                      style={{ color: getRiskColor(selectedZone.riskLevel) }}
                    >
                      {selectedZone.riskLevel} TIER ({selectedZone.riskScore} / 100)
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono text-[var(--color-text-secondary)] block">
                      {isBangla ? 'সুরক্ষিত দাগ' : 'Active Locks'}
                    </span>
                    <span className="text-xl font-bold font-mono text-amber-500 tabular-nums">
                      {selectedZone.activeLocksCount} Dags
                    </span>
                  </div>
                </div>

                {/* Hotspot Mouzas */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)]">
                    {isBangla ? 'সর্বাধিক ঝুঁকিপূর্ণ মৌজাসমূহ' : 'Vulnerable Mouzas & Cadastral Clusters'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(isBangla ? selectedZone.hotspotMouzasBn : selectedZone.hotspotMouzas).map(
                      (mouza, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 text-xs font-mono rounded bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)]"
                        >
                          {mouza}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Sample Disputed Dags in this Zone */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)]">
                      {isBangla ? 'চিহ্নিত বিতর্কিত দাগের নমুনা' : 'Flagged Disputed Plots in this Sector'}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--color-text-secondary)]">
                      {selectedZone.sampleDags.length} {isBangla ? 'টি দাগ প্রদর্শিত' : 'sample dags'}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {selectedZone.sampleDags.map((dag, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)]/50 space-y-1.5 text-xs font-mono"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[var(--color-text-primary)]">
                            {dag.dagNo} · {dag.mouza}
                          </span>
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: `${getRiskColor(dag.severity)}20`,
                              color: getRiskColor(dag.severity),
                            }}
                          >
                            {dag.status}
                          </span>
                        </div>

                        <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                          {isBangla ? dag.issueBn : dag.issue}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-[var(--color-text-tertiary)] pt-1 border-t border-[var(--color-border-subtle)]">
                          <span>Khatian: {dag.khatianNo}</span>
                          <span>Detected: {dag.detectedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Feedback Alert */}
                {auditSuccessMsg && (
                  <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{auditSuccessMsg}</span>
                  </div>
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center gap-3">
                <button
                  onClick={handleTriggerAudit}
                  disabled={isAuditing}
                  className="flex-1 py-2.5 text-xs font-mono font-semibold rounded bg-[var(--color-surface-raised)] text-white hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                  <span>
                    {isAuditing
                      ? isBangla
                        ? 'অডিট চলছে...'
                        : 'Running Cryptographic Verification...'
                      : isBangla
                      ? 'ক্রিপ্টোগ্রাফিক সফট-লক যাচাই চালান'
                      : 'Run Cryptographic Soft-Lock Check'}
                  </span>
                </button>

                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2.5 text-xs font-mono rounded border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] hover:bg-white/5 cursor-pointer"
                >
                  {isBangla ? 'বন্ধ করুন' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
