# williams2013de430: DE430 Lunar Orbit, Physical Librations, and Surface Coordinates (JPL IOM 335-JW,DB,WF-20130722-016)

## Claim
DE430 lunar orientation is integrated in the PA frame. A constant 3-angle rotation gives the mean Earth/mean rotation (MER = ME) frame. The rotation depends on the gravity field and is less accurately known than the integrated Euler angles. Retroreflector coordinates are given in both frames.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- DE430 PA-to-MER: M = Rx(-0.285") Ry(-78.580") Rz(-67.573") P | DE430, gravity field = precursor to GL0660B with C32,S32,C33 fit to LLR | DE430 PA -> DE430 MER | values; uncertainty below.
- Combined rotation size: about 103.6" ≈ 0.0288° ≈ 873 m at the surface | my computation from the three angles with the memo's 1" = 8.42 m | DE430 | derived, not in source.
- Axis displacements: PA X axis 569 m east and 662 m south of MER X; PA Z tilted 662 m toward lon 0 and 2 m toward 90° W | DE430 | PA vs MER | approximate.
- Rz rotation uncertain by 0.2" (1.7 m on the equator); Ry uncertain by <0.1" | DE430 | PA->MER | author judgement from torque-balance vs Rambaux & Williams comparison; statistic not stated (not 1-sigma).
- First-order error of the rotation formula: 0.013" or ≤0.11 m | DE430 | PA->MER | bound (estimate).
- DE421 values for comparison (Rambaux & Williams 2011): p1c = -78.513", p2c = 0.290", tau_c = 67.753", I*sigma_c = -0.249"; DE430-DE421 adjustments -0.067", -0.005", -0.183" | DE421 | PA->MER | values, statistic not stated.
- DE430-DE421 lunar position difference: up to ~1 m perpendicular to radius (~0.5 mas), radial shift ~1/4 m | DE430 vs DE421 orbit, 1970-2020 | inertial | maximum (read from figure).
- PA retroreflector coordinates "known to decimeters"; uncertain by 0.12 m to 0.27 m; would shift up to 0.5 m in latitude with an all-GRAIL field | DE430 PA | statistic not stated.
- Semimajor axis uncertainty ~0.2 m contributing to X | DE430 | statistic not stated.
- Constant tidal displacements of reflectors: 0.07 to 0.53 m radial (Table 8) | h2 = 0.0476, l2 = 0.0107 | PA/MER | model values; NOT included in Tables 6-7.
- LLR weighted rms 1.9 cm (last 4 yr of data to 2012) | DE430 fit | one-way range | RMS.
- 1" arc = 8.42 m; 1° = 30.3 km on surface (mean radius 1737.151 km, Neumann 2013) | conversion.
- IAU/IAG series for lunar orientation: position errors can exceed 100 m (Konopliv et al. 2001) | IAU series vs integrated | bound ("can exceed").

## Height reference
Cartesian XYZ and radius R from the centre of mass, in metres. Mean radius 1737.151 km quoted for arc conversion.

## Application to a walking quadruped on the Moon (LunarLeaper)
Primary source for the ME/PA offset size and for its uncertainty (about 2 m). For LunarLeaper the PA/ME rotation is known far better than any orbital map tie (10 m class), so the risk is a frame mistag (~875 m), not the rotation error.

## Grade
A (flight data). Reason: fit to 18,548 LLR ranges 1970-2012.

## URL or DOI
https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/planets/de430_moon_coord.pdf

## Date opened
2026-10-19
