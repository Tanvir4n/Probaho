/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Probaho — Official Bangladesh National Cadastral & Threat Radar GeoJSON Dataset
 * Authentic Administrative Divisions (ADM1) via geoBoundaries, 64 Districts,
 * Major River Networks, Bay of Bengal Bathymetry, and Regional Cadastral Hubs.
 */

import bangladeshAdm1Json from './bangladeshAdm1Real.json';

export interface NationalHub {
  id: string;
  name: string;
  nameBn: string;
  divisionId: string;
  coordinates: [number, number]; // [lng, lat]
  riskScore: number; // 0 - 100
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  activeDisputes: number;
  threatVector: string;
  threatVectorBn: string;
  subRegistryCount: number;
  preventedCr: number;
  isLocked?: boolean;
}

export interface DivisionProfile {
  id: string;
  name: string;
  nameBn: string;
  center: [number, number]; // [lng, lat]
  labelOffset?: [number, number];
  riskScore: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  activeDisputes: number;
  threatVector: string;
  threatVectorBn: string;
  color: string; // Vibrant authentic color from official division map
  radarColor: string; // Tactical cybernetic radar color
  areaKm2: number;
  populationM: number;
}

export interface BangladeshDistrict {
  id: string;
  name: string;
  nameBn: string;
  divisionId: string;
  coordinates: [number, number]; // [lng, lat]
  riskScore: number;
  activeDisputes: number;
  anchor?: 'start' | 'middle' | 'end';
  dx?: number;
  dy?: number;
}

/**
 * 8 Official Administrative Divisions of Bangladesh
 * Colors matching the authentic national administrative map:
 * Rangpur (Grass Green), Rajshahi (Coral Salmon Red), Mymensingh (Golden Amber),
 * Sylhet (Lime Green), Dhaka (Deep Forest Green), Khulna (Sunny Yellow),
 * Barishal (Mint Seafoam Teal), Chittagong (Crimson Red).
 */
export const BANGLADESH_DIVISIONS: DivisionProfile[] = [
  {
    id: 'barishal',
    name: 'Barishal',
    nameBn: 'বরিশাল',
    center: [90.48, 22.52],
    labelOffset: [0, 0],
    riskScore: 88,
    riskLevel: 'CRITICAL',
    activeDisputes: 428,
    threatVector: 'MULE_RING / CHAR ALLUVION',
    threatVectorBn: 'বেনামি চক্র ও চর বন্দোবস্ত জালিয়াতি',
    color: '#2dd4bf', // Mint seafoam teal from reference map
    radarColor: '#ef4444',
    areaKm2: 13297,
    populationM: 9.3,
  },
  {
    id: 'chittagong',
    name: 'Chittagong',
    nameBn: 'চট্টগ্রাম',
    center: [92.05, 22.35],
    labelOffset: [0, 0],
    riskScore: 38,
    riskLevel: 'MEDIUM',
    activeDisputes: 182,
    threatVector: 'COASTAL LEASE & HILL TRACT',
    threatVectorBn: 'উপকূলীয় লিজ ও পাহাড় শ্রেণি রূপান্তর',
    color: '#dc2626', // Deep crimson red from reference map
    radarColor: '#10b981',
    areaKm2: 33771,
    populationM: 33.2,
  },
  {
    id: 'dhaka',
    name: 'Dhaka',
    nameBn: 'ঢাকা',
    center: [90.18, 23.95],
    labelOffset: [0, 0],
    riskScore: 28,
    riskLevel: 'LOW',
    activeDisputes: 312,
    threatVector: 'CONCURRENT DOUBLE-SALE',
    threatVectorBn: 'সমসাময়িক দ্বৈত দলিল ও বহু-সাবরেজিস্ট্রি জাল',
    color: '#059669', // Rich Forest green from reference map
    radarColor: '#3b82f6',
    areaKm2: 20594,
    populationM: 44.2,
  },
  {
    id: 'khulna',
    name: 'Khulna',
    nameBn: 'খুলনা',
    center: [89.32, 22.90],
    labelOffset: [0, 0],
    riskScore: 42,
    riskLevel: 'MEDIUM',
    activeDisputes: 164,
    threatVector: 'WETLAND & MANGROVE BUFFER',
    threatVectorBn: 'সুন্দরবন বাফার ও জলাভূমি খাস দখল',
    color: '#eab308', // Sunny golden yellow from reference map
    radarColor: '#06b6d4',
    areaKm2: 22285,
    populationM: 17.4,
  },
  {
    id: 'mymensingh',
    name: 'Mymensingh',
    nameBn: 'ময়মনসিংহ',
    center: [90.30, 24.96],
    labelOffset: [0, 0],
    riskScore: 25,
    riskLevel: 'LOW',
    activeDisputes: 92,
    threatVector: 'HEIRSHIP WARISAN DISPUTE',
    threatVectorBn: 'ওয়ারিশ গোপন ও নামজারি টেম্পারিং',
    color: '#fbbf24', // Golden amber yellow from reference map
    radarColor: '#3b82f6',
    areaKm2: 10584,
    populationM: 12.3,
  },
  {
    id: 'rajshahi',
    name: 'Rajshahi',
    nameBn: 'রাজশাহী',
    center: [88.95, 24.58],
    labelOffset: [0, 0],
    riskScore: 22,
    riskLevel: 'LOW',
    activeDisputes: 84,
    threatVector: 'PADMA RIVER BED CHAR',
    threatVectorBn: 'পদ্মা চর সিকস্তি-পয়স্তি দাগ বিরোধ',
    color: '#f87171', // Coral salmon red from reference map
    radarColor: '#3b82f6',
    areaKm2: 18174,
    populationM: 20.4,
  },
  {
    id: 'rangpur',
    name: 'Rangpur',
    nameBn: 'রংপুর',
    center: [89.05, 25.75],
    labelOffset: [0, 0],
    riskScore: 19,
    riskLevel: 'LOW',
    activeDisputes: 72,
    threatVector: 'CS-SA BOUNDARY VARIANCE',
    threatVectorBn: 'সিএস-এসএ নকশা সীমানা অসামঞ্জস্য',
    color: '#16a34a', // Bright grass green from reference map
    radarColor: '#10b981',
    areaKm2: 16185,
    populationM: 17.6,
  },
  {
    id: 'sylhet',
    name: 'Sylhet',
    nameBn: 'সিলেট',
    center: [91.68, 24.75],
    labelOffset: [0, 0],
    riskScore: 54,
    riskLevel: 'MEDIUM',
    activeDisputes: 196,
    threatVector: 'EXPAT TITLE THEFT',
    threatVectorBn: 'প্রবাসী ভূমি আত্মসাৎ ও ভুয়া আমমোক্তারনামা',
    color: '#84cc16', // Vibrant lime green from reference map
    radarColor: '#f59e0b',
    areaKm2: 12596,
    populationM: 12.1,
  },
];

