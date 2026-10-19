# Frames, layers, time and state (O1)

Status: DRAFT v0.2 (2026-10-19). Owner: ll-lead. Reviewer: prof-geodesy.
Not yet approved by the PI. Gate: G1.

Number labels (norm 2):
- **[sourced: key]**: from a source note in `docs/sources/`. The sphere radius 1737.4 km is [sourced: lrolgcwg2008, PR #15].
- **[derived: how]**: calculated here. The calculation is given.
- **[TBD]**: not known yet.
- **lead, unverified (paper)**: a value from the reading list or from a paper
  that ll-scout has not yet checked. It is not a source. Do not use it as a
  requirement.
- **[baseline, unverified]**: a value from the baseline repo (earlier side
  experiment). Not adopted (D-000). Not a source.

## Changes in v0.2

Review of v0.1 by prof-geodesy (PR #12). All items accepted.
1. (major) Item 1, fifth error type "systematic, grows in proportion to
   separation". Start heading bias, odometry scale and boresight moved to it.
   Heading random walk grows as distance^1.5. See 2.1, 5.2, 6.
2. (major) Item 2, reference vertical for attitude. Roll and pitch are
   defined against the local vertical at the rover. The d / R tilt and the
   north turn are stated. See 2, 2.4, 5.1.
3. Item 3, velocity added to the state. See 5.1.
4. Item 4, zero-velocity updates do not constrain heading. See 5.2.
5. Item 5, payload lever arms and boresights added to the state as [TBD].
   See 5.1.
6. Item 6, sun-sensor azimuth is not time-critical. See 2.1, 4.5.
7. PR #11 review item: tilt from gravity is weaker on the Moon; IMU or
   inclinometer bias spec [TBD]. Design rule: the core returns a sigma per
   observable. See 5.3, 7.2, 7.4.
8. prof-geodesy addition (GRAV-A): for a vector gravity product, heading and
   the d / R tilt enter the gravity budget at first order. See 2.4, 7.1.
9. Platform D-012 (PI): walking quadruped, ANYmal-like, no jumping.
   prof-geodesy additions: IMU north-finding excluded (2.1); leg-specific
   states and foot slip as random walk (5.1, 6); zero-velocity update only
   with four feet down and body still; gravity tilt is the standing-pose tilt
   (5.2). See also 7.1.

Decisions that this note uses: D-001 (four layers), D-002 (labels),
D-007 (ME-to-PA as a transform), D-009 (zero-velocity updates, relative
height, time scale), D-012 (platform: walking quadruped, ANYmal-like, no
jumping; PI statement, not sourced; speed and sensor specs [TBD]).
D-006 to D-010 are "proposed" in PR #3.

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
| Axes | Local east-north-up (ENU) at the origin. A flat tangent plane that touches the Moon at the lander. x = east, y = north, z = up (away from the Moon's centre). Used for **position** only. Attitude uses the local vertical and local north at the rover (2.4). | proposed |
| Azimuth reference | How we know where "north" is at the start. Options below. | [TBD], decision needed |
| Height reference | Height above a sphere of radius 1737.4 km around the Moon's centre of mass: h = r - 1737.4 km. | proposed; radius value [sourced: lrolgcwg2008, PR #15] |

### 2.1 Azimuth reference options

The heading at the start is one number. An error in it turns the whole local
traverse around the lander. The effect grows with distance.
Example: 1 mrad heading error at 100 m from the lander gives 0.1 m sideways
error [derived: 100 m x 0.001 rad].

A start heading bias is **systematic and grows in proportion to separation**
(error type 5, section 6). It does not cancel in differences between two
points, and it is not a random walk.

| Option | How | Notes |
|--------|-----|-------|
| A. Sun sensor | Measure the Sun direction, with time and the Moon ephemeris. | Needs time and ephemeris. Accuracy [TBD]. Not time-critical: 1 s clock error gives about 2.5 µrad of heading [derived, see 4.5]. |
| B. Star sensor | Measure star directions. | Needs a star camera or a camera that can see stars. Accuracy [TBD]. |
| C. Map tie | Match two or more landmarks (or the lander and one far landmark) to an orbital image. | Gives heading in the map-relative layer, not a true north. Accuracy [TBD]. |
| D. Combination | Sun or star for an early value, map tie in post-processing. | [TBD] |

**IMU north-finding (gyrocompassing) is excluded.** The horizontal part of
the Moon rotation at 14.1 deg N is 2.66e-6 x cos(14.1 deg) ≈ 2.6e-6 rad/s ≈
0.53 deg/h [derived; rate to be sourced; latitude is a lead (figure label only, frame not stated)]. Heading to 1 mrad
would need a gyro bias below about 1e-3 x 0.53 deg/h ≈ 0.0005 deg/h
[derived: heading error ≈ gyro bias / horizontal rotation rate]. This is far
beyond a quadruped-class IMU (D-012; IMU spec [TBD]). So the start heading
must come from the options in the table: sun sensor, star sensor, map tie,
or a combination.

Decision needed from PI: which options are allowed for the platform (sensor
list is not known).

### 2.2 Height reference: notes

- The baseline repo uses h = r - 1,737,400 m (pending review, see
  DECISIONS.md "Baseline assertions"). This is not adopted yet (D-000).
  The radius 1737.4 km is [sourced: lrolgcwg2008, PR #15].
- **Check needed:** every baseline file that defines a height must be checked
  against one rule (the same radius, the same centre). ll-engineer to list
  these files and report differences. [TBD]
- **ENU "up" is not height.** The tangent plane moves away from the sphere
  with distance d from the lander by about d^2 / (2R):
  - 100 m: 0.003 m [derived: 100^2 / (2 x 1,737,400 m); R [sourced: lrolgcwg2008, PR #15]]
  - 500 m: 0.07 m [derived: same formula]
  - 1000 m: 0.29 m [derived: same formula]

  At 1 km this is larger than the 0.25 m height lead (see 2.3). So the gravity
  reduction must use h, not the ENU z value.
- **Height for gravity is a relative height** (D-009). The free-air reduction
  needs the height difference between stations. A datum error that is the same
  for all stations cancels. The lead "< 0.25 m" (lead, unverified,
  Mittelholz 2026) is treated as station-to-station height until ll-scout
  confirms what the paper means. If it is absolute, it becomes a major item.

### 2.4 Reference vertical and north for attitude

The ENU axes are a tangent plane at the lander. A level rover at distance d
from the lander is tilted against that plane by about d / R.
- At 1 km: 1000 / 1,737,400 = 0.58 mrad [derived; R [sourced: lrolgcwg2008, PR #15], see
  2.2].
- This is larger than the 0.2 mrad leveling residual [assumption, no source; old value traced to MER sun sensor 0.2 deg, not 0.2 mrad].

If a tilt correction uses roll and pitch in lander ENU, the error at one
station is:
- single-axis or vertical-component gravity (second order):
  g x theta² / 2 = 1.625 x (5.8e-4)² / 2 = 2.7e-7 m/s² ≈ 27 µGal [derived;
  g = 1.625 m/s², source note needed].
- horizontal components or full vector gravity (first order):
  g x theta = 1.625 x 5.8e-4 = 9.4e-4 m/s² ≈ 94,000 µGal = 94 mGal
  [derived; 1 µGal = 1e-8 m/s²].

**Rule (proposed):** roll and pitch are defined against the local vertical at
the rover. If an attitude is given in lander ENU, the d / R correction must be
applied first: tilt vector = (d / R) along the direction from the lander to
the rover. For a vector gravity product this is **required**, not optional
(see `requirements-trace.md` GRAV-A).

Heading has the same issue, in smaller size. Local north at the rover turns
against lander north by about d x tan(latitude) / R:
- At 1 km and 14.1 deg N: 1000 x tan(14.1 deg) / 1,737,400 ≈ 0.14 mrad
  [derived; R [sourced: lrolgcwg2008, PR #15]; latitude is a lead (figure label only, frame not stated)]. Minor, but heading is defined against
  local north at the rover too.

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
  latitude, lead: figure label only, frame not stated):
  v = rate x R x cos(latitude) = 2.66e-6 x 1,737,400 m x cos(14.1 deg)
  ≈ 4.5 m/s [derived; R [sourced: lrolgcwg2008, PR #15]].
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

### 4.5 Sun-sensor heading is not time-critical

- The Sun moves in the lunar sky by about 2 pi per synodic month:
  2 pi / (29.53 d x 86,400 s/d) ≈ 2.5e-6 rad/s [derived; synodic month
  29.53 d, value to be sourced].
- So 1 s of clock error gives about 2.5 µrad of heading [derived].
- 1 ms of clock error gives about 2.5 nrad [derived]. Millisecond sync is more
  than enough for option A (2.1).

---

## 5. State vector and observations

### 5.1 States

| State | Content | Layer where it is defined |
|-------|---------|---------------------------|
| Position | 3 values: east, north, up in the local frame (converted to the other layers by transforms). | Local (primary) |
| Velocity | 3 values: east, north, up rates in the local frame. Zero-velocity updates constrain it (5.2). | Local |
| Attitude | 3 values: roll, pitch, heading (yaw). Roll and pitch against the **local vertical at the rover**; heading against **local north at the rover** (2.4). Heading is the most important for position drift. | Local |
| Clock offset | 1 value (and, if needed, a drift rate) to the named time scale. | Time (needed for inertial layer and for payload time tags) |
| Transform parameters | Local-to-map (rotation, shift, maybe scale); map-to-ME offset; ME-to-PA (fixed, uncertainty only). | Map-relative, cartographic, inertial |
| Sensor errors (quadruped, D-012) | Gyro biases and accelerometer biases (3 + 3 values). Leg-kinematics calibration: link lengths and joint offsets per leg. Odometry scale (error type 5, section 6). Foot slip: a per-step error, so **random-walk** type, not white noise (section 6). Values [TBD, platform source]. | Local |
| Payload lever arms and boresights | Position offset (3 values) and mounting angles (3 values) of each payload sensor (gravimeter, GPR antenna, camera) to the body frame. Values [TBD]. Boresight error is error type 5. | Local (body to instrument) |

Platform: walking quadruped, ANYmal-like, no jumping (D-012, PI; not
sourced). Sensor specs and speed are [TBD].
The trace table position and attitude rows refer to the **instrument**, not
the body. So the lever arms and boresights are needed to go from body to
instrument (see `requirements-trace.md` IP-P3).

### 5.2 Which observation constrains which state

| Observation | Constrains | Layer | Notes |
|-------------|-----------|-------|-------|
| Zero-velocity update at stops (cool-down stops, gravity stations) | Velocity = 0, so IMU drift and the growth of local error. Also roll and pitch (gravity direction), limited by accelerometer bias (5.3). | Local | D-009: not a tie point. Does not connect to the global frame. **Does not constrain heading.** |
| Leg odometry / visual odometry | Position change between steps. | Local | Noise part grows along track (random walk). Scale error is systematic and grows in proportion to distance (type 5). |
| Sun or star sensor | Heading (and attitude), needs time and ephemeris. | Local (heading), inertial link | Option, see 2.1. |
| Lander (known start point, revisits) | Position at start and on return. Closes loops. | Local origin; map-relative if the lander is found in a NAC image | O2 tie point. |
| Map landmarks (pit rim, boulders, craters in NAC images) | Position and heading relative to the map. | Map-relative | O2 tie points. |
| Surveyed targets / retroreflectors / beacons | Position in the frame of the survey. | Map-relative or cartographic, [TBD] | O2 / O4. Availability [TBD]. |
| Geodetic control of the map (LOLA, NAC control) | Map-to-ME offset. | Cartographic | O4. Common-mode. |
| Time sync to ground / lander | Clock offset. | Time | Method [TBD]. |

**Zero-velocity update validity (quadruped).** A zero-velocity update is
valid only when all four feet are down and the body is still. A stop with a
foot moving, or with body sway, is not a zero-velocity update.

**Gravity-reading tilt.** The tilt for a gravity reading is the tilt of the
standing pose against the local vertical at the rover (2.4). The
IMU-to-gravimeter lever arm and mounting angles go through that pose (5.1,
payload lever arms).

**Heading.** Heading is the main drift term. Zero-velocity updates do not fix
it. Only these observations fix heading: the sun or star sensor, the map tie
(landmarks), or a lander revisit.

### 5.3 Tilt from gravity is weaker on the Moon (open, from PR #11 review)

At a stop, roll and pitch come from the accelerometers. The tilt error is
about (accelerometer bias) / g.
- 100 µg bias = 100e-6 x 9.81 m/s² = 9.81e-4 m/s² [derived].
- On the Moon: 9.81e-4 / 1.62 = 0.60 mrad [derived]. On Earth: 9.81e-4 /
  9.81 = 0.10 mrad [derived].
- For a 0.2 mrad tilt on the Moon [assumption, no source; old value traced to MER sun sensor 0.2 deg, not 0.2 mrad], the bias must be about 33 µg or better
  [derived from that assumption: 0.2e-3 x 1.62 / 9.81 = 3.3e-5 g].
- IMU or inclinometer bias spec: [TBD, ll-scout source note].

---

## 6. Error correlation types

Each error source gets one type. The type decides how it adds up (norm 3:
a bias is never added into a 1-sigma value).

| Type | What it means | How it adds up | Example |
|------|---------------|----------------|---------|
| **Common-mode** | The same error for every point of the traverse. | Cancels in differences between points. Shows in absolute layers only. | Map global offset (LOLA/NAC control); ME-to-PA transform uncertainty. |
| **Random walk along track** | Each step adds a small independent error; the sum grows with distance or time. | Position random walk grows with the square root of distance. **Heading** random walk gives a cross-track error that grows about as distance^1.5 [derived: heading sigma grows as sqrt(s); cross-track error is the integral of heading error over s]. Points close in time are strongly correlated. | Leg-odometry noise between two zero-velocity updates; foot slip (per step); gyro heading drift. |
| **Per-station bias** | Constant during one station or one stop, different at the next. | Same for all readings at one station; independent between stations. | Gravimeter reading offset after a new set-up at a station; attitude error at one stop. |
| **White noise** | Independent at each sample. | Averages down with more samples. | Gravimeter reading noise within one station; GPR trace time-tag jitter. |
| **Systematic, grows in proportion to separation** | A fixed error in a direction or a scale. The error between two points is proportional to their separation. | Does **not** cancel in differences. Is **not** a random walk. Error = (angle or scale error) x separation. Example: 1 mrad over 100 m gives 0.1 m [derived: 100 m x 0.001]. | Start heading bias (2.1); odometry scale error; payload boresight error (5.1). |

Note: type 5 is the error that the baseline core mixed up. Do not put it
into the common-mode or random-walk rows.

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
4. Height reference: h above a 1737.4 km sphere [sourced: lrolgcwg2008, PR #15] for all products?
5. Ephemeris version: DE440 or DE421 (and matching ME realization).
6. Time scale for time tags: UTC, TDB or a lunar time scale.
7. Platform: decided, quadruped, ANYmal-like, no jumping (D-012, PI).
   Still open: speed and sensor specs [TBD].
8. Gravity product used (magnitude, vertical or vector) [TBD, PI or payload
   team]. If it is horizontal components or the full vector: (a) heading
   error rotates signal between the east and north components, so start
   heading bias (2.1, type 5) and heading drift (random walk) enter the
   gravity budget; (b) the d / R tilt gives a first-order error, about 94 mGal
   at 1 km [derived, 2.4]. Then roll and pitch against the local vertical at
   the rover are required. See `requirements-trace.md` GRAV-A.

### 7.2 Inputs needed from ll-scout (source notes)

1. Sphere radius 1737.4 km is [sourced: lrolgcwg2008, PR #15]. ME definition still needed (IAU WGCCRE).
2. ME vs PA definitions and the ME-to-PA transform and its uncertainty, per
   ephemeris version (DE421, DE440).
3. Which ME realization the LOLA and NAC products use.
4. Mittelholz 2026: is the < 0.25 m height lead relative or absolute?
5. Lunar time scale: Bourgoin et al. (full reference missing, Benedikt's list
   stopped at "Bourgoin et a"), Ashby 2024. Rate of a lunar clock.
6. Moon sidereal rotation period (for 2.66e-6 rad/s).
7. Landing-site latitude (14.1 deg N used here, lead: figure label only, frame not stated).
8. IMU or inclinometer accelerometer bias (needed: about 33 µg or better for
   a 0.2 mrad tilt [assumption, no source; old value traced to MER sun sensor 0.2 deg, not 0.2 mrad], 5.3). The 33 µg value is derived from that assumption.
9. Synodic month length (for the 2.5e-6 rad/s Sun rate, 4.5) and lunar g
   (1.62 or 1.625 m/s² used here).
10. 0.2 mrad leveling residual [assumption, no source; old value traced to MER sun sensor 0.2 deg, not 0.2 mrad].

### 7.3 Inputs needed from ll-engineer

1. List of baseline files that define height; check against one rule.
2. Script that regenerates every [derived] number in this note (norm 5).

### 7.4 Design rule for the new core

The core returns a **sigma per observable** (with layer and error type), not
a yes/no "meets requirement" flag. The pass or fail decision is made against
the trace table, outside the core.
