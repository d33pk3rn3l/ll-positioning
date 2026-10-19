# Frames, layers, time and state (O1)

Status: DRAFT v0.1 (2026-10-19). Owner: ll-lead. Reviewer: prof-geodesy.
Not yet approved by the PI. Gate: G1.

Number labels (norm 2):
- **[sourced: key]**: from a source note in `docs/sources/`. None yet.
- **[derived: how]**: calculated here. The calculation is given.
- **[TBD]**: not known yet.
- **lead, unverified (paper)**: a value from the reading list or from a paper
  that ll-scout has not yet checked. It is not a source. Do not use it as a
  requirement.

Decisions that this note uses: D-001 (four layers), D-002 (labels),
D-007 (ME-to-PA as a transform), D-009 (zero-velocity updates, relative
height, time scale). D-006 to D-010 are "proposed" in PR #3.

---

## 1. Purpose and the four knowledge layers

### 1.1 Purpose

Each science measurement needs a place and a time. This note defines:
- the frames in which we give the place,
- the time scale in which we give the time,
- the quantities (states) that navigation must estimate,
- the types of error, and how they correlate.

### 1.2 The four layers

We know the rover position in four different ways. Each way has its own
errors. We call each way a "layer".

| Layer | What it means | What it is for | Main errors in this layer |
|-------|---------------|----------------|---------------------------|
| **Local** | Rover position relative to the local mission origin (the lander). Measured by the rover's own sensors (legs, IMU, cameras). | Distance and direction between two measurements on the same traverse. Gravity station-to-station heights. GPR profile geometry. Driving. | Odometry drift (grows with distance), heading drift, scale error, foot slip. Not affected by any map or global frame error. |
| **Map-relative** | Rover position relative to an orbital map product (for example an LRO NAC image or a DEM), in the map's own coordinates. | Put measurements onto the map. Compare with surface features (pit rim, boulders). Terrain correction for gravity (D-010). | Error of the registration to the map (landmark matching). Internal distortion of the map. Not affected by the map's global offset. |
| **Cartographic** | Rover position as latitude, longitude and height in the global lunar frame (Mean Earth, ME). | Compare with other missions and global data sets. Archive products. | The map product's global offset (geodetic control of LOLA / NAC). This error is common to the whole traverse. Plus all errors from the layers above. |
| **Inertial** | Rover position in a space-fixed frame (not rotating with the Moon). | Link to orbit data, Earth stations, star sightings, time-dependent effects. | Moon orientation (ephemeris and librations), ME-to-PA transform, and clock error (the Moon turns under the rover). Plus all errors from the layers above. |

### 1.3 Rule: never collapse the layers

We never give one accuracy number for "the position". Each accuracy value
names its layer (norm 1, D-001).

Why: a 10 m error in the cartographic layer can exist together with a 0.1 m
error between two stations in the local layer. If we add the two into one
number, the gravity reduction looks impossible, but it is not. If we take
only the local number, the archive product looks better than it is.

Each error source is assigned to the first layer where it appears. Errors of
a lower layer also go into the higher layers (local -> map-relative ->
cartographic -> inertial), but never the other way.

---

## 2. Local mission frame

All items in this section are **proposed**. The PI decides at G1.

