# fienga2024lunarframes: Lunar Reference Systems, Frames and Time-scales in the context of the ESA Programme Moonlight (Fienga, Rambaux & Sośnica 2024, arXiv:2409.10043v1)

## Claim
Review of LCRS/LRS definitions and realizations with DE and INPOP ephemerides. Gives ME/PA offset angles, LLR reflector position differences between ephemerides, and TCL-TT rates.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- PA->ME offset angles (p1c, p2c, tau_c): DE421 -78.513", 0.290", -67.753"; DE440 -78.694", 0.278", -67.853"; INPOP19a (preliminary) -78.594", 0.290", -67.930" | Table 1 | PA vs ME | values, uncertainty not stated.
- ME vs PA offset of a surface point: "approximately 860 meters", depends on ephemeris and gravity field | approximate.
- IAU series (stopped by WGCCRE 2015): "less accurate (< 150 m)" than numerical ephemeris | bound.
- Max differences of LLR reflector positions: INPOP21a-DE440 0.84-1.03 m; INPOP21a-DE421 1.16-1.60 m; EPM-INPOP17a 1.9-2.3 m | Table 2 | PA frames of each ephemeris | maximum.
- Formal reflector position uncertainty ~3 cm (INPOP), 40 cm (DE) - 'internal precision'; external accuracy ~2 m (EPM vs DE/INPOP), ~1 m (INPOP vs DE440) | stated as uncertainties, type not stated.
- Reflector coordinate drift 8.3 ± 3.1 mm/yr (four reflectors, cited) | weighted average.
- Link of LRO DTM to LLR frame: max differences ~10 m (NAC/LOLA vs DE421), limited by LRO orbit overlap accuracy | maximum.
- TCL-TT: secular drift ~58.7 µs/day, periodic 0.6 µs at 27.8 d; clock at rest on surface adds ~-2.7 µs/day (3.141e-11) | model. 58.7 - 2.7 ≈ 56 µs/day is my arithmetic; the paper does not print 56.
- DE430: not discussed (0 mentions).

## Height reference
Not stated (positions in Cartesian PA).

## Application to a walking quadruped on the Moon (LunarLeaper)
Gives the ephemeris realization spread for ME/PA (about 1-2 m at reflectors) and the 10 m limit of the LRO-to-LLR tie. For LunarLeaper the frame realization error is small compared to the ~10 m map tie.

## Attribution warning
Benedikt's list gives this as "Bourgoin et al. (2024), Lunar Reference Systems, Frames and Time-scales in the context of the IAU Resolutions". The arXiv record 2409.10043 is by Fienga, Rambaux & Sośnica, and the title ends "in the context of the ESA Programme Moonlight". Author and title on the list are wrong.

## Grade
C (model/comparison of ephemerides from flight LLR data).

## URL or DOI
https://arxiv.org/abs/2409.10043

## Date opened
2026-10-19
