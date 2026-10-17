/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Probaho — Temporal Ownership Graph & Dhaka Cadastral GIS Studio
 * 
 * High-fidelity interactive studio combining:
 * 1. Dhaka Metropolitan D3.js Vector Cadastral GIS Map
 * 2. 86-Year Temporal Ownership DAG (CS 1940 -> SA 1962 -> RS 1988 -> BS 2021 -> 2026)
 * 3. Interactive Era Timeline Scrubber with Auto-Play
 * 4. Bifurcated Fraud Collision Branch & 72h Concurrency Soft-Lock Inspector
 * 5. Mathematical Area Conservation Auditor (Δ Decimals Validation)
 * 6. Authentic Bangladesh Sub-Registry / AC Land Folio Dossier
 */

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GitBranch,
  Layers,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  FileText,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Compass,
  ArrowRight,
  Split,
  MapPin,
  Scale,
  FileCheck2,
  Download,
  Info,
  X,
  ExternalLink,
  ChevronRight,
  Hash,
  Activity,
  Printer,
  Share2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { DhakaD3CadastralMap } from './DhakaD3CadastralMap';
import {
  ALL_TEMPORAL_PARCELS,
  TemporalParcelRecord,
  TemporalGraphNode,
  TemporalGraphEdge,
  PARCEL_DHANMONDI_1042,
} from '../data/temporalGraphData';

interface TemporalOwnershipGraphStudioProps {
  onClose?: () => void;
  initialParcelId?: string;
  defaultViewMode?: 'split' | 'graph' | 'map';
  cities?: { id: string; cityName: string; [key: string]: any }[];
  currentCityIndex?: number;
  onCityChange?: (idx: number) => void;
}

