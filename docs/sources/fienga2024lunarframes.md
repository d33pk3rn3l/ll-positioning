# Lunar reference systems, frames and time scales for the ESA Moonlight programme (Fienga, Rambaux & Sośnica 2024, arXiv:2409.10043v1)

Citation key: `fienga2024lunarframes`. Original title: "Lunar Reference Systems, Frames and Time-scales in the context of the ESA Programme Moonlight". ESA = European Space Agency.

## Claim
Review of the definitions and realizations of the Lunar Celestial Reference System (LCRS) and the Lunar Reference System (LRS). It uses the ephemerides DE (Development Ephemeris, Jet Propulsion Laboratory) and INPOP (Intégration Numérique Planétaire de l'Observatoire de Paris). It gives mean Earth / principal axis (ME/PA) offset angles. It gives the differences of lunar laser ranging (LLR) reflector positions between ephemerides. It gives the rates of Lunar Coordinate Time (TCL) minus Terrestrial Time (TT).

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- PA->ME offset angles (p1c, p2c, tau_c): DE421 -78.513", 0.290", -67.753"; DE440 -78.694", 0.278", -67.853"; INPOP19a (preliminary) -78.594", 0.290", -67.930" | Table 1 | PA vs ME | values, uncertainty not stated.
- ME vs PA offset of a surface point: "approximately 860 meters", depends on ephemeris and gravity field | approximate.
- Series of the International Astronomical Union (IAU) (stopped by the IAU cartographic working group in 2015): "less accurate (< 150 m)" than numerical ephemeris | bound.
- Max differences of LLR reflector positions: INPOP21a-DE440 0.84-1.03 m; INPOP21a-DE421 1.16-1.60 m; EPM (Ephemerides of Planets and the Moon) vs INPOP17a 1.9-2.3 m | Table 2 | PA frames of each ephemeris | maximum.
- Formal reflector position uncertainty ~3 cm (INPOP), 40 cm (DE) - 'internal precision'; external accuracy ~2 m (EPM vs DE/INPOP), ~1 m (INPOP vs DE440) | stated as uncertainties, type not stated.
- Reflector coordinate drift 8.3 ± 3.1 mm/yr (four reflectors, cited) | weighted average.
- Link of the Lunar Reconnaissance Orbiter (LRO) digital terrain model (DTM) to the LLR frame: max differences ~10 m (Narrow Angle Camera (NAC) and Lunar Orbiter Laser Altimeter (LOLA) vs DE421), limited by LRO orbit overlap accuracy | maximum.
- TCL-TT: secular drift ~58.7 µs/day, periodic 0.6 µs at 27.8 d; clock at rest on surface adds ~-2.7 µs/day (3.141e-11) | model. 58.7 - 2.7 ≈ 56 µs/day is my arithmetic; the paper does not print 56.
- DE430: not discussed (0 mentions).

## Height reference
Not stated (positions in Cartesian PA).

## Application to a walking quadruped on the Moon (LunarLeaper)
Gives the spread of ME/PA between ephemeris realizations (about 1-2 m at the reflectors). Gives the 10 m limit of the tie from LRO to LLR. For LunarLeaper the frame realization error is small compared to the ~10 m map tie.

## Attribution warning
Benedikt's list gives this as "Bourgoin et al. (2024), Lunar Reference Systems, Frames and Time-scales in the context of the IAU Resolutions". The arXiv record 2409.10043 is by Fienga, Rambaux & Sośnica. The title ends "in the context of the ESA Programme Moonlight". Author and title on the list are wrong.

## Grade
Model (grade C). Reason: comparison of ephemeris models made from flight LLR data.

## URL or DOI
https://arxiv.org/abs/2409.10043

## Date opened
2026-10-19
