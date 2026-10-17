/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Probaho — Bangladesh National Risk & 360° Regional Radar D3.js Map
 * Accurate WGS84 GIS Projection, Rotating Sweep Beam, Risk Heatmaps,
 * Division Badges, Oceanic Bathymetry, and Real-Time Cadastral Threat Telemetry.
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import {
  BANGLADESH_DIVISIONS,
  BANGLADESH_GEOJSON,
  BANGLADESH_RIVERS,
  BAY_OF_BENGAL_FEATURES,
  NATIONAL_HUBS,
  NEIGHBOR_REGIONS,
  NationalHub,
  DivisionProfile,
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
} from 'lucide-react';

export interface BangladeshNationalRiskRadarMapProps {
  className?: string;
  height?: string | number;
  initialLockedHubId?: string;
  onSelectHub?: (hub: NationalHub) => void;
  onSelectDivision?: (division: DivisionProfile) => void;
}

export const BangladeshNationalRiskRadarMap: React.FC<BangladeshNationalRiskRadarMapProps> = ({
  className = '',
  height = '720px',
  initialLockedHubId = 'patuakhali',
  onSelectHub,
  onSelectDivision,
}) => {
  const { isBangla } = useLanguage();
  const { isDay } = useTheme();

  // Container & SVG references
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gZoomRef = useRef<SVGGElement>(null);

  // Map viewport dimensions
  const [dimensions, setDimensions] = useState({ width: 960, height: 720 });
  const [zoomLevel, setZoomLevel] = useState(1.0);

  // Target lock state
  const [lockedHubId, setLockedHubId] = useState<string>(initialLockedHubId);
  const [hoveredDivisionId, setHoveredDivisionId] = useState<string | null>(null);
  const [hoveredHubId, setHoveredHubId] = useState<string | null>(null);

  // Radar Animation States
  const [isRadarActive, setIsRadarActive] = useState<boolean>(true);
  const [radarRpm, setRadarRpm] = useState<number>(10); // 10 RPM as seen in screenshot
  const [radarAngle, setRadarAngle] = useState<number>(135);

  // Layer Toggles
  const [showHeatmaps, setShowHeatmaps] = useState<boolean>(true);
  const [showBathymetry, setShowBathymetry] = useState<boolean>(true);
  const [showRivers, setShowRivers] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // Alert Banner State
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(true);

  // D3 Zoom behavior reference
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const currentTransformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);

  // Active locked hub object
  const lockedHub = useMemo(() => {
    return NATIONAL_HUBS.find((h) => h.id === lockedHubId) || NATIONAL_HUBS[0];
  }, [lockedHubId]);

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
    if (!isRadarActive) return;
    let animId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      // Degrees per second = RPM * 360 / 60 = RPM * 6
      const degreesPerSec = radarRpm * 6;
      setRadarAngle((prev) => (prev + degreesPerSec * delta) % 360);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isRadarActive, radarRpm]);

  // Calibrate D3 Projection for Bangladesh
  const projection = useMemo(() => {
    const { width, height } = dimensions;
    // Center of Bangladesh: 90.35° E, 23.75° N
    return d3
      .geoMercator()
      .center([90.35, 23.75])
      .scale(Math.min(width, height) * 6.2)
      .translate([width / 2, height / 2 - 20]);
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
      .scaleExtent([0.75, 6.0])
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

  // Color mapping by risk score
  const getRiskColor = (score: number) => {
    if (score >= 80) return '#ef4444'; // Red-500 Critical
    if (score >= 65) return '#f97316'; // Orange-500 High
    if (score >= 35) return '#f59e0b'; // Amber-500 Medium
    return '#10b981'; // Emerald-500 Low
  };

  // Nautical Lat/Lng Grid values
  const gridLats = [21, 22, 23, 24, 25, 26];
  const gridLngs = [88, 89, 90, 91, 92];

  // Radial sweep cone generator path
  const radarSweepRadius = 260;
  const sweepAngleDeg = 48; // Width of sweep cone
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
      className={`relative w-full rounded-[10px] overflow-hidden border border-[var(--color-border-subtle)] select-none shadow-2xl transition-colors duration-200 ${
        isDay ? 'bg-[#eef3f8]' : 'bg-[#080d16]'
      } ${className}`}
      style={{ height }}
    >
      {/* 
        ========================================================================
        1. MAIN D3 INTERACTIVE SVG CANVAS
        ========================================================================
      */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      >
        <defs>
          {/* Subtle Lat/Long Grid Pattern */}
          <pattern id="nauticalGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke={isDay ? 'rgba(0, 70, 140, 0.07)' : 'rgba(56, 189, 248, 0.08)'}
              strokeWidth="0.8"
            />
          </pattern>

          {/* Oceanic Deep Depth Gradient (Bay of Bengal) */}
          <linearGradient id="oceanGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isDay ? '#d0e5f5' : '#081728'} stopOpacity="0.4" />
            <stop offset="40%" stopColor={isDay ? '#b8d8ef' : '#04101e'} stopOpacity="0.8" />
            <stop offset="100%" stopColor={isDay ? '#9ec7e6' : '#020b16'} stopOpacity="1.0" />
          </linearGradient>

          {/* High-Risk Epicenter Heatmap Glow Gradient (Patuakhali / Barishal) */}
          <radialGradient id="heatGlowCritical" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#f97316" stopOpacity="0.45" />
            <stop offset="75%" stopColor="#eab308" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>

          {/* Medium Risk Gradient (Sylhet) */}
          <radialGradient id="heatGlowMedium" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>

          {/* Radar Sweep Wedge Linear/Radial Gradient */}
          <radialGradient id="radarSweepGradient" cx="0%" cy="0%" r="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#f97316" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#22c55e" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>

          {/* Swatch of No Ground Submarine Canyon Vortex Gradient */}
          <radialGradient id="canyonGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={isDay ? '#0284c7' : '#0369a1'} stopOpacity="0.85" />
            <stop offset="60%" stopColor={isDay ? '#38bdf8' : '#075985'} stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Dynamic Zoom & Pan Root Container */}
        <g ref={gZoomRef}>
          {/* Nautical Grid Background */}
          {showGrid && (
            <rect
              x="-2000"
              y="-2000"
              width="5000"
              height="5000"
              fill="url(#nauticalGrid)"
              className="pointer-events-none"
            />
          )}

          {/* Bay of Bengal Base Water Body */}
          <rect
            x="-500"
            y={dimensions.height * 0.62}
            width={dimensions.width + 1000}
            height={dimensions.height * 0.8}
            fill="url(#oceanGradient)"
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
            NEIGHBORING TERRITORY LABELS (India & Myanmar)
            ====================================================================
          */}
          <g className="neighbor-labels pointer-events-none select-none">
            {NEIGHBOR_REGIONS.map((reg) => {
              const pt = projection(reg.coords as [number, number]);
              if (!pt) return null;
              return (
                <g key={reg.sub} transform={`translate(${pt[0]}, ${pt[1]})`}>
                  <text
                    textAnchor={reg.align as any}
                    fill={isDay ? '#64748b' : '#475569'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="700"
                    letterSpacing="2"
                    opacity="0.7"
                  >
                    {reg.name}
                  </text>
                  <text
                    y="12"
                    textAnchor={reg.align as any}
                    fill={isDay ? '#94a3b8' : '#334155'}
                    fontSize="9"
                    fontFamily="monospace"
                    opacity="0.7"
                  >
                    {reg.sub}
                  </text>
                </g>
              );
            })}
          </g>

          {/* 
            ====================================================================
            BAY OF BENGAL BATHYMETRY (Shelf & Isobath Curves)
            ====================================================================
          */}
          {showBathymetry && (
            <g className="bathymetry-layer pointer-events-none select-none">
              {/* -20m Shelf Curve */}
              {(() => {
                const shelfLineGenerator = d3
                  .line<[number, number]>()
                  .x((d) => projection(d)![0])
                  .y((d) => projection(d)![1])
                  .curve(d3.curveBasis);
                const pathStr = shelfLineGenerator(BAY_OF_BENGAL_FEATURES.shelf20m as [number, number][]);
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
                const isobathLineGenerator = d3
                  .line<[number, number]>()
                  .x((d) => projection(d)![0])
                  .y((d) => projection(d)![1])
                  .curve(d3.curveBasis);
                const pathStr = isobathLineGenerator(BAY_OF_BENGAL_FEATURES.isobath50m as [number, number][]);
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
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontStyle="italic"
                    opacity="0.8"
                  >
                    {isBangla ? BAY_OF_BENGAL_FEATURES.dublarChar.labelBn : BAY_OF_BENGAL_FEATURES.dublarChar.label}
                  </text>
                );
              })()}

              {/* Swatch of No Ground Oceanic Canyon Vortex */}
              {(() => {
                const pt = projection(BAY_OF_BENGAL_FEATURES.swatchOfNoGround.center as [number, number]);
                if (!pt) return null;
                return (
                  <g transform={`translate(${pt[0]}, ${pt[1]})`}>
                    <ellipse
                      rx="38"
                      ry="22"
                      transform="rotate(-25)"
                      fill="url(#canyonGradient)"
                      opacity="0.65"
                    />
                    <ellipse
                      rx="38"
                      ry="22"
                      transform="rotate(-25)"
                      fill="none"
                      stroke={isDay ? '#0284c7' : '#38bdf8'}
                      strokeWidth="1.2"
                      strokeDasharray="4 3"
                    />
                    <ellipse
                      rx="22"
                      ry="12"
                      transform="rotate(-25)"
                      fill="none"
                      stroke={isDay ? '#0369a1' : '#0284c7'}
                      strokeWidth="0.8"
                      strokeDasharray="2 3"
                    />
                    <text
                      y="32"
                      textAnchor="middle"
                      fill={isDay ? '#0284c7' : '#38bdf8'}
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                      letterSpacing="1"
                    >
                      {isBangla ? 'সোয়াচ অব নো গ্রাউন্ড (-১৩৪০মি)' : 'SWATCH OF NO GROUND (-1340m)'}
                    </text>
                  </g>
                );
              })()}

              {/* Bay of Bengal Grand Label */}
              <text
                x={dimensions.width * 0.52}
                y={dimensions.height - 22}
                textAnchor="middle"
                fill={isDay ? '#0369a1' : '#38bdf8'}
                fontSize="18"
                fontFamily="monospace"
                fontWeight="800"
                letterSpacing="12"
                opacity={isDay ? '0.45' : '0.35'}
              >
                {isBangla ? 'ব ঙ্গো প সা গ র' : 'B A Y   O F   B E N G A L'}
              </text>
            </g>
          )}

          {/* 
            ====================================================================
            RADIAL THREAT HEATMAPS / DENSITY HALOS
            ====================================================================
          */}
          {showHeatmaps && (
            <g className="heatmaps-layer pointer-events-none">
              {/* Critical Threat Epicenter (Patuakhali & Barishal Delta) */}
              <circle
                cx={lockedPoint.x}
                cy={lockedPoint.y}
                r="165"
                fill="url(#heatGlowCritical)"
              />

              {/* Sylhet Medium Risk Haor Glow */}
              {(() => {
                const sylhetPt = projection([91.8687, 24.6949]);
                return (
                  sylhetPt && (
                    <circle
                      cx={sylhetPt[0]}
                      cy={sylhetPt[1]}
                      r="110"
                      fill="url(#heatGlowMedium)"
                    />
                  )
                );
              })()}
            </g>
          )}

          {/* 
            ====================================================================
            360° RADAR SWEEP BEAM CONE & CONCENTRIC RANGE RINGS
            ====================================================================
          */}
          {isRadarActive && (
            <g className="radar-sweep-layer pointer-events-none">
              {/* Concentric Distance Range Rings (50km, 100km, 155km) */}
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

              {/* Outer Range Ring (155 km Boundary) */}
              <circle
                cx={lockedPoint.x}
                cy={lockedPoint.y}
                r={radarSweepRadius}
                fill="none"
                stroke="rgba(239, 68, 68, 0.65)"
                strokeWidth="1.4"
                strokeDasharray="6 4"
              />

              {/* Rotating Sweep Beam Cone */}
              <path
                d={radarSweepPath}
                fill="url(#radarSweepGradient)"
                opacity="0.45"
              />

              {/* Leading High-Intensity Radar Beam Line */}
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

              {/* Epicenter Target Crosshairs */}
              <line
                x1={lockedPoint.x - 14}
                y1={lockedPoint.y}
                x2={lockedPoint.x + 14}
                y2={lockedPoint.y}
                stroke="#ef4444"
                strokeWidth="1.6"
              />
              <line
                x1={lockedPoint.x}
                y1={lockedPoint.y - 14}
                x2={lockedPoint.x}
                y2={lockedPoint.y + 14}
                stroke="#ef4444"
                strokeWidth="1.6"
              />
              <circle
                cx={lockedPoint.x}
                cy={lockedPoint.y}
                r="4.5"
                fill="#ffffff"
                stroke="#ef4444"
                strokeWidth="2"
              />
            </g>
          )}

          {/* 
            ====================================================================
            BANGLADESH 8 ADMINISTRATIVE DIVISIONS (GeoJSON Polygons)
            ====================================================================
          */}
          <g className="divisions-layer">
            {BANGLADESH_GEOJSON.features.map((feature: any) => {
              const divId = feature.id as string;
              const pathStr = geoPathGenerator(feature);
              const isHovered = hoveredDivisionId === divId;
              const isLocked = lockedHub.divisionId === divId;

              // Color based on theme and state
              let fillColor = isDay ? '#c8dded' : '#14253a';
              if (divId === 'barishal') fillColor = isDay ? '#f8d7da' : '#2a1622';
              if (divId === 'sylhet') fillColor = isDay ? '#fef3c7' : '#232018';
              if (divId === 'dhaka') fillColor = isDay ? '#dbeafe' : '#162338';
              if (divId === 'rangpur') fillColor = isDay ? '#d1fae5' : '#122625';

              return (
                <path
                  key={divId}
                  d={pathStr || ''}
                  fill={fillColor}
                  fillOpacity={isHovered ? 0.95 : isLocked ? 0.88 : 0.72}
                  stroke={
                    isLocked
                      ? '#ef4444'
                      : isHovered
                      ? '#38bdf8'
                      : isDay
                      ? 'rgba(255, 255, 255, 0.95)'
                      : 'rgba(56, 189, 248, 0.45)'
                  }
                  strokeWidth={isLocked ? 2.4 : isHovered ? 2.0 : 1.2}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredDivisionId(divId)}
                  onMouseLeave={() => setHoveredDivisionId(null)}
                  onClick={() => {
                    const div = BANGLADESH_DIVISIONS.find((d) => d.id === divId);
                    if (div) handleSelectDivision(div);
                  }}
                />
              );
            })}
          </g>

          {/* 
            ====================================================================
            MAJOR RIVER CORRIDORS (Padma, Jamuna, Meghna, Karnaphuli)
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
                return (
                  pathStr && (
                    <path
                      key={river.id}
                      d={pathStr}
                      fill="none"
                      stroke={isDay ? '#38bdf8' : '#0284c7'}
                      strokeWidth={river.id === 'padma' || river.id === 'jamuna' ? 3.4 : 2.4}
                      strokeLinecap="round"
                      opacity="0.85"
                    />
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
                    fill={isDay ? '#0284c7' : '#38bdf8'}
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontStyle="italic"
                    fontWeight="600"
                    opacity="0.8"
                    letterSpacing="0.5"
                  >
                    {isBangla ? anno.nameBn : anno.name}
                  </text>
                );
              })}
            </g>
          )}

          {/* 
            ====================================================================
            DIVISION PILL BADGES (e.g. Rangpur 19/100, Dhaka 28/100, etc.)
            ====================================================================
          */}
          <g className="division-badges pointer-events-auto">
            {BANGLADESH_DIVISIONS.map((div) => {
              const pt = projection(div.center);
              if (!pt) return null;
              const isLocked = lockedHub.divisionId === div.id;
              const isHovered = hoveredDivisionId === div.id;
              const isBarishal = div.id === 'barishal';
              const riskColor = getRiskColor(div.riskScore);

              return (
                <g
                  key={`badge-${div.id}`}
                  transform={`translate(${pt[0] + (div.labelOffset?.[0] || 0)}, ${
                    pt[1] + (div.labelOffset?.[1] || 0)
                  })`}
                  className="cursor-pointer transition-transform duration-150"
                  onClick={() => handleSelectDivision(div)}
                  onMouseEnter={() => setHoveredDivisionId(div.id)}
                  onMouseLeave={() => setHoveredDivisionId(null)}
                >
                  {/* Glassmorphic Pill Box */}
                  <rect
                    x="-48"
                    y="-14"
                    width="96"
                    height="28"
                    rx="14"
                    fill={isBarishal ? '#1e3a5f' : isLocked ? (isDay ? '#1e293b' : '#0f172a') : isDay ? '#ffffff' : '#0f172a'}
                    fillOpacity="0.95"
                    stroke={isBarishal ? '#ffffff' : isLocked ? '#ef4444' : isHovered ? '#38bdf8' : 'rgba(255, 255, 255, 0.6)'}
                    strokeWidth={isBarishal || isLocked ? 2.0 : 1.2}
                    filter="drop-shadow(0 4px 10px rgba(0,0,0,0.35))"
                  />

                  {/* Division Name */}
                  <text
                    x="-2"
                    y={isBarishal ? '3' : '-1'}
                    textAnchor="middle"
                    fill={isBarishal || isLocked ? '#ffffff' : isDay ? '#0f172a' : '#f8fafc'}
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="monospace"
                  >
                    {isBangla ? div.nameBn : div.name}
                  </text>

                  {/* Score pill subscript (for non-Barishal or normal badges) */}
                  {!isBarishal && (
                    <text
                      x="-2"
                      y="9"
                      textAnchor="middle"
                      fill={riskColor}
                      fontSize="8.5"
                      fontWeight="800"
                      fontFamily="monospace"
                    >
                      {div.riskScore}/100
                    </text>
                  )}

                  {/* Status Indicator Dot */}
                  {!isBarishal && (
                    <circle
                      cx="36"
                      cy="0"
                      r="3.5"
                      fill={riskColor}
                      stroke="#ffffff"
                      strokeWidth="1.2"
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* 
            ====================================================================
            REGIONAL HUBS & THREAT NODES (District Level Dots)
            ====================================================================
          */}
          <g className="hubs-layer">
            {NATIONAL_HUBS.map((hub) => {
              const pt = projection(hub.coordinates);
              if (!pt) return null;
              const isLocked = lockedHubId === hub.id;
              const isHovered = hoveredHubId === hub.id;
              const isDhakaMetro = hub.id === 'dhaka-metro';
              const color = getRiskColor(hub.riskScore);

              return (
                <g
                  key={hub.id}
                  transform={`translate(${pt[0]}, ${pt[1]})`}
                  className="cursor-pointer"
                  onClick={() => handleSelectHub(hub)}
                  onMouseEnter={() => setHoveredHubId(hub.id)}
                  onMouseLeave={() => setHoveredHubId(null)}
                >
                  {/* Concentric rings for Dhaka Metro cluster */}
                  {isDhakaMetro && (
                    <>
                      <circle r="12" fill="none" stroke="#22c55e" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.8" />
                      <circle r="8" fill="none" stroke="#22c55e" strokeWidth="1.4" opacity="0.9" />
                      <circle cx="2" cy="-4" r="3.5" fill="#22c55e" stroke="#ffffff" strokeWidth="1.2" />
                      <circle cx="-3" cy="3" r="3" fill="#22c55e" stroke="#ffffff" strokeWidth="1.0" />
                    </>
                  )}

                  {/* Pulsing outer ring on locked hub */}
                  {isLocked && (
                    <circle
                      r="14"
                      fill="none"
                      stroke={color}
                      strokeWidth="1.8"
                      className="animate-ping opacity-75"
                    />
                  )}

                  {/* Outer White Rim */}
                  <circle
                    r={isLocked ? 7 : isHovered ? 6 : 4.5}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth={isLocked ? 2.5 : 1.5}
                    filter="drop-shadow(0 2px 5px rgba(0,0,0,0.45))"
                  />

                  {/* Hub Label Text */}
                  <text
                    x="8"
                    y="3"
                    fill={isDay ? '#0f172a' : '#f8fafc'}
                    fontSize="9.5"
                    fontWeight={isLocked ? '700' : '600'}
                    fontFamily="monospace"
                    stroke={isDay ? '#ffffff' : '#000000'}
                    strokeWidth="2.5"
                    paintOrder="stroke"
                    strokeLinejoin="round"
                    className="select-none pointer-events-none"
                  >
                    {isBangla ? hub.nameBn : hub.name}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {/* 
        ========================================================================
        2. TOP-LEFT HUD CARD: 360° REGIONAL RADAR TELEMETRY
        ========================================================================
      */}
      <div className="absolute top-3.5 left-3.5 z-30 flex flex-col gap-2 max-w-[280px] sm:max-w-[320px]">
        <div
          className={`p-3.5 rounded-[12px] backdrop-blur-xl border-[1.5px] shadow-2xl transition-colors duration-200 ${
            isDay
              ? 'bg-white/95 border-cyan-400 text-slate-900 shadow-cyan-900/15'
              : 'bg-[#08101d]/95 border-cyan-400 text-slate-100 shadow-[0_0_25px_rgba(6,182,212,0.25)]'
          }`}
        >
          {/* Header Row with Spinning Radar Indicator */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ff2a6d]" />
              </span>
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#ff2a6d] flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                <span>360° {isBangla ? 'আঞ্চলিক রাডার' : 'REGIONAL RADAR'}</span>
              </span>
            </div>

            {/* Radar Pause / Play control */}
            <button
              onClick={() => setIsRadarActive((prev) => !prev)}
              className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
              title={isRadarActive ? 'Pause Radar Sweep' : 'Resume Radar Sweep'}
              aria-label={isRadarActive ? 'Pause radar' : 'Resume radar'}
            >
              {isRadarActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Telemetry Metrics List */}
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)] font-medium">Target Lock:</span>
              <span className="font-bold text-[#ff2a6d] flex items-center gap-1">
                <span>{isBangla ? lockedHub.nameBn : lockedHub.name}</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)] font-medium">Range / Scan:</span>
              <span className="font-semibold text-emerald-500">
                155 km · {radarRpm} RPM
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)] font-medium">Threat Vector:</span>
              <span className="font-bold text-amber-500">
                {lockedHub.threatVector}
              </span>
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
      </div>

      {/* 
        ========================================================================
        3. TOP-RIGHT CONTROLS: COMPASS, ZOOM, RESET, & 4-WAY D-PAD
        ========================================================================
      */}
      <div className="absolute top-3.5 right-3.5 z-30 flex flex-col items-center gap-2">
        {/* Circular Compass Rose (N) */}
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
        4. FLOATING THREAT ALERT BADGE (Coastal Cyclone & Surge Alert)
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
        5. BOTTOM-LEFT SCALE BAR WIDGET
        ========================================================================
      */}
      <div className="absolute bottom-3.5 left-3.5 z-30">
        <div
          className={`px-3.5 py-2 rounded-[6px] border shadow-xl backdrop-blur-md font-mono text-xs ${
            isDay ? 'bg-white/92 border-slate-300 text-slate-900' : 'bg-[#0f172a]/90 border-white/20 text-white'
          }`}
        >
          {/* Scope Indicator */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="font-semibold text-[11.5px]">
              {isBangla ? 'জাতীয় পরিসর' : 'National Scope'}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
              {zoomLevel.toFixed(1)}x
            </span>
          </div>

          {/* 100km Graphic Scale Bar */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-[9px] text-[var(--color-text-secondary)]">
              <span>0</span>
              <span className="font-bold text-[var(--color-text-primary)]">100 km</span>
              <span>(62 mi)</span>
            </div>
            {/* Stepped Scale Ruler Bar */}
            <div className="w-36 h-1.5 bg-slate-700/50 rounded-xs flex overflow-hidden border border-white/20">
              <div className="w-1/2 h-full bg-sky-400" />
              <div className="w-1/2 h-full bg-white/70" />
            </div>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        6. BOTTOM-RIGHT LEGEND: COMBINED RISK & DENSITY
        ========================================================================
      */}
      <div className="absolute bottom-3.5 right-3.5 z-30">
        <div
          className={`px-3.5 py-2.5 rounded-[6px] border shadow-xl backdrop-blur-md font-mono text-xs max-w-[240px] ${
            isDay ? 'bg-white/92 border-slate-300 text-slate-900' : 'bg-[#0f172a]/90 border-white/20 text-white'
          }`}
        >
          <div className="font-bold text-[11px] mb-1.5 flex items-center justify-between">
            <span>{isBangla ? 'সমন্বিত ঝুঁকি ও ঘনত্ব' : 'Combined Risk & Density'}</span>
            <Activity className="w-3 h-3 text-red-400" />
          </div>

          {/* Continuous Gradient Bar: Cyan -> Blue -> Amber -> Red */}
          <div className="w-full h-2 rounded-full overflow-hidden shadow-inner bg-slate-800" style={{
            background: 'linear-gradient(to right, #10b981 0%, #38bdf8 30%, #3b82f6 55%, #f59e0b 75%, #ef4444 100%)'
          }} />

          <div className="flex items-center justify-between text-[9px] text-[var(--color-text-secondary)] mt-1 font-semibold">
            <span className="text-emerald-500">0 {isBangla ? 'নিরাপদ' : 'Safe'}</span>
            <span className="text-amber-500">50 {isBangla ? 'মাঝারি' : 'Mid'}</span>
            <span className="text-red-500">100 {isBangla ? 'সর্বোচ্চ' : 'Peak'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
