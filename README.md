<p align="center">
  <img src="./hero.svg" alt="Probaho &amp; JomiChain Hero Banner" width="100%" />
</p>

<div align="center">

# 🌿 Probaho (প্রবাহ)
### *“Every plot has a story. Make it tamper-proof.”*

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Track Focus](https://img.shields.io/badge/Track-P3:_Catch_Fraud_&_Double--Selling-emerald)](https://github.com/Tanvir4n/Probaho)
[![Supporting Layers](https://img.shields.io/badge/Supporting-P2_(Verification)_&_P4_(Mutation)-10b981)](https://github.com/Tanvir4n/Probaho)
[![Data Compliance](https://img.shields.io/badge/Data-100%25_Synthetic_&_Non--PII-purple)](#-rulebook-compliance--synthetic-data-guarantee)
[![Dataset](https://img.shields.io/badge/Dataset-30%2C000_Synthetic_Parcels-blue)](#-machine-learning--explainable-ai-novelty-1-engine)
[![ML Pipeline](https://img.shields.io/badge/ML-XGBoost_%7C_SHAP_%7C_NetworkX_%7C_Isolation_Forest-emerald)](#-machine-learning--explainable-ai-novelty-1-engine)
[![Cryptographic Validation](https://img.shields.io/badge/Ledger-SHA--256_%7C_Ed25519_%7C_Merkle_Roots-black)](#novelty-2-hash-chained-land-ledger-no-heavy-blockchain)

**Probaho** is an intelligent land fraud detection, evidence intelligence, and verification platform for Bangladesh land records. Built around **JomiChain**, it turns fragmented cadastral records into a tamper-evident **Plot Passport**—linking historical survey generations, deed chains, mutations, and mortgage encumbrances into an auditable cryptographic timeline.

[Live Demo](#-quick-start--local-setup) • [Five Novelties](#-five-technical-novelties) • [ML & XAI Engine](#-machine-learning--explainable-ai-novelty-1-engine) • [Visual Workflows](#-system-workflows--visualizations) • [5-Minute Live Story](#-5-minute-live-story-demo-protocol) • [Architecture](#-system-architecture) • [Rulebook Compliance](#-rulebook-compliance--synthetic-data-guarantee)

---

</div>

## 📌 Executive Summary & Problem Statement

In Bangladesh, land records are historically fragmented across distinct administrative silos:
- **Sub-Registry Offices** (Ministry of Law) manage deed registration.
- **AC (Land) Revenue Offices** (Ministry of Land) oversee mutations and khatian records.
- **Settlement Offices** conduct periodic survey updates (**CS 1940**, **SA 1962**, **RS 1988**, **BS 2021**).
- **Commercial Banks** register mortgage encumbrances and charge liens independently.

Because no single office has real-time visibility into the complete parcel lifecycle, malicious actors exploit information delays to:
1. **Double-Sell Parcels:** Selling the same plot simultaneously in two different sub-registry offices or mortgaging it to multiple banks before a mutation is recorded.
2. **Fabricate Forged Mutation Papers:** Inserting fraudulent deeds with backdated timestamps into paper bundles.
3. **Inflate Plot Area Across Surveys:** Expanding land parcel boundaries between RS and BS surveys without a supporting partition deed.

**Probaho solves this** with **JomiChain**: a unified **Plot Passport** and lightweight cryptographic land ledger that flags impossible survey lineages, prevents double-selling in real-time with cross-office pre-sale reservations, and normalizes noisy Bangla records.

---

## 🌟 Five Technical Novelties

### Novelty 1. Survey-Lineage Graph & Machine Learning Risk Engine (CS → SA → RS → BS)
Most solutions treat each land record or khatian in isolation. Probaho models a plot’s multi-decade history as a **directed topological lineage graph** validated by graph algorithms and machine learning:
* **Four Historical Survey Generations:** Tracks partitions, splits, merges, and continuations across **CS 1940 → SA 1962 → RS 1988 → BS 2021** across a **30,000-parcel synthetic engineering dataset** with **29,065 directed lineage edges**.
* **Mathematical Area Conservation Enforced:** 
  $$\sum \text{Area}(\text{Children}) \le \text{Area}(\text{Parent}) + \epsilon$$
* **Dual Machine Learning Validation:**
  1. **NetworkX Topological Engine:** Validates DAG acyclicity, computes parent-child deficits, and identifies orphaned or missing ancestral lineages.
  2. **XGBoost Supervised Risk Classifier:** Achieves **0.9909 ROC-AUC**, **0.8514 PR-AUC**, and **99.15% accuracy** on lineage-grouped held-out test data.
  3. **Isolation Forest Unsupervised Outlier Detector:** Surfaces structural anomalies without pre-existing labels.
* **Game-Theoretic SHAP Explainability:** Decomposes risk predictions into exact Shapley values ($f(x) = \mathbb{E}[f(x)] + \sum \phi_i$) providing transparent, court-admissible audit trails.
* **Automated Anomaly Detection:** Flags area inflation, missing ancestral lineages, and disjoint duplicate dag collisions across genealogical trees.

### Novelty 2. Hash-Chained Land Ledger (No Heavy Blockchain)
Avoids the cost, latency, and environmental overhead of proof-of-work blockchains while delivering enterprise-grade cryptographic verification:
* Every event (khatian survey, transfer deed, mutation, or bank mortgage) is appended to a per-plot ledger chain.
* Each entry contains the cryptographic hash:
  $$\text{Block Hash} = \text{SHA-256}(\text{prev\_hash} \,\|\, \text{record\_payload})$$
* Digitally signed with **Ed25519** public-key signatures by the certifying registrar.
* Tampering with any historical record severs the hash chain visibly.
* A daily **Merkle Root** is computed and published, allowing nationwide auditors to verify thousands of office records with a single 32-byte digest.

### Novelty 3. Double-Sale Lock (“Pre-Sale Reservation”)
Traditional anti-fraud systems only detect double-selling *after* registration is complete and damage is done. Probaho introduces **Real-Time Concurrency Prevention**:
* When a sub-registry office begins drafting or reviewing a deed, the plot receives a short-lived **Pre-Sale Reservation soft-lock** (e.g., 72 hours).
* Any concurrent attempt to sell or mortgage the same plot at another sub-registry office or bank branch is **intercepted and blocked live** with an instant collision alert.

### Novelty 4. Bangla-Aware Fuzzy Matching
Land records in Bangladesh suffer from Unicode variations, Arabic/Bangla spelling alternations, honorific prefixes, and OCR digitization noise:
* **Honorific Expansion:** Automatically normalizes `মোঃ` $\leftrightarrow$ `মোহাম্মদ`, `মোসাঃ` $\leftrightarrow$ `মোসাম্মাৎ`, `আঃ` $\leftrightarrow$ `আব্দুর`.
* **Vowel Orthography Normalization:** Harmonizes common variants (e.g., `মোহাম্মদ` $\equiv$ `মুহাম্মদ`, `ূ` vs. `ু`, hasanta/ZWJ cleaning).
* **Phonetic Distance Scoring:** Uses custom Bangla phonetic mapping combined with Levenshtein/Jaro-Winkler algorithms to link matching citizens and explains the match reasoning auditably.

### Novelty 5. Explainable Risk Score & Citizen “Trust Report”
Land officers and judges cannot rely on uninterpretable "black box" AI outputs:
* **Game-Theoretic SHAP Decomposition:** Every parcel risk assessment is mathematically decomposed into individual positive risk drivers and protective mitigators:
  $$f(x) = \mathbb{E}[f(x)] + \sum_{i=1}^{M} \phi_i$$
* **Transparent Legal Reasoning:** Every feature impact ($\phi_i$) is tied to explicit statutory citations (e.g., *State Acquisition and Tenancy Act 1950 § 89*, *Transfer of Property Act 1882 § 53A*, *Registration Act 1908 § 17*).
* Every parcel receives an auditable **0–100 Risk Score** with explicit legal justifications (e.g., *"RS Khatian area 12.0 shotok vs BS Khatian 18.2 shotok (+51.6% unexplained inflation)"* or *"Active mortgage lien under Agrani Bank not released"*).
* Generates a citizen-friendly **Plot Trust Report** accompanied by a tamper-evident **QR Code** printed on deeds, enabling buyers to verify parcel authenticity on any smartphone.

---

## 📊 System Workflows & Visualizations

### 1. End-to-End Land Fraud Detection Workflow
```mermaid
flowchart TD
    subgraph INGESTION["1. Multi-Document Ingestion"]
        D1["Historical Khatians<br/>(CS / SA / RS / BS)"]
        D2["Registered Deeds<br/>(Sub-Registry)"]
        D3["Mutation Porchas<br/>(AC Land Office)"]
        D4["Bank Mortgage Liens<br/>(Encumbrance Records)"]
    end

    subgraph NORMALIZER["2. Bangla NLP & Phonetic Engine"]
        NLP1["Unicode & Hasanta Cleanup"]
        NLP2["Honorific Title Expansion (মোঃ ↔ মোহাম্মদ)"]
        NLP3["Bangla Phonetic & OCR Fuzzy Matcher"]
    end

    subgraph CORE["3. JomiChain Core Engine"]
        PP["Plot Passport Timeline"]
        LINEAGE["Survey-Lineage Graph<br/>(Area Conservation: Σ Children ≤ Parent)"]
        LOCK["Double-Sale Lock Manager<br/>(Pre-Sale Soft Reservation Token)"]
        HASH["Hash-Chained Ledger<br/>(SHA-256 + Ed25519 Sigs + Daily Merkle Root)"]
    end

    subgraph OUTPUT["4. Dual Verification Interfaces"]
        DASH["Officer Investigation Studio<br/>• Concurrency Collision Alert<br/>• Severed Chain Detection<br/>• Lineage Anomaly Flags"]
        CITIZEN["Citizen Verification Portal<br/>• 0-100 Explainable Risk Score<br/>• Scannable Deed QR Pass<br/>• Plain-Language Trust Report"]
    end

    D1 & D2 & D3 & D4 --> NORMALIZER
    NORMALIZER --> PP
    PP --> LINEAGE & LOCK & HASH
    LINEAGE & LOCK & HASH --> DASH
    LINEAGE & LOCK & HASH --> CITIZEN

    classDef green fill:#142419,stroke:#22c55e,stroke-width:2px,color:#ffffff;
    classDef amber fill:#2d1f05,stroke:#f59e0b,stroke-width:2px,color:#ffffff;
    classDef blue fill:#0c1d2e,stroke:#38bdf8,stroke-width:2px,color:#ffffff;
    class PP,LINEAGE,LOCK,HASH green;
    class DASH,CITIZEN blue;
    class NLP1,NLP2,NLP3 amber;
```

---

### 2. Cadastral Survey-Lineage Graph (CS → SA → RS → BS)
```mermaid
graph TD
    subgraph CLEAN["Clean Verified Lineage (Dag 1042 · Dhanmondi)"]
        CS1["CS 1940: CS Dag 102<br/>Total Area: 29.0 Shotok<br/>Owner: Moulvi Khorshed Alam"]
        
        SA1["SA 1962: SA Dag 481 (50% Split)<br/>Area: 14.5 Shotok<br/>Owner: Abdus Sobhan"]
        SA2["SA 1962: SA Dag 482 (50% Split)<br/>Area: 14.5 Shotok<br/>Owner: Abdul Jabbar"]
        
        RS1["RS 1988: RS Dag 912<br/>Area: 14.5 Shotok (Conserved)<br/>Owner: Abdus Sobhan"]
        
        DEED1["Deed #4821 / 2014<br/>Area: 14.5 Shotok (Transfer)<br/>Buyer: Md. Rafiqul Islam"]
        
        BS1["BS 2021: BS Dag 1042<br/>Area: 14.5 Shotok<br/>Status: 0.0% Variance · VERIFIED ✓"]

        CS1 -->|Partition 50/50| SA1 & SA2
        SA1 -->|Revisional Survey| RS1
        RS1 -->|Registered Sale| DEED1
        DEED1 -->|City Survey| BS1
    end

    subgraph ANOMALY["Fraud Lineage: Area Inflation Anomaly (Dag 3078 · Mirpur)"]
        CS_F["CS 1940: CS Dag 411<br/>Area: 12.0 Shotok"]
        SA_F["SA 1962: SA Dag 411<br/>Area: 12.0 Shotok"]
        RS_F["RS 1988: RS Dag 604<br/>Area: 12.0 Shotok"]
        BS_F["BS 2021: BS Dag 3078<br/>Claimed Area: 18.2 Shotok<br/>🚨 ANOMALY: Child (+6.2) exceeds RS parent!"]

        CS_F --> SA_F --> RS_F -->|Unexplained Inflation +51.6%| BS_F
    end

    classDef pass fill:#142419,stroke:#22c55e,stroke-width:2px,color:#ffffff;
    classDef fail fill:#2e0c0f,stroke:#ef4444,stroke-width:2px,color:#ffffff;
    class CS1,SA1,SA2,RS1,DEED1,BS1 pass;
    class BS_F fail;
```

---

### 3. Real-Time Double-Sale Lock Concurrency Sequence
```mermaid
sequenceDiagram
    autonumber
    actor Buyer1 as Citizen A (Legitimate Buyer)
    participant OfficeA as Sub-Registry Office A (Tejgaon)
    participant JomiChain as JomiChain Concurrency Lock Manager
    participant Ledger as Cryptographic Land Ledger
    participant OfficeB as Sub-Registry Office B (Gulshan)
    actor Fraudster as Fraudulent Seller

    Buyer1->>OfficeA: Submit Deed Draft for Plot Dag 1042
    OfficeA->>JomiChain: Request Pre-Sale Reservation Lock(Dag 1042)
    JomiChain->>Ledger: Verify Plot Passport Status
    Ledger-->>JomiChain: Status: UNLOCKED / Clean
    JomiChain-->>OfficeA: Lock Granted: Token #RES-794021 (72h Hold)
    Note over JomiChain,OfficeA: Dag 1042 transitions to SOFT-LOCKED

    rect rgb(46, 12, 15)
    Note over Fraudster,OfficeB: Concurrent Double-Sale Attempt During Hold
    Fraudster->>OfficeB: Attempt Simultaneous Deed Draft for Dag 1042
    OfficeB->>JomiChain: Request Pre-Sale Reservation Lock(Dag 1042)
    JomiChain-->>OfficeB: 🚨 409 CONFLICT: Plot Locked by Office A (#RES-794021)
    OfficeB-->>Fraudster: REJECTED: Plot under active deed reservation!
    end

    Buyer1->>OfficeA: Complete Consideration Payment & Biomteric Signature
    OfficeA->>Ledger: Append Registered Deed & Commit Mutation Block
    Ledger->>JomiChain: Release Pre-Sale Lock(Dag 1042)
    Note over Ledger: SHA-256 block chained & signed with Ed25519
```

---

### 4. Cryptographic Hash-Chain Ledger & Merkle Root Structure
```mermaid
graph LR
    subgraph BLOCK0["Block #0 (CS 1940)"]
        B0_H["Hash: 0x7f83...9069"]
        B0_P["Prev: 0000...0000"]
        B0_D["Data: CS Dag 102 · 29.0 Dec"]
        B0_S["Sig: ed25519_sig_9f3b..."]
    end

    subgraph BLOCK1["Block #1 (SA 1962)"]
        B1_H["Hash: 0x4355...d865"]
        B1_P["Prev: 0x7f83...9069"]
        B1_D["Data: SA Dag 481 · 14.5 Dec"]
        B1_S["Sig: ed25519_sig_a83c..."]
    end

    subgraph BLOCK2["Block #2 (RS 1988)"]
        B2_H["Hash: 0x53c2...3fe0"]
        B2_P["Prev: 0x4355...d865"]
        B2_D["Data: RS Dag 912 · 14.5 Dec"]
        B2_S["Sig: ed25519_sig_f109..."]
    end

    subgraph BLOCK3["Block #3 (Deed 2014)"]
        B3_H["Hash: 0x129e...2e08"]
        B3_P["Prev: 0x53c2...3fe0"]
        B3_D["Data: Transfer Deed #4821"]
        B3_S["Sig: ed25519_sig_c77a..."]
    end

    subgraph MERKLE["Daily Sub-Registry Merkle Tree Root"]
        MROOT["Merkle Root: 0x7f83b165...7e21<br/>Audits 40,000+ parcels with 1 digest"]
    end

    BLOCK0 --> BLOCK1
    BLOCK1 --> BLOCK2
    BLOCK2 --> BLOCK3
    BLOCK3 -.-> MERKLE

    classDef blockStyle fill:#142419,stroke:#22c55e,stroke-width:2px,color:#ffffff;
    classDef merkleStyle fill:#0c1d2e,stroke:#38bdf8,stroke-width:2px,color:#ffffff;
    class BLOCK0,BLOCK1,BLOCK2,BLOCK3 blockStyle;
    class MERKLE merkleStyle;
```

---

### 5. Bangla-Aware Fuzzy Matching Pipeline
```mermaid
flowchart LR
    A["Raw Deed OCR<br/>'মোঃ রফিকুল ইসলাম'"] --> B["Step 1: Unicode & Hasanta Normalization<br/>(Strip ZWJ, normalize diacritics)"]
    C["Khatian Record<br/>'মুহাম্মদ রফিকুল ইসলাম'"] --> B

    B --> D["Step 2: Honorific Title Expansion<br/>('মোঃ' ➔ 'মোহাম্মদ')"]
    D --> E["Step 3: Orthographic Vowel Reduction<br/>('মোহাম্মদ' ≡ 'মুহাম্মদ')"]
    E --> F["Step 4: Phonetic & Levenshtein Matrix<br/>Similarity: 96.8% (CONFIRMED MATCH)"]

    classDef step fill:#142419,stroke:#22c55e,stroke-width:1.5px,color:#ffffff;
    class A,B,C,D,E,F step;
```

---

### 6. Novelty 1: Survey-Lineage Machine Learning & SHAP Pipeline
```mermaid
flowchart TD
    subgraph DATA["1. 30,000 Synthetic Parcel Records"]
        CSV1["Parcel CSV (30,000 Rows)<br/>CS 1940 · SA 1962 · RS 1988 · BS 2021"]
        CSV2["Lineage Edge CSV (29,065 Edges)<br/>Parent-Child Splits, Merges & Continuity"]
    end

    subgraph GRAPH["2. NetworkX Graph Validation Engine"]
        DAG["Directed Acyclic Graph (DAG) Construction"]
        AC["Mathematical Area Conservation Check<br/>(Σ Child Areas ≤ Parent Area + 0.01)"]
        DIS["Disjoint Dag Collision Detector"]
        ORP["Disconnected Ancestor / Orphan Checker"]
    end

    subgraph FE["3. Feature Engineering (Zero Data Leakage)"]
        F1["Area Ratios & Deficits<br/>(Child Area ÷ Parent Area, Inflation %)"]
        F2["Topological Graph Metrics<br/>(In/Out Degree, Lineage Depth, Sibling Counts)"]
        F3["Genealogical Conflict Signals<br/>(Foreign Family Mismatch, Disjoint Collisions)"]
    end

    subgraph MODELS["4. Dual Machine Learning Models"]
        XGB["XGBoost Supervised Classifier<br/>• Lineage-grouped split (Zero leakage)<br/>• Scale-pos imbalance weighting<br/>• ROC-AUC: 0.9909 | PR-AUC: 0.8514 | F1: 0.7714"]
        ISO["Isolation Forest Unsupervised<br/>• High-dimensional spatial outliers<br/>• Unlabeled anomaly candidate scoring"]
    end

    subgraph XAI["5. SHAP Explainability Engine"]
        BEE["Global Beeswarm Summary Plot<br/>(Macro feature directionality)"]
        BAR["Feature Importance Ranking<br/>(Area ratio, siblings, parent excess)"]
        WAT["Individual Parcel Waterfall Plot<br/>(f(x) = E[f(x)] + Σ φᵢ)"]
    end

    subgraph UI["6. Probaho Officer Dashboard"]
        DASH["Investigator Evidence Dossier<br/>• Plain-language legal statute citations<br/>• Visual lineage DAG with highlighted anomaly nodes<br/>• 0-100 Explainable Risk Score Breakdown"]
    end

    CSV1 & CSV2 --> DAG
    DAG --> AC & DIS & ORP
    AC & DIS & ORP --> FE
    F1 & F2 & F3 --> XGB & ISO
    XGB --> XAI
    XAI --> BEE & BAR & WAT
    BEE & BAR & WAT --> DASH

    classDef green fill:#142419,stroke:#22c55e,stroke-width:2px,color:#ffffff;
    classDef blue fill:#0c1d2e,stroke:#38bdf8,stroke-width:2px,color:#ffffff;
    classDef amber fill:#2d1f05,stroke:#f59e0b,stroke-width:2px,color:#ffffff;
    class CSV1,CSV2,DAG,AC,DIS,ORP green;
    class XGB,ISO,BEE,BAR,WAT blue;
    class DASH amber;
```

---

### 7. SHAP Game-Theoretic Risk Attribution Architecture
```mermaid
flowchart LR
    subgraph INPUT["Parcel Features"]
        X1["Area Inflation Ratio (+32%)"]
        X2["Sibling Count (4 Children)"]
        X3["Parent Child Excess (1.03x)"]
        X4["Survey Generation (SA 1962)"]
    end

    subgraph DECOMP["SHAP Kernel / TreeExplainer"]
        BASE["Base Value: E[f(x)] = 0.56"]
        P1["φ₁: +2.02 (High Sibling Density)"]
        P2["φ₂: +0.70 (Parent Excess Deficit)"]
        P3["φ₃: +0.26 (Survey Generation Gap)"]
        N1["φ₄: -3.46 (Protective Area Ratio)"]
    end

    subgraph RESULT["Court-Admissible Explanation"]
        RISK["Model Output: f(x) = E[f(x)] + Σ φᵢ<br/>Final Fraud Risk Score: 88/100 (HIGH RISK)"]
    end

    INPUT --> DECOMP
    BASE & P1 & P2 & P3 & N1 --> RISK

    classDef feat fill:#0c1d2e,stroke:#38bdf8,stroke-width:1.5px,color:#ffffff;
    classDef shap fill:#142419,stroke:#22c55e,stroke-width:1.5px,color:#ffffff;
    classDef res fill:#2e0c0f,stroke:#ef4444,stroke-width:2px,color:#ffffff;
    class X1,X2,X3,X4 feat;
    class BASE,P1,P2,P3,N1 shap;
    class RISK res;
```

---

---

## 🤖 Machine Learning & Explainable AI (Novelty 1 Engine)

Probaho's **Novelty 1** is powered by a production-grade Machine Learning engine trained on an extensive synthetic cadastral dataset designed specifically for historical lineage validation and boundary fraud detection.

### 1. Synthetic Dataset Architecture & Lineage Generation
* **Total Parcel Records:** **30,000** synthetic cadastral nodes across four historical survey generations.
* **Lineage Edges:** **29,065** directed parent–child splits, merges, and continuity transitions.
* **100% Synthetic Data Guarantee:** Fully generated algorithmically with zero PII, real citizen names, or real land titles.

| Survey Generation | Year | Record Count | Structural Role |
|:---|:---:|:---:|:---|
| **CS (Cadastral Survey)** | 1940 | 3,000 | Lineage root ancestral parcels |
| **SA (State Acquisition Survey)** | 1962 | 6,000 | Primary post-zamindari land splits and continuations |
| **RS (Revisional Survey)** | 1988 | 9,000 | Mid-century sub-divisions and agricultural-to-urban plots |
| **BS (City / Bangladesh Survey)** | 2021 | 12,000 | Modern urban leaf parcels and high-density subdivisions |

#### Injected Anomaly Test Coverage:
| Anomaly Category | Records | Verification Challenge |
|:---|:---:|:---|
| **`AREA_INFLATION`** | 319 | Downstream parcel area artificially expanded exceeding parent khatian without partition deed |
| **`MISSING_ANCESTOR`** | 167 | Post-CS survey parcel lacking ancestral record reference (`transition_type: ORPHAN`) |
| **`DUPLICATE_DAG_DISJOINT_GENEALOGY`** | 115 | Same dag number injected across unrelated genealogical trees |
| **`NONE` (Normal Verified)** | 29,399 | Clean, continuous lineage satisfying mathematical area conservation |

---

### 2. Feature Engineering (Zero Data Leakage)
To prevent misleading validation scores, models are trained **strictly without label-derived columns** (`anomaly_type`, `area_conservation_status`, `outgoing_area_check`, `lineage_status`). Instead, 22 mathematical and graph-topological features are engineered from raw graph traversal:

1. **`area_ratio`:** Ratio of child parcel area to cumulative parent area.
2. **`area_diff`:** Absolute shotok variance between parent and child generations.
3. **`inflation_pct`:** Percentage increase of child area relative to parent allocation.
4. **`parent_child_excess`:** Volume of boundary conservation deficit on outgoing parent edges.
5. **`parent_child_excess_ratio`:** Proportion of children area sum relative to ancestral plot size.
6. **`in_degree` / `out_degree`:** Direct incoming parents (merges) and outgoing children (splits).
7. **`sibling_count`:** Number of sibling parcels created from the same parental partition.
8. **`is_orphan`:** Flag for non-CS parcels missing parent references.
9. **`dag_fam_count`:** Number of distinct family genealogies claiming the same dag number.
10. **`dag_disjoint_conflict`:** Binary indicator of multi-family dag collision.
11. **`is_foreign_genealogy`:** Cross-lineage genealogical partition conflict.
12. **`survey_gen_code` & `survey_year`:** Generational temporal encodings.

---

### 3. Quantitative Model Benchmarks

Models are evaluated on a **held-out test set of 7,535 parcels** partitioned via **`GroupShuffleSplit` by `lineage_id`** (preventing related parcels from leaking between train and test sets):

| Evaluation Metric | XGBoost (Supervised Risk Classifier) | Isolation Forest (Unsupervised Baseline) |
|:---|:---:|:---:|
| **ROC-AUC Score** | **0.9909** | 0.8124 |
| **PR-AUC Score** | **0.8514** | 0.1840 |
| **Overall Accuracy** | **99.15%** | 97.45% |
| **Recall (Fraud Class)** | **83.72%** | 42.64% |
| **Precision (Fraud Class)** | **71.52%** | 18.25% |
| **F1-Score (Fraud Class)** | **0.7714** | 0.2558 |
| **Optimal Decision Threshold** | **0.70** | Contamination 0.02 |

#### Confusion Matrix (7,535 Held-Out Test Parcels):
```
                       PREDICTED NORMAL    PREDICTED ANOMALY
ACTUAL NORMAL (0)           7,363                 43          (99.42% Specificity)
ACTUAL ANOMALY (1)             21                108          (83.72% Sensitivity)
```

---

### 4. Explainable AI (XAI) with SHAP

Probaho integrates **TreeSHAP** (`shap.TreeExplainer`) to provide court-admissible, transparent explanations:

* **SHAP Beeswarm Summary (`ml/plots/shap_summary_beeswarm.png`):** Shows global distribution of feature impacts across the entire cadastral callset. High `area_ratio`, large `parent_child_excess`, and `is_orphan` push predictions decisively into the high-risk fraud zone.
* **Feature Importance Ranking (`ml/plots/shap_feature_importance_bar.png`):** Identifies `area_ratio`, `sibling_count`, `parent_child_excess_ratio`, and `area_diff` as the top 4 mathematical predictors of cadastral fraud.
* **Individual Parcel Waterfall (`ml/plots/shap_waterfall_anomaly.png`):** Reconstructs the exact reasoning for individual flagged parcels (e.g., Parcel `PL-1962-000081`), showing how each topological signal shifted the base risk expectation $\mathbb{E}[f(x)]$.
* **ROC & PR Curves (`ml/plots/roc_pr_curves.png`):** High-resolution performance curves demonstrating high recall under severe class imbalance.

---

### 5. Running the ML Pipeline Locally
```bash
# 1. Install ML dependencies
python -m pip install xgboost shap networkx scikit-learn pandas numpy matplotlib seaborn joblib

# 2. Execute full training, validation & plot generation
python ml/train_lineage_models.py

# 3. Launch interactive Jupyter Notebook
jupyter notebook ml/probaho_novelty1_ml_pipeline.ipynb
```

---

## 🎬 5-Minute Live Story Demo Protocol

Probaho includes an interactive **Live Story Controller** built directly into the UI for track presentations:

| Step | Action | What Judges See |
|:---:|:---|:---|
| **1** | **Clean Baseline Plot** | Inspect Dag 1042 (Dhanmondi). 4-generation lineage tree (CS→SA→RS→BS) with 0.0% area variance, green Trust Report, and 4/100 risk score. |
| **2** | **Office A Soft-Lock** | Simulate Tejgaon Sub-Registry initiating deed processing. Plot transitions to `🔒 SOFT-LOCKED` with reservation token `#RES-794021`. |
| **3** | **Office B Double-Sale Attack** | Simulate Gulshan Sub-Registry attempting a simultaneous deed. The system blocks the transaction live with a `409 Concurrency Conflict`. |
| **4** | **Database Tamper Simulation** | Directly edit a historical database record (e.g., modifying RS area from 14.5 to 22.0 shotok). The hash chain severs into bright red and the Merkle root is invalidated. |
| **5** | **Bangla Fuzzy Matching** | Compare deed names (`মোহাম্মদ রফিকুল ইসলাম` vs `মুহাম্মদ রফিকুল ইসলাম`). The engine displays a 96.8% match with plain-language linguistic reasoning. |
| **6** | **Citizen QR Verification** | Launch the mobile-friendly smartphone Trust Report view via the scannable QR digital seal. |

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PROBAHO INTELLIGENCE SUITE                      │
├────────────────────────────────────────────────────────────────────────┤
│  1. Officer Dashboard & Studio      │  2. Citizen Verification Portal  │
│     • Lineage Graph Visualizer      │     • Deed QR Code Scanner       │
│     • Real-Time Concurrency Monitor │     • Plain-Language Trust Pass  │
│     • Tamper Alert Console          │     • 0-100 Risk Score Breakdown │
├────────────────────────────────────────────────────────────────────────┤
│                         JOMICHAIN FRAUD ENGINE                         │
│  • Topological Lineage Validator (CS → SA → RS → BS Area Math)         │
│  • Double-Sale Pre-Sale Reservation Lock Manager                       │
│  • Bangla Phonetic Normalizer & Unicode Orthography Matcher            │
│  • Explainable Multi-Signal Risk Scorer (Deterministic Rules + ML)     │
├────────────────────────────────────────────────────────────────────────┤
│                         CRYPTOGRAPHIC LEDGER                           │
│  • Lightweight Per-Plot Hash Chain: SHA-256(prev_hash + data)          │
│  • Ed25519 Asymmetric Digital Signature Verification                   │
│  • Daily Sub-Registry Merkle Root Reconciliation                       │
├────────────────────────────────────────────────────────────────────────┤
│                           SYNTHETIC DATA LAYER                         │
│  • Synthetically Generated Mouzas, Dags, Khatians, and NID Owners      │
│  • Deterministic Mutation Timelines & Encumbrance Records              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🛡️ Rulebook Compliance & Synthetic Data Guarantee

| Criterion | Compliance Implementation |
|:---|:---|
| **100% Synthetic Data** | **Strictly enforced.** All citizen names, National ID numbers (NIDs), mouzas, and deed numbers in this repository are algorithmically generated synthetic test fixtures. Zero real citizen data or PII is used. |
| **No Scraping or Hacking** | Zero unauthorized web scrapers or private endpoints. Operates entirely as a standalone, secure system. |
| **Not a UI Re-skin** | Contains deep domain logic: graph topology checks, SHA-256 hash chains, Ed25519 signatures, cross-office distributed locks, and Bangla phonetic normalization. |
| **AI Tooling Disclosure** | Developed with assistance from Google DeepMind agentic tools and Gemini API for natural language and design synthesis. Code and architecture are fully documented and explainable. |
| **Nationwide Scalability** | By partitioning ledger chains per plot and publishing daily Merkle roots, individual sub-registry offices can operate independently offline/online and reconcile centrally without throughput bottlenecks. |

---

## 💻 Tech Stack

* **Machine Learning & Graph Analytics:**
  * **Python 3.10+** (Core ML runtime)
  * **XGBoost 3.4.1** (Supervised gradient boosted risk classification)
  * **SHAP 0.52.0** (Game-theoretic SHapley Additive exPlanations for XAI)
  * **NetworkX 3.7** (Directed Acyclic Graph topology & mathematical area conservation)
  * **Scikit-Learn 1.9.1** (Isolation Forest, GroupShuffleSplit & precision-recall metrics)
  * **Pandas 3.0 & NumPy 2.5** (High-performance cadastral tabular feature engineering)
* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS (Design Tokens System), Lucide React
* **Motion & Graphics:** Motion (Framer Motion), Custom Architectural SVG Rendering Engine
* **Cryptography:** SHA-256 Digesting, Ed25519 Digital Signature Schemas, Merkle Tree Proofs
* **Algorithms:** Directed Acyclic Graph (DAG) Traversal, Levenshtein Distance, Bangla Phonetic Normalization

---

## 🚀 Quick Start & Local Setup

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** or **bun**

### 1. Clone the Repository
```bash
git clone https://github.com/Tanvir4n/Probaho.git
cd Probaho
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the sample environment file and add your Google Gemini API key if you wish to run LLM extraction features:
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to explore Probaho and the JomiChain live demo.

### 5. Validate TypeScript & Production Build
```bash
# Type check with 0 errors
npm run lint

# Production bundle compilation
npm run build
```

---

## 📂 Project Structure

```
Probaho/
├── hero.svg                                    # Architectural Cadastral Hero SVG Artwork
├── README.md                                   # Documentation, Workflows & Rulebook Specs
├── probaho_novelty1_survey_lineage_30000.csv   # 30,000-Row Synthetic Survey-Lineage Dataset
├── probaho_novelty1_lineage_edges.csv          # 29,065 Normalized Parent-Child Graph Edges
├── probaho_novelty1_data_dictionary.md         # Lineage Data Dictionary & Validation Guide
├── ml/                                         # Novelty 1 Machine Learning & XAI Suite
│   ├── README.md                               # ML Architecture & Benchmark Documentation
│   ├── train_lineage_models.py                 # Production Training & Evaluation Script
│   ├── probaho_novelty1_ml_pipeline.ipynb      # Interactive Step-by-Step Jupyter Notebook
│   ├── models/
│   │   ├── probaho_xgboost_lineage.json        # Trained XGBoost Risk Classifier
│   │   ├── probaho_xgboost_multiclass.json     # Trained Multi-Class Anomaly Model
│   │   ├── probaho_isolation_forest.joblib     # Trained Isolation Forest Detector
│   │   ├── evaluation_metrics.json             # ROC-AUC (0.9909), PR-AUC (0.8514) Benchmarks
│   │   └── sample_shap_waterfall.json          # Precomputed SHAP Waterfall Payload
│   └── plots/
│       ├── shap_summary_beeswarm.png           # Global Feature Impact Beeswarm Plot
│       ├── shap_feature_importance_bar.png     # Feature Importance Ranking Bar Chart
│       ├── shap_waterfall_anomaly.png          # Individual Parcel Waterfall Attribution
│       ├── roc_pr_curves.png                   # High-Resolution ROC & PR Curves
│       └── confusion_matrix.png                # Confusion Matrix Heatmap
├── src/
│   ├── components/
│   │   ├── JomiChainSection.tsx                # Plot Passport, 5 Novelties & Live Story Demo
│   │   ├── ShapXaiExplainer.tsx                # Interactive SHAP XAI Waterfall & Tornado Studio
│   │   ├── RiskAnalyticsDashboard.tsx          # Real-Time Cadastral Risk Telemetry Dashboard
│   │   ├── ProbahoHeroSvg.tsx                  # In-App Cadastral Hero SVG Component
│   │   ├── ProbahoLogo.tsx                     # Precision Brandmark & Fluid Flow Monogram
│   │   ├── MassGlassSidebar.tsx                # Viewport-Fixed Glassmorphic Telemetry Dock
│   │   ├── PageTransitionEffect.tsx            # Luminous Progress Runner & Shutter Beam Wipe
│   │   ├── MassMarketingView.tsx               # Main Platform Viewport & Suite Integrator
│   │   ├── MassPricingSection.tsx              # Tiered Institutional Access Plans
│   │   └── ArchitecturalBackground.tsx         # Cadastral Grid & Coordinate Canvas
│   ├── data/
│   │   └── tokens.ts                           # Design Tokens, Plot Datasets & Tool Schemas
│   ├── context/
│   │   ├── ThemeContext.tsx                    # Day/Night Architectural Color Mode Context
│   │   └── LanguageContext.tsx                 # Bilingual EN ⇄ বাংলা Context Provider
│   ├── App.tsx                                 # Root Application Scaffold
│   └── index.css                               # Global Design System Tokens & Glassmorphism
└── vite.config.ts                              # Vite Configuration & Dev Server Rules
```

---

## 👥 Contributors & Team Members

* **Core Engineering & Architecture:**
  * **Md. Tanvir Hasan** — System Architecture, Cryptographic Ledger & Full-Stack Engineering ([@Tanvir4n](https://github.com/Tanvir4n))
  * **Sourav Ghosh** — Platform Engineering, Investigation Telemetry & Research
* **Project Name:** Probaho (প্রবাহ)
* **Repository:** [Tanvir4n/Probaho](https://github.com/Tanvir4n/Probaho)

---

## 📄 License

This project is licensed under the **Apache License, Version 2.0** — see the [LICENSE](LICENSE) file for complete details.

<div align="center">
<sub>“Every plot has a story. Make it tamper-proof.” — Probaho Land Fraud Intelligence</sub>
</div>

