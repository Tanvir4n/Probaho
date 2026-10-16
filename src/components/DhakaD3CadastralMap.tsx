/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Probaho — D3.js Accurate Cadastral GIS Map of Dhaka Metropolitan Area
 * 
 * Styled after authentic cartographic vector cityscape posters:
 * - Day Poster Mode (White land silhouette, charcoal highways, cyan waterways)
 * - Night Poster Mode (Obsidian black land silhouette, crisp white highways, midnight blue waterways)
 * - Complete metropolitan administrative boundary silhouette
 * - High-density highway, arterial avenue, and neighborhood street grid networks
 * - Clearly denotes the project areas:
 *   * PRIMARY CORE: Dhanmondi Mouza (J.L. 245) · Dag 1042 (Flagship Double-Sale Dispute & Soft Lock)
 *   * SECONDARY NODES: Mirpur (J.L. 102 · Dag 218), Gulshan (J.L. 182 · Dag 450), Lalbagh (J.L. 310 · CS 1910), Tejgaon, Motijheel
 */

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Search,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  MapPin,
  ExternalLink,
  Eye,
  EyeOff,
  Crosshair,
  Compass,
  FileText,
  Info,
  Maximize2,
  X,
  Sun,
  Moon,
  Target,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import {
  DHAKA_THANAS_GEOJSON,
  DHAKA_WATERWAYS_GEOJSON,
  DHAKA_CADASTRAL_PLOTS,
  DHAKA_METRO_BOUNDARY_GEOJSON,
  DHAKA_HIGHWAYS_GEOJSON,
  DHAKA_STREET_NETWORK_GEOJSON,
  DHAKA_PROJECT_AREAS,
  DhakaProjectZone,
  DhakaThanaFeature,
  DhakaCadastralPlotFeature,
  DhakaWaterwayFeature,
  DHAKA_MAP_METRICS,
} from '../data/dhakaGeoData';

interface DhakaD3CadastralMapProps {
  className?: string;
  initialSelectedPlotId?: string;
  onPlotSelect?: (plot: DhakaCadastralPlotFeature | null) => void;
  height?: string | number;
  showInspectorPanel?: boolean;
}

