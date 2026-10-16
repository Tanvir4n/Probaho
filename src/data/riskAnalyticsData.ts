/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Probaho — Dhaka Land Fraud Risk Analytics & Cadastral Intelligence Dataset
 */

export interface DhakaZoneRiskProfile {
  id: string;
  name: string;
  nameBn: string;
  subRegistry: string;
  subRegistryBn: string;
  riskScore: number; // 0 - 100
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  activeDisputedDags: number;
  totalParcelsAudited: number;
  preventedFraudCr: number; // in Crore BDT
  activeLocksCount: number;
  primaryVector: string;
  primaryVectorBn: string;
  hotspotMouzas: string[];
  hotspotMouzasBn: string[];
  vectors: {
    surveyVariance: number; // CS/RS/BS mismatch
    duplicateRegistration: number; // Double-sale velocity
    powerOfAttorney: number; // Forged am-muktarnama
    mutationTampering: number; // Namzari manipulation
    heirDispute: number; // Warisan discrepancy
    wetlandEncroachment: number; // Khas/river bed filling
  };
  sampleDags: {
    dagNo: string;
    khatianNo: string;
    mouza: string;
    issue: string;
    issueBn: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    detectedAt: string;
    status: 'LOCKED' | 'FLAGGED' | 'RESOLVING';
  }[];
}

export type DateRangePreset = '30d' | '90d' | '6m' | '1y' | 'custom';

export interface TrendDataPoint {
  period: string;
  periodBn: string;
  isoDate?: string;
  dayOfWeek?: string;
  isWeekend?: boolean;
  registryStatus?: string;
  registryStatusBn?: string;
  overallRiskIndex: number;
  zoneRiskIndex?: number;
  doubleSaleIncidents: number;
  mutationTamperingCount: number;
  warisanDisputes: number;
  surveyConflicts: number;
  preventedVolumeCr: number;
  activeLocksCount?: number;
}

export interface FraudTypeDistribution {
  name: string;
  nameBn: string;
  percentage: number;
  valueCr: number;
  color: string;
  description: string;
  descriptionBn: string;
}

