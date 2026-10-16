/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Probaho — Authentic Bangladesh Cadastral Survey & Temporal Ownership Graph Data
 * 
 * Accurately models the 4 historical survey epochs of Bangladesh:
 * 1. CS (Cadastral Survey 1910–1940, Bengal Tenancy Act VIII of 1885)
 * 2. SA (State Acquisition 1956–1962, East Bengal State Acquisition and Tenancy Act 1950)
 * 3. RS (Revisional Survey 1970–1990)
 * 4. BS / City Survey (Bangladesh Survey / Dhaka City Jarip 1995–2021)
 * 
 * Along with authentic legal instruments:
 * - Sub-Kabala Deeds (সাব-কবলা দলিল): Registration Act 1908
 * - Warishan / Inheritance Partition (ওয়ারিশান বণ্টননামা): Muslim Personal Law (Shariat) / Succession Act
 * - Namjari Mutation Porcha & DCR (নামজারি জমাভাগ খতিয়ান ও ডি.সি.আর): Land Management Manual 1990
 * - Concurrency Soft-Lock & Caveats: 72-hour anti-double sale pre-registration hold
 */

export type SurveyEpoch = 'CS_1940' | 'SA_1962' | 'WARISHAN_1974' | 'RS_1988' | 'MUTATION_2005' | 'BS_2021' | 'LOCK_2026';

export type CadastralNodeType =
  | 'SURVEY_RECORD'         // CS / SA / RS / BS Khatian
  | 'SUB_KABALA_DEED'       // Registered Deed (সাফ-কবলা)
  | 'WARISHAN_PARTITION'    // Inheritance / Faraiz Decree (বাটোয়ারা)
  | 'MUTATION_RECORD'       // AC Land Namjari + DCR (নামজারি)
  | 'FRAUD_COLLISION_DEED'  // Fraudulent Dual-Sale Attempt (দ্বৈত বিক্রয়)
  | 'CONCURRENCY_LOCK';     // Probaho 72h Interception Lock (সফট লক)

export interface DeedParticulars {
  deedNo: string;
  subRegistryOffice: string;
  subRegistryOfficeBn: string;
  balamBookNo: string;
  pageRange: string;
  regDate: string;
  executant: string;      // দাতা (Seller)
  executantBn: string;
  claimant: string;       // গ্রহীতা (Buyer)
  claimantBn: string;
  considerationBDT: number;
}

export interface MutationParticulars {
  caseNo: string;
  acLandOffice: string;
  acLandOfficeBn: string;
  dcrNo: string;
  dcrDate: string;
  holdingNo: string;
  khajnaPaidYear: string;
  eNamjariQr: string;
}

export interface WarishanHeirShare {
  heir: string;
  heirBn: string;
  relation: string;
  relationBn: string;
  fractionPart: string;
  allocatedDecimals: number;
}

export interface InheritanceParticulars {
  deceasedOwner: string;
  deceasedOwnerBn: string;
  deathYear: number;
  faraizDecreeNo: string;
  totalEstateDecimals: number;
  heirs: WarishanHeirShare[];
}

export interface CollisionParticulars {
  disputedDeedNo: string;
  fraudulentSeller: string;
  fraudulentSellerBn: string;
  unwaryBuyer: string;
  unwaryBuyerBn: string;
  targetRegistry: string;
  targetRegistryBn: string;
  timestamp: string;
  lockToken: string;
  disputeReason: string;
  disputeReasonBn: string;
  statuteCitation: string;
}

export interface TemporalGraphNode {
  id: string;
  label: string;
  labelBn: string;
  subLabel: string;
  subLabelBn: string;
  epoch: SurveyEpoch;
  year: number;
  type: CadastralNodeType;
  ownerName: string;
  ownerNameBn: string;
  nidMasked: string;
  dagNo: string;
  khatianNo: string;
  areaDecimals: number;
  areaKatha: number;
  status: 'VERIFIED' | 'PARTITIONED' | 'MUTATED' | 'FLAGGED_DOUBLE_SALE' | 'SHARE_DEFICIT' | 'LOCKED';
  confidenceScore: number; // 0 - 100
  ledgerHash: string;      // Simulated Ed25519 hash on JomiChain
  x: number;               // Normalized X position for layout
  y: number;               // Normalized Y position for layout
  isFlagged?: boolean;
  isTargetPlot?: boolean;
  
  // Specific instrument records
  deedParticulars?: DeedParticulars;
  mutationParticulars?: MutationParticulars;
  inheritanceParticulars?: InheritanceParticulars;
  collisionParticulars?: CollisionParticulars;
  
  // Mathematical Area Conservation Ledger
  areaBalanceCheck?: {
    parentAreaDecimals: number;
    transferredDecimals: number;
    retainedDecimals: number;
    varianceDecimals: number; // 0.00 = perfect conservation
    verdict: 'CONSERVED' | 'DEFICIT' | 'SURPLUS_FRAUD';
    verdictBn: string;
  };
}

export interface TemporalGraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'LEGAL_TRANSFER' | 'INHERITANCE_BRANCH' | 'MUTATION_SEAL' | 'COLLISION_ATTEMPT' | 'CONCURRENCY_HALT';
  label: string;
  labelBn: string;
  areaDecimals: number;
  isDisputed?: boolean;
  animated?: boolean;
}

