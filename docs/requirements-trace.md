# Requirements trace (O3)

Status: DRAFT v0.1 skeleton (2026-10-19). Owner: ll-lead. Reviewer:
prof-payload (science), prof-geodesy (geodetic math). Gate: G1.
Not approved by the PI. **This file contains no approved requirement.**

## 1. Intro and rules

This table links each navigation need to a science need. It covers the
gravimeter, the GPR (2D profiles and 3D grids), the imager, and the DEM /
terrain registration. It gives one row per instrument and nav quantity.
Position, attitude and time are separate rows.

Rules:
1. **No requirement without a science trace** (norm 4). Each row must name
   the science objective, the instrument parameter, the physical relation and
   the source. If one is missing, the value is [TBD].
2. **Missing instrument specs are [TBD].** We do not guess them.
3. **The "~10x" in the brief is an expectation, not a requirement** (D-004).
   The column "needs ~10x?" shows, per row, whether the science needs the
   post-processed value to be about 10x better than real time.
4. **DEM and terrain registration has its own row** in the map-relative layer
   (D-010, prof-payload). In the baseline, the DEM-height term is 218 of the
   223 µGal total (baseline, ll-engineer audit; not adopted, D-000). So this
   term may drive the gravity budget more than rover height does.
5. **Labels** (norm 2): [sourced: key], [derived: how], [TBD]. Values from
   papers that ll-scout has not yet checked are marked
   **lead, unverified (paper)**. A lead is never a requirement.
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
| IP-G3 | Gravimeter | Type: single-axis (needs levelling) or 3-axis vector | [TBD] | 3-axis vector, no levelling needed, lead, unverified (Mittelholz 2026) | GRAV-A |
| IP-G4 | Gravimeter | Time per station reading | [TBD] | none found | GRAV-T |
| IP-G5 | Gravity science | Smallest anomaly to resolve (sets the allowed gravity error) | [TBD] | Tube signal about 0.4 mGal max, and about 1 mGal, lead, unverified (Mittelholz 2026, model cases) | GRAV-*, DEM-* |
| IP-G6 | Gravity science | Height share of the allowed gravity error | [TBD] (an allocation; ll-lead proposes at G1, PI approves) | Free-air error < 0.05 mGal, so height < 0.25 m, lead, unverified (Mittelholz 2026) | GRAV-PV |
| IP-G7 | Gravity science | Host rock density for Bouguer reduction | [TBD] | 2000 kg/m³ used here only to show the relation (from the task scope; not a source) | GRAV-PV |
| IP-R1 | GPR | Centre frequency | [TBD] | about 100 MHz antenna gain, lead, unverified (Mittelholz 2026); RIMFAX heritage band 150-1200 MHz, lead, unverified (Mittelholz 2026) | GPR-* |
| IP-R2 | GPR | Trace spacing along track | [TBD] | about 0.1 m, lead, unverified (Mittelholz 2026; Kolvenbach 2026) | GPR2-P, GPR2-T |
| IP-R3 | GPR | Antenna length (tip to tip) | [TBD] | 1.0 m, lead, unverified (Kolvenbach 2026) | GPR2-A |
| IP-R4 | GPR | Antenna height above ground | [TBD] | less than a quarter wavelength, lead, unverified (Kolvenbach 2026) | GPR2-PV |
| IP-R5 | GPR | Relative permittivity of regolith and basalt | [TBD] | none found (Apollo lab values mentioned, lead, unverified, Kolvenbach 2026) | GPR-* |
| IP-R6 | GPR | Migration aperture length | [TBD] | none found | GPR2-P, GPR3-* |
| IP-R7 | GPR | 3D line spacing | [TBD] | none found | GPR3-* |
| IP-C1 | Imager | Field of view | [TBD] | 40 deg, lead, unverified (Kolvenbach 2026) | IMG-* |
| IP-C2 | Imager | Pixels | [TBD] | 2048 x 2048, lead, unverified (Kolvenbach 2026) | IMG-* |
| IP-C3 | Imager | Pixel angle (IFOV) | [TBD] | 0.34 mrad [derived from the two leads: 40 deg in rad / 2048] | IMG-A |
| IP-C4 | Imaging science | Target ground resolution on pit walls | [TBD] | "a few centimetres", lead, unverified (Kolvenbach 2026) | IMG-* |
| IP-C5 | Imager | Range to target (pit wall) | [TBD] | none found | IMG-* |
| IP-C6 | Imager | Exposure time and time-tag accuracy | [TBD] | none found | IMG-T |
| IP-P1 | Platform | Speed during GPR profiles | [TBD] | none found | GPR2-T |
| IP-P2 | Platform | Traverse length | [TBD] | about 1 km, lead, unverified (Kolvenbach 2026, data volume estimate) | all, traverse scale |
| IP-D1 | DEM | DEM product, grid spacing, vertical precision | [TBD] | none found | DEM-* |
| IP-D2 | DEM | Terrain-effect gradient near the pit (µGal per m of shift) | [TBD] (needs a terrain model run) | Noeker & Karatekin 2022 terrain reduction, lead, unverified | DEM-H |

