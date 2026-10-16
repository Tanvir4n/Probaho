/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Probaho — High-Accuracy Native Vector Cadastral GIS Engine for Dhaka Metropolitan Area
 * 
 * Direct authentic cartographic vector implementation based on user master vector artwork:
 * - 2HB5YBP.jpg: Poster Dark Mode (Midnight obsidian land silhouette with glowing white/silver streets)
 * - 2HB5YBW.jpg: Poster Light Mode (Architectural white poster with blue waterways and slate highways)
 * - Hardware-accelerated Canvas 60 FPS pan & zoom + synchronized interactive SVG overlay
 * - Flagship Core: Dhanmondi Mouza J.L. 245 · Dag 1042 (Double-Sale Dispute & 72h Concurrency Soft Lock #RES-794021)
 * - Strategic Thana Nodes: Dhanmondi, Mirpur, Gulshan, Banani, Uttara, Tejgaon, Motijheel, Old Dhaka, HSIA Airport, Purbachal 300ft
 * - Real-time WGS84 GPS coordinate crosshair tracking, zoom controls, quick preset focus, search, layer toggles, and cadastral plot inspector
 */

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Search,
  Lock,
  MapPin,
  Crosshair,
  X,
  Target,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Eye,
  ShieldAlert,
  Scale,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import {
  DHAKA_PROJECT_AREAS,
  DHAKA_CADASTRAL_PLOTS,
  DhakaCadastralPlotFeature,
} from '../data/dhakaGeoData';

// High-resolution authentic vector poster imagery
import dhakaMapNight from '../assets/images/dhaka_vector_map_night.jpg';
import dhakaMapDay from '../assets/images/dhaka_vector_map_day.jpg';

export interface DhakaDistrictLabel {
  id: string;
  name: string;
  nameBn: string;
  x: number;
  y: number;
  lon: number;
  lat: number;
  minK: number;
}

export const DHAKA_CITY_DISTRICTS: DhakaDistrictLabel[] = [
  { id: 'dist-uttara', name: 'UTTARA', nameBn: 'উত্তরা', x: 456, y: 205, lon: 90.3980, lat: 23.8720, minK: 1.0 },
  { id: 'dist-airport', name: 'HSIA AIRPORT', nameBn: 'শাহজালাল বিমানবন্দর', x: 455, y: 310, lon: 90.4000, lat: 23.8430, minK: 1.1 },
  { id: 'dist-mirpur', name: 'MIRPUR', nameBn: 'মিরপুর', x: 295, y: 535, lon: 90.3650, lat: 23.8080, minK: 1.0 },
  { id: 'dist-cantonment', name: 'CANTONMENT', nameBn: 'সেনানিবাস', x: 430, y: 460, lon: 90.3950, lat: 23.8200, minK: 1.2 },
  { id: 'dist-gulshan', name: 'GULSHAN', nameBn: 'গুলশান', x: 490, y: 578, lon: 90.4170, lat: 23.7920, minK: 1.0 },
  { id: 'dist-banani', name: 'BANANI', nameBn: 'বনানী', x: 442, y: 562, lon: 90.4040, lat: 23.7930, minK: 1.3 },
  { id: 'dist-baridhara', name: 'BARIDHARA', nameBn: 'বারিধারা', x: 525, y: 540, lon: 90.4240, lat: 23.8010, minK: 1.3 },
  { id: 'dist-bashundhara', name: 'BASHUNDHARA', nameBn: 'বসুন্ধরা', x: 550, y: 485, lon: 90.4350, lat: 23.8150, minK: 1.2 },
  { id: 'dist-purbachal', name: 'PURBACHAL 300FT', nameBn: 'পূর্বাচল ৩০০ ফুট', x: 635, y: 448, lon: 90.4600, lat: 23.8260, minK: 1.2 },
  { id: 'dist-mdpur', name: 'MOHAMMADPUR', nameBn: 'মোহাম্মদপুর', x: 285, y: 745, lon: 90.3580, lat: 23.7620, minK: 1.2 },
  { id: 'dist-tejgaon', name: 'TEJGAON', nameBn: 'তেজগাঁও', x: 440, y: 690, lon: 90.3980, lat: 23.7640, minK: 1.1 },
  { id: 'dist-dhanmondi', name: 'DHANMONDI', nameBn: 'ধানমন্ডি', x: 335, y: 798, lon: 90.3750, lat: 23.7460, minK: 1.0 },
  { id: 'dist-ramna', name: 'RAMNA', nameBn: 'রমনা', x: 435, y: 835, lon: 90.4010, lat: 23.7380, minK: 1.2 },
  { id: 'dist-motijheel', name: 'MOTIJHEEL', nameBn: 'মতিঝিল', x: 482, y: 875, lon: 90.4180, lat: 23.7250, minK: 1.0 },
  { id: 'dist-olddhaka', name: 'OLD DHAKA', nameBn: 'পুরান ঢাকা', x: 395, y: 965, lon: 90.4050, lat: 23.7120, minK: 1.0 },
];

export interface DhakaD3CadastralMapProps {
  className?: string;
  initialSelectedPlotId?: string;
  onPlotSelect?: (plot: DhakaCadastralPlotFeature | null) => void;
  height?: string | number;
  showInspectorPanel?: boolean;
}

interface StrategicBeacon {
  id: string;
  name: string;
  nameBn: string;
  x: number;
  y: number;
  lon: number;
  lat: number;
  role: 'PRIMARY_CORE' | 'SECONDARY_NODE' | 'HISTORICAL_ANCHOR';
  targetPlot: string;
  targetPlotBn: string;
  riskScore: number;
  status: 'FLAGGED_DOUBLE_SALE' | 'VERIFIED' | 'CONCURRENCY_LOCKED' | 'HISTORICAL_ARCHIVE';
  description: string;
  descriptionBn: string;
  khatianNo: string;
  areaDecimals: number;
  mouza: string;
  mouzaBn: string;
}

const STRATEGIC_BEACONS: StrategicBeacon[] = [
  {
    id: 'beacon-dhanmondi',
    name: 'Dhanmondi Mouza (J.L. 245)',
    nameBn: 'ধানমন্ডি মৌজা (জে.এল. ২৪৫)',
    x: 338,
    y: 798,
    lon: 90.3752,
    lat: 23.7461,
    role: 'PRIMARY_CORE',
    targetPlot: 'Dag 1042 (দাগ ১০৪২)',
    targetPlotBn: 'দাগ ১০৪২',
    riskScore: 84,
    status: 'FLAGGED_DOUBLE_SALE',
    description: 'Flagship investigation plot. Concurrent deed drafting collision detected between Tejgaon & Dhanmondi Sub-Registry offices under Soft Lock Token #RES-794021.',
    descriptionBn: 'প্রধান তদন্ত প্লট। তেজগাঁও ও ধানমন্ডি সাব-রেজিস্ট্রি অফিসের মধ্যে দ্বৈত দলিল নিবন্ধনের সংঘাত চিহ্নিত। সফট লক টোকেন #RES-794021 সক্রিয়।',
    khatianNo: 'RS 912 / BS 1042',
    areaDecimals: 14.50,
    mouza: 'Dhanmondi',
    mouzaBn: 'ধানমন্ডি',
  },
  {
    id: 'beacon-mirpur',
    name: 'Mirpur Senpara Parbata (J.L. 102)',
    nameBn: 'মিরপুর সেনপাড়া পর্বতা (জে.এল. ১০২)',
    x: 295,
    y: 538,
    lon: 90.3654,
    lat: 23.8071,
    role: 'SECONDARY_NODE',
    targetPlot: 'Dag 218 (দাগ ২১৮)',
    targetPlotBn: 'দাগ ২১৮',
    riskScore: 92,
    status: 'CONCURRENCY_LOCKED',
    description: 'Inheritance partition mutation discrepancy. Dual sale power of attorney filed simultaneously in Savar and Mirpur AC Land registries.',
    descriptionBn: 'উত্তরাধিকার বণ্টন নামজারি অসঙ্গতি। সাভার ও মিরপুর এসি ল্যান্ড অফিসে একই সাথে দ্বৈত বিক্রয় আমমোক্তারনামা দাখিল।',
    khatianNo: 'RS 104 / BS 218',
    areaDecimals: 7.50,
    mouza: 'Senpara Parbata',
    mouzaBn: 'সেনপাড়া পর্বতা',
  },
  {
    id: 'beacon-gulshan',
    name: 'Gulshan Model Town (J.L. 182)',
    nameBn: 'গুলশান মডেল টাউন (জে.এল. ১৮২)',
    x: 490,
    y: 578,
    lon: 90.4172,
    lat: 23.7925,
    role: 'SECONDARY_NODE',
    targetPlot: 'Dag 450 (দাগ ৪৫০)',
    targetPlotBn: 'দাগ ৪৫০',
    riskScore: 12,
    status: 'VERIFIED',
    description: 'Commercial registry verification benchmark. 100% cryptographic ledger integrity with seamless mutation and porcha chain.',
    descriptionBn: 'বাণিজ্যিক রেজিস্ট্রি যাচাইকরণ মানদণ্ড। ১০০% ক্রিপ্টোগ্রাফিক লেজার সততা ও অক্ষত নামজারি পর্চা চেইন।',
    khatianNo: 'RS 312 / BS 450',
    areaDecimals: 18.00,
    mouza: 'Gulshan',
    mouzaBn: 'গুলশান',
  },
  {
    id: 'beacon-uttara',
    name: 'Uttara Model Town (J.L. 78)',
    nameBn: 'উত্তরা মডেল টাউন (জে.এল. ৭৮)',
    x: 456,
    y: 202,
    lon: 90.4000,
    lat: 23.8720,
    role: 'SECONDARY_NODE',
    targetPlot: 'Sector 3 / Dag 89',
    targetPlotBn: 'সেক্টর ৩ / দাগ ৮৯',
    riskScore: 35,
    status: 'VERIFIED',
    description: 'Northern highway corridor registry node. Airport perimeter land survey verification.',
    descriptionBn: 'উত্তর মহাসড়ক করিডোর রেজিস্ট্রি নোড। বিমানবন্দর পেরিমিটার ভূমি জরিপ যাচাইকরণ।',
    khatianNo: 'BS 892',
    areaDecimals: 10.00,
    mouza: 'Uttara',
    mouzaBn: 'উত্তরা',
  },
  {
    id: 'beacon-tejgaon',
    name: 'Tejgaon Regulatory Hub',
    nameBn: 'তেজগাঁও নিয়ন্ত্রক সমন্বয় হাব',
    x: 440,
    y: 690,
    lon: 90.3980,
    lat: 23.7620,
    role: 'SECONDARY_NODE',
    targetPlot: 'Central AC Land Node',
    targetPlotBn: 'কেন্দ্রীয় এসি ল্যান্ড নোড',
    riskScore: 15,
    status: 'VERIFIED',
    description: 'Central AC Land & Sub-Registry cross-synchronization server. Dispatches real-time concurrency locks.',
    descriptionBn: 'কেন্দ্রীয় এসি ল্যান্ড ও সাব-রেজিস্ট্রি ক্রস-সিঙ্ক্রোনাইজেশন সার্ভার। রিয়েল-টাইম সফট লক প্রেরক।',
    khatianNo: 'Govt Hub #01',
    areaDecimals: 25.00,
    mouza: 'Tejgaon',
    mouzaBn: 'তেজগাঁও',
  },
  {
    id: 'beacon-motijheel',
    name: 'Motijheel Commercial Deeds Hub',
    nameBn: 'মতিঝিল বাণিজ্যিক দলিল কেন্দ্র',
    x: 482,
    y: 875,
    lon: 90.4180,
    lat: 23.7330,
    role: 'SECONDARY_NODE',
    targetPlot: 'Commercial Lien Registry',
    targetPlotBn: 'বাণিজ্যিক লিয়েন রেজিস্ট্রি',
    riskScore: 20,
    status: 'VERIFIED',
    description: 'Financial district bank mortgage registry and commercial lien verification node.',
    descriptionBn: 'আর্থিক জোন ব্যাংক বন্ধক রেজিস্ট্রি এবং বাণিজ্যিক লিয়েন যাচাইকরণ নোড।',
    khatianNo: 'Bank Archive #12',
    areaDecimals: 32.00,
    mouza: 'Motijheel',
    mouzaBn: 'মতিঝিল',
  },
  {
    id: 'beacon-lalbagh',
    name: 'Old Dhaka / Lalbagh (J.L. 310)',
    nameBn: 'পুরান ঢাকা / লালবাগ (জে.এল. ৩১০)',
    x: 395,
    y: 965,
    lon: 90.3880,
    lat: 23.7180,
    role: 'HISTORICAL_ANCHOR',
    targetPlot: 'CS 1910 Survey Root',
    targetPlotBn: 'সিএস ১৯১০ জরিপ রেকর্ড',
    riskScore: 28,
    status: 'HISTORICAL_ARCHIVE',
    description: 'Cadastral Survey 1910 Historical Root. Anchor reference for Bengal Tenancy Act cadastral survey lineage along Buriganga.',
    descriptionBn: 'ক্যাডাস্ট্রাল সার্ভে ১৯১০ ঐতিহাসিক মূল রেকর্ড। বুড়িগঙ্গার তীরে বঙ্গীয় প্রজাস্বত্ব আইনের মূল খতিয়ান ভিত্তি।',
    khatianNo: 'CS Historical Archive',
    areaDecimals: 45.00,
    mouza: 'Lalbagh',
    mouzaBn: 'লালবাগ',
  },
  {
    id: 'beacon-purbachal',
    name: 'Purbachal 300ft Expressway Axis',
    nameBn: 'পূর্বাচল ৩০০ ফুট মহাসড়ক অক্ষ',
    x: 635,
    y: 448,
    lon: 90.4600,
    lat: 23.8260,
    role: 'SECONDARY_NODE',
    targetPlot: 'Purbachal Sector 1 / Dag 14',
    targetPlotBn: 'পূর্বাচল সেক্টর ১ / দাগ ১৪',
    riskScore: 18,
    status: 'VERIFIED',
    description: 'Eastern capital expansion corridor. RAJUK digital layout boundary integration.',
    descriptionBn: 'পূর্বাঞ্চলীয় রাজধানী সম্প্রসারণ করিডোর। রাজউক ডিজিটাল লেআউট সমন্বিত।',
    khatianNo: 'RAJUK-P-2024',
    areaDecimals: 20.00,
    mouza: 'Purbachal',
    mouzaBn: 'পূর্বাচল',
  },
];

interface CadastralPlotItem {
  id: string;
  dagNo: string;
  mouza: string;
  mouzaBn: string;
  khatianNo: string;
  areaDec: number;
  katha: number;
  owner: string;
  ownerBn: string;
  nid: string;
  status: 'FLAGGED_DOUBLE_SALE' | 'VERIFIED' | 'MUTATION_DISCREPANCY';
  riskScore: number;
  points: [number, number][]; // in base coordinate space
  center: [number, number];
  alertNote: string;
  alertNoteBn: string;
  activeLock?: {
    token: string;
    office: string;
    officeBn: string;
    expiresIn: string;
  };
}

const DHANMONDI_CADASTRAL_PLOTS: CadastralPlotItem[] = [
  {
    id: 'dag-1042-dhanmondi',
    dagNo: '1042',
    mouza: 'Dhanmondi Mouza J.L. 245',
    mouzaBn: 'ধানমন্ডি মৌজা জে.এল. ২৪৫',
    khatianNo: 'RS 912 / BS 1042',
    areaDec: 14.50,
    katha: 8.78,
    owner: 'Md. Rafiqul Islam (Disputed)',
    ownerBn: 'মোঃ রফিকুল ইসলাম (বিরোধপূর্ণ)',
    nid: '19842692039482910',
    status: 'FLAGGED_DOUBLE_SALE',
    riskScore: 84,
    points: [
      [330, 786],
      [352, 784],
      [355, 804],
      [333, 806],
      [330, 786],
    ],
    center: [342, 795],
    alertNote: 'CRITICAL: Concurrent deed draft detected at Dhanmondi Sub-Registry while under active 72h Pre-Sale hold from Tejgaon.',
    alertNoteBn: 'জরুরি: তেজগাঁও সাব-রেজিস্ট্রির ৭২ ঘণ্টার সফট লক চলাকালীন ধানমন্ডিতে সমসাময়িক দলিল নিবন্ধনের চেষ্টা প্রতিহত করা হয়েছে।',
    activeLock: {
      token: 'RES-794021',
      office: 'Tejgaon Sub-Registry (Office A)',
      officeBn: 'তেজগাঁও সাব-রেজিস্ট্রি (অফিস ক)',
      expiresIn: '41h 18m',
    },
  },
  {
    id: 'dag-1041-dhanmondi',
    dagNo: '1041',
    mouza: 'Dhanmondi Mouza J.L. 245',
    mouzaBn: 'ধানমন্ডি মৌজা জে.এল. ২৪৫',
    khatianNo: 'RS 912 / BS 1041',
    areaDec: 12.00,
    katha: 7.27,
    owner: 'Begum Shamsunnahar',
    ownerBn: 'বেগম শামসুন্নাহার',
    nid: '19762691028374619',
    status: 'VERIFIED',
    riskScore: 10,
    points: [
      [308, 788],
      [330, 786],
      [333, 806],
      [311, 808],
      [308, 788],
    ],
    center: [320, 797],
    alertNote: 'Fully verified. Clean title chain from RS 1988 to BS 2021 with zero pending encumbrances.',
    alertNoteBn: 'সম্পূর্ণ যাচাইকৃত। ১৯৮৮ সালের আরএস থেকে ২০২১ বিএস পর্যন্ত নির্ভেজাল মালিকানা স্বত্ব।',
  },
  {
    id: 'dag-1043-dhanmondi',
    dagNo: '1043',
    mouza: 'Dhanmondi Mouza J.L. 245',
    mouzaBn: 'ধানমন্ডি মৌজা জে.এল. ২৪৫',
    khatianNo: 'RS 913 / BS 1043',
    areaDec: 16.20,
    katha: 9.81,
    owner: 'Shahidul Alam Chowdhury',
    ownerBn: 'শহীদুল আলম চৌধুরী',
    nid: '19682691122334455',
    status: 'VERIFIED',
    riskScore: 18,
    points: [
      [352, 784],
      [374, 782],
      [377, 802],
      [355, 804],
      [352, 784],
    ],
    center: [364, 793],
    alertNote: 'Mutation complete. Property tax paid through 1431 BS. No lien registered.',
    alertNoteBn: 'নামজারি সম্পন্ন। ১৪৩১ বঙ্গাব্দ পর্যন্ত খাজনা পরিশোধিত। কোনো ব্যাংক লিয়েন নেই।',
  },
  {
    id: 'dag-1044-dhanmondi',
    dagNo: '1044',
    mouza: 'Dhanmondi Mouza J.L. 245',
    mouzaBn: 'ধানমন্ডি মৌজা জে.এল. ২৪৫',
    khatianNo: 'RS 914 / BS 1044',
    areaDec: 10.50,
    katha: 6.36,
    owner: 'Anisur Rahman',
    ownerBn: 'আনিসুর রহমান',
    nid: '19802692233445566',
    status: 'MUTATION_DISCREPANCY',
    riskScore: 68,
    points: [
      [333, 806],
      [355, 804],
      [358, 824],
      [336, 826],
      [333, 806],
    ],
    center: [345, 815],
    alertNote: 'WARNING: 1.2 decimal boundary variance between RS 1988 map and BS 2021 digital ledger.',
    alertNoteBn: 'সতর্কতা: ১৯৮৮ সালের আরএস নকশা ও ২০২১ সালের বিএস ডিজিটালের মধ্যে ১.২ শতক সীমানা অসঙ্গতি।',
  },
];

export const DhakaD3CadastralMap: React.FC<DhakaD3CadastralMapProps> = ({
  className = '',
  initialSelectedPlotId = 'dag-1042-dhanmondi',
  onPlotSelect,
  height = '100%',
  showInspectorPanel = true,
}) => {
  const { isBangla } = useLanguage();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const svgOverlayRef = useRef<SVGSVGElement | null>(null);
  const coordsRef = useRef<HTMLSpanElement | null>(null);
  const zoomBadgeRef = useRef<HTMLSpanElement | null>(null);

  // Poster style mode matching user images:
  // - 'poster-dark': Exact 2HB5YBP.jpg (Black Land Silhouette with White Streets on White Poster Frame)
  // - 'poster-light': Exact 2HB5YBW.jpg (Architectural Outline, Blue Waterways, Green Parks)
  // - 'cadastral-hud': Futuristic Cyber Cartographic Blueprint
  const [posterStyle, setPosterStyle] = useState<'poster-dark' | 'poster-light' | 'cadastral-hud'>('poster-dark');

  // Dimensions
  const [dimensions, setDimensions] = useState({ width: 900, height: 700 });

  // Preloaded Images
  const imgNightRef = useRef<HTMLImageElement | null>(null);
  const imgDayRef = useRef<HTMLImageElement | null>(null);
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);

  // Search input
  const [searchQuery, setSearchQuery] = useState('');

  // Selections
  const [selectedBeacon, setSelectedBeacon] = useState<StrategicBeacon | null>(() => STRATEGIC_BEACONS[0]);
  const [selectedPlot, setSelectedPlot] = useState<CadastralPlotItem | null>(
    () => DHANMONDI_CADASTRAL_PLOTS.find((p) => p.id === initialSelectedPlotId) || DHANMONDI_CADASTRAL_PLOTS[0]
  );
  const [isInspectorOpen, setIsInspectorOpen] = useState(showInspectorPanel);

  // Hover Tooltip
  const [hoveredInfo, setHoveredInfo] = useState<{
    title: string;
    sub: string;
    risk?: number;
    status?: string;
  } | null>(null);

  // Layer Toggles
  const [layers, setLayers] = useState({
    baseVectorPoster: true,
    cadastralPlots: true,
    beacons: true,
    districtLabels: true,
    posterHeader: true,
    gridOverlay: false,
  });

  // Base Map Coordinate Geometry (Crop bottom 75px watermark from 1390)
  const BASE_WIDTH = 968;
  const BASE_HEIGHT = 1315;

  // Zoom transform tracking
  const transformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Preload Image Assets
  useEffect(() => {
    let loadedCount = 0;
    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount >= 2) {
        setIsImagesLoaded(true);
      }
    };

    const imgN = new Image();
    imgN.src = dhakaMapNight;
    imgN.onload = checkLoaded;
    imgNightRef.current = imgN;

    const imgD = new Image();
    imgD.src = dhakaMapDay;
    imgD.onload = checkLoaded;
    imgDayRef.current = imgD;
  }, []);

  // Resize Observer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width: Math.round(width), height: Math.round(height) });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Compute Base Fit Scale and Centering Offset
  const { baseScale, offsetX, offsetY } = useMemo(() => {
    const pad = Math.max(24, Math.min(dimensions.width, dimensions.height) * 0.03);
    const availW = dimensions.width - pad * 2;
    const availH = dimensions.height - pad * 2;
    const scale = Math.min(availW / BASE_WIDTH, availH / BASE_HEIGHT);
    const ox = (dimensions.width - BASE_WIDTH * scale) / 2;
    const oy = (dimensions.height - BASE_HEIGHT * scale) / 2;
    return { baseScale: scale, offsetX: ox, offsetY: oy };
  }, [dimensions.width, dimensions.height]);

  // Color Palette Definitions
  const palette = useMemo(() => {
    if (posterStyle === 'poster-dark') {
      // 2HB5YBP: White poster background with black land silhouette & glowing white streets
      return {
        canvasBg: '#ffffff',
        frameBorder: 'rgba(15, 23, 42, 0.25)',
        titleColor: '#0f172a',
        subColor: '#475569',
        accentColor: '#16a34a',
        beaconHalo: 'rgba(34, 197, 94, 0.35)',
        beaconStroke: '#22c55e',
      };
    } else if (posterStyle === 'poster-light') {
      // 2HB5YBW: White poster background with architectural outline & sky blue waterways
      return {
        canvasBg: '#ffffff',
        frameBorder: 'rgba(15, 23, 42, 0.22)',
        titleColor: '#0f172a',
        subColor: '#64748b',
        accentColor: '#0284c7',
        beaconHalo: 'rgba(2, 132, 199, 0.35)',
        beaconStroke: '#0284c7',
      };
    } else {
      // Cyber HUD Blueprint
      return {
        canvasBg: '#090d16',
        frameBorder: 'rgba(56, 189, 248, 0.30)',
        titleColor: '#ffffff',
        subColor: '#94a3b8',
        accentColor: '#10b981',
        beaconHalo: 'rgba(16, 185, 129, 0.40)',
        beaconStroke: '#10b981',
      };
    }
  }, [posterStyle]);

  // Draw the entire map onto HTML5 Canvas with 60 FPS hardware acceleration
  const drawVectorMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = dimensions.width;
    const h = dimensions.height;

    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Clear background
    ctx.fillStyle = palette.canvasBg;
    ctx.fillRect(0, 0, w, h);

    // Apply D3 Zoom & Pan transform
    const t = transformRef.current;
    ctx.translate(t.x, t.y);
    ctx.scale(t.k, t.k);

    // Center and scale the base map
    ctx.translate(offsetX, offsetY);
    ctx.scale(baseScale, baseScale);

    // 2. Draw the authentic high-resolution vector artwork
    if (layers.baseVectorPoster) {
      const activeImg = posterStyle === 'poster-light' ? imgDayRef.current : imgNightRef.current;
      if (activeImg && activeImg.complete && activeImg.naturalWidth > 0) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        if (posterStyle === 'cadastral-hud') {
          // Cyber HUD filter overlay
          ctx.filter = 'contrast(1.2) hue-rotate(185deg) brightness(0.95)';
        }

        // Draw cropped image (excluding bottom 75px watermark)
        const sW = activeImg.naturalWidth;
        const sH = Math.min(activeImg.naturalHeight, activeImg.naturalHeight - 75);
        ctx.drawImage(activeImg, 0, 0, sW, sH, 0, 0, BASE_WIDTH, BASE_HEIGHT);

        ctx.filter = 'none';
      }
    }

    // 3. Subtle blueprint grid in HUD mode
    if (layers.gridOverlay || posterStyle === 'cadastral-hud') {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = 0.8;
      const step = 80;
      for (let x = 0; x <= BASE_WIDTH; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, BASE_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y <= BASE_HEIGHT; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(BASE_WIDTH, y);
        ctx.stroke();
      }
    }

    ctx.restore();
  }, [dimensions.width, dimensions.height, palette, offsetX, offsetY, baseScale, posterStyle, layers, isImagesLoaded]);

  // RequestAnimationFrame scheduler for redraws
  const scheduleRedraw = useCallback(() => {
    if (rafIdRef.current) return;
    rafIdRef.current = requestAnimationFrame(() => {
      drawVectorMap();
      rafIdRef.current = null;
    });
  }, [drawVectorMap]);

  useEffect(() => {
    drawVectorMap();
  }, [drawVectorMap, isImagesLoaded]);

  // Set up D3 Zoom & Pan behavior
  useEffect(() => {
    if (!svgOverlayRef.current) return;
    const svg = d3.select(svgOverlayRef.current);

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.7, 30])
      .wheelDelta((event) => -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002))
      .on('zoom', (event) => {
        transformRef.current = event.transform;
        scheduleRedraw();

        if (zoomBadgeRef.current) {
          zoomBadgeRef.current.textContent = `${event.transform.k.toFixed(1)}x`;
        }

        const overlayG = svg.select('.svg-map-transform-group');
        if (!overlayG.empty()) {
          overlayG.attr('transform', `${event.transform.toString()} translate(${offsetX}, ${offsetY}) scale(${baseScale})`);
        }
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    return () => {
      svg.on('.zoom', null);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [scheduleRedraw, offsetX, offsetY, baseScale]);

  // Update SVG transform when dimensions/offset changes
  useEffect(() => {
    if (!svgOverlayRef.current) return;
    const svg = d3.select(svgOverlayRef.current);
    const overlayG = svg.select('.svg-map-transform-group');
    if (!overlayG.empty()) {
      overlayG.attr('transform', `${transformRef.current.toString()} translate(${offsetX}, ${offsetY}) scale(${baseScale})`);
    }
  }, [offsetX, offsetY, baseScale]);

  // Fly/Zoom to base coordinate point
  const zoomToBasePoint = useCallback(
    (targetX: number, targetY: number, targetScale = 6.0) => {
      if (!svgOverlayRef.current || !zoomBehaviorRef.current) return;
      const screenX = offsetX + targetX * baseScale;
      const screenY = offsetY + targetY * baseScale;

      const transform = d3.zoomIdentity
        .translate(dimensions.width / 2 - screenX * targetScale, dimensions.height / 2 - screenY * targetScale)
        .scale(targetScale);

      d3.select(svgOverlayRef.current)
        .transition()
        .duration(700)
        .ease(d3.easeCubicOut)
        .call(zoomBehaviorRef.current.transform, transform);
    },
    [dimensions.width, dimensions.height, offsetX, offsetY, baseScale]
  );

  // Focus Primary Plot (Dhanmondi Dag 1042)
  const focusPrimaryPlot = useCallback(() => {
    const dhanmondi = STRATEGIC_BEACONS[0];
    const plot1042 = DHANMONDI_CADASTRAL_PLOTS[0];
    setSelectedBeacon(dhanmondi);
    setSelectedPlot(plot1042);
    setIsInspectorOpen(true);
    onPlotSelect?.(DHAKA_CADASTRAL_PLOTS[0] || null);
    zoomToBasePoint(plot1042.center[0], plot1042.center[1], 8.5);
  }, [zoomToBasePoint, onPlotSelect]);

  // Zoom Button Handlers
  const handleZoomIn = () => {
    if (!svgOverlayRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgOverlayRef.current)
      .transition()
      .duration(300)
      .ease(d3.easeCubicOut)
      .call(zoomBehaviorRef.current.scaleBy, 1.5);
  };

  const handleZoomOut = () => {
    if (!svgOverlayRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgOverlayRef.current)
      .transition()
      .duration(300)
      .ease(d3.easeCubicOut)
      .call(zoomBehaviorRef.current.scaleBy, 0.67);
  };

  const handleReset = () => {
    if (!svgOverlayRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgOverlayRef.current)
      .transition()
      .duration(500)
      .ease(d3.easeCubicOut)
      .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    if (zoomBadgeRef.current) zoomBadgeRef.current.textContent = '1.0x';
  };

  // Double Click Zoom
  const handleDoubleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgOverlayRef.current || !zoomBehaviorRef.current) return;
    const rect = svgOverlayRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    d3.select(svgOverlayRef.current)
      .transition()
      .duration(380)
      .ease(d3.easeCubicOut)
      .call(zoomBehaviorRef.current.scaleBy, 1.8, [clickX, clickY]);
  };

  // Live Coordinate Tracker (Zero React Overhead)
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!coordsRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const t = transformRef.current;
    const baseX = (mouseX - t.x) / t.k - offsetX;
    const baseY = (mouseY - t.y) / t.k - offsetY;

    const normX = baseX / baseScale;
    const normY = baseY / baseScale;

    // Affine GPS mapping
    const lon = 90.3050 + (normX / BASE_WIDTH) * 0.2100;
    const lat = 23.9050 - (normY / BASE_HEIGHT) * 0.2400;

    if (lon >= 90.1 && lon <= 90.7 && lat >= 23.5 && lat <= 24.1) {
      coordsRef.current.textContent = `${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`;
    }
  };

  // Search input handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.trim().toLowerCase();

    // Check Cadastral Plots
    const matchedPlot = DHANMONDI_CADASTRAL_PLOTS.find(
      (p) =>
        p.dagNo.toLowerCase() === q ||
        p.dagNo.includes(q) ||
        p.mouza.toLowerCase().includes(q) ||
        p.mouzaBn.includes(q)
    );
    if (matchedPlot) {
      setSelectedPlot(matchedPlot);
      setIsInspectorOpen(true);
      zoomToBasePoint(matchedPlot.center[0], matchedPlot.center[1], 8.5);
      return;
    }

    // Check Beacons
    const matchedBeacon = STRATEGIC_BEACONS.find(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.nameBn.includes(q) ||
        b.targetPlot.toLowerCase().includes(q) ||
        b.targetPlotBn.includes(q)
    );
    if (matchedBeacon) {
      setSelectedBeacon(matchedBeacon);
      setIsInspectorOpen(true);
      zoomToBasePoint(matchedBeacon.x, matchedBeacon.y, 6.0);
      return;
    }

    if (q.includes('1042') || q.includes('dhan')) {
      focusPrimaryPlot();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none flex flex-col font-sans transition-colors duration-200 ${className}`}
      style={{ height, backgroundColor: palette.canvasBg }}
    >
      {/* 
        ====================================================================
        TOP CONTROL DOCK: Search, Coordinates HUD, Day/Night & Presets
        ====================================================================
      */}
      <div className="relative z-20 px-3 py-2 sm:px-4 sm:py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-strong)]/92 backdrop-blur-md transition-colors shadow-sm">
        {/* Left: Quick Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-1.5 max-w-xs sm:max-w-sm w-full">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBangla ? 'দাগ নং বা মৌজা খুঁজুন (যেমন: ১০৪২)...' : 'Search Dag # or Mouza (e.g. 1042)...'}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-[4px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-surface-raised)] font-mono transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-2.5 py-1.5 rounded-[4px] bg-[var(--color-surface-raised)] text-white text-xs font-mono font-medium hover:opacity-90 transition-opacity cursor-pointer flex-shrink-0"
          >
            {isBangla ? 'অনুসন্ধান' : 'Search'}
          </button>
        </form>

        {/* Center: Live Coordinate HUD (Direct DOM, 0% React lag) */}
        <div className="hidden md:flex items-center gap-3 font-mono text-[11px] text-[var(--color-text-secondary)] bg-[var(--color-surface-base)]/80 px-3 py-1 rounded-[4px] border border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-1.5">
            <Crosshair className="w-3.5 h-3.5 text-[var(--color-surface-raised)] animate-spin-slow" />
            <span ref={coordsRef} className="font-semibold text-[var(--color-text-primary)]">
              23.7461° N, 90.3752° E
            </span>
          </div>
          <span className="text-[var(--color-border-subtle)]">|</span>
          <div className="flex items-center gap-1">
            <span>CRS:</span>
            <span className="text-[var(--color-text-primary)] font-semibold">WGS84</span>
          </div>
          <span className="text-[var(--color-border-subtle)]">|</span>
          <div className="flex items-center gap-1">
            <span>Zoom:</span>
            <span ref={zoomBadgeRef} className="text-[var(--color-surface-raised)] font-bold">
              1.0x
            </span>
          </div>
        </div>

        {/* Right: Quick Zoom, Disputed Core Button & Poster Style Switcher */}
        <div className="flex items-center gap-1.5">
          {/* Zoom Buttons */}
          <div className="flex items-center bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)] rounded-[4px] p-0.5">
            <button
              onClick={handleZoomIn}
              className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-strong)] rounded-[3px] transition-colors cursor-pointer"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-strong)] rounded-[3px] transition-colors cursor-pointer"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-strong)] rounded-[3px] transition-colors cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Preset: Disputed Dag 1042 Focus */}
          <button
            onClick={focusPrimaryPlot}
            className="px-2.5 py-1 rounded-[4px] bg-red-500/15 text-red-500 border border-red-500/30 font-bold hover:bg-red-500/25 transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
            title="Focus on Disputed Dag 1042"
          >
            <Target className="w-3 h-3 text-red-500" />
            <span>{isBangla ? 'ধানমন্ডি দাগ ১০৪২ (৮.৫x)' : 'Dag 1042 (8.5x)'}</span>
          </button>

          {/* Poster Style Switcher: Dark (2HB5YBP) / Light (2HB5YBW) / HUD */}
          <div className="flex items-center border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] rounded-[4px] p-0.5 text-[11px] font-mono">
            <button
              onClick={() => setPosterStyle('poster-dark')}
              className={`px-2 py-0.5 rounded-[3px] transition-colors cursor-pointer ${
                posterStyle === 'poster-dark'
                  ? 'bg-zinc-800 text-white font-bold'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
              title="Poster Dark Mode (Exact 2HB5YBP)"
            >
              Dark
            </button>
            <button
              onClick={() => setPosterStyle('poster-light')}
              className={`px-2 py-0.5 rounded-[3px] transition-colors cursor-pointer ${
                posterStyle === 'poster-light'
                  ? 'bg-sky-500 text-white font-bold'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
              title="Poster Light Mode (Exact 2HB5YBW)"
            >
              Light
            </button>
            <button
              onClick={() => setPosterStyle('cadastral-hud')}
              className={`px-2 py-0.5 rounded-[3px] transition-colors cursor-pointer ${
                posterStyle === 'cadastral-hud'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
              title="Cyber Blueprint HUD Mode"
            >
              HUD
            </button>
          </div>
        </div>
      </div>

      {/* 
        ====================================================================
        MAP VIEWPORT: HTML5 Canvas (60 FPS Vector Base) + SVG Interactive Layer
        ====================================================================
      */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Layer 1: Hardware-Accelerated 2D Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Layer 2: Interactive SVG Overlay */}
        <svg
          ref={svgOverlayRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
          onDoubleClick={handleDoubleClick}
          onMouseMove={handleMouseMove}
        >
          <defs>
            {/* Dispute Hatched Pattern for Dag 1042 */}
            <pattern id="cad-dispute-hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(239, 68, 68, 0.85)" strokeWidth="2.2" />
            </pattern>
          </defs>

          {/* Architectural Poster Framing Border */}
          <rect
            x="14"
            y="14"
            width={Math.max(10, dimensions.width - 28)}
            height={Math.max(10, dimensions.height - 28)}
            fill="none"
            stroke={palette.frameBorder}
            strokeWidth="1.2"
            className="pointer-events-none"
          />
          <rect
            x="18"
            y="18"
            width={Math.max(10, dimensions.width - 36)}
            height={Math.max(10, dimensions.height - 36)}
            fill="none"
            stroke={palette.frameBorder}
            strokeWidth="0.6"
            className="pointer-events-none opacity-60"
          />

          {/* Dynamic D3 Zoom Transform Container */}
          <g className="svg-map-transform-group">
            {/* 1. CADASTRAL PARCEL POLYGONS (Dhanmondi Mouza J.L. 245) */}
            {layers.cadastralPlots && (
              <g className="cadastral-parcels-group">
                {DHANMONDI_CADASTRAL_PLOTS.map((plot) => {
                  const isSelected = selectedPlot?.id === plot.id;
                  const isFlagged = plot.status === 'FLAGGED_DOUBLE_SALE';
                  const isDiscrepancy = plot.status === 'MUTATION_DISCREPANCY';

                  const pathStr = plot.points
                    .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt[0]} ${pt[1]}`)
                    .join(' ') + ' Z';

                  let fill = 'rgba(34, 197, 94, 0.35)';
                  let stroke = '#22c55e';

                  if (isFlagged) {
                    fill = 'url(#cad-dispute-hatch)';
                    stroke = '#ef4444';
                  } else if (isDiscrepancy) {
                    fill = 'rgba(245, 158, 11, 0.40)';
                    stroke = '#f59e0b';
                  }

                  return (
                    <g
                      key={plot.id}
                      className="cursor-pointer transition-all duration-200"
                      onClick={() => {
                        setSelectedPlot(plot);
                        setIsInspectorOpen(true);
                        zoomToBasePoint(plot.center[0], plot.center[1], 8.5);
                      }}
                      onMouseEnter={() => {
                        setHoveredInfo({
                          title: isBangla ? `দাগ নং ${plot.dagNo} (${plot.mouzaBn})` : `Dag #${plot.dagNo} (${plot.mouza})`,
                          sub: isBangla
                            ? `মালিক: ${plot.ownerBn} · ${plot.areaDec} শতক (${plot.katha} কাঠা)`
                            : `Owner: ${plot.owner} · ${plot.areaDec} Dec (${plot.katha} Katha)`,
                          risk: plot.riskScore,
                          status: plot.status,
                        });
                      }}
                      onMouseLeave={() => setHoveredInfo(null)}
                    >
                      <path
                        d={pathStr}
                        fill={fill}
                        stroke={isSelected ? '#ffffff' : stroke}
                        strokeWidth={isSelected ? 2.8 : 1.6}
                        vectorEffect="non-scaling-stroke"
                        className="hover:brightness-125 transition-colors"
                      />

                      {/* Dag Number Tag */}
                      <text
                        x={plot.center[0]}
                        y={plot.center[1] + 3}
                        textAnchor="middle"
                        fontSize="7"
                        fontWeight="bold"
                        fontFamily="monospace"
                        fill={isFlagged ? '#ef4444' : '#ffffff'}
                        className="pointer-events-none drop-shadow-md select-none"
                      >
                        {plot.dagNo}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* 2. STRATEGIC PROJECT BEACONS & CALLOUT TAGS */}
            {layers.beacons && (
              <g className="beacons-group">
                {STRATEGIC_BEACONS.map((beacon) => {
                  const px = beacon.x;
                  const py = beacon.y;
                  const isPrimary = beacon.role === 'PRIMARY_CORE';

                  return (
                    <g
                      key={beacon.id}
                      className="cursor-pointer group"
                      onClick={() => {
                        setSelectedBeacon(beacon);
                        setIsInspectorOpen(true);
                        if (isPrimary) {
                          focusPrimaryPlot();
                        } else {
                          zoomToBasePoint(beacon.x, beacon.y, 6.0);
                        }
                      }}
                      onMouseEnter={() => {
                        setHoveredInfo({
                          title: isBangla ? beacon.nameBn : beacon.name,
                          sub: isBangla
                            ? `${beacon.targetPlotBn} · খতিয়ান: ${beacon.khatianNo}`
                            : `${beacon.targetPlot} · Khatian: ${beacon.khatianNo}`,
                          risk: beacon.riskScore,
                          status: beacon.status,
                        });
                      }}
                      onMouseLeave={() => setHoveredInfo(null)}
                    >
                      {/* Fixed Radar Targeting Ring */}
                      <circle
                        cx={px}
                        cy={py}
                        r={isPrimary ? 16 : 9}
                        fill="none"
                        stroke={isPrimary ? '#ef4444' : '#38bdf8'}
                        strokeWidth="1.2"
                        opacity="0.5"
                        strokeDasharray="2 2"
                        vectorEffect="non-scaling-stroke"
                        className="pointer-events-none"
                      />

                      {/* Outer halo circle */}
                      <circle
                        cx={px}
                        cy={py}
                        r={isPrimary ? 9 : 5}
                        fill={isPrimary ? 'rgba(239, 68, 68, 0.40)' : 'rgba(56, 189, 248, 0.35)'}
                        stroke={isPrimary ? '#ef4444' : '#38bdf8'}
                        strokeWidth="1.8"
                        vectorEffect="non-scaling-stroke"
                      />

                      {/* Center Point */}
                      <circle
                        cx={px}
                        cy={py}
                        r={isPrimary ? 3.5 : 2}
                        fill={isPrimary ? '#ffffff' : '#ffffff'}
                        stroke={isPrimary ? '#ef4444' : '#0284c7'}
                        strokeWidth="1.2"
                      />

                      {/* PRIMARY CORE CALLOUT BANNER (Dhanmondi Mouza Dag 1042) */}
                      {isPrimary && (
                        <g className="callout-tag pointer-events-none transition-transform group-hover:scale-105">
                          {/* Leader Line */}
                          <path
                            d={`M ${px} ${py} L ${px - 22} ${py - 22} L ${px - 140} ${py - 22}`}
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="1.5"
                            strokeDasharray="3 2"
                            vectorEffect="non-scaling-stroke"
                          />

                          {/* Callout Box */}
                          <rect
                            x={px - 310}
                            y={py - 50}
                            width="290"
                            height="44"
                            rx="5"
                            fill="rgba(15, 23, 42, 0.96)"
                            stroke="#ef4444"
                            strokeWidth="1.5"
                            className="drop-shadow-xl"
                          />

                          {/* Banner Header */}
                          <text
                            x={px - 298}
                            y={py - 33}
                            fontSize="9.5"
                            fontWeight="bold"
                            fontFamily="monospace"
                            fill="#f87171"
                          >
                            ★ {isBangla ? 'প্রধান প্রকল্প তদন্ত: ধানমন্ডি (দাগ ১০৪২)' : 'PROJECT CORE: DHANMONDI (DAG 1042)'}
                          </text>

                          {/* Banner Subtitle */}
                          <text
                            x={px - 298}
                            y={py - 18}
                            fontSize="8.5"
                            fontFamily="monospace"
                            fill="#e2e8f0"
                          >
                            {isBangla ? 'দ্বৈত-বিক্রয় আপস বণ্টন সংঘাত · সফট লক সক্রিয়' : 'Dual-Sale Partition Dispute · 72h Soft Lock Active'}
                          </text>
                        </g>
                      )}

                      {/* Label for Secondary Nodes */}
                      {!isPrimary && (
                        <text
                          x={px}
                          y={py + 14}
                          textAnchor="middle"
                          fontSize="8"
                          fontWeight="bold"
                          fontFamily="monospace"
                          fill={palette.titleColor}
                          stroke={palette.canvasBg}
                          strokeWidth="2.5"
                          paintOrder="stroke fill"
                          className="opacity-95 select-none drop-shadow-sm pointer-events-none"
                        >
                          {isBangla ? beacon.nameBn.split(' ')[0] : beacon.name.split(' ')[0]}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            )}

            {/* 3. AUTHENTIC DHAKA CITY DISTRICT LABELS */}
            {layers.districtLabels && (
              <g className="city-district-labels pointer-events-none select-none">
                {DHAKA_CITY_DISTRICTS.map((dist) => {
                  const isDhanmondi = dist.id === 'dist-dhanmondi';

                  return (
                    <g key={dist.id} transform={`translate(${dist.x}, ${dist.y})`}>
                      <text
                        textAnchor="middle"
                        fontSize={isDhanmondi ? '11.5' : '9'}
                        fontWeight="900"
                        letterSpacing="2"
                        fontFamily="sans-serif"
                        fill={palette.titleColor}
                        opacity={isDhanmondi ? 0.98 : 0.82}
                        stroke={palette.canvasBg}
                        strokeWidth="2.8"
                        paintOrder="stroke fill"
                        className="drop-shadow-sm font-sans uppercase"
                      >
                        {isBangla ? dist.nameBn : dist.name}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}
          </g>

          {/* 
            ====================================================================
            POSTER TITLE & COORDINATES TYPOGRAPHY (Top Right)
            Matches the Authentic Vector Poster Art from 2HB5YBW & 2HB5YBP
            ====================================================================
          */}
          {layers.posterHeader && (
            <g
              className="poster-title-block select-none pointer-events-none"
              transform={`translate(${Math.max(20, dimensions.width - 270)}, 52)`}
            >
              <text
                x="0"
                y="0"
                fontSize="26"
                fontWeight="900"
                letterSpacing="4"
                fill={palette.titleColor}
                fontFamily="sans-serif"
                className="drop-shadow-sm font-sans"
              >
                DHAKA
              </text>
              <text
                x="2"
                y="18"
                fontSize="11"
                letterSpacing="6"
                fontWeight="600"
                fill={palette.subColor}
                fontFamily="sans-serif"
              >
                BANGLADESH
              </text>
              <line
                x1="2"
                y1="25"
                x2="160"
                y2="25"
                stroke={palette.frameBorder}
                strokeWidth="1.2"
              />
              <text
                x="2"
                y="37"
                fontSize="8"
                letterSpacing="1"
                fill={palette.subColor}
                fontFamily="monospace"
              >
                23°42′37″ N · 90°24′26″ E
              </text>
              <text
                x="2"
                y="48"
                fontSize="7"
                letterSpacing="0.5"
                fill={palette.accentColor}
                fontFamily="monospace"
                fontWeight="bold"
              >
                PROBAHO CADASTRAL GIS ENGINE
              </text>
            </g>
          )}

          {/* Compass Rose (Top Left under search) */}
          <g transform="translate(42, 60)" className="pointer-events-none select-none opacity-80">
            <circle cx="0" cy="0" r="14" fill="none" stroke={palette.frameBorder} strokeWidth="1" />
            <line x1="0" y1="-14" x2="0" y2="14" stroke={palette.subColor} strokeWidth="1" />
            <line x1="-14" y1="0" x2="14" y2="0" stroke={palette.subColor} strokeWidth="1" />
            <polygon points="0,-13 -3,-3 0,0" fill={palette.accentColor} />
            <polygon points="0,-13 3,-3 0,0" fill={palette.subColor} />
            <text x="0" y="-16" textAnchor="middle" fontSize="8" fontWeight="bold" fill={palette.titleColor} fontFamily="sans-serif">
              N
            </text>
          </g>
        </svg>

        {/* 
          ====================================================================
          HOVER TOOLTIP OVERLAY
          ====================================================================
        */}
        {hoveredInfo && (
          <div className="absolute top-4 left-4 z-30 pointer-events-none glass-tile p-3 rounded-[6px] max-w-xs shadow-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-strong)]/95 backdrop-blur-md font-mono text-xs animate-in fade-in duration-150">
            <div className="font-bold text-[var(--color-text-primary)] text-sm mb-1">{hoveredInfo.title}</div>
            <div className="text-[11px] text-[var(--color-text-secondary)] mb-2 leading-relaxed">{hoveredInfo.sub}</div>
            {hoveredInfo.risk !== undefined && (
              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[var(--color-border-subtle)]">
                <span className="text-[var(--color-text-secondary)]">Risk Severity:</span>
                <span
                  className={`font-bold px-1.5 py-0.5 rounded ${
                    hoveredInfo.risk > 70
                      ? 'bg-red-500/15 text-red-500'
                      : hoveredInfo.risk > 40
                      ? 'bg-amber-500/15 text-amber-500'
                      : 'bg-emerald-500/15 text-emerald-500'
                  }`}
                >
                  {hoveredInfo.risk}% ({hoveredInfo.status?.replace(/_/g, ' ') || 'ACTIVE'})
                </span>
              </div>
            )}
          </div>
        )}

        {/* 
          ====================================================================
          LAYER TOGGLE POPUP DOCK (Bottom Left Floating Pill)
          ====================================================================
        */}
        <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-1.5 glass-panel p-1.5 rounded-[6px] shadow-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-strong)]/90 backdrop-blur-md text-[10px] font-mono">
          <div className="flex items-center gap-1 text-[var(--color-text-secondary)] px-1.5 font-bold">
            <Layers className="w-3 h-3 text-[var(--color-surface-raised)]" />
            <span>{isBangla ? 'স্তরসমূহ:' : 'Layers:'}</span>
          </div>

          <button
            onClick={() => setLayers((prev) => ({ ...prev, baseVectorPoster: !prev.baseVectorPoster }))}
            className={`px-2 py-0.5 rounded-[3px] transition-colors cursor-pointer ${
              layers.baseVectorPoster
                ? 'bg-[var(--color-surface-raised)] text-white font-semibold'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-base)]'
            }`}
          >
            {isBangla ? 'ভেক্টর ম্যাপ' : 'Vector Map'}
          </button>

          <button
            onClick={() => setLayers((prev) => ({ ...prev, cadastralPlots: !prev.cadastralPlots }))}
            className={`px-2 py-0.5 rounded-[3px] transition-colors cursor-pointer ${
              layers.cadastralPlots
                ? 'bg-[var(--color-surface-raised)] text-white font-semibold'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-base)]'
            }`}
          >
            {isBangla ? 'দাগ নকশা' : 'Cadastre'}
          </button>

          <button
            onClick={() => setLayers((prev) => ({ ...prev, beacons: !prev.beacons }))}
            className={`px-2 py-0.5 rounded-[3px] transition-colors cursor-pointer ${
              layers.beacons
                ? 'bg-[var(--color-surface-raised)] text-white font-semibold'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-base)]'
            }`}
          >
            {isBangla ? 'হটস্পট' : 'Hotspots'}
          </button>

          <button
            onClick={() => setLayers((prev) => ({ ...prev, districtLabels: !prev.districtLabels }))}
            className={`px-2 py-0.5 rounded-[3px] transition-colors cursor-pointer ${
              layers.districtLabels
                ? 'bg-[var(--color-surface-raised)] text-white font-semibold'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-base)]'
            }`}
          >
            {isBangla ? 'এলাকা লেবেল' : 'Labels'}
          </button>

          <button
            onClick={() => setIsInspectorOpen((prev) => !prev)}
            className={`px-2 py-0.5 rounded-[3px] transition-colors cursor-pointer ${
              isInspectorOpen
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/30'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-base)]'
            }`}
          >
            {isBangla ? 'প্লট ইনস্পেক্টর' : 'Inspector'}
          </button>
        </div>

        {/* 
          ====================================================================
          RIGHT INSPECTOR DOCK (Plot Details & Disputed Investigation Telemetry)
          ====================================================================
        */}
        {isInspectorOpen && selectedPlot && (
          <div className="absolute top-4 right-4 z-20 w-80 max-w-[calc(100vw-2rem)] glass-tile p-4 rounded-[8px] shadow-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-strong)]/95 backdrop-blur-md space-y-3 font-mono text-xs max-h-[calc(100%-2rem)] overflow-y-auto">
            {/* Inspector Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-surface-raised)]" />
                <div>
                  <div className="font-bold text-sm text-[var(--color-text-primary)]">
                    {isBangla ? `দাগ নং ${selectedPlot.dagNo}` : `Dag #${selectedPlot.dagNo}`}
                  </div>
                  <div className="text-[10px] text-[var(--color-text-secondary)]">
                    {isBangla ? selectedPlot.mouzaBn : selectedPlot.mouza}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedPlot.status === 'FLAGGED_DOUBLE_SALE'
                      ? 'bg-red-500/15 text-red-500 border border-red-500/30'
                      : selectedPlot.status === 'MUTATION_DISCREPANCY'
                      ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                  }`}
                >
                  {selectedPlot.status === 'FLAGGED_DOUBLE_SALE'
                    ? isBangla
                      ? 'দ্বৈত বিক্রয় চিহ্নিত'
                      : 'FLAGGED DISPUTE'
                    : selectedPlot.status === 'MUTATION_DISCREPANCY'
                    ? isBangla
                      ? 'নামজারি অসঙ্গতি'
                      : 'DISCREPANCY'
                    : isBangla
                    ? 'যাচাইকৃত'
                    : 'VERIFIED'}
                </div>
                <button
                  onClick={() => setIsInspectorOpen(false)}
                  className="p-1 rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Active Concurrency Lock Alert Banner */}
            {selectedPlot.activeLock && (
              <div className="p-2.5 rounded-[4px] bg-red-500/10 border border-red-500/30 space-y-1">
                <div className="flex items-center justify-between text-red-500 font-bold text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isBangla ? 'সফট লক সক্রিয়' : 'CONCURRENCY LOCK ACTIVE'}</span>
                  </span>
                  <span className="text-[10px] bg-red-500/20 px-1.5 py-0.2 rounded font-mono">
                    #{selectedPlot.activeLock.token}
                  </span>
                </div>
                <div className="text-[10.5px] text-[var(--color-text-secondary)] leading-relaxed">
                  {isBangla
                    ? `${selectedPlot.activeLock.officeBn} হতে ৭২ ঘণ্টার জন্য ক্রয়-বিক্রয় অস্থায়ীভাবে স্থগিত। অবশিষ্টাংশ: ${selectedPlot.activeLock.expiresIn}`
                    : `Drafting hold dispatched from ${selectedPlot.activeLock.office}. Lock window expires in ${selectedPlot.activeLock.expiresIn}.`}
                </div>
              </div>
            )}

            {/* Key Cadastral Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-[4px] bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)]">
                <div className="text-[10px] text-[var(--color-text-secondary)]">{isBangla ? 'খতিয়ান নং' : 'Khatian'}</div>
                <div className="font-bold text-[var(--color-text-primary)]">{selectedPlot.khatianNo}</div>
              </div>
              <div className="p-2 rounded-[4px] bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)]">
                <div className="text-[10px] text-[var(--color-text-secondary)]">{isBangla ? 'জমির পরিমাণ' : 'Plot Area'}</div>
                <div className="font-bold text-[var(--color-text-primary)]">
                  {selectedPlot.areaDec} {isBangla ? 'শতক' : 'Dec'} ({selectedPlot.katha} {isBangla ? 'কাঠা' : 'Katha'})
                </div>
              </div>
            </div>

            {/* Ownership & NID Telemetry */}
            <div className="p-2 rounded-[4px] bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)] space-y-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[var(--color-text-secondary)]">{isBangla ? 'দাবীকৃত মালিক' : 'Claimed Owner'}:</span>
                <span className="font-semibold text-[var(--color-text-primary)]">
                  {isBangla ? selectedPlot.ownerBn : selectedPlot.owner}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[var(--color-text-secondary)]">NID:</span>
                <span className="text-[var(--color-text-secondary)] font-mono">{selectedPlot.nid}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[var(--color-text-secondary)]">Risk Score:</span>
                <span
                  className={`font-bold ${
                    selectedPlot.riskScore > 70
                      ? 'text-red-500'
                      : selectedPlot.riskScore > 40
                      ? 'text-amber-500'
                      : 'text-emerald-500'
                  }`}
                >
                  {selectedPlot.riskScore} / 100
                </span>
              </div>
            </div>

            {/* Alert / Findings Note */}
            <div className="text-[10.5px] leading-relaxed text-[var(--color-text-secondary)] bg-[var(--color-surface-base)]/50 p-2 rounded-[4px] border border-[var(--color-border-subtle)]">
              {isBangla ? selectedPlot.alertNoteBn : selectedPlot.alertNote}
            </div>

            {/* Fast Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  zoomToBasePoint(selectedPlot.center[0], selectedPlot.center[1], 8.5);
                }}
                className="flex-1 py-1.5 rounded-[4px] bg-[var(--color-surface-raised)] text-white text-[11px] font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1 cursor-pointer"
              >
                <Crosshair className="w-3 h-3" />
                <span>{isBangla ? 'প্লটে জুম করুন' : 'Focus Plot'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
