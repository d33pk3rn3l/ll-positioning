# Conops motion and slip audit

Issue #16 names this path. The audit covers `src/` on main at `3af7a0c`. It supports O1 and O5. It does not change code, tests, science assumptions, or the decision log.

## Criterion (D-012)

`DECISIONS.md` on that main commit records D-000 through D-011. It has no D-012 row. `CHARTER.md` question Q1 still asks whether the platform is a walking quadruped. `STATUS.md` still lists platform confirmation as open.

This audit uses the PI statement given with issue #16:

> The platform is a walking quadruped similar to ANYmal, with no jumping. Motion is stop-and-go at stations. The state uses leg odometry plus an IMU. Foot slip is an error source. Speed, body motion, standing stability, and IMU specs are TBD (no source yet).

`src/` does not name ANYmal. This file does not add ANYmal speed, mass, or stability figures.

Stop-and-go is read this way: the platform walks, and it stops at science stations. Continuous GPR and imaging during a walk stay consistent with that reading. A hop, a jump, or a ballistic phase would be inconsistent.

## How a row is classed

Motion assumption is one of: hop, ballistic, wheel, generic, legged.

Class against D-012:

- **consistent** — the claim matches the PI statement. A terrestrial prior may sit in this class when the same words leave the lunar figure open.
- **inconsistent** — the claim assumes a hop, a jump, a ballistic phase, or wheels as the platform motion.
- **unclear** — the claim is generic, adds a sensor the PI statement does not name, or fills a speed, body-motion, standing-stability, lunar slip, or IMU figure that D-012 leaves open.

Every number is **sourced**, **derived**, or **TBD/unsourced**. A row with no figure uses **no number**. Sourced would need a ref key in the repo. No motion or slip number in `src/` has a ref key. None is marked sourced.

A unit conversion (milliradian times 0.001 to make radians) is not its own row. The note on the source figure says the conversion is derived.

One term is one row. Later lines that only display or reuse that term are listed in the location cell.

## Search

Files: `src/mission-model.mjs`, `src/assessment.mjs`, `src/app.mjs`.

Words searched: hop, hopper, ballistic, jump, wheel, slip, odometry, gait, walk, stance, settle, creep, IMU, speed, vibration, belly, leveling, sinkage.

The search found no hop model, no ballistic model, no jump model, and no wheel model. The word "hopper" appears once, in assumption A1, which says the platform is a walking quadruped.

`src/app.mjs` defines no new motion or slip figure. Its display lines are on the owning row.

## Result

| Class | Rows |
|-------|------|
| consistent | 22 |
| inconsistent | 0 |
| unclear | 23 |
| total | 45 |

No row is inconsistent. There is no separate code issue to open for a forbidden motion mode. The unclear rows are listed at the end for ll-lead. This audit does not open those issues.

## Terms

