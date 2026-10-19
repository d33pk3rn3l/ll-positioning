# wagner2021pits: LROC catalog of lunar pits with positions and sizes, Marius Hills pit entry, and the matching LROC terrain model page (Wagner, Robinson and the LROC Team, Catalog of Lunar Pits Version 1, 2021; cite as Wagner & Robinson 2021, Lunar and Planetary Science Conference 52, abstract 2530)

## Claim
Lunar Reconnaissance Orbiter Camera (LROC) catalog of lunar pits with coordinates from multiple Narrow Angle Camera (NAC) images, dimensions and depth. Gives the Marius Hills Pit (MHP) entry.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- MHP: "Latitude 14.0917°N", "Longitude 303.2299°E" | LROC pit catalog | frame: mean Earth, inferred (not sourced). The catalog does not state the frame. I infer the Mean Earth/polar axis frame (ME) because lrolgcwg2008 sets it for LROC products; this is not a quote | see next line.
- Coordinate accuracy: "Coordinates are estimated from multiple NAC images, and are usually accurate to within 30 m (see Wagner et al. 2017 ...)"; "should be more accurate than the ~31 m uncertainty of an arbitrary NAC image" | catalog | bound (author statement).
- Location reference: "NAC M155607349R line 32437, sample 723", given "to ensure unambiguous identification of each pit regardless of any future updates to the LROC ephemeris or changes to the lunar reference frame".
- MHP size: inner pit "55 m × 49 m", funnel "92 m × 79 m", long-axis azimuth 65°, depth "40 m" ("Depth is determined from stereo modelling"); "Funnel is ~10 m deep"; overhang "Yes" | catalog.
- MARIUSPIT01 digital terrain model (DTM) page: "Center Lat 14.22 Center Lon 303.23", "Pixel Scale 4 m/px", "Relative LE 3.43", "LOLA_RMS 1.42", "Number of Profiles 15", project date 2020-10-26 | NAC DTM | tied to Lunar Orbiter Laser Altimeter (LOLA) | units of linear error (LE) and LOLA_RMS not printed on the page (likely m); LE confidence level not stated on the page.
- Mittelholz 2026 label "14.1° N, 303.2° E" equals the Haruyama 2009 / Robinson 2012 rounded value (see ashley2011pits).

## Height reference
DTM tied to LOLA (per Henriksen 2016 method, cited on the page); datum not stated on the page.

## Application to a walking quadruped on the Moon (LunarLeaper)
Best primary MHP coordinates found: 14.0917° N, 303.2299° E, ~30 m bound, frame: mean Earth, inferred (not sourced). The DTM label (.PDS label file (LBL)) with the explicit frame and datum was not opened (Planetary Data System (PDS) node is a JavaScript app). Use the NAC image line/sample as the frame-independent anchor.

## Grade
A (flight data, LROC NAC measurements).

## URL or DOI
https://lroc.im-ldi.com/atlases/pits/lroc_pits_atlas.pdf ; list https://lroc.im-ldi.com/atlases/pits/list ; DTM https://data.lroc.im-ldi.com/lroc/view_rdr/NAC_DTM_MARIUSPIT01 ; abstract https://www.hou.usra.edu/meetings/lpsc2021/pdf/2530.pdf (not opened)

## Date opened
2026-10-19
