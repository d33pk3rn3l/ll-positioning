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
| 5 | Repo audit issues; fix 3 baseline bugs; label unsourced numbers in code | O5 | ll-engineer | In progress |

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

## Blockers / waiting on PI

- Charter approval.
- Brief PDF into repo.
- Platform confirmation (quadruped?).
