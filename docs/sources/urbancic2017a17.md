# Density below the surface of the Taurus-Littrow Valley from Apollo 17 gravity data (Urbancic et al. 2017, Journal of Geophysical Research: Planets 122)

Citation key: `urbancic2017a17`. Original title: "Subsurface density structure of Taurus-Littrow Valley using Apollo 17 gravity data".

## Claim
A new analysis of the Apollo 17 Traverse Gravimeter Experiment (TGE). It uses a digital terrain model (DTM) from the Narrow Angle Camera (NAC) of the Lunar Reconnaissance Orbiter Camera (LROC), and 3-D terrain corrections.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
Access note: the Wiley full text was blocked (Cloudflare challenge, fetch timeout). The numbers below come from the text of the Wiley article page that web search returned (methods paragraph and Table 1). Treat them as verified text excerpts. I did not read the full paper.
- Station georeferencing: ±5 m, by aligning hand-drawn maps to NAC images (~0.5 m/pixel) -> error in gravity corrections and modelling < 0.25 mGal | NAC images | frame not stated | statistic not stated.
- NAC DTM: 2 m horizontal resolution, 2.05 m vertical error | LROC NAC DTM (Oberst et al. 2010) | frame not stated | statistic not stated.
- Elevations of Talwani 1973 (labelled T73 in this note): 500 m horizontal resolution | Talwani 1973 | not applicable.
- TGE instrumental uncertainty ~1.8 mGal | T73 | statistic not stated here (the Apollo 17 Preliminary Science Report describes 1.8 mGal as a root mean square (rms) value - search snippet only).
- Station elevation differences up to 207 m (station 2 vs station 9) | NAC DTM | relative to station 9.
- 0.035 mGal sensor value: NOT in this paper.
- Derived: the camera terrain model height error of 2.05 m (line above) is 2.05 / 0.25 = 8.2, about 8 times the 0.25 m LunarLeaper target (`mittelholz2026ll`). So the map alone cannot give the station heights. Not in source.

## Height reference
Elevations relative to station 9 (NAC DTM).

## Application to a walking quadruped on the Moon (LunarLeaper)
The only lunar surface gravity traverse. Error of station placement (±5 m) and DTM height error were kept at the <0.25 mGal level. That is about 5x worse than the 0.05 mGal free-air target of LunarLeaper.

## Grade
Flight data (grade A), processed again.

## URL or DOI
https://doi.org/10.1002/2017JE005296 ; abstract 1790 of the Lunar and Planetary Science Conference (LPSC) 2016: https://ntrs.nasa.gov/citations/20160005861 (opened)

## Date opened
2026-10-19
