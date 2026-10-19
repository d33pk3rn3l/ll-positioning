# STATUS

Last update: 2026-10-19 (ll-lead). A fresh session needs only CHARTER.md,
STATUS.md and DECISIONS.md.

## Phase

Kickoff. Benedikt said GO on 2026-10-19. Next gate: G1 (frame and requirements). Date TBD.

## Merged and open pull requests (update 2026-10-19)

Merged:

| Pull request | Merge commit | Content |
|---|---|---|
| #25 | `6ed74b8` | Status and review state |
| #15 | `ea29616` | Source notes, batch 1 |
| #23 | `dc22bbc` | Source values format version 2 and its check. Closes issues #22 and #24. |
| #21 | `ac93f8f` | Source notes, batch 2, and `docs/sources/values.csv`. The table has 388 rows. The check gives 0 errors and 0 warnings. |
| #28 | `be502b6` | Remove `uGal/sqrt(Hz)` from the averaging-time warning. This is item 3 of issue #26. |

Open:

| Item | State | Reviewer |
|---|---|---|
| Pull request #27, density source notes | Draft | prof-payload |
| Issue #26 | Open for item 1 (checked transform direction) and item 2 (split of the other height references). Item 3 is done by pull request #28. | - |

## This week (week of 2026-10-19)

| # | Item | Obj | Owner | State |
|---|------|-----|-------|-------|
| 1 | CHARTER, STATUS, DECISIONS drafted; charter approved by PI | all | ll-lead | Merged 2026-10-19 (PR #3) |
| 2 | Frame and state definition note (`docs/frames.md`) | O1 | ll-lead | PR #12 v0.2 under re-review |
| 3 | Trace table skeleton (`docs/requirements-trace.md`) with layer, time-scale and "needs ~10x?" columns | O3 | ll-lead | PR #12 v0.2 under re-review |
| 4 | First bibliography, 10-15 primary sources (`docs/sources/`, `refs.bib`) | O1, O2, O3, O4 | ll-scout | In progress |
| 5 | Repo audit issues; fix 3 baseline bugs; label unsourced numbers in code | O5 | ll-engineer | PRs #9, #11, #13 merged 2026-10-19. PR #14 merged 2026-10-19 (3af7a0c). #5 (ME/PA fix) is still being built by ll-engineer. Issue #16 is in progress (ll-engineer): conops motion/slip audit (reviewer prof-geodesy) |

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
- Work in progress: PRs #9, #11 and #13 merged on 2026-10-19. PR #14 merged on 2026-10-19 (3af7a0c). PR #12 is at v0.2 and is under re-review. #5 (ME/PA fix) is still being built by ll-engineer. Issue #16 is in progress (ll-engineer): conops motion and slip audit (reviewer prof-geodesy).
- Open: IMU or inclinometer bias spec is TBD. Tilt from bias on the Moon is about 6 times the tilt on Earth. A 0.2 mrad levelling residual [assumption, no source; old value traced to MER sun sensor 0.2 deg, not 0.2 mrad] needs a bias of 33 µg or better. The 33 µg bias is derived from that assumption. IMU north-finding is excluded on the Moon. The gyro bias would need to be below 0.0005 deg/h [derived].
- Open for Benedikt: Approve D-011 (spectrometer scope). Set the gate dates (Q3). Charter text is on main (PR #3, merged 2026-10-19). Platform (Q1) is closed by D-012.

## Blockers / waiting on PI

- Charter text is on main (PR #3, merged 2026-10-19).
- Brief text committed as docs/brief.md (done).
- Platform decided (D-012, approved by PI, 2026-10-19): walking quadruped similar to ANYmal, no jumping.
- Professor confirmations on charter: prof-geodesy no objection, prof-payload no objection (2026-10-19, group chat).
- Gate dates (Q3) still TBD.
- D-011 spectrometer scope still proposed.
- New questions for the PI or the science team (2026-10-19). The full text is in `docs/requirements-trace.md`, section 4.1, items 9 to 11:
  - Gravity station spacing: about 1 m or 10 m.
  - Gravity product: magnitude or vector. The words "gravity vector" do not answer this.
  - How the science team gets the rock density near the pit.
- IMU or inclinometer bias spec TBD. The 33 µg bias is derived from the 0.2 mrad levelling residual assumption [assumption, no source; old value traced to MER sun sensor 0.2 deg, not 0.2 mrad]. IMU north-finding is excluded on the Moon (gyro bias would need to be below 0.0005 deg/h [derived]).

## Source notes not yet reviewed

These notes are in the repo on main. No value from these seven notes may go into any budget until prof-geodesy has reviewed them on main. Until then they are "not for budget use".

Not yet reviewed by prof-geodesy:

- archinal2018wgccre
- fienga2024lunarframes
- barker2025lolalra
- henriksen2016nac
- collins2026nacmosaics
- ashby2024clock
- wagner2017anthro

## Source notes reviewed

Reviewed by prof-payload, pass:

- li2020ce4lpr
- mittelholz2026ll
- kolvenbach2026ll
- noeker2022wpm
- urbancic2017a17
- eisenman2001mercam

Changes to numbers from that review:

- Gravity station height, relative: the old 0.25 m (free-air only) is removed. The new design value is 0.38 m [derived]. See the row "Gravity station height, relative" in `docs/requirements-trace.md`, section 3.7.
- Imaging attitude: the value is TBD. It is not derived from 0.25 mrad. See section 3.7 of `docs/requirements-trace.md`.
- The note urbancic2017a17 has an unverified line of 2.5 mGal.

Pull request #18 is merged. The mean Earth to principal axes transform is applied. Its size is not a 1-sigma value. A frame mistag is a fault flag.

Pull request #20 is merged. It is the platform motion audit.

Issue #22 is closed by pull request #23 (source values format version 2 and its check).

The PI set the scope for this iteration on 2026-10-19. See decision 15, Simple standard interfaces for this iteration. The robot interface, the science interface, and the tie-source interface are short input sheets. Each value has a 1-sigma value or a bound. Each value has a growth type. The growth type is fixed, grows with the distance walked, or is random at each point. Each value has a source label, or the value is TBD. This iteration has no foot-slip model. It has no leg model. It has no model of the inside of an instrument. Extend a sheet only when a verdict needs the extra detail.

See also decision 14, Uncertainty of the mean Earth to principal axes transform.
