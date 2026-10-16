/**
 * Probaho Token Architecture & Design System Foundations
 * Standardized for Probaho — Intelligent Land Fraud Detection
 */

export interface TokenGroup {
  name: string;
  key: string;
  description: string;
  tokens: {
    name: string;
    value: string;
    computed?: string;
    description: string;
    wcagContrastAgainstBase?: string;
    wcagRating?: string;
  }[];
}

export const MASS_COLOR_TOKENS_NIGHT = {
  name: 'Night Mode (Dark-Base / Obsidian & Green)',
  text: {
    primary: '#eceae6',
    secondary: '#8a8a86',
    tertiary: '#555552',
  },
  border: {
    strong: '#ffffff',
    subtle: 'rgba(255, 255, 255, 0.12)',
  },
  surface: {
    base: '#000000',
    muted: '#121214',
    raised: '#22c55e',
    strong: '#0e0e0f',
  },
  shadow: {
    1: 'rgba(0, 0, 0, 0.62) 0px 20px 44px 0px, rgba(34, 197, 94, 0.18) 0px 0px 30px 0px',
  },
};

export const MASS_COLOR_TOKENS_DAY = {
  name: 'Day Mode (Light-Base / Off-White & Emerald Green)',
  text: {
    primary: '#111113', // Deep charcoal (14.8:1 contrast on #f6f5f2 - AAA)
    secondary: '#4b5563', // Slate neutral (5.8:1 contrast on #f6f5f2 - AA)
    tertiary: '#6b7280', // Cool gray (4.54:1 contrast on #f6f5f2 - AA)
  },
  border: {
    strong: '#111113',
    subtle: 'rgba(0, 0, 0, 0.12)',
  },
  surface: {
    base: '#f6f5f2', // Architectural warm off-white canvas
    muted: '#e8e6e1', // Architectural card base
    raised: '#16a34a', // Precision architectural emerald green (4.14:1 contrast on base)
    strong: '#ffffff', // Crisp white card/panel
  },
  shadow: {
    1: 'rgba(0, 0, 0, 0.08) 0px 14px 34px 0px, rgba(22, 163, 74, 0.16) 0px 0px 26px 0px',
  },
};

export const MASS_COLOR_TOKENS = MASS_COLOR_TOKENS_NIGHT;

export const MASS_TYPOGRAPHY_SCALE = [
  { token: 'font.size.xs', value: '9.6px', rem: '0.6rem', role: 'Micro badges, technical indicators, coordinate labels' },
  { token: 'font.size.sm', value: '10.56px', rem: '0.66rem', role: 'Meta footnotes, attribution, tabular indices' },
  { token: 'font.size.md', value: '11.52px', rem: '0.72rem', role: 'Secondary navigation links, subtle status captions' },
  { token: 'font.size.lg', value: '12.64px', rem: '0.79rem', role: 'Standard button labels, form labels, kicker titles' },
  { token: 'font.size.xl', value: '12.8px', rem: '0.80rem', role: 'Card subsection subtitles, compact data metrics' },
  { token: 'font.size.2xl', value: '13.28px', rem: '0.83rem', role: 'Tab controls, editorial callout headers' },
  { token: 'font.size.3xl', value: '15.68px', rem: '0.98rem', role: 'Lead paragraph openers, high-priority links' },
  { token: 'font.size.4xl', value: '16px', rem: '1.00rem', role: 'Base body prose font size' },
];

export const MASS_SPACING_SCALE = [
  { token: 'space.1', value: '7px', useCase: 'Hairline button vertical padding, icon-label gap' },
  { token: 'space.2', value: '8px', useCase: 'Segmented control padding, micro gutter' },
  { token: 'space.3', value: '10px', useCase: 'Input field vertical interior padding' },
  { token: 'space.4', value: '11px', useCase: 'Button standard vertical padding' },
  { token: 'space.5', value: '12px', useCase: 'Form row vertical gap, small card margin' },
  { token: 'space.6', value: '14px', useCase: 'Button horizontal padding, compact container edge' },
  { token: 'space.7', value: '15px', useCase: 'Medium grid column gap' },
  { token: 'space.8', value: '18px', useCase: 'Section divider margin, primary card padding' },
];

export const MASS_RADIUS_TOKENS = [
  { token: 'radius.xs', value: '2px', useCase: 'Standard sharp architectural radius across all interactive elements' },
];

export const MASS_SHADOW_TOKENS = [
  {
    token: 'shadow.1',
    value: 'rgba(0, 0, 0, 0.62) 0px 20px 44px 0px, rgba(34, 197, 94, 0.18) 0px 0px 30px 0px',
    useCase: 'Elevated investigation card, risk assessment modal backdrop elevation',
  },
];

