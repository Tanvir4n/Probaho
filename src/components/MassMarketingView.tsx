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
import mapTokyo from '../assets/images/map_tokyo_carto_1791915087818.jpg';
import { ArchitecturalMapController } from './ArchitecturalMapController';
import { MassPricingSection } from './MassPricingSection';
import { MassAuthModal } from './MassAuthModal';
import { MassGlassSidebar } from './MassGlassSidebar';
import { PageTransitionEffect } from './PageTransitionEffect';
import { JomiChainSection } from './JomiChainSection';
import { RiskAnalyticsDashboard } from './RiskAnalyticsDashboard';
import { ProbahoLogo, ProbahoBrand } from './ProbahoLogo';
import { DhakaD3CadastralMap } from './DhakaD3CadastralMap';
import { TemporalOwnershipGraphStudio } from './TemporalOwnershipGraphStudio';
import { ArchitecturalFooter } from './ArchitecturalFooter';
import { DocCompareStudioModal } from './DocCompareStudioModal';
import { AdversarialSimulatorStudioModal } from './AdversarialSimulatorStudioModal';
import {
  OwnershipGraphWidget,
  FraudEngineGaugeWidget,
  DocCompareScannerWidget,
  AdversarialSimulatorWidget,
  CadastralSectionTransitionBeam,
} from './AnimatedEngineWidgets';
import {
  ShieldCheck,
  TrendingUp,
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
  Scale,
  Hash,
  FileCheck2,
  SlidersHorizontal,
  RotateCcw,
  Zap,
  ShieldAlert,
  Terminal,
  Activity,
  Scan,
  Copy,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

interface MassMarketingViewProps {
  onOpenDesignSystem?: () => void;
}

export const MassMarketingView: React.FC<MassMarketingViewProps> = ({
  onOpenDesignSystem,
}) => {
  const { mode, isDay, toggleMode, palette } = useTheme();
  const { language, setLanguage, toggleLanguage, isBangla, t } = useLanguage();
  const [currentMapIndex, setCurrentMapIndex] = useState(0);
  const [activeToolId, setActiveToolId] = useState<string>('masslabs');
  const [selectedProject, setSelectedProject] = useState<ArchitecturalProject | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [isSiteAnalysisStudioOpen, setIsSiteAnalysisStudioOpen] = useState(false);
  const [isFraudStudioOpen, setIsFraudStudioOpen] = useState(false);
  const [isDocCompareStudioOpen, setIsDocCompareStudioOpen] = useState(false);
  const [isAdversarialStudioOpen, setIsAdversarialStudioOpen] = useState(false);
  const [isWhatIfSimulated, setIsWhatIfSimulated] = useState(false);
  const [isHashVerified, setIsHashVerified] = useState(false);
  const [isViTVerified, setIsViTVerified] = useState(false);
  const [isWafVerified, setIsWafVerified] = useState(false);
  const [isMonteCarloRunning, setIsMonteCarloRunning] = useState(false);
  const [studioCityIndex, setStudioCityIndex] = useState(0); // Anchored to 0 (Dhaka) for Cadastral Studio

  // Authentication State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Blueprint Animation Speed & Pause Technical Controls (Paused by default so cities never jump unexpectedly)
  const [isBlueprintPaused, setIsBlueprintPaused] = useState(true);
  const [blueprintSpeed, setBlueprintSpeed] = useState<number>(1.0);
  const [mapOverlayOpacity, setMapOverlayOpacity] = useState<number>(0.18);
  const [blueprintZoom, setBlueprintZoom] = useState<number>(0.40); // Compact Zoomed-out Start (40% scale, "size ektu komay dew")

  // Cartography & Blueprint Layers Visibility
  const [layersVisibility, setLayersVisibility] = useState({
    cartography: true,
    cadGrid: true,
    topographyContours: true,
  });

  const handleToggleLayer = (layerKey: 'cartography' | 'cadGrid' | 'topographyContours') => {
    setLayersVisibility((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  };

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
  const activeStudioMap = URBAN_MAP_DATASETS[studioCityIndex];

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
          autoPlay={false}
          isPaused={isBlueprintPaused || isSiteAnalysisStudioOpen}
          onTogglePause={() => setIsBlueprintPaused((prev) => !prev)}
          speedMultiplier={blueprintSpeed}
          onSpeedChange={setBlueprintSpeed}
          overlayOpacity={mapOverlayOpacity}
          onOverlayOpacityChange={setMapOverlayOpacity}
          themeMode={mode}
          zoomLevel={blueprintZoom}
          onZoomChange={setBlueprintZoom}
          layersVisibility={layersVisibility}
        />

        {/* 
          ====================================================================
          TOP NAVIGATION BAR:
          Left: MassLabs 3-Node Connected M Logo + Wordmark
          Right: PRICING · LOGIN · 9+ Bell · LANGUAGE dropdown · DAY/NIGHT TOGGLE
          ====================================================================
        */}
        <header className={`relative z-30 px-6 sm:px-10 py-4 flex items-center justify-between border-b transition-colors duration-200 backdrop-blur-2xl backdrop-saturate-180 ${isDay
            ? 'bg-white/60 border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)]'
            : 'bg-[#0b0d0e]/60 border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.12)]'
          }`}>
          {/* Brand Logo & Emblem */}
          <a
            href="/"
            className="flex items-center gap-3 text-xl font-bold tracking-tight text-[var(--color-text-primary)] whitespace-nowrap hover:opacity-90 transition-opacity group"
          >
            <ProbahoLogo className="w-7 h-7 text-[var(--color-text-primary)] group-hover:text-[var(--color-surface-raised)] shrink-0 transition-colors" />
            <span className="font-bold tracking-tight font-sans text-[var(--color-text-primary)] transition-colors text-xl">
              {isBangla ? 'প্রবাহ' : 'Probaho'}
            </span>
          </a>

          {/* Desktop Direct Section Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-mono tracking-wider text-[var(--color-text-secondary)]">
            <a href="#tools" className="hover:text-[var(--color-text-primary)] transition-colors uppercase font-medium">
              {t.nav.engines}
            </a>
            <a
              href="#risk-analytics"
              className="text-[var(--color-surface-raised)] hover:brightness-110 transition-colors uppercase font-bold flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{isBangla ? 'ঝুঁকি অ্যানালিটিক্স' : 'Risk Analytics'}</span>
            </a>
            <a
              href="#jomichain"
              className="hover:text-[var(--color-text-primary)] transition-colors uppercase font-medium flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.nav.jomichain}</span>
            </a>
            <a href="#projects" className="hover:text-[var(--color-text-primary)] transition-colors uppercase font-medium">
              {t.cases.tabAll}
            </a>
            <a href="#methodology" className="hover:text-[var(--color-text-primary)] transition-colors uppercase font-medium">
              {t.nav.methodology}
            </a>
            <a href="#pricing" className="hover:text-[var(--color-text-primary)] transition-colors uppercase font-medium">
              {t.nav.pricing}
            </a>
            <button
              onClick={() => setIsSiteAnalysisStudioOpen(true)}
              className="text-[var(--color-surface-raised)] hover:brightness-110 transition-colors uppercase font-medium cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isBangla ? 'স্টুডিও' : 'Studio'}</span>
            </button>
          </nav>

          {/* Right Navigation Controls */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono tracking-wider text-[var(--color-text-secondary)]">
            <a
              href="#pricing"
              className="hover:text-[var(--color-text-primary)] transition-colors uppercase font-medium"
            >
              {t.nav.pricing}
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
                {t.nav.account}
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

            {/* Instant Bilingual Switcher Toggle (EN ⇄ বাংলা) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-[var(--color-text-primary)] hover:opacity-90 transition-all uppercase text-[11px] py-1.5 px-3 border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] rounded-[3px] glass-tile font-mono cursor-pointer shadow-sm group"
              title={isBangla ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
              aria-label={`Current language: ${language}. Click to toggle.`}
            >
              <Globe className="w-3.5 h-3.5 text-[var(--color-surface-raised)] group-hover:rotate-180 transition-transform duration-500" />
              <span className="font-bold text-[var(--color-surface-raised)]">{isBangla ? 'বাংলা' : 'EN'}</span>
              <span className="text-[9px] text-[var(--color-text-secondary)] font-normal">| {isBangla ? 'EN' : 'বাং'}</span>
            </button>

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
                  <span className="font-semibold text-[var(--color-text-primary)]">{isBangla ? 'ডে' : 'DAY'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#22c55e] group-hover:-rotate-12 transition-transform" />
                  <span className="font-semibold text-[var(--color-text-primary)]">{isBangla ? 'নাইট' : 'NIGHT'}</span>
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
                {isBangla && activeTool.id === 'masslabs'
                  ? 'ঘটনার পূর্বেই ভূমি জালিয়াতি শনাক্ত করুন'
                  : isBangla && activeTool.id === 'archimap'
                  ? 'ধারাবাহিক মালিকানা চেইন বিশ্লেষণ'
                  : isBangla && activeTool.id === 'cologram'
                  ? 'দলিল ও খতিয়ান অসঙ্গতি বিশ্লেষণ'
                  : isBangla && activeTool.id === 'laserfish'
                  ? 'ব্যাখ্যাযোগ্য ভূমি ঝুঁকি নির্ণয়'
                  : activeTool.headline}
              </h1>

              {/* Metadata Subtitle 1 */}
              <p className="text-base sm:text-lg text-[var(--color-text-primary)] font-normal leading-relaxed max-w-3xl drop-shadow-sm opacity-90">
                {isBangla && activeTool.id === 'masslabs'
                  ? 'মালিকানা গ্রাফ · বহু-নথি ক্রস-যাচাইকরণ · ব্যাখ্যাযোগ্য ঝুঁকি স্কোরিং · আক্রমণ স্ট্রেস-টেস্টিং'
                  : isBangla && activeTool.id === 'archimap'
                  ? 'মৌজা প্লট গ্রাফ · ধারাবাহিক স্থানান্তর চেইন · দ্বৈত-বিক্রয় শনাক্তকরণ · হিস্যা বণ্টন যাচাই'
                  : isBangla && activeTool.id === 'cologram'
                  ? 'বাংলা ওসিআর নিষ্কাশন · ফিল্ড-লেভেল বৈপরীত্য তুলনা · দাগ/খতিয়ান/জমির পরিমাণ দ্বন্দ্ব'
                  : isBangla && activeTool.id === 'laserfish'
                  ? 'আইনি নিয়ম ও অ্যানোমালি ডিটেকশন · তীব্রতা পরিমাপ · ক্রিপ্টোগ্রাফিক প্রমাণ ট্রেইল'
                  : activeTool.meta}
              </p>

              {/* Subtitle 2 */}
              <p className="text-base sm:text-lg text-[var(--color-text-secondary)] font-normal leading-relaxed max-w-2xl drop-shadow-sm pb-2">
                {isBangla && activeTool.id === 'masslabs'
                  ? t.hero.description
                  : isBangla && activeTool.id === 'archimap'
                  ? 'প্রতিটি প্লট, মালিক, দলিল ও নামজারিকে ধারাবাহিক গ্রাফ হিসেবে সংযুক্ত করুন। সময়ের সাথে মালিকানা পরিবর্তনের অসঙ্গতি ও অসম্ভব হস্তান্তর শনাক্ত করুন।'
                  : isBangla && activeTool.id === 'cologram'
                  ? 'দলিল, খতিয়ান ও নামজারি থেকে স্বয়ংক্রিয়ভাবে তথ্য উদ্ধৃত করে বিতর্কিত দাগ নম্বর, সীমানা ও হিস্যার পার্থক্য পাশাপাশি দেখুন।'
                  : isBangla && activeTool.id === 'laserfish'
                  ? 'প্রতিটি সতর্কতায় লঙ্ঘিত আইনি ধারা, প্রামাণ্য রেকর্ড ও তীব্রতা স্পষ্টভাবে উল্লেখ থাকে—কেবলমাত্র একটি স্কোর নয়।'
                  : activeTool.description}
              </p>

              {/* Primary Action Button */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setIsSiteAnalysisStudioOpen(true)}
                  className="px-8 py-3.5 text-base font-bold text-white bg-[var(--color-surface-raised)] hover:brightness-110 active:translate-y-[1px] rounded-[3px] transition-all whitespace-nowrap flex items-center gap-3 shadow-[0_12px_32px_rgba(34,197,94,0.38),inset_0_1.5px_1px_rgba(255,255,255,0.35)] group focus-visible:ring-2 focus-visible:ring-[var(--color-border-strong)] outline-none cursor-pointer backdrop-blur-md"
                >
                  <span>
                    {isBangla
                      ? (activeTool.id === 'masslabs' ? 'অনুসন্ধান শুরু করুন →' : `${activeTool.name} চালু করুন →`)
                      : activeTool.ctaText}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="#jomichain"
                  className="px-6 py-3.5 text-base font-bold text-[var(--color-text-primary)] glass-tile border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] rounded-[3px] transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer shadow-md backdrop-blur-md"
                >
                  <ShieldCheck className="w-4 h-4 text-[var(--color-surface-raised)]" />
                  <span>{t.hero.ctaSecondary}</span>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Interactive Blueprint & Cartography Telemetry Controller (Shifted to Bottom Right of Hero) */}
        <div className="relative z-30 px-6 sm:px-12 lg:px-20 pb-6 hidden sm:flex justify-end pointer-events-auto">
          <ArchitecturalMapController
            currentMapIndex={currentMapIndex}
            onSelectMap={setCurrentMapIndex}
            isPaused={isBlueprintPaused}
            onTogglePause={() => setIsBlueprintPaused((prev) => !prev)}
            zoomLevel={blueprintZoom}
            onZoomChange={setBlueprintZoom}
            overlayOpacity={mapOverlayOpacity}
            onOverlayOpacityChange={setMapOverlayOpacity}
            layersVisibility={layersVisibility}
            onToggleLayer={handleToggleLayer}
            isDay={isDay}
          />
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
        CADASTRAL SECTION TRANSITION BEAM: Telemetry runner to Section 02
        ====================================================================
      */}
      <CadastralSectionTransitionBeam />

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
        className="py-24 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] transition-colors duration-200 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-surface-raised)]/10 border border-[var(--color-surface-raised)]/30 text-[11px] font-mono uppercase tracking-widest text-[var(--color-surface-raised)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-surface-raised)] animate-ping" />
              <span>{t.suite.sectionTag}</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
              {t.suite.heading}
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {t.suite.subheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tool 1: archiMap / Ownership Graph */}
            <motion.div
              layoutId="temporal-ownership-graph-modal"
              whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
              onClick={() => {
                setCurrentMapIndex(0);
                setStudioCityIndex(0);
                setActiveToolId('archimap');
                setIsSiteAnalysisStudioOpen(true);
              }}
              className="p-7 rounded-[8px] space-y-5 border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] transition-all flex flex-col justify-between glass-card group hover:shadow-[0_16px_48px_rgba(34,197,94,0.18)] cursor-pointer"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--color-surface-raised)] font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-surface-raised)] animate-pulse" />
                    {t.suite.tool1.type}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--color-text-secondary)] px-2 py-0.5 rounded bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)]">{t.suite.tool1.sub}</span>
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-surface-raised)] transition-colors">{t.suite.tool1.name}</h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {t.suite.tool1.desc}
                </p>

                {/* Micro-Animated SVG Graph Widget */}
                <OwnershipGraphWidget
                  onLaunchStudio={() => {
                    setCurrentMapIndex(0);
                    setStudioCityIndex(0);
                    setActiveToolId('archimap');
                    setIsSiteAnalysisStudioOpen(true);
                  }}
                />

                <div className="p-3.5 glass-tile rounded-[6px] border border-[var(--color-border-subtle)] text-[11px] font-mono text-[var(--color-text-primary)] space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{t.suite.tool1.f1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{t.suite.tool1.f2}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{t.suite.tool1.f3}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setCurrentMapIndex(0);
                  setStudioCityIndex(0);
                  setActiveToolId('archimap');
                  setIsSiteAnalysisStudioOpen(true);
                }}
                className="w-full py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-[5px] font-mono transition-all cursor-pointer shadow-[0_4px_18px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2"
              >
                <span>{t.suite.tool1.cta}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Tool 2: LaserFish / FraudEngine */}
            <motion.div
              whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
              className="p-7 rounded-[8px] space-y-5 border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] transition-all flex flex-col justify-between glass-card group hover:shadow-[0_16px_48px_rgba(34,197,94,0.18)]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-red-500 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    {t.suite.tool2.type}
                  </span>
                  <span className="text-[10px] font-mono text-red-600 dark:text-red-400 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30">{t.suite.tool2.sub}</span>
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-surface-raised)] transition-colors">{t.suite.tool2.name}</h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {t.suite.tool2.desc}
                </p>

                {/* Micro-Animated Radial Risk Gauge Widget with Scenario and What-If Sync */}
                <FraudEngineGaugeWidget
                  isSimulated={isWhatIfSimulated}
                  onToggleSimulate={setIsWhatIfSimulated}
                  onOpenStudio={() => {
                    setIsFraudStudioOpen(true);
                    setActiveToolId('laserfish');
                  }}
                />

                {/* Practical Interactive Legal & Evidence Intelligence Deck */}
                <div className="space-y-2 text-[11px] font-mono">
                  {/* Feature 1: Deterministic Legal Rules Engine */}
                  <div className="p-2.5 glass-tile rounded-[6px] border border-[var(--color-border-subtle)] hover:border-rose-500/30 transition-all flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-[var(--color-text-primary)]">
                        <Scale className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{isBangla ? 'আইনি বিধি ইঞ্জিন (নিশ্চিত কোড)' : 'Deterministic Legal Rules AST'}</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/25">
                        42 {isBangla ? 'ধারা' : 'Rules'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1 text-[9.5px]">
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[var(--color-text-secondary)]">
                        TP Act §53A
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[var(--color-text-secondary)]">
                        SAT Act §89
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[var(--color-text-secondary)]">
                        Reg Act §17
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[var(--color-text-secondary)]">
                        Penal §420
                      </span>
                    </div>
                  </div>

                  {/* Feature 2: Verifiable Evidence Dossier with Integrity Hashes */}
                  <div className="p-2.5 glass-tile rounded-[6px] border border-[var(--color-border-subtle)] hover:border-emerald-500/30 transition-all flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-[var(--color-text-primary)]">
                        <FileCheck2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{isBangla ? 'সততা হ্যাশযুক্ত প্রামাণ্য ডসিয়ার' : 'Verifiable Evidence Dossier'}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsHashVerified(true);
                          setToastMessage(isBangla ? '✓ মারকেল রুট যাচাইকৃত: ব্লক #৮৪৯,২০১ (জমিচেইন লেজার)' : '✓ Merkle Root Verified: Block #849,201 on JomiChain Ledger');
                          setTimeout(() => setToastMessage(null), 3500);
                        }}
                        className={`text-[9px] px-1.5 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
                          isHashVerified
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                            : 'bg-white/5 hover:bg-emerald-500/10 text-[var(--color-text-secondary)] hover:text-emerald-400 border border-white/10'
                        }`}
                        title={isBangla ? 'ক্রিপ্টোগ্রাফিক হ্যাশ যাচাই করুন' : 'Verify Cryptographic Hash on Ledger'}
                      >
                        <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
                        <span>{isHashVerified ? (isBangla ? 'যাচাইকৃত ✓' : 'VERIFIED ✓') : (isBangla ? 'যাচাই' : 'Verify')}</span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-[var(--color-text-secondary)] font-mono bg-black/20 px-2 py-1 rounded">
                      <span className="truncate">SHA256: 9f8a3c42e81b...7b94</span>
                      <span className="text-emerald-400 shrink-0 ml-1">256-bit</span>
                    </div>
                  </div>

                  {/* Feature 3: Counterfactual What-If Risk Analysis Simulator */}
                  <div className="p-2.5 glass-tile rounded-[6px] border border-[var(--color-border-subtle)] hover:border-cyan-500/30 transition-all flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-[var(--color-text-primary)]">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{isBangla ? 'কাউন্টারফ্যাকচুয়াল ঝুঁকি বিশ্লেষণ' : 'Counterfactual What-If Engine'}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsWhatIfSimulated(!isWhatIfSimulated);
                        }}
                        className={`text-[9px] px-1.5 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
                          isWhatIfSimulated
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-sm'
                            : 'bg-white/5 hover:bg-cyan-500/10 text-[var(--color-text-secondary)] hover:text-cyan-400 border border-white/10'
                        }`}
                        title={isBangla ? 'গেজে প্রতিকার পরীক্ষা করুন' : 'Run What-If Test in Gauge'}
                      >
                        <RotateCcw className={`w-2.5 h-2.5 ${isWhatIfSimulated ? 'rotate-180 text-cyan-300' : ''} transition-transform`} />
                        <span>{isWhatIfSimulated ? (isBangla ? 'সিমুলেশন চলছে' : 'Active Test') : (isBangla ? 'পরীক্ষা করুন' : 'Run Test')}</span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-[var(--color-text-secondary)]">
                      <span>{isBangla ? 'প্রতিকার প্রভাব (Causal Δ):' : 'Causal Remedy Estimate:'}</span>
                      <span className="text-emerald-400 font-bold font-mono">ΔRisk = -76 pts (p &lt; 0.001)</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsFraudStudioOpen(true);
                  setActiveToolId('laserfish');
                  setToastMessage(isBangla ? 'ফ্রডইঞ্জিন অ্যানালিটিক্স স্টুডিও লোড হচ্ছে...' : 'Launching FraudEngine Risk Analytics Studio...');
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="w-full py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 rounded-[5px] font-mono transition-all cursor-pointer shadow-[0_4px_18px_rgba(244,63,94,0.35)] hover:shadow-[0_6px_24px_rgba(244,63,94,0.5)] flex items-center justify-center gap-2 group/btn"
              >
                <span>{t.suite.tool2.cta}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Tool 3: Cologram / DocCompare */}
            <motion.div
              layoutId="doc-compare-studio-modal"
              whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
              onClick={() => {
                setActiveToolId('cologram');
                setIsDocCompareStudioOpen(true);
              }}
              className="p-7 rounded-[8px] space-y-5 border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] transition-all flex flex-col justify-between glass-card group hover:shadow-[0_16px_48px_rgba(6,182,212,0.18)] cursor-pointer"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    {t.suite.tool3.type}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">{t.suite.tool3.sub}</span>
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-surface-raised)] transition-colors">{t.suite.tool3.name}</h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {t.suite.tool3.desc}
                </p>

                {/* Micro-Animated Dual-Document Scanner Widget */}
                <DocCompareScannerWidget
                  onOpenStudio={() => {
                    setActiveToolId('cologram');
                    setIsDocCompareStudioOpen(true);
                  }}
                />

                {/* Practical Interactive Cross-Verification & ViT Intelligence Deck */}
                <div className="space-y-2 text-[11px] font-mono">
                  {/* Feature 1: Multi-Document Cross-Verification */}
                  <div className="p-2.5 glass-tile rounded-[6px] border border-[var(--color-border-subtle)] hover:border-cyan-500/30 transition-all flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-[var(--color-text-primary)]">
                        <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{isBangla ? 'বহু-নথি ক্রস-যাচাই (দলিল বনাম খতিয়ান)' : 'Multi-Document Cross-Verification'}</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                        {isBangla ? 'আইন ↔ ভূমি' : 'Law ↔ Land'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1 text-[9.5px]">
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[var(--color-text-secondary)]">
                        Deed #912 (Sub-Reg)
                      </span>
                      <span className="text-cyan-400 font-bold">≠</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[var(--color-text-secondary)]">
                        Khatian #1042 (AC Land)
                      </span>
                    </div>
                  </div>

                  {/* Feature 2: Bangla OCR Vision Transformer & Bounding-Box Tagger */}
                  <div className="p-2.5 glass-tile rounded-[6px] border border-[var(--color-border-subtle)] hover:border-emerald-500/30 transition-all flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-[var(--color-text-primary)]">
                        <Scan className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{isBangla ? 'বাংলা ওসিআর ভিশন ট্রান্সফরমার (ViT)' : 'Bangla OCR ViT Entity Tagger'}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsViTVerified(!isViTVerified);
                          setToastMessage(isBangla ? '✓ ভিশন ট্রান্সফরমার: ৩৮টি ফিল্ড টোকেন সমন্বিত (৯৯.৪% কনফিডেন্স)' : '✓ Vision Transformer: 38 Field Tokens Normalized (99.4% Conf)');
                          setTimeout(() => setToastMessage(null), 3500);
                        }}
                        className={`text-[9px] px-1.5 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
                          isViTVerified
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                            : 'bg-white/5 hover:bg-emerald-500/10 text-[var(--color-text-secondary)] hover:text-emerald-400 border border-white/10'
                        }`}
                      >
                        <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
                        <span>{isViTVerified ? (isBangla ? 'টোকেন সক্রিয় ✓' : 'TOKENS ON ✓') : (isBangla ? 'টোকেন পরীক্ষা' : 'Tokens')}</span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-[var(--color-text-secondary)]">
                      <span>{isBangla ? 'সমর্থিত ফন্ট ও লিপি:' : 'Supported Models:'}</span>
                      <span className="text-emerald-400 font-mono font-bold">SutonnyMJ · Nikosh · Handwritten</span>
                    </div>
                  </div>

                  {/* Feature 3: Discrepancy Evidence Dossier & Conflict Resolution */}
                  <div className="p-2.5 glass-tile rounded-[6px] border border-[var(--color-border-subtle)] hover:border-rose-500/30 transition-all flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-[var(--color-text-primary)]">
                        <Scale className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{isBangla ? 'আইনি অসঙ্গতি ও ধারা উদ্ধৃতি ডসিয়ার' : 'Legal Contradiction AST Dossier'}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const payload = JSON.stringify({ rule: 'Registration Act §22A', dagMismatch: '1042 vs 1024', sha256: '9f8a3c42e81b' });
                          navigator.clipboard?.writeText(payload);
                          setToastMessage(isBangla ? '✓ অসঙ্গতি অডিট ডসিয়ার ক্লিপবোর্ডে কপি সম্পন্ন' : '✓ Contradiction Audit Dossier Copied to Clipboard');
                          setTimeout(() => setToastMessage(null), 3500);
                        }}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-rose-500/10 text-[var(--color-text-secondary)] hover:text-rose-300 border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                        title={isBangla ? 'আইনি প্রমাণ কপি' : 'Copy Evidence JSON'}
                      >
                        <Copy className="w-2.5 h-2.5" />
                        <span>{isBangla ? 'কপি' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-[var(--color-text-secondary)]">
                      <span className="text-rose-400 font-semibold truncate">Reg Act §22A · Dag Contradiction</span>
                      <span className="text-white shrink-0 ml-1">EVIDENCE LOGGED</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveToolId('cologram');
                  setIsDocCompareStudioOpen(true);
                }}
                className="w-full py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 via-cyan-500 to-teal-500 hover:from-cyan-500 hover:to-teal-400 rounded-[5px] font-mono transition-all cursor-pointer shadow-[0_4px_18px_rgba(6,182,212,0.35)] hover:shadow-[0_6px_24px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2 group/btn"
              >
                <span>{t.suite.tool3.cta}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Tool 4: Globee / Adversarial Simulator */}
            <motion.div
              layoutId="adversarial-simulator-studio-modal"
              whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
              onClick={() => {
                setActiveToolId('globee');
                setIsAdversarialStudioOpen(true);
              }}
              className="p-7 rounded-[8px] space-y-5 border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] transition-all flex flex-col justify-between glass-card group hover:shadow-[0_16px_48px_rgba(34,197,94,0.18)] cursor-pointer"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-500 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    {t.suite.tool4.type}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">{t.suite.tool4.sub}</span>
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-surface-raised)] transition-colors">{t.suite.tool4.name}</h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {t.suite.tool4.desc}
                </p>

                {/* Micro-Animated Stress-Test Oscilloscope Widget */}
                <AdversarialSimulatorWidget
                  onOpenStudio={() => {
                    setActiveToolId('globee');
                    setIsAdversarialStudioOpen(true);
                  }}
                  onInjectAttack={(vectorId) => {
                    setToastMessage(isBangla ? `আক্রমণ ভেক্টর [${vectorId}] প্রতিহত! ৭২ ঘণ্টা সফট-লক সক্রিয়` : `Attack Vector [${vectorId}] Quarantined! 72h Soft-Lock Active`);
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                />

                {/* Practical Interactive Stress-Test & Attack Intelligence Deck */}
                <div className="space-y-2 text-[11px] font-mono">
                  {/* Feature 1: Synthetic Attack Vector Testbench */}
                  <div className="p-2.5 glass-tile rounded-[6px] border border-[var(--color-border-subtle)] hover:border-emerald-500/30 transition-all flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-[var(--color-text-primary)]">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{isBangla ? 'সিন্থেটিক আক্রমণ ইনজেকশন টেস্টবেঞ্চ' : 'Synthetic Attack Vector Testbench'}</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/25">
                        4 {isBangla ? 'ভেক্টর' : 'Vectors'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1 text-[9px]">
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-rose-300">
                        Double-Sale
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-amber-300">
                        Forged Seal
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-300">
                        Boundary Warp
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-purple-300">
                        Ghost Warish
                      </span>
                    </div>
                  </div>

                  {/* Feature 2: Monte Carlo Resilience & Precision Metrics */}
                  <div className="p-2.5 glass-tile rounded-[6px] border border-[var(--color-border-subtle)] hover:border-cyan-500/30 transition-all flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-[var(--color-text-primary)]">
                        <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{isBangla ? 'শনাক্তকরণ হার ও প্রেসিশন-রিকল বেঞ্চমার্ক' : 'Detection & Precision Benchmark'}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMonteCarloRunning(true);
                          setToastMessage(isBangla ? '✓ ১০,০০০ সিন্থেটিক আক্রমণ সিমুলেশন চলছে... (শনাক্তকরণ ৯৯.৮৫%)' : '✓ 10,000 Monte Carlo Vectors Stress-Tested (99.85% Catch Rate)');
                          setTimeout(() => {
                            setIsMonteCarloRunning(false);
                            setToastMessage(null);
                          }, 3500);
                        }}
                        className={`text-[9px] px-1.5 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
                          isMonteCarloRunning
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                            : 'bg-white/5 hover:bg-cyan-500/10 text-[var(--color-text-secondary)] hover:text-cyan-400 border border-white/10'
                        }`}
                      >
                        <RotateCcw className={`w-2.5 h-2.5 ${isMonteCarloRunning ? 'animate-spin text-cyan-300' : ''}`} />
                        <span>{isMonteCarloRunning ? (isBangla ? 'বেঞ্চমার্কিং...' : 'Testing...') : (isBangla ? '১০k রান' : 'Run 10k')}</span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-[var(--color-text-secondary)] font-mono">
                      <span>Catch: <strong className="text-emerald-400">99.8%</strong></span>
                      <span>Latency: <strong className="text-cyan-400">12ms</strong></span>
                      <span>FP Rate: <strong className="text-white">&lt;0.02%</strong></span>
                    </div>
                  </div>

                  {/* Feature 3: Automated Registry WAF & Consensus Rules */}
                  <div className="p-2.5 glass-tile rounded-[6px] border border-[var(--color-border-subtle)] hover:border-emerald-500/30 transition-all flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-[var(--color-text-primary)]">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{isBangla ? 'ভূমি রেজিস্ট্রি নিরবচ্ছিন্ন প্রতিরক্ষা ও WAF' : 'Registry Hardening & WAF Rules'}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsWafVerified(!isWafVerified);
                          setToastMessage(isBangla ? '✓ জমিচেইন রুল §P3-04 সক্রিয়: সকল সাব-রেজিস্ট্রি নোডে এনফোর্সড' : '✓ JomiChain Rule §P3-04 Enforced Across All Sub-Registry Nodes');
                          setTimeout(() => setToastMessage(null), 3500);
                        }}
                        className={`text-[9px] px-1.5 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
                          isWafVerified
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                            : 'bg-white/5 hover:bg-emerald-500/10 text-[var(--color-text-secondary)] hover:text-emerald-400 border border-white/10'
                        }`}
                      >
                        <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
                        <span>{isWafVerified ? (isBangla ? 'নিয়ম কার্যকর ✓' : 'ACTIVE ✓') : (isBangla ? 'নিয়ম পরীক্ষা' : 'Verify')}</span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-[var(--color-text-secondary)] font-mono bg-black/20 px-2 py-1 rounded">
                      <span className="truncate">Policy: 72H_SOFT_LOCK_ON_COLLISION</span>
                      <span className="text-emerald-400 shrink-0 ml-1">7/7 Nodes</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveToolId('globee');
                  setIsAdversarialStudioOpen(true);
                }}
                className="w-full py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-[5px] font-mono transition-all cursor-pointer shadow-[0_4px_18px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_24px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 group/btn"
              >
                <span>{t.suite.tool4.cta}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 
        ====================================================================
        JOMICHAIN ENGINE SECTION (The Plot Passport & Cryptographic Land Ledger)
        P3 Fraud Detection, Hash Chains, Double-Sale Concurrency Lock
        ====================================================================
      */}
      <JomiChainSection />

      {/* 
        ====================================================================
        RISK ANALYTICS DASHBOARD SECTION (Recharts Land Ownership Fraud Scores & Trends)
        High-Risk Zones in Dhaka, Anomaly Vectors, and Disputed Cadastral Dags
        ====================================================================
      */}
      <RiskAnalyticsDashboard id="risk-analytics" />

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
                {t.cases.tag}
              </div>
              <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
                {t.cases.heading}
              </h2>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 glass-pill rounded-[6px]">
              {[
                { id: 'all', label: t.cases.tabAll },
                { id: 'clean', label: t.cases.tabClean },
                { id: 'double', label: t.cases.tabDouble },
                { id: 'complex', label: t.cases.tabComplex },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterCategory(tab.id)}
                  className={`px-3 py-1.5 text-[11.52px] font-mono transition-colors rounded-[3px] whitespace-nowrap shrink-0 cursor-pointer ${filterCategory === tab.id
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
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
                className="rounded-[8px] overflow-hidden group border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] transition-all flex flex-col justify-between glass-card hover:shadow-[0_16px_40px_rgba(34,197,94,0.15)]"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-black/60">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 glass-pill px-2.5 py-1 text-[9.6px] font-mono text-white rounded-[3px] bg-black/70 backdrop-blur-sm border border-white/10">
                      {isBangla && project.locationBn ? project.locationBn : project.location}
                    </div>
                    {/* Live Case Forensic Status Tag */}
                    <div className="absolute top-3 right-3 glass-pill px-2 py-1 text-[9px] font-mono rounded-[3px] flex items-center gap-1.5 bg-black/75 backdrop-blur-sm border border-white/10">
                      <span className={`w-1.5 h-1.5 rounded-full ${project.category.includes('Double') ? 'bg-red-400 animate-ping' : 'bg-[var(--color-surface-raised)] animate-pulse'}`} />
                      <span className={project.category.includes('Double') ? 'text-red-300 font-semibold' : 'text-emerald-300 font-semibold'}>
                        {project.category.includes('Double') ? (isBangla ? 'দ্বৈত-সংঘর্ষ চিহ্নিত' : 'COLLISION CAUGHT') : (isBangla ? 'যাচাইকৃত প্রমাণ' : 'VERIFIED PROOF')}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[10.56px] text-[var(--color-text-secondary)] font-mono">
                      <span>{isBangla && project.categoryBn ? project.categoryBn : project.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{project.year}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-surface-raised)] transition-colors">
                      {isBangla && project.titleBn ? project.titleBn : project.title}
                    </h3>

                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
                      {isBangla && project.summaryBn ? project.summaryBn : project.summary}
                    </p>

                    <div className="pt-2 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-[11.52px] font-mono">
                      <span className="text-[var(--color-text-secondary)]">
                        {isBangla && project.metricLabelBn ? project.metricLabelBn : project.metricLabel}
                      </span>
                      <span className="text-[var(--color-text-primary)] font-bold mass-num">{project.metric}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full py-2.5 text-xs font-mono text-[var(--color-text-primary)] glass-tile border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] hover:text-[var(--color-surface-raised)] rounded-[3px] transition-colors flex items-center justify-center gap-2 cursor-pointer group-hover:bg-[var(--color-surface-raised)]/10"
                  >
                    <span>{t.cases.inspectDossier}</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
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
              {t.methodology.tag}
            </div>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
              {t.methodology.heading}
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {t.methodology.subheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] rounded-[2px] space-y-4 shadow-sm">
              <div className="text-sm font-mono text-[var(--color-surface-raised)] font-semibold">
                {isBangla ? '০১. ডিজিটাইজেশন ও ওসিআর' : '01. Ingestion & Structured OCR'}
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                {t.methodology.step1Title}
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {t.methodology.step1Desc}
              </p>
            </div>

            <div className="p-6 bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] rounded-[2px] space-y-4 shadow-sm">
              <div className="text-sm font-mono text-[var(--color-surface-raised)] font-semibold">
                {isBangla ? '০২. গ্রাফ বিশ্লেষণ ও ক্রস-ভেরিফিকেশন' : '02. Graph Analysis & Cross-Verification'}
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                {t.methodology.step2Title}
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {t.methodology.step2Desc}
              </p>
            </div>

            <div className="p-6 bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] rounded-[2px] space-y-4 shadow-sm">
              <div className="text-sm font-mono text-[var(--color-surface-raised)] font-semibold">
                {isBangla ? '০৩. ব্যাখ্যাযোগ্য ঝুঁকি ও প্রমাণ' : '03. Explainable Risk & Evidence'}
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                {t.methodology.step3Title}
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {t.methodology.step3Desc}
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
                {isBangla ? 'প্রাতিষ্ঠানিক অনুসন্ধান' : 'Institutional Investigation'}
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                {t.inquiry.heading}
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {t.inquiry.subheading}
              </p>

              <div className="space-y-3 font-mono text-xs text-[var(--color-text-secondary)]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--color-surface-raised)] rounded-full" />
                  <span>{isBangla ? 'সিনিয়র ল্যান্ড ফ্রড ইন্টেলিজেন্স টিম কর্তৃক সরাসরি বিশ্লেষণ' : 'Direct analysis by senior land fraud intelligence team'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--color-surface-raised)] rounded-full" />
                  <span>{isBangla ? 'ক্রস-ডকুমেন্ট অডিটসহ ক্রিপ্টোগ্রাফিক SHA-256 প্রমাণ প্যাকেজ' : 'Cryptographic SHA-256 evidence package with cross-document audit'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--color-surface-raised)] rounded-full" />
                  <span>{isBangla ? 'কঠোর প্রাতিষ্ঠানিক গোপনীয়তা ও ডাটা আইসোলেশন প্রোটোকল' : 'Strict confidentiality & institutional data isolation protocols'}</span>
                </div>
              </div>
            </div>

            {/* The Form */}
            <div className="bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] p-8 rounded-[2px] shadow-2xl transition-colors">
              {formState === 'success' ? (
                <div className="py-8 text-center space-y-4">
                  <CheckCircle className="w-12 h-12 text-[var(--color-surface-raised)] mx-auto" />
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                    {isBangla ? 'অনুসন্ধান অনুরোধ প্রেরণ সফল' : 'Investigation Request Dispatched'}
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto leading-relaxed">
                    {isBangla 
                      ? <>ধন্যবাদ। প্রবাহ ইন্টেলিজেন্স টিম <span className="text-[var(--color-text-primary)] font-semibold">{inquiryScope}</span> সম্পর্কিত আপনার অনুসন্ধান অনুরোধ গ্রহণ করেছে। {inquiryEmail} এর মাধ্যমে শীঘ্রই যোগাযোগ করা হবে।</>
                      : <>Thank you. The Probaho intelligence team has received your parcel inquiry for <span className="text-[var(--color-text-primary)] font-semibold">{inquiryScope}</span>. An analyst will correspond directly via {inquiryEmail}.</>}
                  </p>
                  <button
                    onClick={() => {
                      setFormState('idle');
                      setInquiryEmail('');
                      setInquiryNotes('');
                    }}
                    className="px-4 py-2 text-xs font-mono text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] rounded-[2px] cursor-pointer"
                  >
                    {isBangla ? 'আরেকটি অনুসন্ধান জমা দিন' : 'Submit Another Inquiry'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-5">
                  <div>
                    <label className="block text-[11.52px] font-mono text-[var(--color-text-secondary)] mb-1.5">
                      {t.inquiry.emailLabel} *
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
                      {t.inquiry.typologyLabel}
                    </label>
                    <select
                      value={inquiryScope}
                      onChange={(e) => setInquiryScope(e.target.value)}
                      className="w-full px-[14px] py-[10px] text-[12.64px] bg-[var(--color-surface-base)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] focus:border-[var(--color-surface-raised)] focus:outline-none rounded-[2px] transition-colors font-mono"
                    >
                      <option value="Commercial / High-Value Parcel Audit">{isBangla ? 'বাণিজ্যিক / উচ্চ মূল্যের প্লট অডিট' : 'Commercial / High-Value Parcel Audit'}</option>
                      <option value="Institutional Registry Bulk Verification">{isBangla ? 'রেজিস্ট্রি অফিস বাল্ক যাচাইকরণ' : 'Institutional Registry Bulk Verification'}</option>
                      <option value="Double-Sale Legal Dispute Dossier">{isBangla ? 'দ্বৈত-বিক্রয় আইনি বিরোধ ডসিয়ার' : 'Double-Sale Legal Dispute Dossier'}</option>
                      <option value="Inheritance & Mutation Conflict Investigation">{isBangla ? 'ওয়ারিশান ও নামজারি বিরোধ অনুসন্ধান' : 'Inheritance & Mutation Conflict Investigation'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11.52px] font-mono text-[var(--color-text-secondary)] mb-1.5">
                      {t.inquiry.detailsLabel}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={isBangla ? 'জেলা, মৌজা, দাগ ও খতিয়ান নম্বর এবং জমির আনুমানিক পরিমাণ লিখুন...' : 'Specify District, Mouza name, Dag/Plot numbers, Khatian identifiers, and estimated parcel area...'}
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
                        <span>{t.inquiry.transmitting}</span>
                      </>
                    ) : (
                      <span>{t.inquiry.transmitBtn}</span>
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
        MONUMENTAL ARCHITECTURAL FOOTER (White & Green Editorial Theme):
        ====================================================================
      */}
      <ArchitecturalFooter
        onOpenInquiry={() => setIsInquiryModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        setToastMessage={setToastMessage}
      />

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
                  <span className="text-[var(--color-surface-raised)] font-bold">{isBangla ? 'সিস্টেম নোটিশ' : 'SYSTEM NOTICE'}</span>
                  <span>·</span>
                  <span>{isBangla ? 'প্রবাহ · আক্রমণ সিমুলেটর' : 'Probaho · Adversarial Simulator'}</span>
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
                  src={mapTokyo}
                  alt="Adversarial Fraud Simulation Grid"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-4">
                  <div className="text-sm font-semibold text-white">
                    {isBangla ? 'সিন্থেটিক আক্রমণ ও প্রতারণা স্ট্রেস-টেস্টিং ইঞ্জিন' : 'Synthetic Attack & Fraud Stress-Testing Engine'}
                  </div>
                </div>
              </div>

              {/* Notice Body Text */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                  {isBangla ? 'অ্যাডভারসেরিয়াল সিমুলেটর এখন সক্রিয়' : 'Adversarial Simulator is Live'}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {isBangla ? 'দ্বৈত-বিক্রয় ইনজেকশন · পরিবর্তিত নামজারি তারিখ · হিস্যা ঘাটতি আক্রমণ — বাস্তব প্রতারণার বিরুদ্ধে শনাক্তকরণ ক্ষমতা যাচাই করুন।' : 'Double-sale injection · altered mutation dates · share deficit attacks — benchmark detection rates and prove robustness against real-world fraud schemes.'}
                </p>
                <p className="text-xs text-[var(--color-text-primary)] leading-relaxed">
                  {isBangla ? 'সিন্থেটিক ও ঐতিহাসিক ভূমি রেকর্ড অসঙ্গতি ডাটা দিয়ে আপনার নিয়মাবলী পরীক্ষা করুন। ভেরিফাইড প্রাতিষ্ঠানিক ব্যবহারকারীদের জন্য উন্মুক্ত।' : 'Test and validate your rules with synthetic and historical land record anomaly datasets. Public preview enabled for verified organizations.'}
                </p>
                <div className="text-[10px] font-mono text-[var(--color-text-tertiary)] pt-1">
                  {isBangla ? 'প্রকাশকাল: ১৪ অক্টোবর, ২০২৬ · প্রবাহ কোর' : 'Posted: October 14, 2026 · Probaho Core'}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                <label className="flex items-center gap-2 text-[11px] font-mono text-[var(--color-text-secondary)] cursor-pointer">
                  <input type="checkbox" className="accent-[var(--color-surface-raised)]" />
                  <span>{isBangla ? 'আজ আর দেখাবেন না' : "Don't show again today"}</span>
                </label>

                <button
                  onClick={() => {
                    setIsNoticeOpen(false);
                    setIsSiteAnalysisStudioOpen(true);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[var(--color-surface-raised)] hover:brightness-110 rounded-[2px] flex items-center gap-1.5 font-mono cursor-pointer shadow-sm"
                >
                  <span>{isBangla ? 'সিমুলেটর চালু করুন →' : 'Launch Simulator →'}</span>
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
              layoutId="temporal-ownership-graph-modal"
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className={`glass-panel rounded-[8px] w-full flex flex-col shadow-2xl overflow-hidden ${
                activeStudioMap.id === 'dhaka-metro' ? 'max-w-[96vw] xl:max-w-[1540px] h-[92vh]' : 'max-w-5xl h-[85vh]'
              }`}
              role="dialog"
              aria-modal="true"
            >
              {/* Outer Header (Only for static image cities; Dhaka Metro provides its own unified top bar) */}
              {activeStudioMap.id !== 'dhaka-metro' && (
                <div className="p-3.5 border-b border-[var(--color-border-subtle)] flex items-center justify-between bg-black/30 backdrop-blur-sm shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[var(--color-surface-raised)]">Probaho STUDIO</span>
                    <span className="text-[var(--color-text-tertiary)]">|</span>
                    <span className="text-xs text-[var(--color-text-primary)] font-semibold">
                      {isBangla ? `${activeStudioMap.cityName} ক্যাডাস্ট্রাল ও মালিকানা গ্রাফ স্টুডিও` : `${activeStudioMap.cityName} Cadastral & Ownership Graph Studio`}
                    </span>
                    <span className="text-[10px] text-[var(--color-text-secondary)] font-mono hidden sm:inline">({activeStudioMap.coordinates})</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 glass-pill p-1 rounded-[4px]">
                      {URBAN_MAP_DATASETS.map((m, idx) => (
                        <button
                          key={m.id}
                          onClick={() => setStudioCityIndex(idx)}
                          className={`px-2.5 py-1 text-[10px] font-mono rounded-[3px] transition-colors cursor-pointer flex items-center gap-1.5 ${idx === studioCityIndex
                              ? 'bg-[var(--color-surface-raised)] text-white font-bold shadow-sm'
                              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10'
                            }`}
                        >
                          <span>{m.cityName}</span>
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
              )}

              {/* Workspace: Map Viewport + Layer Control Panel */}
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
                {activeStudioMap.id === 'dhaka-metro' ? (
                  <div className="flex-1 relative w-full h-full overflow-hidden">
                    <TemporalOwnershipGraphStudio
                      onClose={() => setIsSiteAnalysisStudioOpen(false)}
                      defaultViewMode="split"
                      cities={URBAN_MAP_DATASETS}
                      currentCityIndex={studioCityIndex}
                      onCityChange={setStudioCityIndex}
                    />
                  </div>
                ) : (
                  <>
                    {/* Map Canvas for other regions */}
                    <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center">
                      <img
                        src={activeStudioMap.image}
                        alt={activeStudioMap.cityName}
                        className={`w-full h-full object-cover ${isDay ? 'invert-[0.93] hue-rotate-180 contrast-[1.12] brightness-[0.98]' : 'contrast-[1.12] brightness-[1.08]'
                          }`}
                        referrerPolicy="no-referrer"
                      />

                      {/* Simulated GIS layer vectors on top */}
                      {activeGisLayers.buildings && (
                        <div className="absolute inset-0 pointer-events-none border border-[var(--color-surface-raised)]/30" />
                      )}

                      {/* HUD Overlay */}
                      <div className="absolute top-4 left-4 glass-pill p-3 rounded-[4px] text-xs font-mono space-y-1">
                        <div className="text-[var(--color-surface-raised)] font-semibold">
                          {isBangla ? 'সক্রিয় রেজিস্ট্রি:' : 'Active Registry:'} {activeStudioMap.layers}
                        </div>
                        <div className="text-[10px] text-[var(--color-text-secondary)]">
                          {isBangla ? 'বিভাগ' : 'Division'}: {activeStudioMap.cityName} · CRS: EPSG:3857 · {isBangla ? 'ক্যাডাস্ট্রে' : 'Cadastre'}: {activeStudioMap.parcelCount}
                        </div>
                      </div>
                    </div>

                    {/* Layer Controls Sidebar */}
                    <div className="w-full lg:w-72 glass-tile border-t lg:border-t-0 lg:border-l border-[var(--color-border-subtle)] p-5 space-y-6 overflow-y-auto font-mono text-xs">
                      <div>
                        <div className="text-[10.56px] text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                          {t.studio.layersTitle}
                        </div>
                        <div className="space-y-2">
                          {[
                            { key: 'buildings' as const, label: isBangla ? 'মৌজা ক্যাডাস্ট্রাল প্লট (দাগ নকশা)' : 'Mouza Cadastral Parcels (Dag plots)' },
                            { key: 'parcels' as const, label: isBangla ? 'মালিকানা হস্তান্তর গ্রাফ এজ' : 'Ownership Transfer Graph Edges' },
                            { key: 'roads' as const, label: isBangla ? 'চিহ্নিত দ্বৈত-বিক্রয় ওভারলে' : 'Flagged Double-Sale Overlays' },
                            { key: 'terrain' as const, label: isBangla ? 'নামজারি অসঙ্গতি ভেক্টর' : 'Mutation Discrepancy Vectors' },
                            { key: 'solar' as const, label: isBangla ? 'দলিল বনাম পর্চা বিরোধ মার্কার' : 'Deed vs Porcha Conflict Markers' },
                          ].map((layer) => (
                            <button
                              key={layer.key}
                              onClick={() => toggleGisLayer(layer.key)}
                              className={`w-full p-2.5 rounded-[3px] border text-left flex items-center justify-between transition-colors cursor-pointer ${activeGisLayers[layer.key]
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
                        <div className="text-[var(--color-text-primary)] font-semibold">
                          {isBangla ? 'সমর্থিত এক্সপোর্ট ফরম্যাট:' : 'Export Format Supported:'}
                        </div>
                        <div>{isBangla ? '• জিওজেএসন, শেপফাইল, ডিএক্সএফ, এসভিজি' : '• GeoJSON, Shapefile, DXF, SVG Vector'}</div>
                        <div>{isBangla ? '• ক্রিপ্টোগ্রাফিক SHA-256 প্রমাণ রিপোর্ট' : '• Cryptographic SHA-256 Evidence Report'}</div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setToastMessage(isBangla ? `${activeMap.cityName} এর ক্যাডাস্ট্রাল প্রমাণ প্যাকেজ ডাউনলোড সম্পন্ন।` : `Exported cadastral evidence package for ${activeMap.cityName}.`);
                            setTimeout(() => setToastMessage(null), 4000);
                          }}
                          className="w-full py-2.5 text-xs font-semibold text-white bg-[var(--color-surface-raised)] hover:brightness-110 rounded-[3px] transition-colors cursor-pointer shadow-[0_4px_16px_rgba(34,197,94,0.35)]"
                        >
                          {t.studio.exportBtn}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        ====================================================================
        INTERACTIVE FRAUDENGINE RISK ANALYTICS STUDIO MODAL
        ====================================================================
      */}
      <AnimatePresence>
        {isFraudStudioOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 25, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel rounded-[10px] w-full max-w-[96vw] xl:max-w-[1580px] h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-rose-500/25"
            >
              {/* Top Studio Control Header */}
              <div className="p-3.5 border-b border-[var(--color-border-subtle)] flex items-center justify-between bg-black/40 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-mono font-bold text-rose-400">PROBAHO FRAUDENGINE STUDIO</span>
                  <span className="text-[var(--color-text-tertiary)]">|</span>
                  <span className="text-xs text-[var(--color-text-primary)] font-semibold">
                    {isBangla ? 'রিয়েল-টাইম ভূমি জালিয়াতি ও ঝুঁকি বিশ্লেষণ পাইপলাইন' : 'Real-Time Land Fraud Risk Analytics & National Radar'}
                  </span>
                </div>
                <button
                  onClick={() => setIsFraudStudioOpen(false)}
                  className="px-3 py-1.5 text-xs font-mono rounded-[4px] bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <X className="w-4 h-4" />
                  <span>{isBangla ? 'স্টুডিও বন্ধ করুন' : 'Close Studio'}</span>
                </button>
              </div>

              {/* Full Risk Analytics Dashboard Container */}
              <div className="flex-1 overflow-y-auto">
                <RiskAnalyticsDashboard
                  onClose={() => setIsFraudStudioOpen(false)}
                  defaultZoneId="dhanmondi"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        ====================================================================
        DOCCOMPARE DUAL-DOCUMENT CONTRADICTION STUDIO MODAL
        ====================================================================
      */}
      <DocCompareStudioModal
        isOpen={isDocCompareStudioOpen}
        onClose={() => setIsDocCompareStudioOpen(false)}
      />

      {/* 
        ====================================================================
        ADVERSARIAL SIMULATOR CYBER FRAUD DEFENSE TESTBENCH STUDIO MODAL
        ====================================================================
      */}
      <AdversarialSimulatorStudioModal
        isOpen={isAdversarialStudioOpen}
        onClose={() => setIsAdversarialStudioOpen(false)}
      />

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
                  {isBangla ? `তদন্ত ডসিয়ার · ${selectedProject.id.toUpperCase()}` : `INVESTIGATION DOSSIER · ${selectedProject.id.toUpperCase()}`}
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
                  <div className="text-xs font-mono text-[var(--color-surface-raised)] mb-1">
                    {isBangla && selectedProject.categoryBn ? selectedProject.categoryBn : selectedProject.category} · {isBangla && selectedProject.locationBn ? selectedProject.locationBn : selectedProject.location}
                  </div>
                  <h3 className="text-2xl font-semibold text-[var(--color-text-primary)]">
                    {isBangla && selectedProject.titleBn ? selectedProject.titleBn : selectedProject.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {isBangla && selectedProject.summaryBn ? selectedProject.summaryBn : selectedProject.summary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 glass-tile rounded-[4px] border border-[var(--color-border-subtle)] font-mono text-xs">
                  <div>
                    <div className="text-[var(--color-text-secondary)]">{isBangla ? 'প্রাথমিক সূচক' : 'Primary Metric'}</div>
                    <div className="text-base text-[var(--color-text-primary)] font-semibold mt-0.5">
                      {selectedProject.metric} ({isBangla && selectedProject.metricLabelBn ? selectedProject.metricLabelBn : selectedProject.metricLabel})
                    </div>
                  </div>
                  <div>
                    <div className="text-[var(--color-text-secondary)]">{isBangla ? 'প্লট পরিচিতি' : 'Parcel Identifier'}</div>
                    <div className="text-base text-[var(--color-text-primary)] font-semibold mt-0.5">
                      {isBangla && selectedProject.dimensionsBn ? selectedProject.dimensionsBn : selectedProject.dimensions}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-mono text-[var(--color-text-secondary)] mb-2">
                    {isBangla ? 'সংযুক্ত প্রামাণ্য নথিপত্র' : 'SUPPORTING DOCUMENTARY EVIDENCE'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(isBangla && selectedProject.materialsBn ? selectedProject.materialsBn : selectedProject.materials).map((mat, i) => (
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
                    {isBangla ? 'ডসিয়ার বন্ধ করুন' : 'Close Dossier'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProject(null);
                      setIsInquiryModalOpen(true);
                    }}
                    className="px-4 py-2 text-xs font-mono text-white bg-[var(--color-surface-raised)] hover:brightness-110 rounded-[3px] font-semibold cursor-pointer shadow-md"
                  >
                    {isBangla ? 'একই ধরনের প্লট অডিট অনুরোধ' : 'Request Similar Parcel Audit'}
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
                  {isBangla ? 'সরাসরি জমি যাচাই ও বিরোধ অনুসন্ধান' : 'DIRECT TITLE INVESTIGATION INQUIRY'}
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
                {isBangla ? 'স্বত্ব যাচাই ও খতিয়ান বিরোধ অডিটের জন্য সরাসরি প্রবাহ বিশ্লেষকদের সাথে যুক্ত হোন।' : 'Connect directly with Probaho analysts for title verification and contradiction audits.'}
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsInquiryModalOpen(false);
                  setToastMessage(isBangla ? 'ধন্যবাদ। আপনার ভূমি অনুসন্ধান অনুরোধটি সফলভাবে প্রবাহে পাঠানো হয়েছে।' : 'Thank you. Your parcel investigation inquiry has been dispatched to Probaho.');
                  setTimeout(() => setToastMessage(null), 4000);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[11.52px] font-mono text-[var(--color-text-secondary)] mb-1">
                    {t.inquiry.emailLabel} *
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
                    {isBangla ? 'জমির অবস্থান ও কাঙ্ক্ষিত সময়সীমা' : 'PARCEL LOCATION & TARGET TIMELINE'}
                  </label>
                  <input
                    type="text"
                    placeholder={isBangla ? 'যেমন: মৌজা মিরপুর · দাগ ৩০৭৮ · ঢাকা' : 'e.g. Mouza Mirpur · Dag 3078 · Dhaka'}
                    className="w-full px-3 py-2 text-xs glass-tile text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] focus:border-[var(--color-surface-raised)] focus:outline-none rounded-[3px] font-mono"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsInquiryModalOpen(false)}
                    className="px-3 py-2 text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
                  >
                    {isBangla ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-mono text-white bg-[var(--color-surface-raised)] hover:brightness-110 rounded-[3px] font-semibold cursor-pointer shadow-md"
                  >
                    {isBangla ? 'তদন্ত বিবরণ পাঠান' : 'Send Investigation Brief'}
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