export const DHAKA_RISK_ZONES: DhakaZoneRiskProfile[] = [
  {
    id: 'dhanmondi',
    name: 'Dhanmondi',
    nameBn: 'ধানমন্ডি',
    subRegistry: 'Tejgaon & Dhanmondi Sub-Registry',
    subRegistryBn: 'তেজগাঁও ও ধানমন্ডি সাব-রেজিস্ট্রি',
    riskScore: 84,
    riskLevel: 'CRITICAL',
    activeDisputedDags: 312,
    totalParcelsAudited: 2840,
    preventedFraudCr: 142.5,
    activeLocksCount: 14,
    primaryVector: 'Concurrent Double-Sale & Multi-Jurisdiction Registration',
    primaryVectorBn: 'দ্বৈত বিক্রয় ও একাধিক সাব-রেজিস্ট্রি বিরোধ',
    hotspotMouzas: ['Dhanmondi R/A J.L. 245', 'Satmasjid Corridor', 'Kalabagan Mouza'],
    hotspotMouzasBn: ['ধানমন্ডি আ/এ জে.এল. ২৪৫', 'সাতমসজিদ করিডোর', 'কলাবাগান মৌজা'],
    vectors: {
      surveyVariance: 88,
      duplicateRegistration: 94,
      powerOfAttorney: 78,
      mutationTampering: 82,
      heirDispute: 72,
      wetlandEncroachment: 65,
    },
    sampleDags: [
      {
        dagNo: 'CS 1042 / BS 4821',
        khatianNo: 'RS 812',
        mouza: 'Dhanmondi J.L. 245',
        issue: 'Simultaneous deed execution in Dhanmondi & Tejgaon offices within 48h',
        issueBn: '৪৮ ঘণ্টার মধ্যে ধানমন্ডি ও তেজগাঁও অফিসে যুগপৎ দলিল সম্পাদন চেষ্টা',
        severity: 'CRITICAL',
        detectedAt: '2026-09-14',
        status: 'LOCKED',
      },
      {
        dagNo: 'CS 1044 / BS 4829',
        khatianNo: 'RS 815',
        mouza: 'Dhanmondi J.L. 245',
        issue: 'Forged general power of attorney using deceased principal signature',
        issueBn: 'মৃত ব্যক্তির স্বাক্ষর জালিয়াতি করে ভুয়া সাধারণ আমমোক্তারনামা দাখিল',
        severity: 'HIGH',
        detectedAt: '2026-08-28',
        status: 'FLAGGED',
      },
      {
        dagNo: 'CS 910 / BS 3102',
        khatianNo: 'RS 402',
        mouza: 'Kalabagan J.L. 248',
        issue: 'Lakefront setback expansion encroaching onto public municipal drainage',
        issueBn: 'লেকফ্রন্ট বাফার জোন দখল ও সিটি ড্রেন অপসারণ বিরোধ',
        severity: 'MEDIUM',
        detectedAt: '2026-08-11',
        status: 'RESOLVING',
      },
    ],
  },
  {
    id: 'old-dhaka',
    name: 'Old Dhaka (Lalbagh & Kotwali)',
    nameBn: 'পুরান ঢাকা (লালবাগ ও কোতোয়ালি)',
    subRegistry: 'Sadar Records Sub-Registry',
    subRegistryBn: 'সদর রেকর্ড সাব-রেজিস্ট্রি',
    riskScore: 78,
    riskLevel: 'HIGH',
    activeDisputedDags: 489,
    totalParcelsAudited: 3620,
    preventedFraudCr: 98.2,
    activeLocksCount: 19,
    primaryVector: 'Forged Warisan Heirship & 1940 CS Record Erasures',
    primaryVectorBn: 'ভুয়া ওয়ারিশ সনদ ও ১৯৪০ সিএস রেকর্ড বিলুপ্তি',
    hotspotMouzas: ['Lalbagh Kella Mouza', 'Islampur', 'Armanitola J.L. 112'],
    hotspotMouzasBn: ['লালবাগ কেল্লা মৌজা', 'ইসলামপুর', 'আরমানিটোলা জে.এল. ১১২'],
    vectors: {
      surveyVariance: 92,
      duplicateRegistration: 68,
      powerOfAttorney: 85,
      mutationTampering: 89,
      heirDispute: 91,
      wetlandEncroachment: 32,
    },
    sampleDags: [
      {
        dagNo: 'CS 312 / RS 104',
        khatianNo: 'CS 19',
        mouza: 'Lalbagh J.L. 110',
        issue: 'Omission of 3 legal female heirs in notarized succession certificate',
        issueBn: 'নোটারি ওয়ারিশ সনদে ৩ জন নারী ওয়ারিশকে বেআইনিভাবে বাদ দেওয়া',
        severity: 'CRITICAL',
        detectedAt: '2026-10-02',
        status: 'LOCKED',
      },
      {
        dagNo: 'CS 418 / RS 220',
        khatianNo: 'RS 44',
        mouza: 'Armanitola J.L. 112',
        issue: 'Tampered volume pages in 1962 RS register with non-authentic stamp seal',
        issueBn: '১৯৬২ আরএস রেজিস্টার বালাম বহির পাতা বদল ও জাল সিলমোহর',
        severity: 'HIGH',
        detectedAt: '2026-09-20',
        status: 'FLAGGED',
      },
    ],
  },
  {
    id: 'mohammadpur',
    name: 'Mohammadpur (Bosila & Katasur)',
    nameBn: 'মোহাম্মদপুর (বসিলা ও কাটাসুর)',
    subRegistry: 'Mohammadpur Sub-Registry',
    subRegistryBn: 'মোহাম্মদপুর সাব-রেজিস্ট্রি',
    riskScore: 74,
    riskLevel: 'HIGH',
    activeDisputedDags: 420,
    totalParcelsAudited: 3150,
    preventedFraudCr: 87.4,
    activeLocksCount: 23,
    primaryVector: 'Buriganga Floodplain Encroachment & BS Area Inflation',
    primaryVectorBn: 'বুড়িগঙ্গা প্লাবনভূমি দখল ও বিএস খতিয়ানে জমির পরিমাণ বৃদ্ধি',
    hotspotMouzas: ['Bosila Mouza J.L. 182', 'Katasur Mouza', 'Rayerbazar Embankment'],
    hotspotMouzasBn: ['বসিলা মৌজা জে.এল. ১৮২', 'কাটাসুর মৌজা', 'রায়েরবাজার বেড়িবাঁধ'],
    vectors: {
      surveyVariance: 94,
      duplicateRegistration: 84,
      powerOfAttorney: 62,
      mutationTampering: 76,
      heirDispute: 58,
      wetlandEncroachment: 96,
    },
    sampleDags: [
      {
        dagNo: 'CS 884 / BS 2140',
        khatianNo: 'BS 991',
        mouza: 'Bosila J.L. 182',
        issue: 'Plot boundary inflated from 14.2 shotok (RS) to 22.8 shotok by canal filling',
        issueBn: 'খাল ভরাট করে জমির আয়তন ১৪.২ শতাংশ থেকে ২২.৮ শতাংশে স্ফীতি',
        severity: 'CRITICAL',
        detectedAt: '2026-09-18',
        status: 'LOCKED',
      },
      {
        dagNo: 'CS 672 / RS 941',
        khatianNo: 'RS 120',
        mouza: 'Katasur J.L. 184',
        issue: 'Parallel deeds filed under unapproved housing society layout',
        issueBn: 'অননুমোদিত হাউজিং সোসাইটি প্লট নাম্বারে দ্বৈত দলিল রেজিস্ট্রি চেষ্টা',
        severity: 'HIGH',
        detectedAt: '2026-08-30',
        status: 'FLAGGED',
      },
    ],
  },
  {
    id: 'mirpur',
    name: 'Mirpur (Kallayanpur & Paikpara)',
    nameBn: 'মিরপুর (কল্যাণপুর ও পাইকপাড়া)',
    subRegistry: 'Mirpur Sub-Registry',
    subRegistryBn: 'মিরপুর সাব-রেজিস্ট্রি',
    riskScore: 68,
    riskLevel: 'HIGH',
    activeDisputedDags: 364,
    totalParcelsAudited: 2980,
    preventedFraudCr: 64.1,
    activeLocksCount: 11,
    primaryVector: 'Vested Property (অর্পিত সম্পত্তি) Forged Release Orders',
    primaryVectorBn: 'অর্পিত সম্পত্তি অবমুক্তির ভুয়া প্রজ্ঞাপন ও রেকর্ড জালিয়াতি',
    hotspotMouzas: ['Paikpara J.L. 154', 'Shah Ali Mouza', 'Section 11 Housing'],
    hotspotMouzasBn: ['পাইকপাড়া জে.এল. ১৫৪', 'শাহ আলী মৌজা', 'সেকশন ১১ হাউজিং'],
    vectors: {
      surveyVariance: 75,
      duplicateRegistration: 70,
      powerOfAttorney: 68,
      mutationTampering: 80,
      heirDispute: 64,
      wetlandEncroachment: 54,
    },
    sampleDags: [
      {
        dagNo: 'CS 601 / BS 1842',
        khatianNo: 'RS 314',
        mouza: 'Paikpara J.L. 154',
        issue: 'Vested "Ka" list property claimed via counterfeit 1986 de-listing decree',
        issueBn: 'ভুয়া ১৯৮৬ অবমুক্তি ডিক্রি দিয়ে অর্পিত "ক" তালিকাভুক্ত জমি আত্মসাৎ চেষ্টা',
        severity: 'CRITICAL',
        detectedAt: '2026-09-25',
        status: 'LOCKED',
      },
    ],
  },
  {
    id: 'badda-rampura',
    name: 'Badda & Rampura',
    nameBn: 'বাড্ডা ও রামপুরা',
    subRegistry: 'Badda Sub-Registry',
    subRegistryBn: 'বাড্ডা সাব-রেজিস্ট্রি',
    riskScore: 56,
    riskLevel: 'MEDIUM',
    activeDisputedDags: 245,
    totalParcelsAudited: 2210,
    preventedFraudCr: 49.0,
    activeLocksCount: 8,
    primaryVector: 'Balu River Basin Sub-division & Unregistered Land Fill',
    primaryVectorBn: 'বালু নদী অববাহিকা বিভাজন ও রেকর্ডবিহীন ভরাট জমি বিক্রয়',
    hotspotMouzas: ['Satarkul J.L. 198', 'Beraid Mouza', 'Merul Badda'],
    hotspotMouzasBn: ['সাঁতারকুল জে.এল. ১৯৮', 'বেরাইদ মৌজা', 'মেরুল বাড্ডা'],
    vectors: {
      surveyVariance: 68,
      duplicateRegistration: 55,
      powerOfAttorney: 49,
      mutationTampering: 59,
      heirDispute: 42,
      wetlandEncroachment: 82,
    },
    sampleDags: [
      {
        dagNo: 'CS 440 / BS 1109',
        khatianNo: 'BS 411',
        mouza: 'Satarkul J.L. 198',
        issue: 'Water body demarcation clash with RAJUK Detail Area Plan (DAP)',
        issueBn: 'রাজউক ড্যাপ জলাশয় চিহ্নিতকরণ সীমানার সাথে দাগের সাংঘর্ষিক অবস্থান',
        severity: 'HIGH',
        detectedAt: '2026-09-02',
        status: 'FLAGGED',
      },
    ],
  },
  {
    id: 'tejgaon',
    name: 'Tejgaon',
    nameBn: 'তেজগাঁও',
    subRegistry: 'Tejgaon Sub-Registry',
    subRegistryBn: 'তেজগাঁও সাব-রেজিস্ট্রি',
    riskScore: 48,
    riskLevel: 'MEDIUM',
    activeDisputedDags: 180,
    totalParcelsAudited: 1850,
    preventedFraudCr: 52.3,
    activeLocksCount: 6,
    primaryVector: 'Industrial-to-Commercial Re-zoning Title Gaps',
    primaryVectorBn: 'শিল্প থেকে বাণিজ্যিক প্লট রূপান্তরে নথির অসঙ্গতি',
    hotspotMouzas: ['Tejgaon I/A J.L. 238', 'Begunbari Mouza', 'Nakhalpara'],
    hotspotMouzasBn: ['তেজগাঁও শিল্পাঞ্চল জে.এল. ২৩৮', 'বেগুনবাড়ি মৌজা', 'নাখালপাড়া'],
    vectors: {
      surveyVariance: 52,
      duplicateRegistration: 48,
      powerOfAttorney: 54,
      mutationTampering: 51,
      heirDispute: 38,
      wetlandEncroachment: 30,
    },
    sampleDags: [
      {
        dagNo: 'CS 215 / BS 890',
        khatianNo: 'RS 140',
        mouza: 'Tejgaon I/A J.L. 238',
        issue: 'Unreleased legacy bank mortgage lien dating back to 1994',
        issueBn: '১৯৯৪ সালের অপরিশোধিত ব্যাংক দায়মুক্তির জাল নো-অবজেকশন সনদ',
        severity: 'MEDIUM',
        detectedAt: '2026-08-14',
        status: 'RESOLVING',
      },
    ],
  },
  {
    id: 'gulshan',
    name: 'Gulshan',
    nameBn: 'গুলশান',
    subRegistry: 'Gulshan Sub-Registry',
    subRegistryBn: 'গুলশান সাব-রেজিস্ট্রি',
    riskScore: 36,
    riskLevel: 'MEDIUM',
    activeDisputedDags: 95,
    totalParcelsAudited: 1540,
    preventedFraudCr: 68.0,
    activeLocksCount: 4,
    primaryVector: 'Commercial Long-Lease Sub-letting & RAJUK Approval Clashes',
    primaryVectorBn: 'দীর্ঘমেয়াদি বাণিজ্যিক ইজারা ও রাজউক নকশা অনুমোদন বিরোধ',
    hotspotMouzas: ['Gulshan North J.L. 210', 'Gulshan South', 'Niketan'],
    hotspotMouzasBn: ['গুলশান উত্তর জে.এল. ২১০', 'গুলশান দক্ষিণ', 'নিকেতন'],
    vectors: {
      surveyVariance: 34,
      duplicateRegistration: 38,
      powerOfAttorney: 44,
      mutationTampering: 40,
      heirDispute: 36,
      wetlandEncroachment: 24,
    },
    sampleDags: [
      {
        dagNo: 'CS 108 / BS 512',
        khatianNo: 'BS 219',
        mouza: 'Gulshan North J.L. 210',
        issue: 'Conflicting irrevocable power of attorney granted to 2 competing developers',
        issueBn: 'দুই পৃথক রিয়েল এস্টেট কোম্পানিকে প্রদত্ত পরস্পরবিরোধী আমমোক্তারনামা',
        severity: 'HIGH',
        detectedAt: '2026-09-08',
        status: 'FLAGGED',
      },
    ],
  },
  {
    id: 'uttara',
    name: 'Uttara Model Town',
    nameBn: 'উত্তরা মডেল টাউন',
    subRegistry: 'Uttara Sub-Registry',
    subRegistryBn: 'উত্তরা সাব-রেজিস্ট্রি',
    riskScore: 24,
    riskLevel: 'LOW',
    activeDisputedDags: 88,
    totalParcelsAudited: 2750,
    preventedFraudCr: 21.6,
    activeLocksCount: 3,
    primaryVector: 'Phase 3 Peripheral Allotment Overlaps',
    primaryVectorBn: 'তৃতীয় পর্ব প্রান্তিক প্লট বরাদ্দ ও সীমানা জটিলতা',
    hotspotMouzas: ['Sector 3 Mouza', 'Sector 18 Expansion', 'Turag Approach'],
    hotspotMouzasBn: ['সেক্টর ৩ মৌজা', 'সেক্টর ১৮ সম্প্রসারণ', 'তুরাগ সংযোগ'],
    vectors: {
      surveyVariance: 28,
      duplicateRegistration: 24,
      powerOfAttorney: 29,
      mutationTampering: 22,
      heirDispute: 18,
      wetlandEncroachment: 35,
    },
    sampleDags: [
      {
        dagNo: 'BS 1420',
        khatianNo: 'BS 702',
        mouza: 'Sector 18 Expansion',
        issue: 'Overlapping plot numbering in newly handed-over sector sub-plots',
        issueBn: 'নতুন হস্তান্তরকৃত সাব-প্লটে নম্বর পুনঃব্যবহার সংক্রান্ত আপত্তি',
        severity: 'LOW',
        detectedAt: '2026-07-22',
        status: 'RESOLVING',
      },
    ],
  },
  {
    id: 'banani',
    name: 'Banani',
    nameBn: 'বনানী',
    subRegistry: 'Gulshan Sub-Registry',
    subRegistryBn: 'গুলশান সাব-রেজিস্ট্রি',
    riskScore: 22,
    riskLevel: 'LOW',
    activeDisputedDags: 62,
    totalParcelsAudited: 1290,
    preventedFraudCr: 18.2,
    activeLocksCount: 2,
    primaryVector: 'Multi-Storied Floor Space Title Apportionment',
    primaryVectorBn: 'বহুতল ভবনের ফ্লোর স্পেস বণ্টন দলিল জটিলতা',
    hotspotMouzas: ['Banani Block C', 'Kemal Ataturk Ave', 'Block F'],
    hotspotMouzasBn: ['বনানী ব্লক সি', 'কামাল আতাতুর্ক এভিনিউ', 'ব্লক এফ'],
    vectors: {
      surveyVariance: 22,
      duplicateRegistration: 25,
      powerOfAttorney: 28,
      mutationTampering: 20,
      heirDispute: 21,
      wetlandEncroachment: 15,
    },
    sampleDags: [
      {
        dagNo: 'BS 614',
        khatianNo: 'BS 332',
        mouza: 'Banani Block C',
        issue: 'Undivided rooftop access right sold to external billboard agency',
        issueBn: 'অবিভক্ত ছাদের স্বত্ব তৃতীয় পক্ষের কাছে বেআইনিভাবে বিক্রির চুক্তি',
        severity: 'MEDIUM',
        detectedAt: '2026-08-01',
        status: 'RESOLVING',
      },
    ],
  },
  {
    id: 'motijheel',
    name: 'Motijheel (Commercial Area)',
    nameBn: 'মতিঝিল (বাণিজ্যিক এলাকা)',
    subRegistry: 'Sadar Records Sub-Registry',
    subRegistryBn: 'সদর রেকর্ড সাব-রেজিস্ট্রি',
    riskScore: 18,
    riskLevel: 'LOW',
    activeDisputedDags: 45,
    totalParcelsAudited: 1120,
    preventedFraudCr: 14.8,
    activeLocksCount: 1,
    primaryVector: 'Legacy Trust & Institutional Waqf Mutation Gaps',
    primaryVectorBn: 'ওয়াকফ ও প্রাতিষ্ঠানিক ট্রাস্ট নামজারি নথির দীর্ঘসূত্রিতা',
    hotspotMouzas: ['Dilkusha C/A', 'Arambagh', 'Motijheel J.L. 102'],
    hotspotMouzasBn: ['দিলকুশা বা/এ', 'আরামবাগ', 'মতিঝিল জে.এল. ১০২'],
    vectors: {
      surveyVariance: 19,
      duplicateRegistration: 18,
      powerOfAttorney: 22,
      mutationTampering: 16,
      heirDispute: 15,
      wetlandEncroachment: 8,
    },
    sampleDags: [
      {
        dagNo: 'CS 98 / BS 210',
        khatianNo: 'RS 54',
        mouza: 'Dilkusha C/A J.L. 102',
        issue: 'Trust deed verification pending from Waqf Administrator Directorate',
        issueBn: 'ওয়াকফ প্রশাসক কার্যালয় হতে ট্রাস্ট দলিলের তথ্য যাচাই অপেক্ষমাণ',
        severity: 'LOW',
        detectedAt: '2026-07-10',
        status: 'RESOLVING',
      },
    ],
  },
];