export interface TemporalParcelRecord {
  id: string;
  title: string;
  titleBn: string;
  dagNo: string;
  mouza: string;
  mouzaBn: string;
  jlNo: number;
  thana: string;
  thanaBn: string;
  district: string;
  districtBn: string;
  totalCurrentDecimals: number;
  currentKatha: number;
  status: 'FLAGGED_DOUBLE_SALE' | 'SHARE_DEFICIT' | 'VERIFIED' | 'MUTATION_DISCREPANCY';
  riskScore: number;
  activeLockId?: string;
  geoCenter: [number, number]; // [lon, lat]
  summary: string;
  summaryBn: string;
  nodes: TemporalGraphNode[];
  edges: TemporalGraphEdge[];
}

// ============================================================================
// PARCEL 1: FLAGSHIP DHANMONDI MOUZA J.L. 245 · DAG 1042 (Double-Sale Intercepted)
// ============================================================================
export const PARCEL_DHANMONDI_1042: TemporalParcelRecord = {
  id: 'parcel-dhanmondi-1042',
  title: 'Dhanmondi Mouza · Dag 1042 (Flagship Double-Sale Dispute)',
  titleBn: 'ধানমন্ডি মৌজা · দাগ ১০৪২ (দ্বৈত বিক্রয় জালিয়াতি ও সফট লক)',
  dagNo: '1042',
  mouza: 'Dhanmondi Mouza',
  mouzaBn: 'ধানমন্ডি মৌজা',
  jlNo: 245,
  thana: 'Dhanmondi',
  thanaBn: 'ধানমন্ডি',
  district: 'Dhaka',
  districtBn: 'ঢাকা',
  totalCurrentDecimals: 14.50,
  currentKatha: 8.78,
  status: 'FLAGGED_DOUBLE_SALE',
  riskScore: 84,
  activeLockId: 'RES-794021',
  geoCenter: [90.3745, 23.7471],
  summary: 'Vendor Md. Rafiqul Islam executed Sub-Kabala Deed #6102 to Kabir Hossain at Dhanmondi Sub-Registry. While deed was awaiting mutation registration, vendor concurrently drafted a secondary deed (#9810) to Farhana Ahmed at Tejgaon Sub-Registry. Intercepted by Probaho 72h Concurrency Soft-Lock.',
  summaryBn: 'মালিক মোঃ রফিকুল ইসলাম ধানমন্ডি সাব-রেজিস্ট্রিতে সাফ-কবলা দলিল নং ৬১০২ মূলে কবির হোসেনের কাছে ১৪.৫০ শতক বিক্রয় করেন। নামজারি সম্পন্ন হওয়ার পূর্বেই বিক্রেতা অসৎ উদ্দেশ্যে তেজগাঁও সাব-রেজিস্ট্রিতে ফারহানা আহমেদের নামে দ্বৈত দলিল (নং ৯৮১০) দাখিল করেন। প্রবাহের ৭২ ঘণ্টার কনকারেন্সি সফট লক স্বয়ংক্রিয়ভাবে লেনদেন স্থগিত করেছে।',
  nodes: [
    {
      id: 'node-cs-102',
      label: 'CS Khatian 102',
      labelBn: 'সিএস খতিয়ান ১০২',
      subLabel: 'Dag 401 · 60.00 Dec',
      subLabelBn: 'দাগ ৪০১ · ৬০.০০ শতক',
      epoch: 'CS_1940',
      year: 1940,
      type: 'SURVEY_RECORD',
      ownerName: 'Zamindar Radharaman Roy',
      ownerNameBn: 'জমিদার রাধারমণ রায়',
      nidMasked: 'PRE-1940-ARCHIVE',
      dagNo: '401',
      khatianNo: 'CS 102',
      areaDecimals: 60.00,
      areaKatha: 36.36,
      status: 'VERIFIED',
      confidenceScore: 99,
      ledgerHash: '9a4f2c018b109e38d7410294fcbe7612',
      x: 60,
      y: 160,
      areaBalanceCheck: {
        parentAreaDecimals: 60.00,
        transferredDecimals: 29.00,
        retainedDecimals: 31.00,
        varianceDecimals: 0.00,
        verdict: 'CONSERVED',
        verdictBn: 'শতভাগ সংরক্ষিত',
      },
    },
    {
      id: 'node-sa-102',
      label: 'SA Khatian 102',
      labelBn: 'এসএ খতিয়ান ১০২',
      subLabel: 'Dag 401 · 29.00 Dec',
      subLabelBn: 'দাগ ৪০১ · ২৯.০০ শতক',
      epoch: 'SA_1962',
      year: 1962,
      type: 'SURVEY_RECORD',
      ownerName: 'Late Alhaj Shamsuddin Ahmed',
      ownerNameBn: 'মরহুম আলহাজ্ব শামসুদ্দীন আহমেদ',
      nidMasked: '1934-SA-GOVT-SETTLE',
      dagNo: '401',
      khatianNo: 'SA 102',
      areaDecimals: 29.00,
      areaKatha: 17.57,
      status: 'VERIFIED',
      confidenceScore: 98,
      ledgerHash: 'e3b0c44298fc1c149afbf4c8996fb924',
      x: 210,
      y: 160,
      areaBalanceCheck: {
        parentAreaDecimals: 60.00,
        transferredDecimals: 29.00,
        retainedDecimals: 0.00,
        varianceDecimals: 0.00,
        verdict: 'CONSERVED',
        verdictBn: 'শতভাগ সংরক্ষিত',
      },
    },
    {
      id: 'node-warishan-1974',
      label: 'Warishan Decree',
      labelBn: 'ওয়ারিশান বণ্টননামা',
      subLabel: 'Faraiz Decree #412/1974',
      subLabelBn: 'ফারায়েজ বণ্টন নং ৪১২/১৯৭৪',
      epoch: 'WARISHAN_1974',
      year: 1974,
      type: 'WARISHAN_PARTITION',
      ownerName: 'Heirs of Shamsuddin Ahmed',
      ownerNameBn: 'শামসুদ্দীন আহমেদের ওয়ারিশগণ',
      nidMasked: 'DECREE-CIVIL-DHAKA',
      dagNo: '401',
      khatianNo: 'SA 102/Part',
      areaDecimals: 29.00,
      areaKatha: 17.57,
      status: 'PARTITIONED',
      confidenceScore: 96,
      ledgerHash: 'b45c207d611893d98ec0092305a4e761',
      x: 360,
      y: 160,
      inheritanceParticulars: {
        deceasedOwner: 'Alhaj Shamsuddin Ahmed',
        deceasedOwnerBn: 'আলহাজ্ব শামসুদ্দীন আহমেদ',
        deathYear: 1973,
        faraizDecreeNo: 'FAR-73-1029',
        totalEstateDecimals: 29.00,
        heirs: [
          {
            heir: 'Md. Anowar Hossain (Son 1)',
            heirBn: 'মোঃ আনোয়ার হোসেন (পুত্র ১)',
            relation: 'Son',
            relationBn: 'পুত্র',
            fractionPart: '1/2 (8 আনা)',
            allocatedDecimals: 14.50,
          },
          {
            heir: 'Md. Akram Hossain (Son 2)',
            heirBn: 'মোঃ আকরাম হোসেন (পুত্র ২)',
            relation: 'Son',
            relationBn: 'পুত্র',
            fractionPart: '1/2 (8 আনা)',
            allocatedDecimals: 14.50,
          },
        ],
      },
      areaBalanceCheck: {
        parentAreaDecimals: 29.00,
        transferredDecimals: 29.00,
        retainedDecimals: 0.00,
        varianceDecimals: 0.00,
        verdict: 'CONSERVED',
        verdictBn: 'ফারায়েজ অনুযায়ী সংরক্ষিত',
      },
    },
    {
      id: 'node-rs-912',
      label: 'RS Khatian 912',
      labelBn: 'আরএস খতিয়ান ৯১২',
      subLabel: 'Dag 912 · 14.50 Dec',
      subLabelBn: 'দাগ ৯১২ · ১৪.৫০ শতক',
      epoch: 'RS_1988',
      year: 1988,
      type: 'SURVEY_RECORD',
      ownerName: 'Md. Anowar Hossain',
      ownerNameBn: 'মোঃ আনোয়ার হোসেন',
      nidMasked: '19482691048291048',
      dagNo: '912',
      khatianNo: 'RS 912',
      areaDecimals: 14.50,
      areaKatha: 8.78,
      status: 'VERIFIED',
      confidenceScore: 97,
      ledgerHash: '4f810b8321092e01a88c29104fbc6810',
      x: 510,
      y: 160,
      areaBalanceCheck: {
        parentAreaDecimals: 14.50,
        transferredDecimals: 14.50,
        retainedDecimals: 0.00,
        varianceDecimals: 0.00,
        verdict: 'CONSERVED',
        verdictBn: 'শতভাগ সংরক্ষিত',
      },
    },
    {
      id: 'node-deed-3412',
      label: 'Deed #3412 (2002)',
      labelBn: 'সাব-কবলা দলিল ৩৪১২',
      subLabel: 'Sub-Registry Dhanmondi',
      subLabelBn: 'ধানমন্ডি সাব-রেজিস্ট্রি',
      epoch: 'MUTATION_2005',
      year: 2002,
      type: 'SUB_KABALA_DEED',
      ownerName: 'Md. Rafiqul Islam (Buyer)',
      ownerNameBn: 'মোঃ রফিকুল ইসলাম (গ্রহীতা)',
      nidMasked: '19842692039482910',
      dagNo: '912',
      khatianNo: 'RS 912',
      areaDecimals: 14.50,
      areaKatha: 8.78,
      status: 'VERIFIED',
      confidenceScore: 99,
      ledgerHash: 'c7104b209d18e9043ac219803bfde119',
      x: 660,
      y: 160,
      deedParticulars: {
        deedNo: '3412/2002',
        subRegistryOffice: 'Dhanmondi Sub-Registry, Dhaka',
        subRegistryOfficeBn: 'ধানমন্ডি সাব-রেজিস্ট্রি অফিস, ঢাকা',
        balamBookNo: '142-K',
        pageRange: '88-96',
        regDate: '14-MAR-2002',
        executant: 'Md. Anowar Hossain',
        executantBn: 'মোঃ আনোয়ার হোসেন',
        claimant: 'Md. Rafiqul Islam',
        claimantBn: 'মোঃ রফিকুল ইসলাম',
        considerationBDT: 4850000,
      },
      areaBalanceCheck: {
        parentAreaDecimals: 14.50,
        transferredDecimals: 14.50,
        retainedDecimals: 0.00,
        varianceDecimals: 0.00,
        verdict: 'CONSERVED',
        verdictBn: 'সম্পূর্ণ অংশ হস্তান্তরিত',
      },
    },
    {
      id: 'node-mutation-2005',
      label: 'Mutation DCR #892',
      labelBn: 'নামজারি ডি.সি.আর ৮৯২',
      subLabel: 'AC Land Dhanmondi',
      subLabelBn: 'এসি ল্যান্ড ধানমন্ডি',
      epoch: 'MUTATION_2005',
      year: 2005,
      type: 'MUTATION_RECORD',
      ownerName: 'Md. Rafiqul Islam',
      ownerNameBn: 'মোঃ রফিকুল ইসলাম',
      nidMasked: '19842692039482910',
      dagNo: '912',
      khatianNo: 'Namjari 892/05',
      areaDecimals: 14.50,
      areaKatha: 8.78,
      status: 'MUTATED',
      confidenceScore: 98,
      ledgerHash: '8b9123fe01c8472910ab384729104fc8',
      x: 800,
      y: 160,
      mutationParticulars: {
        caseNo: 'নামজারি মিস কেস নং ৮৯২/২০০৪-০৫',
        acLandOffice: 'Assistant Commissioner (Land), Dhanmondi Circle',
        acLandOfficeBn: 'সহকারী কমিশনার (ভূমি), ধানমন্ডি রাজস্ব সার্কেল',
        dcrNo: 'DCR-489102-DHN',
        dcrDate: '22-AUG-2005',
        holdingNo: 'HOLD-1429-01',
        khajnaPaidYear: '1431 বঙ্গাব্দ',
        eNamjariQr: 'https://mutation.land.gov.bd/verify?case=892-2005-DHN',
      },
    },
    {
      id: 'node-bs-1042',
      label: 'BS Khatian 1042',
      labelBn: 'বিএস খতিয়ান ১০৪২',
      subLabel: 'City Survey · Dag 1042',
      subLabelBn: 'সিটি জরিপ · দাগ ১০৪২',
      epoch: 'BS_2021',
      year: 2021,
      type: 'SURVEY_RECORD',
      ownerName: 'Md. Rafiqul Islam',
      ownerNameBn: 'মোঃ রফিকুল ইসলাম',
      nidMasked: '19842692039482910',
      dagNo: '1042',
      khatianNo: 'BS 1042',
      areaDecimals: 14.50,
      areaKatha: 8.78,
      status: 'VERIFIED',
      confidenceScore: 98,
      ledgerHash: '2b4c6e8019a842710bc892147ae09214',
      x: 940,
      y: 160,
      isTargetPlot: true,
      areaBalanceCheck: {
        parentAreaDecimals: 14.50,
        transferredDecimals: 14.50,
        retainedDecimals: 0.00,
        varianceDecimals: 0.00,
        verdict: 'CONSERVED',
        verdictBn: 'বিএস জরিপে ১০০% মেলবন্ধ',
      },
    },
    {
      id: 'node-deed-6102-legit',
      label: 'Deed #6102 (2026)',
      labelBn: 'বৈধ দলিল ৬১০২ (২০২৬)',
      subLabel: 'Buyer: Kabir Hossain',
      subLabelBn: 'গ্রহীতা: কবির হোসেন',
      epoch: 'LOCK_2026',
      year: 2026,
      type: 'SUB_KABALA_DEED',
      ownerName: 'Kabir Hossain (Claimant)',
      ownerNameBn: 'কবির হোসেন (ক্রেতা)',
      nidMasked: '19792691827364519',
      dagNo: '1042',
      khatianNo: 'BS 1042',
      areaDecimals: 14.50,
      areaKatha: 8.78,
      status: 'VERIFIED',
      confidenceScore: 95,
      ledgerHash: '1f8293c04812b7a918e7428109bf1a02',
      x: 1090,
      y: 90,
      deedParticulars: {
        deedNo: '6102/2026',
        subRegistryOffice: 'Dhanmondi Sub-Registry, Dhaka',
        subRegistryOfficeBn: 'ধানমন্ডি সাব-রেজিস্ট্রি অফিস, ঢাকা',
        balamBookNo: '310-A',
        pageRange: '102-110',
        regDate: '12-OCT-2026',
        executant: 'Md. Rafiqul Islam',
        executantBn: 'মোঃ রফিকুল ইসলাম',
        claimant: 'Kabir Hossain',
        claimantBn: 'কবির হোসেন',
        considerationBDT: 32000000,
      },
    },
    {
      id: 'node-deed-9810-fraud',
      label: 'Disputed Deed #9810',
      labelBn: 'দ্বৈত বিক্রয় দলিল ৯৮১০ (অবৈধ)',
      subLabel: 'Secondary Sale Attempt',
      subLabelBn: 'দ্বিতীয়বার বিক্রয় প্রচেষ্টা',
      epoch: 'LOCK_2026',
      year: 2026,
      type: 'FRAUD_COLLISION_DEED',
      ownerName: 'Farhana Ahmed (Unwary Buyer)',
      ownerNameBn: 'ফারহানা আহমেদ (অসতর্ক ক্রেতা)',
      nidMasked: '19912693847261520',
      dagNo: '1042',
      khatianNo: 'BS 1042 (Old Porcha)',
      areaDecimals: 14.50,
      areaKatha: 8.78,
      status: 'FLAGGED_DOUBLE_SALE',
      confidenceScore: 12,
      ledgerHash: 'DEADBEEF0000000000000000COLLISION',
      x: 1090,
      y: 240,
      isFlagged: true,
      collisionParticulars: {
        disputedDeedNo: 'Draft-9810/2026',
        fraudulentSeller: 'Md. Rafiqul Islam',
        fraudulentSellerBn: 'মোঃ রফিকুল ইসলাম',
        unwaryBuyer: 'Farhana Ahmed',
        unwaryBuyerBn: 'ফারহানা আহমেদ',
        targetRegistry: 'Tejgaon Sub-Registry (Cross-Jurisdiction)',
        targetRegistryBn: 'তেজগাঁও সাব-রেজিস্ট্রি (অধিক্ষেত্র লঙ্ঘন)',
        timestamp: '14-OCT-2026 11:24 AM BST',
        lockToken: 'RES-794021',
        disputeReason: 'Attempted conveyance of Dag 1042 while active deed #6102 was already executed on 12-OCT-2026. Area deficit: vendor selling 29.00 dec from 14.50 dec total.',
        disputeReasonBn: '১২-অক্টোবর-২০২৬ তারিখে দলিল নং ৬১০২ সম্পাদিত থাকা সত্ত্বেও একই দাগের জমি পুনরায় তেজগাঁওয়ে বিক্রির অপচেষ্টা। ১৪.৫০ শতকের বিপরীতে মোট ২৯.০০ শতক দাবি করা হয়েছে।',
        statuteCitation: 'Penal Code 1860 §420, §468; Registration Act 1908 §52A; Land Crime Prevention Act 2023 §4',
      },
      areaBalanceCheck: {
        parentAreaDecimals: 14.50,
        transferredDecimals: 29.00,
        retainedDecimals: -14.50,
        varianceDecimals: -14.50,
        verdict: 'SURPLUS_FRAUD',
        verdictBn: 'ঘাটতি ও কৃত্রিম উদ্বৃত্ত প্রতারণা',
      },
    },
    {
      id: 'node-lock-794021',
      label: 'Soft-Lock #RES-794021',
      labelBn: 'সফট লক #RES-৭৯৪০২১',
      subLabel: '72h Registry Hold Active',
      subLabelBn: '৭২ ঘণ্টার স্থগিতাদেশ কার্যকর',
      epoch: 'LOCK_2026',
      year: 2026,
      type: 'CONCURRENCY_LOCK',
      ownerName: 'Ministry of Land Caveat Server',
      ownerNameBn: 'ভূমি মন্ত্রণালয় সমন্বিত নিষেধাজ্ঞা সার্ভার',
      nidMasked: 'GOVT-AUTOMATED-SHIELD',
      dagNo: '1042',
      khatianNo: 'BS 1042',
      areaDecimals: 14.50,
      areaKatha: 8.78,
      status: 'LOCKED',
      confidenceScore: 100,
      ledgerHash: 'PROBAHO_LOCK_794021_ED25519_SEAL',
      x: 1240,
      y: 240,
      isFlagged: true,
    },
  ],
  edges: [
    {
      id: 'e-cs-sa',
      source: 'node-cs-102',
      target: 'node-sa-102',
      type: 'LEGAL_TRANSFER',
      label: 'State Acquisition Settlement (1962)',
      labelBn: 'জমিদারি অধিগ্রহণ ও বন্দোবস্ত (১৯৬২)',
      areaDecimals: 29.00,
      animated: true,
    },
    {
      id: 'e-sa-warishan',
      source: 'node-sa-102',
      target: 'node-warishan-1974',
      type: 'INHERITANCE_BRANCH',
      label: 'Heir Succession Partition (1974)',
      labelBn: 'ওয়ারিশান ফারায়েজ বণ্টন (১৯৭৪)',
      areaDecimals: 29.00,
      animated: true,
    },
    {
      id: 'e-warishan-rs',
      source: 'node-warishan-1974',
      target: 'node-rs-912',
      type: 'LEGAL_TRANSFER',
      label: 'RS Khatian Allotment (14.50 Dec)',
      labelBn: 'আরএস খতিয়ানে পৃথক হিস্যা (১৪.৫০ শতক)',
      areaDecimals: 14.50,
      animated: true,
    },
    {
      id: 'e-rs-deed',
      source: 'node-rs-912',
      target: 'node-deed-3412',
      type: 'LEGAL_TRANSFER',
      label: 'Sub-Kabala Sale Deed #3412 (2002)',
      labelBn: 'সাব-কবলা বিক্রয় দলিল ৩৪১২ (২০০২)',
      areaDecimals: 14.50,
      animated: true,
    },
    {
      id: 'e-deed-mutation',
      source: 'node-deed-3412',
      target: 'node-mutation-2005',
      type: 'MUTATION_SEAL',
      label: 'Namjari Porcha & DCR #892',
      labelBn: 'নামজারি পর্চা ও ডিসিআর ৮৯২',
      areaDecimals: 14.50,
      animated: true,
    },
    {
      id: 'e-mutation-bs',
      source: 'node-mutation-2005',
      target: 'node-bs-1042',
      type: 'LEGAL_TRANSFER',
      label: 'City Jarip BS Confirmation (2021)',
      labelBn: 'ঢাকা সিটি বিএস রেকর্ড চূড়ান্তকরণ (২০২১)',
      areaDecimals: 14.50,
      animated: true,
    },
    {
      id: 'e-bs-legit',
      source: 'node-bs-1042',
      target: 'node-deed-6102-legit',
      type: 'LEGAL_TRANSFER',
      label: 'Conveyance to Kabir Hossain (12-OCT)',
      labelBn: 'কবির হোসেনের অনুকূলে দলিল (১২-অক্টোবর)',
      areaDecimals: 14.50,
      animated: true,
    },
    {
      id: 'e-bs-fraud',
      source: 'node-bs-1042',
      target: 'node-deed-9810-fraud',
      type: 'COLLISION_ATTEMPT',
      label: 'Fraudulent Duplicate Conveyance Attempt',
      labelBn: 'প্রতারণামূলক দ্বৈত দলিল সম্পাদন অপচেষ্টা',
      areaDecimals: 14.50,
      isDisputed: true,
      animated: true,
    },
    {
      id: 'e-fraud-lock',
      source: 'node-deed-9810-fraud',
      target: 'node-lock-794021',
      type: 'CONCURRENCY_HALT',
      label: '72h Pre-Sale Soft-Lock Intercepted!',
      labelBn: '৭২ ঘণ্টার সফট লক দ্বারা প্রতিহত!',
      areaDecimals: 14.50,
      isDisputed: true,
      animated: false,
    },
  ],
};