| Location | Term | Value | Unit | Motion | Class | Number label | Note |
|----------|------|-------|------|--------|-------|--------------|------|
| `src/mission-model.mjs:63` | `FRAMES.body` | none | — | legged | consistent | no number | — |
| `src/mission-model.mjs:102-108` | `rover_tracks` | 0.5–1; ~23; 50 | m/px; cm; cm/px | legged | consistent | TBD/unsourced | — |
| `src/mission-model.mjs:130-136` | `leg_slip` | ~1; no mm figure | % of distance; units text also says mm | legged | consistent | TBD/unsourced | — |
| `src/mission-model.mjs:139-145` | `vo_drift` | 1–4; lunar figure absent | % of distance | generic | unclear | TBD/unsourced | D-012 names leg odometry and an IMU. This term is visual-odometry drift. The 1–4% words are terrestrial and have no ref key. |
| `src/mission-model.mjs:148-154` | `imu_bias` | none | m/s², rad/s | generic | consistent | no number | — |
| `src/mission-model.mjs:180-185` | `timing` | v absent | s to m | generic | unclear | TBD/unsourced | The unit line turns time into distance with speed v. D-012 says speed has no source. The term names no walk, hop, or wheel. |
| `src/mission-model.mjs:202-208` | `tilt_settle` | none | mrad | legged | consistent | no number | — |
| `src/mission-model.mjs:225-231` | `gait_vibration` | none | cm, rad | legged | consistent | no number | — |
| `src/mission-model.mjs:238` | `active_leveling.residualDefault_mrad` | 0.2 | mrad | legged | unclear | TBD/unsourced | Residual after active body leveling at a station. D-012 leaves body motion and standing stability open. No ref in `src/`. The scenario default repeats 0.2 mrad. |
| `src/mission-model.mjs:244` | `locked_gravity_stance.residualDefault_mrad` | 0.1 | mrad | legged | unclear | TBD/unsourced | Residual of a locked stance. Standing stability has no source in D-012. The scenario foot-creep default repeats 0.1 mrad. |
| `src/mission-model.mjs:250` | `fixed_belly_height.residualHeight_cm` | 1.0 | cm | legged | unclear | TBD/unsourced | Belly-height change during a gait. Body motion has no source in D-012. The GPR model repeats this size as 0.01 m. |
| `src/mission-model.mjs:256` | `downward_range.residualHeight_cm` | 0.5 | cm | generic | unclear | TBD/unsourced | Height residual of a downward range sensor. It is a body-motion size. No source. The term names no gait. |
| `src/mission-model.mjs:259-264`; `src/app.mjs:400` | `stop_and_stare` | none | — | legged | consistent | no number | — |
| `src/mission-model.mjs:265-270` | `base_reoccupation` | none | — | legged | consistent | no number | — |
| `src/mission-model.mjs:274-281` | `local_rt` | none | — | legged | unclear | no number | The name includes leg odometry and an IMU, which matches D-012. It also includes visual odometry, which D-012 does not name. The description is contact-aided dead reckoning, so the feet stay in contact. |
| `src/mission-model.mjs:319-324` | `gravity_network` | continuous false | — | legged | consistent | no number | — |
| `src/mission-model.mjs:325-331` | `gpr_2d` | continuous true | — | legged | consistent | no number | — |
| `src/mission-model.mjs:332-338` | `gpr_3d` | continuous true | — | legged | consistent | no number | — |
| `src/mission-model.mjs:339-344` | `spectro_stare` | continuous false | — | legged | consistent | no number | — |
| `src/mission-model.mjs:345-350` | `imaging_walk` | continuous true | — | legged | consistent | no number | — |
| `src/mission-model.mjs:403` | `terrestrial_nominal_pct` | 1.5 | % of distance | legged | consistent | TBD/unsourced | — |
| `src/mission-model.mjs:404` | `terrestrial_range_pct` | 1 to 2 | % of distance | legged | consistent | TBD/unsourced | — |
| `src/mission-model.mjs:405` | `lunar_tbd_prior_pct` | 2.0 | % of distance | legged | unclear | TBD/unsourced | The field name says the lunar value is TBD. D-012 gives no slip percent. The default scenario copies this 2% and the model runs it. No ref key. |
| `src/mission-model.mjs:406` | `lunar_degraded_pct` | 6.0 | % of distance | legged | unclear | TBD/unsourced | Degraded lunar slip case. No source in `src/`. The form is still a legged percent of distance. |
| `src/mission-model.mjs:407`; `src/app.mjs:429` | `odometry.evidence` | ~1–2 | % of distance | legged | consistent | TBD/unsourced | — |
| `src/mission-model.mjs:448` | `A1` | none | — | legged | consistent | no number | — |
| `src/mission-model.mjs:453` | `A2` | 1–2 | % of distance | legged | consistent | TBD/unsourced | — |
| `src/mission-model.mjs:463` | `A4` | none | — | legged | consistent | no number | — |
| `src/mission-model.mjs:483`; `src/assessment.mjs:291, 295, 300, 432, 442, 568` | `walkSpeed_m_per_s` | 0.15 | m/s | legged | unclear | TBD/unsourced | D-012 says speed has no source. 0.15 m/s has no ref in `src/`. The walk-time lines use this default. |
| `src/mission-model.mjs:485`; `src/assessment.mjs:292, 294`; `src/app.mjs:37, 80, 102` | `settle_s` | 600 | s | legged | unclear | TBD/unsourced | Stop time before a gravity sample. D-012 gives no settle time. Standing stability, which sets that time, is TBD. No source in `src/`. |
| `src/mission-model.mjs:489`; `src/assessment.mjs:145`; `src/app.mjs:33, 76, 98` | `odometryPct` | 2.0 | % of distance | legged | unclear | derived | Copy of `lunar_tbd_prior_pct`. That preset is TBD/unsourced. `assessment.mjs:145` turns the copy into the distance fraction k. |
| `src/mission-model.mjs:494`; `src/assessment.mjs:352, 384` | `levelingResidual_mrad` | 0.2 | mrad | legged | unclear | TBD/unsourced | Same 0.2 mrad as `active_leveling`. Line 352 multiplies by 0.001 to make radians. That factor is a unit conversion (derived). The 0.2 mrad has no source. |
| `src/mission-model.mjs:495`; `src/assessment.mjs:353, 384` | `tiltKnowledge_mrad` | 0.15 | mrad | generic | unclear | TBD/unsourced | Attitude knowledge at a station. D-012 says IMU specs have no source. The file does not name the sensor for this angle. The 0.001 factor on line 353 is a unit conversion (derived). |
| `src/mission-model.mjs:496`; `src/assessment.mjs:354, 384` | `footCreep_mrad` | 0.1 | mrad | legged | unclear | TBD/unsourced | Foot creep during a locked stop. Same 0.1 mrad as `locked_gravity_stance`. Slip during a dwell matches the error type. The size has no source. The 0.001 factor on line 354 is a unit conversion (derived). |
| `src/mission-model.mjs:509-511`; `src/app.mjs:45-47, 88-90` | `fixedBellyHeight`, `activeLeveling`, `lockedStance` | true | — | legged | consistent | no number | — |
| `src/assessment.mjs:145, 190, 215` | `k` | odometry percent / 100 | fraction of distance | generic | unclear | derived | k is a fraction of path length. The input is the unsourced 2% prior. Along-track growth uses this fraction at lines 190 and 215. |
| `src/assessment.mjs:191, 216` | cross-track factor | 0.8 | fraction of the along-track rate | legged | unclear | TBD/unsourced | The comment on line 189 says contact plus visual odometry. D-012 does not give this factor. No ref. |
| `src/assessment.mjs:192, 217` | vertical factor | 0.4 | fraction of the along-track rate | legged | unclear | TBD/unsourced | Vertical rate is 0.4 times the along-track rate. The same comment applies. No ref. |
| `src/assessment.mjs:291, 432, 442, 568` | walk-time floor | 0.01 | m/s | generic | unclear | derived | These lines use 0.01 m/s as a lower clamp so a zero speed leaves the walk time finite. The file does not call it a platform speed. D-012 leaves speed open, so the figure stays unclear. |
| `src/assessment.mjs:352` | leveling fallback | 0.002 | rad | legged | unclear | TBD/unsourced | Used when active leveling is off. Standing-stability angle. No source. |
| `src/assessment.mjs:354` | creep fallback | 0.001 | rad | legged | unclear | TBD/unsourced | Used when the locked stance is off. Foot-creep angle. No source. |
| `src/assessment.mjs:425, 504`; `src/app.mjs:398` | fixed-belly residual | 0.01 | m | legged | unclear | TBD/unsourced | Same 1.0 cm as `fixed_belly_height`. The comment on lines 501–503 says this denominator is unsourced. Body motion is TBD in D-012. |
| `src/assessment.mjs:425`; `src/app.mjs:398` | free-gait belly residual | 0.05 | m | legged | unclear | TBD/unsourced | Height residual when the belly height is not fixed. No source. Body motion is TBD in D-012. |
| `src/assessment.mjs:431` | continuous-walking comment | none | — | legged | consistent | no number | — |
| `src/assessment.mjs:569` | `walking traverse` label | none | — | legged | consistent | no number | — |

