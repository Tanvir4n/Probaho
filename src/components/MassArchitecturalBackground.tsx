import React, { useState, useEffect } from 'react';
import { URBAN_MAP_DATASETS } from '../data/tokens';
import { Play, Pause, MapPin, Eye, EyeOff, Layers, SlidersHorizontal } from 'lucide-react';

interface MassArchitecturalBackgroundProps {
  currentMapIndex: number;
  onMapChange: (index: number) => void;
  overlayOpacity?: number; // 0.0 to 1.0
  autoPlay?: boolean;
}

export const MassArchitecturalBackground: React.FC<MassArchitecturalBackgroundProps> = ({
  currentMapIndex,
  onMapChange,
  overlayOpacity = 0.72,
  autoPlay = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [darkness, setDarkness] = useState(overlayOpacity);
  const [showControls, setShowControls] = useState(false);

  // Active Blueprint Layer Stack Toggles
  const [layersVisibility, setLayersVisibility] = useState({
    cartography: true,
    cadGrid: true,
    topographyContours: true,
    scanBeam: true,
  });

  // Automated layer transition sequence calibrated to tokens (6.5s interval)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      onMapChange((currentMapIndex + 1) % URBAN_MAP_DATASETS.length);
    }, 6500);

    return () => clearInterval(interval);
  }, [isPlaying, currentMapIndex, onMapChange]);

  const activeMap = URBAN_MAP_DATASETS[currentMapIndex];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 
        ========================================================================
        LAYER 1: STACKED BASE CARTOGRAPHY WITH CONTINUOUS CROSS-FADE TRANSITIONS
        ========================================================================
      */}
      {layersVisibility.cartography && (
        <div className="absolute inset-0">
          {URBAN_MAP_DATASETS.map((mapData, idx) => {
            const isActive = idx === currentMapIndex;
            return (
              <div
                key={mapData.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 z-1' : 'opacity-0 z-0'
                }`}
              >
                <img
                  src={mapData.image}
                  alt={`${mapData.cityName} architectural GIS site analysis map`}
                  className={`w-full h-full object-cover transform transition-transform duration-[7000ms] ease-out ${
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
        LAYER 2: CAD BLUEPRINT GRID & ARCHITECTURAL CROSSHAIR MATRIX
        CSS animation mimics architectural drafting board with hairline ticks
        ========================================================================
      */}
      {layersVisibility.cadGrid && (
        <div className="absolute inset-0 z-2 opacity-35 pointer-events-none animate-mass-grid-drift">
          {/* Hairline Coordinate Grid */}
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(236, 234, 230, 0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(236, 234, 230, 0.08) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }}
          />

          {/* Coordinate Crosshairs & Dimension Registration Marks */}
          <svg
            className="absolute inset-0 w-full h-full opacity-60"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="mass-cad-crosshair"
                width="240"
                height="240"
                patternUnits="userSpaceOnUse"
              >
                {/* Center crosshair */}
                <path
                  d="M116 120 h8 M120 116 v8 M120 120 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0"
                  fill="none"
                  stroke="rgba(232, 128, 46, 0.45)"
                  strokeWidth="0.75"
                />
                {/* Corner corner registration brackets */}
                <path
                  d="M10 10 h12 M10 10 v12 M230 10 h-12 M230 10 v12 M10 230 h12 M10 230 v-12 M230 230 h-12 M230 230 v-12"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="0.75"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mass-cad-crosshair)" />
          </svg>
        </div>
      )}

      {/* 
        ========================================================================
        LAYER 3: TOPOGRAPHIC ELEVATION CONTOURS & CAD PARCEL VECTOR BLUEPRINT
        CSS-animated architectural blueprint reveal wave
        ========================================================================
      */}
      {layersVisibility.topographyContours && (
        <div className="absolute inset-0 z-3 pointer-events-none opacity-40 animate-mass-blueprint">
          <svg
            className="w-full h-full"
            viewBox="0 0 1920 1080"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Topographic elevation contours */}
            <path
              d="M-50,200 Q400,150 900,320 T1950,220 M-50,350 Q450,280 950,480 T1950,380 M-50,520 Q500,420 1020,620 T1950,540 M-50,700 Q550,580 1100,780 T1950,710 M-50,880 Q600,750 1200,920 T1950,880"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="0.8"
              strokeDasharray="4 6"
            />
            {/* Structural parcel vectors */}
            <path
              d="M300,100 L700,400 L600,800 L200,500 Z M1100,200 L1600,150 L1700,650 L1250,700 Z"
              stroke="rgba(232, 128, 46, 0.22)"
              strokeWidth="1"
            />
            {/* Precision dimension arc */}
            <circle
              cx="960"
              cy="540"
              r="380"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="0.75"
              strokeDasharray="6 8"
            />
          </svg>
        </div>
      )}

      {/* 
        ========================================================================
        LAYER 4: ARCHITECTURAL REVEAL BEAM (LiDAR Scanning Pulse)
        CSS keyframe animation (.animate-mass-scan) sweeping across the blueprint
        layers using the defined motion duration tokens (calc(var(--motion-duration-slow) * 8))
        ========================================================================
      */}
      {layersVisibility.scanBeam && (
        <div className="absolute inset-x-0 h-40 z-4 pointer-events-none animate-mass-scan">
          {/* Glowing laser sweep gradient */}
          <div className="w-full h-full bg-gradient-to-b from-transparent via-[#e8802e]/12 to-transparent" />
          {/* Fine 1px tracing line with ember laser focal point */}
          <div className="absolute bottom-1/2 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#e8802e]/85 to-transparent shadow-[0_0_15px_rgba(232,128,46,0.6)]" />
        </div>
      )}

      {/* 
        ========================================================================
        LAYER 5: SEMI-TRANSPARENT BLACK GRADIENT LAYER FOR HIGH READABILITY
        Requested: "overlaid with a semi-transparent black gradient layer for high readability"
        Multi-stop directional gradient + ambient radial vignette
        ========================================================================
      */}
      <div
        className="absolute inset-0 transition-all duration-500 z-5"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${darkness})`,
          backgroundImage: `
            radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.88) 100%),
            linear-gradient(180deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.52) 25%, rgba(0,0,0,0.58) 70%, rgba(0,0,0,0.96) 100%)
          `,
        }}
      />

      {/* 
        ========================================================================
        HUD: ARCHITECTURAL TELEMETRY & LAYER STACK CONTROLLER (Bottom Left)
        Interactive affordance for testing layer visibility, dark opacity & city transitions
        ========================================================================
      */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-auto hidden sm:flex items-center gap-3">
        {/* Main Telemetry Dock */}
        <div className="bg-black/85 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-[2px] text-xs font-mono text-[#8a8a86] flex items-center gap-3.5 shadow-2xl">
          {/* Active Location Info */}
          <div className="flex items-center gap-2 text-[#eceae6]">
            <MapPin className="w-3.5 h-3.5 text-[#e8802e]" />
            <span className="font-semibold">{activeMap.cityName}</span>
            <span className="text-white/25">·</span>
            <span className="text-[10px] text-[#8a8a86]">{activeMap.coordinates}</span>
          </div>

          <span className="text-white/20">|</span>

          {/* Layer Count Indicator */}
          <button
            onClick={() => setShowControls(!showControls)}
            className="flex items-center gap-1.5 text-[10px] text-[#eceae6] hover:text-[#e8802e] transition-colors"
            title="Inspect Blueprint Layers"
          >
            <Layers className="w-3 h-3 text-[#e8802e]" />
            <span>4 Blueprint Layers</span>
          </button>

          <span className="text-white/20">|</span>

          {/* Play/Pause Sequence Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 hover:text-white transition-colors"
            title={isPlaying ? 'Pause Continuous Sequence' : 'Play Continuous Sequence'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 text-[#e8802e]" />
            ) : (
              <Play className="w-3.5 h-3.5 text-[#8a8a86]" />
            )}
          </button>

          {/* City Indicator Bullets */}
          <div className="flex items-center gap-1.5 ml-1">
            {URBAN_MAP_DATASETS.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => onMapChange(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentMapIndex
                    ? 'bg-[#e8802e] w-4'
                    : 'bg-white/20 hover:bg-white/50'
                }`}
                title={`Switch blueprint to ${m.cityName}`}
              />
            ))}
          </div>
        </div>

        {/* Black Gradient Opacity Presets */}
        <div className="bg-black/85 backdrop-blur-md border border-white/10 px-2.5 py-2 rounded-[2px] text-[10px] font-mono text-[#8a8a86] flex items-center gap-2 shadow-2xl">
          <span className="text-white/70">Dark Layer:</span>
          {[0.55, 0.72, 0.86].map((level) => (
            <button
              key={level}
              onClick={() => setDarkness(level)}
              className={`px-1.5 py-0.5 rounded-[1px] transition-colors ${
                darkness === level
                  ? 'bg-white/20 text-[#eceae6] font-bold'
                  : 'hover:text-white text-[#555552]'
              }`}
            >
              {Math.round(level * 100)}%
            </button>
          ))}
        </div>

        {/* Expanded Blueprint Layer Toggles Panel */}
        {showControls && (
          <div className="absolute bottom-12 left-0 bg-[#0e0e0f] border border-white/20 p-3 rounded-[2px] shadow-2xl text-[10.56px] font-mono space-y-2 w-64 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center justify-between text-[#e8802e] font-semibold border-b border-white/10 pb-1.5">
              <span>BLUEPRINT LAYER STACK</span>
              <button
                onClick={() => setShowControls(false)}
                className="text-[#8a8a86] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 text-[#eceae6]">
              {[
                { key: 'cartography' as const, label: '01. Base Cartography' },
                { key: 'cadGrid' as const, label: '02. CAD Drafting Grid' },
                { key: 'topographyContours' as const, label: '03. Topographic Contours' },
                { key: 'scanBeam' as const, label: '04. LiDAR Scan Reveal Beam' },
              ].map((layer) => (
                <button
                  key={layer.key}
                  onClick={() =>
                    setLayersVisibility((prev) => ({
                      ...prev,
                      [layer.key]: !prev[layer.key],
                    }))
                  }
                  className="w-full flex items-center justify-between p-1.5 hover:bg-white/5 rounded-[2px] transition-colors text-left"
                >
                  <span>{layer.label}</span>
                  {layersVisibility[layer.key] ? (
                    <Eye className="w-3.5 h-3.5 text-[#e8802e]" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-[#555552]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