// ============================================================================
// PARCEL 2: MIRPUR SENPARA PARBATA J.L. 102 · DAG 218 (Share Deficit Oversale)
// ============================================================================
export const PARCEL_MIRPUR_218: TemporalParcelRecord = {
  id: 'parcel-mirpur-218',
  title: 'Mirpur Senpara Parbata · Dag 218 (Heir Share Deficit)',
  titleBn: 'মিরপুর সেনপাড়া পর্বতা · দাগ ২১৮ (ওয়ারিশি অংশ ঘাটতি ও জালিয়াতি)',
  dagNo: '218',
  mouza: 'Senpara Parbata',
  mouzaBn: 'সেনপাড়া পর্বতা',
  jlNo: 102,
  thana: 'Mirpur',
  thanaBn: 'মিরপুর',
  district: 'Dhaka',
  districtBn: 'ঢাকা',
  totalCurrentDecimals: 7.50,
  currentKatha: 4.54,
  status: 'SHARE_DEFICIT',
  riskScore: 92,
  activeLockId: 'RES-881902',
  geoCenter: [90.3654, 23.8071],
  summary: 'Heir Rashida Begum legally inherited 3.75 decimals from RS Dag 218 according to Faraiz succession. However, she executed an agreement for sale covering 7.50 decimals (overselling by 3.75 decimals). The mutation was rejected by AC Land Mirpur Circle due to negative decimal conservation.',
  summaryBn: 'ফারায়েজ মোতাবেক ওয়ারিশ রাশিদা বেগম আরএস দাগ ২১৮ থেকে বৈধভাবে ৩.৭৫ শতকের মালিক হন। কিন্তু তিনি অসদুপায়ে সম্পূর্ণ ৭.৫০ শতক জমি বিক্রয়ের চুক্তিপত্র করেন (৩.৭৫ শতক ঘাটতি)। প্রবাহের ক্ষেত্রফল সংরক্ষণ ইঞ্জিনে নেগেটিভ ব্যালেন্স ধরা পড়ায় নামজারি স্থগিত করা হয়।',
  nodes: [
    {
      id: 'node-mirpur-cs',
      label: 'CS Khatian 44',
      labelBn: 'সিএস খতিয়ান ৪৪',
      subLabel: 'Dag 180 · 30.00 Dec',
      subLabelBn: 'দাগ ১৮০ · ৩০.০০ শতক',
      epoch: 'CS_1940',
      year: 1940,
      type: 'SURVEY_RECORD',
      ownerName: 'Moulvi Abdul Gafur',
      ownerNameBn: 'মৌলভী আব্দুল গফুর',
      nidMasked: 'PRE-1940-ARCHIVE',
      dagNo: '180',
      khatianNo: 'CS 44',
      areaDecimals: 30.00,
      areaKatha: 18.18,
      status: 'VERIFIED',
      confidenceScore: 98,
      ledgerHash: '19048a129048b291048c109248db',
      x: 80,
      y: 160,
    },
    {
      id: 'node-mirpur-sa',
      label: 'SA Khatian 89',
      labelBn: 'এসএ খতিয়ান ৮৯',
      subLabel: 'Dag 180 · 15.00 Dec',
      subLabelBn: 'দাগ ১৮০ · ১৫.০০ শতক',
      epoch: 'SA_1962',
      year: 1962,
      type: 'SURVEY_RECORD',
      ownerName: 'Khandakar Nurul Islam',
      ownerNameBn: 'খন্দকার নুরুল ইসলাম',
      nidMasked: '1942-SA-SETTLEMENT',
      dagNo: '180',
      khatianNo: 'SA 89',
      areaDecimals: 15.00,
      areaKatha: 9.09,
      status: 'VERIFIED',
      confidenceScore: 97,
      ledgerHash: '984729104fbc8291048291049281',
      x: 280,
      y: 160,
    },
    {
      id: 'node-mirpur-rs',
      label: 'RS Khatian 104',
      labelBn: 'আরএস খতিয়ান ১০৪',
      subLabel: 'Dag 218 · 7.50 Dec',
      subLabelBn: 'দাগ ২১৮ · ৭.৫০ শতক',
      epoch: 'RS_1988',
      year: 1988,
      type: 'SURVEY_RECORD',
      ownerName: 'Late Khandakar Nurul Islam',
      ownerNameBn: 'মরহুম খন্দকার নুরুল ইসলাম',
      nidMasked: '195426910283746',
      dagNo: '218',
      khatianNo: 'RS 104',
      areaDecimals: 7.50,
      areaKatha: 4.54,
      status: 'VERIFIED',
      confidenceScore: 96,
      ledgerHash: 'b719482910482910482910482910',
      x: 480,
      y: 160,
    },
    {
      id: 'node-mirpur-faraiz',
      label: 'Faraiz Partition (2014)',
      labelBn: 'ফারায়েজ বণ্টন (২০১৪)',
      subLabel: 'Heir Rashida Begum (1/2)',
      subLabelBn: 'ওয়ারিশ রাশিদা বেগম (১/২ অংশ)',
      epoch: 'MUTATION_2005',
      year: 2014,
      type: 'WARISHAN_PARTITION',
      ownerName: 'Rashida Begum (Entitled to 3.75 Dec)',
      ownerNameBn: 'রাশিদা বেগম (প্রাপ্য ৩.৭৫ শতক)',
      nidMasked: '19822691028374619',
      dagNo: '218',
      khatianNo: 'RS 104/Part',
      areaDecimals: 3.75,
      areaKatha: 2.27,
      status: 'SHARE_DEFICIT',
      confidenceScore: 40,
      ledgerHash: '4829104829104829104829104829',
      x: 680,
      y: 160,
      inheritanceParticulars: {
        deceasedOwner: 'Khandakar Nurul Islam',
        deceasedOwnerBn: 'খন্দকার নুরুল ইসলাম',
        deathYear: 2012,
        faraizDecreeNo: 'FAR-MIR-2014-99',
        totalEstateDecimals: 7.50,
        heirs: [
          {
            heir: 'Rashida Begum (Daughter)',
            heirBn: 'রাশিদা বেগম (কন্যা)',
            relation: 'Daughter',
            relationBn: 'কন্যা',
            fractionPart: '1/2',
            allocatedDecimals: 3.75,
          },
          {
            heir: 'Kamal Hossain (Son)',
            heirBn: 'কামাল হোসেন (পুত্র)',
            relation: 'Son',
            relationBn: 'পুত্র',
            fractionPart: '1/2',
            allocatedDecimals: 3.75,
          },
        ],
      },
    },
    {
      id: 'node-mirpur-oversale',
      label: 'Deed #8129 (Oversale)',
      labelBn: 'দলিল ৮১২৯ (অতিরিক্ত অংশ বিক্রয়)',
      subLabel: 'Claiming 7.50 Dec (Δ -3.75)',
      subLabelBn: '৭.৫০ শতক দাবি (ঘাটতি ৩.৭৫)',
      epoch: 'BS_2021',
      year: 2021,
      type: 'FRAUD_COLLISION_DEED',
      ownerName: 'Buyer: Tarek Masud (Contested)',
      ownerNameBn: 'ক্রেতা: তারেক মাসুদ (বিরোধপূর্ণ)',
      nidMasked: '19742691028374620',
      dagNo: '218',
      khatianNo: 'Contested Khatian',
      areaDecimals: 7.50,
      areaKatha: 4.54,
      status: 'SHARE_DEFICIT',
      confidenceScore: 18,
      ledgerHash: 'DEFICIT_3_75_DECIMALS_FRAUD_BLOCK',
      x: 880,
      y: 160,
      isFlagged: true,
      areaBalanceCheck: {
        parentAreaDecimals: 3.75,
        transferredDecimals: 7.50,
        retainedDecimals: -3.75,
        varianceDecimals: -3.75,
        verdict: 'DEFICIT',
        verdictBn: 'মালিকানা বহির্ভূত অতিরিক্ত অংশ বিক্রয় (-৩.৭৫ শতক)',
      },
    },
  ],
  edges: [
    {
      id: 'em-1',
      source: 'node-mirpur-cs',
      target: 'node-mirpur-sa',
      type: 'LEGAL_TRANSFER',
      label: 'SA Settlement',
      labelBn: 'এসএ রেকর্ড',
      areaDecimals: 15.00,
      animated: true,
    },
    {
      id: 'em-2',
      source: 'node-mirpur-sa',
      target: 'node-mirpur-rs',
      type: 'LEGAL_TRANSFER',
      label: 'RS Lineage Allotment',
      labelBn: 'আরএস ধারাবাহিকতা',
      areaDecimals: 7.50,
      animated: true,
    },
    {
      id: 'em-3',
      source: 'node-mirpur-rs',
      target: 'node-mirpur-faraiz',
      type: 'INHERITANCE_BRANCH',
      label: 'Faraiz Succession (3.75 Dec)',
      labelBn: 'ফারায়েজ বণ্টন (৩.৭৫ শতক)',
      areaDecimals: 3.75,
      animated: true,
    },
    {
      id: 'em-4',
      source: 'node-mirpur-faraiz',
      target: 'node-mirpur-oversale',
      type: 'COLLISION_ATTEMPT',
      label: 'Share Deficit Transfer Attempt',
      labelBn: 'ঘাটতি স্বত্ব বিক্রয় অপচেষ্টা',
      areaDecimals: 7.50,
      isDisputed: true,
      animated: true,
    },
  ],
};