// Historical Trend Data points (Quarterly from 2024 to 2026)
export const DHAKA_FRAUD_TRENDS: TrendDataPoint[] = [
  {
    period: "Q1 '24",
    periodBn: "১ম ত্রৈ '২৪",
    overallRiskIndex: 43.2,
    doubleSaleIncidents: 64,
    mutationTamperingCount: 78,
    warisanDisputes: 52,
    surveyConflicts: 49,
    preventedVolumeCr: 32.4,
  },
  {
    period: "Q2 '24",
    periodBn: "২য় ত্রৈ '২৪",
    overallRiskIndex: 46.5,
    doubleSaleIncidents: 72,
    mutationTamperingCount: 86,
    warisanDisputes: 59,
    surveyConflicts: 54,
    preventedVolumeCr: 39.8,
  },
  {
    period: "Q3 '24",
    periodBn: "৩য় ত্রৈ '২৪",
    overallRiskIndex: 51.0,
    doubleSaleIncidents: 89,
    mutationTamperingCount: 94,
    warisanDisputes: 67,
    surveyConflicts: 61,
    preventedVolumeCr: 54.2,
  },
  {
    period: "Q4 '24",
    periodBn: "৪র্থ ত্রৈ '২৪",
    overallRiskIndex: 54.8,
    doubleSaleIncidents: 104,
    mutationTamperingCount: 112,
    warisanDisputes: 74,
    surveyConflicts: 68,
    preventedVolumeCr: 68.5,
  },
  {
    period: "Q1 '25",
    periodBn: "১ম ত্রৈ '২৫",
    overallRiskIndex: 59.3,
    doubleSaleIncidents: 121,
    mutationTamperingCount: 128,
    warisanDisputes: 86,
    surveyConflicts: 79,
    preventedVolumeCr: 88.0,
  },
  {
    period: "Q2 '25",
    periodBn: "২য় ত্রৈ '২৫",
    overallRiskIndex: 63.7,
    doubleSaleIncidents: 145,
    mutationTamperingCount: 140,
    warisanDisputes: 98,
    surveyConflicts: 88,
    preventedVolumeCr: 112.4,
  },
  {
    period: "Q3 '25",
    periodBn: "৩য় ত্রৈ '২৫",
    overallRiskIndex: 68.2,
    doubleSaleIncidents: 168,
    mutationTamperingCount: 154,
    warisanDisputes: 110,
    surveyConflicts: 95,
    preventedVolumeCr: 146.0,
  },
  {
    period: "Q4 '25",
    periodBn: "৪র্থ ত্রৈ '২৫",
    overallRiskIndex: 64.5,
    doubleSaleIncidents: 152,
    mutationTamperingCount: 138,
    warisanDisputes: 102,
    surveyConflicts: 89,
    preventedVolumeCr: 134.8,
  },
  {
    period: "Q1 '26",
    periodBn: "১ম ত্রৈ '২৬",
    overallRiskIndex: 59.8,
    doubleSaleIncidents: 130,
    mutationTamperingCount: 119,
    warisanDisputes: 91,
    surveyConflicts: 82,
    preventedVolumeCr: 118.2,
  },
  {
    period: "Q2 '26",
    periodBn: "২য় ত্রৈ '২৬",
    overallRiskIndex: 56.4,
    doubleSaleIncidents: 114,
    mutationTamperingCount: 105,
    warisanDisputes: 84,
    surveyConflicts: 74,
    preventedVolumeCr: 99.4,
  },
  {
    period: "Q3 '26",
    periodBn: "৩য় ত্রৈ '২৬",
    overallRiskIndex: 52.1,
    doubleSaleIncidents: 96,
    mutationTamperingCount: 89,
    warisanDisputes: 76,
    surveyConflicts: 65,
    preventedVolumeCr: 81.6,
  },
];

