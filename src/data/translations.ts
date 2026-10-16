/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Probaho — Comprehensive Bilingual (English & Bengali) Translations
 */

export type Language = 'en' | 'bn';

export interface Translations {
  nav: {
    overview: string;
    engines: string;
    jomichain: string;
    cases: string;
    methodology: string;
    pricing: string;
    practice: string;
    account: string;
    language: string;
    dayMode: string;
    nightMode: string;
    tokensInspector: string;
  };
  hero: {
    categoryBadge: string;
    title: string;
    subscript: string;
    tagline: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    novelty1: string;
    novelty2: string;
    novelty3: string;
    novelty4: string;
    novelty5: string;
    streamingCore: string;
    streamingCity: string;
    integrity: string;
    dataCompliance: string;
    zkAudit: string;
  };
  transitionBeam: {
    telemetry: string;
    section02: string;
    exploreEngines: string;
  };
  suite: {
    sectionTag: string;
    heading: string;
    subheading: string;
    tool1: {
      type: string;
      sub: string;
      name: string;
      desc: string;
      f1: string;
      f2: string;
      f3: string;
      cta: string;
    };
    tool2: {
      type: string;
      sub: string;
      name: string;
      desc: string;
      f1: string;
      f2: string;
      f3: string;
      cta: string;
    };
    tool3: {
      type: string;
      sub: string;
      name: string;
      desc: string;
      f1: string;
      f2: string;
      f3: string;
      cta: string;
    };
    tool4: {
      type: string;
      sub: string;
      name: string;
      desc: string;
      f1: string;
      f2: string;
      f3: string;
      cta: string;
    };
  };
  jomichain: {
    sectionTag: string;
    heading: string;
    subheading: string;
    liveDemoBtn: string;
    tamperBtn: string;
    resetBtn: string;
    statusHealthy: string;
    statusTampered: string;
    softLockActive: string;
    qrTitle: string;
    qrScan: string;
    riskScoreLabel: string;
    noveltiesTitle: string;
  };
  cases: {
    tag: string;
    heading: string;
    tabAll: string;
    tabClean: string;
    tabDouble: string;
    tabComplex: string;
    inspectDossier: string;
  };
  pricing: {
    tag: string;
    heading: string;
    subheading: string;
    monthly: string;
    annual: string;
    requestCustom: string;
  };
  inquiry: {
    heading: string;
    subheading: string;
    nameLabel: string;
    emailLabel: string;
    orgLabel: string;
    typologyLabel: string;
    detailsLabel: string;
    transmitBtn: string;
    transmitting: string;
    successMsg: string;
  };
  methodology: {
    tag: string;
    heading: string;
    subheading: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  pricingFaqs: {
    tag: string;
    heading: string;
    q1: string;
    a1: string;
    q2: string;
    a2: string;
    q3: string;
    a3: string;
    q4: string;
    a4: string;
  };
  studio: {
    title: string;
    subtitle: string;
    layersTitle: string;
    exportBtn: string;
    closeBtn: string;
  };
  footer: {
    desc: string;
    rights: string;
    developedBy: string;
    wcag: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      overview: 'Overview',
      engines: 'Detection Engines',
      jomichain: 'JomiChain Passport',
      cases: 'Evidence Archive',
      methodology: 'Adversarial Simulator',
      pricing: 'Pricing Plans',
      practice: 'Cadastral Practice',
      account: 'Account',
      language: 'Language',
      dayMode: 'Day Mode',
      nightMode: 'Night Mode',
      tokensInspector: 'Design Tokens',
    },
    hero: {
      categoryBadge: 'PROBAHO // P3 LAND FRAUD INTELLIGENCE',
      title: 'Probaho',
      subscript: '(প্রবাহ)',
      tagline: '“Every plot has a story. Make it tamper-proof.”',
      description: 'Built around JomiChain: unified Plot Passports linking CS, SA, RS, and BS khatians, deeds, mutations, and mortgages with real-time double-sale locks.',
      ctaPrimary: 'Launch Live Analysis',
      ctaSecondary: 'JomiChain Plot Passport →',
      novelty1: '1. Survey-Lineage Graph',
      novelty2: '2. Hash-Chained Ledger',
      novelty3: '3. Double-Sale Soft Lock',
      novelty4: '4. Bangla Fuzzy NLP Match',
      novelty5: '5. Explainable 0-100 Risk Score + Citizen Trust QR',
      streamingCore: 'Probaho Cadastral Core:',
      streamingCity: 'Streaming',
      integrity: 'INTEGRITY: SHA-256 + Ed25519',
      dataCompliance: 'DATA: 100% Synthetic Non-PII',
      zkAudit: '✓ ZERO-KNOWLEDGE AUDIT',
    },
    transitionBeam: {
      telemetry: 'STREAMING CADASTRAL TELEMETRY: DHANMONDI MOUZA (DAG 1042) · 4 ENGINES ONLINE · 100% LEDGER INTEGRITY',
      section02: 'SECTION 02 // INTELLIGENCE SUITE',
      exploreEngines: 'Explore Engines',
    },
    suite: {
      sectionTag: 'Probaho Intelligence Suite // Section 02',
      heading: 'Four Specialized Engines. One Unified Fraud Shield.',
      subheading: 'Multi-signal fraud detection, cross-document verification, and evidence intelligence for Bangladesh land records.',
      tool1: {
        type: '01 · TEMPORAL OWNERSHIP GRAPH',
        sub: 'Bangladesh Cadastre',
        name: 'Ownership Graph',
        desc: 'Model every parcel, owner, deed, and mutation as a temporal connected graph. Automatically detect double-sales, impossible transfer chains, and ownership share proportion deficits across historical records.',
        f1: '• Temporal Transfer Chains & Dag Validation',
        f2: '• Double-Sale & Share Deficit Detection',
        f3: '• Interactive Mouza Parcel Graph Vectors',
        cta: 'Launch Ownership Graph',
      },
      tool2: {
        type: '02 · EXPLAINABLE RISK ENGINE',
        sub: 'Hybrid Rule + Anomaly',
        name: 'FraudEngine',
        desc: 'Combine deterministic legal rules with anomaly detection models. Every alert includes the specific violation rule triggered, supporting evidentiary citations, severity rating, and uncertainty measures.',
        f1: '• Legal Rules Engine + Unsupervised Anomaly Scoring',
        f2: '• Verifiable Evidence Dossier with Integrity Hashes',
        f3: '• Counterfactual What-If Risk Analysis Simulator',
        cta: 'Explore FraudEngine',
      },
      tool3: {
        type: '03 · CONTRADICTION ENGINE',
        sub: 'Bangla OCR & LLM',
        name: 'DocCompare',
        desc: 'Extract structured fields from deeds, khatian, porcha, and mutation papers. Highlight exact conflicting dag numbers, plot boundaries, seller shares, and dates side-by-side with OCR confidence scores.',
        f1: '• Multi-Document Cross-Verification (Deed vs. Khatian)',
        f2: '• Field-Level Discrepancy & Confidence Tagging',
        f3: '• Page-Level Evidence Citations & Discrepancy Reports',
        cta: 'Launch DocCompare',
      },
      tool4: {
        type: '04 · ADVERSARIAL SIMULATOR',
        sub: 'Attack Benchmark',
        name: 'Adversarial Simulator',
        desc: 'Simulate synthetic fraud attacks—such as double-selling, forged mutation timelines, and altered land areas—to benchmark detection performance, stress-test rules, and minimize false positives.',
        f1: '• Synthetic Attack Vector Injection & Stress-Testing',
        f2: '• Benchmark Detection Rate & Precision-Recall Metrics',
        f3: '• Continuous Defense Hardening for Registry Security',
        cta: 'Open Adversarial Simulator',
      },
    },
    jomichain: {
      sectionTag: 'JomiChain Cryptographic Engine // Section 03',
      heading: 'JomiChain: Cryptographic Land Ledger & Plot Passport',
      subheading: 'Catch Fraud & Double-Selling before registry completion. SHA-256 hash chains, Ed25519 signatures, and real-time cross-office concurrency locks.',
      liveDemoBtn: 'Run 5-Minute Live Story Demo',
      tamperBtn: 'Simulate Ledger Tamper',
      resetBtn: 'Reset Ledger',
      statusHealthy: 'LEDGER HEALTHY: All Cryptographic Blocks Intact (SHA-256 + Ed25519)',
      statusTampered: 'TAMPER DETECTED: Cryptographic Hash Mismatch! Chain Invalidated',
      softLockActive: 'SOFT-LOCK ACTIVE: 72H PRE-SALE RESERVATION (0x9f4a)',
      qrTitle: 'Citizen Plot Trust Passport',
      qrScan: 'Scan QR Code with Mobile Camera',
      riskScoreLabel: 'Deterministic Fraud Risk Score',
      noveltiesTitle: 'The Five Technical Novelties',
    },
    cases: {
      tag: 'Investigated Records & Fraud Cases',
      heading: 'Land Record Verifications & Detected Fraud Scenarios',
      tabAll: 'All Cases',
      tabClean: 'Clean Verified',
      tabDouble: 'Double Sale',
      tabComplex: 'Complex Fraud',
      inspectDossier: 'Inspect Investigation Dossier',
    },
    pricing: {
      tag: 'Platform Access & Institutional Deployment',
      heading: 'Institutional & Agency Pricing Plans',
      subheading: 'Transparent pricing for sub-registry offices, AC (Land) revenue circles, banks, and legal firms.',
      monthly: 'Monthly',
      annual: 'Annual (Save 20%)',
      requestCustom: 'Request Agency License',
    },
    inquiry: {
      heading: 'Request Institutional Parcel Investigation',
      subheading: 'Direct dispatch to senior Probaho land fraud intelligence team for complex land verification dossiers.',
      nameLabel: 'OFFICIAL NAME',
      emailLabel: 'INSTITUTIONAL EMAIL',
      orgLabel: 'AGENCY / REGISTRY / LAW FIRM',
      typologyLabel: 'INVESTIGATION TYPOLOGY',
      detailsLabel: 'PARCEL LOCATION, DAG & KHATIAN DETAILS',
      transmitBtn: 'Transmit Investigation Request',
      transmitting: 'Transmitting Inquiry...',
      successMsg: 'Inquiry received. A Probaho intelligence analyst will correspond directly.',
    },
    methodology: {
      tag: 'Detection Methodology',
      heading: 'Multi-Signal Ingestion to Cryptographic Evidence Pipeline',
      subheading: 'From unstandardized Bangla land documents and physical porchas to graph-based ownership verification and adversarial robustness testing, Probaho provides end-to-end evidence intelligence.',
      step1Title: 'Deed, Khatian & Mutation Digitization',
      step1Desc: 'Process legacy RS, SA, CS, and BS khatian records alongside modern digital deeds. Extract key legal fields with specialized Bangla OCR and record field confidence scores.',
      step2Title: 'Temporal Graph & Contradiction Engine',
      step2Desc: 'Construct directed temporal graphs representing ownership transfers over time. Cross-verify party names, transfer shares, and dag boundaries to flag legal impossibilities.',
      step3Title: 'Rule Justifications & Cryptographic Dossier',
      step3Desc: 'Produce explainable risk assessments combining deterministic legal rules with anomaly detection. Export cryptographically verified audit trails with SHA-256 hashes.',
    },
    pricingFaqs: {
      tag: 'Frequently Asked Questions',
      heading: 'Common Investigation Questions',
      q1: 'Which land document formats and registries are supported?',
      a1: 'Probaho analyzes sale deeds, RS/BS/SA/CS Khatians, Porchas, Mutation records, and Mouza map sheets. Both digital PDFs and scanned or photographed documents in Bangla and English are processed via our specialized Bangla OCR engine.',
      q2: 'How does the Ownership Graph detect double-sales?',
      a2: 'The graph engine models each parcel as a node and every legal transaction as a directed edge with temporal, share, and party attributes. It identifies overlapping sales within the same timeline where the seller had already relinquished legal title.',
      q3: 'Can evidence reports be used for legal and regulatory proceedings?',
      a3: 'Yes. All generated investigation reports include cryptographic SHA-256 integrity hashes, verbatim cross-document contradiction tables with page citations, and transparent rule-justification logs admissible as evidence dossiers.',
      q4: 'Can I cancel or switch subscriptions at any time?',
      a4: 'Yes, you can upgrade, downgrade, or cancel your subscription at any time directly inside your account settings with zero lock-in.',
    },
    studio: {
      title: 'Probaho Cadastral & Ownership Graph Studio',
      subtitle: 'Interactive GIS vectors, transfer edges, and deed contradiction markers.',
      layersTitle: 'CADASTRAL & EVIDENCE GIS LAYERS',
      exportBtn: 'Export Evidence Dossier (.PDF)',
      closeBtn: 'Close Studio',
    },
    footer: {
      desc: 'Intelligent land fraud detection & evidence intelligence for Bangladesh. Standardized under probaho.bd.',
      rights: 'All rights reserved.',
      developedBy: 'Developed by Md. Tanvir Hasan & Sourav Ghosh · Apache-2.0 License',
      wcag: 'WCAG 2.2 Level AA & AAA Verified',
    },
  },
  bn: {
    nav: {
      overview: 'সারসংক্ষেপ',
      engines: 'অনুসন্ধান ইঞ্জিন',
      jomichain: 'জমিচেইন পাসপোর্ট',
      cases: 'প্রমাণ আর্কাইভ',
      methodology: 'অ্যাটাক সিমুলেটর',
      pricing: 'মূল্য ও প্ল্যান',
      practice: 'ক্যাডাস্ট্রাল টিম',
      account: 'অ্যাকাউন্ট',
      language: 'ভাষা',
      dayMode: 'ডে মোড',
      nightMode: 'নাইট মোড',
      tokensInspector: 'ডিজাইন টোকেন',
    },
    hero: {
      categoryBadge: 'প্রবাহ // ভূমি জালিয়াতি ও দ্বৈত-বিক্রয় প্রতিরোধ',
      title: 'প্রবাহ',
      subscript: '(Probaho)',
      tagline: '“প্রতিটি জমির একটি ইতিহাস আছে। এটিকে অপরিবর্তনীয় করুন।”',
      description: 'জমিচেইন দ্বারা পরিচালিত: সিএস, এসএ, আরএস এবং বিএস খতিয়ান, রেজিস্ট্রি দলিল, নামজারি ও বন্ধক সংযুক্ত করে রিয়েল-টাইম দ্বৈত-বিক্রয় লকসহ সমন্বিত প্লট পাসপোর্ট।',
      ctaPrimary: 'লাইভ বিশ্লেষণ শুরু করুন',
      ctaSecondary: 'জমিচেইন প্লট পাসপোর্ট →',
      novelty1: '১. জরিপ-ধারাবাহিকতা গ্রাফ',
      novelty2: '২. হ্যাশ-চেইন্ড ভূমি লেজার',
      novelty3: '৩. দ্বৈত-বিক্রয় সফট লক',
      novelty4: '৪. বাংলা ফাজি এনএলপি ম্যাচিং',
      novelty5: '৫. ব্যাখ্যাযোগ্য ০-১০০ ঝুঁকি স্কোর ও কিউআর',
      streamingCore: 'প্রবাহ ক্যাডাস্ট্রাল কোর:',
      streamingCity: 'লাইভ স্ট্রিম',
      integrity: 'নিরাপত্তা: SHA-256 + Ed25519',
      dataCompliance: 'ডাটা: ১০০% সিন্থেটিক নন-পিআইআই',
      zkAudit: '✓ জিরো-নলেজ অডিট সমর্থিত',
    },
    transitionBeam: {
      telemetry: 'ক্যাডাস্ট্রাল লাইভ স্ট্রিম: ধানমন্ডি মৌজা (দাগ ১০৪২) · ৪টি ইঞ্জিন সক্রিয় · ১০০% লেজার সততা',
      section02: 'সেকশন ০২ // ইন্টেলিজেন্স স্যুট',
      exploreEngines: 'ইঞ্জিনসমূহ দেখুন',
    },
    suite: {
      sectionTag: 'প্রবাহ ইন্টেলিজেন্স স্যুট // সেকশন ০২',
      heading: 'চারটি বিশেষায়িত ইঞ্জিন। একটি সমন্বিত প্রতারণা প্রতিরোধ ব্যবস্থা।',
      subheading: 'বাংলাদেশ ভূমি রেকর্ডের জন্য বহু-সংকেত প্রতারণা শনাক্তকরণ, ক্রস-ডকুমেন্ট যাচাই ও প্রমাণ বিশ্লেষণ।',
      tool1: {
        type: '০১ · ধারাবাহিক মালিকানা গ্রাফ',
        sub: 'বাংলাদেশ ক্যাডাস্ট্রে',
        name: 'মালিকানা গ্রাফ',
        desc: 'প্রতিটি প্লট, মালিক, দলিল ও নামজারিকে একটি ধারাবাহিক সংযুক্ত গ্রাফ হিসেবে মডেল করুন। দ্বৈত-বিক্রয়, অসম্ভব হস্তান্তর ও খতিয়ান হিস্যার ঘাটতি স্বয়ংক্রিয়ভাবে শনাক্ত করুন।',
        f1: '• ধারাবাহিক হস্তান্তর ও দাগ যাচাইকরণ',
        f2: '• দ্বৈত-বিক্রয় ও খতিয়ান হিস্যা ঘাটতি শনাক্তকরণ',
        f3: '• ইন্টারঅ্যাক্টিভ মৌজা প্লট গ্রাফ ভেক্টর',
        cta: 'মালিকানা গ্রাফ খুলুন',
      },
      tool2: {
        type: '০২ · ব্যাখ্যাযোগ্য ঝুঁকি নির্ণায়ক',
        sub: 'হাইব্রিড রুল ও অ্যানোমালি',
        name: 'ফ্রডইঞ্জিন',
        desc: 'আইনি নিয়মের সাথে অ্যানোমালি ডিটেকশন মডেলের সমন্বয়। প্রতিটি সতর্কতায় সুনির্দিষ্ট আইনি ধারা, প্রামাণ্য উদ্ধৃতি ও তীব্রতার পরিমাপ অন্তর্ভুক্ত থাকে।',
        f1: '• আইনি বিধি ইঞ্জিন + অ্যানোমালি স্কোরিং',
        f2: '• সততা হ্যাশসহ যাচাইযোগ্য প্রমাণ ডসিয়ার',
        f3: '• কাউন্টারফ্যাকচুয়াল ঝুঁকি বিশ্লেষণ সিমুলেটর',
        cta: 'ফ্রডইঞ্জিন যাচাই করুন',
      },
      tool3: {
        type: '০৩ · অসঙ্গতি শনাক্তকরণ ইঞ্জিন',
        sub: 'বাংলা ওসিআর ও এলএলএম',
        name: 'দলিল তুলনাকারী',
        desc: 'দলিল, খতিয়ান, পর্চা ও নামজারি থেকে তথ্য স্বয়ংক্রিয়ভাবে উদ্ধৃত করুন। বিতর্কিত দাগ নম্বর, সীমানা, বিক্রেতার হিস্যা ও তারিখ পাশাপাশি চিহ্নিত করুন।',
        f1: '• বহু-নথি ক্রস-যাচাই (দলিল বনাম খতিয়ান)',
        f2: '• তথ্যভিত্তিক অসঙ্গতি ও কনফিডেন্স ট্যাগিং',
        f3: '• পৃষ্ঠাভিত্তিক প্রমাণ উদ্ধৃতি ও অসঙ্গতি রিপোর্ট',
        cta: 'দলিল তুলনাকারী চালু করুন',
      },
      tool4: {
        type: '০৪ · সিন্থেটিক আক্রমণ সিমুলেটর',
        sub: 'নিরাপত্তা বেঞ্চমার্ক',
        name: 'প্রতারণা আক্রমণ সিমুলেটর',
        desc: 'দ্বৈত-বিক্রয়, জাল নামজারি ও জমির পরিমাণ পরিবর্তনের মতো আক্রমণ কৃত্রিমভাবে তৈরি করে প্রতিরক্ষা ব্যবস্থার কার্যকারিতা ও গতি পরীক্ষা করুন।',
        f1: '• সিন্থেটিক আক্রমণ ইনজেকশন ও স্ট্রেস-টেস্টিং',
        f2: '• শনাক্তকরণ হার ও প্রেসিশন-রিকল বেঞ্চমার্ক',
        f3: '• ভূমি রেজিস্ট্রি নিরাপত্তার জন্য ক্রমাগত প্রতিরক্ষা জোরদার',
        cta: 'অ্যাডভারসেরিয়াল সিমুলেটর খুলুন',
      },
    },
    jomichain: {
      sectionTag: 'জমিচেইন ক্রিপ্টোগ্রাফিক ইঞ্জিন // সেকশন ০৩',
      heading: 'জমিচেইন: ক্রিপ্টোগ্রাফিক ভূমি লেজার ও প্লট পাসপোর্ট',
      subheading: 'রেজিস্ট্রি সম্পন্ন হওয়ার পূর্বেই জালিয়াতি ও দ্বৈত-বিক্রয় প্রতিহত করুন। SHA-256 হ্যাশ চেইন, Ed25519 ডিজিটাল স্বাক্ষর এবং রিয়েল-টাইম ক্রস-অফিস কনকারেন্সি লক।',
      liveDemoBtn: '৫ মিনিটের লাইভ ডেমো পরিচালনা করুন',
      tamperBtn: 'লেজার টেম্পার বা বিকৃতি পরীক্ষা',
      resetBtn: 'লেজার রিসেট',
      statusHealthy: 'লেজার নিরাপদ: সকল ক্রিপ্টোগ্রাফিক ব্লক অক্ষত (SHA-256 + Ed25519)',
      statusTampered: 'টেম্পার শনাক্ত হয়েছে: ক্রিপ্টোগ্রাফিক হ্যাশ অসঙ্গতি! লেজার চেইন বাতিল',
      softLockActive: 'সফট-লক সক্রিয়: ৭২ ঘণ্টার প্রি-সেল রিজার্ভেশন (0x9f4a)',
      qrTitle: 'নাগরিক প্লট ট্রাস্ট পাসপোর্ট',
      qrScan: 'মোবাইল ক্যামেরা দিয়ে কিউআর কোড স্ক্যান করুন',
      riskScoreLabel: 'নির্ধারিত ভূমি ঝুঁকি স্কোর',
      noveltiesTitle: 'পাঁচটি প্রযুক্তিগত উদ্ভাবন',
    },
    cases: {
      tag: 'তদন্তকৃত রেকর্ড ও প্রতারণা কেস স্টাডি',
      heading: 'ভূমি রেকর্ড যাচাই ও উদঘাটিত প্রতারণা কেস সিনারিও',
      tabAll: 'সকল কেস',
      tabClean: 'নিরাপদ ও যাচাইকৃত',
      tabDouble: 'দ্বৈত বিক্রয়',
      tabComplex: 'জটিল জালিয়াতি',
      inspectDossier: 'তদন্ত ডসিয়ার পরীক্ষা করুন',
    },
    pricing: {
      tag: 'প্ল্যাটফর্ম লাইসেন্স ও প্রাতিষ্ঠানিক ব্যবহার',
      heading: 'প্রাতিষ্ঠানিক ও সাব-রেজিস্ট্রি মূল্য তালিকা',
      subheading: 'সাব-রেজিস্ট্রি অফিস, এসি (ল্যান্ড) রাজস্ব সার্কেল, বাণিজ্যিক ব্যাংক ও আইন সংস্থা সমূহের জন্য স্বচ্ছ মূল্য কাঠামো।',
      monthly: 'মাসিক বিলিং',
      annual: 'বার্ষিক (২০% সাশ্রয়ী)',
      requestCustom: 'প্রাতিষ্ঠানিক লাইসেন্স অনুরোধ',
    },
    inquiry: {
      heading: 'প্রাতিষ্ঠানিক জমি অনুসন্ধান অনুরোধ প্রেরণ',
      subheading: 'জটিল ভূমি যাচাই ও ফরেনসিক প্রমাণ ডসিয়ারের জন্য সরাসরি প্রবাহ সিনিয়র ইনভেস্টিগেশন টিমের নিকট পাঠান।',
      nameLabel: 'দায়িত্বপ্রাপ্ত কর্মকর্তার নাম',
      emailLabel: 'প্রাতিষ্ঠানিক ইমেইল',
      orgLabel: 'সংস্থা / সাব-রেজিস্ট্রি / আইন প্রতিষ্ঠান',
      typologyLabel: 'অনুসন্ধানের ধরন',
      detailsLabel: 'জমির অবস্থান, মৌজা, দাগ ও খতিয়ান বিবরণ',
      transmitBtn: 'অনুসন্ধান অনুরোধ প্রেরণ করুন',
      transmitting: 'অনুরোধ প্রেরণ করা হচ্ছে...',
      successMsg: 'আপনার অনুরোধ গৃহীত হয়েছে। প্রবাহ ইনভেস্টিগেশন টিম দ্রুত যোগাযোগ করবে।',
    },
    methodology: {
      tag: 'প্রতারণা অনুসন্ধান কার্যপদ্ধতি',
      heading: 'বহু-সংকেত ইনজেশন থেকে ক্রিপ্টোগ্রাফিক প্রমাণ পাইপলাইন',
      subheading: 'অসংগঠিত বাংলা ভূমি রেকর্ড এবং কাগজের পর্চা থেকে শুরু করে গ্রাফ-ভিত্তিক মালিকানা যাচাই ও সিন্থেটিক আক্রমণ পরীক্ষা পর্যন্ত—প্রবাহ প্রদান করে সামগ্রিক প্রমাণ বিশ্লেষণ।',
      step1Title: 'দলিল, খতিয়ান ও নামজারি ডিজিটাইজেশন',
      step1Desc: 'ঐতিহাসিক আরএস, এসএ, সিএস ও বিএস খতিয়ান এবং আধুনিক ডিজিটাল দলিল প্রক্রিয়াকরণ। বিশেষায়িত বাংলা ওসিআর দ্বারা মূল আইনি তথ্য সংগ্রহ ও কনফিডেন্স স্কোর সংরক্ষণ।',
      step2Title: 'ধারাবাহিক গ্রাফ ও অসঙ্গতি শনাক্তকরণ ইঞ্জিন',
      step2Desc: 'সময়ের সাথে মালিকানা পরিবর্তনের নির্দেশিত গ্রাফ তৈরি। দাগের সীমানা, বিক্রেতার হিস্যা এবং পক্ষের নাম ক্রস-যাচাই করে আইনি অসম্ভবতা চিহ্নিতকরণ।',
      step3Title: 'বিধি ন্যায্যতা ও ক্রিপ্টোগ্রাফিক ডসিয়ার',
      step3Desc: 'সুনির্দিষ্ট আইনি বিধি ও অ্যানোমালি ডিটেকশনের সমন্বয়ে ব্যাখ্যাযোগ্য ঝুঁকি রিপোর্ট তৈরি। SHA-256 হ্যাশসহ ক্রিপ্টোগ্রাফিকভাবে যাচাইযোগ্য অডিট ট্রেইল রপ্তানি।',
    },
    pricingFaqs: {
      tag: 'সাধারণ জিজ্ঞাসা',
      heading: 'ভূমি অনুসন্ধান সংক্রান্ত সচরাচর জিজ্ঞাসিত প্রশ্নাবলী',
      q1: 'কোন কোন ভূমি দলিলের ফরম্যাট ও রেজিস্ট্রি সমর্থিত?',
      a1: 'প্রবাহ বিক্রয় দলিল, আরএস/বিএস/এসএ/সিএস খতিয়ান, পর্চা, নামজারি রেকর্ড এবং মৌজা নকশা বিশ্লেষণ করে। ডিজিটাল পিডিএফ এবং স্ক্যানকৃত বা ক্যামেরায় তোলা বাংলা ও ইংরেজি উভয় নথি আমাদের বাংলা ওসিআর দ্বারা প্রক্রিয়াজাত হয়।',
      q2: 'মালিকানা গ্রাফ কীভাবে দ্বৈত-বিক্রয় শনাক্ত করে?',
      a2: 'গ্রাফ ইঞ্জিন প্রতিটি প্লটকে নোড এবং প্রতিটি আইনি লেনদেনকে সময়, হিস্যা ও পক্ষ সংক্রান্ত তথ্যসহ নির্দেশিত প্রান্ত হিসেবে মডেল করে। একই সময়রেখায় বিক্রেতা পূর্বে মালিকানা হস্তান্তর করার পরও পুনরায় বিক্রয়ের অপচেষ্টা স্বয়ংক্রিয়ভাবে ধরা পড়ে।',
      q3: 'তদন্ত রিপোর্ট কি আইনি ও আদালতের কার্যক্রমে ব্যবহারযোগ্য?',
      a3: 'হ্যাঁ। প্রতিটি তদন্ত রিপোর্টে ক্রিপ্টোগ্রাফিক SHA-256 সততা হ্যাশ, পৃষ্ঠা রেফারেন্সসহ হুবহু ক্রস-ডকুমেন্ট বৈপরীত্য সারণি এবং স্বচ্ছ আইনি বিধি পর্যালোচনা অন্তর্ভুক্ত থাকে যা আইনি প্রামাণ্য দলিল হিসেবে গ্রহণযোগ্য।',
      q4: 'সাবস্ক্রিপশন কি যেকোনো সময় পরিবর্তন বা বাতিল করা যাবে?',
      a4: 'হ্যাঁ, আপনি যেকোনো সময় আপনার অ্যাকাউন্ট সেটিংস থেকে সরাসরি আপনার প্ল্যান আপগ্রেড, ডাউনগ্রেড বা বাতিল করতে পারবেন—কোনো গোপন চার্জ নেই।',
    },
    studio: {
      title: 'প্রবাহ ক্যাডাস্ট্রাল ও মালিকানা গ্রাফ স্টুডিও',
      subtitle: 'ইন্টারঅ্যাক্টিভ জিআইএস ভেক্টর, ধারাবাহিক হস্তান্তর প্রান্ত ও দলিল অসঙ্গতি মার্কার।',
      layersTitle: 'ক্যাডাস্ট্রাল ও প্রমাণ জিআইএস লেয়ার',
      exportBtn: 'প্রমাণ ডসিয়ার ডাউনলোড (.PDF)',
      closeBtn: 'স্টুডিও বন্ধ করুন',
    },
    footer: {
      desc: 'বাংলাদেশের জন্য বুদ্ধিমান ভূমি প্রতারণা শনাক্তকরণ ও প্রমাণ বিশ্লেষণ। probaho.bd এর আওতাধীন।',
      rights: 'সর্বস্বত্ব সংরক্ষিত।',
      developedBy: 'তৈরি করেছেন মোঃ তানভীর হাসান ও সৌরভ ঘোষ · অ্যাপাচি-২.০ লাইসেন্স',
      wcag: 'WCAG ২.২ লেভেল AA ও AAA যাচাইকৃত',
    },
  },
};
