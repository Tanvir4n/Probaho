/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MassLabs Architecture & Design System - Theme Context & Provider
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useThemeMode, UseThemeModeReturn, ThemeMode } from '../hooks/useThemeMode';

const ThemeContext = createContext<UseThemeModeReturn | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialMode }) => {
  const theme = useThemeMode(initialMode);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): UseThemeModeReturn {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
