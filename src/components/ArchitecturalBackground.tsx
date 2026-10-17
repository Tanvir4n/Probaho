import React, { useState, useEffect, useRef } from 'react';
import { URBAN_MAP_DATASETS } from '../data/tokens';
import { Play, Pause, MapPin, Layers, Eye, EyeOff, FastForward, Activity, ZoomIn, ZoomOut } from 'lucide-react';

interface ArchitecturalBackgroundProps {
  currentMapIndex?: number;
  onMapChange?: (index: number) => void;
  className?: string;
  autoPlay?: boolean;
  speedMultiplier?: number;
  isPaused?: boolean;
  onTogglePause?: () => void;
  onSpeedChange?: (speed: number) => void;
  overlayOpacity?: number; // 0.05 to 0.85
  onOverlayOpacityChange?: (opacity: number) => void;
  themeMode?: 'day' | 'night';
  zoomLevel?: number; // 0.60 to 1.40
  onZoomChange?: (zoom: number) => void;
}

export const ArchitecturalBackground: React.FC<ArchitecturalBackgroundProps> = ({
  currentMapIndex: controlledMapIndex,
  onMapChange,
  className = '',
  autoPlay = true,
  speedMultiplier = 1.0,
  isPaused = false,
  onTogglePause,
  onSpeedChange,
  overlayOpacity: controlledOverlayOpacity,
  onOverlayOpacityChange,
  themeMode = 'night',
  zoomLevel: controlledZoomLevel,
  onZoomChange,
}) => {
  const isDay = themeMode === 'day';
  const [internalMapIndex, setInternalMapIndex] = useState(0);
  const [internalPaused, setInternalPaused] = useState(false);
  const [internalOverlayOpacity, setInternalOverlayOpacity] = useState(0.18);
  const [internalZoomLevel, setInternalZoomLevel] = useState(0.40); // 40% Compact Zoomed-out Start ("size ektu komay dew")

  // Stack visibility state
  const [layersVisibility, setLayersVisibility] = useState({
    cartography: true,
    cadGrid: true,
    topographyContours: true,
  });

  const activeIndex = controlledMapIndex !== undefined ? controlledMapIndex : internalMapIndex;
  const paused = isPaused !== undefined ? isPaused : internalPaused;
  const currentOpacity = controlledOverlayOpacity !== undefined ? controlledOverlayOpacity : internalOverlayOpacity;
  const currentZoom = controlledZoomLevel !== undefined ? controlledZoomLevel : internalZoomLevel;

  const handleIndexChange = (newIndex: number) => {
    if (onMapChange) {
      onMapChange(newIndex);
    } else {
      setInternalMapIndex(newIndex);
    }
  };

  const handleOpacityChange = (newOpacity: number) => {
    if (onOverlayOpacityChange) {
      onOverlayOpacityChange(newOpacity);
    } else {
      setInternalOverlayOpacity(newOpacity);
    }
  };

  const handleZoomChange = (newZoom: number) => {
    const clamped = Math.min(1.20, Math.max(0.20, Number(newZoom.toFixed(2))));
    if (onZoomChange) {
      onZoomChange(clamped);
    } else {
      setInternalZoomLevel(clamped);
    }
  };

  // Automated layer transition timer (disabled by default so cities never jump unexpectedly)
  useEffect(() => {
    if (paused || !autoPlay) return;

    const intervalMs = Math.max(1500, Math.round(6500 / speedMultiplier));
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % URBAN_MAP_DATASETS.length;
      handleIndexChange(nextIndex);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [paused, autoPlay, activeIndex, speedMultiplier]);

  const activeMap = URBAN_MAP_DATASETS[activeIndex];

  // Dynamic animation duration based on speed multiplier
  const blueprintAnimDuration = `${7 / speedMultiplier}s`;

  // Dynamic zoom scale: Calibrated so that at ALL zoom levels (0.20 - 1.20),
  // the cartography and CAD blueprint layers ALWAYS completely cover 100% of the screen
  // width and height, completely filling the left, right, top, and bottom edges without any empty margins.
  const zoomScale = Math.max(1.0, currentZoom / 0.38);

  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 bg-[var(--color-surface-base)] transition-colors duration-200 ${className}`}
      aria-hidden="true"
    >
      {/* 
        ========================================================================
        LAYER 1: CARTOGRAPHY & TERRAIN BLUEPRINT LAYER
        Full-bleed Edge-to-Edge with Zero Gaps on Left/Right Sides ("fill the side")
        ========================================================================
      */}
      {layersVisibility.cartography && (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          {/* Base Ambient Cartography Layer: Always 100% full-bleed covering every pixel */}
          <div className="absolute inset-0 w-full h-full">
            {URBAN_MAP_DATASETS.map((mapData, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={`ambient-${mapData.id}`}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                    isActive ? 'opacity-85 z-0' : 'opacity-0 z-0'
                  }`}
                >
                  <img
                    src={mapData.image}
                    alt=""
                    className={`w-full h-full object-cover transform scale-105 ${
                      isDay
                        ? 'invert-[0.93] hue-rotate-180 contrast-[1.12] brightness-[0.98]'
                        : 'filter contrast-[1.12] brightness-[1.08] saturate-[1.05]'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                </div>
              );
            })}
          </div>

          {/* Left and Right Side Extension Wings: Continuous blueprint terrain filling outer bounds */}
          <div className="absolute top-0 bottom-0 left-0 w-48 sm:w-72 pointer-events-none z-1 overflow-hidden opacity-40">
            <img
              src={activeMap.image}
              alt=""
              className={`absolute top-0 bottom-0 right-0 h-full w-[300%] max-w-none object-cover transform -scale-x-100 ${
                isDay
                  ? 'invert-[0.93] hue-rotate-180 contrast-[1.12]'
                  : 'filter contrast-[1.12] brightness-[1.05]'
              }`}
            />
            <div
              className="absolute inset-0"
              style={{
                background: isDay
                  ? 'linear-gradient(to right, rgba(246, 245, 242, 0.4), transparent)'
                  : 'linear-gradient(to right, rgba(11, 13, 14, 0.4), transparent)',
              }}
            />
          </div>
          <div className="absolute top-0 bottom-0 right-0 w-48 sm:w-72 pointer-events-none z-1 overflow-hidden opacity-40">
            <img
              src={activeMap.image}
              alt=""
              className={`absolute top-0 bottom-0 left-0 h-full w-[300%] max-w-none object-cover transform -scale-x-100 ${
                isDay
                  ? 'invert-[0.93] hue-rotate-180 contrast-[1.12]'
                  : 'filter contrast-[1.12] brightness-[1.05]'
              }`}
            />
            <div
              className="absolute inset-0"
              style={{
                background: isDay
                  ? 'linear-gradient(to left, rgba(246, 245, 242, 0.4), transparent)'
                  : 'linear-gradient(to left, rgba(11, 13, 14, 0.4), transparent)',
              }}
            />
          </div>

          {/* Zoomable Interactive Cartography Core Layer */}
          <div
            className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out flex items-center justify-center pointer-events-none z-2"
            style={{
              transform: `scale(${zoomScale})`,
              transformOrigin: 'center center',
            }}
          >
            {URBAN_MAP_DATASETS.map((mapData, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={mapData.id}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                    isActive ? 'opacity-100 z-1' : 'opacity-0 z-0'
                  }`}
                >
                  <img
                    src={mapData.image}
                    alt=""
                    className={`w-full h-full object-cover transform animate-mass-map-drift transition-transform duration-[7000ms] ease-out ${
                      isDay
                        ? 'invert-[0.93] hue-rotate-180 contrast-[1.12] brightness-[0.98]'
                        : 'filter contrast-[1.12] brightness-[1.08] saturate-[1.05]'
                    } ${
                      isActive ? 'scale-100 translate-y-0' : 'scale-95 translate-y-1'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        LAYER 2: CAD DRAFTING GRID & COORDINATE BLUEPRINT LAYER
        Absolute-positioned div applying 'animate-mass-blueprint' + deeper parallax offset
        ========================================================================
      */}
      {layersVisibility.cadGrid && (
        <div
          className="absolute inset-0 w-full h-full z-2 opacity-45 pointer-events-none animate-mass-blueprint animate-mass-grid-drift"
          style={{
            animationDuration: blueprintAnimDuration,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {/* Hairline 80px & 20px Architectural Dual Grid covering 100% edge-to-edge */}
          <div
            className="w-full h-full"
            style={{
              backgroundImage: isDay
                ? `
                linear-gradient(to right, rgba(17, 17, 19, 0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(17, 17, 19, 0.08) 1px, transparent 1px),
                linear-gradient(to right, rgba(17, 17, 19, 0.025) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(17, 17, 19, 0.025) 1px, transparent 1px)
              `
                : `
                linear-gradient(to right, rgba(236, 234, 230, 0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(236, 234, 230, 0.08) 1px, transparent 1px),
                linear-gradient(to right, rgba(236, 234, 230, 0.025) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(236, 234, 230, 0.025) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px, 80px 80px, 20px 20px, 20px 20px',
            }}
          />

          {/* Precision Crosshairs & Dimension Brackets */}
          <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="arch-blueprint-crosshairs" width="240" height="240" patternUnits="userSpaceOnUse">
                {/* Center crosshair */}
                <path
                  d="M116 120 h8 M120 116 v8 M120 120 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0"
                  fill="none"
                  stroke={isDay ? "rgba(22, 163, 74, 0.55)" : "rgba(34, 197, 94, 0.45)"}
                  strokeWidth="0.75"
                />
                {/* Boundary registration marks */}
                <path
                  d="M10 10 h12 M10 10 v12 M230 10 h-12 M230 10 v12 M10 230 h12 M10 230 v-12 M230 230 h-12 M230 230 v-12"
                  fill="none"
                  stroke={isDay ? "rgba(17, 17, 19, 0.15)" : "rgba(255, 255, 255, 0.15)"}
                  strokeWidth="0.75"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#arch-blueprint-crosshairs)" />
          </svg>
        </div>
      )}

      {/* 
        ========================================================================
        LAYER 3: TOPOGRAPHIC ELEVATION CONTOURS & VECTOR PARCEL BLUEPRINT LAYER
        Spanning 100% full-width across left & right edges without shrinking
        ========================================================================
      */}
      {layersVisibility.topographyContours && (
        <div
          className="absolute inset-0 w-full h-full z-3 pointer-events-none opacity-45 animate-mass-blueprint"
          style={{
            animationDuration: blueprintAnimDuration,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 1920 1080"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Extended Continuous Elevation Contours spanning past both sides */}
            <path
              d="M-200,180 Q300,130 900,320 T2120,200 M-200,320 Q350,250 950,480 T2120,350 M-200,490 Q400,390 1020,620 T2120,510 M-200,670 Q450,550 1100,780 T2120,680 M-200,850 Q500,720 1200,920 T2120,850"
              stroke={isDay ? "rgba(17, 17, 19, 0.15)" : "rgba(255, 255, 255, 0.14)"}
              strokeWidth="0.8"
              strokeDasharray="4 6"
            />
            {/* Structural Parcel Polygons spanning center, left and right sides */}
            <path
              d="M80,120 L480,380 L400,780 L50,520 Z M1320,180 L1840,130 L1940,630 L1460,680 Z M650,250 L1150,210 L1250,710 L800,760 Z"
              stroke={isDay ? "rgba(22, 163, 74, 0.35)" : "rgba(34, 197, 94, 0.30)"}
              strokeWidth="1"
            />
            {/* Site radius indicator */}
            <circle
              cx="960"
              cy="540"
              r="380"
              stroke={isDay ? "rgba(17, 17, 19, 0.10)" : "rgba(255, 255, 255, 0.09)"}
              strokeWidth="0.75"
              strokeDasharray="6 8"
            />
            {/* Left and Right Side Radial Range Rings Filling the Outer Margins */}
            <circle
              cx="140"
              cy="540"
              r="220"
              stroke={isDay ? "rgba(22, 163, 74, 0.16)" : "rgba(34, 197, 94, 0.13)"}
              strokeWidth="0.75"
              strokeDasharray="4 8"
            />
            <circle
              cx="1780"
              cy="540"
              r="220"
              stroke={isDay ? "rgba(22, 163, 74, 0.16)" : "rgba(34, 197, 94, 0.13)"}
              strokeWidth="0.75"
              strokeDasharray="4 8"
            />
          </svg>
        </div>
      )}



      {/* 
        ========================================================================
        LAYER 4: ARCHITECTURAL LASER SCAN BEAM
        Sweeps down continuously with a green focal beam and laser shadow
        ========================================================================
      */}
      <div className="absolute inset-x-0 h-44 z-4 pointer-events-none animate-mass-scan">
        <div className={`w-full h-full bg-gradient-to-b from-transparent ${isDay ? 'via-[#16a34a]/12' : 'via-[#22c55e]/15'} to-transparent`} />
        <div className={`absolute bottom-1/2 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent ${isDay ? 'via-[#16a34a]' : 'via-[#22c55e]'} to-transparent shadow-[0_0_18px_rgba(34,197,94,0.7)]`} />
      </div>

      {/* 
        ========================================================================
        LAYER 5: REDUCED BLACK OPACITY LAYER FOR HIGH MAP VISIBILITY
        "dicrease the black opacity jeno tar background er map ta sundor kore dekha jay"
        ========================================================================
      */}
      <div
        className="absolute inset-0 w-full h-full z-5 pointer-events-none transition-all duration-300"
        style={{
          background: isDay
            ? `
              linear-gradient(180deg, 
                rgba(246, 245, 242, ${(currentOpacity * 1.5).toFixed(3)}) 0%, 
                rgba(246, 245, 242, ${(currentOpacity * 0.35).toFixed(3)}) 22%, 
                rgba(246, 245, 242, ${(currentOpacity * 0.45).toFixed(3)}) 75%, 
                rgba(246, 245, 242, ${(currentOpacity * 1.6).toFixed(3)}) 100%
              )
            `
            : `
              linear-gradient(180deg, 
                rgba(0, 0, 0, ${(currentOpacity * 1.35).toFixed(3)}) 0%, 
                rgba(0, 0, 0, ${(currentOpacity * 0.25).toFixed(3)}) 22%, 
                rgba(0, 0, 0, ${(currentOpacity * 0.35).toFixed(3)}) 75%, 
                rgba(0, 0, 0, ${(currentOpacity * 1.45).toFixed(3)}) 100%
              ),
              radial-gradient(ellipse at 50% 45%, 
                rgba(0, 0, 0, ${(currentOpacity * 0.12).toFixed(3)}) 0%, 
                rgba(0, 0, 0, ${(currentOpacity * 0.70).toFixed(3)}) 100%
              )
            `,
        }}
      />
    </div>
  );
};
