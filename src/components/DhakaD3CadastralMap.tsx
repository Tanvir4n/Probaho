/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Probaho — High-Accuracy Native Vector Cadastral GIS Engine for Dhaka Metropolitan Area
 * 
 * Clean, uncluttered, professional architectural GIS workstation:
 * - Master vector artwork (2HB5YBP & 2HB5YBW) rendered full-bleed with hardware-accelerated 60 FPS canvas
 * - Watermarks cleanly cropped and masked out
 * - Floating glassmorphic HUD controls (zero stacked headers, 100% viewport utilization)
 * - Flagship Core: Dhanmondi Mouza J.L. 245 · Dag 1042 (Double-Sale Dispute & 72h Concurrency Soft Lock #RES-794021)
 * - Strategic Thana Nodes: Dhanmondi, Mirpur, Gulshan, Banani, Uttara, Tejgaon, Motijheel, Old Dhaka, HSIA Airport, Purbachal 300ft
 * - Real-time WGS84 GPS coordinate crosshair tracking, zoom controls, quick preset focus, search, layer toggles, and compact cadastral plot inspector
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
import { useLanguage } from '../context/LanguageContext';
import {
  DHAKA_PROJECT_AREAS,
  DHAKA_CADASTRAL_PLOTS,
  DhakaCadastralPlotFeature,
} from '../data/dhakaGeoData';

// Master vector poster imagery
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
  showInspectorPanel = false,
}) => {
  const { isBangla } = useLanguage();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const svgOverlayRef = useRef<SVGSVGElement | null>(null);
  const coordsRef = useRef<HTMLSpanElement | null>(null);
  const zoomBadgeRef = useRef<HTMLSpanElement | null>(null);

  // Poster style mode:
  // - 'poster-dark': Midnight obsidian land silhouette with glowing white streets on deep dark base
  // - 'poster-light': Clean architectural poster with blue waterways
  // - 'cadastral-hud': Futuristic Cyber Blueprint
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
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Hover Tooltip
  const [hoveredInfo, setHoveredInfo] = useState<{
    title: string;
    sub: string;
    risk?: number;
    status?: string;
  } | null>(null);

  // Layer Toggles
  const [layers, setLayers] = useState({
    cadastralPlots: true,
    beacons: true,
    districtLabels: true,
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

  // Compute Base Fit Scale and Centering Offset with minimal padding for full-bleed immersion
  const { baseScale, offsetX, offsetY } = useMemo(() => {
    const pad = 8;
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
      return {
        canvasBg: '#090e17', // Seamless with studio dark atmosphere
        landPatchColor: '#1a1f28', // Matches landmass to cleanly mask watermarks
        textPrimary: '#ffffff',
        textSecondary: '#94a3b8',
        border: 'rgba(255, 255, 255, 0.12)',
        glassBg: 'rgba(9, 14, 23, 0.82)',
      };
    } else if (posterStyle === 'poster-light') {
      return {
        canvasBg: '#f8fafc',
        landPatchColor: '#f1f5f9',
        textPrimary: '#0f172a',
        textSecondary: '#64748b',
        border: 'rgba(15, 23, 42, 0.12)',
        glassBg: 'rgba(255, 255, 255, 0.88)',
      };
    } else {
      return {
        canvasBg: '#060911',
        landPatchColor: '#0a101d',
        textPrimary: '#38bdf8',
        textSecondary: '#0284c7',
        border: 'rgba(56, 189, 248, 0.25)',
        glassBg: 'rgba(6, 9, 17, 0.88)',
      };
    }
  }, [posterStyle]);

  // Draw the map onto HTML5 Canvas with 60 FPS hardware acceleration
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

    // 2. Draw the master vector artwork
    const activeImg = posterStyle === 'poster-light' ? imgDayRef.current : imgNightRef.current;
    if (activeImg && activeImg.complete && activeImg.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      if (posterStyle === 'cadastral-hud') {
        ctx.filter = 'contrast(1.25) hue-rotate(185deg) brightness(0.9)';
      }

      // Draw cropped image (excluding bottom 75px watermark)
      const sW = activeImg.naturalWidth;
      const sH = Math.min(activeImg.naturalHeight, activeImg.naturalHeight - 75);
      ctx.drawImage(activeImg, 0, 0, sW, sH, 0, 0, BASE_WIDTH, BASE_HEIGHT);

      ctx.filter = 'none';

      // Cleanly mask faint center/bottom watermark artifacts
      if (posterStyle === 'poster-dark') {
        ctx.fillStyle = palette.landPatchColor;
        // Center subtle patch
        ctx.beginPath();
        ctx.ellipse(484, 622, 42, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        // Lower subtle patch
        ctx.beginPath();
        ctx.ellipse(484, 915, 40, 14, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }, [dimensions.width, dimensions.height, palette, offsetX, offsetY, baseScale, posterStyle, isImagesLoaded]);

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

  // Live Coordinate Tracker
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
      className={`relative w-full h-full overflow-hidden select-none font-sans bg-[#090e17] ${className}`}
      style={{ height }}
    >
      {/* 
        ====================================================================
        LAYER 1: Hardware-Accelerated 2D Canvas (Master Vector Map)
        ====================================================================
      */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 
        ====================================================================
        LAYER 2: Interactive SVG Overlay (Pan/Zoom Target & Cadastre)
        ====================================================================
      */}
      <svg
        ref={svgOverlayRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        onDoubleClick={handleDoubleClick}
        onMouseMove={handleMouseMove}
      >
        <defs>
          {/* Dispute Hatched Pattern for Dag 1042 */}
          <pattern id="cad-dispute-hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(239, 68, 68, 0.9)" strokeWidth="2.4" />
          </pattern>
        </defs>

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
                      r={isPrimary ? 16 : 8}
                      fill="none"
                      stroke={isPrimary ? '#ef4444' : '#38bdf8'}
                      strokeWidth="1.2"
                      opacity="0.45"
                      strokeDasharray="2 2"
                      vectorEffect="non-scaling-stroke"
                      className="pointer-events-none"
                    />

                    {/* Outer halo circle */}
                    <circle
                      cx={px}
                      cy={py}
                      r={isPrimary ? 8 : 4.5}
                      fill={isPrimary ? 'rgba(239, 68, 68, 0.40)' : 'rgba(56, 189, 248, 0.35)'}
                      stroke={isPrimary ? '#ef4444' : '#38bdf8'}
                      strokeWidth="1.6"
                      vectorEffect="non-scaling-stroke"
                    />

                    {/* Center Point */}
                    <circle
                      cx={px}
                      cy={py}
                      r={isPrimary ? 3 : 2}
                      fill="#ffffff"
                      stroke={isPrimary ? '#ef4444' : '#0284c7'}
                      strokeWidth="1"
                    />

                    {/* PRIMARY CORE CALLOUT BANNER (Dhanmondi Mouza Dag 1042) */}
                    {isPrimary && (
                      <g className="callout-tag pointer-events-none transition-transform group-hover:scale-105">
                        <path
                          d={`M ${px} ${py} L ${px - 18} ${py - 18} L ${px - 110} ${py - 18}`}
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="1.4"
                          strokeDasharray="3 2"
                          vectorEffect="non-scaling-stroke"
                        />

                        <rect
                          x={px - 260}
                          y={py - 42}
                          width="240"
                          height="36"
                          rx="4"
                          fill="rgba(15, 23, 42, 0.95)"
                          stroke="#ef4444"
                          strokeWidth="1.4"
                          className="drop-shadow-xl"
                        />

                        <text
                          x={px - 250}
                          y={py - 28}
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                          fill="#f87171"
                        >
                          ★ {isBangla ? 'প্রধান প্রকল্প তদন্ত: ধানমন্ডি ১০৪২' : 'CORE INVESTIGATION: DAG 1042'}
                        </text>

                        <text
                          x={px - 250}
                          y={py - 15}
                          fontSize="7.5"
                          fontFamily="monospace"
                          fill="#cbd5e1"
                        >
                          {isBangla ? 'দ্বৈত-বিক্রয় সংঘাত · সফট লক সক্রিয়' : 'Double-Sale Collision · 72h Soft Lock Active'}
                        </text>
                      </g>
                    )}

                    {/* Label for Secondary Nodes */}
                    {!isPrimary && (
                      <text
                        x={px}
                        y={py + 12}
                        textAnchor="middle"
                        fontSize="7.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                        fill="#ffffff"
                        stroke="#090e17"
                        strokeWidth="2.5"
                        paintOrder="stroke fill"
                        className="opacity-90 select-none drop-shadow-sm pointer-events-none"
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
                      fontSize={isDhanmondi ? '10' : '8'}
                      fontWeight="900"
                      letterSpacing="1.5"
                      fontFamily="sans-serif"
                      fill="#ffffff"
                      opacity={isDhanmondi ? 0.95 : 0.75}
                      stroke="#090e17"
                      strokeWidth="2.5"
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
      </svg>

      {/* 
        ====================================================================
        FLOATING TOP CONTROLS HUD (Single Sleek Bar · Zero Stacking!)
        ====================================================================
      */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
        {/* Left: Quick Search & Core Preset */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBangla ? 'দাগ বা মৌজা (১০৪২)...' : 'Search Dag # / Mouza (1042)...'}
                className="w-36 sm:w-48 pl-7 pr-2.5 py-1 text-xs rounded-[4px] border border-white/15 bg-black/60 backdrop-blur-md text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
              />
            </div>
          </form>

          {/* Quick Focus Button */}
          <button
            onClick={focusPrimaryPlot}
            className="px-2.5 py-1 rounded-[4px] bg-red-500/20 text-red-400 border border-red-500/40 font-bold hover:bg-red-500/30 transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono backdrop-blur-md"
            title="Focus on Disputed Dag 1042"
          >
            <Target className="w-3 h-3 text-red-400" />
            <span className="hidden sm:inline">{isBangla ? 'দাগ ১০৪২' : 'Dag 1042'}</span>
          </button>
        </div>

        {/* Right: Style Pill & Zoom Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Poster Style Switcher */}
          <div className="flex items-center border border-white/15 bg-black/60 backdrop-blur-md rounded-[4px] p-0.5 text-[10.5px] font-mono">
            <button
              onClick={() => setPosterStyle('poster-dark')}
              className={`px-2 py-0.5 rounded-[3px] transition-colors cursor-pointer ${
                posterStyle === 'poster-dark'
                  ? 'bg-zinc-800 text-white font-bold shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setPosterStyle('poster-light')}
              className={`px-2 py-0.5 rounded-[3px] transition-colors cursor-pointer ${
                posterStyle === 'poster-light'
                  ? 'bg-sky-500 text-white font-bold shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => setPosterStyle('cadastral-hud')}
              className={`px-2 py-0.5 rounded-[3px] transition-colors cursor-pointer ${
                posterStyle === 'cadastral-hud'
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              HUD
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center bg-black/60 backdrop-blur-md border border-white/15 rounded-[4px] p-0.5 text-white/70">
            <button
              onClick={handleZoomIn}
              className="p-1 hover:text-white hover:bg-white/10 rounded-[3px] transition-colors cursor-pointer"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 hover:text-white hover:bg-white/10 rounded-[3px] transition-colors cursor-pointer"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="p-1 hover:text-white hover:bg-white/10 rounded-[3px] transition-colors cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 
        ====================================================================
        FLOATING BOTTOM STATUS BAR (Telemetry + Layers)
        ====================================================================
      */}
      <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
        {/* Layer Controls */}
        <div className="flex items-center gap-1 glass-panel p-1 rounded-[4px] border border-white/15 bg-black/65 backdrop-blur-md text-[10px] font-mono pointer-events-auto">
          <span className="text-white/50 px-1 font-semibold">{isBangla ? 'স্তর:' : 'Layers:'}</span>
          <button
            onClick={() => setLayers((prev) => ({ ...prev, cadastralPlots: !prev.cadastralPlots }))}
            className={`px-1.5 py-0.5 rounded-[3px] transition-colors cursor-pointer ${
              layers.cadastralPlots ? 'bg-emerald-500/25 text-emerald-400 font-bold' : 'text-white/40 hover:text-white'
            }`}
          >
            {isBangla ? 'দাগ নকশা' : 'Plots'}
          </button>
          <button
            onClick={() => setLayers((prev) => ({ ...prev, beacons: !prev.beacons }))}
            className={`px-1.5 py-0.5 rounded-[3px] transition-colors cursor-pointer ${
              layers.beacons ? 'bg-emerald-500/25 text-emerald-400 font-bold' : 'text-white/40 hover:text-white'
            }`}
          >
            {isBangla ? 'হটস্পট' : 'Hotspots'}
          </button>
          <button
            onClick={() => setLayers((prev) => ({ ...prev, districtLabels: !prev.districtLabels }))}
            className={`px-1.5 py-0.5 rounded-[3px] transition-colors cursor-pointer ${
              layers.districtLabels ? 'bg-emerald-500/25 text-emerald-400 font-bold' : 'text-white/40 hover:text-white'
            }`}
          >
            {isBangla ? 'লেবেল' : 'Labels'}
          </button>
        </div>

        {/* Live WGS84 GPS Readout */}
        <div className="flex items-center gap-2 glass-panel px-2.5 py-1 rounded-[4px] border border-white/15 bg-black/65 backdrop-blur-md text-[10px] font-mono text-white/70 pointer-events-auto">
          <Crosshair className="w-3 h-3 text-emerald-400" />
          <span ref={coordsRef} className="font-semibold text-white">23.7461° N, 90.3752° E</span>
          <span className="text-white/20">|</span>
          <span ref={zoomBadgeRef} className="text-emerald-400 font-bold">1.0x</span>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredInfo && (
        <div className="absolute top-12 left-4 z-40 pointer-events-none glass-tile p-2.5 rounded-[6px] max-w-xs shadow-2xl border border-white/20 bg-slate-950/95 backdrop-blur-md font-mono text-xs text-white animate-in fade-in duration-100">
          <div className="font-bold text-emerald-400 text-xs mb-0.5">{hoveredInfo.title}</div>
          <div className="text-[10.5px] text-white/80 leading-snug">{hoveredInfo.sub}</div>
          {hoveredInfo.risk !== undefined && (
            <div className="flex items-center justify-between text-[9.5px] pt-1 mt-1 border-t border-white/10">
              <span className="text-white/50">Risk Severity:</span>
              <span className={`font-bold px-1 rounded ${hoveredInfo.risk > 70 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {hoveredInfo.risk}% ({hoveredInfo.status?.replace(/_/g, ' ') || 'ACTIVE'})
              </span>
            </div>
          )}
        </div>
      )}

      {/* Floating Inspector Panel (Only shown when plot is active/selected) */}
      {isInspectorOpen && selectedPlot && (
        <div className="absolute top-12 right-4 z-40 w-72 glass-tile p-3.5 rounded-[8px] shadow-2xl border border-white/20 bg-slate-950/95 backdrop-blur-md space-y-2.5 font-mono text-xs text-white max-h-[calc(100%-4rem)] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <div>
                <div className="font-bold text-xs text-white">
                  {isBangla ? `দাগ নং ${selectedPlot.dagNo}` : `Dag #${selectedPlot.dagNo}`}
                </div>
                <div className="text-[9.5px] text-white/50">
                  {isBangla ? selectedPlot.mouzaBn : selectedPlot.mouza}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsInspectorOpen(false)}
              className="p-1 rounded text-white/50 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {selectedPlot.activeLock && (
            <div className="p-2 rounded-[4px] bg-red-500/15 border border-red-500/40 text-[10px] space-y-0.5">
              <div className="flex items-center justify-between text-red-400 font-bold">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>{isBangla ? 'সফট লক সক্রিয়' : 'CONCURRENCY LOCKED'}</span>
                </span>
                <span>#{selectedPlot.activeLock.token}</span>
              </div>
              <div className="text-white/70 leading-relaxed text-[9.5px]">
                {isBangla ? '৭২ ঘণ্টার প্রি-সেল সফট লক কার্যকর।' : 'Active 72h Pre-Sale lock hold.'}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-1.5 text-[10.5px]">
            <div className="p-1.5 rounded-[4px] bg-white/5 border border-white/10">
              <div className="text-[9px] text-white/50">{isBangla ? 'খতিয়ান নং' : 'Khatian'}</div>
              <div className="font-bold text-white">{selectedPlot.khatianNo}</div>
            </div>
            <div className="p-1.5 rounded-[4px] bg-white/5 border border-white/10">
              <div className="text-[9px] text-white/50">{isBangla ? 'জমির পরিমাণ' : 'Plot Area'}</div>
              <div className="font-bold text-white">{selectedPlot.areaDec} Dec ({selectedPlot.katha} K)</div>
            </div>
          </div>

          <div className="p-1.5 rounded-[4px] bg-white/5 border border-white/10 text-[10.5px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-white/50">{isBangla ? 'দাবীকৃত মালিক' : 'Owner'}:</span>
              <span className="font-semibold text-white">{isBangla ? selectedPlot.ownerBn : selectedPlot.owner}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-white/50">Risk Severity:</span>
              <span className={`font-bold ${selectedPlot.riskScore > 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                {selectedPlot.riskScore}%
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              zoomToBasePoint(selectedPlot.center[0], selectedPlot.center[1], 8.5);
            }}
            className="w-full py-1 rounded-[4px] bg-emerald-600 hover:bg-emerald-500 text-white text-[10.5px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <Crosshair className="w-3 h-3" />
            <span>{isBangla ? 'প্লটে জুম করুন' : 'Focus Plot'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
