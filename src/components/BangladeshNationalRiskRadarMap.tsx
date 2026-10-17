/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Probaho — Bangladesh National Risk & 360° Regional Radar D3.js Map
 * Authentic WGS84 GIS Projection, 8 Administrative Divisions & 64 Districts,
 * Rotating Radar Sweep Beam, Risk Heatmaps, Traditional Bengali Compass Rose,
 * Delta Estuaries, and Real-Time Cadastral Threat Telemetry.
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import {
  BANGLADESH_DIVISIONS,
  BANGLADESH_DISTRICTS,
  BANGLADESH_GEOJSON,
  BANGLADESH_RIVERS,
  BAY_OF_BENGAL_FEATURES,
  NATIONAL_HUBS,
  NEIGHBOR_REGIONS,
  NationalHub,
  DivisionProfile,
  BangladeshDistrict,
} from '../data/bangladeshNationalGeoData';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  Compass,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Dot,
  Radio,
  Layers,
  Activity,
  Wind,
  Maximize2,
  X,
  Play,
  Pause,
  AlertTriangle,
  Waves,
  MapPin,
  Search,
  Filter,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';

export interface BangladeshNationalRiskRadarMapProps {
  className?: string;
  height?: string | number;
  initialLockedHubId?: string;
  initialMode?: 'administrative' | 'radar';
  onSelectHub?: (hub: NationalHub) => void;
  onSelectDivision?: (division: DivisionProfile) => void;
  onSelectDistrict?: (district: BangladeshDistrict) => void;
}

