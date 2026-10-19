# DECISIONS

Log of decisions. Status values: proposed / approved (by PI) / superseded.
Newest at the bottom. Do not edit an approved entry; supersede it.

| ID | Date | Decision | Why | Status | By |
|----|------|----------|-----|--------|----|
| D-000 | 2026-10-19 | Pre-2026-10-19 repo content is an unreviewed baseline. No decision, number or requirement in it is adopted without fresh review. | Clean start; content came from an earlier side experiment. | approved (brief / role setup) | Benedikt |
| D-001 | 2026-10-19 | Keep four knowledge layers separate: local, map-relative, cartographic, inertial. | Different error sources and uses; one number hides what science needs. | proposed | ll-lead |
| D-002 | 2026-10-19 | Every number is labelled sourced / derived / TBD. | Traceability for gates. | proposed | ll-lead |
| D-003 | 2026-10-19 | "50 µGal requirement" and 0.10 m vertical allocation from baseline are not adopted. Gravimetry requirement is TBD until a payload source exists. | No science basis (agreed by prof-payload). | proposed | ll-lead |
| D-004 | 2026-10-19 | The brief's "~10x" is an expectation, not a requirement. The trace table shows per instrument whether science needs it. | prof-payload comment, 2026-10-19. | proposed | ll-lead |
| D-005 | 2026-10-19 | Baseline navigation core (`src/assessment.mjs`) will be replaced, not tuned. No new nav model before G1. | Audit findings (see STATUS.md). | proposed | ll-lead |
| D-006 | 2026-10-19 | O1-O5 in docs/brief.md is the official objective list. Q1-Q5 in src/mission-model.mjs is baseline text only. | One trace root. | proposed | ll-lead |
| D-007 | 2026-10-19 | Issue #5: apply ME-to-PA as a transform and report it as a separate bias field with its own uncertainty (TBD until sourced); remove it from every 1-sigma. | Norm 3; prof-geodesy cold read. | proposed | ll-lead |
| D-008 | 2026-10-19 | B4 (an uninformative tie improves the estimate): no patch to the baseline core. Add an expected-failure test "removing information must not improve any sigma"; the replacement core must pass it. | D-005. | proposed | ll-lead |
| D-009 | 2026-10-19 | Cool-down stops are zero-velocity updates in the local layer (O1, O5), not O2 tie points. The <0.25 m free-air target is treated as relative station-to-station height until Mittelholz 2026 is checked; if absolute, it is a major item. Time scale named in docs/frames.md; millisecond sync is the working assumption unless a payload needs better. | prof-geodesy reading-list notes. | proposed | ll-lead |
| D-010 | 2026-10-19 | Trace table gets a separate row for DEM/terrain registration in the map-relative layer (gravity terrain correction). | prof-payload; baseline DEM term is 218 of 223 µGal. | proposed | ll-lead |
| D-011 | 2026-10-19 | The spectrometer is out of scope for O3. The brief names only the gravimeter, GPR and imaging. The spectrometer can appear in the trace table as an extra, with no navigation requirements derived from it. | Raised by prof-payload in the PR #9 review. | proposed (waiting for Benedikt) | ll-lead |
| D-012 | 2026-10-19 | Platform is a walking quadruped similar to ANYmal, no jumping. Speed, body motion, standing stability and IMU specs are TBD until ll-scout finds ANYmal sources. Kolvenbach 2026 does not give them. | Decided by PI (k3rn3l), 2026-10-19. | approved (PI) | k3rn3l |
| D-013 | 2026-10-19 | Merge delegation. A PR is ready when the right professor gives pass or pass with review items, no major item is open, and CI is green. The author never merges their own PR. ll-lead merges code PRs. ll-engineer merges ll-lead docs PRs after both professors have no objection. ll-lead may accept a proposed decision after both professors agree, unless it changes scope, and logs it. Escalate to the PI for a gate go or no-go, a scope change, a requirement with no science basis, a disagreement between a professor and ll-lead, or a sign-in or approval. Gate go/no-go (G1-G3) stays with the PI; only merges and acceptance of non-scope decisions are delegated (PI confirmed 2026-10-19). | Decided by PI, 2026-10-19. | approved (PI) | PI |
| D-014 | 2026-10-19 | Uncertainty of the mean Earth to principal axes transform. Use 1.7 m. This value is used as a conservative 1-sigma. The source gives it as an author judgement, not as a 1-sigma. It is common to every point of the traverse. It is a conservative value. The label is exactly [sourced: williams2013de430, author judgement for DE430; assumed to apply to DE440 PA to DE421 ME]. The difference between the DE421 mean Earth frame and the DE440 mean Earth frame is a separate term. The maximum difference is 53.4 cm from the year 2000 to the year 2040. This maximum is not a 1-sigma value. The source is naif2025moonfk. Use this term only when products from the two realizations are mixed. | Both professors had no objection. | accepted by ll-lead | ll-lead |
| D-015 | 2026-10-19 | Simple standard interfaces for this iteration. The robot interface, the science interface, and the tie-source interface are short input sheets. Each value has a 1-sigma value or a bound. Each value has a growth type: fixed, grows with the distance walked, or random at each point. Each value has a source label, or the value is TBD. Each tie-source value also names its frame realization. A science need typed in directly is labelled "stated by science, not derived". This iteration has no foot-slip model, no leg model, and no model of the inside of an instrument. Extend a sheet only when a verdict needs the extra detail. | The PI set this scope on 2026-10-19. | decided by the PI | PI |

## Baseline assertions pending review (not decisions)

These appear in the old repo. They have no status until reviewed:
- Default frame DE440 with DE421-aligned ME.
- Heights as center-of-mass radius, h = r - 1,737,400 m.
- Rover tracks rejected as a geodetic source.
- Assumptions A1, A3-A6 in `src/mission-model.mjs` marked "baseline".
