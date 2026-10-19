# STATUS

Last update: 2026-10-19 (ll-lead). A fresh session needs only CHARTER.md,
STATUS.md and DECISIONS.md.

## Phase

Kickoff. Benedikt said GO on 2026-10-19. Next gate: G1 (frame and requirements). Date TBD.

## This week (week of 2026-10-19)

| # | Item | Obj | Owner | State |
|---|------|-----|-------|-------|
| 1 | CHARTER, STATUS, DECISIONS drafted; charter approved by PI | all | ll-lead | Draft in PR |
| 2 | Frame and state definition note (`docs/frames.md`) | O1 | ll-lead | Not started |
| 3 | Trace table skeleton (`docs/requirements-trace.md`) with layer, time-scale and "needs ~10x?" columns | O3 | ll-lead | Not started |
| 4 | First bibliography, 10-15 primary sources (`docs/sources/`, `refs.bib`) | O1, O2, O3, O4 | ll-scout | In progress |
| 5 | Repo audit issues; fix 3 baseline bugs; label unsourced numbers in code | O5 | ll-engineer | In progress: #4 bugs; #5-#8 opened |

Also running: cold read of brief and repo by prof-geodesy and prof-payload
(top 5 concerns each).

## Baseline audit (ll-lead, 2026-10-19)

- Keep after review: four-layer split; error-source list with correlation tags;
  layer-separation and monotonicity tests.
- Replace: navigation core in `src/assessment.mjs` (post-processed = 0.55 x RT
  instead of a derived value; map-relative falls back to local; ME-PA bias added
  into a 1-sigma; time not estimated; no accumulated tie-point uncertainty).
- Not adopted: "50 µGal requirement" and 0.10 m vertical allocation in
  `error-explorer.html`; inconsistent datum sigmas (10/2 m vs 12/1.5 m).
- Bugs: spectrometer stop-and-stare check always true; dimensionless ratios
  stored in field `uGal`; datum point always assumed present.

## Review items (2026-10-19)

- prof-geodesy, cool-down stops: Cool-down stops are zero-velocity updates in the local layer. They are not O2 tie points (see D-009).
- prof-geodesy, relative height: The relative height target (<0.25 m, source TBD) belongs in the local/relative layer. It is separate from cartographic accuracy (see D-009). This target is not checked yet. ll-scout must check it.
- prof-payload, DEM/terrain: The trace table gets its own DEM/terrain-correction row (D-010). The baseline value, 218 of 223 µGal, is a proxy. It is DEM height error times height sensitivity. It is not a size estimate. A terrain-correction error comes from the DEM error over the area around the station. The value is TBD until ll-scout checks Noeker & Karatekin 2022.
- Work in progress: PR #9 fixes bug 1 of issue #4 (stop-and-stare). prof-payload says pass with review items. One minor item remains: fix the label at `src/app.mjs:383` in the same PR. Issue #10 is open. It tracks B4 (D-008). ll-engineer accepts D-006 to D-009. Order of work: issue #4 bugs 2 and 3, then the D-006 comment, then #5, #10, #7, #6, #8.
- Open for Benedikt: Approve the charter (PR #3). Approve D-011 (spectrometer scope). Confirm the platform (Q1). Set the gate dates (Q3).

## Blockers / waiting on PI

- Charter approval.
- Brief text committed as docs/brief.md (done).
- Platform confirmation (quadruped?).
- Professor confirmations on charter: prof-geodesy no objection, prof-payload no objection (2026-10-19, group chat).
