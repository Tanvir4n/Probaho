import React, { useState, useEffect } from 'react';
import { URBAN_MAP_DATASETS, UrbanMapDataset } from '../data/tokens';
import { Play, Pause, ChevronRight, ChevronLeft, MapPin, Sliders, Layers } from 'lucide-react';

interface MassBackgroundMapRotatorProps {
  currentMapIndex: number;
  onMapChange: (index: number) => void;
  overlayOpacity?: number; // 0.0 to 1.0
  autoPlay?: boolean;
}

export const MassBackgroundMapRotator: React.FC<MassBackgroundMapRotatorProps> = ({
  currentMapIndex,
  onMapChange,
  overlayOpacity = 0.18,
  autoPlay = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [darkness, setDarkness] = useState(overlayOpacity);

  // Auto-rotate maps continuously every 6.5 seconds
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
        Layer 1: Map Images with Continuous Cross-fade & Subtle Motion
      */}
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
                className={`w-full h-full object-cover transform transition-transform duration-[7000ms] ease-out filter contrast-[1.12] brightness-[1.08] ${
                  isActive ? 'scale-105 translate-y-0' : 'scale-100 translate-y-1'
                }`}
                referrerPolicy="no-referrer"
              />
            </div>
          );
        })}
      </div>

      {/* 
        Layer 2: The Black Layer Requested by User ("tar upore ekta black like layer thakbe")
        Reduced black opacity so map details are clearly visible
      */}
      <div
        className="absolute inset-0 transition-colors duration-500 z-2"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${darkness})`,
          backgroundImage: `
            radial-gradient(ellipse at 50% 45%, rgba(0,0,0,${(darkness * 0.15).toFixed(2)}) 0%, rgba(0,0,0,${(darkness * 0.75).toFixed(2)}) 100%),
            linear-gradient(to bottom, rgba(0,0,0,${(darkness * 1.35).toFixed(2)}) 0%, rgba(0,0,0,${(darkness * 0.25).toFixed(2)}) 25%, rgba(0,0,0,${(darkness * 0.35).toFixed(2)}) 75%, rgba(0,0,0,${(darkness * 1.45).toFixed(2)}) 100%)
          `,
        }}
      />

      {/* 
        Layer 3: Subtle Architectural Grid Overlay (Fine Hairline Mesh)
      */}
      <div
        className="absolute inset-0 z-3 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* 
        Layer 4: Real-time Map Telemetry HUD (Interactive control dock at bottom-left)
      */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-auto hidden sm:flex items-center gap-3">
        <div className="bg-black/80 backdrop-blur-md border border-white/10 px-3 py-2 rounded-[2px] text-xs font-mono text-[#8a8a86] flex items-center gap-3 shadow-2xl">
          <div className="flex items-center gap-2 text-[#eceae6]">
            <MapPin className="w-3.5 h-3.5 text-[#22c55e]" />
            <span className="font-semibold">{activeMap.cityName}</span>
            <span className="text-white/30">·</span>
            <span className="text-[10px] text-[#8a8a86]">{activeMap.coordinates}</span>
          </div>

          <span className="text-white/20">|</span>

          <span className="text-[10px] text-[#8a8a86] hidden md:inline">
            {activeMap.parcelCount}
          </span>

          <span className="text-white/20 hidden md:inline">|</span>

          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 hover:text-white transition-colors"
            title={isPlaying ? 'Pause map sequence' : 'Play map sequence'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 text-[#22c55e]" />
            ) : (
              <Play className="w-3.5 h-3.5 text-[#8a8a86]" />
            )}
          </button>

          {/* Quick city jump dots */}
          <div className="flex items-center gap-1.5 ml-1">
            {URBAN_MAP_DATASETS.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => onMapChange(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentMapIndex
                    ? 'bg-[#22c55e] w-4'
                    : 'bg-white/20 hover:bg-white/50'
                }`}
                title={`Switch map to ${m.cityName}`}
              />
            ))}
          </div>
        </div>

        {/* Black Layer Intensity Toggle */}
        <div className="bg-black/80 backdrop-blur-md border border-white/10 px-2.5 py-2 rounded-[2px] text-[10px] font-mono text-[#8a8a86] flex items-center gap-2">
          <span>Black Opacity:</span>
          {[0.10, 0.18, 0.35, 0.55].map((level) => (
            <button
              key={level}
              onClick={() => setDarkness(level)}
              className={`px-1.5 py-0.5 rounded-[1px] transition-colors ${
                Math.abs(darkness - level) < 0.04
                  ? 'bg-[#22c55e] text-white font-bold'
                  : 'hover:text-white text-[#8a8a86]'
              }`}
            >
              {Math.round(level * 100)}%
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
