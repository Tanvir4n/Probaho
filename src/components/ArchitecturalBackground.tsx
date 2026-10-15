import React, { useState, useEffect, useRef } from 'react';
import { URBAN_MAP_DATASETS } from '../data/tokens';
import { Play, Pause, MapPin, Layers, Eye, EyeOff, FastForward, Activity } from 'lucide-react';

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
}) => {
  const isDay = themeMode === 'day';
  const [internalMapIndex, setInternalMapIndex] = useState(0);
  const [internalPaused, setInternalPaused] = useState(!autoPlay);
  const [internalOverlayOpacity, setInternalOverlayOpacity] = useState(0.18);
  const [showLayerControls, setShowLayerControls] = useState(false);

  // Parallax cursor coordinates (-1 to 1 normalized)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Stack visibility state
  const [layersVisibility, setLayersVisibility] = useState({
    cartography: true,
    cadGrid: true,
    topographyContours: true,
  });

  const activeIndex = controlledMapIndex !== undefined ? controlledMapIndex : internalMapIndex;
  const paused = isPaused !== undefined ? isPaused : internalPaused;
  const currentOpacity = controlledOverlayOpacity !== undefined ? controlledOverlayOpacity : internalOverlayOpacity;

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

  // Continuous timer rotating through map blueprint layers
  // Speed-adjusted interval: standard 6500ms divided by speed multiplier
  useEffect(() => {
    if (paused) return;

    const intervalMs = Math.max(1500, Math.round(6500 / speedMultiplier));
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % URBAN_MAP_DATASETS.length;
      handleIndexChange(nextIndex);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [paused, activeIndex, speedMultiplier]);

  // Cursor movement tracking for tactile blueprint parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Normalized coordinates from -1 to 1 centered on viewport
      const normX = (e.clientX / windowWidth) * 2 - 1;
      const normY = (e.clientY / windowHeight) * 2 - 1;

      setMouseOffset({
        x: Math.max(-1, Math.min(1, normX)),
        y: Math.max(-1, Math.min(1, normY)),
      });
    };

    const handleMouseLeave = () => {
      setMouseOffset({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const activeMap = URBAN_MAP_DATASETS[activeIndex];

  // Layer-specific parallax displacements (staggered depth math)
  const cartographyTransform = `translate3d(${mouseOffset.x * 8}px, ${mouseOffset.y * 8}px, 0)`;
  const cadGridTransform = `translate3d(${mouseOffset.x * 16}px, ${mouseOffset.y * 16}px, 0)`;
  const contoursTransform = `translate3d(${mouseOffset.x * 24}px, ${mouseOffset.y * 24}px, 0)`;

  // Dynamic animation duration based on speed multiplier
  const blueprintAnimDuration = `${7 / speedMultiplier}s`;

  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 bg-[var(--color-surface-base)] transition-colors duration-200 ${className}`}
      aria-hidden="true"
    >
      {/* 
        ========================================================================
        LAYER 1: CARTOGRAPHY & TERRAIN BLUEPRINT LAYER
        Absolute-positioned div applying 'animate-mass-blueprint' + parallax offset
        ========================================================================
      */}
      {layersVisibility.cartography && (
        <div
          className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
          style={{
            transform: cartographyTransform,
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
                  className={`w-full h-full object-cover transform transition-transform duration-[7000ms] ease-out ${
                    isDay
                      ? 'invert-[0.93] hue-rotate-180 contrast-[1.12] brightness-[0.98]'
                      : 'filter contrast-[1.12] brightness-[1.08] saturate-[1.05]'
                  } ${
                    isActive ? 'scale-105 translate-y-0' : 'scale-100 translate-y-1'
                  }`}
                  referrerPolicy="no-referrer"
                />
              </div>
            );
          })}
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
          className="absolute inset-0 w-full h-full z-2 opacity-40 pointer-events-none animate-mass-blueprint animate-mass-grid-drift transition-transform duration-300 ease-out"
          style={{
            transform: cadGridTransform,
            animationDuration: blueprintAnimDuration,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {/* Hairline 80px Architectural Grid */}
          <div
            className="w-full h-full"
            style={{
              backgroundImage: isDay
                ? `
                linear-gradient(to right, rgba(17, 17, 19, 0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(17, 17, 19, 0.08) 1px, transparent 1px)
              `
                : `
                linear-gradient(to right, rgba(236, 234, 230, 0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(236, 234, 230, 0.08) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
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
                  stroke={isDay ? "rgba(26, 86, 219, 0.55)" : "rgba(232, 128, 46, 0.45)"}
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
        Absolute-positioned div applying 'animate-mass-blueprint' + deepest tactile parallax
        ========================================================================
      */}
      {layersVisibility.topographyContours && (
        <div
          className="absolute inset-0 w-full h-full z-3 pointer-events-none opacity-45 animate-mass-blueprint transition-transform duration-300 ease-out"
          style={{
            transform: contoursTransform,
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
            {/* Elevation Contours */}
            <path
              d="M-50,200 Q400,150 900,320 T1950,220 M-50,350 Q450,280 950,480 T1950,380 M-50,520 Q500,420 1020,620 T1950,540 M-50,700 Q550,580 1100,780 T1950,710 M-50,880 Q600,750 1200,920 T1950,880"
              stroke={isDay ? "rgba(17, 17, 19, 0.15)" : "rgba(255, 255, 255, 0.14)"}
              strokeWidth="0.8"
              strokeDasharray="4 6"
            />
            {/* Structural Parcel Polygons */}
            <path
              d="M300,100 L700,400 L600,800 L200,500 Z M1100,200 L1600,150 L1700,650 L1250,700 Z"
              stroke={isDay ? "rgba(26, 86, 219, 0.35)" : "rgba(232, 128, 46, 0.25)"}
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
          </svg>
        </div>
      )}

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

      {/* 
        ========================================================================
        HUD TELEMETRY CONTROLS (Bottom Left, interactive controls for layer testing)
        ========================================================================
      */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-auto hidden sm:flex items-center gap-3">
        <div className="bg-[var(--color-surface-strong)]/90 backdrop-blur-md border border-[var(--color-border-subtle)] px-3.5 py-2 rounded-[2px] text-xs font-mono text-[var(--color-text-secondary)] flex items-center gap-3.5 shadow-2xl">
          <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
            <MapPin className="w-3.5 h-3.5 text-[var(--color-surface-raised)]" />
            <span className="font-semibold">{activeMap.cityName}</span>
            <span className="opacity-40">·</span>
            <span className="text-[10px] text-[var(--color-text-secondary)]">{activeMap.coordinates}</span>
          </div>

          <span className="opacity-30">|</span>

          {/* Layer Inspector Toggle */}
          <button
            onClick={() => setShowLayerControls(!showLayerControls)}
            className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-primary)] hover:text-[var(--color-surface-raised)] transition-colors cursor-pointer"
            title="Inspect Blueprint Stack"
          >
            <Layers className="w-3 h-3 text-[var(--color-surface-raised)]" />
            <span>Blueprint Layers</span>
          </button>

          <span className="opacity-30">|</span>

          {/* Black/Light Layer Opacity Quick Controls */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[var(--color-text-secondary)] hidden lg:inline">{isDay ? 'Overlay:' : 'Darkness:'}</span>
            {[
              { val: 0.10, label: '10%' },
              { val: 0.18, label: '18%' },
              { val: 0.35, label: '35%' },
              { val: 0.55, label: '55%' },
            ].map(({ val, label }) => {
              const isSelected = Math.abs(currentOpacity - val) < 0.05;
              return (
                <button
                  key={val}
                  onClick={() => handleOpacityChange(val)}
                  className={`px-1.5 py-0.5 rounded-[1px] text-[10px] font-mono transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--color-surface-raised)] text-white font-bold'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]'
                  }`}
                  title={`Set opacity to ${label}`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <span className="opacity-30">|</span>

          {/* Play/Pause Button */}
          <button
            onClick={() => {
              if (onTogglePause) {
                onTogglePause();
              } else {
                setInternalPaused(!internalPaused);
              }
            }}
            className="p-1 hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1 cursor-pointer"
            title={paused ? 'Resume Blueprint Sequence' : 'Pause Blueprint Sequence'}
          >
            {paused ? (
              <Play className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
            ) : (
              <Pause className="w-3.5 h-3.5 text-[var(--color-surface-raised)]" />
            )}
          </button>

          {/* City Indicator Dots */}
          <div className="flex items-center gap-1.5 ml-1">
            {URBAN_MAP_DATASETS.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => handleIndexChange(idx)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  idx === activeIndex
                    ? 'bg-[var(--color-surface-raised)] w-4'
                    : 'bg-[var(--color-text-tertiary)]/40 hover:bg-[var(--color-text-secondary)]'
                }`}
                title={`Switch to ${m.cityName}`}
              />
            ))}
          </div>
        </div>

        {/* Blueprint Layer Stack Popover */}
        {showLayerControls && (
          <div className="absolute bottom-12 left-0 bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] p-3 rounded-[2px] shadow-2xl text-[10.56px] font-mono space-y-2.5 w-72 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center justify-between text-[var(--color-surface-raised)] font-semibold border-b border-[var(--color-border-subtle)] pb-1.5">
              <span>BLUEPRINT & OVERLAY CONTROLS</span>
              <button
                onClick={() => setShowLayerControls(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Black / Light Opacity Slider */}
            <div className="space-y-1 bg-[var(--color-surface-muted)] p-2 rounded-[2px]">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[var(--color-text-primary)]">{isDay ? 'Light Layer Opacity' : 'Black Layer Opacity'}</span>
                <span className="text-[var(--color-surface-raised)] font-bold">{Math.round(currentOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="75"
                step="1"
                value={Math.round(currentOpacity * 100)}
                onChange={(e) => handleOpacityChange(Number(e.target.value) / 100)}
                className="w-full accent-[var(--color-surface-raised)] cursor-pointer h-1.5 bg-[var(--color-surface-base)] rounded"
              />
              <div className="flex justify-between text-[8px] text-[var(--color-text-secondary)]">
                <span>5% (Ultra Clear)</span>
                <span>18% (Vivid Map)</span>
                <span>75% (Subtle)</span>
              </div>
            </div>

            <div className="space-y-1.5 text-[var(--color-text-primary)]">
              {[
                { key: 'cartography' as const, label: '01. GIS Cartography Map' },
                { key: 'cadGrid' as const, label: '02. CAD Drafting Grid' },
                { key: 'topographyContours' as const, label: '03. Elevation Contours' },
              ].map((layer) => (
                <button
                  key={layer.key}
                  onClick={() =>
                    setLayersVisibility((prev) => ({
                      ...prev,
                      [layer.key]: !prev[layer.key],
                    }))
                  }
                  className="w-full flex items-center justify-between p-1.5 hover:bg-[var(--color-surface-muted)] rounded-[2px] transition-colors text-left cursor-pointer"
                >
                  <span>{layer.label}</span>
                  {layersVisibility[layer.key] ? (
                    <Eye className="w-3.5 h-3.5 text-[var(--color-surface-raised)]" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
                  )}
                </button>
              ))}
            </div>

            <div className="pt-1.5 border-t border-[var(--color-border-subtle)] text-[9px] text-[var(--color-text-secondary)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-surface-raised)]" />
              <span>Reduced opacity enables clear map visibility</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
