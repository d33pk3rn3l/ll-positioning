# naif2025moonfk: NAIF lunar frame kernel moon_de440_250416.tf

## Claim
Defines MOON_PA_DE440 and MOON_ME_DE440_ME421 (closely aligned with the DE421 ME frame). Generic aliases MOON_PA and MOON_ME point to them. IAU_MOON is kept for backward compatibility only; the WG no longer publishes those data.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- MOON_ME_DE440_ME421 relative to MOON_PA_DE440: angles (67.8526, 78.6944, 0.2785) arcsec, axes (3,2,1) | DE440 | PA->ME | values; uncertainty not stated.
- ME-PA rotation angle ≈ 0.02886° ≈ 875 m along a great circle | DE440 | ME vs PA | approximate value.
- MOON_ME_DE421 vs MOON_ME_DE440_ME421: max 5.82e-7 rad (slightly over 1 m) over 1900-2051; max 3.07e-7 rad (≈53.4 cm) over 2000-2040 | DE421 ME vs DE440 ME421 | maximum over ~1M samples.
- IAU_MOON vs DE440-based ME, 2000-2040: amplitude ≈0.0051° (≈155 m), mean ≈0.00239° (≈72 m) | IAU/IAG series vs DE440 ME | amplitude / average.

## Height reference
Not applicable (frame orientation only).

## Application to a walking quadruped on the Moon (LunarLeaper)
Source for the ~875 m ME/PA fault size and for the ~0.5 m DE421-vs-DE440 ME difference (old repo used 0.6 m: close but not the stated value; NAIF states 53.4 cm max for 2000-2040). Also shows that IAU_MOON is off by up to ~155 m: do not use it for map ties.

## Grade
C (computed comparison of ephemeris models). Reason: numbers are NAIF model-to-model comparisons, the inputs are flight-derived.

## URL or DOI
https://naif.jpl.nasa.gov/pub/naif/pds/wgc/kernels/fk/moon_de440_250416.tf (also generic_kernels/fk/satellites/)

## Date opened
2026-10-19