export const MASS_MOTION_TOKENS = [
  { token: 'motion.duration.instant', value: '150ms', useCase: 'Focus ring transition, micro hover feedback' },
  { token: 'motion.duration.fast', value: '200ms', useCase: 'Button active press, color settle curve' },
  { token: 'motion.duration.normal', value: '220ms', useCase: 'Drawer slide, dialog backdrop fade' },
  { token: 'motion.duration.slow', value: '700ms', useCase: 'Hero ambient fade, investigation dashboard state reveal' },
];

export const MASS_COMPONENT_STATES = [
  'default',
  'hover',
  'focus-visible',
  'active',
  'disabled',
  'loading',
  'error',
] as const;

export type ComponentState = typeof MASS_COMPONENT_STATES[number];

// ============================================================
// LAND RECORD CASES (replaces ArchitecturalProject)
// ============================================================

export interface ArchitecturalProject {
  id: string;
  title: string;
  titleBn?: string;
  category: string;
  categoryBn?: string;
  location: string;
  locationBn?: string;
  year: string;
  metric: string;
  metricLabel: string;
  metricLabelBn?: string;
  image: string;
  summary: string;
  summaryBn?: string;
  dimensions: string;
  dimensionsBn?: string;
  materials: string[];
  materialsBn?: string[];
}

export const ARCHITECTURAL_PROJECTS: ArchitecturalProject[] = [
  {
    id: 'case-clean-001',
    title: 'Verified Ownership Chain — Rajshahi Division',
    titleBn: 'যাচাইকৃত মালিকানা ধারা — রাজশাহী বিভাগ',
    category: 'Clean Case',
    categoryBn: 'নিরাপদ কেস',
    location: 'Rajshahi, Bangladesh',
    locationBn: 'রাজশাহী, বাংলাদেশ',
    year: '2024',
    metric: '100%',
    metricLabel: 'Ownership Chain Verified',
    metricLabelBn: 'মালিকানা ধারা সম্পূর্ণ যাচাইকৃত',
    image: '/src/assets/images/map_manhattan_carto_1791915045536.jpg',
    summary: "All deeds, mutations, and khatian records are consistent. The seller's recorded share fully covers the transfer and no conflicting transactions were detected across the parcel timeline.",
    summaryBn: 'সকল দলিল, নামজারি ও খতিয়ান রেকর্ড সম্পূর্ণ সামঞ্জস্যপূর্ণ। বিক্রেতার সংরক্ষিত হিস্যা হস্তান্তরের সাথে সম্পূর্ণ মেলে এবং প্লট টাইমলাইনে কোনো বিতর্কিত লেনদেন পাওয়া যায়নি।',
    dimensions: 'Dag 1452 · Mouza Kantanagar',
    dimensionsBn: 'দাগ ১৪৫২ · মৌজা কান্তনগর',
    materials: ['Sale Deed 2019', 'RS Khatian 2015', 'Mutation Record 2020'],
    materialsBn: ['বিক্রয় দলিল ২০১৯', 'আরএস খতিয়ান ২০১৫', 'নামজারি রেকর্ড ২০২০'],
  },
  {
    id: 'case-double-sale',
    title: 'Double-Sale Fraud — Dhaka Metropolitan',
    titleBn: 'দ্বৈত-বিক্রয় প্রতারণা — ঢাকা মেট্রোপলিটন',
    category: 'Double Sale',
    categoryBn: 'দ্বৈত বিক্রয়',
    location: 'Dhaka, Bangladesh',
    locationBn: 'ঢাকা, বাংলাদেশ',
    year: '2025',
    metric: '94.6%',
    metricLabel: 'Fraud Confidence Score',
    metricLabelBn: 'জালিয়াতি নিশ্চিতকরণ সূচক',
    image: '/src/assets/images/map_tokyo_carto_1791915087818.jpg',
    summary: "Two conflicting sale deeds dated 12 days apart transfer the same parcel (Dag 3078) to different buyers. The seller's recorded ownership share does not support the second transfer.",
    summaryBn: '১২ দিনের ব্যবধানে সম্পাদিত দুটি পরস্পরবিরোধী বিক্রয় দলিলে একই প্লট (দাগ ৩০৭৮) ভিন্ন ভিন্ন ক্রেতার কাছে হস্তান্তর করা হয়েছে। বিক্রেতার বৈধ হিস্যায় দ্বিতীয় বিক্রয় আইনত অসম্ভব।',
    dimensions: 'Dag 3078 · Mouza Mirpur',
    dimensionsBn: 'দাগ ৩০৭৮ · মৌজা মিরপুর',
    materials: ['Sale Deed A — 2025-01-04', 'Sale Deed B — 2025-01-16', 'RS Porcha 2018'],
    materialsBn: ['বিক্রয় দলিল ক — ০৪-০১-২০২৫', 'বিক্রয় দলিল খ — ১৬-০১-২০২৫', 'আরএস পর্চা ২০১৮'],
  },
  {
    id: 'case-complex-003',
    title: 'Share Mismatch & Mutation Conflict — Chittagong',
    titleBn: 'হিস্যা অসঙ্গতি ও নামজারি বিতর্ক — চট্টগ্রাম',
    category: 'Complex Fraud',
    categoryBn: 'জটিল জালিয়াতি',
    location: 'Chittagong, Bangladesh',
    locationBn: 'চট্টগ্রাম, বাংলাদেশ',
    year: '2026',
    metric: '3 Alerts',
    metricLabel: 'Cross-Signal Fraud Triggers',
    metricLabelBn: 'মাল্টি-সিগন্যাল ফ্রড অ্যালার্ট',
    image: '/src/assets/images/map_london_carto_1791915087785.jpg',
    summary: 'An ownership-share mismatch combined with an inconsistent mutation record and a suspicious document version. The claimed transfer exceeds available shares by 22% and the mutation date predates the original deed.',
    summaryBn: 'মালিকানা হিস্যার গরমিল, নামজারি রেকর্ডের বৈপরীত্য ও সন্দেহজনক নথি সংস্করণ। দাবিকৃত হস্তান্তর বিক্রেতার হিস্যার চেয়ে ২২% বেশি এবং নামজারির তারিখ মূল দলিলের পূর্ববর্তী।',
    dimensions: 'Dag 7291 · Mouza Patenga',
    dimensionsBn: 'দাগ ৭২৯১ · মৌজা পতেঙ্গা',
    materials: ['Khatian 2017 (v1)', 'Khatian 2017 (v2 — altered)', 'Mutation 2019', 'Sale Deed 2023'],
    materialsBn: ['খতিয়ান ২০১৭ (সংস্করণ ১)', 'খতিয়ান ২০১৭ (সংস্করণ ২ — ঘষা-মাজা)', 'নামজারি ২০১৯', 'বিক্রয় দলিল ২০২৩'],
  },
];