---

## 3. Trace table (skeleton)

All RT, Rel and PP values are [TBD]. The relations are filled where the
physics is textbook. The textbook constants still need source notes.

Textbook values used below:
- Free-air gradient: about 187 µGal/m [derived: 2g/R, g = 1.62 m/s²
  (source note needed), R = 1737.4 km (source note needed); gives
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
| GRAV-PV | Detect and outline a sub-surface void (lava tube) from a gravity low. Lead, unverified (Mittelholz 2026; Kolvenbach 2026) | Gravimeter | Position: station height difference | IP-G5, IP-G6, IP-G7 | A height error gives a false gravity change. Height need = (height share of allowed gravity error) / (height sensitivity). Sensitivity = free-air 187 µGal/m, or about 103 µGal/m after Bouguer reduction. dh_max = dg_h / (dg/dh) | [TBD]; physics textbook | Local (relative heights); map-relative if DEM heights are used | Traverse (station to station) | [TBD] | [TBD] | [TBD] | [TBD] | False anomaly from height error, or a real tube signal hidden. | relation [derived]; values [TBD] |
| GRAV-PH | Same | Gravimeter | Position: station horizontal position | IP-G5, anomaly model | A horizontal error puts a correct reading at the wrong place. dx_max = (horizontal share of allowed error) / (max horizontal gradient of the anomaly). The gradient comes from a forward model [TBD]; baseline values 16 and 20.4 µGal/m disagree and are not adopted. | [TBD] | Local for shape; map-relative to place the tube under the surface features | Traverse | [TBD] | [TBD] | [TBD] | [TBD] | Tube outline or depth wrong in the inversion; wrong match with GPR. | relation [derived]; values [TBD] |
| GRAV-A | Same | Gravimeter | Attitude: tilt (roll, pitch) | IP-G3 | Single-axis sensor: tilt error q gives about g x q²/2. Example: 1 mrad gives 81 µGal [derived: 1.62 x 0.5 x (1e-3)²]. A 3-axis vector sensor measures the magnitude without levelling; then tilt matters only for the vertical component [TBD]. Heading does not matter. | [TBD] | Local | Station | [TBD] | [TBD] | [TBD] | [TBD] | Tilt error read as gravity change. | relation [derived]; values [TBD] |
| GRAV-T | Same | Gravimeter | Time: time tag of each reading | IP-G2, IP-G4 | A time error makes the drift and tide corrections wrong. dt_max = (time share of allowed error) / (largest rate of change: drift rate or tide rate). Rates [TBD]. | [TBD] | Time (named scale) | Station and traverse (drift between stations) | [TBD] | [TBD] | [TBD] | [TBD] | Drift or tide left in the data; looks like an anomaly along the traverse. | relation [derived]; values [TBD] |

### 3.2 GPR, 2D profiles

| ID | Science objective | Instrument | Nav quantity | Instrument parameter | Physical relation | Source | Layer | Time scale | RT | Rel | PP | Needs ~10x? | What fails if not met | Label |
|----|------------------|-----------|--------------|---------------------|-------------------|--------|-------|-----------|----|-----|----|-------------|----------------------|-------|
| GPR2-P | Map layering and the tube roof in radargrams. Lead, unverified (Mittelholz 2026; Kolvenbach 2026) | GPR (2D) | Position: along-track trace position | IP-R1, IP-R2, IP-R5, IP-R6 | Migration adds traces coherently. The along-track error is defined **inside one migration aperture** (relative error between traces in that span, not the absolute error). Need: ds_max = k x (wavelength in the ground). Wavelength = c / (f x sqrt(eps)). The fraction k [TBD, needs a source]. Example scale: 100 MHz in vacuum gives 3 m [derived: 3e8 / 1e8]; in the ground it is shorter by sqrt(eps). | [TBD] | Local | Profile (one aperture) | [TBD] | [TBD] | [TBD] | [TBD] | Migration does not focus; reflectors smear; depth and shape of the tube roof wrong. | relation [derived]; values [TBD] |
| GPR2-PV | Same | GPR (2D) | Position: antenna height and surface height along the profile | IP-R4, IP-R5 | (a) Height above ground below a quarter wavelength for coupling, lead, unverified (Kolvenbach 2026); quarter of 3 m = 0.75 m in vacuum [derived from the 100 MHz lead]. (b) Topographic correction: a surface-height error inside the aperture gives about the same depth error for shallow layers [derived: static shift]. | [TBD] | Local | Profile | [TBD] | [TBD] | [TBD] | [TBD] | Poor coupling (weak signal); layers bent by wrong topography correction. | relation [derived]; values [TBD] |
| GPR2-A | Same | GPR (2D) | Attitude: antenna orientation (heading along track, tilt) | IP-R3 | Tilt and heading change the antenna footprint and polarisation. Relation and need [TBD]. | [TBD] | Local | Profile | [TBD] | [TBD] | [TBD] | [TBD] | [TBD] | [TBD] |
| GPR2-T | Same | GPR (2D) | Time: trace time tag relative to position | IP-R2, IP-P1 | A time error moves a trace along track by speed x time. dt_max = ds_max / v (rover speed). | [TBD] | Time (named scale), but only as a relative time inside one profile | Profile | [TBD] | [TBD] | [TBD] | [TBD] | Same as GPR2-P. | relation [derived]; values [TBD] |

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
| IMG-P | Map pit-wall layers and fractures at cm scale; stability of the pit. Lead, unverified (Mittelholz 2026; Kolvenbach 2026) | Imager | Position: camera position at each image | IP-C1, IP-C2, IP-C4, IP-C5 | Ground pixel size = IFOV x range. For 3D from several images, a baseline error gives a depth error that grows with range. Need [TBD]: position error small compared with the target resolution (IP-C4). | [TBD] | Local (between images); map-relative to place the pit model on the map | Station (one image set) | [TBD] | [TBD] | [TBD] | [TBD] | Wrong layer heights and thicknesses on the wall; 3D model distorted. | relation [derived]; values [TBD] |
| IMG-A | Same | Imager | Attitude: pointing (incl. heading) | IP-C3, IP-C5 | Pointing error x range = shift on the wall. Compare with pixel angle: 0.34 mrad [derived from leads]. Example: at 10 m range, 1 pixel = 3.4 mm [derived: 0.34e-3 x 10 m]. Pointing need [TBD]; may be solved from the images themselves. | [TBD] | Local | Station | [TBD] | [TBD] | [TBD] | [TBD] | Images do not overlay; mosaic and 3D model wrong. | relation [derived]; values [TBD] |
| IMG-T | Same | Imager | Time: image time tag | IP-C6 | Time sets the Sun angle (shadows) and the camera position if the body moves. Need [TBD]. | [TBD] | Time (named scale) | Station | [TBD] | [TBD] | [TBD] | [TBD] | Wrong shadow model; wrong pose for moving images. | [TBD] |

### 3.5 DEM and terrain registration (D-010)

| ID | Science objective | Instrument | Nav quantity | Instrument parameter | Physical relation | Source | Layer | Time scale | RT | Rel | PP | Needs ~10x? | What fails if not met | Label |
|----|------------------|-----------|--------------|---------------------|-------------------|--------|-------|-----------|----|-----|----|-------------|----------------------|-------|
| DEM-H | Terrain correction of gravity near the pit (same science as GRAV-*). | Gravimeter + DEM | Position: horizontal registration of stations to the DEM | IP-D1, IP-D2, IP-G5 | A horizontal shift against the DEM changes the computed terrain effect. Error = (terrain-effect gradient) x (shift). dx_max = (terrain share of allowed error) / (terrain-effect gradient). The gradient is large near the pit rim [TBD, needs a terrain model run]. Lead: Noeker & Karatekin 2022, unverified. | [TBD] | Map-relative | Traverse | [TBD] | [TBD] | [TBD] | [TBD] | Terrain effect wrong; it can be larger than the tube signal and look like one. | relation [derived]; values [TBD] |
| DEM-V | Same | Gravimeter + DEM | Position: vertical registration of station heights to the DEM | IP-D1, IP-G6 | Heights from the DEM and from rover sensors must agree at each station. A relative vertical error between stations acts as in GRAV-PV (187 or 103 µGal/m). A common vertical offset of the DEM cancels in the free-air reduction (D-009) but not always in the terrain term [TBD]. | [TBD] | Map-relative | Traverse | [TBD] | [TBD] | [TBD] | [TBD] | As GRAV-PV and DEM-H. | relation [derived]; values [TBD] |

---

## 4. Open items

### 4.1 Needed from the PI

1. Approve the row list (instruments x nav quantity) as the G1 scope.
2. The allocation rule for the allowed gravity error (how it is split into
   height, horizontal, attitude, time and terrain shares). ll-lead will
   propose it once IP-G5 has a source.
3. Is a 3D GPR grid in the concept of operations? If not, GPR3-* rows are
   removed.
4. Platform confirmation (Q1): rover speed and sensors decide GPR2-T,
   GPR3-RT and attitude rows.
5. Who owns the instrument specs (IP-*) for each payload: who can give
   values?

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

### 4.3 Needed from ll-engineer

1. Script that regenerates every [derived] number here (norm 5, issue #7).
2. Forward model of the anomaly gradient (GRAV-PH) and terrain-effect gradient
   (DEM-H), once inputs exist. Note: baseline inputs have impossible values
   (issue #6); do not reuse them.

### 4.4 Review

- prof-payload: rows, science objectives, "what fails" column, IP list.
- prof-geodesy: layer and time-scale columns, GRAV-PV and DEM-V height logic,
  GPR aperture definition.