What the consistent rows claim, in short:

- The body frame, A1, A4, and `rover_tracks` call the platform a quadruped. A1 also says it is a walking machine and that gravity is stop-and-go. A1 is the hopper sentence.
- `leg_slip` treats foot slip, sinkage, and settlement as an error. Its evidence line says the lunar size is TBD. The ~1% words name terrestrial VILENS / Cerberus and have no ref key.
- `imu_bias` keeps an IMU in the state and stores no bias or scale figure.
- `tilt_settle` and `gait_vibration` name foot creep and a periodic gait. They store no size.
- `stop_and_stare`, `base_reoccupation`, and `gravity_network` are stops at stations, with a walk back to a check station.
- `gpr_2d`, `gpr_3d`, `imaging_walk`, the continuous-walking comment, and the walking-traverse label are walks. `spectro_stare` is a stop. D-011 leaves the spectrometer out of O3. The motion class here is only about the stop.
- `terrestrial_nominal_pct`, `terrestrial_range_pct`, `odometry.evidence`, and A2 are terrestrial legged priors. A2 says the lunar regolith figure is TBD and that 1–2% is a sensitivity prior. Those percents have no ref key.
- The three scenario flags turn leveling, a locked stance, and a fixed belly height on. The sizes are the unclear rows above.
- `rover_tracks` uses 0.5–1 m/px, an LRV track width of ~23 cm, and 50 cm/px. The platform words are "small quadruped". The evidence line is "LROC imaging notes on LRV track visibility", with no ref key. Those three figures are image scales.