// ============================================================
// PARCEL MAP DATASETS (Bangladesh districts + global context)
// ============================================================

export interface UrbanMapDataset {
  id: string;
  cityName: string;
  country: string;
  coordinates: string;
  image: string;
  parcelCount: string;
  layers: string;
  accent: string;
}

export const URBAN_MAP_DATASETS: UrbanMapDataset[] = [
  {
    id: 'dhaka-metro',
    cityName: 'Dhaka',
    country: 'Bangladesh',
    coordinates: '23.8103° N, 90.4125° E',
    image: '/src/assets/images/map_manhattan_carto_1791915045536.jpg',
    parcelCount: '42,800 Parcels',
    layers: 'D3 Vector Cadastre · 11 Thanas · River Corridors · Dag Plots',
    accent: '#22c55e',
  },
  {
    id: 'chittagong-div',
    cityName: 'Chittagong',
    country: 'Bangladesh',
    coordinates: '22.3569° N, 91.7832° E',
    image: '/src/assets/images/map_tokyo_carto_1791915087818.jpg',
    parcelCount: '28,500 Parcels',
    layers: 'Dag Plot Registry · RS/SA Survey Overlay · Transfer Timeline',
    accent: '#10b981',
  },
  {
    id: 'rajshahi-div',
    cityName: 'Rajshahi',
    country: 'Bangladesh',
    coordinates: '24.3745° N, 88.6042° E',
    image: '/src/assets/images/map_london_carto_1791915087785.jpg',
    parcelCount: '19,200 Parcels',
    layers: 'BS/RS Khatian Index · Mutation Records · Area Registry',
    accent: '#16a34a',
  },
  {
    id: 'sylhet-div',
    cityName: 'Sylhet',
    country: 'Bangladesh',
    coordinates: '24.8949° N, 91.8687° E',
    image: '/src/assets/images/map_cologne_carto_1791915088536.jpg',
    parcelCount: '15,600 Parcels',
    layers: 'Porcha Registry · Deed Ledger · Boundary Vectors',
    accent: '#15803d',
  },
];

// ============================================================
// FRAUD DETECTION TOOLS (replaces MassLabTool)
// ============================================================