// ============================================================================
// PARCEL 3: GULSHAN MODEL TOWN J.L. 182 · DAG 450 (100% Cryptographic Clean)
// ============================================================================
export const PARCEL_GULSHAN_450: TemporalParcelRecord = {
  id: 'parcel-gulshan-450',
  title: 'Gulshan Model Town · Dag 450 (100% Verified Title Benchmark)',
  titleBn: 'গুলশান মডেল টাউন · দাগ ৪৫০ (শতভাগ নির্ভেজাল ক্রিপ্টোগ্রাফিক রেকর্ড)',
  dagNo: '450',
  mouza: 'Gulshan Model Town',
  mouzaBn: 'গুলশান মডেল টাউন',
  jlNo: 182,
  thana: 'Gulshan',
  thanaBn: 'গুলশান',
  district: 'Dhaka',
  districtBn: 'ঢাকা',
  totalCurrentDecimals: 18.00,
  currentKatha: 10.90,
  status: 'VERIFIED',
  riskScore: 12,
  geoCenter: [90.4172, 23.7925],
  summary: 'Flawless institutional and commercial title continuity across all 4 cadastral survey epochs (CS 1940 -> SA 1962 -> RS 1988 -> BS 2021). Zero boundary variances, zero mortgage liens, valid e-Namjari QR porcha, and 100% mathematical decimal conservation verified on JomiChain.',
  summaryBn: 'চারটি ঐতিহাসিক জরিপ স্তরেই (সিএস ১৯৪০ -> এসএ ১৯৬২ -> আরএস ১৯৮৮ -> বিএস ২০২১) শতভাগ ধারাবাহিক ও নির্ভেজাল বাণিজ্যিক মালিকানা। কোনো সীমানা ব্যত্যয় বা ব্যাংক লিয়েন নেই; হালনাগাদ ই-নামজারি কিউআর পর্চা এবং জমিচেইনে অপরিবর্তনীয় হ্যাশ যাচাইকৃত।',
  nodes: [
    {
      id: 'node-gulshan-cs',
      label: 'CS Khatian 19',
      labelBn: 'সিএস খতিয়ান ১৯',
      subLabel: 'Dag 102 · 18.00 Dec',
      subLabelBn: 'দাগ ১০২ · ১৮.০০ শতক',
      epoch: 'CS_1940',
      year: 1940,
      type: 'SURVEY_RECORD',
      ownerName: 'Bhawal Estate Waqf',
      ownerNameBn: 'ভাওয়াল এস্টেট ওয়াকফ',
      nidMasked: 'PRE-1940-ARCHIVE',
      dagNo: '102',
      khatianNo: 'CS 19',
      areaDecimals: 18.00,
      areaKatha: 10.90,
      status: 'VERIFIED',
      confidenceScore: 99,
      ledgerHash: 'gulshan_cs_1940_verified_hash',
      x: 80,
      y: 160,
    },
    {
      id: 'node-gulshan-sa',
      label: 'SA Khatian 45',
      labelBn: 'এসএ খতিয়ান ৪৫',
      subLabel: 'Dag 102 · 18.00 Dec',
      subLabelBn: 'দাগ ১০২ · ১৮.০০ শতক',
      epoch: 'SA_1962',
      year: 1962,
      type: 'SURVEY_RECORD',
      ownerName: 'Govt DIT / RAJUK Acquisition',
      ownerNameBn: 'তৎকালীন ডিআইটি / রাজউক বন্দোবস্ত',
      nidMasked: 'GOVT-RAJUK-ESTATE',
      dagNo: '102',
      khatianNo: 'SA 45',
      areaDecimals: 18.00,
      areaKatha: 10.90,
      status: 'VERIFIED',
      confidenceScore: 100,
      ledgerHash: 'gulshan_sa_1962_rajuk_settle_hash',
      x: 320,
      y: 160,
    },
    {
      id: 'node-gulshan-rs',
      label: 'RS Khatian 312',
      labelBn: 'আরএস খতিয়ান ৩১২',
      subLabel: 'Dag 312 · 18.00 Dec',
      subLabelBn: 'দাগ ৩১২ · ১৮.০০ শতক',
      epoch: 'RS_1988',
      year: 1988,
      type: 'SURVEY_RECORD',
      ownerName: 'Engr. Mahbubul Alam',
      ownerNameBn: 'প্রকৌ. মাহবুবুল আলম',
      nidMasked: '19522691028374619',
      dagNo: '312',
      khatianNo: 'RS 312',
      areaDecimals: 18.00,
      areaKatha: 10.90,
      status: 'VERIFIED',
      confidenceScore: 98,
      ledgerHash: 'gulshan_rs_1988_verified_hash',
      x: 580,
      y: 160,
    },
    {
      id: 'node-gulshan-bs',
      label: 'BS Khatian 450',
      labelBn: 'বিএস খতিয়ান ৪৫০',
      subLabel: 'City Survey · Dag 450',
      subLabelBn: 'সিটি জরিপ · দাগ ৪৫০',
      epoch: 'BS_2021',
      year: 2021,
      type: 'SURVEY_RECORD',
      ownerName: 'Apex Properties Ltd.',
      ownerNameBn: 'এপেক্স প্রোপার্টিজ লিঃ',
      nidMasked: 'CO-REG-1049281',
      dagNo: '450',
      khatianNo: 'BS 450',
      areaDecimals: 18.00,
      areaKatha: 10.90,
      status: 'VERIFIED',
      confidenceScore: 99,
      ledgerHash: 'gulshan_bs_2021_apex_intact_hash',
      x: 840,
      y: 160,
      isTargetPlot: true,
      areaBalanceCheck: {
        parentAreaDecimals: 18.00,
        transferredDecimals: 18.00,
        retainedDecimals: 0.00,
        varianceDecimals: 0.00,
        verdict: 'CONSERVED',
        verdictBn: 'শতভাগ সুরক্ষিত ও সংরক্ষিত',
      },
    },
  ],
  edges: [
    {
      id: 'eg-1',
      source: 'node-gulshan-cs',
      target: 'node-gulshan-sa',
      type: 'LEGAL_TRANSFER',
      label: 'RAJUK Urban Allotment',
      labelBn: 'রাজউক নগর বরাদ্দ',
      areaDecimals: 18.00,
      animated: true,
    },
    {
      id: 'eg-2',
      source: 'node-gulshan-sa',
      target: 'node-gulshan-rs',
      type: 'LEGAL_TRANSFER',
      label: 'Leasehold to Freehold Sub-Kabala',
      labelBn: 'লিজহোল্ড থেকে সাফ-কবলা দলিল',
      areaDecimals: 18.00,
      animated: true,
    },
    {
      id: 'eg-3',
      source: 'node-gulshan-rs',
      target: 'node-gulshan-bs',
      type: 'LEGAL_TRANSFER',
      label: 'Corporate Conveyance & City Survey Seal',
      labelBn: 'কর্পোরেট হস্তান্তর ও সিটি জরিপ নামজারি',
      areaDecimals: 18.00,
      animated: true,
    },
  ],
};

export const ALL_TEMPORAL_PARCELS: TemporalParcelRecord[] = [
  PARCEL_DHANMONDI_1042,
  PARCEL_MIRPUR_218,
  PARCEL_GULSHAN_450,
];