## Unsourced figures

These numbers have no ref key in `src/`. They are the TBD/unsourced cells above.

| Figure | Where | Why it stays open |
|--------|-------|-------------------|
| ~1% | `leg_slip` evidence | Terrestrial name only. Lunar size is absent. |
| 1–4% | `vo_drift` evidence | Terrestrial visual odometry. No ref key. |
| 0.2 mrad | leveling mitigation and scenario | Body leveling / standing stability. |
| 0.1 mrad | locked stance and `footCreep_mrad` | Standing stability / foot creep. |
| 1.0 cm and 0.01 m | belly mitigation and GPR residual | Same body-motion size, two units. |
| 0.5 cm | downward range | Body or antenna height. |
| 1.5%, 1–2%, ~1–2% | terrestrial odometry preset, evidence, A2 | Terrestrial prior. No ref key. |
| 2.0%, 6.0% | lunar odometry preset and `odometryPct` | Lunar slip rate. The 2% is the value the model runs. |
| 0.15 m/s | `walkSpeed_m_per_s` | Platform speed. |
| 600 s | `settle_s` | Station settle time. |
| 0.15 mrad | `tiltKnowledge_mrad` | Attitude knowledge. Sensor not named. |
| 0.8 and 0.4 | cross-track and vertical factors | Odometry shape. Comment cites contact and visual odometry. |
| 0.002 rad and 0.001 rad | leveling and creep fallbacks | Standing stability when the mitigation is off. |
| 0.05 m | free-gait belly residual | Body motion. |
| 0.5–1 m/px, ~23 cm, 50 cm/px | `rover_tracks` | Image and LRV track sizes. No ref key. |
| speed v | `timing` units | Symbol only. No figure. |

Derived, and not platform specs:

- `odometryPct` copies the 2% preset.
- `k` divides that percent by 100.
- The walk-time floor is 0.01 m/s.
- Milliradian times 0.001 makes radians at `src/assessment.mjs:352-354`.

## Checked and left out

These `src/` items are not motion or slip terms. They are omitted from the table.

- `footSigma_m` (`src/mission-model.mjs:507`) is a spectrometer footprint. It is not foot slip.
- `integration_s`, gravimeter drift, DEM error, and tide terms are instrument or field terms.
- `celestialAzimuth_mrad` and assumption A6 are an external azimuth aid.
- `src/assessment.mjs:150-162` anchor sigmas are tie geometry.
- `src/assessment.mjs:220` uses 0.55 and 0.85 as smoother scales. They are not a gait.
- `smooth_loop`, `map_tied`, `lander_relative`, and `beacon_aided` describe ties and loops. They set no walk, hop, wheel, or slip.
- `README.md` and `index.html` are outside `src/`.

## Follow-up for ll-lead

No inconsistent row was found. This file does not open a GitHub issue.

Unclear rows that need a source, or an explicit TBD in code, if ll-lead wants separate issues:

1. Walk speed 0.15 m/s, and a written role for the 0.01 m/s clamp.
2. Body-motion sizes: 1.0 cm, 0.05 m, and 0.5 cm.
3. Standing stability: 0.2 mrad, 0.15 mrad, 0.1 mrad, fallbacks 0.002 rad and 0.001 rad, and settle time 600 s.
4. Slip percents 2% and 6%, the terrestrial 1–4% and 1–2% priors (no ref key), and the factors 0.8 and 0.4.
5. Visual odometry in `vo_drift` and in `local_rt`, beside the leg-odometry-plus-IMU state.
6. A D-012 row in `DECISIONS.md`. Charter question Q1 is still open on main. This audit does not edit that log.
