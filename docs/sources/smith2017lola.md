# Results of the Lunar Orbiter Laser Altimeter after seven years in orbit (Smith et al. 2017, Icarus; accepted manuscript)

Citation key: `smith2017lola`. Original title: "Summary of the Results from the Lunar Orbiter Laser Altimeter after Seven Years in Lunar Orbit".

## Claim
The Lunar Orbiter Laser Altimeter (LOLA) defines the 'LOLA geodetic frame'. Lunar Reconnaissance Orbiter (LRO) datasets are controlled to this frame. Current LRO orbits (gravity model GRGM900C to degree 600) are good to about 10 m total position and better than 1 m radially.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- LRO orbit reconstruction ≈10 m total position, <1 m radial | orbits of the LOLA team in the Planetary Data System (PDS), with GRGM900C (degree and order 600) | LOLA geodetic frame (body-fixed realization not stated in the passage; LOLA products are in mean Earth (ME), not stated here) | approximate; from orbit overlaps and track-to-DEM corrections (DEM = digital elevation model); statistic not stated.
- Early mission: orbit overlaps better than 20 m with LOLA crossovers | Mazarico et al. 2012 orbits | not stated.
- LRO requirement 50 m orbit reconstruction | requirement.
- SLDEM2015 (full name: TBD - check; LOLA + Kaguya Terrain Camera (TC), ±60° lat, 512 pixels per degree): TC co-registration 3-4 m root mean square (RMS) elevation residuals to LOLA; '~3-4 m accuracy and ~60 m resolution' | SLDEM2015 | LOLA frame | RMS.
- GLD100 (Global Lunar DTM 100 m, DTM = digital terrain model; made from the LRO Camera (LROC) Wide Angle Camera (WAC), ±79°): ~1 km effective resolution, ~10-20 m mean vertical accuracy (Scholten et al. 2012) | GLD100 | statistic not stated.
- Highlight: 'LOLA-defined shape and reference frame enables accurate (<10m) geolocation globally' | bound.

## Height reference
Topography heights are relative to the 1737.4 km sphere of the International Astronomical Union (IAU). Mean radius from shape fit 1737.1513 ± 0.0005 km (table, product LRO_2050_SHA.TAB; statistic not stated).

## Application to a walking quadruped on the Moon (LunarLeaper)
The old repo's LOLA value '7.5 m horizontal / 0.75 m vertical' is NOT found here.
The numbers in this source are an orbit-level bound: LRO orbit accuracy, about 10 m total, <1 m radial. They are not the accuracy of a tie to a map product. A tie to a Narrow Angle Camera (NAC) product also has camera pointing error and the control error of the product. For product-level geolocation, see the NAC notes (`henriksen2016nac`, `collins2026nacmosaics`). The choice of a budget value is ll-lead's decision.

## Grade
Flight data (grade A). Reason: orbit and altimetry results from LRO.

## URL or DOI
https://doi.org/10.1016/j.icarus.2016.06.006 ; manuscript https://ntrs.nasa.gov/api/citations/20160008718/downloads/20160008718.pdf

## Date opened
2026-10-19
