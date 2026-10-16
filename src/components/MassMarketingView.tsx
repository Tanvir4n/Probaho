import React, { useState } from 'react';
import {
  ARCHITECTURAL_PROJECTS,
  ArchitecturalProject,
  MASSLABS_TOOLS,
  MassLabTool,
  URBAN_MAP_DATASETS,
  PricingPlan,
} from '../data/tokens';
import { ArchitecturalBackground } from './ArchitecturalBackground';
import { MassPricingSection } from './MassPricingSection';
import { MassAuthModal } from './MassAuthModal';
import { MassGlassSidebar } from './MassGlassSidebar';
import { PageTransitionEffect } from './PageTransitionEffect';
import { ProbahoLogo, ProbahoBrand } from './ProbahoLogo';
import {
  ArrowRight,
  ChevronRight,
  X,
  CheckCircle,
  Loader2,
  Globe,
  Sliders,
  Layers,
  Sparkles,
  MapPin,
  ExternalLink,
  Info,
  Maximize2,
  Check,
  Compass,
  FileText,
  User,
  LogOut,
  Download,
  Play,
  Pause,
  Bell,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

interface MassMarketingViewProps {
  onOpenDesignSystem?: () => void;
}

export const MassMarketingView: React.FC<MassMarketingViewProps> = ({
  onOpenDesignSystem,
}) => {
  const { mode, isDay, toggleMode, palette } = useTheme();
  const [currentMapIndex, setCurrentMapIndex] = useState(0);
  const [activeToolId, setActiveToolId] = useState<string>('masslabs');
  const [selectedProject, setSelectedProject] = useState<ArchitecturalProject | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [isSiteAnalysisStudioOpen, setIsSiteAnalysisStudioOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'JA' | 'DE' | 'FR' | 'BN'>('EN');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Authentication State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Blueprint Animation Speed & Pause Technical Controls
  const [isBlueprintPaused, setIsBlueprintPaused] = useState(false);
  const [blueprintSpeed, setBlueprintSpeed] = useState<number>(1.0);
  const [mapOverlayOpacity, setMapOverlayOpacity] = useState<number>(0.18);
  const [blueprintZoom, setBlueprintZoom] = useState<number>(0.40); // Compact Zoomed-out Start (40% scale, "size ektu komay dew")

  // Site Analysis GIS Interactive Layer Toggles
  const [activeGisLayers, setActiveGisLayers] = useState({
    buildings: true,
    parcels: true,
    roads: true,
    terrain: false,
    solar: false,
  });

  // Commission Form State
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryScope, setInquiryScope] = useState('Parametric Enclosure');
  const [inquiryNotes, setInquiryNotes] = useState('');
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const activeTool = MASSLABS_TOOLS.find((t) => t.id === activeToolId) || MASSLABS_TOOLS[0];
  const activeMap = URBAN_MAP_DATASETS[currentMapIndex];

  const handleToolSelect = (toolId: string) => {
    setActiveToolId(toolId);
    if (toolId === 'globee') {
      setIsNoticeOpen(true);
      setCurrentMapIndex(1); // Tokyo / global
    } else if (toolId === 'cologram') {
      setCurrentMapIndex(2); // London
    } else if (toolId === 'laserfish') {
      setCurrentMapIndex(3); // Cologne
    } else if (toolId === 'archimap') {
      setCurrentMapIndex(0); // Manhattan
    } else {
      setCurrentMapIndex(0); // Manhattan for MassLabs Home
    }
  };

  const filteredProjects = filterCategory === 'all'
    ? ARCHITECTURAL_PROJECTS
    : ARCHITECTURAL_PROJECTS.filter((p) => p.category.toLowerCase().includes(filterCategory.toLowerCase()));

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryEmail || !inquiryEmail.includes('@') || !inquiryEmail.includes('.')) {
      setFormState('error');
      setErrorMessage('Please provide a valid corporate or institution email address.');
      return;
    }
    setFormState('loading');
    setTimeout(() => {
      setFormState('success');
    }, 900);
  };

  const toggleGisLayer = (layerKey: keyof typeof activeGisLayers) => {
    setActiveGisLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const handleSelectPricingPlan = (plan: PricingPlan) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
    } else {
      setToastMessage(`Account updated: Upgrading ${currentUser.name} to the ${plan.name} plan.`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-primary)] selection:bg-[var(--color-surface-raised)] selection:text-white transition-colors duration-200">
      {/* 
        ====================================================================
        HERO SECTION WITH CONTINUOUS BACKGROUND MAP ROTATOR + BLACK/WHITE LAYER:
        ====================================================================
      */}
      <div className="relative min-h-screen flex flex-col justify-between overflow-hidden">
        {/* Architectural Background: Stack of absolute divs with animate-mass-blueprint & adaptive light/dark overlay */}
        <ArchitecturalBackground
          currentMapIndex={currentMapIndex}
          onMapChange={setCurrentMapIndex}
          className="z-0"
          autoPlay={true}
          isPaused={isBlueprintPaused}
          onTogglePause={() => setIsBlueprintPaused((prev) => !prev)}
          speedMultiplier={blueprintSpeed}
          onSpeedChange={setBlueprintSpeed}
          overlayOpacity={mapOverlayOpacity}
          onOverlayOpacityChange={setMapOverlayOpacity}
          themeMode={mode}
          zoomLevel={blueprintZoom}
          onZoomChange={setBlueprintZoom}
        />

        {/* 
          ====================================================================
          TOP NAVIGATION BAR:
          Left: MassLabs 3-Node Connected M Logo + Wordmark
          Right: PRICING · LOGIN · 9+ Bell · LANGUAGE dropdown · DAY/NIGHT TOGGLE
          ====================================================================
        */}
        <header className={`relative z-30 px-6 sm:px-10 py-4 flex items-center justify-between border-b transition-colors duration-200 backdrop-blur-2xl backdrop-saturate-180 ${
          isDay
            ? 'bg-white/60 border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)]'
            : 'bg-[#0b0d0e]/60 border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.12)]'
        }`}>
          {/* Brand Logo & Emblem */}
          <a
            href="/"
            className="flex items-center gap-3 text-xl font-bold tracking-tight text-[var(--color-text-primary)] whitespace-nowrap hover:opacity-90 transition-opacity group"
          >
            <ProbahoLogo className="w-7 h-7 text-[var(--color-text-primary)] group-hover:text-[var(--color-surface-raised)] shrink-0 transition-colors" />
            <span className="font-bold tracking-tight font-sans text-white text-xl">Probaho</span>
          </a>

          {/* Desktop Direct Section Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-mono tracking-wider text-[var(--color-text-secondary)]">
            <a href="#tools" className="hover:text-[var(--color-text-primary)] transition-colors uppercase font-medium">
              Engines
            </a>
            <a href="#projects" className="hover:text-[var(--color-text-primary)] transition-colors uppercase font-medium">
              Case Studies
            </a>
            <a href="#methodology" className="hover:text-[var(--color-text-primary)] transition-colors uppercase font-medium">
              Simulator
            </a>
            <a href="#pricing" className="hover:text-[var(--color-text-primary)] transition-colors uppercase font-medium">
              Pricing
            </a>
            <button
              onClick={() => setIsSiteAnalysisStudioOpen(true)}
              className="text-[var(--color-surface-raised)] hover:brightness-110 transition-colors uppercase font-medium cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio</span>
            </button>
          </nav>

          {/* Right Navigation Controls */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono tracking-wider text-[var(--color-text-secondary)]">
            <a
              href="#pricing"
              className="hover:text-[var(--color-text-primary)] transition-colors uppercase font-medium"
            >
              PRICING
            </a>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-[var(--color-text-primary)] text-xs font-semibold flex items-center gap-1.5 glass-tile px-2.5 py-1 rounded-[3px] border border-[var(--color-border-subtle)]">
                  <User className="w-3.5 h-3.5 text-[var(--color-surface-raised)]" />
                  <span>{currentUser.name}</span>
                </span>
                <button
                  onClick={() => setCurrentUser(null)}
                  className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hover:text-[var(--color-text-primary)] transition-colors uppercase font-medium cursor-pointer"
              >
                LOGIN
              </button>
            )}

            {/* Notification Bell with Red 9+ Badge */}
            <button
              onClick={() => setIsNoticeOpen(true)}
              className="relative p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-[#d9383a] text-white text-[9px] font-bold rounded-full leading-tight font-mono">
                9+
              </span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 text-[var(--color-text-primary)] hover:opacity-90 transition-opacity uppercase text-[11px] py-1.5 px-3 border border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)] rounded-[3px] glass-tile font-mono cursor-pointer"
              >
                <span>LANGUAGE</span>
                <span className="text-[8px] text-[var(--color-text-secondary)]">▼</span>
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 glass-panel rounded-[4px] shadow-2xl py-1 z-50 text-[11px] font-mono">
                  {[
                    { code: 'EN', label: 'English' },
                    { code: 'JA', label: '日本語' },
                    { code: 'DE', label: 'Deutsch' },
                    { code: 'FR', label: 'Français' },
                    { code: 'BN', label: 'বাংলা' },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang.code as any);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-[var(--color-surface-muted)] transition-colors flex items-center justify-between cursor-pointer ${
                        selectedLanguage === lang.code ? 'text-[var(--color-surface-raised)] font-bold' : 'text-[var(--color-text-secondary)]'
                      }`}
                    >
                      <span>{lang.label}</span>
                      <span className="text-[9.6px]">{lang.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Day / Night Theme Mode Switcher */}
            <button
              onClick={toggleMode}
              className="flex items-center gap-1.5 text-[11px] py-1.5 px-2.5 border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] rounded-[3px] glass-tile text-[var(--color-text-primary)] transition-all font-mono tracking-wider group cursor-pointer shadow-sm"
              title={isDay ? "Shift to Night Mode (Dark-base / Obsidian & Green)" : "Shift to Day Mode (Light-base / Off-white & Emerald Green)"}
              aria-label={`Toggle theme mode (currently ${mode})`}
            >
              {isDay ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#16a34a] group-hover:rotate-45 transition-transform" />
                  <span className="font-semibold text-[var(--color-text-primary)]">DAY</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#22c55e] group-hover:-rotate-12 transition-transform" />
                  <span className="font-semibold text-[var(--color-text-primary)]">NIGHT</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* 
          ====================================================================
          MAIN HERO VIEWPORT (Center Content + Right Product Dock)
          ====================================================================
        */}
        {/* 
          ====================================================================
          MAIN HERO VIEWPORT (Center Content + Right Product Dock)
          Matches user uploaded screenshot exactly
          ====================================================================
        */}
        <div className="relative z-20 flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool.id}
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl space-y-4"
            >
              {/* Main Headline */}
              <h1
                className="font-extrabold tracking-tight text-[var(--color-text-primary)] leading-[1.04] drop-shadow-md"
                style={{ fontSize: 'clamp(3.2rem, 7vw, 5.75rem)' }}
              >
                {activeTool.headline}
              </h1>

              {/* Metadata Subtitle 1 */}
              <p className="text-base sm:text-lg text-[var(--color-text-primary)] font-normal leading-relaxed max-w-3xl drop-shadow-sm opacity-90">
                {activeTool.meta}
              </p>

              {/* Subtitle 2 */}
              <p className="text-base sm:text-lg text-[var(--color-text-secondary)] font-normal leading-relaxed max-w-2xl drop-shadow-sm pb-2">
                {activeTool.description}
              </p>

              {/* Primary Action Button */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setIsSiteAnalysisStudioOpen(true)}
                  className="px-8 py-3.5 text-base font-bold text-white bg-[var(--color-surface-raised)] hover:brightness-110 active:translate-y-[1px] rounded-[3px] transition-all whitespace-nowrap flex items-center gap-3 shadow-[0_12px_32px_rgba(34,197,94,0.38),inset_0_1.5px_1px_rgba(255,255,255,0.35)] group focus-visible:ring-2 focus-visible:ring-[var(--color-border-strong)] outline-none cursor-pointer backdrop-blur-md"
                >
                  <span>{activeTool.ctaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Hero Bottom Bar Info */}
        <div className="relative z-20 px-6 sm:px-10 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11.52px] font-mono text-[var(--color-text-secondary)] border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-base)]/70 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-surface-raised)]" />
            <span className="text-[var(--color-text-primary)] font-semibold">Probaho Cadastral Core:</span>
            <span>Streaming {activeMap.cityName} ({activeMap.coordinates})</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#tools" className="hover:text-[var(--color-text-primary)] transition-colors">
              Detection Engines
            </a>
            <a href="#pricing" className="hover:text-[var(--color-text-primary)] transition-colors">
              Pricing Plans
            </a>
            <a href="#projects" className="hover:text-[var(--color-text-primary)] transition-colors">
              Case Studies ↓
            </a>
          </div>
        </div>

        {/* 
          ====================================================================
          FLOATING TECHNICAL BLUEPRINT SEQUENCE CONTROLLER
          Allows users to pause, speed up, or zoom the blueprint animation sequence
          ====================================================================
        */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-35 pointer-events-auto">
          <div className="glass-pill px-2.5 py-1 rounded-[5px] shadow-xl flex items-center gap-2 text-[10.5px] font-mono text-[var(--color-text-primary)]">
            {/* Pause / Play Toggle */}
            <button
              onClick={() => setIsBlueprintPaused(!isBlueprintPaused)}
              className={`px-2 py-0.5 rounded-[3px] flex items-center gap-1 transition-all select-none cursor-pointer ${
                isBlueprintPaused
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40'
                  : 'bg-[var(--color-surface-raised)] text-white font-semibold shadow-[0_2px_8px_rgba(34,197,94,0.4)]'
              }`}
              title={isBlueprintPaused ? 'Resume blueprint animation' : 'Pause blueprint animation'}
            >
              {isBlueprintPaused ? (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span className="text-[9.5px]">RESUME</span>
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3 fill-current" />
                  <span className="text-[9.5px]">PAUSE</span>
                </>
              )}
            </button>

            <div className="h-3.5 w-[1px] bg-[var(--color-border-subtle)]" />

            {/* Speed Selector Buttons */}
            <div className="flex items-center gap-1 text-[10px]">
              <span className="text-[var(--color-text-secondary)] mr-0.5 hidden sm:inline">SPEED:</span>
              {[0.5, 1.0, 2.0].map((spd) => (
                <button
                  key={spd}
                  onClick={() => {
                    setBlueprintSpeed(spd);
                    if (isBlueprintPaused) setIsBlueprintPaused(false);
                  }}
                  className={`px-1.5 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
                    blueprintSpeed === spd && !isBlueprintPaused
                      ? 'glass-tile text-[var(--color-text-primary)] border border-[var(--color-surface-raised)] font-bold shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            <div className="h-3.5 w-[1px] bg-[var(--color-border-subtle)]" />

            {/* Blueprint Zoom Controls */}
            <div className="flex items-center gap-1 text-[10px]">
              <span className="text-[var(--color-text-secondary)] hidden sm:inline">ZOOM:</span>
              <button
                onClick={() => setBlueprintZoom((z) => Math.max(0.20, +(z - 0.05).toFixed(2)))}
                className="px-1 py-0.5 rounded-[2px] text-[11px] font-mono hover:bg-white/10 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                title="Zoom Out Blueprint (Reduce Size)"
              >
                −
              </button>
              <span className="px-1 py-0.5 font-mono text-[10px] text-[var(--color-surface-raised)] font-bold min-w-[28px] text-center">
                {Math.round(blueprintZoom * 100)}%
              </span>
              <button
                onClick={() => setBlueprintZoom((z) => Math.min(1.20, +(z + 0.05).toFixed(2)))}
                className="px-1 py-0.5 rounded-[2px] text-[11px] font-mono hover:bg-white/10 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                title="Zoom In Blueprint"
              >
                +
              </button>
              {Math.abs(blueprintZoom - 0.40) > 0.02 && (
                <button
                  onClick={() => setBlueprintZoom(0.40)}
                  className="text-[8.5px] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] underline cursor-pointer ml-0.5"
                  title="Reset to default compact zoomed-out view (40%)"
                >
                  reset
                </button>
              )}
            </div>

            <div className="h-3.5 w-[1px] bg-[var(--color-border-subtle)] hidden md:block" />

            {/* Technical Status Readout */}
            <div className="items-center gap-1.5 text-[9.5px] text-[var(--color-text-secondary)] hidden md:flex pr-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isBlueprintPaused ? 'bg-amber-400' : 'bg-[var(--color-surface-raised)] animate-pulse'}`} />
              <span>{isBlueprintPaused ? 'FROZEN' : `TACTILE ${blueprintSpeed}X`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 
        ====================================================================
        PAGE TRANSITION & SECTION NAVIGATOR CONTROLLER
        Provides smooth professional transitions and scroll progress indicator
        ====================================================================
      */}
      <PageTransitionEffect />

      {/* 
        ====================================================================
        VIEWPORT-FIXED GLASSMORPHIC DOCK & TELEMETRY SIDEBAR
        Positioned fixed in viewport across the entire page
        ====================================================================
      */}
      <MassGlassSidebar
        activeToolId={activeToolId}
        onSelectTool={handleToolSelect}
        isDay={isDay}
        currentMapIndex={currentMapIndex}
        onSelectMap={setCurrentMapIndex}
        onOpenSiteAnalysis={() => setIsSiteAnalysisStudioOpen(true)}
        onOpenDesignSystem={onOpenDesignSystem}
        blueprintZoom={blueprintZoom}
        onZoomChange={setBlueprintZoom}
        isBlueprintPaused={isBlueprintPaused}
        onTogglePause={() => setIsBlueprintPaused((prev) => !prev)}
        blueprintSpeed={blueprintSpeed}
        onSpeedChange={setBlueprintSpeed}
      />

      {/* 
        ====================================================================
        PRODUCT SUITE OVERVIEW (archiMap, LaserFish, Cologram, Globee):
        ====================================================================
      */}
      <motion.section
        id="tools"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="py-24 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] transition-colors duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-surface-raised)]">
              Probaho Intelligence Suite
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Four Specialized Engines. One Unified Fraud Shield.
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Multi-signal fraud detection, cross-document verification, and evidence intelligence for Bangladesh land records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tool 1: archiMap / Ownership Graph */}
            <div className="p-8 rounded-[8px] space-y-5 hover:border-[var(--color-surface-raised)] transition-all flex flex-col justify-between glass-card group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--color-surface-raised)] font-semibold">01 · TEMPORAL OWNERSHIP GRAPH</span>
                  <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">Bangladesh Cadastre</span>
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-surface-raised)] transition-colors">Ownership Graph</h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Model every parcel, owner, deed, and mutation as a temporal connected graph. Automatically detect double-sales, impossible transfer chains, and ownership share proportion deficits across historical records.
                </p>
                <div className="p-3 glass-tile rounded-[4px] border border-[var(--color-border-subtle)] text-[11px] font-mono text-[var(--color-text-primary)] space-y-1">
                  <div>• Temporal Transfer Chains & Dag Validation</div>
                  <div>• Double-Sale & Share Deficit Detection</div>
                  <div>• Interactive Mouza Parcel Graph Vectors</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveToolId('archimap');
                  setIsSiteAnalysisStudioOpen(true);
                }}
                className="w-full py-2.5 text-xs font-semibold text-white bg-[var(--color-surface-raised)] hover:brightness-110 rounded-[3px] font-mono transition-all cursor-pointer shadow-[0_4px_16px_rgba(34,197,94,0.3)]"
              >
                Launch Ownership Graph →
              </button>
            </div>

            {/* Tool 2: LaserFish / FraudEngine */}
            <div className="p-8 rounded-[8px] space-y-5 hover:border-[var(--color-surface-raised)] transition-all flex flex-col justify-between glass-card group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--color-surface-raised)] font-semibold">02 · EXPLAINABLE RISK ENGINE</span>
                  <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">Hybrid Rule + Anomaly</span>
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-surface-raised)] transition-colors">FraudEngine</h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Combine deterministic legal rules with anomaly detection models. Every alert includes the specific violation rule triggered, supporting evidentiary citations, severity rating, and uncertainty measures.
                </p>
                <div className="p-3 glass-tile rounded-[4px] border border-[var(--color-border-subtle)] text-[11px] font-mono text-[var(--color-text-primary)] space-y-1">
                  <div>• Legal Rules Engine + Unsupervised Anomaly Scoring</div>
                  <div>• Verifiable Evidence Dossier with Integrity Hashes</div>
                  <div>• Counterfactual What-If Risk Analysis Simulator</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveToolId('laserfish');
                  setToastMessage('FraudEngine activated: Multi-signal risk assessment pipeline ready.');
                  setTimeout(() => setToastMessage(null), 4000);
                }}
                className="w-full py-2.5 text-xs font-semibold text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] glass-tile rounded-[3px] font-mono transition-colors cursor-pointer"
              >
                Explore FraudEngine →
              </button>
            </div>

            {/* Tool 3: Cologram / DocCompare */}
            <div className="p-8 rounded-[8px] space-y-5 hover:border-[var(--color-surface-raised)] transition-all flex flex-col justify-between glass-card group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--color-surface-raised)] font-semibold">03 · CONTRADICTION ENGINE</span>
                  <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">Bangla OCR & LLM Extraction</span>
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-surface-raised)] transition-colors">DocCompare</h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Extract structured fields from deeds, khatian, porcha, and mutation papers. Highlight exact conflicting dag numbers, plot boundaries, seller shares, and dates side-by-side with OCR confidence scores.
                </p>
                <div className="p-3 glass-tile rounded-[4px] border border-[var(--color-border-subtle)] text-[11px] font-mono text-[var(--color-text-primary)] space-y-1">
                  <div>• Multi-Document Cross-Verification (Deed vs. Khatian)</div>
                  <div>• Field-Level Discrepancy & Confidence Tagging</div>
                  <div>• Page-Level Evidence Citations & Discrepancy Reports</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveToolId('cologram');
                  setToastMessage('DocCompare contradiction analysis engine ready.');
                  setTimeout(() => setToastMessage(null), 4000);
                }}
                className="w-full py-2.5 text-xs font-semibold text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] glass-tile rounded-[3px] font-mono transition-colors cursor-pointer"
              >
                Launch DocCompare →
              </button>
            </div>

            {/* Tool 4: Globee / Adversarial Simulator */}
            <div className="p-8 rounded-[8px] space-y-5 hover:border-[var(--color-surface-raised)] transition-all flex flex-col justify-between glass-card group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--color-surface-raised)] font-semibold">04 · ADVERSARIAL SIMULATOR</span>
                  <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">Attack Benchmark</span>
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-surface-raised)] transition-colors">Adversarial Simulator</h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Simulate synthetic fraud attacks—such as double-selling, forged mutation timelines, and altered land areas—to benchmark detection performance, stress-test rules, and minimize false positives.
                </p>
                <div className="p-3 glass-tile rounded-[4px] border border-[var(--color-border-subtle)] text-[11px] font-mono text-[var(--color-text-primary)] space-y-1">
                  <div>• Synthetic Attack Vector Injection & Stress-Testing</div>
                  <div>• Benchmark Detection Rate & Precision-Recall Metrics</div>
                  <div>• Continuous Defense Hardening for Registry Security</div>
                </div>
              </div>
              <button
                onClick={() => setIsNoticeOpen(true)}
                className="w-full py-2.5 text-xs font-semibold text-white bg-[var(--color-surface-raised)] hover:brightness-110 rounded-[3px] font-mono transition-all cursor-pointer shadow-[0_4px_16px_rgba(34,197,94,0.3)]"
              >
                Open Adversarial Simulator →
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 
        ====================================================================
        PRICING SECTION:
        ====================================================================
      */}
      <MassPricingSection onSelectPlan={handleSelectPricingPlan} />

      {/* 
        ====================================================================
        BUILT PROJECTS SECTION & MONOGRAPH BENTO:
        ====================================================================
      */}
      <motion.section
        id="projects"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="py-24 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] transition-colors duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header with Functional Filter Buttons */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-border-subtle)] pb-6">
            <div>
              <div className="text-[10.56px] text-[var(--color-text-secondary)] uppercase tracking-widest font-mono mb-1">
                Investigated Records & Fraud Cases
              </div>
              <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
                Land Record Verifications & Detected Fraud Scenarios
              </h2>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 glass-pill rounded-[6px]">
              {[
                { id: 'all', label: 'All Cases' },
                { id: 'clean', label: 'Clean Verified' },
                { id: 'double', label: 'Double Sale' },
                { id: 'complex', label: 'Complex Fraud' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterCategory(tab.id)}
                  className={`px-3 py-1.5 text-[11.52px] font-mono transition-colors rounded-[3px] whitespace-nowrap shrink-0 cursor-pointer ${
                    filterCategory === tab.id
                      ? 'bg-[var(--color-surface-raised)] text-white font-semibold shadow-md'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-[8px] overflow-hidden group hover:border-[var(--color-surface-raised)] transition-all flex flex-col justify-between glass-card"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-black/60">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 glass-pill px-2.5 py-1 text-[9.6px] font-mono text-white rounded-[3px]">
                      {project.location}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[10.56px] text-[var(--color-text-secondary)] font-mono">
                      <span>{project.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{project.year}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-surface-raised)] transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
                      {project.summary}
                    </p>

                    <div className="pt-2 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-[11.52px] font-mono">
                      <span className="text-[var(--color-text-secondary)]">{project.metricLabel}</span>
                      <span className="text-[var(--color-text-primary)] font-bold mass-num">{project.metric}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full py-2.5 text-xs font-mono text-[var(--color-text-primary)] glass-tile border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] hover:text-[var(--color-surface-raised)] rounded-[3px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Inspect Investigation Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 
        ====================================================================
        METHODOLOGY SECTION:
        ====================================================================
      */}
      <motion.section
        id="methodology"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="py-20 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] transition-colors duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <div className="text-[10.56px] text-[var(--color-text-secondary)] uppercase tracking-widest font-mono">
              Detection Methodology
            </div>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
              Multi-Signal Ingestion to Cryptographic Evidence Pipeline
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              From unstandardized Bangla land documents and physical porchas to graph-based ownership verification and adversarial robustness testing, Probaho provides end-to-end evidence intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] rounded-[2px] space-y-4 shadow-sm">
              <div className="text-sm font-mono text-[var(--color-surface-raised)] font-semibold">
                01. Ingestion & Structured OCR
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                Deed, Khatian & Mutation Digitization
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Process legacy RS, SA, CS, and BS khatian records alongside modern digital deeds. Extract key legal fields with specialized Bangla OCR and record field confidence scores.
              </p>
            </div>

            <div className="p-6 bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] rounded-[2px] space-y-4 shadow-sm">
              <div className="text-sm font-mono text-[var(--color-surface-raised)] font-semibold">
                02. Graph Analysis & Cross-Verification
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                Temporal Graph & Contradiction Engine
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Construct directed temporal graphs representing ownership transfers over time. Cross-verify party names, transfer shares, and dag boundaries to flag legal impossibilities.
              </p>
            </div>

            <div className="p-6 bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] rounded-[2px] space-y-4 shadow-sm">
              <div className="text-sm font-mono text-[var(--color-surface-raised)] font-semibold">
                03. Explainable Risk & Evidence
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                Rule Justifications & Cryptographic Dossier
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Produce explainable risk assessments combining deterministic legal rules with anomaly detection. Export cryptographically verified audit trails with SHA-256 hashes.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 
        ====================================================================
        STUDIO COMMISSION INQUIRY FORM:
        ====================================================================
      */}
      <motion.section
        id="practice"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="py-20 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] transition-colors duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="text-[10.56px] text-[var(--color-text-secondary)] uppercase tracking-widest font-mono">
                Institutional Investigation
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                Request a land fraud audit or parcel investigation.
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Probaho partners with land registry offices, legal practices, banking institutions, and municipal authorities to audit high-risk land parcels and uncover fraudulent transfer claims.
              </p>

              <div className="space-y-3 font-mono text-xs text-[var(--color-text-secondary)]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--color-surface-raised)] rounded-full" />
                  <span>Direct analysis by senior land fraud intelligence team</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--color-surface-raised)] rounded-full" />
                  <span>Cryptographic SHA-256 evidence package with cross-document audit</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--color-surface-raised)] rounded-full" />
                  <span>Strict confidentiality & institutional data isolation protocols</span>
                </div>
              </div>
            </div>

            {/* The Form */}
            <div className="bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] p-8 rounded-[2px] shadow-2xl transition-colors">
              {formState === 'success' ? (
                <div className="py-8 text-center space-y-4">
                  <CheckCircle className="w-12 h-12 text-[var(--color-surface-raised)] mx-auto" />
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                    Investigation Request Dispatched
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto leading-relaxed">
                    Thank you. The Probaho intelligence team has received your parcel inquiry for <span className="text-[var(--color-text-primary)] font-semibold">{inquiryScope}</span>. An analyst will correspond directly via {inquiryEmail}.
                  </p>
                  <button
                    onClick={() => {
                      setFormState('idle');
                      setInquiryEmail('');
                      setInquiryNotes('');
                    }}
                    className="px-4 py-2 text-xs font-mono text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] rounded-[2px] cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-5">
                  <div>
                    <label className="block text-[11.52px] font-mono text-[var(--color-text-secondary)] mb-1.5">
                      OFFICIAL OR INSTITUTIONAL EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="analyst@land-registry.gov.bd"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="w-full px-[14px] py-[10px] text-[12.64px] bg-[var(--color-surface-base)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)] focus:border-[var(--color-surface-raised)] focus:outline-none rounded-[2px] transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11.52px] font-mono text-[var(--color-text-secondary)] mb-1.5">
                      INVESTIGATION TYPOLOGY
                    </label>
                    <select
                      value={inquiryScope}
                      onChange={(e) => setInquiryScope(e.target.value)}
                      className="w-full px-[14px] py-[10px] text-[12.64px] bg-[var(--color-surface-base)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] focus:border-[var(--color-surface-raised)] focus:outline-none rounded-[2px] transition-colors font-mono"
                    >
                      <option value="Commercial / High-Value Parcel Audit">Commercial / High-Value Parcel Audit</option>
                      <option value="Institutional Registry Bulk Verification">Institutional Registry Bulk Verification</option>
                      <option value="Double-Sale Legal Dispute Dossier">Double-Sale Legal Dispute Dossier</option>
                      <option value="Inheritance & Mutation Conflict Investigation">Inheritance & Mutation Conflict Investigation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11.52px] font-mono text-[var(--color-text-secondary)] mb-1.5">
                      PARCEL LOCATION, DAG & KHATIAN DETAILS
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Specify District, Mouza name, Dag/Plot numbers, Khatian identifiers, and estimated parcel area..."
                      value={inquiryNotes}
                      onChange={(e) => setInquiryNotes(e.target.value)}
                      className="w-full px-[14px] py-[10px] text-[12.64px] bg-[var(--color-surface-base)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)] focus:border-[var(--color-surface-raised)] focus:outline-none rounded-[2px] transition-colors font-mono"
                    />
                  </div>

                  {formState === 'error' && (
                    <div className="text-xs text-red-500 font-mono">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formState === 'loading'}
                    className="w-full py-3 text-xs font-semibold text-white bg-[var(--color-surface-raised)] hover:brightness-110 active:translate-y-[1px] rounded-[2px] transition-all flex items-center justify-center gap-2 font-mono cursor-pointer shadow-md"
                  >
                    {formState === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-current" />
                        <span>Transmitting Inquiry...</span>
                      </>
                    ) : (
                      <span>Transmit Investigation Request</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* 
        ====================================================================
        QUIET EDITORIAL FOOTER:
        ====================================================================
      */}
      <footer className="py-12 bg-[var(--color-surface-strong)] border-t border-[var(--color-border-subtle)] text-xs text-[var(--color-text-secondary)] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <ProbahoBrand size={24} textSize="text-lg" />
              <p className="text-[11.52px] mt-1 text-[var(--color-text-secondary)] max-w-sm">
                Intelligent land fraud detection & evidence intelligence for Bangladesh. Standardized under probaho.bd.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-[11.52px] font-mono">
              <a href="#tools" className="hover:text-[var(--color-text-primary)] transition-colors">Engines</a>
              <a href="#pricing" className="hover:text-[var(--color-text-primary)] transition-colors">Pricing</a>
              <a href="#projects" className="hover:text-[var(--color-text-primary)] transition-colors">Cases</a>
              <a href="#methodology" className="hover:text-[var(--color-text-primary)] transition-colors">Methodology</a>
              <button onClick={() => setIsAuthModalOpen(true)} className="hover:text-[var(--color-text-primary)] transition-colors cursor-pointer">Account</button>
            </div>
          </div>

          <div className="pt-6 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10.56px]">
            <div>
              © {new Date().getFullYear()} Probaho Intelligence Laboratory. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-[var(--color-text-tertiary)]">
              <span>WCAG 2.2 Level AA & AAA Verified</span>
              <span>·</span>
              <span className="capitalize">{mode} Mode Active</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 
        ====================================================================
        POPUP / NOTICE MODAL: Adversarial Simulator is Live
        ====================================================================
      */}
      <AnimatePresence>
        {isNoticeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 36, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] rounded-[2px] max-w-lg w-full p-6 shadow-2xl relative space-y-5"
              role="dialog"
              aria-modal="true"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-secondary)]">
                  <span className="text-[var(--color-surface-raised)] font-bold">SYSTEM NOTICE</span>
                  <span>·</span>
                  <span>Probaho · Adversarial Simulator</span>
                </div>
                <button
                  onClick={() => setIsNoticeOpen(false)}
                  className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-[2px] cursor-pointer"
                  aria-label="Close Notice"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Notice Image / Graphic */}
              <div className="relative aspect-[16/9] rounded-[2px] overflow-hidden border border-[var(--color-border-subtle)] bg-black">
                <img
                  src="/src/assets/images/map_tokyo_carto_1791915087818.jpg"
                  alt="Adversarial Fraud Simulation Grid"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-4">
                  <div className="text-sm font-semibold text-white">
                    Synthetic Attack & Fraud Stress-Testing Engine
                  </div>
                </div>
              </div>

              {/* Notice Body Text */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                  Adversarial Simulator is Live
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Double-sale injection · altered mutation dates · share deficit attacks — benchmark detection rates and prove robustness against real-world fraud schemes.
                </p>
                <p className="text-xs text-[var(--color-text-primary)] leading-relaxed">
                  Test and validate your rules with synthetic and historical land record anomaly datasets. Public preview enabled for verified organizations.
                </p>
                <div className="text-[10px] font-mono text-[var(--color-text-tertiary)] pt-1">
                  Posted: October 14, 2026 · Probaho Core
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                <label className="flex items-center gap-2 text-[11px] font-mono text-[var(--color-text-secondary)] cursor-pointer">
                  <input type="checkbox" className="accent-[var(--color-surface-raised)]" />
                  <span>Don't show again today</span>
                </label>

                <button
                  onClick={() => {
                    setIsNoticeOpen(false);
                    setIsSiteAnalysisStudioOpen(true);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[var(--color-surface-raised)] hover:brightness-110 rounded-[2px] flex items-center gap-1.5 font-mono cursor-pointer shadow-sm"
                >
                  <span>Launch Simulator →</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        ====================================================================
        INTERACTIVE SITE ANALYSIS STUDIO MODAL (Triggered by "Start archiMap →"):
        ====================================================================
      */}
      <AnimatePresence>
        {isSiteAnalysisStudioOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 44, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel rounded-[8px] max-w-5xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden"
              role="dialog"
              aria-modal="true"
            >
            {/* Header */}
            <div className="p-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between bg-black/30 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[var(--color-surface-raised)]">Probaho STUDIO</span>
                <span className="text-[var(--color-text-tertiary)]">|</span>
                <span className="text-xs text-[var(--color-text-primary)] font-semibold">{activeMap.cityName} Cadastral & Ownership Graph Studio</span>
                <span className="text-[10px] text-[var(--color-text-secondary)] font-mono hidden sm:inline">({activeMap.coordinates})</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 glass-pill p-1 rounded-[4px]">
                  {URBAN_MAP_DATASETS.map((m, idx) => (
                    <button
                      key={m.id}
                      onClick={() => setCurrentMapIndex(idx)}
                      className={`px-2.5 py-1 text-[10px] font-mono rounded-[3px] transition-colors cursor-pointer ${
                        idx === currentMapIndex
                          ? 'bg-[var(--color-surface-raised)] text-white font-bold shadow-sm'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10'
                      }`}
                    >
                      {m.cityName}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsSiteAnalysisStudioOpen(false)}
                  className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
                  aria-label="Close Studio"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Workspace: Map Viewport + Layer Control Panel */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
              {/* Map Canvas */}
              <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center">
                <img
                  src={activeMap.image}
                  alt={activeMap.cityName}
                  className={`w-full h-full object-cover ${
                    isDay ? 'invert-[0.93] hue-rotate-180 contrast-[1.12] brightness-[0.98]' : 'contrast-[1.12] brightness-[1.08]'
                  }`}
                  referrerPolicy="no-referrer"
                />

                {/* Simulated GIS layer vectors on top */}
                {activeGisLayers.buildings && (
                  <div className="absolute inset-0 pointer-events-none border border-[var(--color-surface-raised)]/30" />
                )}

                {/* HUD Overlay */}
                <div className="absolute top-4 left-4 glass-pill p-3 rounded-[4px] text-xs font-mono space-y-1">
                  <div className="text-[var(--color-surface-raised)] font-semibold">Active Registry: {activeMap.layers}</div>
                  <div className="text-[10px] text-[var(--color-text-secondary)]">Division: {activeMap.cityName} · CRS: EPSG:3857 · Cadastre: {activeMap.parcelCount}</div>
                </div>
              </div>

              {/* Layer Controls Sidebar */}
              <div className="w-full lg:w-72 glass-tile border-t lg:border-t-0 lg:border-l border-[var(--color-border-subtle)] p-5 space-y-6 overflow-y-auto font-mono text-xs">
                <div>
                  <div className="text-[10.56px] text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                    CADASTRAL & EVIDENCE GIS LAYERS
                  </div>
                  <div className="space-y-2">
                    {[
                      { key: 'buildings' as const, label: 'Mouza Cadastral Parcels (Dag plots)' },
                      { key: 'parcels' as const, label: 'Ownership Transfer Graph Edges' },
                      { key: 'roads' as const, label: 'Flagged Double-Sale Overlays' },
                      { key: 'terrain' as const, label: 'Mutation Discrepancy Vectors' },
                      { key: 'solar' as const, label: 'Deed vs Porcha Conflict Markers' },
                    ].map((layer) => (
                      <button
                        key={layer.key}
                        onClick={() => toggleGisLayer(layer.key)}
                        className={`w-full p-2.5 rounded-[3px] border text-left flex items-center justify-between transition-colors cursor-pointer ${
                          activeGisLayers[layer.key]
                            ? 'bg-[var(--color-surface-raised)]/15 border-[var(--color-surface-raised)] text-[var(--color-text-primary)] font-medium'
                            : 'glass-tile border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:border-[var(--color-surface-raised)]/50'
                        }`}
                      >
                        <span>{layer.label}</span>
                        {activeGisLayers[layer.key] && (
                          <Check className="w-3.5 h-3.5 text-[var(--color-surface-raised)]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 glass-tile rounded-[4px] border border-[var(--color-border-subtle)] text-[10px] text-[var(--color-text-secondary)] space-y-1.5">
                  <div className="text-[var(--color-text-primary)] font-semibold">Export Format Supported:</div>
                  <div>• GeoJSON, Shapefile, DXF, SVG Vector</div>
                  <div>• Cryptographic SHA-256 Evidence Report</div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setToastMessage(`Exported cadastral evidence package for ${activeMap.cityName}.`);
                      setTimeout(() => setToastMessage(null), 4000);
                    }}
                    className="w-full py-2.5 text-xs font-semibold text-white bg-[var(--color-surface-raised)] hover:brightness-110 rounded-[3px] transition-colors cursor-pointer shadow-[0_4px_16px_rgba(34,197,94,0.35)]"
                  >
                    Export Evidence Dossier (.PDF)
                  </button>
                </div>
              </div>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Project Monograph Inspector */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 28, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel rounded-[8px] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
              role="dialog"
              aria-modal="true"
            >
              <div className="sticky top-0 bg-black/40 backdrop-blur-md p-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between z-10">
                <div className="text-xs font-mono text-[var(--color-text-secondary)]">
                  INVESTIGATION DOSSIER · {selectedProject.id.toUpperCase()}
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-[3px] cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="relative aspect-[16/9] rounded-[4px] overflow-hidden border border-[var(--color-border-subtle)]">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div>
                  <div className="text-xs font-mono text-[var(--color-surface-raised)] mb-1">{selectedProject.category} · {selectedProject.location}</div>
                  <h3 className="text-2xl font-semibold text-[var(--color-text-primary)]">{selectedProject.title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">{selectedProject.summary}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 glass-tile rounded-[4px] border border-[var(--color-border-subtle)] font-mono text-xs">
                  <div>
                    <div className="text-[var(--color-text-secondary)]">Primary Metric</div>
                    <div className="text-base text-[var(--color-text-primary)] font-semibold mt-0.5">{selectedProject.metric} ({selectedProject.metricLabel})</div>
                  </div>
                  <div>
                    <div className="text-[var(--color-text-secondary)]">Parcel Identifier</div>
                    <div className="text-base text-[var(--color-text-primary)] font-semibold mt-0.5">{selectedProject.dimensions}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-mono text-[var(--color-text-secondary)] mb-2">SUPPORTING DOCUMENTARY EVIDENCE</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.materials.map((mat, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-xs font-mono glass-tile border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] rounded-[3px]"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--color-border-subtle)] flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-2 text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
                  >
                    Close Dossier
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProject(null);
                      setIsInquiryModalOpen(true);
                    }}
                    className="px-4 py-2 text-xs font-mono text-white bg-[var(--color-surface-raised)] hover:brightness-110 rounded-[3px] font-semibold cursor-pointer shadow-md"
                  >
                    Request Similar Parcel Audit
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Quick Commission Study Form */}
      <AnimatePresence>
        {isInquiryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 36, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel rounded-[8px] max-w-lg w-full p-6 shadow-2xl relative space-y-6"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
                <div className="text-xs font-mono text-[var(--color-surface-raised)] font-bold">
                  DIRECT TITLE INVESTIGATION INQUIRY
                </div>
                <button
                  onClick={() => setIsInquiryModalOpen(false)}
                  className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Connect directly with Probaho analysts for title verification and contradiction audits.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsInquiryModalOpen(false);
                  setToastMessage('Thank you. Your parcel investigation inquiry has been dispatched to Probaho.');
                  setTimeout(() => setToastMessage(null), 4000);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[11.52px] font-mono text-[var(--color-text-secondary)] mb-1">
                    OFFICIAL EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@organization.gov.bd"
                    className="w-full px-3 py-2 text-xs glass-tile text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] focus:border-[var(--color-surface-raised)] focus:outline-none rounded-[3px] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11.52px] font-mono text-[var(--color-text-secondary)] mb-1">
                    PARCEL LOCATION & TARGET TIMELINE
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mouza Mirpur · Dag 3078 · Dhaka"
                    className="w-full px-3 py-2 text-xs glass-tile text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] focus:border-[var(--color-surface-raised)] focus:outline-none rounded-[3px] font-mono"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsInquiryModalOpen(false)}
                    className="px-3 py-2 text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-mono text-white bg-[var(--color-surface-raised)] hover:brightness-110 rounded-[3px] font-semibold cursor-pointer shadow-md"
                  >
                    Send Investigation Brief
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal (Login / Sign Up) */}
      <MassAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      {/* Non-intrusive Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 max-w-md bg-[var(--color-surface-strong)] border border-[var(--color-surface-raised)] text-[var(--color-text-primary)] px-4 py-3 rounded-[2px] shadow-2xl flex items-center gap-3 font-mono text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle className="w-4 h-4 text-[var(--color-surface-raised)] shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-auto text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