export interface MassLabTool {
  id: string;
  name: string;
  shortName?: string;
  kicker: string;
  headline: string;
  meta: string;
  description: string;
  ctaText: string;
  iconType: 'masslabs' | 'archimap' | 'cologram' | 'laserfish' | 'globee';
}

export const MASSLABS_TOOLS: MassLabTool[] = [
  {
    id: 'masslabs',
    name: 'Probaho',
    shortName: 'Probaho',
    kicker: 'Probaho Intelligence Platform',
    headline: 'Detect Land Fraud Before It Happens',
    meta: 'Ownership graphs · cross-document analysis · explainable risk scoring · adversarial testing',
    description: 'Multi-signal fraud detection and evidence intelligence for Bangladesh land records.',
    ctaText: 'Launch Investigation →',
    iconType: 'masslabs',
  },
  {
    id: 'archimap',
    name: 'Ownership Graph',
    shortName: 'archiMap',
    kicker: 'Temporal Ownership-Graph Investigation',
    headline: 'Ownership Chain Analysis',
    meta: 'Parcel ownership graphs · temporal transfer chains · double-sale detection · share validation · mutation tracking',
    description: 'Model every parcel, owner, deed and mutation as a connected graph. Track how ownership changes over time and flag impossible transitions.',
    ctaText: 'Open Ownership Graph →',
    iconType: 'archimap',
  },
  {
    id: 'cologram',
    name: 'DocCompare',
    shortName: 'DocCompare',
    kicker: 'Cross-Document Contradiction Engine',
    headline: 'Document Contradiction Analysis',
    meta: 'Bangla OCR extraction · field-level comparison · dag/plot/area/share conflicts · page references',
    description: 'Extract structured fields from deeds, khatian and mutation papers. Show exact conflicting fields side by side.',
    ctaText: 'Analyze Documents →',
    iconType: 'cologram',
  },
  {
    id: 'laserfish',
    name: 'FraudEngine',
    shortName: 'FraudEngine',
    kicker: 'Explainable Fraud-Risk Scoring',
    headline: 'Explainable Risk Assessment',
    meta: 'Hard rules + anomaly detection · severity scoring · evidence trails · uncertainty measures · rule explanations',
    description: 'Every alert includes the rule triggered, supporting records, severity, and uncertainty — not just a score.',
    ctaText: 'Run Risk Analysis →',
    iconType: 'laserfish',
  },
  {
    id: 'globee',
    name: 'Simulator',
    shortName: 'Simulator',
    kicker: 'Adversarial Fraud Simulator',
    headline: 'Self-Testing Fraud Simulator',
    meta: 'Fictional fraud scenarios · double sale · altered area · missing links · detection rate · false-positive analysis',
    description: 'Generate attack scenarios, test detection, measure performance, and prove the system catches real fraud patterns.',
    ctaText: 'Run Simulation →',
    iconType: 'globee',
  },
];

// ============================================================
// PRICING PLANS (Investigation tiers)
// ============================================================

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export const MASSLABS_PRICING: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Community',
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Basic ownership chain verification and single-document analysis for researchers and students.',
    features: [
      'Single parcel ownership chain lookup',
      'Basic khatian/porcha field extraction',
      'Up to 10 document uploads per month',
      'Standard fraud risk indicators',
      'Community knowledge base access',
    ],
    cta: 'Start Free',
  },
  {
    id: 'pro',
    name: 'Investigator',
    badge: 'MOST POPULAR',
    monthlyPrice: 24,
    annualPrice: 19,
    popular: true,
    description: 'Full multi-signal fraud detection, cross-document analysis, and explainable risk scoring.',
    features: [
      'Full temporal ownership-graph investigation',
      'Cross-document contradiction engine',
      'Explainable fraud-risk scoring with evidence trails',
      'Bangla OCR with field-level confidence values',
      'Unlimited document uploads and case files',
      'Counterfactual risk analysis (what-if scenarios)',
    ],
    cta: 'Start 14-Day Trial',
  },
  {
    id: 'studio',
    name: 'Agency',
    monthlyPrice: 69,
    annualPrice: 55,
    description: 'For law firms, land offices, and government agencies requiring team-based investigation.',
    features: [
      'Everything in Investigator',
      '5 seats included with centralized billing',
      'Adversarial fraud scenario simulator',
      'Batch document ingestion & analysis',
      'SHA-256 document integrity verification',
      'Signed audit trail and investigation history',
      'Priority support with dedicated analyst',
    ],
    cta: 'Request Agency License',
  },
];
