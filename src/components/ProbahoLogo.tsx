/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ProbahoLogoProps {
  className?: string;
  size?: number | string;
  variant?: 'mark' | 'monogram' | 'fluid';
  animated?: boolean;
}

/**
 * Probaho Architectural Logo Mark
 *
 * Conceptualized around "Probaho" (flow, current, fluid dynamics):
 * Blends architectural structural cantilever precision with aerodynamic streamlines,
 * fluid contour vectors, and the signature emerald green accent node.
 */
export const ProbahoLogo: React.FC<ProbahoLogoProps> = ({
  className = 'w-7 h-7 text-[var(--color-text-primary)]',
  size,
  variant = 'mark',
  animated = true,
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center relative select-none ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible transition-transform duration-300 group-hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          {/* Gradient for the fluid stream ribbon */}
          <linearGradient id="probaho-flow-grad" x1="4" y1="26" x2="28" y2="6" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
            <stop offset="60%" stopColor="var(--color-surface-raised, #22c55e)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-surface-raised, #22c55e)" />
          </linearGradient>

          {/* Radial soft glow for focal vertex */}
          <radialGradient id="probaho-node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-surface-raised, #22c55e)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--color-surface-raised, #22c55e)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Flow Guide Line (Secondary Contour Stream) */}
        <path
          d="M 4 23 C 8.5 23 11 18 15.5 18 C 20 18 22.5 21.5 28 21.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="opacity-30 group-hover:opacity-50 transition-opacity"
        />

        {/* Primary Architectural Cantilever Frame (Monogram P & Structural Arch) */}
        <path
          d="M 8 26 V 8 C 8 5.79 9.79 4 12 4 H 18 C 22.42 4 26 7.58 26 12 C 26 16.42 22.42 20 18 20 H 8"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-colors group-hover:text-[var(--color-text-primary)]"
        />

        {/* Dynamic Wave Spline (Probaho Fluid Stream) */}
        <path
          d="M 11.5 20 C 14.2 15.2 17.8 11.8 23 11.8 C 25.2 11.8 26.8 12.6 28.5 13.8"
          stroke="url(#probaho-flow-grad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          className="transition-all duration-300"
        />

        {/* Kinetic Energy / Active Vertex Node */}
        <circle
          cx="23"
          cy="11.8"
          r="4.5"
          fill="url(#probaho-node-glow)"
          className="opacity-40 group-hover:opacity-80 transition-opacity"
        />
        <circle
          cx="23"
          cy="11.8"
          r="2.2"
          fill="var(--color-surface-raised, #22c55e)"
          className="transition-transform duration-300 group-hover:scale-110 origin-center"
        />
      </svg>
    </div>
  );
};