export const TemporalOwnershipGraphStudio: React.FC<TemporalOwnershipGraphStudioProps> = ({
  onClose,
  initialParcelId = 'parcel-dhanmondi-1042',
  defaultViewMode = 'split',
  cities,
  currentCityIndex = 0,
  onCityChange,
}) => {
  const { isBangla } = useLanguage();
  const { isDay } = useTheme();

  // Selected Parcel
  const [selectedParcelId, setSelectedParcelId] = useState<string>(initialParcelId);
  const activeParcel: TemporalParcelRecord = useMemo(() => {
    return (
      ALL_TEMPORAL_PARCELS.find((p) => p.id === selectedParcelId) ||
      PARCEL_DHANMONDI_1042
    );
  }, [selectedParcelId]);

  // View Mode: 'split' (Map + Graph), 'graph' (Full DAG), 'map' (Full GIS Map)
  const [viewMode, setViewMode] = useState<'split' | 'graph' | 'map'>(defaultViewMode);

  // Selected Node in Graph
  const [selectedNodeId, setSelectedNodeId] = useState<string>(() => {
    const flagged = activeParcel.nodes.find((n) => n.isFlagged);
    return flagged ? flagged.id : activeParcel.nodes[activeParcel.nodes.length - 1]?.id || '';
  });

  // Whenever parcel changes, reset selected node
  useEffect(() => {
    const flagged = activeParcel.nodes.find((n) => n.isFlagged);
    setSelectedNodeId(flagged ? flagged.id : activeParcel.nodes[activeParcel.nodes.length - 1]?.id || '');
  }, [selectedParcelId, activeParcel]);

  const activeNode = useMemo(() => {
    return activeParcel.nodes.find((n) => n.id === selectedNodeId) || activeParcel.nodes[0];
  }, [activeParcel, selectedNodeId]);

  // Timeline Scrubber State (1940 to 2026)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);
  const [isAnimationFlowActive, setIsAnimationFlowActive] = useState<boolean>(true);

  // Modals & Drawers (Default drawer closed so split view gives 50/50 full breathing room to DAG)
  const [isFolioDrawerOpen, setIsFolioDrawerOpen] = useState<boolean>(false);
  const [isAreaAuditorOpen, setIsAreaAuditorOpen] = useState<boolean>(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState<boolean>(false);

  // SVG Pan & Zoom Transform State for DAG Canvas
  const [svgZoom, setSvgZoom] = useState<number>(0.72);
  const [svgPan, setSvgPan] = useState<{ x: number; y: number }>({ x: 25, y: 25 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Auto-Play Timeline Scrubber Loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlayingTimeline) {
      interval = setInterval(() => {
        setCurrentYear((prev) => {
          if (prev >= 2026) {
            setIsPlayingTimeline(false);
            return 2026;
          }
          // Jump to next logical survey epoch
          if (prev < 1962) return 1962;
          if (prev < 1974) return 1974;
          if (prev < 1988) return 1988;
          if (prev < 2005) return 2005;
          if (prev < 2021) return 2021;
          return 2026;
        });
      }, 1400);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingTimeline]);

  // Epoch Marks for Scrubber
  const EPOCHS = useMemo(
    () => [
      { year: 1940, label: 'CS 1940', labelBn: 'সিএস ১৯৪০', desc: isBangla ? 'ক্যাডাস্ট্রাল জরিপ' : 'Cadastral Survey' },
      { year: 1962, label: 'SA 1962', labelBn: 'এসএ ১৯৬২', desc: isBangla ? 'রাষ্ট্রীয় অধিগ্রহণ' : 'State Acquisition' },
      { year: 1974, label: 'Warishan', labelBn: 'বণ্টন ১৯৭৪', desc: isBangla ? 'ফারায়েজ বণ্টন' : 'Inheritance Decree' },
      { year: 1988, label: 'RS 1988', labelBn: 'আরএস ১৯৮৮', desc: isBangla ? 'রিভিশনাল জরিপ' : 'Revisional Survey' },
      { year: 2005, label: 'Mutation', labelBn: 'নামজারি ২০০৫', desc: isBangla ? 'নামজারি ও ডি.সি.আর' : 'AC Land Namjari' },
      { year: 2021, label: 'BS 2021', labelBn: 'বিএস ২০২১', desc: isBangla ? 'সিটি জরিপ' : 'City Survey Jarip' },
      { year: 2026, label: '2026 Live', labelBn: 'বর্তমান ২০২৬', desc: isBangla ? 'সফট লক ও রেজিস্ট্রি' : 'Concurrency Lock' },
    ],
    [isBangla]
  );

  // Filter nodes visible up to current timeline year
  const visibleNodes = useMemo(() => {
    return activeParcel.nodes.map((n) => ({
      ...n,
      isActiveInTimeline: n.year <= currentYear,
    }));
  }, [activeParcel, currentYear]);

  // Graph Pan / Zoom Handlers
  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    setIsDraggingCanvas(true);
    dragStartRef.current = { x: e.clientX - svgPan.x, y: e.clientY - svgPan.y };
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (!isDraggingCanvas) return;
    setSvgPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUpCanvas = () => {
    setIsDraggingCanvas(false);
  };

  const handleResetGraphView = () => {
    setSvgZoom(0.92);
    setSvgPan({ x: 30, y: 35 });
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[var(--color-surface-base)] text-[var(--color-text-primary)] overflow-hidden font-sans select-none">
      {/* 
        ======================================================================
        UNIFIED STUDIO HEADER TOOLBAR (Single Sleek Top Bar, h-[52px])
        ======================================================================
      */}
      <header className="relative z-30 h-[52px] px-3 bg-[var(--color-surface-strong)]/95 border-b border-[var(--color-border-subtle)] backdrop-blur-md flex items-center justify-between shrink-0 gap-2 font-mono overflow-hidden">
        {/* Left: Probaho Studio Branding + City Selector */}
        <div className="flex items-center gap-2 min-w-0 shrink">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="p-1 rounded-[4px] bg-[var(--color-surface-raised)]/15 border border-[var(--color-surface-raised)]/30 text-[var(--color-surface-raised)]">
              <GitBranch className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold tracking-wider text-[var(--color-surface-raised)] whitespace-nowrap">
              Probaho STUDIO
            </span>
            <span className="text-[var(--color-text-tertiary)] hidden sm:inline">|</span>
            <span className="text-xs text-[var(--color-text-primary)] font-semibold hidden xl:inline whitespace-nowrap">
              {isBangla ? 'ক্যাডাস্ট্রাল ও মালিকানা গ্রাফ' : 'Cadastral & Lineage'}
            </span>
          </div>

          {/* City Switcher Pills */}
          {cities && cities.length > 0 && onCityChange && (
            <div className="hidden sm:flex items-center gap-1 glass-pill p-0.5 rounded-[4px] shrink-0">
              {cities.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => onCityChange(idx)}
                  className={`px-2 py-0.5 text-[10px] rounded-[3px] transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                    idx === currentCityIndex
                      ? 'bg-[var(--color-surface-raised)] text-white font-bold shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10'
                  }`}
                >
                  <span>{m.cityName}</span>
                  {m.id === 'dhaka-metro' && (
                    <span className={`text-[8px] px-1 py-0.1 rounded font-bold ${idx === currentCityIndex ? 'bg-white/25 text-white' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      D3
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Middle: Auditing Parcel & Real-time Telemetry Pill */}
        <div className="flex items-center gap-2 min-w-0 shrink-0">
          <div className="relative flex items-center gap-1">
            <select
              value={selectedParcelId}
              onChange={(e) => setSelectedParcelId(e.target.value)}
              className="px-2 py-1 text-xs font-mono rounded-[4px] bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] focus:border-[var(--color-surface-raised)] focus:outline-none cursor-pointer font-semibold max-w-[170px] sm:max-w-[210px] truncate"
            >
              {ALL_TEMPORAL_PARCELS.map((p) => (
                <option key={p.id} value={p.id}>
                  {isBangla ? p.titleBn : p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Integrated Soft-lock & Dispute Pill */}
          {activeParcel.activeLockId ? (
            <button
              onClick={() => setIsFolioDrawerOpen(true)}
              className="px-2 py-0.5 text-[10px] rounded bg-red-500/20 text-red-500 border border-red-500/40 font-bold flex items-center gap-1 cursor-pointer hover:bg-red-500/30 transition-colors whitespace-nowrap shrink-0"
              title="Click to inspect 72h Concurrency Soft-lock & Double-Sale dossier"
            >
              <Lock className="w-3 h-3 animate-pulse" />
              <span className="hidden md:inline">72h Soft-Lock</span>
              <span className="font-mono">#{activeParcel.activeLockId}</span>
              <span className="text-red-400 hidden sm:inline">· {activeParcel.riskScore}% Risk</span>
            </button>
          ) : (
            <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 font-bold flex items-center gap-1 whitespace-nowrap shrink-0">
              <ShieldCheck className="w-3 h-3" />
              <span>Clean</span>
            </span>
          )}
        </div>

        {/* Right: View Mode Toggle & Primary Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* View Mode Switcher */}
          <div className="flex items-center p-0.5 rounded-[4px] bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)] text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2 py-0.5 rounded-[3px] transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                viewMode === 'split'
                  ? 'bg-[var(--color-surface-raised)] text-white font-bold shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
              title="Split View (D3 Cadastre + Temporal DAG)"
            >
              <Split className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{isBangla ? 'দ্বৈত' : 'Split'}</span>
            </button>

            <button
              onClick={() => setViewMode('graph')}
              className={`px-2 py-0.5 rounded-[3px] transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                viewMode === 'graph'
                  ? 'bg-[var(--color-surface-raised)] text-white font-bold shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
              title="Full Temporal DAG Graph"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{isBangla ? 'গ্রাফ' : 'Graph'}</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`px-2 py-0.5 rounded-[3px] transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                viewMode === 'map'
                  ? 'bg-[var(--color-surface-raised)] text-white font-bold shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
              title="Full Dhaka GIS Map"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{isBangla ? 'ম্যাপ' : 'Map'}</span>
            </button>
          </div>

          {/* Area Conservation Trigger */}
          <button
            onClick={() => setIsAreaAuditorOpen(!isAreaAuditorOpen)}
            className={`px-2 py-0.5 text-xs rounded-[4px] border transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              isAreaAuditorOpen
                ? 'bg-amber-500/20 text-amber-500 border-amber-500/40 font-bold'
                : 'border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-base)]'
            }`}
            title="Area Conservation Ledger"
          >
            <Scale className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden 2xl:inline">{isBangla ? 'অডিট' : 'Area'}</span>
            <span className="text-[9.5px] bg-emerald-500/20 text-emerald-400 px-1 rounded font-bold">
              Δ0.00
            </span>
          </button>

          {/* Folio Dossier Slide-Over Trigger */}
          <button
            onClick={() => setIsFolioDrawerOpen(!isFolioDrawerOpen)}
            className={`px-2 py-0.5 text-xs rounded-[4px] border transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              isFolioDrawerOpen
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold'
                : 'border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-base)]'
            }`}
            title="Toggle Cadastral Folio Dossier"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-[var(--color-surface-raised)]" />
            <span className="hidden lg:inline">{isBangla ? 'দলিল ও পরচা' : 'Dossier'}</span>
            {activeNode.isFlagged && (
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>

          {/* Export Title Dossier Certificate */}
          <button
            onClick={() => setIsCertificateModalOpen(true)}
            className="px-2 py-0.5 text-xs rounded-[4px] bg-[var(--color-surface-raised)] text-white font-semibold hover:brightness-110 transition-all flex items-center gap-1 shadow-sm cursor-pointer whitespace-nowrap"
            title="Download Verified Title Search Dossier"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{isBangla ? 'সনদ' : 'Export'}</span>
          </button>

          {/* Close Studio Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-[4px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-colors cursor-pointer ml-0.5"
              aria-label="Close Studio"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* 
        ======================================================================
        CENTRAL WORKSPACE: DUAL VIEW (D3 VECTOR MAP + TEMPORAL OWNERSHIP DAG)
        ======================================================================
      */}
      <div className="relative flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* 
          --------------------------------------------------------------------
          PANE 1: DHAKA D3 VECTOR CADASTRAL GIS MAP (Left Pane in Split View)
          --------------------------------------------------------------------
        */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div
            className={`relative overflow-hidden ${
              viewMode === 'split' ? 'w-full lg:w-1/2 h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-[var(--color-border-subtle)]' : 'w-full h-full'
            }`}
          >
            <DhakaD3CadastralMap
              height="100%"
              initialSelectedPlotId="dag-1042-dhanmondi"
              showInspectorPanel={false}
              onPlotSelect={(plot) => {
                if (!plot) return;
                // Auto-sync with temporal parcels
                if (plot.properties.dagNo === '1042') {
                  setSelectedParcelId('parcel-dhanmondi-1042');
                } else if (plot.properties.dagNo === '218') {
                  setSelectedParcelId('parcel-mirpur-218');
                } else if (plot.properties.dagNo === '450') {
                  setSelectedParcelId('parcel-gulshan-450');
                }
              }}
            />
          </div>
        )}

        {/* 
          --------------------------------------------------------------------
          PANE 2: TEMPORAL OWNERSHIP DAG CANVAS (Right Pane in Split View)
          --------------------------------------------------------------------
        */}
        {(viewMode === 'split' || viewMode === 'graph') && (
          <div
            className={`relative flex-1 h-full overflow-hidden flex flex-col bg-[#070b11] ${
              viewMode === 'split' ? 'w-full lg:w-1/2' : 'w-full'
            }`}
          >
            {/* Canvas Control Dock (Top Right) */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 glass-panel p-1 rounded-[6px] border border-white/10 bg-black/70 backdrop-blur-md text-xs font-mono text-white/80">
              <button
                onClick={() => setIsAnimationFlowActive(!isAnimationFlowActive)}
                className={`px-2 py-1 rounded-[3px] transition-colors cursor-pointer flex items-center gap-1 ${
                  isAnimationFlowActive ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-white/60 hover:text-white'
                }`}
                title="Toggle Live Lineage Pulse Streams"
              >
                <Activity className="w-3 h-3" />
                <span className="text-[10px]">{isBangla ? 'প্রবাহ অ্যানিমেশন' : 'Energy Stream'}</span>
              </button>

              <div className="h-4 w-px bg-white/20" />

              <button
                onClick={() => setSvgZoom((z) => Math.min(2.0, z + 0.15))}
                className="p-1 hover:text-white hover:bg-white/10 rounded-[3px] transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSvgZoom((z) => Math.max(0.4, z - 0.15))}
                className="p-1 hover:text-white hover:bg-white/10 rounded-[3px] transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetGraphView}
                className="p-1 hover:text-white hover:bg-white/10 rounded-[3px] transition-colors cursor-pointer"
                title="Reset Graph Canvas"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Interactive SVG DAG Network */}
            <div
              className="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
              onMouseDown={handleMouseDownCanvas}
              onMouseMove={handleMouseMoveCanvas}
              onMouseUp={handleMouseUpCanvas}
              onMouseLeave={handleMouseUpCanvas}
            >
              {/* Background Cartographic Coordinate Grid */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, #22c55e 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              <svg
                className="w-full h-full"
                viewBox="0 0 1400 380"
                style={{
                  transform: `translate(${svgPan.x}px, ${svgPan.y}px) scale(${svgZoom})`,
                  transformOrigin: '0 0',
                  transition: isDraggingCanvas ? 'none' : 'transform 0.1s ease-out',
                }}
              >
                <defs>
                  {/* Neon Glow Filters */}
                  <filter id="emerald-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="crimson-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="lock-pulse" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>

                  {/* Gradient Edges */}
                  <linearGradient id="legal-edge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.95" />
                  </linearGradient>

                  <linearGradient id="fraud-edge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                    <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="1" />
                  </linearGradient>

                  <linearGradient id="lock-edge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="1" />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity="1" />
                  </linearGradient>
                </defs>

                {/* 
                  1. VERTICAL EPOCH SWIMLANES & REFERENCE GUIDES
                */}
                <g className="epoch-swimlanes opacity-35 pointer-events-none">
                  {[
                    { x: 60, title: 'CS 1940', titleBn: 'সিএস ১৯৪০' },
                    { x: 210, title: 'SA 1962', titleBn: 'এসএ ১৯৬২' },
                    { x: 360, title: 'WARISHAN 1974', titleBn: 'বণ্টন ১৯৭৪' },
                    { x: 510, title: 'RS 1988', titleBn: 'আরএস ১৯৮৮' },
                    { x: 660, title: 'DEED 2002', titleBn: 'দলিল ২০০২' },
                    { x: 800, title: 'NAMJARI 2005', titleBn: 'নামজারি ২০০৫' },
                    { x: 940, title: 'BS 2021', titleBn: 'বিএস ২০২১' },
                    { x: 1090, title: 'CONVEYANCE 2026', titleBn: 'হস্তান্তর ২০২৬' },
                    { x: 1240, title: 'SOFT-LOCK 2026', titleBn: 'সফট লক ২০২৬' },
                  ].map((epoch, idx) => (
                    <g key={idx}>
                      <line
                        x1={epoch.x}
                        y1={20}
                        x2={epoch.x}
                        y2={350}
                        stroke="rgba(255, 255, 255, 0.12)"
                        strokeDasharray="4 6"
                        strokeWidth="1"
                      />
                      <text
                        x={epoch.x}
                        y={28}
                        textAnchor="middle"
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                        fill="rgba(255, 255, 255, 0.5)"
                      >
                        {isBangla ? epoch.titleBn : epoch.title}
                      </text>
                    </g>
                  ))}
                </g>

                {/* 
                  2. GRAPH CONNECTION EDGES (BEZIER CURVES & ENERGY PARTICLES)
                */}
                <g className="graph-edges-layer">
                  {activeParcel.edges.map((edge) => {
                    const sourceNode = activeParcel.nodes.find((n) => n.id === edge.source);
                    const targetNode = activeParcel.nodes.find((n) => n.id === edge.target);
                    if (!sourceNode || !targetNode) return null;

                    const isVisibleInScrubber = sourceNode.year <= currentYear && targetNode.year <= currentYear;
                    const isDisputed = edge.isDisputed;
                    const isLock = edge.type === 'CONCURRENCY_HALT';

                    // Smooth S-Curve Bezier Path
                    const dx = targetNode.x - sourceNode.x;
                    const cp1x = sourceNode.x + dx * 0.5;
                    const cp1y = sourceNode.y;
                    const cp2x = sourceNode.x + dx * 0.5;
                    const cp2y = targetNode.y;
                    const pathD = `M ${sourceNode.x} ${sourceNode.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${targetNode.x} ${targetNode.y}`;

                    let strokeColor = 'url(#legal-edge-grad)';
                    let strokeWidth = 2.4;
                    let dashArray = undefined;

                    if (isLock) {
                      strokeColor = 'url(#lock-edge-grad)';
                      strokeWidth = 3.2;
                      dashArray = '5 5';
                    } else if (isDisputed) {
                      strokeColor = 'url(#fraud-edge-grad)';
                      strokeWidth = 2.8;
                      dashArray = '4 4';
                    } else if (edge.type === 'INHERITANCE_BRANCH') {
                      strokeColor = '#38bdf8';
                      strokeWidth = 2.0;
                      dashArray = '3 3';
                    }

                    return (
                      <g key={edge.id} opacity={isVisibleInScrubber ? 1 : 0.18}>
                        {/* Edge Path */}
                        <path
                          d={pathD}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                          strokeDasharray={dashArray}
                          filter={isDisputed ? 'url(#crimson-glow)' : undefined}
                          className="transition-opacity duration-300"
                        />

                        {/* Edge Label on Midpoint */}
                        <g transform={`translate(${(sourceNode.x + targetNode.x) / 2}, ${(sourceNode.y + targetNode.y) / 2 - 8})`}>
                          <rect
                            x="-50"
                            y="-9"
                            width="100"
                            height="16"
                            rx="3"
                            fill="#0d141e"
                            stroke={isDisputed ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.15)'}
                            strokeWidth="0.8"
                          />
                          <text
                            x="0"
                            y="3"
                            textAnchor="middle"
                            fontSize="7.5"
                            fontFamily="monospace"
                            fontWeight="bold"
                            fill={isDisputed ? '#ef4444' : '#ffffff'}
                          >
                            {isBangla ? edge.labelBn.slice(0, 18) : edge.label.slice(0, 20)}
                          </text>
                        </g>

                        {/* Traveling Energy Stream Pulse */}
                        {isAnimationFlowActive && isVisibleInScrubber && !isLock && (
                          <circle r={isDisputed ? 3.6 : 3.0} fill={isDisputed ? '#ef4444' : '#4ade80'}>
                            <animateMotion
                              path={pathD}
                              dur={isDisputed ? '1.8s' : '2.4s'}
                              repeatCount="indefinite"
                              keyPoints="0;1"
                              keyTimes="0;1"
                            />
                          </circle>
                        )}
                      </g>
                    );
                  })}
                </g>

                {/* 
                  3. GRAPH NODES (SURVEY, DEED, WARISHAN, MUTATION, FRAUD, LOCK)
                */}
                <g className="graph-nodes-layer">
                  {visibleNodes.map((node) => {
                    const isSelected = selectedNodeId === node.id;
                    const isFlagged = node.isFlagged;
                    const isLock = node.type === 'CONCURRENCY_LOCK';
                    const isTarget = node.isTargetPlot;
                    const isActiveInScrubber = node.isActiveInTimeline;

                    let nodeBorderColor = '#38bdf8';
                    let nodeFill = '#0a1320';
                    let radius = 24;

                    if (isLock) {
                      nodeBorderColor = '#ef4444';
                      nodeFill = '#22080a';
                      radius = 28;
                    } else if (isFlagged) {
                      nodeBorderColor = '#ef4444';
                      nodeFill = '#280c10';
                      radius = 26;
                    } else if (node.type === 'MUTATION_RECORD') {
                      nodeBorderColor = '#22c55e';
                      nodeFill = '#081a10';
                    } else if (node.type === 'SUB_KABALA_DEED') {
                      nodeBorderColor = '#a855f7';
                      nodeFill = '#170c24';
                    } else if (node.type === 'WARISHAN_PARTITION') {
                      nodeBorderColor = '#0284c7';
                      nodeFill = '#091c2c';
                    }

                    return (
                      <g
                        key={node.id}
                        transform={`translate(${node.x}, ${node.y})`}
                        onClick={() => {
                          setSelectedNodeId(node.id);
                          setIsFolioDrawerOpen(true);
                        }}
                        className="cursor-pointer transition-transform duration-200 hover:scale-108"
                        opacity={isActiveInScrubber ? 1 : 0.22}
                      >
                        {/* Target Halo Animation */}
                        {(isTarget || isFlagged) && (
                          <circle
                            cx="0"
                            cy="0"
                            r={radius + 10}
                            fill="none"
                            stroke={isFlagged ? '#ef4444' : '#22c55e'}
                            strokeWidth="1.6"
                            opacity="0.6"
                          >
                            <animate attributeName="r" values={`${radius + 6};${radius + 20};${radius + 6}`} dur="2.4s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.8;0;0.8" dur="2.4s" repeatCount="indefinite" />
                          </circle>
                        )}

                        {/* Node Outer Circle */}
                        <circle
                          cx="0"
                          cy="0"
                          r={radius}
                          fill={nodeFill}
                          stroke={isSelected ? '#ffffff' : nodeBorderColor}
                          strokeWidth={isSelected ? 3.0 : 2.0}
                          filter={isSelected ? 'url(#emerald-glow)' : isFlagged ? 'url(#crimson-glow)' : undefined}
                        />

                        {/* Central Type Indicator Icon/Badge */}
                        <circle cx="0" cy="-6" r="4.5" fill={nodeBorderColor} />

                        {/* Node Primary Tag */}
                        <text
                          x="0"
                          y="6"
                          textAnchor="middle"
                          fontSize="8.5"
                          fontFamily="monospace"
                          fontWeight="bold"
                          fill="#ffffff"
                          className="select-none pointer-events-none"
                        >
                          {isBangla ? node.labelBn.split(' ')[0] : node.label.split(' ')[0]}
                        </text>

                        {/* Year & Area Decimals */}
                        <text
                          x="0"
                          y="15"
                          textAnchor="middle"
                          fontSize="7"
                          fontFamily="monospace"
                          fill={nodeBorderColor}
                          className="select-none pointer-events-none font-semibold"
                        >
                          {node.year} · {node.areaDecimals}d
                        </text>

                        {/* Bottom Banner Tag */}
                        <g transform={`translate(0, ${radius + 14})`}>
                          <rect
                            x="-48"
                            y="-7"
                            width="96"
                            height="14"
                            rx="3"
                            fill="#0d1420"
                            stroke={isSelected ? '#ffffff' : 'rgba(255,255,255,0.2)'}
                            strokeWidth="0.8"
                          />
                          <text
                            x="0"
                            y="3"
                            textAnchor="middle"
                            fontSize="7.5"
                            fontFamily="monospace"
                            fill={isFlagged ? '#ef4444' : '#94a3b8'}
                            fontWeight="bold"
                          >
                            {isBangla ? node.subLabelBn.slice(0, 16) : node.subLabel.slice(0, 18)}
                          </text>
                        </g>

                        {/* Special Hazard Icon on Fraud Nodes */}
                        {isFlagged && (
                          <g transform="translate(18, -18)">
                            <circle cx="0" cy="0" r="7" fill="#ef4444" />
                            <text x="0" y="3" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#ffffff">
                              !
                            </text>
                          </g>
                        )}

                        {/* Special Padlock Icon on Concurrency Lock */}
                        {isLock && (
                          <g transform="translate(20, -20)">
                            <circle cx="0" cy="0" r="8" fill="#dc2626" />
                            <text x="0" y="3" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#ffffff">
                              🔒
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>

            {/* 
              ------------------------------------------------------------------
              BOTTOM ERA TIMELINE SCRUBBER (1940 TO 2026)
              ------------------------------------------------------------------
            */}
            <div className="relative z-20 px-3.5 py-2.5 bg-[#090e17]/95 border-t border-white/10 flex flex-col gap-1.5 font-mono text-xs text-white shrink-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {/* Play / Pause Auto-Scrubber Button */}
                  <button
                    onClick={() => {
                      if (currentYear >= 2026 && !isPlayingTimeline) {
                        setCurrentYear(1940);
                      }
                      setIsPlayingTimeline(!isPlayingTimeline);
                    }}
                    className="px-2.5 py-1 rounded-[4px] bg-[var(--color-surface-raised)] text-white hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                    title={isPlayingTimeline ? 'Pause Timeline' : 'Play Historical Lineage'}
                  >
                    {isPlayingTimeline ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span className="text-[10.5px] font-bold">
                      {isPlayingTimeline ? (isBangla ? 'স্থগিত' : 'Pause') : (isBangla ? 'প্লে' : 'Play 86y')}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentYear(1940);
                      setIsPlayingTimeline(false);
                    }}
                    className="p-1 rounded-[4px] hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                    title="Reset to 1940 (CS Survey)"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-1.5 text-[11px] bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    <span className="text-white/50 text-[10px]">
                      {isBangla ? 'কালপর্ব:' : 'Epoch:'}
                    </span>
                    <span className="font-bold text-[var(--color-surface-raised)]">{currentYear} AD</span>
                  </div>
                </div>

                <div className="text-[10.5px] text-white/50 hidden md:flex items-center gap-2">
                  <span>{isBangla ? 'নোড:' : 'Nodes:'} {activeParcel.nodes.length}</span>
                  <span>·</span>
                  <span className="text-emerald-400 font-semibold">
                    {isBangla ? 'ক্ষেত্রফল সংরক্ষণ: ১০০% অক্ষত' : 'Area Conservation: 100%'}
                  </span>
                </div>
              </div>

              {/* Scrubber Slider with Milestone Ticks */}
              <div className="relative w-full flex flex-col pt-0.5">
                <input
                  type="range"
                  min="1940"
                  max="2026"
                  step="1"
                  value={currentYear}
                  onChange={(e) => {
                    setCurrentYear(Number(e.target.value));
                    setIsPlayingTimeline(false);
                  }}
                  className="w-full accent-[var(--color-surface-raised)] cursor-pointer h-1.5 bg-white/20 rounded-lg appearance-none"
                />

                {/* Milestone Buttons (Clean pill row, no multiline wrapping collision!) */}
                <div className="flex justify-between items-center pt-1.5 gap-1 overflow-x-auto">
                  {EPOCHS.map((ep) => {
                    const isPassed = currentYear >= ep.year;
                    const isCurrent = currentYear === ep.year;
                    const isDisputed = ep.year === 2026 && activeParcel.riskScore > 70;
                    return (
                      <button
                        key={ep.year}
                        onClick={() => {
                          setCurrentYear(ep.year);
                          setIsPlayingTimeline(false);
                        }}
                        title={`${ep.label} — ${ep.desc}`}
                        className={`px-1.5 py-0.5 text-[9px] font-mono rounded transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0 ${
                          isCurrent
                            ? isDisputed
                              ? 'bg-red-500 text-white font-bold shadow-sm'
                              : 'bg-[var(--color-surface-raised)] text-white font-bold shadow-sm'
                            : isPassed
                            ? isDisputed
                              ? 'text-red-400 font-semibold'
                              : 'text-emerald-400 font-semibold hover:bg-emerald-500/10'
                            : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                        }`}
                      >
                        <span className={`w-1 h-1 rounded-full ${isPassed ? (isDisputed ? 'bg-red-400' : 'bg-emerald-400') : 'bg-white/30'}`} />
                        <span>{isBangla ? ep.labelBn : ep.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 
          --------------------------------------------------------------------
          SLIDE-OVER DRAWER: AUTHENTIC BANGLADESH LAND OFFICE FOLIO INSPECTOR
          --------------------------------------------------------------------
        */}
        <AnimatePresence>
          {isFolioDrawerOpen && activeNode && (
            <motion.aside
              initial={{ x: 420, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 420, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 right-0 bottom-0 w-full sm:w-[400px] border-l border-white/10 bg-[#080d15]/96 backdrop-blur-2xl flex flex-col overflow-y-auto shrink-0 z-40 font-mono text-xs shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="p-3 border-b border-white/10 flex items-center justify-between bg-black/40 sticky top-0 z-10 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-[var(--color-surface-raised)]" />
                  <div>
                    <div className="font-bold text-xs text-white">
                      {isBangla ? activeNode.labelBn : activeNode.label}
                    </div>
                    <div className="text-[10px] text-white/50">
                      {isBangla ? 'নথি যাচাই ও আইনি পর্যালোচনাকার' : 'Official Cadastral Folio Dossier'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      activeNode.isFlagged
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : activeNode.type === 'CONCURRENCY_LOCK'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}
                  >
                    {activeNode.status}
                  </div>

                  <button
                    onClick={() => setIsFolioDrawerOpen(false)}
                    className="p-1 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Close Dossier"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Folio Details Body */}
              <div className="p-4 space-y-4">
                {/* Government Seal & Cadastral Header */}
                <div className="p-3 rounded-[6px] bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)] text-center space-y-1">
                  <div className="text-[10px] text-[var(--color-text-secondary)] font-semibold tracking-wider">
                    {isBangla ? 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার' : "GOVERNMENT OF THE PEOPLE'S REPUBLIC OF BANGLADESH"}
                  </div>
                  <div className="text-xs font-bold text-[var(--color-text-primary)]">
                    {activeNode.type === 'SUB_KABALA_DEED'
                      ? isBangla
                        ? activeNode.deedParticulars?.subRegistryOfficeBn || 'সাব-রেজিস্ট্রি কার্যালয়'
                        : activeNode.deedParticulars?.subRegistryOffice || 'Sub-Registry Office'
                      : activeNode.type === 'MUTATION_RECORD'
                      ? isBangla
                        ? activeNode.mutationParticulars?.acLandOfficeBn || 'সহকারী কমিশনার (ভূমি) কার্যালয়'
                        : activeNode.mutationParticulars?.acLandOffice || 'AC Land Office'
                      : isBangla
                      ? 'ভূমি রেকর্ড ও জরিপ অধিদপ্তর (ডিএলআরএস)'
                      : 'Directorate of Land Records and Surveys (DLRS)'}
                  </div>
                </div>

                {/* Conflict / Fraud Warning Banner (If Node is Disputed) */}
                {activeNode.collisionParticulars && (
                  <div className="p-3 rounded-[6px] bg-red-500/10 border border-red-500/40 space-y-2">
                    <div className="flex items-center gap-1.5 text-red-500 font-bold text-xs">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{isBangla ? 'জরুরি: প্রতারণামূলক দ্বৈত বিক্রয় চিহ্নিত!' : 'CRITICAL: DUAL-SALE CONVEYANCE INTERCEPTED'}</span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                      {isBangla ? activeNode.collisionParticulars.disputeReasonBn : activeNode.collisionParticulars.disputeReason}
                    </p>
                    <div className="text-[10px] font-mono text-red-600 dark:text-red-400 bg-red-500/15 p-1.5 rounded">
                      <span className="font-bold">{isBangla ? 'আইনি ধারা:' : 'Statutory Reference:'}</span>{' '}
                      {activeNode.collisionParticulars.statuteCitation}
                    </div>
                  </div>
                )}

                {/* Sub-Kabala Deed Particulars Grid */}
                {activeNode.deedParticulars && (
                  <div className="space-y-2">
                    <div className="text-[10.5px] font-bold text-[var(--color-text-secondary)] uppercase">
                      {isBangla ? 'রেজিস্ট্রিকৃত সাফ-কবলা দলিলের বিবরণ' : 'Registered Sub-Kabala Deed Particulars'}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)]">
                        <div className="text-[10px] text-[var(--color-text-secondary)]">{isBangla ? 'দলিল নম্বর' : 'Deed No.'}</div>
                        <div className="font-bold text-[var(--color-text-primary)]">{activeNode.deedParticulars.deedNo}</div>
                      </div>
                      <div className="p-2 rounded bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)]">
                        <div className="text-[10px] text-[var(--color-text-secondary)]">{isBangla ? 'নিবন্ধন তারিখ' : 'Registration Date'}</div>
                        <div className="font-bold text-[var(--color-text-primary)]">{activeNode.deedParticulars.regDate}</div>
                      </div>
                      <div className="p-2 rounded bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)]">
                        <div className="text-[10px] text-[var(--color-text-secondary)]">{isBangla ? 'বালাম বই ও পৃষ্ঠা' : 'Balam Vol & Page'}</div>
                        <div className="font-bold text-[var(--color-text-primary)]">
                          {activeNode.deedParticulars.balamBookNo} · P.{activeNode.deedParticulars.pageRange}
                        </div>
                      </div>
                      <div className="p-2 rounded bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)]">
                        <div className="text-[10px] text-[var(--color-text-secondary)]">{isBangla ? 'বিক্রয় মূল্য' : 'Consideration'}</div>
                        <div className="font-bold text-[var(--color-surface-raised)]">
                          BDT {activeNode.deedParticulars.considerationBDT.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="p-2 rounded bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)] space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-secondary)]">{isBangla ? 'দাতা (বিক্রেতা)' : 'Executant'}:</span>
                        <span className="font-semibold text-[var(--color-text-primary)]">
                          {isBangla ? activeNode.deedParticulars.executantBn : activeNode.deedParticulars.executant}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-secondary)]">{isBangla ? 'গ্রহীতা (ক্রেতা)' : 'Claimant'}:</span>
                        <span className="font-semibold text-[var(--color-text-primary)]">
                          {isBangla ? activeNode.deedParticulars.claimantBn : activeNode.deedParticulars.claimant}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Namjari Mutation & DCR Particulars */}
                {activeNode.mutationParticulars && (
                  <div className="space-y-2">
                    <div className="text-[10.5px] font-bold text-[var(--color-text-secondary)] uppercase">
                      {isBangla ? 'নামজারি ও ডি.সি.আর বিবরণ' : 'Namjari Mutation & DCR Telemetry'}
                    </div>
                    <div className="p-2.5 rounded bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)] space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-secondary)]">{isBangla ? 'কেস নম্বর' : 'Case No'}:</span>
                        <span className="font-bold text-[var(--color-surface-raised)]">{activeNode.mutationParticulars.caseNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-secondary)]">DCR:</span>
                        <span className="font-semibold">{activeNode.mutationParticulars.dcrNo} ({activeNode.mutationParticulars.dcrDate})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-text-secondary)]">{isBangla ? 'হোল্ডিং ও খাজনা' : 'Holding & Tax'}:</span>
                        <span>{activeNode.mutationParticulars.holdingNo} · {activeNode.mutationParticulars.khajnaPaidYear}</span>
                      </div>
                      <div className="pt-1 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-400">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>e-Namjari QR Verified</span>
                        </span>
                        <span className="font-mono underline cursor-pointer">dlrs.gov.bd</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Warishan Succession / Faraiz Heirs Breakdown */}
                {activeNode.inheritanceParticulars && (
                  <div className="space-y-2">
                    <div className="text-[10.5px] font-bold text-[var(--color-text-secondary)] uppercase">
                      {isBangla ? 'ফারায়েজ মোতাবেক ওয়ারিশান বণ্টন' : 'Faraiz Succession Heir Breakdown'}
                    </div>
                    <div className="p-2.5 rounded bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)] space-y-2 text-[11px]">
                      <div className="text-[10px] text-[var(--color-text-secondary)]">
                        {isBangla ? 'মরহুমের নাম' : 'Deceased Owner'}:{' '}
                        <span className="font-bold text-[var(--color-text-primary)]">
                          {isBangla ? activeNode.inheritanceParticulars.deceasedOwnerBn : activeNode.inheritanceParticulars.deceasedOwner}
                        </span>{' '}
                        ({activeNode.inheritanceParticulars.deathYear})
                      </div>

                      <div className="space-y-1 pt-1 border-t border-[var(--color-border-subtle)]">
                        {activeNode.inheritanceParticulars.heirs.map((heir, idx) => (
                          <div key={idx} className="flex items-center justify-between p-1 rounded bg-[var(--color-surface-muted)]/50 text-[10.5px]">
                            <span>{isBangla ? heir.heirBn : heir.heir}</span>
                            <span className="font-bold text-[var(--color-surface-raised)]">
                              {heir.fractionPart} · {heir.allocatedDecimals} {isBangla ? 'শতক' : 'Dec'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Mathematical Area Conservation Ledger Card */}
                {activeNode.areaBalanceCheck && (
                  <div className="p-3 rounded-[6px] bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)] space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[var(--color-text-primary)]">
                      <span className="flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-amber-500" />
                        <span>{isBangla ? 'ক্ষেত্রফল সংরক্ষণ যাচাই' : 'Area Conservation Audit'}</span>
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                          activeNode.areaBalanceCheck.varianceDecimals === 0
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-500/15 text-red-500'
                        }`}
                      >
                        Δ {activeNode.areaBalanceCheck.varianceDecimals.toFixed(2)} Dec
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center">
                      <div className="p-1.5 rounded bg-[var(--color-surface-muted)]">
                        <div className="text-[var(--color-text-secondary)]">{isBangla ? 'মূল দাগ' : 'Parent'}</div>
                        <div className="font-bold">{activeNode.areaBalanceCheck.parentAreaDecimals}d</div>
                      </div>
                      <div className="p-1.5 rounded bg-[var(--color-surface-muted)]">
                        <div className="text-[var(--color-text-secondary)]">{isBangla ? 'হস্তান্তরিত' : 'Transferred'}</div>
                        <div className="font-bold">{activeNode.areaBalanceCheck.transferredDecimals}d</div>
                      </div>
                      <div className="p-1.5 rounded bg-[var(--color-surface-muted)]">
                        <div className="text-[var(--color-text-secondary)]">{isBangla ? 'অবশিষ্ট' : 'Retained'}</div>
                        <div className="font-bold">{activeNode.areaBalanceCheck.retainedDecimals}d</div>
                      </div>
                    </div>

                    <div className="text-[10.5px] text-[var(--color-text-secondary)] pt-1 border-t border-[var(--color-border-subtle)]">
                      {isBangla ? activeNode.areaBalanceCheck.verdictBn : activeNode.areaBalanceCheck.verdict}
                    </div>
                  </div>
                )}

                {/* Cryptographic Ledger Block Hash */}
                <div className="p-2.5 rounded-[4px] bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)] space-y-1 text-[10px]">
                  <div className="flex items-center justify-between text-[var(--color-text-secondary)]">
                    <span className="flex items-center gap-1">
                      <Hash className="w-3 h-3 text-[var(--color-surface-raised)]" />
                      <span>JomiChain Ed25519 Block:</span>
                    </span>
                    <span className="text-emerald-500 font-bold">100% INTACT</span>
                  </div>
                  <div className="font-mono text-[9px] text-[var(--color-text-secondary)] break-all bg-black/40 p-1.5 rounded">
                    {activeNode.ledgerHash}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* 
        ======================================================================
        MODAL: OFFICIAL TITLE SEARCH DOSSIER / CERTIFICATE (PRINT READY)
        ======================================================================
      */}
      <AnimatePresence>
        {isCertificateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-panel rounded-[8px] max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs border border-[var(--color-border-subtle)]"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between bg-[var(--color-surface-strong)]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[var(--color-surface-raised)]" />
                  <span className="font-bold text-sm text-[var(--color-text-primary)]">
                    {isBangla ? 'প্রবাহ জমি যাচাই ও ধারাবাহিক স্বত্ব অনুসন্ধান সনদ' : 'Probaho Certified Title Search Dossier'}
                  </span>
                </div>
                <button
                  onClick={() => setIsCertificateModalOpen(false)}
                  className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Printable Certificate Body */}
              <div className="p-6 space-y-6 overflow-y-auto bg-[var(--color-surface-base)]">
                {/* Formal Header */}
                <div className="text-center space-y-1.5 border-b border-[var(--color-border-subtle)] pb-4">
                  <div className="text-[11px] text-[var(--color-text-secondary)] uppercase tracking-wider">
                    {isBangla ? 'গণপ্রজাতন্ত্রী বাংলাদেশ · ভূমি প্রশাসন ও রেজিস্ট্রি অডিট' : "PEOPLE'S REPUBLIC OF BANGLADESH · LAND REGISTRY AUDIT"}
                  </div>
                  <div className="text-lg font-bold text-[var(--color-text-primary)]">
                    {isBangla ? 'ভূমি স্বত্ব ও ধারাবাহিক হস্তান্তরমূল অনুসন্ধান প্রত্যয়নপত্র' : 'CERTIFICATE OF CADASTRAL TITLE CONTINUITY'}
                  </div>
                  <div className="text-[10px] text-[var(--color-surface-raised)] font-bold">
                    PROBAHO CERTIFICATE NO: PRO-DHN-2026-794021 · JOMICHAIN ROOT VERIFIED
                  </div>
                </div>

                {/* Subject Parcel Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2.5 rounded bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)]">
                    <div className="text-[10px] text-[var(--color-text-secondary)]">{isBangla ? 'মৌজা ও জে.এল.' : 'Mouza & J.L.'}</div>
                    <div className="font-bold">{activeParcel.mouza} · JL {activeParcel.jlNo}</div>
                  </div>
                  <div className="p-2.5 rounded bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)]">
                    <div className="text-[10px] text-[var(--color-text-secondary)]">{isBangla ? 'বর্তমান দাগ নং' : 'Current Dag'}</div>
                    <div className="font-bold text-[var(--color-surface-raised)]">Dag #{activeParcel.dagNo}</div>
                  </div>
                  <div className="p-2.5 rounded bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)]">
                    <div className="text-[10px] text-[var(--color-text-secondary)]">{isBangla ? 'মোট আয়তন' : 'Plot Area'}</div>
                    <div className="font-bold">{activeParcel.totalCurrentDecimals} Dec ({activeParcel.currentKatha} Katha)</div>
                  </div>
                  <div className="p-2.5 rounded bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)]">
                    <div className="text-[10px] text-[var(--color-text-secondary)]">{isBangla ? 'ঝুঁকি স্কোর' : 'Risk Rating'}</div>
                    <div className="font-bold text-red-500">{activeParcel.riskScore}/100 ({activeParcel.status})</div>
                  </div>
                </div>

                {/* Chronological Deed & Survey Lineage Table */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[var(--color-text-primary)]">
                    {isBangla ? '১. কালানুক্রমিক বায়া দলিল ও খতিয়ান চেইন (১৯৪০ হতে ২০২৬)' : '1. Historical Baya Deed & Khatian Lineage Chain (1940 to 2026)'}
                  </div>
                  <div className="border border-[var(--color-border-subtle)] rounded-[4px] overflow-hidden">
                    <table className="w-full text-left text-[10.5px]">
                      <thead className="bg-[var(--color-surface-strong)] border-b border-[var(--color-border-subtle)] text-[var(--color-text-secondary)]">
                        <tr>
                          <th className="p-2">{isBangla ? 'সাল' : 'Year'}</th>
                          <th className="p-2">{isBangla ? 'স্তর / দলিল' : 'Survey/Deed'}</th>
                          <th className="p-2">{isBangla ? 'মালিক / গ্রহীতা' : 'Recorded Owner'}</th>
                          <th className="p-2">{isBangla ? 'শতক' : 'Area'}</th>
                          <th className="p-2">{isBangla ? 'স্ট্যাটাস' : 'Status'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-border-subtle)]">
                        {activeParcel.nodes.map((node) => (
                          <tr key={node.id} className={node.isFlagged ? 'bg-red-500/10' : ''}>
                            <td className="p-2 font-bold">{node.year}</td>
                            <td className="p-2">{isBangla ? node.labelBn : node.label}</td>
                            <td className="p-2">{isBangla ? node.ownerNameBn : node.ownerName}</td>
                            <td className="p-2">{node.areaDecimals} Dec</td>
                            <td className="p-2 font-bold">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[9.5px] ${
                                  node.isFlagged
                                    ? 'bg-red-500/20 text-red-500'
                                    : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                }`}
                              >
                                {node.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Audit Verdict Summary */}
                <div className="p-4 rounded-[6px] bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] space-y-2">
                  <div className="text-xs font-bold text-[var(--color-text-primary)]">
                    {isBangla ? '২. আইনি মতামত ও প্রবাহ সতর্কবার্তা' : '2. Legal Opinion & Fraud Shield Recommendation'}
                  </div>
                  <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                    {isBangla ? activeParcel.summaryBn : activeParcel.summary}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between bg-[var(--color-surface-strong)]">
                <span className="text-[10px] text-[var(--color-text-secondary)]">
                  Cryptographically hashed & timestamped on JomiChain Ledger.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 text-xs font-semibold rounded bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{isBangla ? 'প্রিন্ট করুন' : 'Print Certificate'}</span>
                  </button>
                  <button
                    onClick={() => setIsCertificateModalOpen(false)}
                    className="px-4 py-1.5 text-xs font-semibold rounded bg-[var(--color-surface-raised)] text-white hover:brightness-110 transition-all cursor-pointer"
                  >
                    {isBangla ? 'সম্পন্ন' : 'Done'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
