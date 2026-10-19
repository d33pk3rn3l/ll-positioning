# wagner2017anthro: Coordinates of anthropogenic features on the Moon (Wagner et al. 2017, Icarus 283) and LROC table of 28 July 2016

## Claim
Multiple NAC images, an improved LRO ephemeris and a temperature-dependent camera model give ME coordinates of landers, rovers, payloads and impact craters to <12 m.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- All objects within 12 m (except Apollo 16 S-IVB, 100 m) | Wagner 2017 abstract (NTRS) | ME | bound.
- LRO orbit uncertainty used: ±15 m | LOLA-team crossover-corrected kernels | statistic not stated.
- Per-object 'Uncertainty' column (LROC table, 2016): e.g. Apollo 11 LM 0.3 m, Apollo 15 LM 1.0 m, Apollo 17 LM 3.5 m, Lunokhod 1 3.8 m, Lunokhod 2 7.5 m, Chang'e 3 9.1 m, Yutu 12.9 m | mean over multiple images, GLD100 shape model | ME | statistic not stated (appears to be scatter of image measurements, not absolute accuracy).
- Elevations in the table, e.g. Apollo 11 LM -1926 m | GLD100 | reference not stated in table.

## Height reference
Table elevations from GLD100; datum not stated in the table.

## Application to a walking quadruped on the Moon (LunarLeaper)
Lander positions in NAC images are tied to ME at ~10 m. The LunarLeaper lander can be tied the same way, so a lander-relative walk inherits ~10 m absolute horizontal error; this does not affect station-to-station gravity heights.

## Grade
A (flight data). Reason: measured in LRO images.

## URL or DOI
https://doi.org/10.1016/j.icarus.2016.05.011 ; abstract https://ntrs.nasa.gov/citations/20160009148 ; table https://lroc.im-ldi.com/data/support/downloads/2016_LROC_Coordinates_of_Human_Features.pdf . Full paper text NOT opened (NTRS PDF download failed).

## Date opened
2026-10-19
