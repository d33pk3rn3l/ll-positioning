# Coordinates of human-made objects on the Moon (Wagner et al. 2017, Icarus 283) and the coordinate table of the Lunar Reconnaissance Orbiter Camera team, 28 July 2016

Citation key: `wagner2017anthro`. Original title: "Coordinates of anthropogenic features on the Moon".

## Claim
The authors use many Narrow Angle Camera (NAC) images, an improved ephemeris of the Lunar Reconnaissance Orbiter (LRO) and a camera model that changes with temperature. With these, they give mean Earth (ME) coordinates of landers, rovers, payloads and impact craters to <12 m.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- All objects within 12 m (except the Apollo 16 S-IVB rocket stage, 100 m) | Wagner 2017 abstract (NASA Technical Reports Server (NTRS)) | ME | bound.
- LRO orbit uncertainty used: ±15 m | orbit files (kernels) of the Lunar Orbiter Laser Altimeter (LOLA) team, corrected with crossovers | statistic not stated.
- 'Uncertainty' column for each object (table of the LRO Camera (LROC) team, 2016): e.g. Apollo 11 Lunar Module (LM) 0.3 m, Apollo 15 LM 1.0 m, Apollo 17 LM 3.5 m, Lunokhod 1 3.8 m, Lunokhod 2 7.5 m, Chang'e 3 9.1 m, Yutu 12.9 m | mean over multiple images, GLD100 shape model (Global Lunar DTM 100 m; DTM = digital terrain model) | ME | statistic not stated (appears to be scatter of image measurements, not absolute accuracy).
- Elevations in the table, e.g. Apollo 11 LM -1926 m | GLD100 | reference not stated in table.

## Height reference
Table elevations from GLD100; datum not stated in the table.

## Application to a walking quadruped on the Moon (LunarLeaper)
Lander positions in NAC images are tied to ME at ~10 m. The LunarLeaper lander can be tied the same way. Thus a walk relative to the lander gets ~10 m absolute horizontal error. Growth type: fixed. This is the same error for every point of the walk. It does not shrink with averaging over the walk. This does not affect the gravity heights from station to station.

## Grade
Flight data (grade A). Reason: measured in LRO images.

## URL or DOI
https://doi.org/10.1016/j.icarus.2016.05.011 ; abstract https://ntrs.nasa.gov/citations/20160009148 ; table https://lroc.im-ldi.com/data/support/downloads/2016_LROC_Coordinates_of_Human_Features.pdf . Full paper text NOT opened (NTRS PDF download failed).

## Date opened
2026-10-19
