/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Probaho — D3.js Accurate Cadastral GIS Map of Dhaka Metropolitan Area
 * 
 * Powered by D3 GeoMercator Projection, D3 Zoom, and WGS84 GeoJSON data.
 * Features:
 * - Real-world Dhaka Thanas & Mouza boundaries
 * - Accurate River Systems (Buriganga, Turag, Balu, Hatirjheel, Dhanmondi, Gulshan)
 * - High-Resolution Cadastral Dag Parcels (Dhanmondi Mouza J.L. 245, Dag 1042, 1041, 1043)
 * - Interactive D3 Pan & Zoom with boundary constraints
 * - Layer filters (Thanas, Hydrography, Dag Parcels, Fraud Risk Overlay, Labels)
 * - Search by Dag number or Thana with smooth animated zoom-to-feature
 * - Comprehensive Inspector Drawer with Survey Lineage (CS → SA → RS → BS)
 * - Full Day & Night mode theme responsiveness
 * - Full English & Bangla bilingual localization
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
  Sliders,
  Eye,
  EyeOff,
  Crosshair,
  Compass,
  FileText,
  Info,
  Maximize2,
  X,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import {
  DHAKA_THANAS_GEOJSON,
  DHAKA_WATERWAYS_GEOJSON,
  DHAKA_CADASTRAL_PLOTS,
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
  const { isDay } = useTheme();
  const { isBangla } = useLanguage();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Active Map Dimensions
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Layer Toggles
  const [layers, setLayers] = useState({
    thanas: true,
    waterways: true,
    cadastralPlots: true,
    riskHeatmap: true,
    labels: true,
    gridMesh: true,
  });

  // Selected Feature State
  const [selectedPlot, setSelectedPlot] = useState<DhakaCadastralPlotFeature | null>(
    () => DHAKA_CADASTRAL_PLOTS.find((p) => p.id === initialSelectedPlotId) || null
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
  const projection = useMemo(() => {
    // Dhaka Center Coordinates: Lon 90.4070° E, Lat 23.7850° N
    const scale = Math.min(dimensions.width, dimensions.height) * 44;
    return d3
      .geoMercator()
      .center([90.4070, 23.7850])
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
      .scaleExtent([0.8, 48]) // Allows zooming in deep to individual Cadastral Dag plots
      .on('zoom', (event) => {
        setZoomTransformState(event.transform);
        svg.select('g.map-root-layer').attr('transform', event.transform);
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // Initial Zoom to Dhanmondi Dag 1042 if requested
    if (initialSelectedPlotId) {
      const plot = DHAKA_CADASTRAL_PLOTS.find((p) => p.id === initialSelectedPlotId);
      if (plot) {
        const centroid = d3.geoCentroid(plot as any);
        const [cx, cy] = projection(centroid) || [dimensions.width / 2, dimensions.height / 2];
        const initialScale = 5.5;
        const initialTransform = d3.zoomIdentity
          .translate(dimensions.width / 2 - cx * initialScale, dimensions.height / 2 - cy * initialScale)
          .scale(initialScale);
        
        svg.call(zoom.transform, initialTransform);
      }
    }
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
      .duration(500)
      .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    setSelectedPlot(null);
    setSelectedThana(null);
    onPlotSelect?.(null);
  }, [onPlotSelect]);

  // Zoom to a specific coordinate
  const zoomToCoords = useCallback(
    (lon: number, lat: number, scale = 7) => {
      if (!svgRef.current || !zoomBehaviorRef.current) return;
      const [x, y] = projection([lon, lat]) || [dimensions.width / 2, dimensions.height / 2];
      const transform = d3.zoomIdentity
        .translate(dimensions.width / 2 - x * scale, dimensions.height / 2 - y * scale)
        .scale(scale);

      d3.select(svgRef.current)
        .transition()
        .duration(650)
        .call(zoomBehaviorRef.current.transform, transform);
    },
    [projection, dimensions.width, dimensions.height]
  );

  // Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();

    // Check Dag Plots first
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

  // Visual Theme Colors based on active theme
  const themeColors = useMemo(() => {
    if (isDay) {
      return {
        background: '#f6f5f2',
        thanaFill: 'rgba(232, 230, 225, 0.45)',
        thanaHover: 'rgba(22, 163, 74, 0.15)',
        thanaSelected: 'rgba(22, 163, 74, 0.25)',
        thanaStroke: 'rgba(17, 17, 19, 0.28)',
        waterwayFill: '#bfdbfe',
        waterwayStroke: '#3b82f6',
        gridLine: 'rgba(17, 17, 19, 0.05)',
        plotVerifiedFill: 'rgba(22, 163, 74, 0.28)',
        plotVerifiedStroke: '#16a34a',
        plotFlaggedFill: 'rgba(239, 68, 68, 0.35)',
        plotFlaggedStroke: '#dc2626',
        plotDiscrepancyFill: 'rgba(245, 158, 11, 0.32)',
        plotDiscrepancyStroke: '#d97706',
        plotLockedFill: 'rgba(147, 51, 234, 0.35)',
        plotLockedStroke: '#7e22ce',
        textPrimary: '#111113',
        textSecondary: '#4b5563',
      };
    } else {
      return {
        background: '#0a0d0b',
        thanaFill: 'rgba(18, 24, 20, 0.65)',
        thanaHover: 'rgba(34, 197, 94, 0.18)',
        thanaSelected: 'rgba(34, 197, 94, 0.3)',
        thanaStroke: 'rgba(34, 197, 94, 0.35)',
        waterwayFill: 'rgba(14, 116, 144, 0.45)',
        waterwayStroke: '#06b6d4',
        gridLine: 'rgba(34, 197, 94, 0.08)',
        plotVerifiedFill: 'rgba(34, 197, 94, 0.25)',
        plotVerifiedStroke: '#22c55e',
        plotFlaggedFill: 'rgba(239, 68, 68, 0.38)',
        plotFlaggedStroke: '#ef4444',
        plotDiscrepancyFill: 'rgba(245, 158, 11, 0.3)',
        plotDiscrepancyStroke: '#f59e0b',
        plotLockedFill: 'rgba(168, 85, 247, 0.35)',
        plotLockedStroke: '#c084fc',
        textPrimary: '#eceae6',
        textSecondary: '#8a8a86',
      };
    }
  }, [isDay]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none flex flex-col font-sans transition-colors duration-200 ${className}`}
      style={{ height }}
    >
      {/* 
        ====================================================================
        TOP CONTROL DOCK: Search bar, Coordinates HUD, Layer Toggles, Mode
        ====================================================================
      */}
      <div className="relative z-20 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-strong)]/85 backdrop-blur-md transition-colors">
        {/* Left: Quick Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-sm w-full">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBangla ? 'দাগ নম্বর বা থানা খুঁজুন (উদাঃ ১০৪২, ধানমন্ডি)...' : 'Search Dag # or Thana (e.g. 1042, Dhanmondi)...'}
              className="w-full pl-8 pr-3 py-1.5 text-xs font-mono rounded-[3px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-surface-raised)] transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-mono font-bold text-white bg-[var(--color-surface-raised)] hover:brightness-110 rounded-[3px] transition-all cursor-pointer shrink-0 shadow-sm"
          >
            {isBangla ? 'খুঁজুন' : 'Search'}
          </button>
        </form>

        {/* Center: Live Spatial Coordinate Telemetry */}
        <div className="hidden md:flex items-center gap-3 text-[11px] font-mono text-[var(--color-text-secondary)] glass-tile px-3 py-1 rounded-[3px] border border-[var(--color-border-subtle)]">
          <Crosshair className="w-3.5 h-3.5 text-[var(--color-surface-raised)] animate-pulse" />
          <span>
            {cursorGeoCoords
              ? `${cursorGeoCoords[1].toFixed(4)}° N, ${cursorGeoCoords[0].toFixed(4)}° E`
              : '23.7850° N, 90.4070° E'}
          </span>
          <span className="text-[var(--color-border-subtle)]">|</span>
          <span className="text-[var(--color-surface-raised)] font-semibold">
            {zoomTransformState.k.toFixed(1)}x {isBangla ? 'জুম' : 'Zoom'}
          </span>
        </div>

        {/* Right: Quick Action Presets */}
        <div className="flex items-center gap-2">
          {/* Quick jump to Flagship Dag 1042 */}
          <button
            onClick={() => {
              const plot = DHAKA_CADASTRAL_PLOTS[0];
              setSelectedPlot(plot);
              onPlotSelect?.(plot);
              zoomToCoords(90.3740, 23.7475, 14);
            }}
            className="px-2.5 py-1 text-[11px] font-mono rounded-[3px] border border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400 font-bold flex items-center gap-1.5 hover:bg-red-500/20 transition-all cursor-pointer shadow-sm"
            title={isBangla ? 'দাগ ১০৪২ ধানমন্ডি ফ্ল্যাগশিপ দ্বৈত-বিক্রয় ঝুঁকি পরিদর্শন' : 'Inspect Dag 1042 Dhanmondi Flagship Double-Sale'}
          >
            <ShieldAlert className="w-3 h-3 text-red-500 animate-ping" />
            <span>{isBangla ? 'দাগ ১০৪২ ধানমন্ডি' : 'Dag 1042 Focus'}</span>
          </button>

          {/* Layer Filter Menu */}
          <div className="relative group">
            <button
              className="p-1.5 rounded-[3px] border border-[var(--color-border-subtle)] glass-tile text-[var(--color-text-primary)] hover:border-[var(--color-surface-raised)] transition-all cursor-pointer flex items-center gap-1"
              title="Toggle Layers"
            >
              <Layers className="w-3.5 h-3.5 text-[var(--color-surface-raised)]" />
              <span className="text-[10px] font-mono uppercase hidden sm:inline">{isBangla ? 'স্তর' : 'Layers'}</span>
            </button>

            {/* Dropdown menu */}
            <div className="absolute right-0 top-full mt-1 w-56 p-2 rounded-[4px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-strong)] shadow-2xl text-[11px] font-mono space-y-1.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
              <div className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-wider pb-1 border-b border-[var(--color-border-subtle)]">
                {isBangla ? 'মানচিত্র স্তর নিয়ন্ত্রণ' : 'Map Layer Controls'}
              </div>

              {[
                { key: 'thanas' as const, label: isBangla ? 'থানা সীমানা' : 'Thana Boundaries' },
                { key: 'waterways' as const, label: isBangla ? 'নদী ও লেক (বুড়িগঙ্গা-তুরাগ)' : 'Rivers & Lakes (Buriganga)' },
                { key: 'cadastralPlots' as const, label: isBangla ? 'ক্যাডাস্ট্রাল দাগ প্লট' : 'Cadastral Dag Plots' },
                { key: 'riskHeatmap' as const, label: isBangla ? 'ঝুঁকি সংকেত ওভারলে' : 'Fraud Risk Heatmap' },
                { key: 'labels' as const, label: isBangla ? 'স্থান ও দাগের নাম' : 'Thana & Plot Labels' },
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
        MAIN D3 SVG MAP VIEWPORT
        ====================================================================
      */}
      <div className="flex-1 relative overflow-hidden flex bg-[var(--color-surface-base)]">
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
                stroke={themeColors.gridLine}
                strokeWidth="0.75"
              />
            </pattern>
          </defs>

          {/* Background drafting mesh */}
          {layers.gridMesh && <rect width="100%" height="100%" fill="url(#d3-cad-grid)" />}

          {/* Map Root Layer (transformed by d3.zoom) */}
          <g className="map-root-layer">
            {/* 1. THANA ADMINISTRATIVE POLYGONS */}
            {layers.thanas && (
              <g className="thanas-layer">
                {DHAKA_THANAS_GEOJSON.features.map((feature) => {
                  const isSelected = selectedThana?.id === feature.id;
                  const isHovered = hoveredFeature?.title === feature.properties.name;
                  const pathD = pathGenerator(feature as any) || '';

                  // Dynamic color styling based on risk rating
                  let strokeColor = themeColors.thanaStroke;
                  let fillColor = themeColors.thanaFill;

                  if (isSelected) {
                    strokeColor = 'var(--color-surface-raised)';
                    fillColor = themeColors.thanaSelected;
                  } else if (isHovered) {
                    fillColor = themeColors.thanaHover;
                  }

                  return (
                    <path
                      key={feature.id}
                      d={pathD}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 2 : 1}
                      strokeDasharray={isSelected ? 'none' : '3 1'}
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

            {/* 2. RIVER & HYDROGRAPHIC WATERWAYS (Buriganga, Turag, Balu, Lakes) */}
            {layers.waterways && (
              <g className="waterways-layer">
                {DHAKA_WATERWAYS_GEOJSON.features.map((waterway) => {
                  const pathD = pathGenerator(waterway as any) || '';
                  const isLake = waterway.properties.type === 'lake';

                  return (
                    <path
                      key={waterway.id}
                      d={pathD}
                      fill={isLake ? themeColors.waterwayFill : 'none'}
                      stroke={themeColors.waterwayStroke}
                      strokeWidth={isLake ? 1.5 : 4.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-75 transition-opacity hover:opacity-100"
                    >
                      <title>{isBangla ? waterway.properties.nameBn : waterway.properties.name}</title>
                    </path>
                  );
                })}
              </g>
            )}

            {/* 3. CADASTRAL DAG PARCELS (Dhanmondi Mouza J.L. 245, etc.) */}
            {layers.cadastralPlots && (
              <g className="cadastral-plots-layer">
                {DHAKA_CADASTRAL_PLOTS.map((plot) => {
                  const isSelected = selectedPlot?.id === plot.id;
                  const pathD = pathGenerator(plot as any) || '';

                  let fill = themeColors.plotVerifiedFill;
                  let stroke = themeColors.plotVerifiedStroke;

                  if (plot.properties.status === 'FLAGGED_DOUBLE_SALE') {
                    fill = themeColors.plotFlaggedFill;
                    stroke = themeColors.plotFlaggedStroke;
                  } else if (plot.properties.status === 'MUTATION_DISCREPANCY') {
                    fill = themeColors.plotDiscrepancyFill;
                    stroke = themeColors.plotDiscrepancyStroke;
                  } else if (plot.properties.status === 'LOCKED') {
                    fill = themeColors.plotLockedFill;
                    stroke = themeColors.plotLockedStroke;
                  }

                  return (
                    <g key={plot.id}>
                      <path
                        d={pathD}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={isSelected ? 2.8 : 1.5}
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
                            sub: isBangla ? `মালিক: ${plot.properties.currentOwnerBn} · ${plot.properties.areaDecimals} শতাংশ` : `Owner: ${plot.properties.currentOwner} · ${plot.properties.areaDecimals} Dec`,
                            risk: plot.properties.riskScore,
                            status: plot.properties.status,
                            coords: centroid as [number, number],
                          });
                        }}
                        onMouseLeave={() => setHoveredFeature(null)}
                      />

                      {/* Ping animation node for Flagged or Locked Plots */}
                      {layers.riskHeatmap &&
                        (plot.properties.status === 'FLAGGED_DOUBLE_SALE' ||
                          plot.properties.status === 'LOCKED') && (
                          <circle
                            cx={projection(d3.geoCentroid(plot as any))?.[0] || 0}
                            cy={projection(d3.geoCentroid(plot as any))?.[1] || 0}
                            r={isSelected ? 10 : 6}
                            fill="none"
                            stroke={stroke}
                            strokeWidth="2"
                            filter="url(#d3-pulse-glow)"
                          >
                            <animate
                              attributeName="r"
                              values="4;14;4"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              values="1;0.1;1"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        )}
                    </g>
                  );
                })}
              </g>
            )}

            {/* 4. LABELS AND ANNOTATIONS */}
            {layers.labels && (
              <g className="labels-layer pointer-events-none">
                {/* Thana Center Names */}
                {DHAKA_THANAS_GEOJSON.features.map((feature) => {
                  const [x, y] = projection(feature.properties.center) || [0, 0];
                  // Hide thana labels when deeply zoomed in
                  if (zoomTransformState.k > 8) return null;

                  return (
                    <text
                      key={`label-${feature.id}`}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      fill={themeColors.textPrimary}
                      fontSize={Math.max(9, 13 / Math.sqrt(zoomTransformState.k))}
                      fontWeight="bold"
                      fontFamily="sans-serif"
                      className="select-none tracking-tight drop-shadow-sm opacity-85"
                    >
                      {isBangla ? feature.properties.nameBn : feature.properties.name}
                    </text>
                  );
                })}

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
                          fill={themeColors.textPrimary}
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
        <div className="absolute bottom-5 left-5 z-20 glass-tile p-2.5 rounded-[4px] border border-[var(--color-border-subtle)] text-[10px] font-mono space-y-1 shadow-lg backdrop-blur-md hidden sm:block">
          <div className="font-bold text-[var(--color-text-primary)] text-[11px] mb-1">
            {isBangla ? 'ক্যাডাস্ট্রাল মানচিত্র লেজেন্ড' : 'Cadastral GIS Legend'}
          </div>
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <span className="w-3 h-3 rounded-[2px] bg-red-500/40 border border-red-500" />
            <span>{isBangla ? 'চিহ্নিত দ্বৈত-বিক্রয় প্লট (দাগ ১০৪২)' : 'Flagged Double-Sale (Dag 1042)'}</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <span className="w-3 h-3 rounded-[2px] bg-green-500/30 border border-green-500" />
            <span>{isBangla ? 'ক্রিপ্টোগ্রাফিক যাচাইকৃত প্লট' : 'Verified Ledger Plot'}</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <span className="w-3 h-3 rounded-[2px] bg-amber-500/30 border border-amber-500" />
            <span>{isBangla ? 'নামজারি বা হিস্যা অসঙ্গতি' : 'Mutation Discrepancy'}</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <span className="w-3 h-1 bg-[#06b6d4]" />
            <span>{isBangla ? 'নদী (বুড়িগঙ্গা, তুরাগ, বালু)' : 'River / Lake Network'}</span>
          </div>
        </div>
      </div>

      {/* 
        ====================================================================
        INSPECTOR DRAWER: Triggered when a Dag Plot or Thana is clicked
        ====================================================================
      */}
      {showInspectorPanel && selectedPlot && (
        <div className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-strong)] p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 z-20 text-xs font-mono transition-colors">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-bold text-[var(--color-text-primary)]">
                {isBangla
                  ? `দাগ নম্বর ${selectedPlot.properties.dagNo} · ${selectedPlot.properties.mouzaBn}`
                  : `Dag #${selectedPlot.properties.dagNo} · ${selectedPlot.properties.mouza}`}
              </span>
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
            </div>

            <div className="text-[11px] text-[var(--color-text-secondary)] flex flex-wrap gap-4">
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
            </div>

            {/* Alert / Verification Note */}
            {selectedPlot.properties.alertNote && (
              <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed pt-1">
                {isBangla ? selectedPlot.properties.alertNoteBn : selectedPlot.properties.alertNote}
              </p>
            )}
          </div>

          {/* Right Action Affordance */}
          <div className="flex items-center gap-3 shrink-0">
            {selectedPlot.properties.activeLock && (
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
              onClick={() => setSelectedPlot(null)}
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
