# Probaho Novelty 1 — Synthetic Survey-Lineage Dataset

## Dataset summary
- **Rows:** 30,000 synthetic parcel-survey records
- **Survey generations:** CS (1940), SA (1962), RS (1988), BS (2021)
- **Generation distribution:** CS 3,000; SA 6,000; RS 9,000; BS 12,000
- **Encoding:** UTF-8 with BOM; CSV
- **Privacy:** entirely synthetic identifiers and owner tokens; no real NIDs, citizen names, or real land records
- **Random seed:** 20261018

## Schema

| Column | Type / example | Purpose |
|---|---|---|
| `record_id` | string, `PL-1940-000001` | Unique parcel-survey node ID |
| `lineage_id` | string, `LIN-000001` | Root lineage grouping identifier |
| `survey_generation` | enum: CS/SA/RS/BS | Survey generation |
| `survey_year` | integer: 1940/1962/1988/2021 | Survey year |
| `district` | synthetic category | Broad synthetic geography |
| `upazila` | synthetic category | Synthetic sub-district category |
| `mouza_id` | string | Synthetic mouza identifier |
| `dag_no` | string | Survey-generation dag identifier; anomalies may contain deliberate duplicates |
| `khatian_no` | string | Synthetic khatian identifier |
| `parcel_area_shotok` | float | Parcel area in shotok |
| `parent_record_ids` | semicolon-separated record IDs | One or more direct ancestors; empty for CS roots or injected missing-ancestor anomalies |
| `transition_type` | enum: ROOT/CONTINUATION/SPLIT_CHILD/MERGE/ORPHAN | Relationship to prior survey generation |
| `family_genealogy_id` | string | Synthetic genealogy partition; used to test dag collisions across disjoint families |
| `synthetic_owner_id` | token | Non-identifying synthetic owner token |
| `anomaly_type` | enum/string | `NONE`, `AREA_INFLATION`, `MISSING_ANCESTOR`, `DUPLICATE_DAG_DISJOINT_GENEALOGY` |
| `anomaly_injected` | boolean | Whether an anomaly was deliberately injected |
| `area_conservation_status` | PASS/FAIL/CHECK/REQUIRES_GRAPH_CHECK | Node-level/graph-level area validation result |
| `outgoing_area_check` | PASS/FAIL | Whether summed direct child areas exceed this parcel's area |
| `child_count` | integer | Number of direct descendants in the next survey generation |
| `sum_child_area_shotok` | float | Sum of direct child parcel areas |
| `lineage_status` | string | Result/label for lineage validation |
| `notes` | string | Short synthetic-data note |

## How to validate area conservation
For every parent record `p`, find all records whose `parent_record_ids` contains `p.record_id`, then verify:

`sum(child.parcel_area_shotok) <= p.parcel_area_shotok + tolerance`

Use a tolerance such as `0.01` shotok for rounding. `outgoing_area_check` is precomputed for convenience; recompute it from graph edges in your pipeline.

For merge nodes, `parcel_area_shotok` should be compared with the **sum of its parent areas**, while the parent-level child-sum rule must still be checked independently. A merge is represented by multiple IDs in `parent_record_ids`.

## Important research note
This is a synthetic engineering/demo dataset, not an authoritative cadastral dataset. Because splits and merges are represented in a single node table, `parent_record_ids` encodes edges as a semicolon-separated list. For rigorous graph analytics, normalize this into two tables:
1. `parcels.csv` — one row per survey parcel (this file)
2. `lineage_edges.csv` — one row per parent-child edge, with parent ID, child ID, survey transition, and optional area allocation.

Injected anomalies are for testing and demonstration; do not interpret their frequencies as real-world fraud prevalence.