/**
 * All 64 Districts of Bangladesh with exact WGS84 geographic coordinates,
 * authentic Bengali names, and zero-collision typographic placement
 * matching the official administrative atlas.
 */
export const BANGLADESH_DISTRICTS: BangladeshDistrict[] = [
  // Rangpur Division (8)
  { id: 'panchagarh', name: 'Panchagarh', nameBn: 'পঞ্চগড়', divisionId: 'rangpur', coordinates: [88.5567, 26.3333], riskScore: 18, activeDisputes: 14, anchor: 'middle', dx: 0, dy: -8 },
  { id: 'thakurgaon', name: 'Thakurgaon', nameBn: 'ঠাকুরগাঁও', divisionId: 'rangpur', coordinates: [88.4684, 26.0333], riskScore: 21, activeDisputes: 18, anchor: 'end', dx: -6, dy: 3 },
  { id: 'dinajpur', name: 'Dinajpur', nameBn: 'দিনাজপুর', divisionId: 'rangpur', coordinates: [88.6355, 25.6217], riskScore: 24, activeDisputes: 30, anchor: 'end', dx: -6, dy: 3 },
  { id: 'nilphamari', name: 'Nilphamari', nameBn: 'নীলফামারী', divisionId: 'rangpur', coordinates: [88.9416, 25.9333], riskScore: 19, activeDisputes: 15, anchor: 'middle', dx: 0, dy: -7 },
  { id: 'lalmonirhat', name: 'Lalmonirhat', nameBn: 'লালমনিরহাট', divisionId: 'rangpur', coordinates: [89.2833, 25.9167], riskScore: 22, activeDisputes: 19, anchor: 'start', dx: 6, dy: -3 },
  { id: 'rangpur-dist', name: 'Rangpur', nameBn: 'রংপুর', divisionId: 'rangpur', coordinates: [89.2452, 25.7439], riskScore: 19, activeDisputes: 42, anchor: 'start', dx: 6, dy: 8 },
  { id: 'kurigram', name: 'Kurigram', nameBn: 'কুড়িগ্রাম', divisionId: 'rangpur', coordinates: [89.6500, 25.8000], riskScore: 26, activeDisputes: 28, anchor: 'start', dx: 6, dy: 3 },
  { id: 'gaibandha', name: 'Gaibandha', nameBn: 'গাইবান্ধা', divisionId: 'rangpur', coordinates: [89.5333, 25.3333], riskScore: 23, activeDisputes: 22, anchor: 'start', dx: 6, dy: 3 },

  // Rajshahi Division (8)
  { id: 'joypurhat', name: 'Joypurhat', nameBn: 'জয়পুরহাট', divisionId: 'rajshahi', coordinates: [89.0278, 25.1000], riskScore: 20, activeDisputes: 16, anchor: 'middle', dx: 0, dy: -7 },
  { id: 'bogura-dist', name: 'Bogura', nameBn: 'বগুড়া', divisionId: 'rajshahi', coordinates: [89.3777, 24.8465], riskScore: 31, activeDisputes: 38, anchor: 'start', dx: 6, dy: 3 },
  { id: 'naogaon', name: 'Naogaon', nameBn: 'নওগাঁ', divisionId: 'rajshahi', coordinates: [88.9500, 24.8167], riskScore: 23, activeDisputes: 22, anchor: 'end', dx: -6, dy: 3 },
  { id: 'chapai-nawabganj', name: 'Chapai Nawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ', divisionId: 'rajshahi', coordinates: [88.2700, 24.5900], riskScore: 25, activeDisputes: 26, anchor: 'end', dx: -6, dy: 3 },
  { id: 'rajshahi-dist', name: 'Rajshahi', nameBn: 'রাজশাহী', divisionId: 'rajshahi', coordinates: [88.6042, 24.3745], riskScore: 22, activeDisputes: 46, anchor: 'end', dx: -6, dy: 6 },
  { id: 'natore', name: 'Natore', nameBn: 'নাটোর', divisionId: 'rajshahi', coordinates: [88.9833, 24.4167], riskScore: 24, activeDisputes: 25, anchor: 'start', dx: 6, dy: 6 },
  { id: 'sirajganj', name: 'Sirajganj', nameBn: 'সিরাজগঞ্জ', divisionId: 'rajshahi', coordinates: [89.7000, 24.4500], riskScore: 34, activeDisputes: 39, anchor: 'start', dx: 6, dy: 3 },
  { id: 'pabna', name: 'Pabna', nameBn: 'পাবনা', divisionId: 'rajshahi', coordinates: [89.2500, 24.0000], riskScore: 29, activeDisputes: 32, anchor: 'start', dx: 6, dy: -5 },

  // Mymensingh Division (4)
  { id: 'sherpur', name: 'Sherpur', nameBn: 'শেরপুর', divisionId: 'mymensingh', coordinates: [90.0167, 25.0167], riskScore: 22, activeDisputes: 18, anchor: 'end', dx: -6, dy: -4 },
  { id: 'jamalpur', name: 'Jamalpur', nameBn: 'জামালপুর', divisionId: 'mymensingh', coordinates: [89.9500, 24.9167], riskScore: 27, activeDisputes: 31, anchor: 'end', dx: -6, dy: 6 },
  { id: 'mymensingh-dist', name: 'Mymensingh', nameBn: 'ময়মনসিংহ', divisionId: 'mymensingh', coordinates: [90.4203, 24.7471], riskScore: 25, activeDisputes: 92, anchor: 'start', dx: 6, dy: 6 },
  { id: 'netrokona', name: 'Netrokona', nameBn: 'নেত্রকোনা', divisionId: 'mymensingh', coordinates: [90.7333, 24.8833], riskScore: 26, activeDisputes: 24, anchor: 'start', dx: 6, dy: 3 },

  // Sylhet Division (4)
  { id: 'sunamganj-dist', name: 'Sunamganj', nameBn: 'সুনামগঞ্জ', divisionId: 'sylhet', coordinates: [91.4000, 25.0667], riskScore: 48, activeDisputes: 72, anchor: 'middle', dx: 0, dy: -7 },
  { id: 'sylhet-dist', name: 'Sylhet', nameBn: 'সিলেট', divisionId: 'sylhet', coordinates: [91.8687, 24.8949], riskScore: 54, activeDisputes: 124, anchor: 'start', dx: 6, dy: -2 },
  { id: 'moulvibazar', name: 'Moulvibazar', nameBn: 'মৌলভীবাজার', divisionId: 'sylhet', coordinates: [91.7667, 24.4833], riskScore: 44, activeDisputes: 52, anchor: 'start', dx: 6, dy: 6 },
  { id: 'habiganj', name: 'Habiganj', nameBn: 'হবিগঞ্জ', divisionId: 'sylhet', coordinates: [91.4167, 24.3833], riskScore: 38, activeDisputes: 44, anchor: 'end', dx: -6, dy: 3 },

  // Dhaka Division (13)
  { id: 'tangail', name: 'Tangail', nameBn: 'টাঙ্গাইল', divisionId: 'dhaka', coordinates: [89.9167, 24.2500], riskScore: 32, activeDisputes: 48, anchor: 'end', dx: -6, dy: 3 },
  { id: 'kishoreganj', name: 'Kishoreganj', nameBn: 'কিশোরগঞ্জ', divisionId: 'dhaka', coordinates: [90.7833, 24.4333], riskScore: 36, activeDisputes: 54, anchor: 'start', dx: 6, dy: 3 },
  { id: 'manikganj', name: 'Manikganj', nameBn: 'মানিকগঞ্জ', divisionId: 'dhaka', coordinates: [89.9500, 23.8617], riskScore: 30, activeDisputes: 38, anchor: 'end', dx: -6, dy: 3 },
  { id: 'dhaka-dist', name: 'Dhaka', nameBn: 'ঢাকা', divisionId: 'dhaka', coordinates: [90.4125, 23.7500], riskScore: 28, activeDisputes: 312, anchor: 'end', dx: -6, dy: -3 },
  { id: 'gazipur-dist', name: 'Gazipur', nameBn: 'গাজীপুর', divisionId: 'dhaka', coordinates: [90.4264, 24.0023], riskScore: 64, activeDisputes: 98, anchor: 'start', dx: 6, dy: -5 },
  { id: 'narsingdi', name: 'Narsingdi', nameBn: 'নরসিংদী', divisionId: 'dhaka', coordinates: [90.7167, 23.9167], riskScore: 38, activeDisputes: 46, anchor: 'start', dx: 6, dy: 3 },
  { id: 'narayanganj-dist', name: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ', divisionId: 'dhaka', coordinates: [90.5000, 23.6238], riskScore: 58, activeDisputes: 74, anchor: 'start', dx: 6, dy: 3 },
  { id: 'munshiganj', name: 'Munshiganj', nameBn: 'মুন্সীগঞ্জ', divisionId: 'dhaka', coordinates: [90.5333, 23.4500], riskScore: 35, activeDisputes: 42, anchor: 'start', dx: 6, dy: 8 },
  { id: 'rajbari', name: 'Rajbari', nameBn: 'রাজবাড়ী', divisionId: 'dhaka', coordinates: [89.5500, 23.7667], riskScore: 28, activeDisputes: 29, anchor: 'end', dx: -6, dy: 3 },
  { id: 'faridpur', name: 'Faridpur', nameBn: 'ফরিদপুর', divisionId: 'dhaka', coordinates: [89.8333, 23.6000], riskScore: 32, activeDisputes: 41, anchor: 'end', dx: -6, dy: 3 },
  { id: 'madaripur', name: 'Madaripur', nameBn: 'মাদারীপুর', divisionId: 'dhaka', coordinates: [90.1833, 23.1667], riskScore: 33, activeDisputes: 36, anchor: 'end', dx: -6, dy: 3 },
  { id: 'shariatpur', name: 'Shariatpur', nameBn: 'শরীয়তপুর', divisionId: 'dhaka', coordinates: [90.3500, 23.2167], riskScore: 36, activeDisputes: 44, anchor: 'start', dx: 6, dy: 3 },
  { id: 'gopalganj', name: 'Gopalganj', nameBn: 'গোপালগঞ্জ', divisionId: 'dhaka', coordinates: [89.8333, 23.0000], riskScore: 29, activeDisputes: 33, anchor: 'end', dx: -6, dy: 3 },

  // Khulna Division (10)
  { id: 'meherpur', name: 'Meherpur', nameBn: 'মেহেরপুর', divisionId: 'khulna', coordinates: [88.6333, 23.7667], riskScore: 26, activeDisputes: 24, anchor: 'end', dx: -6, dy: 3 },
  { id: 'kushtia', name: 'Kushtia', nameBn: 'কুষ্টিয়া', divisionId: 'khulna', coordinates: [89.1333, 23.9000], riskScore: 34, activeDisputes: 48, anchor: 'start', dx: 6, dy: 5 },
  { id: 'chuadanga', name: 'Chuadanga', nameBn: 'চুয়াডাঙ্গা', divisionId: 'khulna', coordinates: [88.8500, 23.6400], riskScore: 28, activeDisputes: 29, anchor: 'end', dx: -6, dy: 3 },
  { id: 'jhenaidah', name: 'Jhenaidah', nameBn: 'ঝিনাইদহ', divisionId: 'khulna', coordinates: [89.1500, 23.5400], riskScore: 31, activeDisputes: 37, anchor: 'start', dx: 6, dy: 3 },
  { id: 'magura', name: 'Magura', nameBn: 'মাগুরা', divisionId: 'khulna', coordinates: [89.4167, 23.4833], riskScore: 27, activeDisputes: 26, anchor: 'start', dx: 6, dy: 3 },
  { id: 'jashore-dist', name: 'Jashore', nameBn: 'যশোর', divisionId: 'khulna', coordinates: [89.2167, 23.1667], riskScore: 38, activeDisputes: 68, anchor: 'end', dx: -6, dy: -3 },
  { id: 'narail', name: 'Narail', nameBn: 'নড়াইল', divisionId: 'khulna', coordinates: [89.5000, 23.1667], riskScore: 25, activeDisputes: 23, anchor: 'start', dx: 6, dy: 3 },
  { id: 'satkhira', name: 'Satkhira', nameBn: 'সাতক্ষীরা', divisionId: 'khulna', coordinates: [89.0833, 22.7167], riskScore: 46, activeDisputes: 62, anchor: 'end', dx: -6, dy: 3 },
  { id: 'khulna-dist', name: 'Khulna', nameBn: 'খুলনা', divisionId: 'khulna', coordinates: [89.5500, 22.8167], riskScore: 42, activeDisputes: 96, anchor: 'start', dx: 6, dy: 3 },
  { id: 'bagerhat', name: 'Bagerhat', nameBn: 'বাগেরহাট', divisionId: 'khulna', coordinates: [89.7833, 22.6500], riskScore: 49, activeDisputes: 72, anchor: 'end', dx: -6, dy: 3 },

  // Barishal Division (6)
  { id: 'pirojpur', name: 'Pirojpur', nameBn: 'পিরোজপুর', divisionId: 'barishal', coordinates: [89.9833, 22.5833], riskScore: 56, activeDisputes: 58, anchor: 'start', dx: 6, dy: 3 },
  { id: 'jhalakathi', name: 'Jhalakathi', nameBn: 'ঝালকাঠি', divisionId: 'barishal', coordinates: [90.2000, 22.6400], riskScore: 52, activeDisputes: 46, anchor: 'end', dx: -6, dy: -4 },
  { id: 'barishal-dist', name: 'Barishal', nameBn: 'বরিশাল', divisionId: 'barishal', coordinates: [90.3667, 22.7000], riskScore: 82, activeDisputes: 112, anchor: 'start', dx: 6, dy: -3 },
  { id: 'barguna-dist', name: 'Barguna', nameBn: 'বরগুনা', divisionId: 'barishal', coordinates: [90.1333, 22.1667], riskScore: 79, activeDisputes: 64, anchor: 'end', dx: -6, dy: 3 },
  { id: 'patuakhali-dist', name: 'Patuakhali', nameBn: 'পটুয়াখালী', divisionId: 'barishal', coordinates: [90.3333, 22.3667], riskScore: 88, activeDisputes: 178, anchor: 'start', dx: 6, dy: 5 },
  { id: 'bhola-dist', name: 'Bhola', nameBn: 'ভোলা', divisionId: 'barishal', coordinates: [90.6500, 22.6833], riskScore: 68, activeDisputes: 48, anchor: 'start', dx: 6, dy: 3 },

  // Chittagong Division (11)
  { id: 'brahmanbaria', name: 'Brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া', divisionId: 'chittagong', coordinates: [91.1167, 23.9500], riskScore: 35, activeDisputes: 48, anchor: 'start', dx: 6, dy: 3 },
  { id: 'cumilla-dist', name: 'Cumilla', nameBn: 'কুমিল্লা', divisionId: 'chittagong', coordinates: [91.1833, 23.4667], riskScore: 36, activeDisputes: 58, anchor: 'start', dx: 6, dy: 3 },
  { id: 'chandpur', name: 'Chandpur', nameBn: 'চাঁদপুর', divisionId: 'chittagong', coordinates: [90.6667, 23.2333], riskScore: 38, activeDisputes: 49, anchor: 'end', dx: -6, dy: 3 },
  { id: 'lakshmipur', name: 'Lakshmipur', nameBn: 'লক্ষ্মীপুর', divisionId: 'chittagong', coordinates: [90.8333, 22.9500], riskScore: 42, activeDisputes: 52, anchor: 'end', dx: -6, dy: 3 },
  { id: 'noakhali', name: 'Noakhali', nameBn: 'নোয়াখালী', divisionId: 'chittagong', coordinates: [91.1000, 22.8667], riskScore: 46, activeDisputes: 64, anchor: 'start', dx: 6, dy: 3 },
  { id: 'feni', name: 'Feni', nameBn: 'ফেনী', divisionId: 'chittagong', coordinates: [91.4000, 23.0167], riskScore: 34, activeDisputes: 38, anchor: 'start', dx: 6, dy: 3 },
  { id: 'khagrachhari', name: 'Khagrachhari', nameBn: 'খাগড়াছড়ি', divisionId: 'chittagong', coordinates: [91.9667, 23.1167], riskScore: 45, activeDisputes: 52, anchor: 'start', dx: 6, dy: 3 },
  { id: 'rangamati', name: 'Rangamati', nameBn: 'রাঙ্গামাটি', divisionId: 'chittagong', coordinates: [92.1833, 22.6500], riskScore: 41, activeDisputes: 46, anchor: 'start', dx: 6, dy: 3 },
  { id: 'chattogram-dist', name: 'Chattogram', nameBn: 'চট্টগ্রাম', divisionId: 'chittagong', coordinates: [91.8333, 22.3333], riskScore: 38, activeDisputes: 122, anchor: 'end', dx: -6, dy: 3 },
  { id: 'bandarban', name: 'Bandarban', nameBn: 'বান্দরবান', divisionId: 'chittagong', coordinates: [92.2167, 22.1833], riskScore: 43, activeDisputes: 44, anchor: 'start', dx: 6, dy: 3 },
  { id: 'coxs-bazar-dist', name: 'Cox\'s Bazar', nameBn: 'কক্সবাজার', divisionId: 'chittagong', coordinates: [92.0000, 21.4333], riskScore: 71, activeDisputes: 86, anchor: 'start', dx: 6, dy: 3 },
];

/**
 * Key National Hub Nodes (Primary Focus for Risk Analytics & Threat Radar)
 */
export const NATIONAL_HUBS: NationalHub[] = [
  // Barishal Division Hubs (Primary Threat Focus)
  {
    id: 'patuakhali',
    name: 'Patuakhali',
    nameBn: 'পটুয়াখালী',
    divisionId: 'barishal',
    coordinates: [90.3299, 22.3596],
    riskScore: 88,
    riskLevel: 'CRITICAL',
    activeDisputes: 178,
    threatVector: 'MULE_RING',
    threatVectorBn: 'বেনামি সিন্ডিকেট চক্র',
    subRegistryCount: 8,
    preventedCr: 84.6,
    isLocked: true,
  },
  {
    id: 'barishal-sadar',
    name: 'Barishal Sadar',
    nameBn: 'বরিশাল সদর',
    divisionId: 'barishal',
    coordinates: [90.3535, 22.7010],
    riskScore: 82,
    riskLevel: 'CRITICAL',
    activeDisputes: 112,
    threatVector: 'DOUBLE_SALE',
    threatVectorBn: 'দ্বৈত দলিল প্রতারণা',
    subRegistryCount: 10,
    preventedCr: 62.4,
  },
  {
    id: 'barguna',
    name: 'Barguna',
    nameBn: 'বরগুনা',
    divisionId: 'barishal',
    coordinates: [90.1256, 22.1587],
    riskScore: 79,
    riskLevel: 'HIGH',
    activeDisputes: 64,
    threatVector: 'COASTAL_KHAS',
    threatVectorBn: 'উপকূলীয় খাস জমি দখল',
    subRegistryCount: 6,
    preventedCr: 38.2,
  },
  {
    id: 'galachipa',
    name: 'Galachipa',
    nameBn: 'গলাচিপা',
    divisionId: 'barishal',
    coordinates: [90.4206, 22.1639],
    riskScore: 74,
    riskLevel: 'HIGH',
    activeDisputes: 52,
    threatVector: 'CHAR_ALLUVION',
    threatVectorBn: 'চর পয়স্তি খতিয়ান জাল',
    subRegistryCount: 4,
    preventedCr: 29.8,
  },
  {
    id: 'bhola',
    name: 'Bhola',
    nameBn: 'ভোলা',
    divisionId: 'barishal',
    coordinates: [90.6481, 22.6859],
    riskScore: 68,
    riskLevel: 'HIGH',
    activeDisputes: 48,
    threatVector: 'ISLAND_DISPUTE',
    threatVectorBn: 'দ্বীপ মৌজা সীমানা বিরোধ',
    subRegistryCount: 7,
    preventedCr: 33.5,
  },

  // Dhaka Division Hubs
  {
    id: 'dhaka-metro',
    name: 'Dhaka Metro',
    nameBn: 'ঢাকা মেট্রো',
    divisionId: 'dhaka',
    coordinates: [90.4125, 23.8103],
    riskScore: 28,
    riskLevel: 'LOW',
    activeDisputes: 312,
    threatVector: 'CONCURRENT_SALE',
    threatVectorBn: 'সাবরেজিস্ট্রি দ্বৈত বিক্রয়',
    subRegistryCount: 18,
    preventedCr: 584.1,
  },
  {
    id: 'gazipur',
    name: 'Gazipur',
    nameBn: 'গাজীপুর',
    divisionId: 'dhaka',
    coordinates: [90.4264, 24.0023],
    riskScore: 64,
    riskLevel: 'MEDIUM',
    activeDisputes: 98,
    threatVector: 'INDUSTRIAL_ENCROACH',
    threatVectorBn: 'শিল্পায়ন বনভূমি আত্মসাৎ',
    subRegistryCount: 5,
    preventedCr: 76.2,
  },
  {
    id: 'narayanganj',
    name: 'Narayanganj',
    nameBn: 'নারায়ণগঞ্জ',
    divisionId: 'dhaka',
    coordinates: [90.5000, 23.6238],
    riskScore: 58,
    riskLevel: 'MEDIUM',
    activeDisputes: 74,
    threatVector: 'RIVER_FRONT_KHAS',
    threatVectorBn: 'শীতলক্ষ্যা নদী তীর দখল',
    subRegistryCount: 5,
    preventedCr: 52.8,
  },
  {
    id: 'cumilla',
    name: 'Cumilla',
    nameBn: 'কুমিল্লা',
    divisionId: 'chittagong',
    coordinates: [91.1788, 23.4682],
    riskScore: 36,
    riskLevel: 'LOW',
    activeDisputes: 58,
    threatVector: 'HEIR_CONCEALMENT',
    threatVectorBn: 'ওয়ারিশ সনদ গোপন',
    subRegistryCount: 16,
    preventedCr: 39.4,
  },

  // Sylhet Division Hubs
  {
    id: 'sylhet-sadar',
    name: 'Sylhet Sadar',
    nameBn: 'সিলেট সদর',
    divisionId: 'sylhet',
    coordinates: [91.8687, 24.8949],
    riskScore: 54,
    riskLevel: 'MEDIUM',
    activeDisputes: 124,
    threatVector: 'EXPAT_THEFT',
    threatVectorBn: 'প্রবাসী মালিকানা জালিয়াতি',
    subRegistryCount: 12,
    preventedCr: 94.2,
  },
  {
    id: 'sunamganj',
    name: 'Sunamganj',
    nameBn: 'সুনামগঞ্জ',
    divisionId: 'sylhet',
    coordinates: [91.3950, 25.0658],
    riskScore: 48,
    riskLevel: 'MEDIUM',
    activeDisputes: 72,
    threatVector: 'HAOR_WETLAND',
    threatVectorBn: 'হাওর জলমহাল ও খাস জমি',
    subRegistryCount: 11,
    preventedCr: 41.0,
  },

  // Mymensingh Division Hubs
  {
    id: 'mymensingh-sadar',
    name: 'Mymensingh Sadar',
    nameBn: 'ময়মনসিংহ সদর',
    divisionId: 'mymensingh',
    coordinates: [90.4203, 24.7471],
    riskScore: 25,
    riskLevel: 'LOW',
    activeDisputes: 92,
    threatVector: 'MUTATION_GAP',
    threatVectorBn: 'নামজারি ধারাবাহিকতা ত্রুটি',
    subRegistryCount: 13,
    preventedCr: 34.5,
  },

  // Rajshahi Division Hubs
  {
    id: 'rajshahi-sadar',
    name: 'Rajshahi Sadar',
    nameBn: 'রাজশাহী সদর',
    divisionId: 'rajshahi',
    coordinates: [88.6042, 24.3745],
    riskScore: 22,
    riskLevel: 'LOW',
    activeDisputes: 46,
    threatVector: 'PADMA_CHAR',
    threatVectorBn: 'পদ্মা নদী তীরবর্তী জমি',
    subRegistryCount: 10,
    preventedCr: 28.1,
  },
  {
    id: 'bogura',
    name: 'Bogura',
    nameBn: 'বগুড়া',
    divisionId: 'rajshahi',
    coordinates: [89.3777, 24.8465],
    riskScore: 31,
    riskLevel: 'LOW',
    activeDisputes: 38,
    threatVector: 'DAG_SPLIT_OVERLAP',
    threatVectorBn: 'দাগ বিভাজন নকশা গরমিল',
    subRegistryCount: 12,
    preventedCr: 24.6,
  },

  // Rangpur Division Hubs
  {
    id: 'rangpur-sadar',
    name: 'Rangpur Sadar',
    nameBn: 'রংপুর সদর',
    divisionId: 'rangpur',
    coordinates: [89.2752, 25.7439],
    riskScore: 19,
    riskLevel: 'LOW',
    activeDisputes: 42,
    threatVector: 'CS_SA_OVERLAP',
    threatVectorBn: 'সিএস ও এসএ নকশা সীমানা দ্বন্দ্ব',
    subRegistryCount: 8,
    preventedCr: 18.2,
  },
  {
    id: 'dinajpur',
    name: 'Dinajpur',
    nameBn: 'দিনাজপুর',
    divisionId: 'rangpur',
    coordinates: [88.6355, 25.6217],
    riskScore: 24,
    riskLevel: 'LOW',
    activeDisputes: 30,
    threatVector: 'BOUNDARY_DISPUTE',
    threatVectorBn: 'মৌজা সীমানা বিরোধ',
    subRegistryCount: 13,
    preventedCr: 21.0,
  },

  // Khulna Division Hubs
  {
    id: 'khulna-sadar',
    name: 'Khulna Sadar',
    nameBn: 'খুলনা সদর',
    divisionId: 'khulna',
    coordinates: [89.5403, 22.8456],
    riskScore: 42,
    riskLevel: 'MEDIUM',
    activeDisputes: 96,
    threatVector: 'PORT_LAND_FRAUD',
    threatVectorBn: 'মোংলা পোর্ট বেল্ট জমি জালিয়াতি',
    subRegistryCount: 9,
    preventedCr: 55.4,
  },
  {
    id: 'jashore',
    name: 'Jashore',
    nameBn: 'যশোর',
    divisionId: 'khulna',
    coordinates: [89.2081, 23.1664],
    riskScore: 38,
    riskLevel: 'LOW',
    activeDisputes: 68,
    threatVector: 'BORDER_CORRIDOR_DEED',
    threatVectorBn: 'সীমান্তবর্তী মৌজায় জাল দলিল',
    subRegistryCount: 8,
    preventedCr: 32.7,
  },

  // Chittagong Division Hubs
  {
    id: 'chittagong-metro',
    name: 'Chittagong Metro',
    nameBn: 'চট্টগ্রাম মেট্রো',
    divisionId: 'chittagong',
    coordinates: [91.7832, 22.3569],
    riskScore: 38,
    riskLevel: 'LOW',
    activeDisputes: 122,
    threatVector: 'COMMERCIAL_PORT_LEASE',
    threatVectorBn: 'বাণিজ্যিক পোর্ট লিজ ও পাহাড় দখল',
    subRegistryCount: 14,
    preventedCr: 142.0,
  },
  {
    id: 'kutubdia',
    name: 'Kutubdia',
    nameBn: 'কুতুবদিয়া',
    divisionId: 'chittagong',
    coordinates: [91.85, 21.82],
    riskScore: 58,
    riskLevel: 'MEDIUM',
    activeDisputes: 38,
    threatVector: 'ISLAND_KHAS_LEASE',
    threatVectorBn: 'দ্বীপ খাস জমি ইজারা গরমিল',
    subRegistryCount: 3,
    preventedCr: 21.4,
  },
  {
    id: 'coxs-bazar',
    name: 'Cox\'s Bazar',
    nameBn: 'কক্সবাজার',
    divisionId: 'chittagong',
    coordinates: [92.0058, 21.4272],
    riskScore: 71,
    riskLevel: 'HIGH',
    activeDisputes: 86,
    threatVector: 'BEACH_FRONT_FRAUD',
    threatVectorBn: 'সমুদ্র সৈকত সংলগ্ন খাস জমি জাল',
    subRegistryCount: 8,
    preventedCr: 88.5,
  },
];

/**
 * Official Bangladesh Administrative Divisions GeoJSON FeatureCollection
 * Loaded directly from geoBoundaries ADM1.
 */
export const BANGLADESH_GEOJSON: GeoJSON.FeatureCollection<GeoJSON.Geometry, any> = bangladeshAdm1Json as any;

/**
 * Major River Networks of Bangladesh (Curved WGS84 Paths)
 */
export const BANGLADESH_RIVERS = [
  // Padma (Ganges)
  {
    id: 'padma',
    name: 'Padma River',
    nameBn: 'পদ্মা নদী',
    path: [
      [88.20, 24.60],
      [88.60, 24.35],
      [89.05, 24.10],
      [89.45, 23.95],
      [89.75, 23.80],
      [89.90, 23.75],
      [90.35, 23.40],
      [90.65, 23.25],
    ],
  },
  // Jamuna (Brahmaputra)
  {
    id: 'jamuna',
    name: 'Jamuna River',
    nameBn: 'যমুনা নদী',
    path: [
      [89.70, 26.00],
      [89.65, 25.50],
      [89.60, 25.00],
      [89.65, 24.50],
      [89.75, 24.10],
      [89.85, 23.85],
      [89.90, 23.75],
    ],
  },
  // Meghna & Estuary
  {
    id: 'meghna',
    name: 'Meghna River & Estuary',
    nameBn: 'মেঘনা নদী ও মোহনা',
    path: [
      [91.10, 24.60],
      [90.95, 24.15],
      [90.75, 23.75],
      [90.65, 23.25],
      [90.60, 22.85],
      [90.65, 22.40],
      [90.75, 21.80],
    ],
  },
  // Old Brahmaputra
  {
    id: 'old-brahmaputra',
    name: 'Old Brahmaputra River',
    nameBn: 'পুরাতন ব্রহ্মপুত্র নদী',
    path: [
      [89.68, 25.15],
      [89.95, 24.95],
      [90.40, 24.75],
      [90.65, 24.45],
      [90.95, 24.05],
    ],
  },
  // Surma River (Sylhet Basin)
  {
    id: 'surma',
    name: 'Surma River',
    nameBn: 'সুরমা নদী',
    path: [
      [92.35, 24.90],
      [91.85, 24.90],
      [91.40, 25.05],
      [91.00, 24.60],
    ],
  },
  // Arial Khan & Delta Distributary
  {
    id: 'arial-khan',
    name: 'Arial Khan River',
    nameBn: 'আড়িয়াল খাঁ নদী',
    path: [
      [90.15, 23.50],
      [90.25, 23.15],
      [90.40, 22.80],
      [90.50, 22.50],
    ],
  },
  // Tetulia Channel (West of Bhola Island)
  {
    id: 'tetulia',
    name: 'Tetulia River & Channel',
    nameBn: 'তেঁতুলিয়া নদী ও চ্যানেল',
    path: [
      [90.58, 22.80],
      [90.52, 22.45],
      [90.48, 22.15],
      [90.52, 21.85],
    ],
  },
  // Rupsha - Pasur River (Khulna & Sundarbans)
  {
    id: 'rupsha-pasur',
    name: 'Rupsha - Pasur River',
    nameBn: 'রূপসা-পশুর নদী',
    path: [
      [89.55, 23.00],
      [89.58, 22.75],
      [89.55, 22.40],
      [89.58, 22.00],
      [89.60, 21.75],
    ],
  },
  // Teesta River
  {
    id: 'teesta',
    name: 'Teesta River',
    nameBn: 'তিস্তা নদী',
    path: [
      [89.00, 26.20],
      [89.20, 25.95],
      [89.50, 25.70],
      [89.65, 25.50],
    ],
  },
  // Karnaphuli River
  {
    id: 'karnaphuli',
    name: 'Karnaphuli River',
    nameBn: 'কর্ণফুলী নদী',
    path: [
      [92.25, 22.65],
      [92.00, 22.45],
      [91.85, 22.30],
      [91.75, 22.20],
    ],
  },
];

/**
 * Bay of Bengal Bathymetry & Oceanic Landmarks
 */
export const BAY_OF_BENGAL_FEATURES = {
  shelf20m: [
    [89.00, 21.40],
    [89.50, 21.35],
    [90.20, 21.45],
    [90.80, 21.40],
    [91.50, 21.50],
    [92.00, 21.10],
  ],
  isobath50m: [
    [89.00, 21.05],
    [89.60, 20.90],
    [90.30, 21.00],
    [91.00, 20.95],
    [91.70, 21.00],
    [92.15, 20.60],
  ],
  swatchOfNoGround: {
    center: [89.30, 21.25], // [lng, lat]
    label: 'SWATCH OF NO GROUND',
    labelBn: 'সোয়াচ অব নো গ্রাউন্ড',
    depthM: 1340,
  },
  dublarChar: {
    center: [89.55, 21.75],
    label: 'Dublar Char',
    labelBn: 'দুবলার চর',
  },
  riverAnnotations: [
    { name: 'Jamuna (Brahmaputra)', nameBn: 'যমুনা (ব্রহ্মপুত্র)', coords: [89.65, 24.85] },
    { name: 'Meghna (Upper & Lower)', nameBn: 'মেঘনা (উচ্চ ও নিম্ন)', coords: [90.65, 23.10] },
    { name: 'Padma River', nameBn: 'পদ্মা নদী', coords: [89.85, 23.70] },
  ],
};

/**
 * Neighboring Country & Border Labels matching the authentic administrative atlas
 */
export const NEIGHBOR_REGIONS = [
  { name: 'INDIA', nameBn: 'মে ঘাল য় (ভারত)', sub: 'Meghalaya', coords: [90.5, 25.55], align: 'center' },
  { name: 'INDIA', nameBn: 'প শ্চি ম ব ঙ্গ (ভারত)', sub: 'West Bengal', coords: [88.1, 23.8], align: 'right' },
  { name: 'INDIA', nameBn: 'ত্রি পু রা (ভারত)', sub: 'Tripura', coords: [91.75, 23.5], align: 'left' },
  { name: 'INDIA', nameBn: 'আ সাম (ভারত)', sub: 'Assam', coords: [92.6, 24.8], align: 'left' },
  { name: 'INDIA', nameBn: 'মি জো রাম (ভারত)', sub: 'Mizoram', coords: [92.8, 22.9], align: 'left' },
  { name: 'MYANMAR', nameBn: 'মায়ানমার (বার্মা)', sub: 'Burma', coords: [92.65, 21.1], align: 'left' },
];
