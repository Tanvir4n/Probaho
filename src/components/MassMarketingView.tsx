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
import { ProbahoLogo } from './ProbahoLogo';
import {
  ArrowRight,
  ChevronRight,
  X,
  CheckCircle,
  Loader2,
  Globe,
  Sliders,
  Layers,
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
            <span className="font-bold tracking-tight">Probaho</span>
          </a>

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

        {/* 
          ====================================================================
          RIGHT VERTICAL PRODUCT SWITCHER DOCK & GLASSMORPHIC SIDEBAR
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
        />

        {/* Hero Bottom Bar Info */}
        <div className="relative z-20 px-6 sm:px-10 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11.52px] font-mono text-[var(--color-text-secondary)] border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-base)]/70 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-surface-raised)]" />
            <span className="text-[var(--color-text-primary)] font-semibold">Probaho Cartography Core:</span>
            <span>Streaming {activeMap.cityName} ({activeMap.coordinates})</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#tools" className="hover:text-[var(--color-text-primary)] transition-colors">
              Suite Programs
            </a>
            <a href="#pricing" className="hover:text-[var(--color-text-primary)] transition-colors">
              Pricing Plans
            </a>
            <a href="#projects" className="hover:text-[var(--color-text-primary)] transition-colors">
              Built Projects ↓
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
              Probaho Integrated Suite
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Four Specialized Tools. One Unified Workflow.
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Designed from the ground up for contemporary architects, researchers, and parametric designers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tool 1: archiMap */}
            <div className="p-8 rounded-[8px] space-y-5 hover:border-[var(--color-surface-raised)] transition-all flex flex-col justify-between glass-card group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--color-surface-raised)] font-semibold">01 · SITE INTELLIGENCE</span>
                  <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">195 Countries</span>
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-surface-raised)] transition-colors">archiMap</h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Comprehensive 2D and 3D site analysis on a single page. Instant building heights, cadastral parcels, roads with true widths, and 3D terrain topography. Export directly to Rhino, AutoCAD, or Blender.
                </p>
                <div className="p-3 glass-tile rounded-[4px] border border-[var(--color-border-subtle)] text-[11px] font-mono text-[var(--color-text-primary)] space-y-1">
                  <div>• Building Data LOD 2 + True-Width Roads</div>
                  <div>• 350+ Global Geospatial Datasets</div>
                  <div>• Direct DXF, Shapefile & SVG Vector Pipe</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveToolId('archimap');
                  setIsSiteAnalysisStudioOpen(true);
                }}
                className="w-full py-2.5 text-xs font-semibold text-white bg-[var(--color-surface-raised)] hover:brightness-110 rounded-[3px] font-mono transition-all cursor-pointer shadow-[0_4px_16px_rgba(34,197,94,0.3)]"
              >
                Launch archiMap →
              </button>
            </div>

            {/* Tool 2: LaserFish */}
            <div className="p-8 rounded-[8px] space-y-5 hover:border-[var(--color-surface-raised)] transition-all flex flex-col justify-between glass-card group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--color-surface-raised)] font-semibold">02 · MODEL MAKING AUTOMATION</span>
                  <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">Rhino Plugin & Web</span>
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-surface-raised)] transition-colors">LaserFish</h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Automate the tedious manual work of preparing laser-cut drawings for physical architectural models. Automatically slice complex 3D meshes, apply kerf offsets, generate numbering, and lay out sheets.
                </p>
                <div className="p-3 glass-tile rounded-[4px] border border-[var(--color-border-subtle)] text-[11px] font-mono text-[var(--color-text-primary)] space-y-1">
                  <div>• Automatic Contour Slicing by Sheet Thickness</div>
                  <div>• 0.05mm Kerf Precision Compensation</div>
                  <div>• Production-Ready Nested DXF / SVG Exports</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveToolId('laserfish');
                  setToastMessage('LaserFish tool activated: Contour slicing pipeline ready.');
                  setTimeout(() => setToastMessage(null), 4000);
                }}
                className="w-full py-2.5 text-xs font-semibold text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] glass-tile rounded-[3px] font-mono transition-colors cursor-pointer"
              >
                Explore LaserFish →
              </button>
            </div>

            {/* Tool 3: Cologram */}
            <div className="p-8 rounded-[8px] space-y-5 hover:border-[var(--color-surface-raised)] transition-all flex flex-col justify-between glass-card group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--color-surface-raised)] font-semibold">03 · CHROMATIC & SOLAR MATRIX</span>
                  <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">Urban Palettes</span>
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-surface-raised)] transition-colors">Cologram</h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Extract surrounding architectural color signatures and analyze facade material reflectance. Harmonize proposed envelopes with existing historical and contextual material palettes.
                </p>
                <div className="p-3 glass-tile rounded-[4px] border border-[var(--color-border-subtle)] text-[11px] font-mono text-[var(--color-text-primary)] space-y-1">
                  <div>• Micro-Palette Extraction from Satellite & Street Views</div>
                  <div>• Heritage Zoning & Albedo Reflectance Calculations</div>
                  <div>• Export Swatches to Adobe, Figma & CAD</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveToolId('cologram');
                  setToastMessage('Cologram urban chromatic analysis ready.');
                  setTimeout(() => setToastMessage(null), 4000);
                }}
                className="w-full py-2.5 text-xs font-semibold text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] glass-tile rounded-[3px] font-mono transition-colors cursor-pointer"
              >
                Launch Cologram →
              </button>
            </div>

            {/* Tool 4: Globee */}
            <div className="p-8 rounded-[8px] space-y-5 hover:border-[var(--color-surface-raised)] transition-all flex flex-col justify-between glass-card group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--color-surface-raised)] font-semibold">04 · PLANETARY INTELLIGENCE</span>
                  <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">50+ Datasets</span>
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-surface-raised)] transition-colors">Globee</h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Planetary scale environmental datasets covering population density, terrain elevation, wind vectors, seasonal climate shifts, and atmospheric metrics across the entire globe.
                </p>
                <div className="p-3 glass-tile rounded-[4px] border border-[var(--color-border-subtle)] text-[11px] font-mono text-[var(--color-text-primary)] space-y-1">
                  <div>• Real-Time Climate & Atmospheric Monitoring</div>
                  <div>• Global Population Dispersion & Nighttime Irradiance</div>
                  <div>• Free to access during initial public release</div>
                </div>
              </div>
              <button
                onClick={() => setIsNoticeOpen(true)}
                className="w-full py-2.5 text-xs font-semibold text-white bg-[var(--color-surface-raised)] hover:brightness-110 rounded-[3px] font-mono transition-all cursor-pointer shadow-[0_4px_16px_rgba(34,197,94,0.3)]"
              >
                Open Globee →
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
                Monograph & Built Works
              </div>
              <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
                Physical Architecture & Structural Topologies
              </h2>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 glass-pill rounded-[6px]">
              {[
                { id: 'all', label: 'All Projects' },
                { id: 'pavilion', label: 'Pavilions' },
                { id: 'envelope', label: 'Envelopes' },
                { id: 'facility', label: 'Labs' },
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
                    <span>Inspect Monograph Spec</span>
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
              Algorithmic Workflow
            </div>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
              Site Analysis to Physical Fabrication Pipeline
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              From global planetary GIS layers in archiMap down to laser-cut structural prototypes in LaserFish, Probaho bridges computational mathematics and tangible architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] rounded-[2px] space-y-4 shadow-sm">
              <div className="text-sm font-mono text-[var(--color-surface-raised)] font-semibold">
                01. Planetary Site Intelligence
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                archiMap & Globee Datasets
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Stream 350+ GIS datasets, cadastral parcels, and 3D terrain contours across 195 countries in real time without manual shapefile stitching.
              </p>
            </div>

            <div className="p-6 bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] rounded-[2px] space-y-4 shadow-sm">
              <div className="text-sm font-mono text-[var(--color-surface-raised)] font-semibold">
                02. Urban Fabric & Palette
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                Cologram Solar & Chromatic Study
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Derive geological material pigments and solar radiation absorption profiles based on surrounding historic and contemporary built context.
              </p>
            </div>

            <div className="p-6 bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] rounded-[2px] space-y-4 shadow-sm">
              <div className="text-sm font-mono text-[var(--color-surface-raised)] font-semibold">
                03. Automated Laser Fabrication
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                LaserFish Vector Preparation
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Flatten complex 3D topography into precision-sliced acrylic, timber, and museum board sheets with automatic kerf offset computation.
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
                Studio Commission
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                Commission an architectural feasibility study.
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Probaho accepts a select cohort of civic, cultural, and private architectural commissions each cycle. Our research partners and lead architects review all inquiries within 48 business hours.
              </p>

              <div className="space-y-3 font-mono text-xs text-[var(--color-text-secondary)]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--color-surface-raised)] rounded-full" />
                  <span>Direct architectural principal review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--color-surface-raised)] rounded-full" />
                  <span>Comprehensive embodied carbon report with initial envelope study</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--color-surface-raised)] rounded-full" />
                  <span>Confidential NDA executed upon inquiry confirmation</span>
                </div>
              </div>
            </div>

            {/* The Form */}
            <div className="bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] p-8 rounded-[2px] shadow-2xl transition-colors">
              {formState === 'success' ? (
                <div className="py-8 text-center space-y-4">
                  <CheckCircle className="w-12 h-12 text-[var(--color-surface-raised)] mx-auto" />
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                    Commission Inquiry Dispatched
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto leading-relaxed">
                    Thank you. The Probaho principal team has received your project briefing for <span className="text-[var(--color-text-primary)] font-semibold">{inquiryScope}</span>. A partner will correspond directly via {inquiryEmail}.
                  </p>
                  <button
                    onClick={() => {
                      setFormState('idle');
                      setInquiryEmail('');
                      setInquiryNotes('');
                    }}
                    className="px-4 py-2 text-xs font-mono text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] rounded-[2px] cursor-pointer"
                  >
                    Submit Another Briefing
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-5">
                  <div>
                    <label className="block text-[11.52px] font-mono text-[var(--color-text-secondary)] mb-1.5">
                      CORPORATE OR INSTITUTION EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="principal@practice-or-fund.com"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="w-full px-[14px] py-[10px] text-[12.64px] bg-[var(--color-surface-base)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)] focus:border-[var(--color-surface-raised)] focus:outline-none rounded-[2px] transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11.52px] font-mono text-[var(--color-text-secondary)] mb-1.5">
                      COMMISSION TYPOLOGY
                    </label>
                    <select
                      value={inquiryScope}
                      onChange={(e) => setInquiryScope(e.target.value)}
                      className="w-full px-[14px] py-[10px] text-[12.64px] bg-[var(--color-surface-base)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] focus:border-[var(--color-surface-raised)] focus:outline-none rounded-[2px] transition-colors font-mono"
                    >
                      <option value="Parametric Enclosure">Parametric Civic Enclosure</option>
                      <option value="Adaptive Facade Engineering">Adaptive Kinetic Facade Engineering</option>
                      <option value="Monumental Pavilion">Monumental Research Pavilion</option>
                      <option value="Spatial Lab Masterplan">Spatial Lab Masterplan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11.52px] font-mono text-[var(--color-text-secondary)] mb-1.5">
                      SITE LOCATION & PRELIMINARY SCOPE
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Outline approximate square meters, geographic jurisdiction, and programmatic intent..."
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
                        <span>Transmitting Briefing...</span>
                      </>
                    ) : (
                      <span>Transmit Architectural Commission Brief</span>
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
              <div className="flex items-center gap-2.5">
                <ProbahoLogo size={20} className="text-[var(--color-surface-raised)]" />
                <div className="text-base font-semibold text-[var(--color-text-primary)] tracking-tight">Probaho</div>
              </div>
              <p className="text-[11.52px] mt-1 text-[var(--color-text-secondary)] max-w-sm">
                Site analysis, model making & laser-cut drawings. Standardized under probaho.io.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-[11.52px] font-mono">
              <a href="#tools" className="hover:text-[var(--color-text-primary)] transition-colors">Programs</a>
              <a href="#pricing" className="hover:text-[var(--color-text-primary)] transition-colors">Pricing</a>
              <a href="#projects" className="hover:text-[var(--color-text-primary)] transition-colors">Projects</a>
              <a href="#methodology" className="hover:text-[var(--color-text-primary)] transition-colors">Methodology</a>
              <button onClick={() => setIsAuthModalOpen(true)} className="hover:text-[var(--color-text-primary)] transition-colors cursor-pointer">Account</button>
            </div>
          </div>

          <div className="pt-6 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10.56px]">
            <div>
              © {new Date().getFullYear()} Probaho Architectural Laboratory. All rights reserved.
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
        POPUP / NOTICE MODAL (From Video at 0:26! "Globee is live"):
        ====================================================================
      */}
      {/* 
        ====================================================================
        POPUP / NOTICE MODAL (From Video at 0:26! "Globee is live"):
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
                  <span className="text-[var(--color-surface-raised)] font-bold">NOTICE</span>
                  <span>·</span>
                  <span>Probaho · Globee</span>
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
                  alt="Globee Planetary GIS Grid"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-4">
                  <div className="text-sm font-semibold text-white">
                    Global Planetary Intelligence Grid
                  </div>
                </div>
              </div>

              {/* Notice Body Text */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                  Globee is live
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Population & society · terrain · climate · atmosphere — 50+ datasets, from everyday life to outer space.
                </p>
                <p className="text-xs text-[var(--color-text-primary)] leading-relaxed">
                  Become a bee and explore data from every corner of the Earth. Free to use until October 31.
                </p>
                <div className="text-[10px] font-mono text-[var(--color-text-tertiary)] pt-1">
                  Posted: October 13, 2026 · Probaho Core
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
                  <span>Open →</span>
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
                <span className="text-xs font-mono font-bold text-[var(--color-surface-raised)]">archiMap STUDIO</span>
                <span className="text-[var(--color-text-tertiary)]">|</span>
                <span className="text-xs text-[var(--color-text-primary)] font-semibold">{activeMap.cityName} Urban Site Analysis</span>
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
                  <div className="text-[var(--color-surface-raised)] font-semibold">Active Dataset: {activeMap.layers}</div>
                  <div className="text-[10px] text-[var(--color-text-secondary)]">Scale: 1:2500 · Projection: EPSG:3857 · Elevation: +12.4m</div>
                </div>
              </div>

              {/* Layer Controls Sidebar */}
              <div className="w-full lg:w-72 glass-tile border-t lg:border-t-0 lg:border-l border-[var(--color-border-subtle)] p-5 space-y-6 overflow-y-auto font-mono text-xs">
                <div>
                  <div className="text-[10.56px] text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                    SITE ANALYSIS GIS LAYERS
                  </div>
                  <div className="space-y-2">
                    {[
                      { key: 'buildings' as const, label: 'Building Footprints (8+ levels)' },
                      { key: 'parcels' as const, label: 'Cadastral Parcel Boundaries' },
                      { key: 'roads' as const, label: 'True-Width Road Polygons' },
                      { key: 'terrain' as const, label: '3D Topographic Contours' },
                      { key: 'solar' as const, label: 'Solar Irradiance Analysis' },
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
                  <div>• Rhino Grasshopper Mesh Direct Pipe</div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setToastMessage(`Exported site analysis vector package for ${activeMap.cityName}.`);
                      setTimeout(() => setToastMessage(null), 4000);
                    }}
                    className="w-full py-2.5 text-xs font-semibold text-white bg-[var(--color-surface-raised)] hover:brightness-110 rounded-[3px] transition-colors cursor-pointer shadow-[0_4px_16px_rgba(34,197,94,0.35)]"
                  >
                    Export Vector Package (.DXF)
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
                  MONOGRAPH SPECIFICATION · {selectedProject.id.toUpperCase()}
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
                    <div className="text-[var(--color-text-secondary)]">Spatial Footprint</div>
                    <div className="text-base text-[var(--color-text-primary)] font-semibold mt-0.5">{selectedProject.dimensions}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-mono text-[var(--color-text-secondary)] mb-2">SPECIFIED MATERIAL PALETTE</div>
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
                    Close Monograph
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProject(null);
                      setIsInquiryModalOpen(true);
                    }}
                    className="px-4 py-2 text-xs font-mono text-white bg-[var(--color-surface-raised)] hover:brightness-110 rounded-[3px] font-semibold cursor-pointer shadow-md"
                  >
                    Commission Similar Envelope
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
                  DIRECT STUDIO COMMISSION INQUIRY
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
                Connect directly with Probaho partners for structural feasibility and carbon reduction modeling.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsInquiryModalOpen(false);
                  setToastMessage('Thank you. Your architectural inquiry has been sent to Probaho.');
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
                    placeholder="name@organization.com"
                    className="w-full px-3 py-2 text-xs glass-tile text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] focus:border-[var(--color-surface-raised)] focus:outline-none rounded-[3px] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11.52px] font-mono text-[var(--color-text-secondary)] mb-1">
                    PROJECT LOCATION & TARGET TIMELINE
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Zurich Canton · Q4 2026"
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
                    Send Briefing
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
