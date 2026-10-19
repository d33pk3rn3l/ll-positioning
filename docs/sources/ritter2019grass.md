# ritter2019grass: Concept of the GRASS gravimeter for asteroids and small moons (Ritter et al., EPSC-DPS Joint Meeting 2019, abstract 1663-2)

## Claim
GRAvimeter for small Solar System bodies (GRASS) is a two-axis spring gravimeter with capacitive readout. Rotation of each sensor head modulates the gravity signal, rejects the zero-g bias, and removes the need for levelling. Two orthogonal axes give the full gravity vector.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- "can measure absolute surface accelerations in the order of nano-g" | design goal | n/a | not stated.
- Axes: "two axes oriented orthogonally to each other, allowing the reconstruction of the full gravity vector" | design | instrument frame | n/a.
- Levelling: "no leveling is required" | design | n/a | n/a.
- Spring: length "60 to 100 mm", width "15 mm", thickness "between 0.1 and 0.3 mm" | design | n/a | n/a.
- Power: "in the order of 150 mW" | design | n/a | n/a.
- Technology readiness level (TRL) "currently raised from 3 to 4" (2019).
- Operations: "slow rotation of the cylindrical sensor head with several consecutive measurements"; on a rover "inhomogeneities ... can be tracked along the rover trajectory" | concept | n/a | n/a.
- Noise per reading, integration time, attitude knowledge spec: not stated.

## Height reference
Not applicable.

## Application to a walking quadruped on the Moon (LunarLeaper)
GRASS outputs a vector in the instrument frame, not a levelled scalar. To get the vertical component (or the vector in the local frame) the robot attitude at the reading is needed. No attitude spec is given. The design is for ~4.5 mGal (asteroid) gravity; lunar use needs a stiffer spring (see noeker2025grassspring).

## Grade
C (design concept, conference abstract).

## URL or DOI
https://meetingorganizer.copernicus.org/EPSC-DPS2019/EPSC-DPS2019-1663-2.pdf

## Date opened
2026-10-19