export const BangladeshNationalRiskRadarMap: React.FC<BangladeshNationalRiskRadarMapProps> = ({
  className = '',
  height = '760px',
  initialLockedHubId = 'patuakhali',
  initialMode = 'administrative',
  onSelectHub,
  onSelectDivision,
  onSelectDistrict,
}) => {
  const { isBangla } = useLanguage();
  const { isDay } = useTheme();

  // Container & SVG references
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gZoomRef = useRef<SVGGElement>(null);

  // Map viewport dimensions
  const [dimensions, setDimensions] = useState({ width: 960, height: 760 });
  const [zoomLevel, setZoomLevel] = useState(1.0);

  // Core Map Mode: 'administrative' (বিভাগ ও জেলা সমূহ) vs 'radar' (৩৬০° হুমকি রাডার)
  const [mapThemeMode, setMapThemeMode] = useState<'administrative' | 'radar'>(initialMode);

  // Target lock & selection states
  const [lockedHubId, setLockedHubId] = useState<string>(initialLockedHubId);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>('patuakhali-dist');
  const [hoveredDivisionId, setHoveredDivisionId] = useState<string | null>(null);
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);
  const [hoveredHubId, setHoveredHubId] = useState<string | null>(null);

  // Layer Toggles
  const [showDistricts, setShowDistricts] = useState<boolean>(true);
  const [showRivers, setShowRivers] = useState<boolean>(true);
  const [showBathymetry, setShowBathymetry] = useState<boolean>(true);
  const [showNeighbors, setShowNeighbors] = useState<boolean>(true);
  const [showHeatmaps, setShowHeatmaps] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // Filter dropdown state
  const [filterDivisionId, setFilterDivisionId] = useState<string>('ALL');
  const [districtSearchQuery, setDistrictSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Radar Animation States
  const [isRadarActive, setIsRadarActive] = useState<boolean>(true);
  const [radarRpm, setRadarRpm] = useState<number>(10);
  const [radarAngle, setRadarAngle] = useState<number>(135);

  // Alert Banner State
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(true);

  // Tooltip State for hover card
  const [tooltipData, setTooltipData] = useState<{
    visible: boolean;
    x: number;
    y: number;
    district?: BangladeshDistrict;
    division?: DivisionProfile;
  }>({ visible: false, x: 0, y: 0 });

  // D3 Zoom behavior reference
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const currentTransformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);

  // Active locked hub object
  const lockedHub = useMemo(() => {
    return NATIONAL_HUBS.find((h) => h.id === lockedHubId) || NATIONAL_HUBS[0];
  }, [lockedHubId]);

  // Selected district object
  const selectedDistrict = useMemo(() => {
    return BANGLADESH_DISTRICTS.find((d) => d.id === selectedDistrictId) || null;
  }, [selectedDistrictId]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        if (clientWidth > 0 && clientHeight > 0) {
          setDimensions({ width: clientWidth, height: clientHeight });
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Continuous Radar Sweep Animation Loop
  useEffect(() => {
    if (!isRadarActive || mapThemeMode !== 'radar') return;
    let animId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      const degreesPerSec = radarRpm * 6;
      setRadarAngle((prev) => (prev + degreesPerSec * delta) % 360);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isRadarActive, radarRpm, mapThemeMode]);

  // Calibrate D3 Mercator Projection for Bangladesh using fitExtent on real GeoJSON data
  // Ensures optimal center, aspect ratio, scale, and exact padding on all four edges
  const projection = useMemo(() => {
    const { width, height } = dimensions;
    const padding = 28;
    return d3
      .geoMercator()
      .fitExtent(
        [
          [padding, padding],
          [width - padding, height - padding],
        ],
        BANGLADESH_GEOJSON as any
      );
  }, [dimensions]);

  const geoPathGenerator = useMemo(() => {
    return d3.geoPath().projection(projection);
  }, [projection]);

  // Coordinates of locked target hub in screen pixels
  const lockedPoint = useMemo(() => {
    const coords = projection(lockedHub.coordinates);
    return coords ? { x: coords[0], y: coords[1] } : { x: dimensions.width / 2, y: dimensions.height / 2 };
  }, [projection, lockedHub, dimensions]);

  // Set up D3 Zoom & Pan
  useEffect(() => {
    if (!svgRef.current || !gZoomRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = d3.select(gZoomRef.current);

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.8, 7.0])
      .on('zoom', (event) => {
        currentTransformRef.current = event.transform;
        setZoomLevel(event.transform.k);
        g.attr('transform', event.transform.toString());
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    return () => {
      svg.on('.zoom', null);
    };
  }, []);

  // Zoom Control Handlers
  const handleZoomIn = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .ease(d3.easeCubicOut)
      .call(zoomBehaviorRef.current.scaleBy, 1.35);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .ease(d3.easeCubicOut)
      .call(zoomBehaviorRef.current.scaleBy, 0.74);
  };

  const handleResetView = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(450)
      .ease(d3.easeCubicOut)
      .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  };

  const handlePan = (dx: number, dy: number) => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(200)
      .ease(d3.easeLinear)
      .call(zoomBehaviorRef.current.translateBy, dx, dy);
  };

  const handleSelectHub = (hub: NationalHub) => {
    setLockedHubId(hub.id);
    onSelectHub?.(hub);
  };

  const handleSelectDivision = (div: DivisionProfile) => {
    const hub = NATIONAL_HUBS.find((h) => h.divisionId === div.id);
    if (hub) setLockedHubId(hub.id);
    onSelectDivision?.(div);
  };

  const handleSelectDistrict = (dist: BangladeshDistrict) => {
    setSelectedDistrictId(dist.id);
    // Also sync hub if corresponding hub exists
    const matchingHub = NATIONAL_HUBS.find((h) => h.name.toLowerCase().includes(dist.name.toLowerCase()) || dist.id.includes(h.id));
    if (matchingHub) setLockedHubId(matchingHub.id);
    onSelectDistrict?.(dist);
  };

  // Color mapping by risk score
  const getRiskColor = (score: number) => {
    if (score >= 80) return '#ef4444'; // Red-500 Critical
    if (score >= 65) return '#f97316'; // Orange-500 High
    if (score >= 35) return '#f59e0b'; // Amber-500 Medium
    return '#10b981'; // Emerald-500 Low
  };

  // Filtered districts list based on division selector & search
  const filteredDistricts = useMemo(() => {
    return BANGLADESH_DISTRICTS.filter((d) => {
      const matchDiv = filterDivisionId === 'ALL' || d.divisionId === filterDivisionId;
      const matchQuery =
        !districtSearchQuery.trim() ||
        d.name.toLowerCase().includes(districtSearchQuery.toLowerCase()) ||
        d.nameBn.includes(districtSearchQuery);
      return matchDiv && matchQuery;
    });
  }, [filterDivisionId, districtSearchQuery]);

  // Nautical Lat/Lng Grid values
  const gridLats = [21, 22, 23, 24, 25, 26];
  const gridLngs = [88, 89, 90, 91, 92];

  // Radial sweep cone generator path for radar mode
  const radarSweepRadius = 260;
  const sweepAngleDeg = 48;
  const sweepStartRad = ((radarAngle - sweepAngleDeg) * Math.PI) / 180;
  const sweepEndRad = (radarAngle * Math.PI) / 180;

  const startX = lockedPoint.x + radarSweepRadius * Math.cos(sweepStartRad);
  const startY = lockedPoint.y + radarSweepRadius * Math.sin(sweepStartRad);
  const endX = lockedPoint.x + radarSweepRadius * Math.cos(sweepEndRad);
  const endY = lockedPoint.y + radarSweepRadius * Math.sin(sweepEndRad);

  const radarSweepPath = `M ${lockedPoint.x} ${lockedPoint.y} L ${startX} ${startY} A ${radarSweepRadius} ${radarSweepRadius} 0 0 1 ${endX} ${endY} Z`;

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-[12px] overflow-hidden border border-[var(--color-border-subtle)] select-none shadow-2xl transition-colors duration-200 ${
        mapThemeMode === 'administrative'
          ? isDay
            ? 'bg-[#f4f8fb]'
            : 'bg-[#0b1523]'
          : isDay
          ? 'bg-[#eef3f8]'
          : 'bg-[#080d16]'
      } ${className}`}
      style={{ height }}
    >
      {/* 
        ========================================================================
        1. TOP ADMINISTRATIVE BANNER HEADER (Matching reference map "বিভাগ ও জেলা সমূহ")
        ========================================================================
      */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex flex-col items-center">
        <div
          className={`px-5 py-1.5 rounded-full backdrop-blur-md border shadow-lg flex items-center gap-3 transition-colors ${
            mapThemeMode === 'administrative'
              ? isDay
                ? 'bg-white/95 border-emerald-600/40 text-emerald-950 shadow-emerald-900/10'
                : 'bg-[#0f1d2e]/95 border-emerald-400/40 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
              : isDay
              ? 'bg-white/95 border-cyan-400 text-slate-900'
              : 'bg-[#08101d]/95 border-cyan-400 text-slate-100'
          }`}
        >
          {mapThemeMode === 'administrative' ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base sm:text-lg font-black tracking-wide font-serif text-slate-900 dark:text-white flex items-center gap-2">
                <span>{isBangla ? 'বিভাগ ও জেলা সমূহ' : 'Divisions & 64 Districts of Bangladesh'}</span>
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                {isBangla ? '৮ বিভাগ · ৬৪ জেলা' : '8 ADM1 · 64 ADM2'}
              </span>
            </>
          ) : (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff2a6d]" />
              </span>
              <h2 className="text-sm sm:text-base font-bold font-mono tracking-wider uppercase text-[#ff2a6d] flex items-center gap-1.5">
                <Radio className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
                <span>360° {isBangla ? 'আঞ্চলিক রাডার টেলিমিতি' : 'REGIONAL THREAT RADAR'}</span>
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-500 font-bold border border-rose-500/30">
                10 RPM · 155 km
              </span>
            </>
          )}
        </div>
      </div>

      {/* 
        ========================================================================
        2. D3 INTERACTIVE SVG CANVAS
        ========================================================================
      */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      >
        <defs>
          {/* Lat/Long Grid Pattern for Radar Mode */}
          <pattern id="nauticalGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke={isDay ? 'rgba(0, 70, 140, 0.08)' : 'rgba(56, 189, 248, 0.08)'}
              strokeWidth="0.8"
            />
          </pattern>

          {/* Oceanic Azure Water Gradient (Bay of Bengal) */}
          <linearGradient id="oceanGradientAdmin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isDay ? '#99f6e4' : '#042f2e'} stopOpacity="0.45" />
            <stop offset="35%" stopColor={isDay ? '#38bdf8' : '#075985'} stopOpacity="0.75" />
            <stop offset="100%" stopColor={isDay ? '#0284c7' : '#0c4a6e'} stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="oceanGradientRadar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isDay ? '#d0e5f5' : '#081728'} stopOpacity="0.4" />
            <stop offset="40%" stopColor={isDay ? '#b8d8ef' : '#04101e'} stopOpacity="0.8" />
            <stop offset="100%" stopColor={isDay ? '#9ec7e6' : '#020b16'} stopOpacity="1.0" />
          </linearGradient>

          {/* Threat Heatmaps (Patuakhali & Sylhet) */}
          <radialGradient id="heatGlowCritical" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#f97316" stopOpacity="0.45" />
            <stop offset="75%" stopColor="#eab308" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="heatGlowMedium" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>

          {/* Radar Sweep Wedge Gradient */}
          <radialGradient id="radarSweepGradient" cx="0%" cy="0%" r="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#f97316" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#22c55e" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>

          {/* Swatch of No Ground Submarine Canyon Gradient */}
          <radialGradient id="canyonGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={isDay ? '#0284c7' : '#0369a1'} stopOpacity="0.85" />
            <stop offset="60%" stopColor={isDay ? '#38bdf8' : '#075985'} stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Dynamic Zoom & Pan Root Container */}
        <g ref={gZoomRef}>
          {/* Nautical Grid Background (Radar Mode) */}
          {mapThemeMode === 'radar' && showGrid && (
            <rect
              x="-2000"
              y="-2000"
              width="5000"
              height="5000"
              fill="url(#nauticalGrid)"
              className="pointer-events-none"
            />
          )}

          {/* Bay of Bengal Water Body */}
          <rect
            x="-500"
            y={dimensions.height * 0.62}
            width={dimensions.width + 1000}
            height={dimensions.height * 0.8}
            fill={mapThemeMode === 'administrative' ? 'url(#oceanGradientAdmin)' : 'url(#oceanGradientRadar)'}
            className="pointer-events-none"
          />

          {/* 
            ====================================================================
            LATITUDE / LONGITUDE PARALLELS & MERIDIANS
            ====================================================================
          */}
          {showGrid && (
            <g className="grid-lines pointer-events-none">
              {gridLats.map((lat) => {
                const pt1 = projection([87.5, lat]);
                const pt2 = projection([93.5, lat]);
                if (!pt1 || !pt2) return null;
                return (
                  <g key={`lat-${lat}`}>
                    <line
                      x1={pt1[0]}
                      y1={pt1[1]}
                      x2={pt2[0]}
                      y2={pt2[1]}
                      stroke={isDay ? 'rgba(0, 50, 100, 0.12)' : 'rgba(56, 189, 248, 0.12)'}
                      strokeDasharray="4 6"
                      strokeWidth="0.75"
                    />
                    <text
                      x={pt1[0] + 10}
                      y={pt1[1] - 4}
                      fill={isDay ? '#64748b' : '#475569'}
                      fontSize="9"
                      fontFamily="monospace"
                      opacity="0.8"
                    >
                      {lat}° N
                    </text>
                  </g>
                );
              })}

              {gridLngs.map((lng) => {
                const pt1 = projection([lng, 20.0]);
                const pt2 = projection([lng, 27.0]);
                if (!pt1 || !pt2) return null;
                return (
                  <g key={`lng-${lng}`}>
                    <line
                      x1={pt1[0]}
                      y1={pt1[1]}
                      x2={pt2[0]}
                      y2={pt2[1]}
                      stroke={isDay ? 'rgba(0, 50, 100, 0.12)' : 'rgba(56, 189, 248, 0.12)'}
                      strokeDasharray="4 6"
                      strokeWidth="0.75"
                    />
                    <text
                      x={pt1[0] + 4}
                      y={dimensions.height - 35}
                      fill={isDay ? '#64748b' : '#475569'}
                      fontSize="9"
                      fontFamily="monospace"
                      opacity="0.8"
                    >
                      {lng}° E
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 
            ====================================================================
            NEIGHBORING TERRITORIES (Meghalaya, Assam, Tripura, Mizoram, West Bengal, Myanmar)
            Matching the uploaded administrative reference atlas
            ====================================================================
          */}
          {showNeighbors && (
            <g className="neighbor-labels pointer-events-none select-none">
              {NEIGHBOR_REGIONS.map((reg) => {
                const pt = projection(reg.coords as [number, number]);
                if (!pt) return null;
                return (
                  <g key={reg.nameBn} transform={`translate(${pt[0]}, ${pt[1]})`}>
                    <text
                      textAnchor={reg.align as any}
                      fill={mapThemeMode === 'administrative' ? (isDay ? '#334155' : '#cbd5e1') : isDay ? '#64748b' : '#475569'}
                      fontSize={mapThemeMode === 'administrative' ? '12.5' : '11'}
                      fontFamily={mapThemeMode === 'administrative' ? 'serif, sans-serif' : 'monospace'}
                      fontWeight="800"
                      letterSpacing={mapThemeMode === 'administrative' ? '1.5' : '2'}
                      stroke={isDay ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)'}
                      strokeWidth="2.5"
                      paintOrder="stroke"
                    >
                      {isBangla ? reg.nameBn : `${reg.name} (${reg.sub})`}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 
            ====================================================================
            BAY OF BENGAL BATHYMETRY & SOUTHERN OCEAN LABELS
            ====================================================================
          */}
          {showBathymetry && (
            <g className="bathymetry-layer pointer-events-none select-none">
              {/* -20m Shelf Curve */}
              {(() => {
                const shelfLineGen = d3
                  .line<[number, number]>()
                  .x((d) => projection(d)![0])
                  .y((d) => projection(d)![1])
                  .curve(d3.curveBasis);
                const pathStr = shelfLineGen(BAY_OF_BENGAL_FEATURES.shelf20m as [number, number][]);
                const labelPos = projection([89.8, 21.4]);
                return (
                  pathStr && (
                    <g>
                      <path
                        d={pathStr}
                        fill="none"
                        stroke={isDay ? '#38bdf8' : '#0284c7'}
                        strokeWidth="1.2"
                        strokeDasharray="5 4"
                        opacity="0.65"
                      />
                      {labelPos && (
                        <text
                          x={labelPos[0]}
                          y={labelPos[1] - 5}
                          fill={isDay ? '#0284c7' : '#38bdf8'}
                          fontSize="8.5"
                          fontFamily="monospace"
                          opacity="0.8"
                        >
                          -20m Shelf
                        </text>
                      )}
                    </g>
                  )
                );
              })()}

              {/* -50m Isobath Curve */}
              {(() => {
                const isobathLineGen = d3
                  .line<[number, number]>()
                  .x((d) => projection(d)![0])
                  .y((d) => projection(d)![1])
                  .curve(d3.curveBasis);
                const pathStr = isobathLineGen(BAY_OF_BENGAL_FEATURES.isobath50m as [number, number][]);
                const labelPos = projection([90.5, 20.95]);
                return (
                  pathStr && (
                    <g>
                      <path
                        d={pathStr}
                        fill="none"
                        stroke={isDay ? '#0284c7' : '#0369a1'}
                        strokeWidth="1.0"
                        strokeDasharray="6 6"
                        opacity="0.55"
                      />
                      {labelPos && (
                        <text
                          x={labelPos[0]}
                          y={labelPos[1] - 5}
                          fill={isDay ? '#0369a1' : '#0284c7'}
                          fontSize="8.5"
                          fontFamily="monospace"
                          opacity="0.75"
                        >
                          -50m Isobath
                        </text>
                      )}
                    </g>
                  )
                );
              })()}

              {/* Dublar Char Coastal Landmark */}
              {(() => {
                const pt = projection(BAY_OF_BENGAL_FEATURES.dublarChar.center as [number, number]);
                if (!pt) return null;
                return (
                  <text
                    x={pt[0]}
                    y={pt[1]}
                    fill={isDay ? '#0284c7' : '#38bdf8'}
                    fontSize="9"
                    fontFamily="monospace"
                    fontStyle="italic"
                    fontWeight="600"
                    stroke={isDay ? '#ffffff' : '#000000'}
                    strokeWidth="2"
                    paintOrder="stroke"
                  >
                    {isBangla ? BAY_OF_BENGAL_FEATURES.dublarChar.labelBn : BAY_OF_BENGAL_FEATURES.dublarChar.label}
                  </text>
                );
              })()}

              {/* Swatch of No Ground Submarine Canyon Vortex */}
              {(() => {
                const pt = projection(BAY_OF_BENGAL_FEATURES.swatchOfNoGround.center as [number, number]);
                if (!pt) return null;
                return (
                  <g transform={`translate(${pt[0]}, ${pt[1]})`}>
                    <ellipse rx="38" ry="22" transform="rotate(-25)" fill="url(#canyonGradient)" opacity="0.65" />
                    <ellipse rx="38" ry="22" transform="rotate(-25)" fill="none" stroke={isDay ? '#0284c7' : '#38bdf8'} strokeWidth="1.2" strokeDasharray="4 3" />
                    <ellipse rx="22" ry="12" transform="rotate(-25)" fill="none" stroke={isDay ? '#0369a1' : '#0284c7'} strokeWidth="0.8" strokeDasharray="2 3" />
                    <text y="32" textAnchor="middle" fill={isDay ? '#0284c7' : '#38bdf8'} fontSize="8" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
                      {isBangla ? 'সোয়াচ অব নো গ্রাউন্ড (-১৩৪০মি)' : 'SWATCH OF NO GROUND (-1340m)'}
                    </text>
                  </g>
                );
              })()}

              {/* Bay of Bengal Grand Label (ব ঙ্গো প সা গ র) */}
              <text
                x={dimensions.width * 0.50}
                y={dimensions.height - 24}
                textAnchor="middle"
                fill={mapThemeMode === 'administrative' ? (isDay ? '#0369a1' : '#38bdf8') : isDay ? '#0369a1' : '#38bdf8'}
                fontSize={mapThemeMode === 'administrative' ? '22' : '18'}
                fontFamily="serif, sans-serif"
                fontWeight="900"
                letterSpacing={mapThemeMode === 'administrative' ? '16' : '12'}
                opacity={mapThemeMode === 'administrative' ? '0.85' : '0.4'}
                stroke={isDay ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'}
                strokeWidth="2"
                paintOrder="stroke"
              >
                {isBangla ? 'ব ঙ্গো প সা গ র' : 'B A Y   O F   B E N G A L'}
              </text>
            </g>
          )}

          {/* 
            ====================================================================
            RADAR MODE SPECIFIC: HEATMAPS & ROTATING 360° SWEEP BEAM
            ====================================================================
          */}
          {mapThemeMode === 'radar' && showHeatmaps && (
            <g className="heatmaps-layer pointer-events-none">
              <circle cx={lockedPoint.x} cy={lockedPoint.y} r="165" fill="url(#heatGlowCritical)" />
              {(() => {
                const sylhetPt = projection([91.8687, 24.6949]);
                return sylhetPt && <circle cx={sylhetPt[0]} cy={sylhetPt[1]} r="110" fill="url(#heatGlowMedium)" />;
              })()}
            </g>
          )}

          {mapThemeMode === 'radar' && isRadarActive && (
            <g className="radar-sweep-layer pointer-events-none">
              {[75, 140, 210].map((radius, idx) => (
                <circle
                  key={`ring-${idx}`}
                  cx={lockedPoint.x}
                  cy={lockedPoint.y}
                  r={radius}
                  fill="none"
                  stroke={idx === 1 ? 'rgba(239, 68, 68, 0.45)' : 'rgba(255, 255, 255, 0.22)'}
                  strokeWidth="1.2"
                  strokeDasharray={idx === 1 ? '5 5' : '3 6'}
                />
              ))}

              <circle cx={lockedPoint.x} cy={lockedPoint.y} r={radarSweepRadius} fill="none" stroke="rgba(239, 68, 68, 0.65)" strokeWidth="1.4" strokeDasharray="6 4" />
              <path d={radarSweepPath} fill="url(#radarSweepGradient)" opacity="0.45" />

              <line
                x1={lockedPoint.x}
                y1={lockedPoint.y}
                x2={endX}
                y2={endY}
                stroke="#ef4444"
                strokeWidth="2.2"
                strokeLinecap="round"
                filter="drop-shadow(0 0 6px #ef4444)"
              />

              <line x1={lockedPoint.x - 14} y1={lockedPoint.y} x2={lockedPoint.x + 14} y2={lockedPoint.y} stroke="#ef4444" strokeWidth="1.6" />
              <line x1={lockedPoint.x} y1={lockedPoint.y - 14} x2={lockedPoint.x} y2={lockedPoint.y + 14} stroke="#ef4444" strokeWidth="1.6" />
              <circle cx={lockedPoint.x} cy={lockedPoint.y} r="4.5" fill="#ffffff" stroke="#ef4444" strokeWidth="2" />
            </g>
          )}

          {/* 
            ====================================================================
            3. BANGLADESH 8 ADMINISTRATIVE DIVISIONS (Authentic GeoBoundaries MultiPolygons)
            Colors matched directly to the uploaded educational map:
            Rangpur (Green), Rajshahi (Coral Red), Mymensingh (Amber Yellow),
            Sylhet (Lime Green), Dhaka (Forest Green), Khulna (Yellow),
            Barishal (Seafoam Teal), Chittagong (Crimson Red).
            ====================================================================
          */}
          <g className="divisions-layer">
            {BANGLADESH_GEOJSON.features.map((feature: any) => {
              const divId = feature.id as string;
              const pathStr = geoPathGenerator(feature);
              const divProfile = BANGLADESH_DIVISIONS.find((d) => d.id === divId);
              const isHovered = hoveredDivisionId === divId;
              const isLocked = lockedHub.divisionId === divId;

              // Authentic colors matching the school textbook map
              let fillColor = divProfile?.color || feature.properties?.adminColor || '#10b981';
              let fillOpacity = 0.92;

              if (mapThemeMode === 'radar') {
                fillColor = isDay ? '#c8dded' : '#14253a';
                if (divId === 'barishal') fillColor = isDay ? '#f8d7da' : '#2a1622';
                if (divId === 'sylhet') fillColor = isDay ? '#fef3c7' : '#232018';
                if (divId === 'dhaka') fillColor = isDay ? '#dbeafe' : '#162338';
                if (divId === 'rangpur') fillColor = isDay ? '#d1fae5' : '#122625';
                fillOpacity = isHovered ? 0.95 : isLocked ? 0.9 : 0.72;
              } else {
                // Administrative Atlas Mode
                fillOpacity = isHovered ? 1.0 : isLocked ? 0.96 : 0.92;
              }

              return (
                <path
                  key={divId}
                  d={pathStr || ''}
                  fill={fillColor}
                  fillOpacity={fillOpacity}
                  stroke={
                    mapThemeMode === 'administrative'
                      ? '#ffffff'
                      : isLocked
                      ? '#ef4444'
                      : isHovered
                      ? '#38bdf8'
                      : isDay
                      ? 'rgba(255, 255, 255, 0.95)'
                      : 'rgba(56, 189, 248, 0.45)'
                  }
                  strokeWidth={
                    mapThemeMode === 'administrative'
                      ? isHovered
                        ? 3.2
                        : 2.2
                      : isLocked
                      ? 2.4
                      : isHovered
                      ? 2.0
                      : 1.2
                  }
                  strokeLinejoin="round"
                  className="transition-all duration-150 cursor-pointer"
                  onMouseEnter={(e) => {
                    setHoveredDivisionId(divId);
                    if (divProfile) {
                      setTooltipData({
                        visible: true,
                        x: e.clientX,
                        y: e.clientY,
                        division: divProfile,
                      });
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredDivisionId(null);
                    setTooltipData((prev) => ({ ...prev, visible: false }));
                  }}
                  onClick={() => {
                    if (divProfile) handleSelectDivision(divProfile);
                  }}
                />
              );
            })}
          </g>

          {/* 
            ====================================================================
            4. MAJOR RIVER NETWORKS & DELTA CHANNELS (Padma, Jamuna, Meghna, Teesta, etc.)
            ====================================================================
          */}
          {showRivers && (
            <g className="rivers-layer pointer-events-none">
              {BANGLADESH_RIVERS.map((river) => {
                const riverLineGen = d3
                  .line<[number, number]>()
                  .x((d) => projection(d)![0])
                  .y((d) => projection(d)![1])
                  .curve(d3.curveBasis);
                const pathStr = riverLineGen(river.path as [number, number][]);
                const isMajor = river.id === 'padma' || river.id === 'jamuna' || river.id === 'meghna';
                return (
                  pathStr && (
                    <g key={river.id}>
                      {/* White water outline for high contrast */}
                      <path
                        d={pathStr}
                        fill="none"
                        stroke={isDay ? '#ffffff' : '#0f172a'}
                        strokeWidth={isMajor ? 4.5 : 3.0}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.8"
                      />
                      {/* River blue water core */}
                      <path
                        d={pathStr}
                        fill="none"
                        stroke={mapThemeMode === 'administrative' ? '#38bdf8' : isDay ? '#38bdf8' : '#0284c7'}
                        strokeWidth={isMajor ? 3.0 : 1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.95"
                      />
                    </g>
                  )
                );
              })}

              {/* River Annotation Labels */}
              {BAY_OF_BENGAL_FEATURES.riverAnnotations.map((anno) => {
                const pt = projection(anno.coords as [number, number]);
                if (!pt) return null;
                return (
                  <text
                    key={anno.name}
                    x={pt[0]}
                    y={pt[1]}
                    fill={mapThemeMode === 'administrative' ? '#0369a1' : isDay ? '#0284c7' : '#38bdf8'}
                    fontSize="9"
                    fontFamily="serif, sans-serif"
                    fontStyle="italic"
                    fontWeight="700"
                    stroke={isDay ? '#ffffff' : '#000000'}
                    strokeWidth="2.5"
                    paintOrder="stroke"
                  >
                    {isBangla ? anno.nameBn : anno.name}
                  </text>
                );
              })}
            </g>
          )}

          {/* 
            ====================================================================
            5. LARGE BENGALI DIVISION LABELS (রংপুর, রাজশাহী, ঢাকা, etc.)
            Centrally placed in each division matching the textbook reference map
            ====================================================================
          */}
          <g className="division-titles pointer-events-auto select-none">
            {BANGLADESH_DIVISIONS.map((div) => {
              const pt = projection(div.center);
              if (!pt) return null;
              const isLocked = lockedHub.divisionId === div.id;
              const isHovered = hoveredDivisionId === div.id;

              return (
                <g
                  key={`div-title-${div.id}`}
                  transform={`translate(${pt[0] + (div.labelOffset?.[0] || 0)}, ${
                    pt[1] + (div.labelOffset?.[1] || 0)
                  })`}
                  className="cursor-pointer transition-transform duration-150"
                  onClick={() => handleSelectDivision(div)}
                  onMouseEnter={() => setHoveredDivisionId(div.id)}
                  onMouseLeave={() => setHoveredDivisionId(null)}
                >
                  {/* Division Name Heading in Bengali */}
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    fill={
                      mapThemeMode === 'administrative'
                        ? '#ffffff'
                        : isLocked
                        ? '#ffffff'
                        : isDay
                        ? '#0f172a'
                        : '#f8fafc'
                    }
                    fontSize={mapThemeMode === 'administrative' ? (div.id === 'dhaka' || div.id === 'chittagong' ? '22' : '20') : '14'}
                    fontWeight="900"
                    fontFamily="serif, sans-serif"
                    letterSpacing="1"
                    stroke={mapThemeMode === 'administrative' ? 'rgba(0, 0, 0, 0.85)' : isDay ? '#ffffff' : '#000000'}
                    strokeWidth={mapThemeMode === 'administrative' ? '4.0' : '2.5'}
                    paintOrder="stroke"
                    strokeLinejoin="round"
                    className="filter drop-shadow-md"
                  >
                    {isBangla ? div.nameBn : div.name}
                  </text>

                  {/* Subtitle / Risk score badge in Radar Mode */}
                  {mapThemeMode === 'radar' && (
                    <text
                      x="0"
                      y="14"
                      textAnchor="middle"
                      fill={getRiskColor(div.riskScore)}
                      fontSize="9"
                      fontWeight="800"
                      fontFamily="monospace"
                      stroke={isDay ? '#ffffff' : '#000000'}
                      strokeWidth="2"
                      paintOrder="stroke"
                    >
                      {div.riskScore}/100
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* 
            ====================================================================
            6. ALL 64 DISTRICTS OF BANGLADESH (Pins & Authentic Bengali Labels)
            Matching the uploaded educational textbook map exactly
            ====================================================================
          */}
          {showDistricts && (
            <g className="districts-layer pointer-events-auto">
              {filteredDistricts.map((dist) => {
                const pt = projection(dist.coordinates);
                if (!pt) return null;
                const isSelected = selectedDistrictId === dist.id;
                const isHovered = hoveredDistrictId === dist.id;
                const color = getRiskColor(dist.riskScore);

                return (
                  <g
                    key={dist.id}
                    transform={`translate(${pt[0]}, ${pt[1]})`}
                    className="cursor-pointer group"
                    onClick={() => handleSelectDistrict(dist)}
                    onMouseEnter={(e) => {
                      setHoveredDistrictId(dist.id);
                      setTooltipData({
                        visible: true,
                        x: e.clientX,
                        y: e.clientY,
                        district: dist,
                      });
                    }}
                    onMouseLeave={() => {
                      setHoveredDistrictId(null);
                      setTooltipData((prev) => ({ ...prev, visible: false }));
                    }}
                  >
                    {/* Pulsing ring on selected district */}
                    {isSelected && (
                      <circle
                        r="10"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1.8"
                        className="animate-ping opacity-75"
                      />
                    )}

                    {/* Small pinpoint dot */}
                    <circle
                      r={isSelected ? 4.5 : isHovered ? 4 : 2.5}
                      fill={
                        mapThemeMode === 'administrative'
                          ? isSelected
                            ? '#ffffff'
                            : '#0f172a'
                          : color
                      }
                      stroke={
                        mapThemeMode === 'administrative'
                          ? isSelected
                            ? '#ef4444'
                            : '#ffffff'
                          : '#ffffff'
                      }
                      strokeWidth={isSelected ? 2.0 : 1.0}
                      filter="drop-shadow(0 1px 3px rgba(0,0,0,0.4))"
                    />

                    {/* District Bengali Label with Zero-Collision Anchoring */}
                    <text
                      x={dist.dx ?? 5}
                      y={dist.dy ?? 3}
                      textAnchor={dist.anchor ?? 'start'}
                      fill={
                        mapThemeMode === 'administrative'
                          ? isSelected
                            ? '#ffffff'
                            : isHovered
                            ? '#ffffff'
                            : '#0f172a'
                          : isDay
                          ? '#0f172a'
                          : '#f8fafc'
                      }
                      fontSize={isSelected ? '11.5' : isHovered ? '10.5' : '9.5'}
                      fontWeight={isSelected ? '900' : isHovered ? '800' : '700'}
                      fontFamily="serif, sans-serif"
                      stroke={
                        mapThemeMode === 'administrative'
                          ? isSelected
                            ? '#ef4444'
                            : 'rgba(255, 255, 255, 0.95)'
                          : isDay
                          ? '#ffffff'
                          : '#000000'
                      }
                      strokeWidth={isSelected ? '3.5' : '2.5'}
                      paintOrder="stroke"
                      strokeLinejoin="round"
                      className="select-none pointer-events-none transition-all duration-100"
                    >
                      {isBangla ? dist.nameBn : dist.name}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 
            ====================================================================
            7. TRADITIONAL 8-POINT BENGALI COMPASS ROSE (Top-Right)
            Matching the authentic reference map:
                    উ:
               প: ✣ পূ:
                    দ:
            ====================================================================
          */}
          <g
            className="bengali-compass-rose pointer-events-none select-none"
            transform={`translate(${dimensions.width - 70}, 85)`}
          >
            {/* Outer Compass Circle Ring */}
            <circle
              r="28"
              fill={mapThemeMode === 'administrative' ? (isDay ? 'rgba(255,255,255,0.7)' : 'rgba(15,23,42,0.7)') : 'transparent'}
              stroke={isDay ? '#334155' : '#94a3b8'}
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
            <circle
              r="22"
              fill="none"
              stroke={isDay ? '#334155' : '#94a3b8'}
              strokeWidth="0.8"
            />

            {/* 8-Pointed Nautical Star (Faceted alternating triangles) */}
            {/* North Point */}
            <polygon points="0,0 -4,-8 0,-24" fill={isDay ? '#0f172a' : '#f8fafc'} />
            <polygon points="0,0 4,-8 0,-24" fill={isDay ? '#94a3b8' : '#475569'} />

            {/* South Point */}
            <polygon points="0,0 -4,8 0,24" fill={isDay ? '#94a3b8' : '#475569'} />
            <polygon points="0,0 4,8 0,24" fill={isDay ? '#0f172a' : '#f8fafc'} />

            {/* East Point */}
            <polygon points="0,0 8,-4 24,0" fill={isDay ? '#0f172a' : '#f8fafc'} />
            <polygon points="0,0 8,4 24,0" fill={isDay ? '#94a3b8' : '#475569'} />

            {/* West Point */}
            <polygon points="0,0 -8,-4 -24,0" fill={isDay ? '#94a3b8' : '#475569'} />
            <polygon points="0,0 -8,4 -24,0" fill={isDay ? '#0f172a' : '#f8fafc'} />

            {/* NE, NW, SE, SW Minor Points */}
            <polygon points="0,0 4,-4 14,-14" fill={isDay ? '#64748b' : '#cbd5e1'} />
            <polygon points="0,0 -4,-4 -14,-14" fill={isDay ? '#64748b' : '#cbd5e1'} />
            <polygon points="0,0 4,4 14,14" fill={isDay ? '#64748b' : '#cbd5e1'} />
            <polygon points="0,0 -4,4 -14,14" fill={isDay ? '#64748b' : '#cbd5e1'} />

            {/* Center Pivot Pin */}
            <circle r="3.5" fill="#ffffff" stroke={isDay ? '#0f172a' : '#f8fafc'} strokeWidth="1.5" />

            {/* Traditional Bengali Directional Labels: উ:, দ:, পূ:, প: */}
            {/* North (উ:) */}
            <text
              x="0"
              y="-34"
              textAnchor="middle"
              fill={isDay ? '#0f172a' : '#f8fafc'}
              fontSize="14"
              fontWeight="900"
              fontFamily="serif, sans-serif"
              stroke={isDay ? '#ffffff' : '#000000'}
              strokeWidth="2"
              paintOrder="stroke"
            >
              উ:
            </text>

            {/* South (দ:) */}
            <text
              x="0"
              y="42"
              textAnchor="middle"
              fill={isDay ? '#0f172a' : '#f8fafc'}
              fontSize="14"
              fontWeight="900"
              fontFamily="serif, sans-serif"
              stroke={isDay ? '#ffffff' : '#000000'}
              strokeWidth="2"
              paintOrder="stroke"
            >
              দ:
            </text>

            {/* East (পূ:) */}
            <text
              x="38"
              y="5"
              textAnchor="start"
              fill={isDay ? '#0f172a' : '#f8fafc'}
              fontSize="14"
              fontWeight="900"
              fontFamily="serif, sans-serif"
              stroke={isDay ? '#ffffff' : '#000000'}
              strokeWidth="2"
              paintOrder="stroke"
            >
              পূ:
            </text>

            {/* West (প:) */}
            <text
              x="-38"
              y="5"
              textAnchor="end"
              fill={isDay ? '#0f172a' : '#f8fafc'}
              fontSize="14"
              fontWeight="900"
              fontFamily="serif, sans-serif"
              stroke={isDay ? '#ffffff' : '#000000'}
              strokeWidth="2"
              paintOrder="stroke"
            >
              প:
            </text>
          </g>
        </g>
      </svg>

      {/* 
        ========================================================================
        8. TOP-LEFT CONTROL PANEL & MODE SWITCHER
        ========================================================================
      */}
      <div className="absolute top-3.5 left-3.5 z-30 flex flex-col gap-2 max-w-[280px] sm:max-w-[330px]">
        {/* Core Mode Switcher Pill */}
        <div
          className={`p-1 rounded-[10px] border shadow-xl backdrop-blur-xl flex items-center gap-1 ${
            isDay ? 'bg-white/95 border-slate-300' : 'bg-[#0f172a]/95 border-white/20'
          }`}
        >
          <button
            onClick={() => setMapThemeMode('administrative')}
            className={`flex-1 py-1.5 px-2.5 rounded-[7px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mapThemeMode === 'administrative'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isBangla ? 'প্রশাসনিক মানচিত্র' : 'Administrative'}</span>
          </button>

          <button
            onClick={() => setMapThemeMode('radar')}
            className={`flex-1 py-1.5 px-2.5 rounded-[7px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mapThemeMode === 'radar'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{isBangla ? 'হুমকি রাডার' : 'Threat Radar'}</span>
          </button>
        </div>

        {/* Radar Telemetry Dossier (Shown in Radar Mode) */}
        {mapThemeMode === 'radar' && (
          <div
            className={`p-3.5 rounded-[12px] backdrop-blur-xl border-[1.5px] shadow-2xl transition-colors duration-200 ${
              isDay
                ? 'bg-white/95 border-cyan-400 text-slate-900 shadow-cyan-900/15'
                : 'bg-[#08101d]/95 border-cyan-400 text-slate-100 shadow-[0_0_25px_rgba(6,182,212,0.25)]'
            }`}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ff2a6d]" />
                </span>
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#ff2a6d]">
                  360° {isBangla ? 'আঞ্চলিক টেলিমিতি' : 'REGIONAL TELEMETRY'}
                </span>
              </div>

              <button
                onClick={() => setIsRadarActive((prev) => !prev)}
                className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
                title={isRadarActive ? 'Pause Radar Sweep' : 'Resume Radar Sweep'}
              >
                {isRadarActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)] font-medium">Target Lock:</span>
                <span className="font-bold text-[#ff2a6d]">
                  {isBangla ? lockedHub.nameBn : lockedHub.name}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)] font-medium">Range / Scan:</span>
                <span className="font-semibold text-emerald-500">155 km · {radarRpm} RPM</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)] font-medium">Threat Vector:</span>
                <span className="font-bold text-amber-500">{lockedHub.threatVector}</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5 text-[10px]">
                <span className="text-[var(--color-text-secondary)]">Active Disputes:</span>
                <span className="font-bold text-[var(--color-text-primary)]">
                  {lockedHub.activeDisputes} {isBangla ? 'টি দাগ' : 'dags'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[var(--color-text-secondary)]">Prevented Exposure:</span>
                <span className="font-bold text-emerald-500">
                  ৳ {lockedHub.preventedCr} {isBangla ? 'কোটি' : 'Cr BDT'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Layer Toggles & District Quick Search */}
        <div
          className={`p-2.5 rounded-[10px] border shadow-xl backdrop-blur-xl space-y-2 ${
            isDay ? 'bg-white/95 border-slate-300' : 'bg-[#0f172a]/95 border-white/20'
          }`}
        >
          {/* Quick Division Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <select
              value={filterDivisionId}
              onChange={(e) => setFilterDivisionId(e.target.value)}
              className="w-full text-xs font-semibold py-1 px-2 rounded bg-black/5 dark:bg-white/10 border border-[var(--color-border-subtle)] focus:outline-none focus:border-sky-500 text-[var(--color-text-primary)] cursor-pointer"
            >
              <option value="ALL">{isBangla ? 'সকল বিভাগ (৮টি)' : 'All 8 Divisions'}</option>
              {BANGLADESH_DIVISIONS.map((div) => (
                <option key={div.id} value={div.id}>
                  {isBangla ? div.nameBn : div.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Layer Switch Buttons */}
          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-medium">
            <button
              onClick={() => setShowDistricts((prev) => !prev)}
              className={`py-1 px-2 rounded border flex items-center justify-between transition-colors cursor-pointer ${
                showDistricts
                  ? 'bg-sky-500/15 border-sky-500/40 text-sky-500'
                  : 'bg-black/5 dark:bg-white/5 border-transparent text-[var(--color-text-secondary)]'
              }`}
            >
              <span>{isBangla ? '৬৪ জেলা' : '64 Districts'}</span>
              {showDistricts ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </button>

            <button
              onClick={() => setShowRivers((prev) => !prev)}
              className={`py-1 px-2 rounded border flex items-center justify-between transition-colors cursor-pointer ${
                showRivers
                  ? 'bg-sky-500/15 border-sky-500/40 text-sky-500'
                  : 'bg-black/5 dark:bg-white/5 border-transparent text-[var(--color-text-secondary)]'
              }`}
            >
              <span>{isBangla ? 'নদীনালা' : 'Rivers'}</span>
              {showRivers ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        9. TOP-RIGHT CONTROLS: ZOOM, RESET, & 4-WAY D-PAD
        ========================================================================
      */}
      <div className="absolute top-3.5 right-3.5 z-30 flex flex-col items-center gap-2">
        {/* Reset North Compass Button */}
        <button
          onClick={handleResetView}
          className={`w-9 h-9 rounded-full flex flex-col items-center justify-center border shadow-lg backdrop-blur-md transition-transform hover:scale-105 cursor-pointer ${
            isDay ? 'bg-white/90 border-slate-300 text-slate-800' : 'bg-[#0f172a]/90 border-white/20 text-white'
          }`}
          title="Reset to North Orientation"
          aria-label="Compass: Reset to North orientation"
        >
          <Compass className="w-4 h-4 text-sky-400" />
          <span className="text-[8.5px] font-mono font-bold leading-none -mt-0.5">N</span>
        </button>

        {/* Zoom In (+) / Zoom Out (-) / Reset Controls Group */}
        <div
          className={`flex flex-col items-center rounded-[6px] border shadow-lg backdrop-blur-md overflow-hidden ${
            isDay ? 'bg-white/90 border-slate-300' : 'bg-[#0f172a]/90 border-white/20'
          }`}
        >
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 flex items-center justify-center hover:bg-white/20 text-[var(--color-text-primary)] transition-colors cursor-pointer"
            title="Zoom In (+)"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-full h-px bg-white/10" />
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 flex items-center justify-center hover:bg-white/20 text-[var(--color-text-primary)] transition-colors cursor-pointer"
            title="Zoom Out (-)"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-full h-px bg-white/10" />
          <button
            onClick={handleResetView}
            className="w-8 h-8 flex items-center justify-center hover:bg-white/20 text-[var(--color-text-primary)] transition-colors cursor-pointer"
            title="Reset Pan & Zoom"
            aria-label="Reset zoom and center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4-Way Pan Navigation D-Pad */}
        <div
          className={`p-1 rounded-[6px] border shadow-lg backdrop-blur-md flex flex-col items-center gap-0.5 ${
            isDay ? 'bg-white/90 border-slate-300' : 'bg-[#0f172a]/90 border-white/20'
          }`}
        >
          <button
            onClick={() => handlePan(0, 50)}
            className="w-6 h-5 flex items-center justify-center hover:bg-white/20 text-[var(--color-text-primary)] rounded cursor-pointer"
            title="Pan Up"
            aria-label="Pan up"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => handlePan(50, 0)}
              className="w-5 h-6 flex items-center justify-center hover:bg-white/20 text-[var(--color-text-primary)] rounded cursor-pointer"
              title="Pan Left"
              aria-label="Pan left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetView}
              className="w-5 h-5 flex items-center justify-center hover:bg-white/20 text-[var(--color-text-primary)] rounded cursor-pointer"
              title="Center View"
              aria-label="Center view"
            >
              <Dot className="w-4 h-4 text-sky-400" />
            </button>
            <button
              onClick={() => handlePan(-50, 0)}
              className="w-5 h-6 flex items-center justify-center hover:bg-white/20 text-[var(--color-text-primary)] rounded cursor-pointer"
              title="Pan Right"
              aria-label="Pan right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={() => handlePan(0, -50)}
            className="w-6 h-5 flex items-center justify-center hover:bg-white/20 text-[var(--color-text-primary)] rounded cursor-pointer"
            title="Pan Down"
            aria-label="Pan down"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 
        ========================================================================
        10. FLOATING CYCLONE ALERT BADGE (Bottom Coast)
        ========================================================================
      */}
      {isAlertVisible && (
        <div className="absolute top-[75%] left-[62%] -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto">
          <div className="px-3.5 py-1.5 rounded-full bg-[#08101d]/95 border border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.35)] flex items-center gap-2 font-mono text-[11px] text-white backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
            <span className="font-bold text-red-400">CYCLONE:</span>
            <span className="text-slate-200">48km/h · 2.8m SURGE</span>
            <button
              onClick={() => setIsAlertVisible(false)}
              className="ml-1 text-slate-400 hover:text-white cursor-pointer"
              aria-label="Dismiss alert"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        11. BOTTOM-LEFT SCALE BAR & SCOPE
        ========================================================================
      */}
      <div className="absolute bottom-3.5 left-3.5 z-30">
        <div
          className={`px-3.5 py-2 rounded-[8px] border shadow-xl backdrop-blur-md font-mono text-xs ${
            isDay ? 'bg-white/92 border-slate-300 text-slate-900' : 'bg-[#0f172a]/90 border-white/20 text-white'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="font-semibold text-[11.5px]">
              {isBangla ? 'জাতীয় পরিসর' : 'National Scope'}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
              {zoomLevel.toFixed(1)}x
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-[9px] text-[var(--color-text-secondary)]">
              <span>0</span>
              <span className="font-bold text-[var(--color-text-primary)]">100 km</span>
              <span>(62 mi)</span>
            </div>
            <div className="w-36 h-1.5 bg-slate-700/50 rounded-xs flex overflow-hidden border border-white/20">
              <div className="w-1/2 h-full bg-sky-400" />
              <div className="w-1/2 h-full bg-white/70" />
            </div>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        12. BOTTOM-RIGHT LEGEND
        ========================================================================
      */}
      <div className="absolute bottom-3.5 right-3.5 z-30">
        <div
          className={`px-3.5 py-2.5 rounded-[8px] border shadow-xl backdrop-blur-md font-mono text-xs max-w-[260px] ${
            isDay ? 'bg-white/92 border-slate-300 text-slate-900' : 'bg-[#0f172a]/90 border-white/20 text-white'
          }`}
        >
          {mapThemeMode === 'administrative' ? (
            <div className="space-y-1.5">
              <div className="font-bold text-[11px] flex items-center justify-between">
                <span>{isBangla ? 'প্রশাসনিক বিভাগ সূচক' : 'Division Palette Index'}</span>
                <Layers className="w-3 h-3 text-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] border border-white" />
                  <span>রংপুর</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] border border-white" />
                  <span>রাজশাহী</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] border border-white" />
                  <span>ময়মনসিংহ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#84cc16] border border-white" />
                  <span>সিলেট</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#059669] border border-white" />
                  <span>ঢাকা</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#eab308] border border-white" />
                  <span>খুলনা</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#14b8a6] border border-white" />
                  <span>বরিশাল</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626] border border-white" />
                  <span>চট্টগ্রাম</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="font-bold text-[11px] flex items-center justify-between">
                <span>{isBangla ? 'সমন্বিত ঝুঁকি ও ঘনত্ব' : 'Combined Risk & Density'}</span>
                <Activity className="w-3 h-3 text-red-400" />
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden shadow-inner bg-slate-800"
                style={{
                  background:
                    'linear-gradient(to right, #10b981 0%, #38bdf8 30%, #3b82f6 55%, #f59e0b 75%, #ef4444 100%)',
                }}
              />
              <div className="flex items-center justify-between text-[9px] text-[var(--color-text-secondary)] mt-1 font-semibold">
                <span className="text-emerald-500">0 {isBangla ? 'নিরাপদ' : 'Safe'}</span>
                <span className="text-amber-500">50 {isBangla ? 'মাঝারি' : 'Mid'}</span>
                <span className="text-red-500">100 {isBangla ? 'সর্বোচ্চ' : 'Peak'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