// Fraud Modality Breakdown across Dhaka Metropolitan
export const DHAKA_FRAUD_TYPOLOGIES: FraudTypeDistribution[] = [
  {
    name: 'Concurrent Double-Sale',
    nameBn: 'দ্বৈত বিক্রয় ও সাব-রেজিস্ট্রি বিরোধ',
    percentage: 34,
    valueCr: 198.5,
    color: '#ef4444',
    description: 'Deed executed concurrently at two offices before mutation reflection',
    descriptionBn: 'নামজারি রেকর্ডে ওঠার আগেই দুটি ভিন্ন অফিসে একই দাগের দলিল সম্পাদন',
  },
  {
    name: 'Succession & Warisan Forgery',
    nameBn: 'উত্তরাধিকার ও ওয়ারিশ সনদ জালিয়াতি',
    percentage: 22,
    valueCr: 128.4,
    color: '#f97316',
    description: 'Fraudulent exclusion of legal heirs (daughters, siblings) via fake affidavit',
    descriptionBn: 'ভুয়া এফিডেভিট ও পারিবারিক সনদ দিয়ে আইনি ওয়ারিশদের বাদ দেওয়া',
  },
  {
    name: 'Mutation Ledger Alteration',
    nameBn: 'নামজারি খতিয়ান পাতা বদল ও রেকর্ড টেম্পারিং',
    percentage: 20,
    valueCr: 116.8,
    color: '#eab308',
    description: 'Forged DCR receipts and altered Tehsil manual registers',
    descriptionBn: 'ভুয়া ডিসিআর দাখিলা এবং তহশিল অফিস ম্যানুয়াল বালাম বহির পাতা বদল',
  },
  {
    name: 'Cadastral Survey Discrepancy',
    nameBn: 'মৌজা নকশা ও জরিপ অসঙ্গতি (CS vs RS vs BS)',
    percentage: 15,
    valueCr: 87.6,
    color: '#3b82f6',
    description: 'Area expansion or boundary shift during CS-to-BS revisions',
    descriptionBn: 'সিএস ও আরএস নকশা হতে সিটি জরিপে (বিএস) জমির দাগ ও আয়তন পরিবর্তন',
  },
  {
    name: 'Counterfeit Power of Attorney',
    nameBn: 'ভুয়া আমমোক্তারনামা ও জাল পাওয়ার অফ অ্যাটর্নি',
    percentage: 9,
    valueCr: 52.5,
    color: '#a855f7',
    description: 'Expired, revoked, or non-authentic POA deeds submitted to registries',
    descriptionBn: 'বাতিলকৃত বা মৃত ব্যক্তির নামে জাল আমমোক্তারনামা ব্যবহার',
  },
];

