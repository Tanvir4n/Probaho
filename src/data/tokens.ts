/**
 * MassLabs Token Architecture & Design System Foundations
 * Standardized for masslabs-archi.com
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
    useCase: 'Elevated architectural model card, inquiry modal backdrop elevation',
  },
];

export const MASS_MOTION_TOKENS = [
  { token: 'motion.duration.instant', value: '150ms', useCase: 'Focus ring transition, micro hover feedback' },
  { token: 'motion.duration.fast', value: '200ms', useCase: 'Button active press, color settle curve' },
  { token: 'motion.duration.normal', value: '220ms', useCase: 'Drawer slide, dialog backdrop fade' },
  { token: 'motion.duration.slow', value: '700ms', useCase: 'Hero ambient fade, architectural model state reveal' },
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

export interface ArchitecturalProject {
  id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  metric: string;
  metricLabel: string;
  image: string;
  summary: string;
  dimensions: string;
  materials: string[];
}

export const ARCHITECTURAL_PROJECTS: ArchitecturalProject[] = [
  {
    id: 'pavilion-09',
    title: 'Monolith Matrix Pavilion',
    category: 'Parametric Pavilion',
    location: 'Vesturland, Iceland',
    year: '2025',
    metric: '14,200 m²',
    metricLabel: 'Parametric Envelope',
    image: '/src/assets/images/project_monolith_matrix_1791865029772.jpg',
    summary: 'A responsive structural canopy formed by algorithmic timber louvers and matte basalt steel joints, optimizing seasonal wind deflection and internal thermal accumulation.',
    dimensions: '64m × 42m × 18m',
    materials: ['Carbonized Siberian Larch', 'Basalt Composite', 'Structural Steel DX51'],
  },
  {
    id: 'kinetic-facade',
    title: 'Kinetic Basalt Facade',
    category: 'Adaptive Envelope',
    location: 'Zurich, Switzerland',
    year: '2026',
    metric: '48.2%',
    metricLabel: 'Embodied Carbon Drop',
    image: '/src/assets/images/project_kinetic_facade_1791865030450.jpg',
    summary: 'Faceted monolithic stone panels integrated with recessed solar-thermal seams. Each facet responds mechanically to micro-climate irradiance fluctuations.',
    dimensions: '110m Facade Span',
    materials: ['Extracted Basalt Plates', 'Copper Seams', 'Micro-hydraulic Actuators'],
  },
  {
    id: 'spatial-lab',
    title: 'Computational Spatial Lab',
    category: 'Research Facility',
    location: 'Rotterdam, Netherlands',
    year: '2024',
    metric: '120 Nodes',
    metricLabel: 'Real-time Structural Telemetry',
    image: '/src/assets/images/studio_spatial_lab_1791865031280.jpg',
    summary: 'Central prototyping studio housing physical scale fabrication tables, robotic wire-bending arms, and live stress-strain computational simulation rigs.',
    dimensions: '1,850 m² Studio Floor',
    materials: ['Polished Slag Concrete', 'Smoked Glass 12mm', 'Anodized Black Aluminum'],
  },
];

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
    id: 'nyc-manhattan',
    cityName: 'New York',
    country: 'United States',
    coordinates: '40.7128° N, 74.0060° W',
    image: '/src/assets/images/map_manhattan_carto_1791915045536.jpg',
    parcelCount: '18,400 Parcels',
    layers: 'Building Data 8+ · True-Width Roads · Waterfront Piers',
    accent: '#22c55e',
  },
  {
    id: 'tokyo-bay',
    cityName: 'Tokyo',
    country: 'Japan',
    coordinates: '35.6762° N, 139.6503° E',
    image: '/src/assets/images/map_tokyo_carto_1791915087818.jpg',
    parcelCount: '32,100 Parcels',
    layers: 'Rail Transit Network · Coastal Bathymetry · 3D Terrain',
    accent: '#10b981',
  },
  {
    id: 'london-core',
    cityName: 'London',
    country: 'United Kingdom',
    coordinates: '51.5072° N, 0.1276° W',
    image: '/src/assets/images/map_london_carto_1791915087785.jpg',
    parcelCount: '24,600 Parcels',
    layers: 'River Thames Curves · Historic Envelopes · Urban Fabric',
    accent: '#16a34a',
  },
  {
    id: 'cologne-radial',
    cityName: 'Cologne / Paris',
    country: 'Germany / France',
    coordinates: '50.9375° N, 6.9603° E',
    image: '/src/assets/images/map_cologne_carto_1791915088536.jpg',
    parcelCount: '19,800 Parcels',
    layers: 'Radial Boulevards · Riverfront Promenade · Medieval Core',
    accent: '#15803d',
  },
];

export interface MassLabTool {
  id: string;
  name: string;
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
    kicker: 'Probaho Integrated Platform',
    headline: 'All Projects in One Place',
    meta: 'Site analysis · color combinations · laser cutting · global data',
    description: 'Do it all here, with a single account.',
    ctaText: 'Start project →',
    iconType: 'masslabs',
  },
  {
    id: 'archimap',
    name: 'archiMap',
    kicker: 'Probaho Site Intelligence',
    headline: 'Site Analysis',
    meta: '195 countries · 100+ layers · 350+ datasets · building data 8+ · parcel data 5+ · true-width roads · 3D terrain',
    description: 'Finish your whole site analysis on a single page.',
    ctaText: 'Start archiMap →',
    iconType: 'archimap',
  },
  {
    id: 'cologram',
    name: 'Colorgram',
    kicker: 'Urban Chromatic Analysis',
    headline: 'Color & Fabric Analysis',
    meta: '80+ micro-palettes · heritage zoning rules · daylight simulation · facade reflectance',
    description: 'Extract contextual urban color identities and solar interaction matrices in seconds.',
    ctaText: 'Launch Colorgram →',
    iconType: 'cologram',
  },
  {
    id: 'laserfish',
    name: 'LaserFish',
    kicker: 'Automated Laser-Cut Drawings',
    headline: 'Model Making & Laser-Cut Drawings',
    meta: 'Automatic contour slicing · kerf tolerance 0.05mm · DXF/SVG flattening · finger-joint generation',
    description: 'Turn 3D architectural topography into production-ready laser-cut drawings in minutes.',
    ctaText: 'Explore LaserFish →',
    iconType: 'laserfish',
  },
  {
    id: 'globee',
    name: 'Globee',
    kicker: 'Planetary Systems Intelligence',
    headline: 'Global Earth Datasets',
    meta: 'Population & society · terrain · climate · atmosphere · 50+ planetary datasets from everyday life to outer space',
    description: 'Become a bee and explore data from every corner of the Earth.',
    ctaText: 'Open Globee →',
    iconType: 'globee',
  },
];

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
    name: 'Starter',
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Essential site analysis and basic 2D parcel vectors for students & individual researchers.',
    features: [
      '195 countries base coverage',
      'Standard 2D map views',
      'Up to 10 basic GIS layer types',
      'Standard resolution SVG / PNG export',
      'Community knowledge base access',
    ],
    cta: 'Get Started Free',
  },
  {
    id: 'pro',
    name: 'Pro Architect',
    badge: 'MOST POPULAR',
    monthlyPrice: 24,
    annualPrice: 19,
    popular: true,
    description: 'Comprehensive 3D site modeling, full building footprints, and unlimited laser-cut DXF exports.',
    features: [
      'Full 3D terrain & building height data (LOD 2)',
      'Cadastral parcel boundaries & true-width roads',
      'LaserFish automated contour slicing plug-in',
      'Cologram urban chromatic analysis',
      'Unlimited vector DXF, GeoJSON & Rhino exports',
      'High-precision EPSG projection re-mapping',
    ],
    cta: 'Start 14-Day Pro Trial',
  },
  {
    id: 'studio',
    name: 'Studio Team',
    monthlyPrice: 69,
    annualPrice: 55,
    description: 'For architecture practices, urban design studios, and university faculties.',
    features: [
      'Everything in Pro Architect',
      '5 Studio seats included with centralized billing',
      'Live collaborative site analysis sessions',
      'Custom shapefile and GeoTIFF upload support',
      'Globee 50+ planetary environmental datasets',
      'Priority server queue for ultra-dense metropolitan exports',
      'Dedicated technical support architect',
    ],
    cta: 'Commission Studio License',
  },
];
