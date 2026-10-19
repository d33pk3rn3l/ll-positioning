# Requirements trace (O3)

Status: DRAFT v0.2 skeleton (2026-10-19). Owner: ll-lead. Reviewer:
prof-payload (science), prof-geodesy (geodetic math). Gate: G1.
Not approved by the PI. **This file contains no approved requirement.**

## Changes in v0.2

Review of v0.1 by prof-payload (PR #12). All items accepted.
1. (major) Item 1, GRAV-A by gravity product: magnitude, vertical, vector.
   New IP-G8 "gravity product used". See 2, 3.1 (GRAV-A).
2. (major) Item 2, new row XREG (co-registration of gravity, GPR and
   imaging). New IP-P3 "lever arms and mounting angles". See 2, 3.6.
3. Item 3, IMG-P and IMG-A split into RT and PP; stereo relation; new IP-C7
   "stereo baseline". See 2, 3.4.
4. Item 4, GPR2-PV split into GPR2-PV-D (design/gait constraint) and
   GPR2-PV-K (nav knowledge need); wavelength named. See 3.2.
5. Item 5, new row GPR2-P-RT for real-time trace triggering. See 3.2.
6. Item 6, rule 4: the baseline 218 µGal DEM term is a proxy. "May drive
   the budget" removed. See 1.
7. Item 7, "Needs ~10x?" allows "n/a, no RT need"; spectrometer out of scope
   (D-011, proposed). See 1, 3.1.
8. prof-geodesy addition: GRAV-A tilt **and heading** depend on the gravity
   product; vector case includes the d / R tilt (about 94 mGal at 1 km).
   See 3.1 (GRAV-A) and `frames.md` 2.4.
9. Platform D-012 (PI): walking quadruped, ANYmal-like, no jumping.
   prof-payload additions: GPR pose per trace with a time tag, GPR2-T made a
   real row, new IP-P4 (gait frequency and body motion) (3.2); gravimeter
   reads only when standing and settled, settling time in IP-G4 (2, 3.1);
   legs hold a set body pose for imaging (3.4). PI item 4 updated (4.1).

## 1. Intro and rules

This table links each navigation need to a science need. It covers the
gravimeter, the GPR (2D profiles and 3D grids), the imager, and the DEM /
terrain registration. It gives one row per instrument and nav quantity.
Position, attitude and time are separate rows.
The spectrometer is out of scope (D-011, proposed).
Platform: walking quadruped, ANYmal-like, no jumping (D-012, PI statement,
not sourced; speed and sensor specs [TBD]).

Rules:
1. **No requirement without a science trace** (norm 4). Each row must name
   the science objective, the instrument parameter, the physical relation and
   the source. If one is missing, the value is [TBD].
2. **Missing instrument specs are [TBD].** We do not guess them.
3. **The "~10x" in the brief is an expectation, not a requirement** (D-004).
   The column "needs ~10x?" shows, per row, whether the science needs the
   post-processed value to be about 10x better than real time. Where a row
   has no real-time science need (for example gravity: stop-and-go,
   post-processed), the entry is "n/a, no RT need". There ~10x is not the
   test.
4. **DEM and terrain registration has its own row** in the map-relative layer
   (D-010, prof-payload). In the baseline, the DEM-height term is 218 of the
   223 µGal total (baseline, ll-engineer audit; not adopted, D-000). This
   term is (DEM height error) x (station height sensitivity). It is a proxy,
   not a terrain-effect estimate. Its share of the budget is [TBD] until
   DEM-H has a terrain model run.
5. **Labels** (norm 2): [sourced: key], [derived: how], [TBD]. Values from
   papers that ll-scout has not yet checked are marked
   **lead, unverified (paper)**. A lead is never a requirement.
   Values from the baseline repo are **[baseline, unverified]** (not
   adopted, D-000).
6. **Layers** as in `docs/frames.md`: local, map-relative, cartographic,
   inertial. Values are never merged across layers (norm 1).
7. The baseline "50 µGal requirement" and 0.10 m vertical allocation are not
   adopted (D-003).

Columns of the trace table:
- **RT** = real-time value (needed during operations).
- **Rel** = relative value (between measurements, after processing).
- **PP** = post-processed geodetic value (absolute, in the named layer).
- **Time scale** = over which span the value applies: station (one stop),
  profile (one GPR line or one migration aperture), traverse (whole mission).

---

## 2. Instrument-parameter list

These are the instrument inputs the trace table needs. All are [TBD] until a
source note exists. The leads come from the mission papers in ll-scout's
queue (text not yet checked by ll-scout; no source notes yet).

| ID | Instrument | Parameter | Value | Lead (unverified) | Needed by rows |
|----|-----------|-----------|-------|-------------------|----------------|
| IP-G1 | Gravimeter | Reading noise (1-sigma, per station, after averaging) | [TBD] | none found | GRAV-* |
| IP-G2 | Gravimeter | Drift rate (µGal per hour) and drift model | [TBD] | Design rotates the beams to remove thermal drift and bias, lead, unverified (Mittelholz 2026, citing Noeker et al. 2025) | GRAV-T, GRAV-PV |
| IP-G3 | Gravimeter | Type: single-axis (needs levelling) or 3-axis vector | [TBD] | GRASS is a 3-axis vector sensor, no levelling needed, lead, unverified (Mittelholz 2026) | GRAV-A |
| IP-G4 | Gravimeter | Time per station reading, **including the settling time** after the robot stands still (D-012) | [TBD] | none found | GRAV-T, GRAV-A |
| IP-G5 | Gravity science | Smallest anomaly to resolve (sets the allowed gravity error) | [TBD] | Tube signal about 0.4 mGal max, and about 1 mGal, lead, unverified (Mittelholz 2026, model cases) | GRAV-*, DEM-* |
| IP-G6 | Gravity science | Height share of the allowed gravity error | [TBD] (an allocation; ll-lead proposes at G1, PI approves) | Free-air error < 0.05 mGal, so height < 0.25 m, lead, unverified (Mittelholz 2026) | GRAV-PV |
| IP-G7 | Gravity science | Host rock density for Bouguer reduction | [TBD] | 2000 kg/m³ used here only to show the relation (from the task scope; not a source) | GRAV-PV |
| IP-G8 | Gravity science | Gravity product used in the science: magnitude, vertical component, or horizontal components / full vector | [TBD, PI or payload team] | none found | GRAV-A, XREG |
| IP-R1 | GPR | Centre frequency | [TBD] | about 100 MHz antenna gain, lead, unverified (Mittelholz 2026); RIMFAX heritage band 150-1200 MHz, lead, unverified (Mittelholz 2026) | GPR-* (in-air lambda for GPR2-PV-D; in-ground lambda for migration) |
| IP-R2 | GPR | Trace spacing along track | [TBD] | about 0.1 m, lead, unverified (Mittelholz 2026; Kolvenbach 2026) | GPR2-P, GPR2-P-RT, GPR2-T |
| IP-R3 | GPR | Antenna length (tip to tip) | [TBD] | 1.0 m, lead, unverified (Kolvenbach 2026) | GPR2-A |
| IP-R4 | GPR | Antenna height above ground | [TBD] | less than a quarter wavelength, lead, unverified (Kolvenbach 2026) | GPR2-PV-D, GPR2-PV-K |
| IP-R5 | GPR | Relative permittivity of regolith and basalt | [TBD] | none found (Apollo lab values mentioned, lead, unverified, Kolvenbach 2026) | GPR-* |
| IP-R6 | GPR | Migration aperture length | [TBD] | none found | GPR2-P, GPR3-* |
| IP-R7 | GPR | 3D line spacing | [TBD] | none found | GPR3-* |
| IP-C1 | Imager | Field of view | [TBD] | 40 deg, lead, unverified (Kolvenbach 2026) | IMG-* |
| IP-C2 | Imager | Pixels | [TBD] | 2048 x 2048, lead, unverified (Kolvenbach 2026) | IMG-* |
| IP-C3 | Imager | Pixel angle (IFOV) | [TBD] | 0.34 mrad [derived from the two leads: 40 deg in rad / 2048] | IMG-A-PP |
| IP-C4 | Imaging science | Target ground resolution on pit walls | [TBD] | "a few centimetres", lead, unverified (Kolvenbach 2026) | IMG-* |
| IP-C5 | Imager | Range to target (pit wall) | [TBD] | none found | IMG-* |
| IP-C6 | Imager | Exposure time and time-tag accuracy | [TBD] | none found | IMG-T |
| IP-C7 | Imager | Stereo baseline (distance between the two camera positions) | [TBD] | none found | IMG-P-PP |
| IP-P1 | Platform | Speed during GPR profiles | [TBD] (D-012: quadruped; speed not given) | none found | GPR2-T, GPR2-P-RT |
| IP-P2 | Platform | Traverse length | [TBD] | about 1 km, lead, unverified (Kolvenbach 2026, data volume estimate) | all, traverse scale |
| IP-P4 | Platform | Gait frequency (steps per second) and body motion per step (height and tilt change of the body) | [TBD, platform source] | none found (D-012: ANYmal-like, no jumping; PI statement, not sourced) | GPR2-PV-K, GPR2-A, GPR2-T |
| IP-P3 | Platform | Lever arms (sensor-to-body offsets) and mounting angles of the gravimeter, GPR antenna and camera | [TBD] | none found | XREG, GRAV-A, GPR2-PV-K, IMG-A-*, all instrument position and attitude rows |
| IP-D1 | DEM | DEM product, grid spacing, vertical precision | [TBD] | none found | DEM-* |
| IP-D2 | DEM | Terrain-effect gradient near the pit (µGal per m of shift) | [TBD] (needs a terrain model run) | Noeker & Karatekin 2022 terrain reduction, lead, unverified | DEM-H |

---

## 3. Trace table (skeleton)

All RT, Rel and PP values are [TBD]. The relations are filled where the
physics is textbook. The textbook constants still need source notes.

Textbook values used below:
- Free-air gradient: about 187 µGal/m [derived: 2g/R, g = 1.62 m/s²
  (source note needed), R = 1737.4 km [sourced: lrolgcwg2008, PR #15]; gives
  186.5 µGal/m]. Agrees with 0.187 mGal/m, lead, unverified (Mittelholz 2026).
- Bouguer slab term: about 84 µGal/m at 2000 kg/m³ [derived: 2 pi G rho,
  G = 6.674e-11 m³/(kg s²), rho = 2000 kg/m³ (IP-G7, not a source)].
- Bouguer-reduced gradient: about 103 µGal/m [derived: 186.5 - 83.9].
- Check of the Mittelholz lead: 0.25 m x 0.187 mGal/m = 0.047 mGal, which is
  below 0.05 mGal [derived]. The lead is self-consistent. Whether it is a
  relative or absolute height is open (D-009).

### 3.1 Gravimeter

| ID | Science objective | Instrument | Nav quantity | Instrument parameter | Physical relation | Source | Layer | Time scale | RT | Rel | PP | Needs ~10x? | What fails if not met | Label |
|----|------------------|-----------|--------------|---------------------|-------------------|--------|-------|-----------|----|-----|----|-------------|----------------------|-------|
| GRAV-PV | Detect and outline a sub-surface void (lava tube) from a gravity low. Lead, unverified (Mittelholz 2026; Kolvenbach 2026) | Gravimeter | Position: station height difference | IP-G5, IP-G6, IP-G7 | A height error gives a false gravity change. Height need = (height share of allowed gravity error) / (height sensitivity). Sensitivity = free-air 187 µGal/m, or about 103 µGal/m after Bouguer reduction. dh_max = dg_h / (dg/dh) | [TBD]; physics textbook | Local (relative heights); map-relative if DEM heights are used | Traverse (station to station) | n/a, no RT need | [TBD] | [TBD] | n/a, no RT need | False anomaly from height error, or a real tube signal hidden. | relation [derived]; values [TBD] |
| GRAV-PH | Same | Gravimeter | Position: station horizontal position | IP-G5, anomaly model | A horizontal error puts a correct reading at the wrong place. dx_max = (horizontal share of allowed error) / (max horizontal gradient of the anomaly). The gradient comes from a forward model [TBD]; baseline values 16 and 20.4 µGal/m disagree and are not adopted. | [TBD] | Local for shape; map-relative to place the tube under the surface features | Traverse | n/a, no RT need | [TBD] | [TBD] | n/a, no RT need | Tube outline or depth wrong in the inversion; wrong match with GPR. | relation [derived]; values [TBD] |
| GRAV-A | Same | Gravimeter | Attitude: tilt (roll, pitch) **and heading**. Depends on IP-G8 (gravity product). Angles against the local vertical and local north at the **instrument** (`frames.md` 2.4; IP-P3). | IP-G3, IP-G8, IP-P3 | Three cases by gravity product (IP-G8): **(a) Magnitude:** no tilt effect; no heading effect. **(b) Vertical component** (as a single-axis sensor): tilt error q gives about g x q²/2 (second order). 1 mrad gives 81 µGal [derived: 1.62 x 0.5 x (1e-3)²]. Heading does not matter. **(c) Horizontal components or full vector:** tilt error gives g x q (first order), about 162 µGal per µrad [derived: 1.62 x 1e-6 m/s² = 1.62e-6 m/s²]. For the same 81 µGal error this allows 0.5 µrad instead of 1 mrad, a factor of 2000 [derived], about 3 orders of magnitude stricter. In case (c) also: heading error rotates signal between the east and north components, so start-heading bias and heading drift (`frames.md` 2.1, section 6 type 5 and random walk) enter the gravity budget; and the d / R tilt of the lander ENU plane (0.58 mrad at 1 km) gives g x q = 1.625 x 5.8e-4 = 9.4e-4 m/s² ≈ 94,000 µGal = 94 mGal [derived], so roll and pitch against the local vertical at the rover are **required**. Lead: GRASS is a 3-axis vector sensor (IP-G3), lead, unverified. **Quadruped (D-012):** the gravimeter reads only when the robot stands. The standing posture sets the tilt (against the local vertical at the rover, via the lever arm and mounting angles IP-P3). The robot must stand still and settle before each reading. | [TBD] | Local | Station | n/a, no RT need | [TBD] | [TBD] | n/a, no RT need | Tilt error read as gravity change; in case (c) also heading error read as a horizontal gravity anomaly. | relation [derived]; values [TBD] |
| GRAV-T | Same | Gravimeter | Time: time tag of each reading | IP-G2, IP-G4 | A time error makes the drift and tide corrections wrong. dt_max = (time share of allowed error) / (largest rate of change: drift rate or tide rate). Rates [TBD]. **Quadruped (D-012):** a reading starts only after the robot stands still and settles; the settling time adds to the time per station (IP-G4, [TBD]). | [TBD] | Time (named scale) | Station and traverse (drift between stations) | n/a, no RT need | [TBD] | [TBD] | n/a, no RT need | Drift or tide left in the data; looks like an anomaly along the traverse. | relation [derived]; values [TBD] |

### 3.2 GPR, 2D profiles

| ID | Science objective | Instrument | Nav quantity | Instrument parameter | Physical relation | Source | Layer | Time scale | RT | Rel | PP | Needs ~10x? | What fails if not met | Label |
|----|------------------|-----------|--------------|---------------------|-------------------|--------|-------|-----------|----|-----|----|-------------|----------------------|-------|
| GPR2-P | Map layering and the tube roof in radargrams. Lead, unverified (Mittelholz 2026; Kolvenbach 2026) | GPR (2D) | Position: along-track trace position | IP-R1, IP-R2, IP-R5, IP-R6 | Migration adds traces coherently. The along-track error is defined **inside one migration aperture** (relative error between traces in that span, not the absolute error). Need: ds_max = k x (wavelength in the ground). Wavelength = c / (f x sqrt(eps)). The fraction k [TBD, needs a source]. Example scale: 100 MHz in vacuum gives 3 m [derived: 3e8 / 1e8]; in the ground it is shorter by sqrt(eps). | [TBD] | Local | Profile (one aperture) | [TBD] | [TBD] | [TBD] | [TBD] | Migration does not focus; reflectors smear; depth and shape of the tube roof wrong. | relation [derived]; values [TBD] |
| GPR2-P-RT | Same | GPR (2D) | Position: along-track distance for **real-time trace triggering** | IP-R2, IP-P1 | **Real-time sampling need.** Traces must be taken at the planned along-track interval (IP-R2). Real-time odometry error between triggers must be a fraction of that interval [TBD, needs a source]. This is a sampling need, not the PP aperture accuracy of GPR2-P. Like GPR3-RT, a missed interval cannot be fixed in post-processing. | [TBD] | Local | Profile | [TBD] | n/a | n/a | No by nature: this need is in real time. | Uneven or missing traces (spatial aliasing); migration degraded. | relation [derived]; values [TBD] |
| GPR2-PV-D | Same | GPR (2D) | **Design and gait constraint (not a nav knowledge need):** keep the antenna height above ground below lambda/4 | IP-R1, IP-R4 | Coupling to the ground needs antenna height below a quarter wavelength, lead, unverified (Kolvenbach 2026). For coupling, lambda is the **in-air** value: 3 m at 100 MHz, so lambda/4 = 0.75 m [lead, unverified: 100 MHz; 0.75 m derived: 3e8 / 1e8 / 4]. This is met by mechanical design and gait, not by navigation. | [TBD] | Local (body to antenna) | Profile | [TBD] | n/a | n/a | n/a (design constraint) | Poor coupling (weak signal). | relation [derived]; values [TBD] |
| GPR2-PV-K | Same | GPR (2D) | Position: **knowledge** of antenna height and surface height along the profile | IP-R4, IP-R5, IP-P3 | Know the antenna height to X [TBD] and the surface height inside the aperture. **Quadruped (D-012):** antenna height and tilt change with each step, so the need is **pose per trace with a time tag** (GPR2-T), not one height per profile. Body motion per step: IP-P4 [TBD]. Topographic correction: a surface-height error inside the aperture gives about the same depth error for shallow layers [derived: static shift]. For migration and depth, lambda is the **in-ground** value: lambda = c / (f x sqrt(eps)) [TBD, needs permittivity IP-R5]. | [TBD] | Local | Profile | [TBD] | [TBD] | [TBD] | [TBD] | Layers bent by wrong topography correction; depth wrong. | relation [derived]; values [TBD] |
| GPR2-A | Same | GPR (2D) | Attitude: antenna orientation (heading along track, tilt), **per trace** | IP-R3, IP-P3, IP-P4 | Tilt and heading change the antenna footprint and polarisation. **Quadruped (D-012):** tilt changes with each step, so attitude is needed per trace with a time tag (GPR2-T). Relation and need [TBD]. | [TBD] | Local | Profile | [TBD] | [TBD] | [TBD] | [TBD] | [TBD] | [TBD] |
| GPR2-T | Same | GPR (2D) | Time: trace time tag relative to the pose (position, height, tilt) | IP-R2, IP-P1, IP-P4 | A time error moves a trace along track by speed x time: dt_max = ds_max / v (rover speed). **Quadruped (D-012):** a time error also assigns the wrong antenna height and tilt, because the body moves within each step. Then dt_max is also limited by (allowed height or tilt error) / (rate of body motion), from gait frequency and body motion per step (IP-P4, [TBD, platform source]). | [TBD] | Time (named scale), but only as a relative time inside one profile | Profile | [TBD] | [TBD] | [TBD] | [TBD] | Same as GPR2-P. | relation [derived]; values [TBD] |

### 3.3 GPR, 3D grids

| ID | Science objective | Instrument | Nav quantity | Instrument parameter | Physical relation | Source | Layer | Time scale | RT | Rel | PP | Needs ~10x? | What fails if not met | Label |
|----|------------------|-----------|--------------|---------------------|-------------------|--------|-------|-----------|----|-----|----|-------------|----------------------|-------|
| GPR3-RT | 3D image of the tube roof and edges. [TBD]: a 3D grid is not confirmed in the mission papers; PI to confirm (4.1 item 3) | GPR (3D) | Position: cross-track line spacing **during operations** | IP-R1, IP-R5, IP-R7 | **Real-time requirement.** Lines must be driven at the planned spacing dy. dy is set by the 3D spatial sampling need (fraction of the wavelength in the ground, [TBD, needs a source]). Real-time cross-track error must be a fraction of dy [TBD]. A gap cannot be fixed in post-processing. | [TBD] | Local | Profile to grid (one survey) | [TBD] | n/a | n/a | No by nature: this need is in real time. | Gaps between lines (spatial aliasing); 3D image has holes; survey must be repeated. | relation [derived]; values [TBD] |
| GPR3-P | Same | GPR (3D) | Position: relative position between lines | IP-R1, IP-R5, IP-R6 | Same rule as GPR2-P, in both directions: error between traces inside one 3D aperture <= k x wavelength in the ground. | [TBD] | Local | Grid (one survey) | [TBD] | [TBD] | [TBD] | [TBD] | 3D migration does not focus; false or missed edges. | relation [derived]; values [TBD] |
| GPR3-A | Same | GPR (3D) | Attitude: heading between lines | IP-R3 | Heading error rotates lines against each other; sideways error = distance x heading error (1 mrad over 100 m = 0.1 m [derived]). Need [TBD]. | [TBD] | Local | Grid | [TBD] | [TBD] | [TBD] | [TBD] | Lines cross or diverge; same as GPR3-P. | relation [derived]; values [TBD] |
| GPR3-T | Same | GPR (3D) | Time | IP-P1 | As GPR2-T. | [TBD] | Time (relative) | Grid | [TBD] | [TBD] | [TBD] | [TBD] | As GPR3-P. | relation [derived]; values [TBD] |

### 3.4 Imager

| ID | Science objective | Instrument | Nav quantity | Instrument parameter | Physical relation | Source | Layer | Time scale | RT | Rel | PP | Needs ~10x? | What fails if not met | Label |
|----|------------------|-----------|--------------|---------------------|-------------------|--------|-------|-----------|----|-----|----|-------------|----------------------|-------|
| IMG-P-RT | Map pit-wall layers and fractures at cm scale; stability of the pit. Lead, unverified (Mittelholz 2026; Kolvenbach 2026) | Imager | Position: camera position during operations | IP-C1, IP-C5 | Real-time position only has to bring the camera to a station from which the target is inside the FOV (IP-C1, 40 deg, lead, unverified). Loose. Value [TBD]. | [TBD] | Local | Station | [TBD] | n/a | n/a | No | Target not in view; image set must be repeated. | relation [derived]; values [TBD] |
| IMG-P-PP | Same | Imager | Position: camera position at each image (post-processed) | IP-C2, IP-C4, IP-C5, IP-C7, IP-P3 | Ground pixel size = IFOV x range. The PP pose may come from the images themselves (bundle adjustment); then the imager likely needs no ~10x nav improvement. For stereo: depth error ≈ range x (baseline error / baseline) [derived: stereo geometry]. Baseline IP-C7 [TBD]. Need: depth error small compared with the target resolution (IP-C4). | [TBD] | Local (between images); map-relative to place the pit model on the map | Station (one image set) | n/a | [TBD] | [TBD] | Likely no (bundle adjustment) [TBD] | Wrong layer heights and thicknesses on the wall; 3D model distorted. | relation [derived]; values [TBD] |
| IMG-A-RT | Same | Imager | Attitude: pointing (incl. heading) during operations | IP-C1, IP-P3 | Real-time pointing only keeps the target inside the 40 deg FOV (IP-C1, lead, unverified). Loose. **Quadruped (D-012):** the legs can hold a set body pose, so RT pointing is easy. This supports that the imager likely needs no ~10x nav improvement. Value [TBD]. | [TBD] | Local | Station | [TBD] | n/a | n/a | No | Target not in the image. | relation [derived]; values [TBD] |
| IMG-A-PP | Same | Imager | Attitude: pointing (incl. heading) per image (post-processed) | IP-C3, IP-C5, IP-P3 | Pointing error x range = shift on the wall. Compare with pixel angle: 0.34 mrad [derived from leads: 40 deg in rad / 2048]. Example: at 10 m range, 1 pixel = 3.4 mm [derived: 0.34e-3 x 10 m]. The PP pointing may come from the images (bundle adjustment); then the nav need is only a starting value. Need [TBD]. | [TBD] | Local | Station | n/a | [TBD] | [TBD] | Likely no (bundle adjustment) [TBD] | Images do not overlay; mosaic and 3D model wrong. | relation [derived]; values [TBD] |
| IMG-T | Same | Imager | Time: image time tag | IP-C6 | Time sets the Sun angle (shadows) and the camera position if the body moves. Need [TBD]. | [TBD] | Time (named scale) | Station | [TBD] | [TBD] | [TBD] | [TBD] | Wrong shadow model; wrong pose for moving images. | [TBD] |

### 3.5 DEM and terrain registration (D-010)

| ID | Science objective | Instrument | Nav quantity | Instrument parameter | Physical relation | Source | Layer | Time scale | RT | Rel | PP | Needs ~10x? | What fails if not met | Label |
|----|------------------|-----------|--------------|---------------------|-------------------|--------|-------|-----------|----|-----|----|-------------|----------------------|-------|
| DEM-H | Terrain correction of gravity near the pit (same science as GRAV-*). | Gravimeter + DEM | Position: horizontal registration of stations to the DEM | IP-D1, IP-D2, IP-G5 | A horizontal shift against the DEM changes the computed terrain effect. Error = (terrain-effect gradient) x (shift). dx_max = (terrain share of allowed error) / (terrain-effect gradient). The gradient is large near the pit rim [TBD, needs a terrain model run]. Lead: Noeker & Karatekin 2022, unverified. | [TBD] | Map-relative | Traverse | [TBD] | [TBD] | [TBD] | [TBD] | Terrain effect wrong; it can be larger than the tube signal and look like one. | relation [derived]; values [TBD] |
| DEM-V | Same | Gravimeter + DEM | Position: vertical registration of station heights to the DEM | IP-D1, IP-G6 | Heights from the DEM and from rover sensors must agree at each station. A relative vertical error between stations acts as in GRAV-PV (187 or 103 µGal/m). A common vertical offset of the DEM cancels in the free-air reduction (D-009) but not always in the terrain term [TBD]. | [TBD] | Map-relative | Traverse | [TBD] | [TBD] | [TBD] | [TBD] | As GRAV-PV and DEM-H. | relation [derived]; values [TBD] |

### 3.6 Cross-instrument co-registration

Joint science reading: the gravity low, the GPR roof reflector and the
pit-wall images are placed on the same body. This is prof-payload's reading
of the mission leads, unverified (ll-scout to check in Mittelholz 2026 and
Kolvenbach 2026).

| ID | Science objective | Instrument | Nav quantity | Instrument parameter | Physical relation | Source | Layer | Time scale | RT | Rel | PP | Needs ~10x? | What fails if not met | Label |
|----|------------------|-----------|--------------|---------------------|-------------------|--------|-------|-----------|----|-----|----|-------------|----------------------|-------|
| XREG | Place the gravity low, the GPR roof reflector and the pit-wall images on the same sub-surface body (reading unverified, see above) | Gravimeter + GPR + imager | Position: relative position between the instrument data sets over the traverse (not only inside one aperture or one station) | IP-G5, IP-G8, IP-R6, IP-C4, IP-P2, IP-P3 | dx_max = (allowed misfit between data sets) / (anomaly gradient). Allowed misfit and gradient [TBD]. Lever arms and mounting angles (IP-P3) are needed to bring each data set from body to instrument. | [TBD] | Local | Traverse | [TBD] | [TBD] | [TBD] | [TBD] | Gravity, GPR and image features do not line up; the joint interpretation of the tube is wrong or not possible. | relation [derived]; values [TBD] |

---

## 4. Open items

### 4.1 Needed from the PI

1. Approve the row list (instruments x nav quantity) as the G1 scope.
2. The allocation rule for the allowed gravity error (how it is split into
   height, horizontal, attitude, time and terrain shares). ll-lead will
   propose it once IP-G5 has a source.
3. Is a 3D GPR grid in the concept of operations? If not, GPR3-* rows are
   removed.
4. Platform: quadruped, ANYmal-like, no jumping (D-012, PI). Still open:
   speed, gait frequency, body motion and sensors (IP-P1, IP-P4) decide
   GPR2-T, GPR2-P-RT, GPR3-RT and the attitude rows.
5. Who owns the instrument specs (IP-*) for each payload: who can give
   values?
6. Gravity product used in the science (IP-G8): magnitude, vertical
   component, or horizontal components / full vector. This changes the
   attitude need by about 3 orders of magnitude (GRAV-A).
7. Confirm the joint-science reading behind XREG.
8. Accept D-011 (spectrometer out of scope, proposed).

### 4.2 Needed from ll-scout (source notes)

1. Mittelholz 2026 and Kolvenbach 2026: check every lead in section 2 (anomaly
   size, 0.25 m height and whether it is relative, ~100 MHz, 0.1 m trace
   spacing, 1.0 m antenna, quarter-wavelength height, 40 deg FOV, 2048 x 2048,
   "few cm", ~1 km traverse).
2. Gravimeter noise and drift (Noeker et al. 2025, GRASS heritage).
3. Lunar g and radius (for the free-air gradient).
4. Regolith and basalt permittivity at the site.
5. GPR position-error rule for migration (the fraction k of the wavelength)
   and 3D line-spacing rule.
6. Noeker & Karatekin 2022: terrain-reduction method and size of the terrain
   effect near a pit.
7. Host rock density for Bouguer reduction.
8. GRASS sensor type (3-axis vector?) and gravity product (IP-G3, IP-G8).
9. Joint-science reading behind XREG (gravity low, GPR roof, pit-wall images
   on the same body).

### 4.3 Needed from ll-engineer

1. Script that regenerates every [derived] number here (norm 5, issue #7).
2. Forward model of the anomaly gradient (GRAV-PH) and terrain-effect gradient
   (DEM-H), once inputs exist. Note: baseline inputs have impossible values
   (issue #6); do not reuse them.

### 4.4 Review

- prof-payload: rows, science objectives, "what fails" column, IP list.
- prof-geodesy: layer and time-scale columns, GRAV-PV and DEM-V height logic,
  GPR aperture definition.