export const DhakaD3CadastralMap: React.FC<DhakaD3CadastralMapProps> = ({
  className = '',
  initialSelectedPlotId = 'dag-1042-dhanmondi',
  onPlotSelect,
  height = '100%',
  showInspectorPanel = true,
}) => {
  const { isDay: globalIsDay } = useTheme();
  const { isBangla } = useLanguage();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Poster Style Override: 'auto' | 'day' | 'night'
  const [posterStyle, setPosterStyle] = useState<'auto' | 'day' | 'night'>('auto');
  const isPosterDay = posterStyle === 'auto' ? globalIsDay : posterStyle === 'day';

  // Active Map Dimensions
  const [dimensions, setDimensions] = useState({ width: 900, height: 700 });

  // Layer Toggles
  const [layers, setLayers] = useState({
    boundary: true,
    highways: true,
    streets: true,
    waterways: true,
    thanas: true,
    cadastralPlots: true,
    projectZones: true,
    posterHeader: true,
    riskHeatmap: true,
    labels: true,
    gridMesh: true,
  });

  // Selected Feature State
  const [selectedPlot, setSelectedPlot] = useState<DhakaCadastralPlotFeature | null>(
    () => DHAKA_CADASTRAL_PLOTS.find((p) => p.id === initialSelectedPlotId) || null
  );
  const [selectedProjectArea, setSelectedProjectArea] = useState<DhakaProjectZone | null>(
    () => DHAKA_PROJECT_AREAS[0]
  );
  const [selectedThana, setSelectedThana] = useState<DhakaThanaFeature | null>(null);

  const [hoveredFeature, setHoveredFeature] = useState<{
    title: string;
    sub: string;
    risk?: number;
    status?: string;
    coords: [number, number];
  } | null>(null);

  // Mouse coordinate tracker
  const [cursorGeoCoords, setCursorGeoCoords] = useState<[number, number] | null>(null);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomTransformState, setZoomTransformState] = useState<d3.ZoomTransform>(d3.zoomIdentity);

  // Zoom behavior reference for programmatic zooming
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Handle Resize
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Compute Projection based on current container size
  // Dhaka Center: 90.4120° E, 23.7850° N
  const projection = useMemo(() => {
    const scale = Math.min(dimensions.width, dimensions.height) * 190;
    return d3
      .geoMercator()
      .center([90.4120, 23.7850])
      .scale(scale)
      .translate([dimensions.width / 2, dimensions.height / 2]);
  }, [dimensions.width, dimensions.height]);

  const pathGenerator = useMemo(() => {
    return d3.geoPath().projection(projection);
  }, [projection]);

  // Setup D3 Zoom on the SVG
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.6, 45]) // Allows zooming in deep to individual Cadastral Dag plots
      .on('zoom', (event) => {
        setZoomTransformState(event.transform);
        svg.select('g.map-root-layer').attr('transform', event.transform);
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);
  }, [dimensions.width, dimensions.height, projection]);

  // Zoom Button Handlers
  const handleZoomIn = useCallback(() => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(350)
      .call(zoomBehaviorRef.current.scaleBy, 1.45);
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(350)
      .call(zoomBehaviorRef.current.scaleBy, 0.68);
  }, []);

  const handleResetZoom = useCallback(() => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(600)
      .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    setSelectedPlot(null);
    setSelectedThana(null);
    onPlotSelect?.(null);
  }, [onPlotSelect]);

  // Zoom to a specific coordinate
  const zoomToCoords = useCallback(
    (lon: number, lat: number, scale = 4.5) => {
      if (!svgRef.current || !zoomBehaviorRef.current) return;
      const [x, y] = projection([lon, lat]) || [dimensions.width / 2, dimensions.height / 2];
      const transform = d3.zoomIdentity
        .translate(dimensions.width / 2 - x * scale, dimensions.height / 2 - y * scale)
        .scale(scale);

      d3.select(svgRef.current)
        .transition()
        .duration(700)
        .call(zoomBehaviorRef.current.transform, transform);
    },
    [projection, dimensions.width, dimensions.height]
  );

  // Focus Primary Project Area (Dhanmondi Mouza Dag 1042)
  const focusPrimaryProject = useCallback(() => {
    const primary = DHAKA_PROJECT_AREAS[0];
    setSelectedProjectArea(primary);
    const plot = DHAKA_CADASTRAL_PLOTS[0];
    setSelectedPlot(plot);
    onPlotSelect?.(plot);
    zoomToCoords(primary.center[0], primary.center[1], 8.5);
  }, [zoomToCoords, onPlotSelect]);

  // Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();

    // Check Project Areas
    const matchedProject = DHAKA_PROJECT_AREAS.find(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.nameBn.includes(query) ||
        p.targetPlot.toLowerCase().includes(query)
    );
    if (matchedProject) {
      setSelectedProjectArea(matchedProject);
      zoomToCoords(matchedProject.center[0], matchedProject.center[1], 7.0);
      return;
    }

    // Check Dag Plots
    const matchedPlot = DHAKA_CADASTRAL_PLOTS.find(
      (p) =>
        p.properties.dagNo.toLowerCase() === query ||
        p.properties.dagNo.includes(query) ||
        p.properties.mouza.toLowerCase().includes(query) ||
        p.properties.mouzaBn.includes(query)
    );
    if (matchedPlot) {
      setSelectedPlot(matchedPlot);
      onPlotSelect?.(matchedPlot);
      const centroid = d3.geoCentroid(matchedPlot as any);
      zoomToCoords(centroid[0], centroid[1], 12);
      return;
    }

    // Check Thanas
    const matchedThana = DHAKA_THANAS_GEOJSON.features.find(
      (t) =>
        t.properties.name.toLowerCase().includes(query) ||
        t.properties.nameBn.includes(query) ||
        t.properties.id.toLowerCase().includes(query)
    );
    if (matchedThana) {
      setSelectedThana(matchedThana);
      const [lon, lat] = matchedThana.properties.center;
      zoomToCoords(lon, lat, 4.5);
      return;
    }
  };

  // Mouse Move on SVG for geo-coordinates readout
  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const [clientX, clientY] = [event.clientX - rect.left, event.clientY - rect.top];

    // Invert zoom transform to find canvas coordinates
    const [canvasX, canvasY] = zoomTransformState.invert([clientX, clientY]);
    const geo = projection.invert?.([canvasX, canvasY]);
    if (geo) {
      setCursorGeoCoords([geo[0], geo[1]]);
    }
  };

  // Poster Color Palette
  const colors = useMemo(() => {
    if (isPosterDay) {
      // Day Poster Mode (matches Image 1: 2HB5YBW.jpg)
      return {
        background: '#ffffff',
        landFill: '#f8fafc',
        landStroke: '#94a3b8',
        highwayStroke: '#1e293b',
        highwayWidth: 2.2,
        streetStroke: 'rgba(100, 116, 139, 0.55)',
        streetWidth: 0.9,
        waterwayFill: '#bae6fd',
        waterwayStroke: '#0284c7',
        thanaFill: 'rgba(0, 0, 0, 0.015)',
        thanaStroke: 'rgba(100, 116, 139, 0.22)',
        thanaHover: 'rgba(22, 163, 74, 0.12)',
        thanaSelected: 'rgba(22, 163, 74, 0.22)',
        gridLine: 'rgba(15, 23, 42, 0.04)',
        posterTitle: '#0f172a',
        posterSub: '#64748b',
        posterAccent: '#16a34a',
        frameBorder: 'rgba(15, 23, 42, 0.15)',
        primaryProjectBeacon: '#16a34a',
        primaryProjectHalo: 'rgba(22, 163, 74, 0.25)',
      };
    } else {
      // Night Poster Mode (matches Image 2: 2HB5YBP.jpg)
      return {
        background: '#07090d',
        landFill: '#131620',
        landStroke: 'rgba(255, 255, 255, 0.35)',
        highwayStroke: '#ffffff',
        highwayWidth: 2.2,
        streetStroke: 'rgba(203, 213, 225, 0.55)',
        streetWidth: 0.9,
        waterwayFill: '#0e1828',
        waterwayStroke: '#1d3557',
        thanaFill: 'rgba(255, 255, 255, 0.02)',
        thanaStroke: 'rgba(255, 255, 255, 0.14)',
        thanaHover: 'rgba(34, 197, 94, 0.18)',
        thanaSelected: 'rgba(34, 197, 94, 0.3)',
        gridLine: 'rgba(255, 255, 255, 0.03)',
        posterTitle: '#ffffff',
        posterSub: '#94a3b8',
        posterAccent: '#22c55e',
        frameBorder: 'rgba(255, 255, 255, 0.18)',
        primaryProjectBeacon: '#22c55e',
        primaryProjectHalo: 'rgba(34, 197, 94, 0.3)',
      };
    }
  }, [isPosterDay]);

  // Coordinates for Primary Project Area (Dhanmondi Mouza Dag 1042)
  const primaryProjectCoords = useMemo(() => {
    return projection(DHAKA_PROJECT_AREAS[0].center) || [0, 0];
  }, [projection]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none flex flex-col font-sans transition-colors duration-200 ${className}`}
      style={{ height, backgroundColor: colors.background }}
    >
      {/* 
        ====================================================================
        TOP CONTROL DOCK: Search bar, Coordinates HUD, Style & Project Toggles
        ====================================================================
      */}
      <div className="relative z-20 p-2.5 sm:p-3.5 flex flex-wrap items-center justify-between gap-2.5 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-strong)]/90 backdrop-blur-md transition-colors">
        {/* Left: Quick Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-1.5 max-w-xs sm:max-w-sm w-full">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBangla ? 'দাগ নং, থানা বা প্রকল্প এলাকা খুঁজুন...' : 'Search Dag #, Thana, or Project Zone...'}
              className="w-full pl-8 pr-3 py-1.5 text-xs font-mono rounded-[3px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-surface-raised)] transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-2.5 py-1.5 text-xs font-mono font-bold text-white bg-[var(--color-surface-raised)] hover:brightness-110 rounded-[3px] transition-all cursor-pointer shrink-0 shadow-sm"
          >
            {isBangla ? 'খুঁজুন' : 'Search'}
          </button>
        </form>

        {/* Center: Live Spatial Coordinate Telemetry */}
        <div className="hidden lg:flex items-center gap-2.5 text-[11px] font-mono text-[var(--color-text-secondary)] glass-tile px-3 py-1 rounded-[3px] border border-[var(--color-border-subtle)]">
          <Crosshair className="w-3.5 h-3.5 text-[var(--color-surface-raised)] animate-pulse" />
          <span>
            {cursorGeoCoords
              ? `${cursorGeoCoords[1].toFixed(4)}° N, ${cursorGeoCoords[0].toFixed(4)}° E`
              : '23.7850° N, 90.4120° E'}
          </span>
          <span className="text-[var(--color-border-subtle)]">|</span>
          <span className="text-[var(--color-surface-raised)] font-semibold">
            {zoomTransformState.k.toFixed(1)}x {isBangla ? 'জুম' : 'Zoom'}
          </span>
        </div>

        {/* Right: Project Focus & Poster Mode Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* PRIMARY PROJECT CORE FOCUS BUTTON */}
          <button
            onClick={focusPrimaryProject}
            className="px-2.5 py-1 text-[11px] font-mono rounded-[3px] border border-emerald-500/50 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 hover:bg-emerald-500/25 transition-all cursor-pointer shadow-sm"
            title={isBangla ? 'প্রধান প্রকল্প এলাকা: ধানমন্ডি মৌজা দাগ ১০৪২ পরিদর্শন' : 'Focus Primary Project Area: Dhanmondi Dag 1042'}
          >
            <Target className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>{isBangla ? 'প্রকল্প এলাকা (ধানমন্ডি)' : 'Project Core (Dhanmondi)'}</span>
          </button>

          {/* Poster Style Switcher (Day Poster vs Night Poster) */}
          <div className="flex items-center glass-tile p-0.5 rounded-[3px] border border-[var(--color-border-subtle)] text-[10px] font-mono">
            <button
              onClick={() => setPosterStyle('day')}
              className={`p-1 px-1.5 rounded-[2px] transition-colors cursor-pointer flex items-center gap-1 ${
                isPosterDay ? 'bg-[var(--color-surface-raised)] text-white font-bold' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
              title="Day Poster (Image 1 style: White land, charcoal roads)"
            >
              <Sun className="w-3 h-3" />
              <span className="hidden sm:inline">Day</span>
            </button>
            <button
              onClick={() => setPosterStyle('night')}
              className={`p-1 px-1.5 rounded-[2px] transition-colors cursor-pointer flex items-center gap-1 ${
                !isPosterDay ? 'bg-[var(--color-surface-raised)] text-white font-bold' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
              title="Night Poster (Image 2 style: Black land, white roads)"
            >
              <Moon className="w-3 h-3" />
              <span className="hidden sm:inline">Night</span>
            </button>
          </div>

          {/* Layer Filter Menu */}
          <div className="relative group">
            <button
              className="p-1.5 rounded-[3px] border border-[var(--color-border-subtle)] glass-tile text-[var(--color-text-primary)] hover:border-[var(--color-surface-raised)] transition-all cursor-pointer flex items-center gap-1"
              title="Toggle Layers"
            >
              <Layers className="w-3.5 h-3.5 text-[var(--color-surface-raised)]" />
              <span className="text-[10px] font-mono uppercase hidden md:inline">{isBangla ? 'স্তর' : 'Layers'}</span>
            </button>

            {/* Dropdown menu */}
            <div className="absolute right-0 top-full mt-1 w-60 p-2.5 rounded-[4px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-strong)] shadow-2xl text-[11px] font-mono space-y-1.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
              <div className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-wider pb-1 border-b border-[var(--color-border-subtle)]">
                {isBangla ? 'ক্যাডাস্ট্রাল মানচিত্র স্তর' : 'Cartographic GIS Layers'}
              </div>

              {[
                { key: 'projectZones' as const, label: isBangla ? 'চিহ্নিত প্রকল্প এলাকা (ধানমন্ডি-মিরপুর)' : 'Denoted Project Areas' },
                { key: 'highways' as const, label: isBangla ? 'মহাসড়ক ও এক্সপ্রেসওয়ে (সাদা/কালো)' : 'Primary Highways' },
                { key: 'streets' as const, label: isBangla ? 'রাস্তা ও আবাসিক গ্রিড নেটওয়ার্ক' : 'Secondary Streets & Grids' },
                { key: 'boundary' as const, label: isBangla ? 'ঢাকা মেট্রো প্রশাসনিক সীমানা' : 'Dhaka Metro Boundary' },
                { key: 'waterways' as const, label: isBangla ? 'নদী ও লেক (বুড়িগঙ্গা-তুরাগ)' : 'Rivers & Waterways' },
                { key: 'cadastralPlots' as const, label: isBangla ? 'ক্যাডাস্ট্রাল দাগ প্লট (১০৪২)' : 'Cadastral Dag Plots' },
                { key: 'posterHeader' as const, label: isBangla ? 'ঢাকা পোস্টার শিরোনাম' : 'Dhaka Poster Title' },
              ].map((l) => (
                <button
                  key={l.key}
                  onClick={() => setLayers((prev) => ({ ...prev, [l.key]: !prev[l.key] }))}
                  className="w-full flex items-center justify-between p-1 rounded hover:bg-[var(--color-surface-muted)] transition-colors text-left"
                >
                  <span className="text-[var(--color-text-primary)]">{l.label}</span>
                  {layers[l.key] ? (
                    <Eye className="w-3.5 h-3.5 text-[var(--color-surface-raised)]" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 
        ====================================================================
        PROJECT ZONES SELECTOR DOCK: Quick jump to all project nodes
        ====================================================================
      */}
      <div className="relative z-10 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)]/70 text-[10px] font-mono no-scrollbar">
        <span className="text-[var(--color-text-tertiary)] uppercase font-semibold shrink-0 pr-1">
          {isBangla ? 'প্রকল্প নোডসমূহ:' : 'Project Nodes:'}
        </span>
        {DHAKA_PROJECT_AREAS.map((area, idx) => {
          const isSelected = selectedProjectArea?.id === area.id;
          const isPrimary = area.role === 'PRIMARY_CORE';

          return (
            <button
              key={area.id}
              onClick={() => {
                setSelectedProjectArea(area);
                if (isPrimary) {
                  const plot = DHAKA_CADASTRAL_PLOTS[0];
                  setSelectedPlot(plot);
                  onPlotSelect?.(plot);
                  zoomToCoords(area.center[0], area.center[1], 8.5);
                } else {
                  zoomToCoords(area.center[0], area.center[1], 6.5);
                }
              }}
              className={`px-2 py-0.5 rounded-[3px] border transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                isSelected
                  ? 'bg-[var(--color-surface-raised)] border-[var(--color-surface-raised)] text-white font-bold shadow-sm'
                  : isPrimary
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-semibold hover:bg-emerald-500/20'
                  : 'glass-tile border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {isPrimary && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
              <span>{isBangla ? area.nameBn : area.name}</span>
            </button>
          );
        })}
      </div>

      {/* 
        ====================================================================
        MAIN D3 SVG CARTOGRAPHIC MAP VIEWPORT
        ====================================================================
      */}
      <div className="flex-1 relative overflow-hidden flex" style={{ backgroundColor: colors.background }}>
        <svg
          ref={svgRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setCursorGeoCoords(null)}
        >
          <defs>
            {/* Filter for glowing risk alert markers */}
            <filter id="d3-pulse-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Pattern for background drafting grid */}
            <pattern id="d3-cad-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={colors.gridLine}
                strokeWidth="0.75"
              />
            </pattern>

            {/* Diagonal Hatching pattern for Flagged Dag 1042 / Dhanmondi Mouza */}
            <pattern id="d3-hatch-dispute" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(239, 68, 68, 0.55)" strokeWidth="1.5" />
            </pattern>
          </defs>

          {/* Background drafting mesh */}
          {layers.gridMesh && <rect width="100%" height="100%" fill="url(#d3-cad-grid)" />}

          {/* Poster Outer Framing Border (Architectural Vector Art style) */}
          <rect
            x="14"
            y="14"
            width={Math.max(10, dimensions.width - 28)}
            height={Math.max(10, dimensions.height - 28)}
            fill="none"
            stroke={colors.frameBorder}
            strokeWidth="1.2"
            className="pointer-events-none"
          />
          <rect
            x="18"
            y="18"
            width={Math.max(10, dimensions.width - 36)}
            height={Math.max(10, dimensions.height - 36)}
            fill="none"
            stroke={colors.frameBorder}
            strokeWidth="0.6"
            className="pointer-events-none opacity-60"
          />

          {/* Map Root Layer (transformed by d3.zoom) */}
          <g className="map-root-layer">
            {/* 1. DHAKA METROPOLITAN ADMINISTRATIVE BOUNDARY SILHOUETTE */}
            {layers.boundary && (
              <g className="boundary-silhouette-layer">
                {DHAKA_METRO_BOUNDARY_GEOJSON.features.map((feature) => {
                  const pathD = pathGenerator(feature as any) || '';
                  return (
                    <path
                      key={feature.id}
                      d={pathD}
                      fill={colors.landFill}
                      stroke={colors.landStroke}
                      strokeWidth={1.5}
                      strokeLinejoin="round"
                      className="transition-colors duration-300"
                    >
                      <title>{isBangla ? feature.properties.nameBn : feature.properties.name}</title>
                    </path>
                  );
                })}
              </g>
            )}

            {/* 2. THANA ADMINISTRATIVE POLYGONS */}
            {layers.thanas && (
              <g className="thanas-layer">
                {DHAKA_THANAS_GEOJSON.features.map((feature) => {
                  const isSelected = selectedThana?.id === feature.id;
                  const isHovered = hoveredFeature?.title === feature.properties.name;
                  const pathD = pathGenerator(feature as any) || '';

                  let strokeColor = colors.thanaStroke;
                  let fillColor = colors.thanaFill;

                  if (isSelected) {
                    strokeColor = 'var(--color-surface-raised)';
                    fillColor = colors.thanaSelected;
                  } else if (isHovered) {
                    fillColor = colors.thanaHover;
                  }

                  return (
                    <path
                      key={feature.id}
                      d={pathD}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 1.8 : 0.8}
                      strokeDasharray={isSelected ? 'none' : '4 2'}
                      className="transition-colors duration-200 cursor-pointer"
                      onClick={() => {
                        setSelectedThana(feature);
                        const [lon, lat] = feature.properties.center;
                        zoomToCoords(lon, lat, 4.5);
                      }}
                      onMouseEnter={() => {
                        setHoveredFeature({
                          title: isBangla ? feature.properties.nameBn : feature.properties.name,
                          sub: isBangla ? `${feature.properties.mouzaCount}টি মৌজা · ${feature.properties.activePlots}টি প্লট` : `${feature.properties.mouzaCount} Mouzas · ${feature.properties.activePlots} Active Plots`,
                          risk: feature.properties.riskScore,
                          status: feature.properties.riskLevel,
                          coords: feature.properties.center,
                        });
                      }}
                      onMouseLeave={() => setHoveredFeature(null)}
                    />
                  );
                })}
              </g>
            )}

            {/* 3. RIVER & HYDROGRAPHIC WATERWAYS (Buriganga, Turag, Balu, Lakes) */}
            {layers.waterways && (
              <g className="waterways-layer">
                {DHAKA_WATERWAYS_GEOJSON.features.map((waterway) => {
                  const pathD = pathGenerator(waterway as any) || '';
                  const isLake = waterway.properties.type === 'lake';

                  return (
                    <path
                      key={waterway.id}
                      d={pathD}
                      fill={isLake ? colors.waterwayFill : 'none'}
                      stroke={colors.waterwayStroke}
                      strokeWidth={isLake ? 1.5 : 4.0}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-colors duration-200"
                    >
                      <title>{isBangla ? waterway.properties.nameBn : waterway.properties.name}</title>
                    </path>
                  );
                })}
              </g>
            )}

            {/* 4. DETAILED SECONDARY STREETS & NEIGHBORHOOD GRIDS */}
            {layers.streets && (
              <g className="streets-network-layer">
                {DHAKA_STREET_NETWORK_GEOJSON.features.map((street) => {
                  const pathD = pathGenerator(street as any) || '';
                  return (
                    <path
                      key={street.id}
                      d={pathD}
                      fill="none"
                      stroke={colors.streetStroke}
                      strokeWidth={colors.streetWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <title>{street.properties.name}</title>
                    </path>
                  );
                })}
              </g>
            )}

            {/* 5. PRIMARY HIGHWAYS & ARTERIAL EXPRESSWAYS */}
            {layers.highways && (
              <g className="highways-network-layer">
                {DHAKA_HIGHWAYS_GEOJSON.features.map((hwy) => {
                  const pathD = pathGenerator(hwy as any) || '';
                  return (
                    <path
                      key={hwy.id}
                      d={pathD}
                      fill="none"
                      stroke={colors.highwayStroke}
                      strokeWidth={colors.highwayWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="drop-shadow-sm"
                    >
                      <title>{hwy.properties.name}</title>
                    </path>
                  );
                })}
              </g>
            )}

            {/* 6. CADASTRAL DAG PARCELS */}
            {layers.cadastralPlots && (
              <g className="cadastral-plots-layer">
                {DHAKA_CADASTRAL_PLOTS.map((plot) => {
                  const isSelected = selectedPlot?.id === plot.id;
                  const pathD = pathGenerator(plot as any) || '';

                  let fill = 'rgba(34, 197, 94, 0.28)';
                  let stroke = '#22c55e';

                  if (plot.properties.status === 'FLAGGED_DOUBLE_SALE') {
                    fill = 'url(#d3-hatch-dispute)';
                    stroke = '#ef4444';
                  } else if (plot.properties.status === 'MUTATION_DISCREPANCY') {
                    fill = 'rgba(245, 158, 11, 0.35)';
                    stroke = '#f59e0b';
                  } else if (plot.properties.status === 'LOCKED') {
                    fill = 'rgba(168, 85, 247, 0.38)';
                    stroke = '#c084fc';
                  }

                  return (
                    <g key={plot.id}>
                      <path
                        d={pathD}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={isSelected ? 3.0 : 1.8}
                        className="cursor-pointer transition-all duration-200 hover:brightness-125"
                        onClick={() => {
                          setSelectedPlot(plot);
                          onPlotSelect?.(plot);
                          const centroid = d3.geoCentroid(plot as any);
                          zoomToCoords(centroid[0], centroid[1], 14);
                        }}
                        onMouseEnter={() => {
                          const centroid = d3.geoCentroid(plot as any);
                          setHoveredFeature({
                            title: isBangla ? `দাগ নং ${plot.properties.dagNo} (${plot.properties.mouzaBn})` : `Dag #${plot.properties.dagNo} (${plot.properties.mouza})`,
                            sub: isBangla ? `মালিক: ${plot.properties.currentOwnerBn} · ${plot.properties.areaDecimals} শতক` : `Owner: ${plot.properties.currentOwner} · ${plot.properties.areaDecimals} Dec`,
                            risk: plot.properties.riskScore,
                            status: plot.properties.status,
                            coords: centroid as [number, number],
                          });
                        }}
                        onMouseLeave={() => setHoveredFeature(null)}
                      />
                    </g>
                  );
                })}
              </g>
            )}

            {/* 7. PROJECT AREAS DENOTATION OVERLAY (The Core Requirement!) */}
            {layers.projectZones && (
              <g className="project-zones-denotation-layer">
                {DHAKA_PROJECT_AREAS.map((area) => {
                  const [px, py] = projection(area.center) || [0, 0];
                  const isPrimary = area.role === 'PRIMARY_CORE';
                  const isSelected = selectedProjectArea?.id === area.id;

                  return (
                    <g
                      key={`zone-marker-${area.id}`}
                      className="cursor-pointer group"
                      onClick={() => {
                        setSelectedProjectArea(area);
                        if (isPrimary) {
                          const plot = DHAKA_CADASTRAL_PLOTS[0];
                          setSelectedPlot(plot);
                          onPlotSelect?.(plot);
                          zoomToCoords(area.center[0], area.center[1], 9);
                        } else {
                          zoomToCoords(area.center[0], area.center[1], 6.5);
                        }
                      }}
                    >
                      {/* Radiating Radar Rings */}
                      <circle
                        cx={px}
                        cy={py}
                        r={isPrimary ? 24 : 14}
                        fill="none"
                        stroke={isPrimary ? '#22c55e' : '#38bdf8'}
                        strokeWidth="1.5"
                        opacity="0.7"
                      >
                        <animate
                          attributeName="r"
                          values={isPrimary ? '12;36;12' : '8;22;8'}
                          dur={isPrimary ? '2.4s' : '3.2s'}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.9;0.1;0.9"
                          dur={isPrimary ? '2.4s' : '3.2s'}
                          repeatCount="indefinite"
                        />
                      </circle>

                      {/* Middle Halo Circle */}
                      <circle
                        cx={px}
                        cy={py}
                        r={isPrimary ? 12 : 7}
                        fill={isPrimary ? 'rgba(34, 197, 94, 0.25)' : 'rgba(56, 189, 248, 0.25)'}
                        stroke={isPrimary ? '#22c55e' : '#38bdf8'}
                        strokeWidth={isPrimary ? 2 : 1.2}
                      />

                      {/* Center Point */}
                      <circle
                        cx={px}
                        cy={py}
                        r={isPrimary ? 4.5 : 3}
                        fill={isPrimary ? '#22c55e' : '#ffffff'}
                        stroke="#000000"
                        strokeWidth="1"
                      />

                      {/* PRIMARY PROJECT ZONE CALLOUT BANNER (Dhanmondi Mouza Dag 1042) */}
                      {isPrimary && (
                        <g className="callout-tag transition-transform group-hover:scale-105">
                          {/* Leader Line */}
                          <path
                            d={`M ${px} ${py} L ${px - 25} ${py - 25} L ${px - 165} ${py - 25}`}
                            fill="none"
                            stroke={isPosterDay ? '#16a34a' : '#22c55e'}
                            strokeWidth="1.5"
                            strokeDasharray="3 2"
                          />

                          {/* Callout Box */}
                          <rect
                            x={px - 265}
                            y={py - 54}
                            width="240"
                            height="44"
                            rx="4"
                            fill={isPosterDay ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.95)'}
                            stroke={isPosterDay ? '#16a34a' : '#22c55e'}
                            strokeWidth="1.5"
                            filter="drop-shadow(0 4px 12px rgba(0,0,0,0.3))"
                          />

                          {/* Callout Title */}
                          <text
                            x={px - 255}
                            y={py - 37}
                            fontSize="9.5"
                            fontWeight="bold"
                            fill={isPosterDay ? '#15803d' : '#4ade80'}
                            fontFamily="monospace"
                          >
                            ★ {isBangla ? 'প্রকল্প মূল এলাকা: ধানমন্ডি (দাগ ১০৪২)' : 'PROJECT CORE: DHANMONDI (DAG 1042)'}
                          </text>

                          {/* Callout Subtitle */}
                          <text
                            x={px - 255}
                            y={py - 21}
                            fontSize="8"
                            fill={isPosterDay ? '#334155' : '#cbd5e1'}
                            fontFamily="monospace"
                          >
                            {isBangla ? 'দ্বৈত-বিক্রয় দ্বন্দ্ব · সক্রিয় ক্রিপ্টো সফট লক' : 'Dual-Sale Dispute · Active Soft Lock'}
                          </text>
                        </g>
                      )}

                      {/* Small Label for Secondary Nodes */}
                      {!isPrimary && zoomTransformState.k < 8 && (
                        <text
                          x={px}
                          y={py + 15}
                          textAnchor="middle"
                          fontSize="8.5"
                          fontWeight="600"
                          fontFamily="monospace"
                          fill={colors.posterTitle}
                          className="opacity-90 select-none"
                        >
                          {isBangla ? area.nameBn.split(' ')[0] : area.name.split(' ')[0]}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            )}

            {/* 8. LABELS AND ANNOTATIONS */}
            {layers.labels && (
              <g className="labels-layer pointer-events-none">
                {/* Cadastral Dag Plot Number Labels (shown when zoomed in) */}
                {zoomTransformState.k >= 3.5 &&
                  DHAKA_CADASTRAL_PLOTS.map((plot) => {
                    const centroid = d3.geoCentroid(plot as any);
                    const [px, py] = projection(centroid) || [0, 0];

                    return (
                      <g key={`dag-label-${plot.id}`}>
                        <text
                          x={px}
                          y={py - 3}
                          textAnchor="middle"
                          fill={colors.posterTitle}
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                          className="select-none"
                        >
                          {isBangla ? `দাগ ${plot.properties.dagNo}` : `DAG ${plot.properties.dagNo}`}
                        </text>
                        <text
                          x={px}
                          y={py + 7}
                          textAnchor="middle"
                          fill="var(--color-surface-raised)"
                          fontSize="7.5"
                          fontFamily="monospace"
                        >
                          {isBangla ? `${plot.properties.areaDecimals} শতক` : `${plot.properties.areaDecimals} dec`}
                        </text>
                      </g>
                    );
                  })}
              </g>
            )}
          </g>

          {/* 
            ====================================================================
            POSTER HEADER TYPOGRAPHY (Top Right, matching the reference images)
            ====================================================================
          */}
          {layers.posterHeader && (
            <g
              className="poster-title-block select-none pointer-events-none"
              transform={`translate(${Math.max(20, dimensions.width - 260)}, 48)`}
            >
              <text
                x="0"
                y="0"
                fontSize="38"
                fontWeight="800"
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                letterSpacing="1.2px"
                fill={colors.posterTitle}
              >
                {isBangla ? 'ঢাকা' : 'Dhaka'}
              </text>
              <text
                x="0"
                y="28"
                fontSize="22"
                fontWeight="600"
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                letterSpacing="0.6px"
                fill={colors.posterTitle}
                opacity="0.9"
              >
                {isBangla ? 'বাংলাদেশ' : 'Bangladesh'}
              </text>
              <text
                x="0"
                y="48"
                fontSize="9.5"
                fontWeight="600"
                fontFamily="monospace"
                letterSpacing="1.2px"
                fill={colors.posterSub}
              >
                23°48'N · 90°24'E · EPSG:4326
              </text>
              <text
                x="0"
                y="62"
                fontSize="8.5"
                fontWeight="700"
                fontFamily="monospace"
                letterSpacing="0.8px"
                fill={colors.posterAccent}
              >
                {isBangla ? 'প্রবাহ // প্রকল্প ক্যাডাস্ট্রাল নেটওয়ার্ক' : 'PROBAHO // CADASTRAL FRAUD INTELLIGENCE'}
              </text>
            </g>
          )}
        </svg>

        {/* Floating Tooltip Hover */}
        {hoveredFeature && (
          <div className="absolute top-4 left-4 z-30 p-2.5 rounded-[4px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-strong)]/95 shadow-xl text-xs font-mono space-y-1 pointer-events-none backdrop-blur-md animate-in fade-in duration-150">
            <div className="text-[var(--color-text-primary)] font-bold flex items-center justify-between gap-4">
              <span>{hoveredFeature.title}</span>
              {hoveredFeature.risk !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    hoveredFeature.risk > 70
                      ? 'bg-red-500/20 text-red-500'
                      : hoveredFeature.risk > 30
                      ? 'bg-amber-500/20 text-amber-500'
                      : 'bg-green-500/20 text-green-500'
                  }`}
                >
                  {isBangla ? `ঝুঁকি: ${hoveredFeature.risk}/১০০` : `Risk: ${hoveredFeature.risk}/100`}
                </span>
              )}
            </div>
            <div className="text-[10.5px] text-[var(--color-text-secondary)]">{hoveredFeature.sub}</div>
            <div className="text-[9.5px] text-[var(--color-text-tertiary)] flex items-center gap-1 pt-0.5">
              <MapPin className="w-3 h-3 text-[var(--color-surface-raised)]" />
              <span>
                {hoveredFeature.coords[1].toFixed(4)}° N, {hoveredFeature.coords[0].toFixed(4)}° E
              </span>
            </div>
          </div>
        )}

        {/* Zoom Controls HUD (Bottom Right) */}
        <div className="absolute bottom-5 right-5 z-20 flex flex-col gap-1.5 glass-tile p-1.5 rounded-[4px] border border-[var(--color-border-subtle)] shadow-xl">
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-[3px] hover:bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] transition-colors cursor-pointer"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-[3px] hover:bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] transition-colors cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-2 rounded-[3px] hover:bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] transition-colors cursor-pointer"
            title="Reset Dhaka Bounds"
            aria-label="Reset zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Legend Overlay (Bottom Left) */}
        <div className="absolute bottom-5 left-5 z-20 glass-tile p-2.5 rounded-[4px] border border-[var(--color-border-subtle)] text-[10px] font-mono space-y-1 shadow-lg backdrop-blur-md hidden sm:block max-w-xs">
          <div className="font-bold text-[var(--color-text-primary)] text-[11px] mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--color-surface-raised)] animate-pulse" />
            <span>{isBangla ? 'প্রকল্প মানচিত্র লেজেন্ড' : 'Project GIS Legend'}</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <span className="w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-500 flex items-center justify-center text-[7px] text-white">★</span>
            <span>{isBangla ? 'মূল প্রকল্প এলাকা (ধানমন্ডি দাগ ১০৪২)' : 'Primary Project Zone (Dhanmondi)'}</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <span className="w-3 h-3 rounded-[2px] bg-red-500/40 border border-red-500" />
            <span>{isBangla ? 'চিহ্নিত দ্বৈত-বিক্রয় প্লট' : 'Flagged Double-Sale Plot'}</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <span className="w-3 h-1 bg-[var(--color-text-primary)]" />
            <span>{isBangla ? 'প্রধান মহাসড়ক ও এক্সপ্রেসওয়ে' : 'Primary Highways (High-Density)'}</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <span className="w-3 h-1 bg-[#38bdf8]" />
            <span>{isBangla ? 'নদী (বুড়িগঙ্গা, তুরাগ, বালু)' : 'River Network (Buriganga, Turag)'}</span>
          </div>
        </div>
      </div>

      {/* 
        ====================================================================
        INSPECTOR DRAWER: Triggered when a Project Zone or Dag Plot is selected
        ====================================================================
      */}
      {showInspectorPanel && (selectedPlot || selectedProjectArea) && (
        <div className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-strong)] p-3.5 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 z-20 text-xs font-mono transition-colors">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[var(--color-surface-raised)]" />
                <span>
                  {selectedProjectArea
                    ? isBangla
                      ? `${selectedProjectArea.nameBn} · ${selectedProjectArea.targetPlotBn}`
                      : `${selectedProjectArea.name} · ${selectedProjectArea.targetPlot}`
                    : selectedPlot
                    ? isBangla
                      ? `দাগ নম্বর ${selectedPlot.properties.dagNo} (${selectedPlot.properties.mouzaBn})`
                      : `Dag #${selectedPlot.properties.dagNo} (${selectedPlot.properties.mouza})`
                    : ''}
                </span>
              </span>

              {selectedProjectArea?.role === 'PRIMARY_CORE' && (
                <span className="px-2 py-0.5 text-[9.5px] font-bold rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {isBangla ? 'প্রধান প্রকল্প তদন্ত এলাকা' : 'PRIMARY INVESTIGATION ZONE'}
                </span>
              )}

              {selectedPlot && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    selectedPlot.properties.status === 'FLAGGED_DOUBLE_SALE'
                      ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
                      : selectedPlot.properties.status === 'LOCKED'
                      ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                      : selectedPlot.properties.status === 'MUTATION_DISCREPANCY'
                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      : 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30'
                  }`}
                >
                  {selectedPlot.properties.status}
                </span>
              )}
            </div>

            <div className="text-[11px] text-[var(--color-text-secondary)] flex flex-wrap gap-4">
              {selectedPlot && (
                <>
                  <span>
                    {isBangla ? 'মালিক:' : 'Owner:'}{' '}
                    <strong className="text-[var(--color-text-primary)]">
                      {isBangla ? selectedPlot.properties.currentOwnerBn : selectedPlot.properties.currentOwner}
                    </strong>
                  </span>
                  <span>
                    {isBangla ? 'রেকর্ডকৃত জমি:' : 'Recorded Area:'}{' '}
                    <strong className="text-[var(--color-text-primary)]">
                      {selectedPlot.properties.areaDecimals} {isBangla ? 'শতাংশ' : 'Dec'} ({selectedPlot.properties.areaKatha} {isBangla ? 'কাঠা' : 'Katha'})
                    </strong>
                  </span>
                  <span>
                    {isBangla ? 'খতিয়ান:' : 'Khatian:'} <strong>{selectedPlot.properties.khatianNo}</strong>
                  </span>
                </>
              )}

              {selectedProjectArea && (
                <span>
                  {isBangla ? 'ঝুঁকি রেটিং:' : 'Risk Rating:'}{' '}
                  <strong className={selectedProjectArea.riskScore > 70 ? 'text-red-500' : 'text-emerald-500'}>
                    {selectedProjectArea.riskScore}/100
                  </strong>
                </span>
              )}
            </div>

            {/* Description / Alert Note */}
            <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed pt-1">
              {selectedProjectArea
                ? isBangla
                  ? selectedProjectArea.descriptionBn
                  : selectedProjectArea.description
                : selectedPlot
                ? isBangla
                  ? selectedPlot.properties.alertNoteBn
                  : selectedPlot.properties.alertNote
                : ''}
            </p>
          </div>

          {/* Right Action Affordance */}
          <div className="flex items-center gap-3 shrink-0">
            {selectedPlot?.properties.activeLock && (
              <div className="text-right hidden sm:block">
                <div className="text-[10px] text-red-500 font-bold flex items-center justify-end gap-1">
                  <Lock className="w-3 h-3 text-red-500" />
                  <span>{selectedPlot.properties.activeLock.token}</span>
                </div>
                <div className="text-[9.5px] text-[var(--color-text-tertiary)]">
                  {selectedPlot.properties.activeLock.expiresIn}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setSelectedPlot(null);
                setSelectedProjectArea(null);
              }}
              className="p-1.5 rounded-[3px] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
              title="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