| Item | Proposal | Status |
|------|----------|--------|
| Origin | Lander reference point (a marked, surveyed point on the lander, for example a target or the base of the mast). | proposed; exact point [TBD] with the lander team |
| Axes | Local east-north-up (ENU) at the origin. A flat tangent plane that touches the Moon at the lander. x = east, y = north, z = up (away from the Moon's centre). | proposed |
| Azimuth reference | How we know where "north" is at the start. Options below. | [TBD], decision needed |
| Height reference | Height above a sphere of radius 1737.4 km around the Moon's centre of mass: h = r - 1737.4 km. | proposed; radius value [TBD: source note needed], lead, unverified (IAU WGCCRE report) |

### 2.1 Azimuth reference options

The heading at the start is one number. An error in it turns the whole local
traverse around the lander. The effect grows with distance.
Example: 1 mrad heading error at 100 m from the lander gives 0.1 m sideways
error [derived: 100 m x 0.001 rad].

| Option | How | Notes |
|--------|-----|-------|
| A. Sun sensor | Measure the Sun direction, with time and the Moon ephemeris. | Needs time and ephemeris. Accuracy [TBD]. |
| B. Star sensor | Measure star directions. | Needs a star camera or a camera that can see stars. Accuracy [TBD]. |
| C. Map tie | Match two or more landmarks (or the lander and one far landmark) to an orbital image. | Gives heading in the map-relative layer, not a true north. Accuracy [TBD]. |
| D. Combination | Sun or star for an early value, map tie in post-processing. | [TBD] |

Decision needed from PI: which options are allowed for the platform (sensor
list is not known).

### 2.2 Height reference: notes

- The baseline repo uses h = r - 1,737,400 m (pending review, see
  DECISIONS.md "Baseline assertions"). This is not adopted yet (D-000).
- **Check needed:** every baseline file that defines a height must be checked
  against one rule (the same radius, the same centre). ll-engineer to list
  these files and report differences. [TBD]
- **ENU "up" is not height.** The tangent plane moves away from the sphere
  with distance d from the lander by about d^2 / (2R):
  - 100 m: 0.003 m [derived: 100^2 / (2 x 1,737,400 m)]
  - 500 m: 0.07 m [derived: same formula]
  - 1000 m: 0.29 m [derived: same formula]

  At 1 km this is larger than the 0.25 m height lead (see 2.3). So the gravity
  reduction must use h, not the ENU z value.
- **Height for gravity is a relative height** (D-009). The free-air reduction
  needs the height difference between stations. A datum error that is the same
  for all stations cancels. The lead "< 0.25 m" (lead, unverified,
  Mittelholz 2026) is treated as station-to-station height until ll-scout
  confirms what the paper means. If it is absolute, it becomes a major item.

---

## 3. Global frame

### 3.1 ME and PA

The Moon has two common body-fixed frames:
- **ME (Mean Earth / polar axis):** x-axis points to the mean Earth direction.
  Used for maps and coordinates (LOLA, LRO NAC products). lead, unverified
  (IAU WGCCRE report; LRO data products).
- **PA (Principal Axis):** axes along the Moon's main axes of inertia. This is
  the frame in which the planetary ephemeris gives the Moon's orientation.
  lead, unverified (JPL DE440 / DE421 documents).

| Layer | Frame |
|-------|-------|
| Local | Neither. Local ENU only. |
| Map-relative | The map's own frame (normally ME). Its global offset is not in this layer. |
| Cartographic | ME. Name the ME realization (which ephemeris it is aligned to). |
| Inertial | ICRF axes. Moon orientation from the ephemeris (PA), then the PA-to-ME transform to reach the map. |

### 3.2 Ephemeris version

[TBD]. Options: DE440 or DE421. Known issue: many LRO map products use ME
aligned to DE421 (lead, unverified, LRO data documents). If we use DE440 for
orientation, we must use the matching ME-to-PA transform for that version.
The baseline asserts "DE440 with DE421-aligned ME" (pending review, not
adopted). Decision needed from PI after ll-scout's source notes.

### 3.3 ME-to-PA transform (D-007)

- ME-to-PA is a **transform** (a fixed rotation with three small angles). We
  apply it. We do not treat it as an error.
- Only the **uncertainty** of the transform goes into the budget. Value
  [TBD: ll-scout]. The baseline code adds an 875 m offset into a 1-sigma
  value. This is wrong (bug B5, issue #5) and the 875 m value is not adopted.
- The transform uncertainty is a **bias**, reported as its own field (norm 3).
- It is **common-mode**: it is the same for every point of the traverse. So it
  has no effect on local or map-relative accuracy, or on distances between
  stations. It only enters the cartographic-to-inertial step (and any step that
  mixes PA and ME products).

---

## 4. Time

### 4.1 Time scale

The time scale is [TBD]. Options:
- UTC (used by ground systems; has leap seconds),
- TDB (used by the planetary ephemeris),
- a lunar time scale, lead, unverified (Bourgoin et al.; Ashby 2024 is in
  ll-scout's queue).

Whatever we choose, `docs/frames.md` names one scale for time tags, and gives
the conversion to the others. Decision needed from PI.

### 4.2 Clock offset is a state

The rover clock offset to the named time scale is estimated (section 5). We do
not assume the rover clock is correct.

### 4.3 How much does a clock error cost? (back of envelope)

- Moon rotation rate: about 2.66e-6 rad/s [derived: 2 pi / sidereal month;
  sidereal month 27.32 d, value to be sourced].
- Speed of a surface point in inertial space at 14.1 deg N (Marius Hills
  latitude, lead, unverified, mission papers):
  v = rate x R x cos(latitude) = 2.66e-6 x 1,737,400 m x cos(14.1 deg)
  ≈ 4.5 m/s [derived].
- So **1 s of clock error gives about 4.5 m of error in the inertial layer**
  [derived: 4.5 m/s x 1 s].
- In the local layer the same clock error gives **about 0 m** [derived: the
  local frame turns with the Moon; only rover motion during the error counts,
  and the rover is slow or stopped].
- 1 ms of clock error gives about 4.5 mm in the inertial layer [derived].
- Relativistic rate of a lunar clock, lead, unverified (about 56 µs per day,
  prof-geodesy from memory). With 4.5 m/s this gives about 0.25 mm per day in
  the inertial layer [derived from the lead]. Not a nav driver.

### 4.4 Working assumption (D-009)

Millisecond sync to the named time scale is the working assumption, unless a
payload needs better. Payload time needs are in `requirements-trace.md`
(rows *-T). [TBD until those rows are filled.]

---

## 5. State vector and observations

### 5.1 States

| State | Content | Layer where it is defined |
|-------|---------|---------------------------|
| Position | 3 values: east, north, up in the local frame (converted to the other layers by transforms). | Local (primary) |
| Attitude | 3 values: roll, pitch, heading (yaw). Heading is the most important for position drift. | Local |
| Clock offset | 1 value (and, if needed, a drift rate) to the named time scale. | Time (needed for inertial layer and for payload time tags) |
| Transform parameters | Local-to-map (rotation, shift, maybe scale); map-to-ME offset; ME-to-PA (fixed, uncertainty only). | Map-relative, cartographic, inertial |
| Sensor errors | IMU biases, odometry scale [TBD, depends on platform]. | Local |

The platform is not confirmed (Q1, quadruped?). Sensor states are [TBD].

### 5.2 Which observation constrains which state

| Observation | Constrains | Layer | Notes |
|-------------|-----------|-------|-------|
| Zero-velocity update at stops (cool-down stops, gravity stations) | Velocity = 0, so IMU drift and the growth of local error. Also roll and pitch (gravity direction). | Local | D-009: not a tie point. Does not connect to the global frame. |
| Leg odometry / visual odometry | Position change between steps. | Local | Error grows along track (random walk). |
| Sun or star sensor | Heading (and attitude), needs time and ephemeris. | Local (heading), inertial link | Option, see 2.1. |
| Lander (known start point, revisits) | Position at start and on return. Closes loops. | Local origin; map-relative if the lander is found in a NAC image | O2 tie point. |
| Map landmarks (pit rim, boulders, craters in NAC images) | Position and heading relative to the map. | Map-relative | O2 tie points. |
| Surveyed targets / retroreflectors / beacons | Position in the frame of the survey. | Map-relative or cartographic, [TBD] | O2 / O4. Availability [TBD]. |
| Geodetic control of the map (LOLA, NAC control) | Map-to-ME offset. | Cartographic | O4. Common-mode. |
| Time sync to ground / lander | Clock offset. | Time | Method [TBD]. |

---

## 6. Error correlation types

Each error source gets one type. The type decides how it adds up (norm 3:
a bias is never added into a 1-sigma value).

| Type | What it means | How it adds up | Example |
|------|---------------|----------------|---------|
| **Common-mode** | The same error for every point of the traverse. | Cancels in differences between points. Shows in absolute layers only. | Map global offset (LOLA/NAC control); ME-to-PA transform uncertainty. |
| **Random walk along track** | Each step adds a small independent error; the sum grows with distance or time. | Grows with the square root of steps (or faster with heading drift). Points close in time are strongly correlated. | Leg-odometry drift between two zero-velocity updates. |
| **Per-station bias** | Constant during one station or one stop, different at the next. | Same for all readings at one station; independent between stations. | Gravimeter reading offset after a new set-up at a station; attitude error at one stop. |
| **White noise** | Independent at each sample. | Averages down with more samples. | Gravimeter reading noise within one station; GPR trace time-tag jitter. |

For each error source in `docs/error-budget.md` (O5) we will record: type,
layer, size [sourced / derived / TBD], and correlation length (distance or
time) where relevant.

---

## 7. Open items and decisions needed

### 7.1 Decisions needed from the PI

1. Local origin: lander reference point? Which exact point (with lander team)?
2. Axes: local ENU tangent plane at the lander?
3. Azimuth reference: which options (sun, star, map tie, combination) the
   platform allows.
4. Height reference: h above a 1737.4 km sphere for all products?
5. Ephemeris version: DE440 or DE421 (and matching ME realization).
6. Time scale for time tags: UTC, TDB or a lunar time scale.
7. Platform confirmation (Q1), because sensor states depend on it.

### 7.2 Inputs needed from ll-scout (source notes)

1. Sphere radius 1737.4 km and the ME definition (IAU WGCCRE).
2. ME vs PA definitions and the ME-to-PA transform and its uncertainty, per
   ephemeris version (DE421, DE440).
3. Which ME realization the LOLA and NAC products use.
4. Mittelholz 2026: is the < 0.25 m height lead relative or absolute?
5. Lunar time scale: Bourgoin et al. (full reference missing, Benedikt's list
   stopped at "Bourgoin et a"), Ashby 2024. Rate of a lunar clock.
6. Moon sidereal rotation period (for 2.66e-6 rad/s).
7. Landing-site latitude (14.1 deg N used here, lead).

### 7.3 Inputs needed from ll-engineer

1. List of baseline files that define height; check against one rule.
2. Script that regenerates every [derived] number in this note (norm 5).
