/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { URBAN_MAP_DATASETS } from '../data/tokens';
import {
  MapPin,
  Layers,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Eye,
  EyeOff,
  Sliders,
  X,
} from 'lucide-react';

export interface ArchitecturalMapControllerProps {
  currentMapIndex: number;
  onSelectMap: (index: number) => void;
  isPaused: boolean;
  onTogglePause: () => void;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  overlayOpacity: number;
  onOverlayOpacityChange: (opacity: number) => void;
  layersVisibility: {
    cartography: boolean;
    cadGrid: boolean;
    topographyContours: boolean;
  };
  onToggleLayer: (layerKey: 'cartography' | 'cadGrid' | 'topographyContours') => void;
  isDay: boolean;
  className?: string;
}

export const ArchitecturalMapController: React.FC<ArchitecturalMapControllerProps> = ({
  currentMapIndex,
  onSelectMap,
  isPaused,
  onTogglePause,
  zoomLevel,
  onZoomChange,
  overlayOpacity,
  onOverlayOpacityChange,
  layersVisibility,
  onToggleLayer,
  isDay,
  className = '',
}) => {
  const [showLayerControls, setShowLayerControls] = useState(false);
  const activeMap = URBAN_MAP_DATASETS[currentMapIndex] || URBAN_MAP_DATASETS[0];

  const handleZoom = (newZoom: number) => {
    const clamped = Math.min(1.20, Math.max(0.20, Number(newZoom.toFixed(2))));
    onZoomChange(clamped);
  };

  const opacityPresets = [
    { val: 0.10, label: '10%' },
    { val: 0.18, label: '18%' },
    { val: 0.35, label: '35%' },
    { val: 0.55, label: '55%' },
  ];

  return (
    <div className={`relative select-none pointer-events-auto ${className}`}>
      {/* Main Glassmorphic HUD Bar */}
      <div className="glass-pill px-3 py-1.5 rounded-[6px] text-[10.5px] font-mono text-[var(--color-text-secondary)] flex items-center gap-2 sm:gap-2.5 shadow-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)]/85 backdrop-blur-xl">
        {/* City and Coordinates Pin */}
        <div className="flex items-center gap-1.5 text-[var(--color-text-primary)]">
          <MapPin className="w-3.5 h-3.5 text-[var(--color-surface-raised)] shrink-0" />
          <span className="font-semibold text-xs">{activeMap.cityName}</span>
          <span className="opacity-40 hidden sm:inline">·</span>
          <span className="text-[9.5px] text-[var(--color-text-secondary)] hidden md:inline">{activeMap.coordinates}</span>
        </div>

        <span className="opacity-30">|</span>

        {/* Layer Inspector Toggle */}
        <button
          type="button"
          onClick={() => setShowLayerControls(!showLayerControls)}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] text-[9.5px] font-medium transition-colors cursor-pointer ${
            showLayerControls
              ? 'bg-[var(--color-surface-raised)]/20 text-[var(--color-surface-raised)] font-bold'
              : 'text-[var(--color-text-primary)] hover:text-[var(--color-surface-raised)] hover:bg-white/5'
          }`}
          title="Inspect Blueprint Stack"
        >
          <Layers className="w-3.5 h-3.5 text-[var(--color-surface-raised)]" />
          <span>Layers</span>
        </button>

        <span className="opacity-30">|</span>

        {/* Zoom Out / In Controls */}
        <div className="flex items-center gap-1">
          <span className="text-[9.5px] text-[var(--color-text-secondary)] hidden lg:inline">Zoom:</span>
          <button
            type="button"
            onClick={() => handleZoom(zoomLevel - 0.05)}
            className="p-1 rounded-[2px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer"
            title="Zoom Out Blueprint (-5%)"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span className="text-[10px] font-mono font-bold text-[var(--color-surface-raised)] min-w-[30px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={() => handleZoom(zoomLevel + 0.05)}
            className="p-1 rounded-[2px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer"
            title="Zoom In Blueprint (+5%)"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
          {Math.abs(zoomLevel - 0.40) > 0.02 && (
            <button
              type="button"
              onClick={() => handleZoom(0.40)}
              className="text-[8.5px] text-[var(--color-text-tertiary)] hover:text-[var(--color-surface-raised)] underline ml-0.5 cursor-pointer"
              title="Reset to default zoomed-out view (40%)"
            >
              reset
            </button>
          )}
        </div>

        <span className="opacity-30">|</span>

        {/* Black/Light Layer Opacity Quick Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="text-[10px] text-[var(--color-text-secondary)] hidden lg:inline">
            {isDay ? 'Overlay:' : 'Darkness:'}
          </span>
          {opacityPresets.map(({ val, label }) => {
            const isSelected = Math.abs(overlayOpacity - val) < 0.05;
            return (
              <button
                type="button"
                key={val}
                onClick={() => onOverlayOpacityChange(val)}
                className={`px-1.5 py-0.5 rounded-[2px] text-[10px] font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--color-surface-raised)] text-white font-bold shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10'
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
          type="button"
          onClick={onTogglePause}
          className="p-1 hover:text-[var(--color-text-primary)] transition-colors flex items-center justify-center cursor-pointer rounded-[2px] hover:bg-white/5"
          title={isPaused ? 'Resume Blueprint Sequence' : 'Pause Blueprint Sequence'}
        >
          {isPaused ? (
            <Play className="w-3.5 h-3.5 text-[var(--color-text-secondary)] hover:text-[var(--color-surface-raised)]" />
          ) : (
            <Pause className="w-3.5 h-3.5 text-[var(--color-surface-raised)]" />
          )}
        </button>

        {/* City Indicator Dots */}
        <div className="flex items-center gap-1.5 ml-0.5">
          {URBAN_MAP_DATASETS.map((m, idx) => (
            <button
              type="button"
              key={m.id}
              onClick={() => onSelectMap(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentMapIndex
                  ? 'bg-[var(--color-surface-raised)] w-4'
                  : 'bg-[var(--color-text-tertiary)]/50 hover:bg-[var(--color-text-secondary)] w-2'
              }`}
              title={`Switch to ${m.cityName}`}
            />
          ))}
        </div>
      </div>

      {/* Blueprint Layer Stack Popover (Positions upwards cleanly with ample room) */}
      {showLayerControls && (
        <div className="absolute bottom-12 right-0 glass-panel p-3.5 rounded-[6px] shadow-2xl text-[10.56px] font-mono space-y-3 w-76 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)]/95 backdrop-blur-2xl">
          <div className="flex items-center justify-between text-[var(--color-surface-raised)] font-semibold border-b border-[var(--color-border-subtle)] pb-2">
            <span className="tracking-wide">BLUEPRINT & OVERLAY CONTROLS</span>
            <button
              type="button"
              onClick={() => setShowLayerControls(false)}
              className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer rounded hover:bg-white/10"
              title="Close panel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Blueprint Zoom Slider */}
          <div className="space-y-1.5 bg-[var(--color-surface-muted)]/60 p-2.5 rounded-[3px] border border-[var(--color-border-subtle)]">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[var(--color-text-primary)]">Blueprint Zoom View</span>
              <span className="text-[var(--color-surface-raised)] font-bold">{Math.round(zoomLevel * 100)}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="120"
              step="5"
              value={Math.round(zoomLevel * 100)}
              onChange={(e) => handleZoom(Number(e.target.value) / 100)}
              className="w-full accent-[var(--color-surface-raised)] cursor-pointer h-1.5 bg-[var(--color-surface-base)] rounded"
            />
            <div className="flex justify-between text-[8px] text-[var(--color-text-secondary)]">
              <span>30% (Wide)</span>
              <span>40% (Default)</span>
              <span>100% (Detail)</span>
            </div>
          </div>

          {/* Black / Light Opacity Slider */}
          <div className="space-y-1.5 bg-[var(--color-surface-muted)]/60 p-2.5 rounded-[3px] border border-[var(--color-border-subtle)]">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[var(--color-text-primary)]">{isDay ? 'Light Layer Opacity' : 'Black Layer Opacity'}</span>
              <span className="text-[var(--color-surface-raised)] font-bold">{Math.round(overlayOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="75"
              step="1"
              value={Math.round(overlayOpacity * 100)}
              onChange={(e) => onOverlayOpacityChange(Number(e.target.value) / 100)}
              className="w-full accent-[var(--color-surface-raised)] cursor-pointer h-1.5 bg-[var(--color-surface-base)] rounded"
            />
            <div className="flex justify-between text-[8px] text-[var(--color-text-secondary)]">
              <span>5% (Clear)</span>
              <span>18% (Vivid)</span>
              <span>75% (Subtle)</span>
            </div>
          </div>

          {/* GIS Layer Toggles */}
          <div className="space-y-1 text-[var(--color-text-primary)]">
            {[
              { key: 'cartography' as const, label: '01. GIS Cartography Map' },
              { key: 'cadGrid' as const, label: '02. CAD Drafting Grid' },
              { key: 'topographyContours' as const, label: '03. Elevation Contours' },
            ].map((layer) => (
              <button
                type="button"
                key={layer.key}
                onClick={() => onToggleLayer(layer.key)}
                className="w-full flex items-center justify-between p-1.5 hover:bg-[var(--color-surface-muted)] rounded-[3px] transition-colors text-left cursor-pointer"
              >
                <span className="text-[10px]">{layer.label}</span>
                {layersVisibility[layer.key] ? (
                  <Eye className="w-3.5 h-3.5 text-[var(--color-surface-raised)]" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[var(--color-border-subtle)] text-[9px] text-[var(--color-text-secondary)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-surface-raised)]" />
            <span>Interactive telemetry layer controls live</span>
          </div>
        </div>
      )}
    </div>
  );
};
