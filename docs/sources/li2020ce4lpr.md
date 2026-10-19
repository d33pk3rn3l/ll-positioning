# Shallow subsurface of the lunar farside seen by the Chang'E-4 Lunar Penetrating Radar (Li et al. 2020, Science Advances 6:eaay6898)

Citation key: `li2020ce4lpr`. Original title: "The Moon's farside shallow subsurface structure unveiled by Chang'E-4 Lunar Penetrating Radar".

## Claim
The Lunar Penetrating Radar (LPR) at 500 MHz on the Yutu-2 rover imaged to ~40 m depth along a ~106 m route. It found low-loss granular ejecta with boulders.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- Frequencies: 60 MHz (band 40-80 MHz) and 500 MHz (band 250-750 MHz) | Chang'E-4 (CE-4) LPR | not applicable.
- Trace interval 0.6636 s (500 MHz), 1.536 s (60 MHz); rover ~5.5 cm/s -> approximate step ~3.6 cm (500 MHz), ~8.5 cm (60 MHz) | flight | approximate.
- Route used ~106 m (point A to point LE210); 13,400 (low) and 31,749 (high) traces over the first two lunar days | flight.
- Antennas ~0.3 m above ground, 0.16 m apart | design.
- Wave velocity v = 0.16 m/ns (from hyperbola fit, constant below ~70 ns) | assumption below that depth.
- Loss tangent (5 ± 2) x 10^-3 | uncertainty type not stated.
- Lander 45.4446°S, 177.5991°E | frame not stated.
- How each trace was positioned (and its accuracy): not stated. Trace spacing is inferred from mean rover speed.
- Derived (Chang'E-4 site, not Marius Hills): relative permittivity of the ground from the wave speed: (speed of light / wave speed)^2 = (0.2998 m/ns / 0.16 m/ns)^2 = 1.874^2 = 3.51 (about 3.5). Not in source.
- Derived (Chang'E-4 site, not Marius Hills): wavelength in the ground at 100 MHz = wave speed / frequency = 0.16 m/ns / 0.1 per ns = 1.6 m; a quarter of it is 0.4 m. Not in source.

## Height reference
Depth from two-way time; no geodetic height reference.

## Application to a walking quadruped on the Moon (LunarLeaper)
Flight reference for ground-penetrating radar (GPR): trace step ~3.6 cm from time-triggered sampling and mean speed. LunarLeaper plans 10 cm. A walking robot moves with stops and starts. Thus time-triggered traces would be uneven. The position of each trace must come from navigation.

## Grade
Flight data (grade A).

## URL or DOI
https://doi.org/10.1126/sciadv.aay6898 (full text via Europe PMC PMC7043921)

## Date opened
2026-10-19