// Citywide Average Radar Baseline
export const DHAKA_AVERAGE_VECTORS = {
  surveyVariance: 58,
  duplicateRegistration: 56,
  powerOfAttorney: 51,
  mutationTampering: 57,
  heirDispute: 49,
  wetlandEncroachment: 45,
};

export interface DynamicTrendConfig {
  preset: DateRangePreset;
  startDate?: string;
  endDate?: string;
  zoneId?: string;
}

export interface TrendAnalysisSummary {
  netChange: number;
  peakDate: string;
  peakScore: number;
  avgScore: number;
  totalPreventedCr: number;
  totalIncidents: number;
  dataPointsCount: number;
  startDateStr: string;
  endDateStr: string;
  resolution: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
}

const BN_MONTHS = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];
const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const BN_DAYS = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];
const EN_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const toBnDigit = (num: number | string): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
};

// Deterministic pseudo-random number based on integer seed
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export function generateDynamicTrendData(config: DynamicTrendConfig): {
  data: TrendDataPoint[];
  summary: TrendAnalysisSummary;
} {
  const referenceDate = new Date('2026-10-16T12:00:00Z');
  let start = new Date(referenceDate);
  let end = new Date(referenceDate);
  let resolution: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' = 'daily';

  if (config.preset === '30d') {
    start.setDate(referenceDate.getDate() - 29);
    resolution = 'daily';
  } else if (config.preset === '90d') {
    start.setDate(referenceDate.getDate() - 89);
    resolution = 'weekly';
  } else if (config.preset === '6m') {
    start.setMonth(referenceDate.getMonth() - 6);
    resolution = 'bi-weekly';
  } else if (config.preset === '1y') {
    start.setFullYear(referenceDate.getFullYear() - 1);
    resolution = 'monthly';
  } else if (config.preset === 'custom') {
    if (config.startDate && config.endDate) {
      start = new Date(config.startDate + 'T00:00:00Z');
      end = new Date(config.endDate + 'T23:59:59Z');
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
        start = new Date(referenceDate);
        start.setDate(referenceDate.getDate() - 29);
        end = new Date(referenceDate);
      }
    } else {
      start.setDate(referenceDate.getDate() - 29);
    }

    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 45) {
      resolution = 'daily';
    } else if (diffDays <= 120) {
      resolution = 'weekly';
    } else if (diffDays <= 240) {
      resolution = 'bi-weekly';
    } else {
      resolution = 'monthly';
    }
  }

  // Find target zone baseline if specified
  const targetZone = config.zoneId && config.zoneId !== 'all'
    ? DHAKA_RISK_ZONES.find((z) => z.id === config.zoneId)
    : null;

  const baseZoneScore = targetZone ? targetZone.riskScore : 52.1;
  const baseMetroScore = 52.1;

  const points: TrendDataPoint[] = [];
  const current = new Date(start);

  let stepDays = 1;
  if (resolution === 'weekly') stepDays = 7;
  else if (resolution === 'bi-weekly') stepDays = 14;
  else if (resolution === 'monthly') stepDays = 30;

  let index = 0;
  while (current <= end) {
    const timestamp = current.getTime();
    const daySeed = Math.floor(timestamp / 86400000);
    const dayOfWeekIdx = current.getUTCDay();
    const isWeekend = dayOfWeekIdx === 5 || dayOfWeekIdx === 6; // Fri, Sat in Bangladesh

    // Base noise and sinusoidal macro trend
    const macroCycle = Math.sin((daySeed / 20) * Math.PI) * 4.5;
    const microJitter = (seededRandom(daySeed + 101) - 0.5) * 3.8;
    
    // Weekend effect: counter registrations drop, but batch audit flags background mutation backlogs
    const weekendScoreModifier = isWeekend ? -2.2 : 1.2;

    const overallRisk = Math.min(98, Math.max(12, Math.round((baseMetroScore + macroCycle + microJitter + weekendScoreModifier) * 10) / 10));
    
    // Zone-specific score
    const zoneDiff = baseZoneScore - baseMetroScore;
    const zoneRisk = Math.min(99, Math.max(10, Math.round((baseZoneScore + macroCycle * 0.8 + microJitter + weekendScoreModifier * 0.5) * 10) / 10));

    // Incident counts scale with risk and weekday status
    const weekdayMultiplier = isWeekend ? 0.35 : 1.15;
    const riskFactor = (targetZone ? zoneRisk : overallRisk) / 50;

    const doubleSale = Math.max(0, Math.round((4.2 * riskFactor * weekdayMultiplier + (seededRandom(daySeed + 202) * 3.5))));
    const mutationTampering = Math.max(1, Math.round((3.8 * riskFactor + (seededRandom(daySeed + 303) * 3.2))));
    const warisan = Math.max(0, Math.round((2.6 * riskFactor + (seededRandom(daySeed + 404) * 2.4))));
    const surveyConflicts = Math.max(0, Math.round((2.1 * riskFactor + (seededRandom(daySeed + 505) * 2.0))));
    const preventedCr = Math.round((doubleSale * 0.85 + mutationTampering * 0.45 + (seededRandom(daySeed + 606) * 1.5)) * 10) / 10;
    const activeLocks = Math.max(1, Math.round((doubleSale * 1.2 + 2)));

    // Date formatting
    const dayNum = current.getUTCDate();
    const monthIdx = current.getUTCMonth();
    const yearNum = current.getUTCFullYear();
    const isoDate = current.toISOString().split('T')[0];

    let periodLabel = `${dayNum} ${EN_MONTHS[monthIdx]}`;
    let periodLabelBn = `${toBnDigit(dayNum)} ${BN_MONTHS[monthIdx]}`;

    if (resolution === 'monthly') {
      periodLabel = `${EN_MONTHS[monthIdx]} '${String(yearNum).slice(2)}`;
      periodLabelBn = `${BN_MONTHS[monthIdx]} '${toBnDigit(String(yearNum).slice(2))}`;
    }

    points.push({
      period: periodLabel,
      periodBn: periodLabelBn,
      isoDate,
      dayOfWeek: EN_DAYS[dayOfWeekIdx],
      isWeekend,
      registryStatus: isWeekend ? 'Registry Closed (Weekend Batch Audit)' : 'Sub-Registry Counters Active',
      registryStatusBn: isWeekend ? 'সাব-রেজিস্ট্রি বন্ধ (উইকএন্ড ব্যাকগ্রাউন্ড অডিট)' : 'সাব-রেজিস্ট্রি কাউন্টার সক্রিয়',
      overallRiskIndex: overallRisk,
      zoneRiskIndex: zoneRisk,
      doubleSaleIncidents: doubleSale,
      mutationTamperingCount: mutationTampering,
      warisanDisputes: warisan,
      surveyConflicts,
      preventedVolumeCr: preventedCr,
      activeLocksCount: activeLocks,
    });

    current.setDate(current.getDate() + stepDays);
    index++;
  }

  // Calculate summary metrics
  const firstScore = points[0]?.overallRiskIndex ?? 50;
  const lastScore = points[points.length - 1]?.overallRiskIndex ?? 50;
  const netChange = Math.round((lastScore - firstScore) * 10) / 10;

  let peakScore = -1;
  let peakDate = '';
  let sumScore = 0;
  let totalPreventedCr = 0;
  let totalIncidents = 0;

  points.forEach((p) => {
    const score = p.zoneRiskIndex ?? p.overallRiskIndex;
    if (score > peakScore) {
      peakScore = score;
      peakDate = p.period;
    }
    sumScore += score;
    totalPreventedCr += p.preventedVolumeCr;
    totalIncidents += p.doubleSaleIncidents + p.mutationTamperingCount;
  });

  const avgScore = points.length > 0 ? Math.round((sumScore / points.length) * 10) / 10 : 50;
  totalPreventedCr = Math.round(totalPreventedCr * 10) / 10;

  return {
    data: points,
    summary: {
      netChange,
      peakDate,
      peakScore,
      avgScore,
      totalPreventedCr,
      totalIncidents,
      dataPointsCount: points.length,
      startDateStr: start.toISOString().split('T')[0],
      endDateStr: end.toISOString().split('T')[0],
      resolution,
    },
  };
}

