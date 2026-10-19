# Lunar orbit, physical librations and surface coordinates in the DE430 ephemeris (Williams, Boggs & Folkner 2013, Jet Propulsion Laboratory memorandum)

Citation key: `williams2013de430`. Original title: "DE430 Lunar Orbit, Physical Librations, and Surface Coordinates". Jet Propulsion Laboratory (JPL) Interoffice Memorandum (IOM) 335-JW,DB,WF-20130722-016. DE430 is a JPL Development Ephemeris (DE) of the planets and the Moon.

## Claim
DE430 integrates the lunar orientation in the principal axis (PA) frame. A constant rotation with 3 angles gives the mean Earth / mean rotation (MER) frame. In this memo, MER is the same as the mean Earth (ME) frame. The rotation depends on the gravity field. It is known less accurately than the integrated Euler angles. The memo gives the retroreflector coordinates in both frames.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- DE430 PA-to-MER: M = Rx(-0.285") Ry(-78.580") Rz(-67.573") P | DE430, gravity field = precursor to GL0660B with C32,S32,C33 fit to lunar laser ranging (LLR) | DE430 PA -> DE430 MER | values; uncertainty below.
- Combined rotation size: about 103.6" ≈ 0.0288° ≈ 873 m at the surface | my computation from the three angles with the memo's 1" = 8.42 m | DE430 | derived, not in source.
- Axis displacements: PA X axis 569 m east and 662 m south of MER X; PA Z tilted 662 m toward lon 0 and 2 m toward 90° W | DE430 | PA vs MER | approximate.
- Rz rotation uncertain by 0.2" (1.7 m on the equator); Ry uncertain by <0.1" | DE430 | PA->MER | author judgement from torque-balance vs Rambaux & Williams comparison; statistic not stated (not 1-sigma).
  Label: "[sourced: williams2013de430, author judgement for DE430; assumed to apply to DE440 PA to DE421 ME]".
  Scope: the 1.7 m belongs to the DE430 PA-to-ME rotation only. No source that I opened states an uncertainty for the DE440 PA to DE421-aligned ME rotation (see `park2021de440` and `naif2025moonfk`). Use of the 1.7 m for that rotation is an assumption. It is a transfer between two realizations.
- First-order error of the rotation formula: 0.013" or ≤0.11 m | DE430 | PA->MER | bound (estimate).
- DE421 values for comparison (Rambaux & Williams 2011): p1c = -78.513", p2c = 0.290", tau_c = 67.753", I*sigma_c = -0.249"; DE430-DE421 adjustments -0.067", -0.005", -0.183" | DE421 | PA->MER | values, statistic not stated.
- DE430-DE421 lunar position difference: up to ~1 m perpendicular to radius (~0.5 mas, milliarcseconds), radial shift ~1/4 m | DE430 vs DE421 orbit, 1970-2020 | inertial | maximum (read from figure).
- PA retroreflector coordinates "known to decimeters"; uncertain by 0.12 m to 0.27 m; would shift up to 0.5 m in latitude with a gravity field made only from Gravity Recovery and Interior Laboratory (GRAIL) data | DE430 PA | statistic not stated.
- Semimajor axis uncertainty ~0.2 m contributing to X | DE430 | statistic not stated.
- Constant tidal displacements of reflectors: 0.07 to 0.53 m radial (Table 8) | Love number h2 = 0.0476, Shida number l2 = 0.0107 | PA/MER | model values; NOT included in Tables 6-7.
- LLR weighted root mean square (RMS) 1.9 cm (last 4 yr of data to 2012) | DE430 fit | one-way range | RMS.
- 1" arc = 8.42 m; 1° = 30.3 km on surface (mean radius 1737.151 km, Neumann 2013) | conversion.
- Orientation series of the International Astronomical Union (IAU) and International Association of Geodesy (IAG): position errors can exceed 100 m (Konopliv et al. 2001) | IAU series vs integrated | bound ("can exceed").

## Height reference
Cartesian XYZ and radius R from the centre of mass, in metres. The memo uses mean radius 1737.151 km to convert arc to distance.

## Application to a walking quadruped on the Moon (LunarLeaper)
Primary source for the size of the ME/PA offset. It is also the source for the uncertainty of the DE430 rotation (about 2 m). Use for DE440 PA to DE421-aligned ME carries the label above. For LunarLeaper the ME/PA rotation is known much better than any tie to an orbital map (10 m class). Thus the risk is a wrong frame tag (~875 m), not the rotation error.

## Grade
Flight data (grade A). Reason: fit to 18,548 LLR ranges, 1970-2012.

## URL or DOI
https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/planets/de430_moon_coord.pdf

## Date opened
2026-10-19
